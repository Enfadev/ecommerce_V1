"use client";
import { useEffect, useRef } from "react";

interface PayPalButtonProps {
  total: number;
  currency?: string;
  onApprove: (details: unknown) => void;
  onError?: (err: unknown) => void;
}

// PayPal SDK types
declare global {
  interface Window {
    paypal?: {
      Buttons: (config: {
        createOrder: () => Promise<string>;
        onApprove: (data: { orderID: string }) => Promise<void>;
        onError: (err: unknown) => void;
        style?: {
          layout: string;
          color: string;
          shape: string;
          label: string;
          tagline?: boolean;
          height?: number;
        };
      }) => {
        render: (element: HTMLElement) => void;
      };
    };
  }
}

export default function PayPalButton({ total, currency = "USD", onApprove, onError }: PayPalButtonProps) {
  const paypalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const currentRef = paypalRef.current;
    if (!currentRef) return;
    
    currentRef.innerHTML = "";
    
    // Check if PayPal client ID is available
    if (!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
      console.error("NEXT_PUBLIC_PAYPAL_CLIENT_ID is not configured");
      if (onError) onError({ message: "PayPal client ID is not configured" });
      return;
    }
    
    // Suppress PayPal SDK console errors
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    
    const suppressPayPalErrors = (...args: unknown[]) => {
      const message = args[0];
      if (typeof message === 'string' && (
        message.includes('paypal_js_sdk') || 
        message.includes('unhandled_exception') ||
        message.includes('global_session_not_found')
      )) {
        // Suppress PayPal SDK internal errors
        return;
      }
      originalConsoleError(...args);
    };
    
    const suppressPayPalWarnings = (...args: unknown[]) => {
      const message = args[0];
      if (typeof message === 'string' && message.includes('paypal')) {
        return;
      }
      originalConsoleWarn(...args);
    };
    
    console.error = suppressPayPalErrors;
    console.warn = suppressPayPalWarnings;
    
    if (!window.paypal) {
      const script = document.createElement("script");
      // More comprehensive disable funding to force PayPal balance only
      script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=${currency}&disable-funding=card,credit,paylater,bancontact,blik,eps,giropay,ideal,mercadopago,mybank,p24,sepa,sofort,venmo&enable-funding=paypal`;
      script.async = true;
      script.onload = () => {
        try {
          renderButton();
        } catch (error) {
          console.log('PayPal button render error (suppressed):', error);
          if (onError) onError(error);
        }
      };
      script.onerror = () => {
        console.error("Failed to load PayPal SDK");
        if (onError) onError({ message: "Failed to load PayPal SDK" });
      };
      document.body.appendChild(script);
      return;
    }
    
    try {
      renderButton();
    } catch (error) {
      console.log('PayPal button initialization error (suppressed):', error);
      if (onError) onError(error);
    }
    
    function renderButton() {
      if (!currentRef || !window.paypal) return;
      
      console.log('PayPal SDK loaded, rendering button...');
      
      window.paypal.Buttons({
        createOrder: async () => {
          try {
            console.log('Creating PayPal order with:', { total, currency });
            const res = await fetch("/api/checkout/paypal-create-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ total, currency }),
            });
            const data = await res.json();
            console.log('PayPal create order response:', data);
            if (!res.ok || !data.id) {
              const errorMessage = data.error || 'Failed to create PayPal order';
              if (onError) onError({ message: errorMessage });
              throw new Error(errorMessage);
            }
            return data.id;
          } catch (error) {
            console.error("PayPal createOrder error:", error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to create PayPal order';
            if (onError) onError({ message: errorMessage });
            throw error;
          }
        },
        onApprove: async (data: { orderID: string }) => {
          try {
            const res = await fetch("/api/checkout/paypal-capture-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderID: data.orderID }),
            });
            const details = await res.json();
            if (!res.ok) {
              const errorMessage = details.error || 'Failed to capture PayPal payment';
              if (onError) onError({ message: errorMessage });
              return;
            }
            onApprove(details);
          } catch (error) {
            console.error("PayPal onApprove error:", error);
            if (onError) onError(error);
          }
        },
        onError: (err: unknown) => {
          console.error("PayPal button error:", err);
          if (onError) onError(err);
        },
        style: { 
          layout: "horizontal", 
          color: "black", 
          shape: "rect", 
          label: "pay",
          tagline: false,
          height: 48
        },
      }).render(currentRef);
    }
    
    return () => {
      if (currentRef) currentRef.innerHTML = "";
      // Restore original console methods
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, [total, currency, onApprove, onError]);
  
  return (
    <div className="paypal-button-wrapper w-full rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 overflow-hidden border border-border/50">
      <div ref={paypalRef} />
    </div>
  );
}
