# Developer Quick Reference Guide - Subscription Blocker Modal

## Quick Start

### Overview
The subscription blocker modal prevents employers from accessing the platform after their 30-day trial expires until they subscribe to a paid plan.

---

## File Locations

```
src/
├── components/
│   ├── Modal/
│   │   └── SubscriptionBlockerModal.jsx     ← Main modal component
│   └── rootLayout/
│       └── CustomLayout.jsx                  ← Integration point
└── services/
    └── apiService/
        └── apiServiceInstance.js             ← API client
```

---

## How It Works

### 1. Subscription Check (CustomLayout.jsx)
```javascript
// Triggered on employer login
useEffect(() => {
  if (userType === "employer" && isAuthenticated) {
    // Call API to check subscription status
    const response = await apiInstance.get("/subscriptions/current");
    
    // Show modal if expired
    if (trialExpired || subscriptionExpired) {
      setShowSubscriptionBlocker(true);
    }
  }
}, [isAuthenticated, userType]);
```

### 2. Modal Display
```javascript
// Conditional rendering in CustomLayout
{showSubscriptionBlocker && userType === "employer" && (
  <SubscriptionBlockerModal open={showSubscriptionBlocker} />
)}
```

### 3. Subscription Flow
```
Login → Check /subscriptions/current → Trial expired? 
→ YES: Show modal → Select plan → Checkout → Payment → Access granted
→ NO: Normal access
```

---

## API Endpoints

### Check Subscription Status
```javascript
GET /subscriptions/current

Response:
{
  "status": "success",
  "data": {
    "plan": "30-days trial",
    "is_on_trial": true,
    "days_remaining": 0,
    "has_active_subscription": false,
    "trial_ends_at": "2026-01-19T00:00:00Z",
    "subscription_ends_at": null
  }
}
```

### Get Subscription Plans
```javascript
GET /subscriptions/plans

Response:
{
  "status": "success",
  "data": {
    "plans": [
      {
        "id": 1,
        "name": "Tier 1",
        "price": "99.99",
        "billing_period": "monthly",
        "features": [...],
        "user_type": "employer"
      }
    ]
  }
}
```

### Create Checkout Session
```javascript
POST /subscriptions/checkout
Body: {
  "plan_id": 1,
  "success_url": "https://domain.com/billing/success",
  "cancel_url": "https://domain.com/billing"
}

Response:
{
  "status": "success",
  "data": {
    "checkout_url": "https://checkout.stripe.com/..."
  }
}
```

---

## Configuration

### Environment Variables
```env
# Required
NEXT_PUBLIC_API_URL=https://api.yourapp.com
STRIPE_PUBLIC_KEY=pk_live_...

# Optional
NEXT_PUBLIC_ENABLE_SUBSCRIPTION_BLOCKER=true
NEXT_PUBLIC_DEBUG_SUBSCRIPTION=false
```

### Feature Flags
```javascript
// Disable blocker for testing
// In CustomLayout.jsx line 65
const BLOCKER_ENABLED = process.env.NEXT_PUBLIC_ENABLE_SUBSCRIPTION_BLOCKER !== 'false';

if (!BLOCKER_ENABLED) return;
```

---

## Testing

### Test Scenarios

#### 1. Trial Expired
```javascript
// Mock subscription data
const mockExpiredTrial = {
  is_on_trial: true,
  days_remaining: 0,
  has_active_subscription: false
};
// Expected: Modal appears
```

#### 2. Active Trial
```javascript
const mockActiveTrial = {
  is_on_trial: true,
  days_remaining: 15,
  has_active_subscription: false
};
// Expected: No modal
```

#### 3. Active Subscription
```javascript
const mockActiveSubscription = {
  is_on_trial: false,
  days_remaining: 0,
  has_active_subscription: true,
  plan: "Tier 2"
};
// Expected: No modal
```

### Manual Testing
```bash
# 1. Login as employer with expired trial
# 2. Verify modal appears
# 3. Click subscribe on any plan
# 4. Verify redirect to Stripe
# 5. Complete payment
# 6. Verify access restored
```

### Debug Mode
```javascript
// Add to SubscriptionBlockerModal.jsx
useEffect(() => {
  console.log('Modal state:', { open, plans, loading });
}, [open, plans, loading]);
```

---

## Common Tasks

### Modify Plan Features
```javascript
// In SubscriptionBlockerModal.jsx
const staticEmployerPlans = [
  {
    name: "Tier 1",
    price: "99.99",
    features: [
      "Job Postings: 50 active job postings",  // ← Modify here
      "Candidate Access: Basic profiles",
      // Add more features
    ]
  }
];
```

### Change Excluded Paths
```javascript
// In CustomLayout.jsx line 70
const allowedPaths = [
  "/billing",
  "/billing/success",
  "/employer/login",
  "/employer/form",
  "/employer/form/emailVerification",
  "/your-new-path"  // ← Add new paths here
];
```

### Customize Modal Styling
```javascript
// In SubscriptionBlockerModal.jsx
sx={{
  bgcolor: "#ffffff",           // Background color
  borderRadius: "20px",         // Corner radius
  boxShadow: "...",             // Shadow
  // Modify as needed
}}
```

---

## Troubleshooting

### Issue: Modal Not Appearing

**Check 1: Redux Store**
```javascript
// In browser console
console.log(store.getState().auth.userData);
// Should show user.type === "employer"
```

**Check 2: API Response**
```javascript
// In Network tab, check /subscriptions/current
// Verify response has is_on_trial and days_remaining
```

