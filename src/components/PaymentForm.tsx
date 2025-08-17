"use client";

import { CreateOrderData, Order } from "../hooks/use-orders";

interface PaymentFormProps {
  clientSecret: string;
  orderData: CreateOrderData;
  onPaymentSuccess?: (order: Order) => void;
}

import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useOrders } from "../hooks/use-orders";
import { useCart } from "./cart-context";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function PaymentForm({ clientSecret, orderData, onPaymentSuccess }: PaymentFormProps) {
  const { createOrder } = useOrders();
  const { clearCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

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
      // Buat order ke backend dan kosongkan cart, lalu redirect
      try {
        const newOrder = await createOrder(orderData);
        await clearCart();
        setCreatedOrder(newOrder);
        
        // Jika ada callback, panggil callback dan jangan tampilkan UI success lokal
        if (onPaymentSuccess && newOrder) {
          onPaymentSuccess(newOrder);
          return;
        }
        
        // Fallback jika tidak ada callback
        setSuccess(true);
      } catch {
        setError("Payment succeeded but failed to create order. Please contact support.");
      }
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <main className="max-w-2xl mx-auto px-4 py-16">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
              <p className="text-muted-foreground mb-6">
                Thank you for your payment. Your order has been placed successfully and we will send confirmation to your email soon.
              </p>
              
              {createdOrder && (
                <div className="bg-muted/30 rounded-lg p-4 mb-6 text-left">
                  <h3 className="font-semibold mb-2">Order Details</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Order Number:</span>
                      <span className="font-mono">{createdOrder.orderNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Amount:</span>
                      <span className="font-semibold">${createdOrder.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Method:</span>
                      <span>{createdOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge variant="secondary">{createdOrder.status}</Badge>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/order-history">View Orders</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

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
