# Subscription Blocker Modal Implementation

## Overview
This implementation adds a **blocker modal** that restricts employer access after their 30-day trial period expires. The modal displays subscription plan options from the PricingSection and requires employers to subscribe before continuing to use the platform.

## Key Components

### 1. SubscriptionBlockerModal Component
**Location:** `src/components/Modal/SubscriptionBlockerModal.jsx`

**Features:**
- Displays all employer subscription tiers (Tier 1, Tier 2, Tier 3)
- Fetches live pricing data from `/subscriptions/plans` API endpoint
- Falls back to static pricing if API fails
- Highlights "Most Popular" plan (Tier 2)
- Handles checkout flow via `/subscriptions/checkout` API
- Non-dismissible modal (no close button, no escape key)
- Fully responsive design

**Subscription Plans Displayed:**
- **Tier 1 ($99.99/month)**: Ideal for small teams
- **Tier 2 ($150.00/month)**: For growing companies (Most Popular)
- **Tier 3 ($175.00/month)**: For large organizations

### 2. CustomLayout Integration
**Location:** `src/components/rootLayout/CustomLayout.jsx`

**Implementation Details:**
- Checks subscription status on employer authentication
- Uses `/subscriptions/current` API endpoint
- Triggers blocker modal when:
  - Trial has expired (`is_on_trial && days_remaining <= 0`)
  - Subscription has expired (`!has_active_subscription && !is_on_trial`)
- Excludes blocking on specific paths:
  - `/billing` and `/billing/success`
  - `/employer/login`, `/employer/form`, `/employer/form/emailVerification`

**Subscription Check Logic:**
```javascript
const trialExpired = subscriptionInfo?.is_on_trial && subscriptionInfo?.days_remaining <= 0;
const subscriptionExpired = !subscriptionInfo?.has_active_subscription && !subscriptionInfo?.is_on_trial;
```

## API Endpoints Used

### 1. Get Subscription Plans
- **Endpoint:** `GET /subscriptions/plans`
- **Purpose:** Fetch all available subscription plans
- **Response Structure:**
```json
{
  "status": "success",
  "data": {
    "plans": [
      {
        "id": 1,
        "name": "Tier 1",
        "slug": "employer-tier-1",
        "price": "99.99",
        "billing_period": "monthly",
        "description": "...",
        "features": [...],
        "user_type": "employer",
        "is_active": true
      }
    ]
  }
}
```

### 2. Get Current Subscription
- **Endpoint:** `GET /subscriptions/current`
- **Purpose:** Check employer's current subscription status
- **Response Structure:**
```json
{
  "status": "success",
  "data": {
    "plan": "30-Day Trial",
    "is_subscribed": false,
    "is_on_trial": true,
    "trial_ends_at": "2026-02-18T00:00:00Z",
    "subscription_ends_at": null,
    "days_remaining": 5,
    "has_active_subscription": false
  }
}
```

### 3. Create Checkout Session
- **Endpoint:** `POST /subscriptions/checkout`
- **Purpose:** Initiate Stripe checkout session
- **Request Body:**
```json
{
  "plan_id": 1,
  "success_url": "https://domain.com/billing/success",
  "cancel_url": "https://domain.com/billing"
}
```
- **Response:**
```json
{
  "status": "success",
  "data": {
    "checkout_url": "https://checkout.stripe.com/..."
  }
}
```

## User Flow

### For New Employers
1. Employer signs up → Gets 30-day trial (Tier 1 features)
2. Full access to platform for 30 days
3. After 30 days → Blocker modal appears on login
4. Must select and subscribe to a plan to continue

### For Existing Employers
1. Active subscription → No blocker
2. Subscription expires → Blocker modal appears
3. Must renew or select new plan to continue

### Excluded Pages (No Blocker)
- `/billing` - Allow access to view plans
- `/billing/success` - Post-payment confirmation
- `/employer/login` - Login page
- `/employer/form` - Registration flow
- `/employer/form/emailVerification` - Email verification

