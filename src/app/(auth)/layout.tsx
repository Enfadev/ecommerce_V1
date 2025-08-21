import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen">
      {/* Back to Home Button */}
      <div className="absolute top-4 left-4 z-10">
        <Link href="/">
          <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-muted/50 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Button>
        </Link>
      </div>

      {/* Auth-specific layout wrapper */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-7xl">{children}</div>
      </div>
    </div>
  );
}
