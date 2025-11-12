// app/api/checkout/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";

const secret = process.env.STRIPE_SECRET_KEY;
const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

if (!secret) {
  console.error("Missing STRIPE_SECRET_KEY env var");
}

if (!baseUrl) {
  console.error("Missing NEXT_PUBLIC_APP_URL env var");
}

const stripe = new Stripe(secret!);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const priceId = body?.priceId;

    if (!priceId || typeof priceId !== "string") {
      console.error("Invalid request: missing priceId", body);
      return NextResponse.json({ error: "Missing or invalid priceId" }, { status: 400 });
    }

    if (!secret) {
      console.error("STRIPE_SECRET_KEY not configured");
      return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    // Create checkout session for subscription (monthly)
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}`,
    });

    if (!session || !session.url) {
      console.error("Stripe session created but missing URL:", session);
      return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    // Log full error for diagnosis
    console.error("Stripe checkout error:", err);
    const message = err?.message || "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
