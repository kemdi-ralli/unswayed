# Backend: Debug 500 and Axios errors on `GET/POST https://unswayed.onrender.com/api/employer/jobs`

The frontend is seeing **Axios errors and HTTP 500** when calling the employer jobs API. Use this document to reproduce requests and fix the server-side cause.

---

## 1. Endpoint and usage

| Purpose | Method | URL | Auth |
|--------|--------|-----|------|
| List employer's jobs | **GET** | `https://unswayed.onrender.com/api/employer/jobs?search=&limit=100&page=1` | Bearer token (Cookie: `token`) |
| Create job | **POST** | `https://unswayed.onrender.com/api/employer/jobs` | Bearer token |
| Update job | **PUT** | `https://unswayed.onrender.com/api/employer/jobs/{id}` | Bearer token |
| Delete job | **DELETE** | `https://unswayed.onrender.com/api/employer/jobs/{id}` | Bearer token |

- **Headers:** `Accept: application/json`, `Content-Type: application/json`, `Authorization: Bearer {token}`.
- **Base path:** `/api/employer/jobs` (route prefix may be `api` or `employer/jobs` depending on your stack).

Identify whether the 500 occurs on **GET** (list), **POST** (create), **PUT** (update), or **DELETE** by checking server logs or repro with the same method.

---

## 2. GET (list jobs) – request the frontend sends

- **URL:** `GET /api/employer/jobs?search={text}&limit=100&page=1`
- **Query params:** `search` (string, can be empty), `limit` (e.g. 100), `page` (e.g. 1).
- **Body:** none.

**Backend checks:**

1. **Logs:** Reproduce with a valid employer token; capture full stack trace and error message (e.g. Laravel log, Node `console.error`, etc.).
2. **Auth:** Ensure the employer/jobs controller uses the authenticated employer (e.g. `auth('employer')->user()` or equivalent). 500 can occur if auth guard or middleware fails or returns wrong type.
3. **Queries:** Check for missing relations (e.g. `job_categories`, `job_types`, `country`, `states`, `cities`) when building the list. Accessing a missing relation or attribute can throw and return 500.
4. **Pagination:** Ensure `limit`/`page` are validated and used safely (no division by zero, no non-numeric types). Expected response shape used by frontend: `{ data: { jobs: [...] } }`.

---

## 3. POST (create job) – request body the frontend sends

The frontend sends a **JSON body** with the following shape (all fields may be present; types are as sent by the frontend):

```json
{
  "title": "string",
  "no_of_positions": "string",
  "deadline": "YYYY-MM-DD" or null,
  "job_categories": [1, 2],
  "job_types": [1],
  "job_locations": [1],
  "job_shifts": [1],
  "job_shift_timing": "string (e.g. id or label)",
  "country": number or null,
  "states": [1, 2],
  "cities": [1, 2],
  "skills": ["string", "..."],
  "experience_level": "string (e.g. entry, intermediate, experienced, advanced)",
  "salary": "string",
  "salary_max": "string",
  "salary_period": "Per Month",
  "salary_currency": "string",
  "requirements": "string",
  "company_about": "string",
  "company_benefits": "string",
  "description": "string (may include \"\\n\\nAdditional Category: ...\")",
  "type": "internal" or "external",
  "job_apply_link": "string (optional, for type=external)"
}
```

**Notes:**

- `job_categories` is an array of IDs; the frontend removes the placeholder value `"other_category"` before send, so only numeric IDs (or your expected type) should appear.
- `no_of_positions` is sent as a **string** (e.g. `"1"`).
- `deadline` is either a date string `"YYYY-MM-DD"` or `null`.
- `country`, `states`, `cities`, `job_categories`, `job_types`, `job_locations`, `job_shifts` are IDs (numbers or strings depending on your DB).

**Backend checks for POST 500:**

1. **Logs:** Log the incoming request body and the full exception (message + stack). Confirm the 500 is from this route.
2. **Validation:** If you use a request validator (e.g. Laravel Form Request, class-validator), ensure it allows the types above. A rule that expects `no_of_positions` as integer can fail if the frontend sends a string; normalize or accept both.
3. **DB constraints:** Check NOT NULL, foreign keys, and unique constraints. Missing required column, invalid foreign key (e.g. category id not in DB), or duplicate key can throw and return 500.
4. **Relations:** When creating the job, if you attach relations (e.g. `job_categories`, `states`, `cities`), ensure the IDs exist and the pivot/relation names match your schema. Wrong relation name or missing ID can cause an unhandled exception.
5. **Type casting:** If the backend expects integers for `country`, `job_shift_timing`, or array elements, cast or validate before DB insert. Null/empty string in a column that expects integer can cause 500.
6. **Server error handler:** Ensure the API does not expose raw stack traces to the client; return a consistent JSON error body (e.g. `{ "message": "Server error" }`) and log the real error server-side.

---

## 4. PUT (update job) – request body

Same JSON shape as POST. URL: `PUT /api/employer/jobs/{id}`. Apply the same validation and DB checks as for POST; additionally verify the job `id` exists and belongs to the authenticated employer before updating.

---

## 5. DELETE – request

- **URL:** `DELETE /api/employer/jobs/{id}`  
- **Body:** none.

Check that the route exists, auth is applied, and that deleting the job (and any related records) does not throw (e.g. missing cascade, trigger, or constraint).

---

## 6. Recommended debugging steps (clinical)

1. **Reproduce:** Use Postman or curl with the same method, URL, headers (Bearer token), and for POST/PUT the same body. Confirm you get 500 and note the response body (if any).
2. **Server logs:** Reproduce again and capture the exact exception and stack trace. The line number and exception type (e.g. `QueryException`, `ValidationException`, `ForeignKeyConstraintViolation`) will point to the cause.
3. **Narrow scope:** If the 500 is on GET, comment out relations one by one or add try/catch around the query builder to see which relation or column access fails. If on POST, log the body, then try a minimal body (e.g. only required fields) and add fields until it breaks.
4. **Validation vs 500:** Prefer returning **4xx** (e.g. 422) with a clear `message` for validation/business rule errors, and **500** only for unexpected server errors. That way the frontend can show `response.data.message` and you avoid leaking internal errors.
5. **Response shape:** Frontend expects success like `{ status: "success", message: "...", data?: ... }` and errors with `response.data.message`. Ensure your exception handler sets a JSON body and that 500 responses still return JSON (not HTML).

---

## 7. Summary

| Item | Detail |
|------|--------|
| **Endpoint** | `https://unswayed.onrender.com/api/employer/jobs` (GET list, POST create, PUT update, DELETE delete) |
| **Auth** | Bearer token in `Authorization` header |
| **GET** | Query params: `search`, `limit`, `page`. Response: `data.jobs` array. |
| **POST/PUT body** | JSON with title, no_of_positions, deadline, job_categories, job_types, job_locations, job_shifts, job_shift_timing, country, states, cities, skills, experience_level, salary fields, requirements, company_about, company_benefits, description, type, job_apply_link. |
| **Fix 500** | Use server logs (stack trace), validate/cast types, check DB constraints and relations, return JSON errors and 4xx for validation. |

Once the backend returns 200 (or 4xx with a message) instead of 500, the frontend Axios error will go away; the frontend already shows `error?.response?.data?.message` to the user.
