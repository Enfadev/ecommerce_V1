import { useSession } from "next-auth/react";
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
  const { data: session, status: nextAuthStatus } = useSession();
  const [customAuth, setCustomAuth] = useState<CustomUser | null>(null);
  const [customLoading, setCustomLoading] = useState(true);

  // Check custom auth (JWT)
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

  // Determine which auth system is active
  const isNextAuthLoading = nextAuthStatus === "loading";
  const hasNextAuthSession = !!session?.user;
  const hasCustomAuth = !!customAuth;

  const loading = isNextAuthLoading || customLoading;
  
  // Prioritize NextAuth if available, otherwise use custom auth
  const user = hasNextAuthSession 
    ? {
        id: session.user.id || '',
        email: session.user.email || '',
        name: session.user.name || '',
        role: session.user.role || 'USER' as const
      }
    : customAuth;

  const isAuthenticated = hasNextAuthSession || hasCustomAuth;

  return {
    user,
    loading,
    isAuthenticated
  };
}
