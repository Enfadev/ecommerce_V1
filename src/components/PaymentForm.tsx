"use client";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";

interface PaymentFormProps {
  clientSecret: string;
}

export default function PaymentForm({ clientSecret }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!stripe || !elements) {
      setLoading(false);
      return;
    }
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setLoading(false);
      setError("Card element not found.");
      return;
    }
    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );
    if (error) {
      setError(error.message || "Payment failed");
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) return <div>Payment successful! Thank you.</div>;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "0 auto" }}>
      <div style={{
        background: 'var(--color-card, #fff)',
        border: '1px solid var(--color-border, #e0e0e0)',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
      }}>
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                color: 'var(--color-foreground, #222)',
                fontFamily: 'var(--font-sans, sans-serif)',
                fontSize: '16px',
                '::placeholder': {
                  color: 'var(--color-muted-foreground, #888)',
                },
                backgroundColor: 'var(--color-card, #fff)',
              },
              invalid: {
                color: '#df1b41',
              },
            },
          }}
        />
      </div>
      <button
        type="submit"
        disabled={!stripe || loading}
        style={{
          marginTop: 8,
          background: 'var(--color-primary, #635bff)',
          color: 'var(--color-primary-foreground, #fff)',
          padding: '12px 24px',
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 16,
          border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
      {error && <div style={{ color: '#df1b41', marginTop: 12 }}>{error}</div>}
    </form>
  );
}