## Subscription Status Indicators

The application shows subscription status in multiple places:

1. **Employer Profile Page** (`EmployerProfile.jsx`)
   - Displays current plan badge
   - Shows trial days remaining
   - "Upgrade Now" button for trial users

2. **Billing Page** (`billing/page.jsx`)
   - Full pricing section with all plans
   - Current plan highlighted
   - Trial status banner

3. **Blocker Modal** (New)
   - Triggered on expired trial/subscription
   - Prevents access until subscription

## Styling & Design

### Modal Design
- **Colors:**
  - Primary: `#00305B` (Navy Blue)
  - Success: `#189e33ff` (Green)
  - Warning: `#fef3c7` (Light Yellow)
  - Text: `#111827` (Dark Gray)

- **Layout:**
  - Centered on screen
  - Responsive grid for plans
  - Glassmorphism backdrop (`backdrop-filter: blur(8px)`)
  - Card elevation with hover effects

### Accessibility
- Non-dismissible by design (enforces subscription)
- Clear call-to-action buttons
- High contrast text
- Keyboard navigation support
- Screen reader friendly

## Testing Scenarios

### 1. Trial Expired
```javascript
// Mock subscription data
{
  is_on_trial: true,
  days_remaining: 0,
  has_active_subscription: false
}
// Expected: Blocker modal appears
```

### 2. Active Subscription
```javascript
{
  is_on_trial: false,
  days_remaining: 0,
  has_active_subscription: true,
  plan: "Tier 2"
}
// Expected: No blocker, normal access
```

### 3. Subscription Expired
```javascript
{
  is_on_trial: false,
  days_remaining: 0,
  has_active_subscription: false
}
// Expected: Blocker modal appears
```

### 4. Active Trial
```javascript
{
  is_on_trial: true,
  days_remaining: 15,
  has_active_subscription: false
}
// Expected: No blocker, normal access
```

## Error Handling

### API Failures
- **Plans API fails:** Falls back to static employer plans
- **Subscription check fails:** Falls back to userData from Redux store
- **Checkout fails:** Displays user-friendly error message

### Network Issues
- Retry logic on checkout
- Graceful degradation with static data
- Error messages guide user to contact support

## Future Enhancements

1. **Grace Period:** Add 3-7 day grace period after trial expiration
2. **Email Reminders:** Send emails at 7, 3, 1 days before trial ends
3. **Usage Tracking:** Show usage stats in blocker modal
4. **Discount Codes:** Add promo code support
5. **Annual Plans:** Add yearly billing options with discounts

## Configuration

### Environment Variables
Ensure these are set in your `.env` file:
```env
NEXT_PUBLIC_API_URL=https://api.yourapp.com
STRIPE_PUBLIC_KEY=pk_live_...
```

### Feature Flags
To disable the blocker during development:
```javascript
// In CustomLayout.jsx
const ENABLE_SUBSCRIPTION_BLOCKER = process.env.NEXT_PUBLIC_ENABLE_SUBSCRIPTION_BLOCKER !== 'false';
```

## Support

### Troubleshooting
1. **Modal not appearing:**
   - Check Redux store has `userData.user.type === "employer"`
   - Verify `/subscriptions/current` API is returning correct data
   - Check browser console for errors

2. **Checkout not working:**
   - Verify Stripe configuration
   - Check `plan.id` is valid (not 0)
   - Ensure CORS is configured for Stripe redirects

3. **False positives:**
   - Verify subscription data is fresh
   - Check date calculations for trial_ends_at
   - Review fallback logic in CustomLayout

### Contact
For issues or questions:
- Technical Support: support@yourapp.com
- Sales Team: sales@yourapp.com

---

**Implementation Date:** January 19, 2026
**Version:** 1.0.0
**Status:** Production Ready
