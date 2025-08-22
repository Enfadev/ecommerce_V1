"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAuth } from "./auth-context";

export function NextAuthSync({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { user, refreshUser, signOut } = useAuth();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "authenticated" && session?.user) {
      if (!user || user.email !== session.user.email) {
        refreshUser();
      }
    } else if (status === "unauthenticated" && user) {
      signOut();
    }
  }, [session, status, user, refreshUser, signOut]);

  return <>{children}</>;
}
