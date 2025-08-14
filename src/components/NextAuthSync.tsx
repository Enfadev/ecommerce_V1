"use client";

import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import { useEffect } from "react";
import { useAuth } from "./auth-context";

export function NextAuthSync({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const auth = useAuth();

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "authenticated" && session?.user) {
      // If we have a NextAuth session but no current user, sync it
      if (!auth.user || auth.user.email !== session.user.email) {
        // Set user from NextAuth session
        const userData = {
          id: session.user.id || "",
          name: session.user.name || "",
          email: session.user.email || "",
          role: session.user.role || "USER" as const,
          avatar: session.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.name || "User")}&background=6366f1&color=fff`,
        };
        
        // Use the refreshUser method to update the auth context
        // This is a workaround since we can't directly set the user
        auth.refreshUser();
      }
    } else if (status === "unauthenticated" && auth.user) {
      // If NextAuth is unauthenticated but we have a user, sign out
      auth.signOut();
    }
  }, [session, status, auth]);

  // Override the signOut method to also sign out from NextAuth
  const enhancedAuth = {
    ...auth,
    signOut: async () => {
      await Promise.all([
        auth.signOut(),
        nextAuthSignOut({ redirect: false })
      ]);
    }
  };

  return <>{children}</>;
}
