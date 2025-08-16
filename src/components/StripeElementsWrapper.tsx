"use client";
import { useEffect, useState } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

interface StripeElementsWrapperProps {
  amount: number; // dalam USD
  email: string;
}

export default function StripeElementsWrapper({ amount, email }: StripeElementsWrapperProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/checkout/payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, email }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount, email]);

  const options: StripeElementsOptions = {
    clientSecret: clientSecret!,
    appearance: { theme: "stripe" },
  };

  if (!publishableKey) {
    return <div style={{ color: 'red' }}>Stripe publishable key is missing. Please check your environment variables.</div>;
  }
  if (!clientSecret) return <div>Loading payment form...</div>;
  if (!stripePromise) {
    return <div style={{ color: 'red' }}>Failed to initialize Stripe. Please check your publishable key.</div>;
  }
  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm />
    </Elements>
  );
}
