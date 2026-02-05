# Backend: Implement registration availability checks (email, username, phone)

The frontend registration flows need to **check if email, username, or phone already exist** before the user can move to the next step. There is currently **no API** for this. Add the following on the **server (backend)** so the frontend can call it.

---

## 1. Endpoints to add

Base URL is the same as existing API (e.g. `https://unswayed.onrender.com/api/`). These should be **GET** (idempotent, no body) and **public** (no auth required — user is not logged in during registration).

| User type   | Check        | Suggested path                          | Query params   |
|------------|--------------|------------------------------------------|----------------|
| Applicant  | email        | `GET /api/applicant/check-email`         | `?email=`      |
| Applicant  | username     | `GET /api/applicant/check-username`     | `?username=`  |
| Applicant  | phone        | `GET /api/applicant/check-phone`         | `?phone=`      |
| Employer   | email        | `GET /api/employer/check-email`          | `?email=`      |
| Employer   | username     | `GET /api/employer/check-username`       | `?username=`  |
| Employer   | phone        | `GET /api/employer/check-phone`          | `?phone=`      |

You can instead expose a **single** endpoint per user type if you prefer, e.g.:

- `GET /api/applicant/check-availability?email=...&username=...&phone=...`
- `GET /api/employer/check-availability?email=...&username=...&phone=...`

Frontend can be wired to either style.

---

## 2. Response contract

- **Status:** `200 OK` for a valid check (whether available or taken).
- **Body (JSON):** indicate whether the value **exists** (taken) or not (available).

**Option A — per-field endpoints**

```json
{ "exists": true }
```
or
```json
{ "exists": false }
```

**Option B — single availability endpoint**

Return an object with one key per field that was requested:

```json
{
  "email": { "exists": true },
  "username": { "exists": false },
  "phone": { "exists": false }
}
```

If a query param is missing, omit that key or return `exists: false` for it.

---

## 3. Server logic (per check)

1. Read the query parameter (e.g. `email`, `username`, or `phone`). Normalize if needed (e.g. email lowercase, phone E.164 or digits-only).
2. Query your **applicant** or **employer** table (and any other store that holds that identifier) to see if a row exists with that value.
3. Return `200` with `{ "exists": true }` if found, `{ "exists": false }` if not.
4. Validation:
   - If the parameter is missing or invalid (e.g. empty string), return `400` with a clear error message.
   - Do **not** return 500 for “already exists” — that is a normal case; use `exists: true`.

---

## 4. Security and performance

- **Rate limit** these endpoints (e.g. per IP or per session) to avoid abuse for enumerating emails/usernames.
- **No authentication** required; callers are unauthenticated users on the registration page.
- Keep queries efficient (indexed columns for email, username, phone).

---

## 5. Summary

| What to add on server | Details |
|-----------------------|--------|
| **Applicant**         | `check-email`, `check-username`, `check-phone` (or one `check-availability`) under `/api/applicant/`. |
| **Employer**           | Same under `/api/employer/`. |
| **Response**           | `200` + `{ "exists": true \| false }` (or object with per-field `exists` for a single endpoint). |
| **Auth**               | None. |
| **Method**             | GET with query params. |

Once these endpoints exist and match the contract above, the frontend can call them on “Next” (registration step) and block moving to the next page when `exists: true` for email, username, or phone.
