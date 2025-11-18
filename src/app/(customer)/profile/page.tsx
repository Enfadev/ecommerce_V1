"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield } from "lucide-react";
import { useAuth } from "@/components/contexts/AuthContext";
import { Toast } from "@/components/ui/toast";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileInfoForm } from "./components/ProfileInfoForm";
import { PasswordForm } from "./components/PasswordForm";
import { profileSchema, passwordSchema, ProfileValues, PasswordValues, ToastState } from "./types";
import { getValidImageSrc, generateAvatarUrl, validateImageFile, fileToDataUrl, uploadAvatar, deleteAvatar } from "./utils";

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateProfile, signOut, isLoading, isAuthenticated, refreshUser } = useAuth();

  const [toast, setToast] = useState<ToastState>({
    show: false,
    message: "",
    type: "success",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      dateOfBirth: "",
    },
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        dateOfBirth: user.dateOfBirth || "",
      });
      setImagePreview(getValidImageSrc(user.avatar, user.name));
    }
  }, [user, profileForm]);

  async function onProfileSubmit(values: ProfileValues) {
    try {
      let avatarUrl = user?.avatar;

      if (selectedImage) {
        console.log("📤 Uploading image:", selectedImage.name);
        const result = await uploadAvatar(selectedImage);

        if (result.error) {
          setToast({
            show: true,
            message: result.error,
            type: "error",
          });
          return;
        }

        avatarUrl = result.url;
      }

      const profileData = { ...values, avatar: avatarUrl };
      const success = await updateProfile(profileData);

      if (success) {
        setToast({
          show: true,
          message: "Profile updated successfully!",
          type: "success",
        });
        setSelectedImage(null);
      } else {
        setToast({
          show: true,
          message: "Failed to update profile. Please try again.",
          type: "error",
        });
      }
    } catch {
      setToast({
        show: true,
        message: "An error occurred while updating profile",
        type: "error",
      });
    }
  }

  async function onPasswordSubmit(values: PasswordValues) {
    try {
      console.log("Password change values:", values);

      const res = await fetch("/api/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        }),
      });

      if (res.ok) {
        setToast({
          show: true,
          message: "Password changed successfully!",
          type: "success",
        });
        passwordForm.reset();
      } else {
        const errorData = await res.json();
        setToast({
          show: true,
          message: errorData.error || "Failed to change password",
          type: "error",
        });
      }
    } catch {
      setToast({
        show: true,
        message: "An error occurred while changing password",
        type: "error",
      });
    }
  }

  const handleSignOut = () => {
    signOut();
    router.push("/");
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setToast({
        show: true,
        message: validation.error!,
        type: "error",
      });
      return;
    }

    setSelectedImage(file);

    const dataUrl = await fileToDataUrl(file);
    setImagePreview(dataUrl);
  };

  const updateAvatarClick = () => {
    const fileInput = document.getElementById("avatar-upload") as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const generateAvatarClick = () => {
    if (user?.name) {
      const newAvatarUrl = generateAvatarUrl(user.name);
      setImagePreview(newAvatarUrl);
      setSelectedImage(null);
    }
  };

  const deleteAvatarClick = async () => {
    if (!user) return;

    try {
      console.log("🗑️ Deleting avatar...");
      const result = await deleteAvatar();

      if (result.success) {
        const defaultAvatarUrl = generateAvatarUrl(user.name);
        setImagePreview(defaultAvatarUrl);
        setSelectedImage(null);
        await refreshUser();

        setToast({
          show: true,
          message: "Avatar deleted successfully!",
          type: "success",
        });
      } else {
        console.error("❌ Failed to delete avatar:", result.error);
        setToast({
          show: true,
          message: result.error!,
          type: "error",
        });
      }
    } catch (error) {
      console.error("❌ Delete avatar error:", error);
      setToast({
        show: true,
        message: "An error occurred while deleting avatar",
        type: "error",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="py-8">
      {toast.show && <Toast title={toast.type === "success" ? "Success!" : "Error!"} description={toast.message} variant={toast.type} onClose={() => setToast({ ...toast, show: false })} />}

      <div>
        {/* Header Profile */}
        <ProfileHeader user={user} imagePreview={imagePreview} onUpdateAvatar={updateAvatarClick} onDeleteAvatar={deleteAvatarClick} onImageUpload={handleImageUpload} />

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Tabs */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="bg-gray-800 border-gray-700">
                <TabsTrigger value="profile" className="data-[state=active]:bg-gray-700">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="security" className="data-[state=active]:bg-gray-700">
                  <Shield className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <ProfileInfoForm
                  form={profileForm}
                  isLoading={isLoading}
                  hasUploadedAvatar={!!user.avatar && user.avatar.startsWith("/uploads/")}
                  onSubmit={onProfileSubmit}
                  onImageUpload={handleImageUpload}
                  onGenerateAvatar={generateAvatarClick}
                  onDeleteAvatar={deleteAvatarClick}
                />
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <PasswordForm form={passwordForm} onSubmit={onPasswordSubmit} onSignOut={handleSignOut} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6"></div>
        </div>
      </div>
    </div>
  );
}
