"use client";
import { useEffect, useState } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";


const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
if (typeof window !== 'undefined') {
  // Log ke browser console untuk debug
  console.log('[STRIPE] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:', publishableKey);
}
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
    appearance: {
      theme: 'flat',
      variables: {
        colorPrimary: 'var(--color-primary, #635bff)',
        colorBackground: 'var(--color-card, #fff)',
        colorText: 'var(--color-foreground, #222)',
        colorDanger: '#df1b41',
        colorTextPlaceholder: 'var(--color-muted-foreground, #888)',
        colorBorder: 'var(--color-border, #e0e0e0)',
        borderRadius: '8px',
        fontFamily: 'var(--font-sans, sans-serif)',
        fontSizeBase: '16px',
      },
      rules: {
        '.Input': {
          backgroundColor: 'var(--color-card, #fff)',
          color: 'var(--color-foreground, #222)',
          borderColor: 'var(--color-border, #e0e0e0)',
        },
        '.Input:focus': {
          borderColor: 'var(--color-primary, #635bff)',
        },
        '.Input--invalid': {
          color: '#df1b41',
        },
        '.Tab, .Block, .Label': {
          color: 'var(--color-foreground, #222)',
        },
        '::placeholder': {
          color: 'var(--color-muted-foreground, #888)',
        },
      },
    },
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
      <PaymentForm clientSecret={clientSecret!} />
    </Elements>
  );
}
