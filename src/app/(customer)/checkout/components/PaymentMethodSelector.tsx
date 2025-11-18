"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard } from "lucide-react";

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

const paymentMethods = [
  {
    id: "Bank Transfer",
    label: "Bank Transfer",
    description: "Pay via bank transfer (manual confirmation)",
  },
  {
    id: "E-Wallet",
    label: "E-Wallet",
    description: "Fast & secure digital payment",
  },
  {
    id: "Credit Card",
    label: "Credit Card",
    description: "Visa, Mastercard, JCB",
  },
  {
    id: "Cash on Delivery",
    label: "Cash on Delivery",
    description: "Pay when package arrives",
  },
];

export function PaymentMethodSelector({ selectedMethod, onMethodChange }: PaymentMethodSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-primary" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${selectedMethod === method.id ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"}`}
              onClick={() => onMethodChange(method.id)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${selectedMethod === method.id ? "bg-primary" : "bg-muted"}`}></div>
                <div>
                  <p className="font-medium">{method.label}</p>
                  <p className="text-sm text-muted-foreground">{method.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
