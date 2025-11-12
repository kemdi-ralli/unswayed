import { loadStripe } from "@stripe/stripe-js";

// Make sure this is your PUBLIC key (starts with pk_live_... or pk_test_...)
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
