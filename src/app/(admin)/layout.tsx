import { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Admin-specific layout wrapper */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
