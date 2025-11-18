import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | Complete Your Order",
  description: "Securely complete your purchase with our easy checkout process",
  openGraph: {
    title: "Checkout | Complete Your Order",
    description: "Complete your purchase securely and easily",
  },
};

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
