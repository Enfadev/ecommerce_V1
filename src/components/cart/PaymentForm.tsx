"use client";

import { CreateOrderData, Order } from "../../hooks/use-orders";

interface PaymentFormProps {
  clientSecret: string;
  orderData: CreateOrderData;
  onPaymentSuccess?: (order: Order) => void;
}

import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { useOrders } from "../../hooks/use-orders";
import { useCart } from "../contexts/cart-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, CreditCard, Shield, Lock } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });
    if (error) {
      setError(error.message || "Payment failed");
      setLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      try {
        const completeOrderData = {
          ...orderData,
          paymentMethod: "Credit Card",
          paymentStatus: "PAID" as const,
        };

        console.log("Creating order with data:", completeOrderData);

        const newOrder = await createOrder(completeOrderData);
        await clearCart();
        setCreatedOrder(newOrder);

        if (onPaymentSuccess && newOrder) {
          onPaymentSuccess(newOrder);
          return;
        }

        setSuccess(true);
      } catch (error) {
        console.error("Order creation error:", error);
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
              <p className="text-muted-foreground mb-6">Thank you for your payment. Your order has been placed successfully and we will send confirmation to your email soon.</p>

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Shield className="h-4 w-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>

          <div className="border rounded-lg p-4 bg-background min-h-[60px] relative">
            {!stripe || !elements ? (
              <div className="flex items-center justify-center h-12 text-muted-foreground">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Loading payment form...
              </div>
            ) : (
              <div className="w-full">
                <CardElement
                  options={{
                    hidePostalCode: true,
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#ffffff",
                        fontFamily: "system-ui, sans-serif",
                        "::placeholder": {
                          color: "#9ca3af",
                        },
                        iconColor: "#ffffff",
                        padding: "10px 12px",
                      },
                      invalid: {
                        color: "#ef4444",
                        iconColor: "#ef4444",
                      },
                      complete: {
                        color: "#ffffff",
                        iconColor: "#10b981",
                      },
                    },
                  }}
                />
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={!stripe || loading} onClick={handleSubmit}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing Payment...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Pay Securely
              </>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-1">
              <Shield className="h-3 w-3" />
              <span>Powered by Stripe - Your payment is secure</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
