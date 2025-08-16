"use client";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";

export default function PaymentForm() {
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
      // @ts-ignore
      elements._clientSecret,
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
      <CardElement options={{ hidePostalCode: true }} />
      <button
        type="submit"
        disabled={!stripe || loading}
        style={{
          marginTop: 24,
          background: "#635bff",
          color: "#fff",
          padding: "12px 24px",
          borderRadius: 8,
          fontWeight: 600,
          fontSize: 16,
          border: "none",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
      {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}
    </form>
  );
}
