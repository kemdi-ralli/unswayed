# Backend prompt: Fix Google social login "kid" verification error (500)

## Context

Users see a **500** and login fails when they complete Google sign-in (after selecting their Google account). The frontend receives this error from the backend when calling the social-login endpoint.

## Observed error (from backend response / logs)

- **Message seen by user:** `Request failed with status code 500`
- **Backend error (likely in logs or response body):** `"kid" invalid, unable to lookup correct key`

This indicates a **JWT verification failure** during Google token verification: the backend cannot find the correct key for the `kid` (key ID) present in the token header.

---

## Request to backend team

**Fix Google social login token verification so that the "kid" lookup succeeds and the endpoint returns 2xx instead of 500. Do not change email/password login, employer flows, or other auth providers (e.g. Apple) unless they share the same verification code and are broken.**

### 1. Scope

- **In scope:** The endpoint that handles **applicant Google social login** (e.g. `POST /applicant/social-login` or equivalent) when the body contains `provider=google` and `accessToken=<token>`.
- **Out of scope:** Do not alter email/password login, employer login, or other providers unless they use the same Google token verification and are failing for the same reason.

### 2. What the frontend sends

- **Method:** `POST`
- **Body (form):** `provider=google`, `accessToken=<token>`
- **Token:** For Google, the frontend sends one of: Firebase/Google ID token (`idToken`) or OAuth ID token (`oauthIdToken`). It is a **JWT** (three base64 parts, header contains `alg` and `kid`). The backend must **verify this JWT** using Google’s public keys (JWKS).

### 3. Root cause to address

The error **"kid" invalid, unable to lookup correct key** means:

- The JWT header contains a `kid` (key ID).
- The backend’s verifier (e.g. JWKS client or similar) cannot find a matching key for that `kid`, so verification fails and the backend returns 500.

Common causes:

1. **Stale or wrong JWKS:** Using a cached or hardcoded set of Google keys that doesn’t include the key for the current `kid`. Google rotates keys; the backend must use the **current** JWKS from Google (e.g. `https://www.googleapis.com/oauth2/v3/certs`).
2. **Wrong JWKS URL or client:** The service that fetches/resolves keys might be pointing to the wrong URL, or not refreshing when keys rotate.
3. **Wrong token type:** Verifying an access token as if it were an ID token (or vice versa). For Google sign-in, the **ID token** (JWT) must be verified with Google’s JWKS; access tokens are opaque and should not be verified as JWTs.
4. **Misconfiguration:** Wrong Google OAuth client ID / audience when validating the JWT (e.g. `aud` / `iss`), which can lead to using the wrong key set or failing after a key lookup.

### 4. What to do

1. **Identify** the code path that verifies the Google token for `POST .../applicant/social-login` (and employer social login if it shares the same verifier).
2. **Ensure** verification uses Google’s **current** JWKS:
   - JWKS URL: `https://www.googleapis.com/oauth2/v3/certs`
   - Resolve the key by the JWT header’s `kid` from this endpoint (or a well-maintained JWKS client that fetches from this URL and refreshes).
3. **Verify** the JWT as a Google **ID token**:
   - Check signature using the key identified by `kid`.
   - Validate `aud` (audience) against the correct Google OAuth client ID(s).
   - Validate `iss` (e.g. `https://accounts.google.com` or `accounts.google.com`).
   - Validate `exp` / `iat` if not already done.
4. **Avoid** relying on a single static key or an outdated cache; ensure the key set is refreshed when Google rotates keys (e.g. TTL or refresh on "kid not found").
5. **Return** a clear, non-500 response for invalid tokens (e.g. 401 with a generic message) so the frontend can show “Google sign-in failed” without exposing internal details.

### 5. Acceptance criteria

- User selects Google account → backend verifies the token successfully and returns 2xx with the same response shape as before (token, user, etc.).
- No 500 due to `"kid" invalid, unable to lookup correct key`.
- Email/password login and other auth flows (employer login, Apple, etc.) continue to work as before.

### 6. Optional: align token sent from frontend

If the backend **requires** the Google **ID token** (JWT) and the frontend might sometimes send something else (e.g. access token), document that the backend expects the **ID token** and ensure the frontend always sends the ID token for Google. The backend fix should still make **kid** lookup robust (correct JWKS URL and key resolution) so that once the correct ID token is sent, verification succeeds.

---

**Summary:** Fix the Google JWT verification “kid” lookup (use current JWKS from Google, correct audience/issuer, refresh key set when needed) so social login returns 2xx instead of 500, without changing other auth services.
