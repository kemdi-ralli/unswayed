# Backend: Fix Google Authentication 500 Error and Harden Social Login

The **applicant** (and optionally employer) **Google sign-in** results in **HTTP 500** from the backend. A 500 means the server threw an unhandled exception or returned 500 explicitly. Below is a blunt analysis of what the frontend sends and what the backend must do to fix and maximize success.

---

## Blunt analysis: what’s going wrong

### What the frontend sends

- **Method:** `POST`
- **Path:** `/api/applicant/social-login` (applicant); `/api/employer/social-login` (employer)
- **Content-Type:** `multipart/form-data`
- **Body (FormData):**
  - `provider` = `"google"`
  - `accessToken` = string (see below)

The frontend does **not** send JSON. It sends FormData with two fields.

### What “accessToken” actually contains

The frontend uses Firebase Auth with Google. The value sent as `accessToken` is the **first available** of:

1. `result.user.accessToken` (often **undefined** in browser for Google)
2. `result._tokenResponse.oauthIdToken` → **Google ID token (JWT)**
3. `credential.accessToken` → OAuth2 access token (for Google APIs)
4. `credential.idToken` → **Google ID token (JWT)**

So in practice the backend often receives either:

- **Google ID token (JWT)** – use this to verify the user with Google (recommended), or  
- **OAuth2 access token** – use this to call `https://www.googleapis.com/oauth2/v2/userinfo` (or v3 userinfo) to get profile.

If the backend assumes one type but receives the other, or fails to parse the token, it can throw and return **500**.

### Why you get 500 (typical causes)

1. **Token type mismatch** – Backend expects ID token but receives access token (or vice versa), then decode/verify fails and the exception is not caught → 500.
2. **Verification failure** – Calling Google’s token verification with wrong token type, wrong audience, or wrong env (e.g. wrong `GOOGLE_CLIENT_ID`) → exception → 500.
3. **FormData not parsed** – Backend expects JSON and never reads FormData, so `provider`/`accessToken` are null/undefined; later code throws when using them → 500.
4. **Missing or wrong env** – e.g. `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` (if used), or API base URL missing/wrong → exception → 500.
5. **DB or downstream error** – e.g. creating/finding user fails, and the error is not caught → 500.
6. **No global error handler** – Any uncaught exception in the social-login route becomes 500 with no structured body.

Until the backend handles these cases and returns 4xx + message instead of 500, the frontend will keep seeing “Request failed with status code 500”.

---

## What the backend must do (to fix 500 and maximize success)

### 1. Accept the request body correctly

- **Accept `multipart/form-data`** (and optionally `application/json`).
- Read **`provider`** and **`accessToken`** from the request body (form fields or JSON).
- If `provider` or `accessToken` is missing/empty, return **422** with a clear `message` (e.g. `"Missing provider or accessToken"`). Do **not** throw; do **not** return 500.

### 2. Support both Google ID token and access token

The value in `accessToken` may be:

- **ID token (JWT)** – typical when using Firebase. Verify with Google’s token verification (e.g. Google Auth Library `verifyIdToken` with your `GOOGLE_CLIENT_ID` as audience). From the decoded JWT you get `sub`, `email`, `name`, etc.
- **OAuth2 access token** – call Google’s userinfo endpoint, e.g. `GET https://www.googleapis.com/oauth2/v2/userinfo` with `Authorization: Bearer <accessToken>`, and use the response to identify the user.

Recommended approach:

1. Try to treat `accessToken` as an **ID token** first (e.g. decode as JWT and verify with Google).
2. If that fails (e.g. wrong format or verification error), try using it as an **access token** and call the userinfo endpoint.
3. If both fail, return **401** or **422** with a message like `"Invalid or expired Google token"` — **never 500**.

### 3. Never return 500 for invalid/missing token

- Invalid token → **401** or **422** and `message` (e.g. `"Invalid or expired Google token"`).
- Missing `provider` or `accessToken` → **422** and `message`.
- Do not let token verification or userinfo failures bubble up as unhandled exceptions. Catch, log, and return 4xx.

### 4. Handle downstream errors without 500

- If “find or create user” fails (DB error, duplicate key, etc.), catch the error, log it, and return a proper status (e.g. **409** for conflict, **500** only for unexpected server errors) with a **safe, generic message** to the client (no stack traces or internal details).

### 5. Environment and configuration

- Ensure **Google OAuth client ID** (and secret if used) is set and matches the client used by the frontend (e.g. Firebase project’s OAuth client).
- For ID token verification, use the correct **audience** (client ID or Firebase project).
- If the backend uses a server-side Google client, ensure it’s configured for the same OAuth client as the frontend.

### 6. Response shape on success

Return **200** (or 201) with a body the frontend expects, e.g.:

```json
{
  "status": "success",
  "message": "Logged in successfully",
  "data": {
    "token": "<jwt_or_session_token>",
    "user": { "id", "email", "name", "type", "ucn", ... },
    "is_completed": true
  }
}
```

The frontend uses `response.data.data` and expects `token`, `user`, `is_completed`. If your backend returns a different shape, the frontend may break; keep this contract or document the change.

### 7. Optional: accept JSON as well

To avoid FormData parsing issues, you can also accept **JSON**:

- **Content-Type:** `application/json`
- **Body:** `{ "provider": "google", "accessToken": "<token>" }`

Then the backend can read `provider` and `accessToken` from the JSON body. The frontend can be updated to send JSON if you prefer that.

---

## Checklist for backend

- [ ] Read `provider` and `accessToken` from FormData (and optionally JSON).
- [ ] Return 422 when `provider` or `accessToken` is missing.
- [ ] Support Google **ID token**: verify with Google (e.g. `verifyIdToken`) and get user identity.
- [ ] Support Google **access token** as fallback: call userinfo endpoint and get user identity.
- [ ] On invalid/expired token → 401/422 + message; **never 500**.
- [ ] Catch all exceptions in the social-login route; log internally; return 4xx (or 5xx only for unexpected server failures) with a safe client message.
- [ ] Verify env: correct Google client ID (and audience) for your frontend/Firebase.
- [ ] On success, return the expected shape: `data.token`, `data.user`, `data.is_completed`.

---

## Summary

| Issue | Backend action |
|-------|----------------|
| 500 on Google login | Catch all errors in social-login; return 4xx for invalid/missing token; 500 only for unexpected server errors. |
| Token type | Accept both ID token (verify with Google) and access token (userinfo). |
| Body format | Parse FormData (`provider`, `accessToken`); optionally accept JSON. |
| Response | Success: 200 + `data.token`, `data.user`, `data.is_completed`. Error: 4xx + `message`. |

Implementing the above should eliminate the 500 on Google sign-in and make social login robust.
