"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";
import { signIn as betterAuthSignIn, signUp as betterAuthSignUp, signOut as betterAuthSignOut, useSession } from "@/lib/auth-client";

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
  const { data: session, isPending } = useSession();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUserData = async () => {
      if (session?.user) {
        try {
          const response = await fetch("/api/profile", {
            credentials: "include",
          });
          if (response.ok) {
            const data = await response.json();
            setUser({
              id: session.user.id,
              name: session.user.name || "",
              email: session.user.email || "",
              role: (data.user?.role as "ADMIN" | "USER") || "USER",
              phoneNumber: data.user?.phoneNumber,
              address: data.user?.address,
              dateOfBirth: data.user?.dateOfBirth,
              avatar: session.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.name || "User")}&background=6366f1&color=fff`,
            });
          }
        } catch (error) {
          console.error("Error loading user data:", error);
          setUser({
            id: session.user.id,
            name: session.user.name || "",
            email: session.user.email || "",
            role: "USER",
            avatar: session.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.name || "User")}&background=6366f1&color=fff`,
          });
        }
      } else {
        setUser(null);
      }
    };
    
    loadUserData();
  }, [session?.user]);

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch("/api/profile", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        if (data.user && session?.user) {
          setUser({
            id: session.user.id,
            name: session.user.name || "",
            email: session.user.email || "",
            role: (data.user.role as "ADMIN" | "USER") || "USER",
            phoneNumber: data.user.phoneNumber,
            address: data.user.address,
            dateOfBirth: data.user.dateOfBirth,
            avatar: session.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.name || "User")}&background=6366f1&color=fff`,
          });
        }
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  }, [session?.user]);

  const signIn = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await betterAuthSignIn.email({
        email,
        password,
      });

      if (response.data?.user) {
        try {
          const profileResponse = await fetch("/api/profile", {
            credentials: "include",
          });
          let role = "USER";
          let phoneNumber, address, dateOfBirth;
          
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            role = profileData.user?.role || "USER";
            phoneNumber = profileData.user?.phoneNumber;
            address = profileData.user?.address;
            dateOfBirth = profileData.user?.dateOfBirth;
          }

          setUser({
            id: response.data.user.id,
            name: response.data.user.name || "",
            email: response.data.user.email || "",
            role: role as "ADMIN" | "USER",
            phoneNumber,
            address,
            dateOfBirth,
            avatar: response.data.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(response.data.user.name || "User")}&background=6366f1&color=fff`,
          });
        } catch (error) {
          console.error("Error fetching user profile after sign in:", error);
          setUser({
            id: response.data.user.id,
            name: response.data.user.name || "",
            email: response.data.user.email || "",
            role: "USER",
            avatar: response.data.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(response.data.user.name || "User")}&background=6366f1&color=fff`,
          });
        }
        return { success: true };
      } else {
        return {
          success: false,
          error: response.error?.message || "Sign in failed",
        };
      }
    } catch (error) {
      console.error("Sign in error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error occurred during sign in",
      };
    }
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await betterAuthSignUp.email({
        email,
        password,
        name,
      });

      if (response.data?.user) {
        try {
          const profileResponse = await fetch("/api/profile", {
            credentials: "include",
          });
          let role = "USER";
          let phoneNumber, address, dateOfBirth;
          
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            role = profileData.user?.role || "USER";
            phoneNumber = profileData.user?.phoneNumber;
            address = profileData.user?.address;
            dateOfBirth = profileData.user?.dateOfBirth;
          }

          setUser({
            id: response.data.user.id,
            name: response.data.user.name || "",
            email: response.data.user.email || "",
            role: role as "ADMIN" | "USER",
            phoneNumber,
            address,
            dateOfBirth,
            avatar: response.data.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(response.data.user.name || "User")}&background=6366f1&color=fff`,
          });
        } catch (error) {
          console.error("Error fetching user profile after sign up:", error);
          setUser({
            id: response.data.user.id,
            name: response.data.user.name || "",
            email: response.data.user.email || "",
            role: "USER",
            avatar: response.data.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(response.data.user.name || "User")}&background=6366f1&color=fff`,
          });
        }
        return { success: true };
      } else {
        return {
          success: false,
          error: response.error?.message || "Registration failed",
        };
      }
    } catch (error) {
      console.error("Sign up error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error occurred during registration",
      };
    }
  }, []);

  const handleSignOut = useCallback(async (): Promise<void> => {
    try {
      await betterAuthSignOut();
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
      setUser(null);
    }
  }, []);

  const updateProfile = useCallback(async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false;

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
          image: userData.avatar,
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
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Update profile error:", error);
      return false;
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading: isPending,
        signIn,
        signUp,
        signOut: handleSignOut,
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
