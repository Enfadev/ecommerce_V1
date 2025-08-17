"use client";
import { useEffect, useState } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";


const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

import { CreateOrderData, Order } from "../hooks/use-orders";

interface StripeElementsWrapperProps {
  amount: number; 
  email: string;
  orderData: CreateOrderData;
  onPaymentSuccess?: (order: Order) => void;
}

export default function StripeElementsWrapper({ amount, email, orderData, onPaymentSuccess }: StripeElementsWrapperProps) {
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
      <PaymentForm clientSecret={clientSecret!} orderData={orderData} onPaymentSuccess={onPaymentSuccess} />
    </Elements>
  );
}
