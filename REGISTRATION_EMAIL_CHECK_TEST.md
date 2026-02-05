# Registration email-existence check — test result

## Question
Do the registration pages check if the email already exists before the user can move to the next page?

## Result: **No**

The registration flows do **not** perform any server or client check for “email already exists” before allowing the user to proceed to the next step.

---

## Evidence

### 1. No email-check API in the app
- There is **no** `api/check-availability` route (it was removed).
- Grep over `src` for `check-availability`, `checkAvailability`, or `check.*email`: **no matches**.

### 2. Applicant registration — first step (`RegistrationInfo.jsx`)
- **Step:** Email, username, password (first wizard step at `/applicant/form`).
- **On “Next”:**
  - `handleNext()` runs.
  - It calls `validateForm()` (Yup schema + terms agreement only).
  - If valid, it calls `nextStep(formData)`.
- **No** `fetch`, **no** call to any backend or API route, **no** email-existence check.
- **Conclusion:** User can proceed to the next page with any email that passes format/validation; existing-email is not checked.

### 3. Employer registration — first step (`EmployerRegistrationInfo.jsx`)
- **Step:** Email, username, password (first wizard step at `/employer/form`).
- **On “Next”:**
  - `handleNext()` runs.
  - It calls `validateForm()` (Yup + employer email-domain rules + terms).
  - If valid, it calls `nextStep(formData)`.
- **No** `fetch`, **no** call to any backend or API route, **no** email-existence check.
- **Conclusion:** Same as applicant: user can proceed with any valid-format email; existing-email is not checked.

### 4. Code references
| File | Email-check on “Next”? | Relevant logic |
|------|------------------------|----------------|
| `src/components/applicantForm/RegistrationInfo.jsx` | No | `handleNext`: `validateForm()` → `nextStep(formData)` |
| `src/components/employer/employerForm/EmployerRegistrationInfo.jsx` | No | `handleNext`: `validateForm()` → `nextStep(formData)` |

---

## How to verify manually

1. **Applicant:** Go to `/applicant/form`. Enter email (e.g. `existing@example.com`), username, password, check terms, click Next. You should move to the next step with no “email already exists” message.
2. **Employer:** Go to `/employer/form`. Enter a company email, username, password, check terms, click Next. You should move to the next step with no “email already exists” message.

---

## Summary

| Check type | Applicant | Employer |
|------------|-----------|----------|
| Email format / validation (Yup) | Yes | Yes |
| Email already exists (server/client) | **No** | **No** |

So: **the registration pages do not check if the email exists before the user can move to the next page.**
