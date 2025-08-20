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
      // If we have a NextAuth session but no current user, or different user, sync it
      if (!user || user.email !== session.user.email) {
        // Refresh user data from auth context (it handles NextAuth sessions internally)
        refreshUser();
      }
    } else if (status === "unauthenticated" && user) {
      // If NextAuth is unauthenticated but we have a user, sign out
      signOut();
    }
  }, [session, status, user, refreshUser, signOut]);

  return <>{children}</>;
}
