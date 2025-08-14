"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAuth } from "../components/auth-context";

export function useNextAuthIntegration() {
  const { data: session, status } = useSession();
  const { setUser, setIsLoading } = useAuth();

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true);
      return;
    }

    if (status === "authenticated" && session?.user) {
      // Convert NextAuth session to our user format
      setUser({
        id: session.user.id || "",
        name: session.user.name || "",
        email: session.user.email || "",
        role: session.user.role || "USER",
        avatar: session.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.name || "User")}&background=6366f1&color=fff`,
      });
      setIsLoading(false);
    } else if (status === "unauthenticated") {
      setUser(null);
      setIsLoading(false);
    }
  }, [session, status, setUser, setIsLoading]);

  return { session, status };
}
