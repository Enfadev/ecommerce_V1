"use client";

import { Button } from "@/components/ui/button";
import { Order, CreateOrderData } from "@/hooks/use-orders";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Lazy load payment providers untuk reduce initial bundle size
const StripeElementsWrapper = dynamic(() => import("@/components/cart/StripeElementsWrapper"), {
  loading: () => <div className="p-8 text-center">Loading payment gateway...</div>,
  ssr: false,
});

const PayPalButton = dynamic(() => import("@/components/cart/PayPalButton"), {
  loading: () => <div className="p-8 text-center">Loading PayPal...</div>,
  ssr: false,
});

interface FormValidationWarningProps {
  formData: {
    nama: string;
    email: string;
    phone: string;
    alamat: string;
  };
  isValidEmail: (email: string) => boolean;
}

function FormValidationWarning({ formData, isValidEmail }: FormValidationWarningProps) {
  return (
    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
      <p className="text-amber-800 dark:text-amber-200 text-sm font-medium">⚠️ Please complete all required fields before proceeding with payment.</p>
      <ul className="text-xs text-amber-700 dark:text-amber-300 mt-2 ml-4 space-y-1">
        {!formData.nama.trim() && <li>• Full Name is required</li>}
        {!formData.email.trim() && <li>• Email is required</li>}
        {formData.email.trim() && !isValidEmail(formData.email) && <li>• Valid email is required</li>}
        {!formData.phone.trim() && <li>• Phone Number is required</li>}
        {!formData.alamat.trim() && <li>• Full Address is required</li>}
      </ul>
    </div>
  );
}

interface PaymentSectionProps {
  paymentMethod: string;
  isFormValid: boolean;
  formData: {
    nama: string;
    email: string;
    phone: string;
    alamat: string;
    kodePos: string;
    catatan: string;
  };
  isValidEmail: (email: string) => boolean;
  orderData: CreateOrderData;
  total: number;
  creating: boolean;
  onSubmit: () => void;
  onPaymentSuccess: (order: Order) => void;
}

export function PaymentSection({ paymentMethod, isFormValid, formData, isValidEmail, orderData, total, creating, onSubmit, onPaymentSuccess }: PaymentSectionProps) {
  // Credit Card Payment (Stripe)
  if (paymentMethod === "Credit Card") {
    return (
      <div className="pt-4">
        {!isFormValid ? (
          <FormValidationWarning formData={formData} isValidEmail={isValidEmail} />
        ) : (
          <Suspense fallback={<div className="p-8 text-center">Loading Stripe...</div>}>
            <StripeElementsWrapper amount={total} email={formData.email} orderData={{ ...orderData, paymentStatus: "PAID" }} onPaymentSuccess={onPaymentSuccess} />
          </Suspense>
        )}
      </div>
    );
  }

  // E-Wallet Payment (PayPal)
  if (paymentMethod === "E-Wallet") {
    return (
      <div className="pt-4 flex flex-col gap-4">
        {!isFormValid ? (
          <FormValidationWarning formData={formData} isValidEmail={isValidEmail} />
        ) : (
          <Suspense fallback={<div className="p-8 text-center">Loading PayPal...</div>}>
            <PayPalButton total={total} currency="USD" onApprove={async () => onPaymentSuccess({} as Order)} onError={() => {}} />
          </Suspense>
        )}
      </div>
    );
  }

  // Bank Transfer / Cash on Delivery - Traditional checkout
  return (
    <div className="space-y-3">
      {!isFormValid && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
          <p className="text-amber-800 dark:text-amber-200 text-sm flex items-center gap-2">⚠️ Please complete all required fields before placing your order</p>
          <ul className="text-xs text-amber-700 dark:text-amber-300 mt-2 ml-4 space-y-1">
            {!formData.nama.trim() && <li>• Full Name is required</li>}
            {!formData.email.trim() && <li>• Email is required</li>}
            {formData.email.trim() && !isValidEmail(formData.email) && <li>• Valid email is required</li>}
            {!formData.phone.trim() && <li>• Phone Number is required</li>}
            {!formData.alamat.trim() && <li>• Full Address is required</li>}
          </ul>
        </div>
      )}
      <Button type="button" className="w-full" size="lg" disabled={creating || !isFormValid} onClick={onSubmit}>
        {creating ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Processing...
          </div>
        ) : !isFormValid ? (
          "Complete Required Fields"
        ) : (
          `Place Order - $${total.toFixed(2)}`
        )}
      </Button>
    </div>
  );
}
