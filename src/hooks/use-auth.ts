import { useSession } from "@/lib/auth-client";
import { useState, useEffect } from "react";

interface CustomUser {
  id: string;
  email: string;
  name?: string;
  role?: "ADMIN" | "USER";
}

interface AuthState {
  user: CustomUser | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export function useAuth(): AuthState {
  const { data: session, isPending } = useSession();
  const [customAuth, setCustomAuth] = useState<CustomUser | null>(null);
  const [customLoading, setCustomLoading] = useState(true);

  useEffect(() => {
    const checkCustomAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        if (response.ok) {
          const userData = await response.json();
          setCustomAuth(userData.user);
        } else {
          setCustomAuth(null);
        }
      } catch (error) {
        console.error('Error checking custom auth:', error);
        setCustomAuth(null);
      }
      setCustomLoading(false);
    };

    checkCustomAuth();
  }, []);

  const isBetterAuthLoading = isPending;
  const hasBetterAuthSession = !!session?.user;
  const hasCustomAuth = !!customAuth;

  const loading = isBetterAuthLoading || customLoading;
  
  const user = hasBetterAuthSession 
    ? {
        id: session.user.id || '',
        email: session.user.email || '',
        name: session.user.name || '',
        role: (session.user as CustomUser).role || 'USER' as const
      }
    : customAuth;

  const isAuthenticated = hasBetterAuthSession || hasCustomAuth;

  return {
    user,
    loading,
    isAuthenticated
  };
}
