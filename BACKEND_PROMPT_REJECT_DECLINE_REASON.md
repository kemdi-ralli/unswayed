# Backend: Accept and Persist `reason` for Reject Application & Decline Offer/Interview

The frontend sends a **`reason`** field when the employer rejects an application and when the applicant declines an interview or an offer. The backend must **accept** and **parse** this field and **persist** it (e.g. on the application/history record) so it can be shown to the candidate and in admin/employer views.

---

## 1. Employer rejects an application

**Endpoint (update to accept and persist `reason`):**

- **Method:** `PATCH`
- **Path:** `/api/employer/job-application/{applicationId}/action`
- **Auth:** Required (employer, Bearer token)
- **Content-Type:** `application/json`

**Request body (JSON):**

| Field   | Type   | Required | Description                                      |
|---------|--------|----------|--------------------------------------------------|
| `type`  | string | Yes      | Action type. For rejection use `"reject"`.       |
| `reason`| string | No*      | Reason for rejecting the candidate. *Required when `type === "reject"` for UX. |

**Example:**

```json
{
  "type": "reject",
  "reason": "Underqualified: Not having the minimum skills, education, or experience required for the position."
}
```

**Backend tasks:**

1. Accept `reason` in the request body (query/route params are not used for this).
2. Validate: when `type` is `"reject"`, you may require `reason` (non-empty string) or allow it to be optional.
3. Persist `reason` on the application record (e.g. `rejection_reason`, `reason`, or equivalent column/JSON field).
4. Return success (e.g. `200` or `204`) with a clear message so the frontend can show success; on validation/DB errors return an appropriate status and `message` so the frontend can show the error.

**Current frontend behavior:**  
The employer selects a reason in a modal (or “Other” with free text), then confirms. The frontend sends **only** this JSON body (no FormData). If the backend expects a different content type or ignores `reason`, the employer will see an error when clicking “Reject Application”.

---

## 2. Applicant declines an interview

**Endpoint (update to accept and persist `reason`):**

- **Method:** `POST`
- **Path:** `/api/applicant/job-application/{interviewId}/interview-response`
- **Auth:** Required (applicant, Bearer token)
- **Content-Type:** `application/json`

**Request body (JSON):**

| Field           | Type   | Required | Description                                      |
|-----------------|--------|----------|--------------------------------------------------|
| `type`          | string | Yes      | `"accept"` or `"decline"`.                       |
| `reason`        | string | No*      | Reason for declining. *Recommended when `type === "decline"`. |
| `selected_date` | string | No*      | When `type === "accept"`, the chosen interview date. |

**Example (decline):**

```json
{
  "type": "decline",
  "reason": "Scheduling conflict"
}
```

**Backend tasks:**

1. Accept and parse `reason` from the JSON body.
2. When `type` is `"decline"`, persist `reason` (e.g. on the interview/application history record).
3. Return success with a clear message; on error return status and `message` for the frontend.

---

## 3. Applicant declines an offer

**Endpoint (update to accept and persist `reason`):**

- **Method:** `POST`
- **Path:** `/api/applicant/job-application/{offerId}/offer-response`
- **Auth:** Required (applicant, Bearer token)
- **Content-Type:** `application/json`

**Request body (JSON):**

| Field   | Type   | Required | Description                        |
|---------|--------|----------|------------------------------------|
| `type`  | string | Yes      | `"accept"` or `"decline"`.        |
| `reason`| string | No*      | Reason for declining the offer. *Recommended when `type === "decline"`. |

**Example (decline):**

```json
{
  "type": "decline",
  "reason": "Accepted another offer"
}
```

**Backend tasks:**

1. Accept and parse `reason` from the JSON body.
2. When `type` is `"decline"`, persist `reason` (e.g. on the offer/application history record).
3. Return success with a clear message; on error return status and `message` for the frontend.

---

## Summary

| Action                         | Method | Path (base `/api`)                              | Body (JSON)              |
|--------------------------------|--------|-------------------------------------------------|--------------------------|
| Employer rejects application   | PATCH  | `employer/job-application/{id}/action`          | `{ "type": "reject", "reason": "..." }` |
| Applicant declines interview   | POST   | `applicant/job-application/{id}/interview-response` | `{ "type": "decline", "reason": "..." }` |
| Applicant declines offer       | POST   | `applicant/job-application/{id}/offer-response` | `{ "type": "decline", "reason": "..." }` |

Ensure these endpoints:

1. **Parse** the JSON body (and do not expect FormData for these actions).
2. **Accept** the `reason` field and **persist** it when the action is reject/decline.
3. Return a clear error **message** (e.g. in `response.data.message`) when validation or processing fails so the frontend can show it to the user.

---

## 4. Return the reason with the notification to the receiver

So the **receiver** sees the reason on their notification page (applicant sees rejection reason; employer sees offer-decline reason), the backend must **include the reason in the notification** that is sent to the receiver.

### 4.1 Application rejection (employer rejects applicant)

- **Receiver:** Applicant.
- **When:** After the employer calls `PATCH …/action` with `type: "reject"` and `reason`.
- **Backend tasks:**
  1. Persist the `reason` (e.g. on the application/history record) as in section 1.
  2. When creating the **notification** for the applicant (e.g. “Application not selected” / “Candidate Is Not A Match”):
     - **Either** set the notification’s `description` (or body) so it **includes the rejection reason** (e.g. *“Your application was not selected for this role. Reason: [persisted reason].”*), so the receiver sees it in the existing notification UI.
     - **Or** (in addition or instead) add a **`reason`** field to the notification payload (e.g. `notification.reason` or `notification.data.reason`) with the persisted rejection reason. The frontend will display `reason` when present.
  3. Ensure the same notification object (including `description` and/or `reason`) is returned from **GET notifications** and, if applicable, from the **real-time event** (e.g. `NotificationReceived`) so the receiver’s page shows the reason.

### 4.2 Job offer decline (applicant declines offer)

- **Receiver:** Employer.
- **When:** After the applicant calls `POST …/offer-response` with `type: "decline"` and `reason`.
- **Backend tasks:**
  1. Persist the `reason` (e.g. on the offer/application history record) as in section 3.
  2. When creating the **notification** for the employer (e.g. “Offer declined”):
     - **Either** set the notification’s `description` so it **includes the decline reason** (e.g. *“The candidate declined your offer. Reason: [persisted reason].”*).
     - **Or** add a **`reason`** field to the notification payload (e.g. `notification.reason` or `notification.data.reason`) with the persisted decline reason. The frontend will display `reason` when present.
  3. Ensure the same notification (with `description` and/or `reason`) is returned from **GET notifications** and from the **real-time event** so the employer’s notification page shows the reason.

### 4.3 Summary

| Action                     | Receiver | Include in notification |
|----------------------------|----------|--------------------------|
| Employer rejects application | Applicant | Rejection reason in `description` and/or `reason` (or `data.reason`) |
| Applicant declines offer  | Employer | Decline reason in `description` and/or `reason` (or `data.reason`) |

- **GET notifications** and the **real-time notification event** must return the notification with the reason visible (in `description` and/or `reason`).
- Do not change the existing notification types or routing; only add the reason to the payload/description so the receiver’s page can show it without breaking existing behavior.
