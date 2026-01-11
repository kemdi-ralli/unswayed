// pages/subscription/success.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SubscriptionSuccess() {
  const router = useRouter();
  const { session_id } = router.query;

//   useEffect(() => {
//     if (session_id) {
//       verifyCheckout(session_id as string);
//     }
//   }, [session_id]);

//   const verifyCheckout = async (sessionId: string) => {
//     const response = await fetch('/api/subscriptions/verify-checkout', {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ session_id: sessionId }),
//     });
    
//     const data = await response.json();
    
//     if (data.status === 'success') {
//       // Subscription activated! Update your app state
//       router.push('/dashboard');
//     }
//   };

  return <div>Processing your subscription...</div>;
}