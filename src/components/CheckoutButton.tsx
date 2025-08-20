"use client";
import { useState } from "react";

interface CheckoutButtonProps {
  items: Array<{ name: string; price: number; quantity: number }>;
  email: string;
}

export default function CheckoutButton({ items, email }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    const res = await fetch("/api/checkout/stripe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, email }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || "Failed to redirect to payment.");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      style={{
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
      {loading ? "Redirecting..." : "Checkout with Stripe"}
    </button>
  );
}
