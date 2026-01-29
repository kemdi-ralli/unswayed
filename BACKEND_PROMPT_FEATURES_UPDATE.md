# Backend Updates to Correspond with Frontend Changes

The frontend has been updated for the following. Where server changes are needed, implement as below.

---

## 1. Google / Social Login (422 Error)

**Issue:** Applicant Google sign-in returns **422 Unprocessable Entity** in some cases.

**Frontend currently sends:**
- **Method:** `POST`
- **Path:** `/api/applicant/social-login`
- **Content-Type:** `multipart/form-data`
- **Body (FormData):** `provider=google`, `accessToken=<id_token_or_access_token>`

**Backend should:**
1. **Accept** `provider` and `accessToken` (from FormData or JSON).
2. **Validate:** If using Google, accept either:
   - **ID token** (`id_token` from Firebase / OAuth) — verify with Google’s token verification.
   - **Access token** — if your backend uses access token for profile fetch, accept it and document which you expect.
3. **Return 422 only for validation failures** (e.g. invalid token, missing provider) and include a clear `message` in the response body so the frontend can show it (e.g. `"Invalid or expired Google token"`).
4. If the backend expects **JSON** instead of FormData, accept `Content-Type: application/json` with body `{ "provider": "google", "accessToken": "<token>" }` and document it; the frontend can be updated to send JSON if needed.

**Suggested response on success:** `200` with `{ "status": "success", "message": "...", "data": { "token", "user", "is_completed", ... } }`.

---

## 2. Application Submit — Disability Fields Optional

**Change:** The last page of the application flow no longer shows the **disability dropdown** or **“Please specify your disability”** text input. The “Do you have a disability?” Yes/No/No answer checkbox remains.

**Backend should:**
1. Treat **disability_id** and **other_disability** (or equivalent) as **optional** on apply.
2. If the frontend sends `disability_id` as empty or omitted, do not return validation error; store null/empty as needed.
3. Keep accepting optional disability fields when provided (e.g. for future or other entry points).

---

## 3. Job Requirements — Preserve Newlines

**Change:** Job details “Requirements” are rendered with **preserved newlines** (e.g. employer’s bullet list or line breaks).

**Backend should:**
1. **Store** job requirements with newlines preserved (e.g. `\n` in JSON, or actual newlines in DB text).
2. **Return** the same string in the job detail API (e.g. `GET /api/job-detail/{id}` or equivalent) so the frontend can render with `white-space: pre-line` and show line breaks and list structure as entered by the employer.

No change required if the backend already stores and returns raw requirement text with newlines.

---

## 4. Notifications — Unread / “Ping” Indicator

**Change:** The frontend shows a **red dot (ping)** on the notification icon when there are new/unread notifications.

**Backend should (if not already):**
1. Expose an endpoint or include in an existing response a flag/count for **unread notifications** (e.g. `unread_count` or `has_unread`).
2. Ensure the frontend’s existing logic that sets `showNotificationDot` (or equivalent) receives this so the red dot appears when there are unread notifications and disappears when the user has read them.

---

## 5. Application Success Modal — No Backend Change

After a successful job application submit, the frontend shows a modal with options: **“Return to Dashboard”** and **“Featured Jobs”**. No backend changes required.

---

## 6. Counteroffer Letter Menu — No Backend Change

The employer menu shows **“Counteroffer Letter”** instead of **“Offer Letter”** when the applicant has rejected the initial offer (history includes `offer_decline`). The frontend uses existing application history; no new endpoints required.

---

## Summary Table

| Item                         | Backend action |
|-----------------------------|----------------|
| Google/social login 422     | Accept provider + accessToken; validate token; return clear message on 422; optionally accept JSON. |
| Disability on apply         | Treat disability_id / other_disability as optional. |
| Job requirements newlines   | Store and return requirements with newlines preserved. |
| Notification unread ping   | Provide unread flag/count for notifications if not already. |
| Success modal / Counteroffer| None. |