**Check 3: Console Errors**
```javascript
// Look for errors in browser console
// Common: CORS issues, API timeout, Redux not initialized
```

### Issue: Checkout Not Working

**Check 1: Plan ID**
```javascript
// Ensure plan.id is valid
console.log('Plan ID:', plan.id);
// Should be > 0, not undefined
```

**Check 2: Stripe Configuration**
```javascript
// Verify Stripe public key is set
console.log(process.env.STRIPE_PUBLIC_KEY);
```

**Check 3: API Endpoint**
```javascript
// Verify checkout endpoint is correct
// Should POST to /subscriptions/checkout
```

### Issue: Modal Appears for Active Subscription

**Check 1: Subscription Data**
```javascript
// Verify backend is returning correct data
const response = await fetch('/subscriptions/current');
console.log(await response.json());
```

**Check 2: Trial Calculation**
```javascript
// Check if days_remaining calculation is correct
// Timezone issues can cause off-by-one errors
```

---

## Code Examples

### Custom Subscription Check
```javascript
// Create a custom hook
export const useSubscriptionCheck = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  
  useEffect(() => {
    const checkSubscription = async () => {
      const response = await apiInstance.get("/subscriptions/current");
      setSubscriptionStatus(response.data.data);
    };
    checkSubscription();
  }, []);
  
  return subscriptionStatus;
};

// Usage
const status = useSubscriptionCheck();
if (status?.is_on_trial && status?.days_remaining <= 0) {
  // Show blocker
}
```

### Trigger Modal Programmatically
```javascript
// In any component
import { useDispatch } from 'react-redux';

const dispatch = useDispatch();

// Set a global state flag
dispatch(setShowSubscriptionBlocker(true));
```

---

## Performance Optimization

### Lazy Load Modal
```javascript
// In CustomLayout.jsx
const SubscriptionBlockerModal = lazy(() => 
  import('../Modal/SubscriptionBlockerModal')
);

// Render with Suspense
<Suspense fallback={<CircularProgress />}>
  {showSubscriptionBlocker && <SubscriptionBlockerModal />}
</Suspense>
```

### Cache Subscription Status
```javascript
// Use SWR or React Query
import useSWR from 'swr';

const { data: subscription } = useSWR(
  '/subscriptions/current',
  fetcher,
  { revalidateOnFocus: false }
);
```

---

## Security Considerations

### 1. Backend Validation
Always validate subscription status on the backend. The frontend check is UX only.

```javascript
// Backend middleware
function requireActiveSubscription(req, res, next) {
  const user = req.user;
  if (!user.has_active_subscription && !user.is_on_trial) {
    return res.status(403).json({ error: 'Subscription required' });
  }
  next();
}
```

### 2. API Rate Limiting
Prevent abuse of subscription check endpoint.

```javascript
// Backend rate limit
app.use('/subscriptions/current', rateLimit({
  windowMs: 60000, // 1 minute
  max: 10 // 10 requests per minute
}));
```

### 3. Input Validation
Validate plan_id before checkout.

```javascript
// In SubscriptionBlockerModal.jsx
if (!plan.id || plan.id === 0 || typeof plan.id !== 'number') {
  throw new Error('Invalid plan ID');
}
```

---

## Monitoring & Analytics

### Track Modal Events
```javascript
// Add analytics tracking
const handleCheckout = async (plan) => {
  // Track event
  analytics.track('subscription_modal_checkout_clicked', {
    plan_name: plan.name,
    plan_price: plan.price,
    user_id: userData.user.id
  });
  
  // Proceed with checkout
  await apiInstance.post('/subscriptions/checkout', {...});
};
```

### Monitor API Performance
```javascript
// Add timing metrics
const startTime = performance.now();
const response = await apiInstance.get('/subscriptions/current');
const endTime = performance.now();

console.log(`Subscription check took ${endTime - startTime}ms`);
```

---

## Best Practices

### 1. Error Boundaries
```javascript
// Wrap modal in error boundary
<ErrorBoundary fallback={<ErrorMessage />}>
  <SubscriptionBlockerModal />
</ErrorBoundary>
```

### 2. Loading States
```javascript
// Always show loading states
{loading ? (
  <CircularProgress />
) : (
  <PlanCards plans={plans} />
)}
```

### 3. Accessibility
```javascript
// Add ARIA labels
<Modal
  aria-labelledby="subscription-modal-title"
  aria-describedby="subscription-modal-description"
>
```

### 4. Responsive Design
```javascript
// Use responsive breakpoints
sx={{
  width: { xs: "95%", sm: "90%", md: "85%", lg: "1200px" },
  fontSize: { xs: "14px", sm: "16px", md: "18px" }
}}
```

---

## Quick Reference Commands

```bash
# Start development server
npm run dev

# Run linter
npm run lint

# Run tests
npm test

# Build for production
npm run build

# Check bundle size
npm run analyze
```

---

## Resources

- **Main Docs**: `SUBSCRIPTION_BLOCKER_IMPLEMENTATION.md`
- **Summary**: `IMPLEMENTATION_SUMMARY.md`
- **API Docs**: `/docs/api/subscriptions`
- **Stripe Docs**: https://stripe.com/docs

---

## Support

**Questions?** Contact the development team:
- Tech Lead: tech-lead@yourapp.com
- Backend Team: backend@yourapp.com
- Frontend Team: frontend@yourapp.com

**Found a bug?** Create an issue in the repository.

---

**Last Updated**: January 19, 2026  
**Maintainer**: Development Team  
**Version**: 1.0.0
