import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY;
if (!secretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables.');
}
const stripe = new Stripe(secretKey, {
  apiVersion: '2025-07-30.basil',
});

export async function POST(req: NextRequest) {
  try {
    const { amount, email } = await req.json();
    // amount dalam USD, dikali 100 untuk cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      receipt_email: email,
      metadata: {
        integration_check: 'elements',
      },
    });
    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
