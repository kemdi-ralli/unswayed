# Backend implementation: Fix Google "kid" invalid (use this in your backend repo/tab)

Use this in the **backend** codebase (the API that serves `https://unswayed.onrender.com/api/`). The frontend in this repo only calls that API; the fix is entirely on the backend.

---

## Error to fix

- **Symptom:** After user selects Google account, frontend gets **500**.
- **Backend error:** `"kid" invalid, unable to lookup correct key`
- **Meaning:** When verifying the Google ID token (JWT), the backend cannot find the public key for the `kid` (key ID) in the token header. Fix by using **Google’s current JWKS** and resolving the key by `kid` correctly.

---

## 1. Find the social-login handler

Locate the code that handles:

- `POST /api/applicant/social-login`
- (and if applicable) `POST /api/employer/social-login`

when `provider=google` and `accessToken=<JWT>`. The code that **verifies** the Google token (JWT) is where the "kid" lookup happens. That is what you will change.

---

## 2. Recommended approach: use Google’s official verification

The most reliable fix is to **verify the Google ID token with Google’s own client/library**, which fetches and caches JWKS from `https://www.googleapis.com/oauth2/v3/certs` and resolves `kid` for you.

### If backend is **Node.js** (Express, etc.)

1. Install Google Auth Library:
   ```bash
   npm install google-auth-library
   ```

2. In the social-login handler, verify the ID token like this (no manual JWKS or `kid` handling):

   ```js
   const { OAuth2Client } = require('google-auth-library');

   const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

   async function verifyGoogleIdToken(idToken) {
     const ticket = await client.verifyIdToken({
       idToken,
       audience: process.env.GOOGLE_CLIENT_ID, // or multiple client IDs if you have web + mobile
     });
     return ticket.getPayload(); // { sub, email, name, picture, ... }
   }
   ```

3. In your route:
   - Read `provider` and `accessToken` from the request (FormData or JSON).
   - If `provider === 'google'`, call `verifyGoogleIdToken(accessToken)`.
   - On success: use payload `sub`/`email` to find or create user and return your normal 2xx + token/user.
   - On failure (e.g. `Error` from `verifyIdToken`): **catch** the error, **log** it, and return **401** or **422** with a message like `"Invalid or expired Google token"`. Do **not** let it become 500.

4. **Env:** Set `GOOGLE_CLIENT_ID` to the **same** Google OAuth 2.0 Client ID used by your frontend (Firebase/Google sign-in). Wrong audience causes verification to fail.

### If backend is **Laravel (PHP)**

1. Use Google’s official library so it handles JWKS and `kid` for you:
   ```bash
   composer require google/apiclient
   ```
   Or use a JWT library that fetches JWKS from Google and supports `kid` (e.g. **firebase/php-jwt** with **web-token/jwt-framework** or a JWKS fetcher). Prefer **Google API Client** if you can.

2. **Option A – Google API Client (recommended):**
   - Use Google’s PHP client to verify the ID token (it fetches certs from Google and resolves `kid`). Example pattern:
     - Decode the JWT to get the header (to confirm it’s a JWT).
     - Use the client’s token verification that uses `https://www.googleapis.com/oauth2/v3/certs` under the hood (e.g. `Google_Client::verifyIdToken()` or equivalent in your package version).
   - Audience must be your `GOOGLE_CLIENT_ID` (same as frontend).

3. **Option B – firebase/php-jWT with JWKS:**
   - If you must keep using **firebase/php-jwt**, the "kid invalid" error usually means the key set is stale or not fetched from Google.
   - **Do not** use a single static key. Fetch JWKS from:
     - `https://www.googleapis.com/oauth2/v3/certs`
   - Resolve the key by the JWT header’s `kid`. Use a JWKS helper or a small cache that:
     - Fetches the JSON from that URL,
     - Finds the key with `kid` matching the token header,
     - Converts to PEM/format your JWT library expects,
     - Caches with a short TTL (e.g. 1 hour) or refreshes when you get "kid not found".
   - Verify the JWT with that key and validate `aud` and `iss` for Google.

4. In the controller:
   - Catch any exception from token verification.
   - Return **422** or **401** with message `"Invalid or expired Google token"`; never 500 for invalid/missing token.

---

## 3. If you use a custom JWT library (any language)

- **JWKS URL:** `https://www.googleapis.com/oauth2/v3/certs`
- **Key lookup:** Use the `kid` from the JWT **header** to select the key from the JWKS set. Do not assume a single key or an old cached set.
- **Refresh:** When you get "unable to lookup correct key" or "kid invalid", refresh the JWKS from the URL above and retry once (Google rotates keys). Consider caching with a short TTL (e.g. 1 hour).
- **Validation:** After signature verification, validate `aud` (your `GOOGLE_CLIENT_ID`) and `iss` (e.g. `https://accounts.google.com` or `accounts.google.com`).

---

## 4. Ensure frontend sends the ID token (optional check)

The frontend currently sends one of: `credential.idToken`, `result._tokenResponse.oauthIdToken`, or fallbacks. For Google, that should be the **ID token (JWT)**. If the backend expects only ID token, no change is required on the frontend; the fix is backend verification using current JWKS and correct audience.

---

## 5. Checklist

- [ ] Social-login handler uses Google’s current JWKS (official library or JWKS from `https://www.googleapis.com/oauth2/v3/certs`) and resolves key by `kid`.
- [ ] `GOOGLE_CLIENT_ID` env is set and matches the frontend Google/Firebase client ID.
- [ ] Token verification errors are caught and return **401/422** with a generic message, not **500**.
- [ ] Email/password and other auth flows are unchanged.

After deploying, Google sign-in after account selection should return **2xx** and log the user in; no more "kid invalid" 500.
