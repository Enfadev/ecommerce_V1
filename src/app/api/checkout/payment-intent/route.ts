import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY;
console.log('DEBUG STRIPE_SECRET_KEY:', secretKey);
if (!secretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables.');
}
const stripe = new Stripe(secretKey, {
  apiVersion: '2023-10-16',
});

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const { amount, email } = await req.json();
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }
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
    console.error('STRIPE PAYMENTINTENT ERROR:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
