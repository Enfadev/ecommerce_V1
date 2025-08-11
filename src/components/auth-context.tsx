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
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (name: string, email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get user profile from server (JWT from httpOnly cookie)
  const refreshUser = async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "GET",
        credentials: 'include', // Include cookies
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
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=6366f1&color=fff`,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUser(null);
    }
  };

  // Load user on component mount
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      await refreshUser();
      setIsLoading(false);
    };
    
    loadUser();
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include', // Include cookies
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
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=6366f1&color=fff`,
        });
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const signUp = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include', // Include cookies
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
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=6366f1&color=fff`,
        });
        setIsLoading(false);
        return true;
      } else {
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Sign up error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: 'include', // Include cookies
      });
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
      // Clear user even if API call fails
      setUser(null);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!user) return false;

    setIsLoading(true);
    try {
      // Simulate API call for profile update
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      setIsLoading(false);
      return true;
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
