"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "ADMIN" | "USER";
  phoneNumber?: string;
  address?: string;
  dateOfBirth?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get user profile from server (JWT from httpOnly cookie or NextAuth session)
  const refreshUser = async () => {
    try {
      setIsLoading(true);

      const nextAuthCheck = await fetch("/api/auth/session", {
        method: "GET",
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (nextAuthCheck.ok) {
        const nextAuthData = await nextAuthCheck.json();
        if (nextAuthData.authenticated && nextAuthData.user) {
          setUser({
            id: nextAuthData.user.id,
            name: nextAuthData.user.name,
            email: nextAuthData.user.email,
            role: nextAuthData.user.role,
            phoneNumber: nextAuthData.user.phoneNumber,
            address: nextAuthData.user.address,
            dateOfBirth: nextAuthData.user.dateOfBirth,
            avatar: nextAuthData.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(nextAuthData.user.name)}&background=6366f1&color=fff`,
          });
          console.log("✅ NextAuth user loaded successfully");
          return;
        }
      }

      const authCheck = await fetch("/api/auth/check", {
        method: "GET",
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (!authCheck.ok) {
        console.log("Auth check failed:", authCheck.status);
        setUser(null);
        return;
      }

      const authData = await authCheck.json();
      console.log("🔍 Auth check result:", authData);

      if (!authData.authenticated) {
        console.log("Not authenticated:", authData.error);
        setUser(null);
        return;
      }

      const res = await fetch("/api/profile", {
        method: "GET",
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache",
        },
      });

      if (res.ok) {
        const data = await res.json();
        const userData = data.user;
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          createdAt: userData.createdAt,
          phoneNumber: userData.phoneNumber,
          address: userData.address,
          dateOfBirth: userData.dateOfBirth,
          avatar: userData.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=6366f1&color=fff`,
        });
        console.log("✅ User profile loaded successfully");
      } else {
        console.log("❌ Failed to load user profile:", res.status);
        setUser(null);
      }
    } catch (error) {
      console.error("❌ Error fetching user profile:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      console.log("🔄 Loading user on mount...");
      await refreshUser();
    };

    loadUser();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        const userData = data.user;
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          createdAt: userData.createdAt,
          phoneNumber: userData.phoneNumber,
          address: userData.address,
          dateOfBirth: userData.dateOfBirth,
          avatar: userData.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=6366f1&color=fff`,
        });
        setIsLoading(false);
        return { success: true };
      } else {
        const errorData = await res.json();
        setIsLoading(false);
        return {
          success: false,
          error: errorData.error || `Sign in failed with status ${res.status}`,
        };
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setIsLoading(false);
      return {
        success: false,
        error: "Network error occurred during sign in",
      };
    }
  };

  const signUp = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        const userData = data.user;
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          createdAt: userData.createdAt,
          phoneNumber: userData.phoneNumber,
          address: userData.address,
          dateOfBirth: userData.dateOfBirth,
          avatar: userData.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=6366f1&color=fff`,
        });
        setIsLoading(false);
        return { success: true };
      } else {
        const errorData = await res.json();
        setIsLoading(false);
        return {
          success: false,
          error: errorData.error || `Registration failed with status ${res.status}`,
        };
      }
    } catch (error) {
      console.error("Sign up error:", error);
      setIsLoading(false);
      return {
        success: false,
        error: "Network error occurred during registration",
      };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      if (typeof window !== "undefined") {
        const { signOut: nextAuthSignOut } = await import("next-auth/react");
        await nextAuthSignOut({ redirect: false });
      }

      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
      setUser(null);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    setIsLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: userData.name,
          phoneNumber: userData.phoneNumber,
          address: userData.address,
          dateOfBirth: userData.dateOfBirth,
          image: userData.avatar, // map avatar to image for database
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const updatedUserData = data.user;
        setUser({
          id: updatedUserData.id,
          name: updatedUserData.name,
          email: updatedUserData.email,
          role: updatedUserData.role,
          phoneNumber: updatedUserData.phoneNumber,
          address: updatedUserData.address,
          dateOfBirth: updatedUserData.dateOfBirth,
          avatar: updatedUserData.image,
          createdAt: updatedUserData.createdAt,
        });
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Update profile error:", error);
      setIsLoading(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        isAuthenticated: !!user,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
