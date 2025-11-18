"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/contexts/AuthContext";

export interface CheckoutFormData {
  nama: string;
  email: string;
  phone: string;
  alamat: string;
  kodePos: string;
  catatan: string;
  paymentMethod: string;
}

const initialFormData: CheckoutFormData = {
  nama: "",
  email: "",
  phone: "",
  alamat: "",
  kodePos: "",
  catatan: "",
  paymentMethod: "Bank Transfer",
};

export function useCheckoutForm() {
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<CheckoutFormData>(initialFormData);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && isAuthenticated) {
        setFormData((prev) => ({
          ...prev,
          nama: user.name || "",
          email: user.email || "",
          phone: user.phoneNumber || "",
          alamat: user.address || "",
        }));
        return;
      }

      try {
        const response = await fetch("/api/profile");
        if (response.ok) {
          const profile = await response.json();
          if (profile) {
            setFormData((prev) => ({
              ...prev,
              nama: profile.name || "",
              email: profile.email || "",
              phone: profile.phoneNumber || "",
              alamat: profile.address || "",
            }));
          }
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
  }, [user, isAuthenticated]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePaymentMethodChange = (method: string) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: method,
    }));
  };

  return {
    formData,
    handleInputChange,
    handlePaymentMethodChange,
  };
}
