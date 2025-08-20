"use client";
import { useEffect, useRef } from "react";

interface PayPalButtonProps {
  total: number;
  currency?: string;
  onApprove: (details: any) => void;
  onError?: (err: any) => void;
}

  export default function PayPalButton({ total, currency = "USD", onApprove, onError }: PayPalButtonProps) {
    const paypalRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (!paypalRef.current) return;
      paypalRef.current.innerHTML = "";
      if (!(window as any).paypal) {
        const script = document.createElement("script");
        script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=${currency}&disable-funding=card`;
        script.async = true;
        script.onload = () => renderButton();
        document.body.appendChild(script);
        return;
      }
      renderButton();
      function renderButton() {
        if (!paypalRef.current) return;
        (window as any).paypal.Buttons({
          createOrder: async () => {
            const res = await fetch("/api/checkout/paypal-create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ total, currency }),
            });
            const data = await res.json();
            return data.id;
          },
          onApprove: async (data: any) => {
            const res = await fetch("/api/checkout/paypal-capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderID: data.orderID }),
            });
            const details = await res.json();
            onApprove(details);
          },
          onError: (err: any) => {
            if (onError) onError(err);
          },
          style: { layout: "vertical", color: "gold", shape: "rect", label: "paypal" },
        }).render(paypalRef.current);
      }
      return () => {
        if (paypalRef.current) paypalRef.current.innerHTML = "";
      };
    }, [total, currency, onApprove, onError]);
    return <div ref={paypalRef} />;
  }
