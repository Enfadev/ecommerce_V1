import { ReactNode } from "react";

interface CustomerLayoutProps {
  children: ReactNode;
}

export default function CustomerLayout({ children }: CustomerLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Customer-specific layout wrapper */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
