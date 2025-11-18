"use client";

import { useCart } from "@/components/contexts/CartContext";
import { useAuth } from "@/components/contexts/AuthContext";
import { useOrders, CreateOrderData, Order } from "@/hooks/use-orders";
import { Button } from "@/components/ui/button";
import { AdminBlocker } from "@/components/shared/AdminBlocker";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

// Extracted components
import { ShippingForm } from "./components/ShippingForm";
import { PaymentMethodSelector } from "./components/PaymentMethodSelector";
import { OrderSummary } from "./components/OrderSummary";
import { FormProgress } from "./components/FormProgress";
import { OrderSuccess } from "./components/OrderSuccess";
import { PaymentSection } from "./components/PaymentSection";

// Hooks and utilities
import { useCheckoutForm } from "./hooks/useCheckoutForm";
import { isValidEmail, calculateOrderTotals, getFormCompletionPercentage, isCheckoutFormValid } from "./utils/checkout-helpers";

export default function CheckoutPage() {
  const { items, clearCart, getTotalPrice, getTotalItems } = useCart();
  const { createOrder, creating } = useOrders();
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const { formData, handleInputChange, handlePaymentMethodChange } = useCheckoutForm();
  const router = useRouter();

  const subtotal = getTotalPrice();
  const { shippingFee, tax, total } = calculateOrderTotals(subtotal);
  const formValid = isCheckoutFormValid(formData);
  const completionPercentage = getFormCompletionPercentage(formData);

  useEffect(() => {
    if (items.length === 0 && !submitted) {
      toast.error("Your cart is empty");
      router.push("/product");
    }
  }, [items.length, submitted, router]);

  const handleSubmit = async () => {
    if (!formData.nama || !formData.email || !formData.phone || !formData.alamat) {
      const missingFields = [];
      if (!formData.nama.trim()) missingFields.push("Full Name");
      if (!formData.email.trim()) missingFields.push("Email");
      if (!formData.phone.trim()) missingFields.push("Phone Number");
      if (!formData.alamat.trim()) missingFields.push("Full Address");

      toast.error(`Please complete the following required fields: ${missingFields.join(", ")}`);
      return;
    }
    if (!isValidEmail(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (!formData.paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (formData.paymentMethod === "Credit Card" || formData.paymentMethod === "E-Wallet") {
      return;
    }

    await handleOrderCreation();
  };

  const handleOrderCreation = async (paymentStatus: "PENDING" | "PAID" = "PENDING") => {
    const orderData: CreateOrderData = {
      customerName: formData.nama.trim(),
      customerEmail: formData.email.trim(),
      customerPhone: formData.phone.trim(),
      shippingAddress: formData.alamat.trim(),
      postalCode: formData.kodePos?.trim() || "",
      notes: formData.catatan?.trim() || "",
      paymentMethod: formData.paymentMethod,
      paymentStatus,
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      subtotal,
      shippingFee,
      tax,
      discount: 0,
      totalAmount: total,
    };

    try {
      const newOrder = await createOrder(orderData);
      if (newOrder) {
        setCreatedOrder(newOrder);
        setSubmitted(true);
        clearCart();
        toast.success("Order placed successfully!");
        return newOrder;
      }
    } catch {
      toast.error("Failed to place order. Please try again.");
    }
  };

  const handlePaymentSuccess = async (order: Order) => {
    if (formData.paymentMethod === "E-Wallet") {
      await handleOrderCreation("PAID");
    } else {
      setCreatedOrder(order);
      setSubmitted(true);
      clearCart();
      toast.success("Payment successful!");
    }
  };

  if (user?.role === "ADMIN") {
    return (
      <AdminBlocker
        title="Checkout Access Restricted"
        message="The checkout process is designed for customers to complete their purchases. As an admin, you focus on managing orders, products, and customer service through the admin panel."
      />
    );
  }

  if (submitted) {
    return <OrderSuccess order={createdOrder} />;
  }

  return (
    <div className="bg-background">
      <div>
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="text-muted-foreground">Fill in your information to complete your order</p>

          <FormProgress completionPercentage={completionPercentage} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <ShippingForm formData={formData} onChange={handleInputChange} isValidEmail={isValidEmail} />

              <PaymentMethodSelector selectedMethod={formData.paymentMethod} onMethodChange={handlePaymentMethodChange} />

              <PaymentSection
                paymentMethod={formData.paymentMethod}
                isFormValid={formValid}
                formData={formData}
                isValidEmail={isValidEmail}
                orderData={{
                  customerName: formData.nama.trim(),
                  customerEmail: formData.email.trim(),
                  customerPhone: formData.phone.trim(),
                  shippingAddress: formData.alamat.trim(),
                  postalCode: formData.kodePos?.trim() || "",
                  notes: formData.catatan?.trim() || "",
                  paymentMethod: formData.paymentMethod,
                  items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
                  subtotal,
                  shippingFee,
                  tax,
                  discount: 0,
                  totalAmount: total,
                }}
                total={total}
                creating={creating}
                onSubmit={handleSubmit}
                onPaymentSuccess={handlePaymentSuccess}
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary items={items} subtotal={subtotal} shippingFee={shippingFee} tax={tax} total={total} totalItems={getTotalItems()} />
          </div>
        </div>
      </div>
    </div>
  );
}
