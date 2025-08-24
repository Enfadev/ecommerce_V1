"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { User, Phone, MapPin, Calendar, LogOut, Camera, Save, Shield, Package, Heart, Edit3, Crown } from "lucide-react";
import { useAuth } from "@/components/auth-context";
import { useWishlist } from "@/components/wishlist-context";
import { Toast } from "@/components/ui/toast";

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, { message: "Current password must be at least 6 characters" }),
    newPassword: z.string().min(8, { message: "New password must be at least 8 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Password confirmation doesn't match",
    path: ["confirmPassword"],
  });

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateProfile, signOut, isLoading, isAuthenticated } = useAuth();
  const { getWishlistCount } = useWishlist();
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [userStats, setUserStats] = useState<{ totalOrders: number; wishlistItems: number }>({
    totalOrders: 0,
    wishlistItems: 0,
  });

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
    const fetchUserStats = async () => {
      try {
        const response = await fetch('/api/user/stats');
        if (response.ok) {
          const stats = await response.json();
          setUserStats({
            totalOrders: stats.totalOrders,
            wishlistItems: getWishlistCount(), // Get from context since wishlist is stored in localStorage
          });
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    if (user) {
      profileForm.reset({
        name: user.name || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        address: user.address || "",
        dateOfBirth: user.dateOfBirth || "",
      });
      
      // Set image preview dari user avatar yang ada
      setImagePreview(user.avatar || generateAvatarUrl(user.name));

      // Fetch user statistics
      fetchUserStats();
    }
  }, [user, profileForm, getWishlistCount]);

  async function onProfileSubmit(values: ProfileValues) {
    try {
      let avatarUrl = user?.avatar;

      // If there's a selected image, upload it first
      if (selectedImage) {
        console.log("📤 Uploading image:", selectedImage.name);
        const formData = new FormData();
        formData.append('image', selectedImage);

        const uploadResponse = await fetch('/api/upload-avatar', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        console.log("📤 Upload response status:", uploadResponse.status);

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          console.log("✅ Upload successful:", uploadData);
          avatarUrl = uploadData.url;
        } else {
          const errorData = await uploadResponse.json();
          console.error("❌ Upload failed:", errorData);
          setToast({
            show: true,
            message: errorData.error || "Failed to upload image. Please try again.",
            type: "error",
          });
          return;
        }
      }

      // Update profile with new data (including avatar URL if uploaded)
      const profileData = { ...values, avatar: avatarUrl };
      const success = await updateProfile(profileData);

      if (success) {
        setToast({
          show: true,
          message: "Profile updated successfully!",
          type: "success",
        });
        setSelectedImage(null); // Clear selected image after successful update
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

  const generateAvatarUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=200`;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validasi tipe file
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setToast({
          show: true,
          message: "Please select a valid image file (JPEG, PNG, or WebP)",
          type: "error",
        });
        return;
      }

      // Validasi ukuran file (max 5MB)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setToast({
          show: true,
          message: "Image size must be less than 5MB",
          type: "error",
        });
        return;
      }

      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateAvatar = () => {
    if (user?.name) {
      const newAvatarUrl = generateAvatarUrl(user.name);
      setImagePreview(newAvatarUrl);
      setSelectedImage(null);
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
        <Card className="mb-8 bg-gray-800/80 backdrop-blur-sm border-gray-700 shadow-2xl">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-600 shadow-xl">
                  <Image src={imagePreview || user.avatar || generateAvatarUrl(user.name)} alt="Avatar" className="w-full h-full object-cover" width={128} height={128} />
                </div>
                <Button size="sm" variant="secondary" className="absolute bottom-2 right-2 rounded-full p-2 bg-gray-700 hover:bg-gray-600 border-gray-600" onClick={updateAvatar}>
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                  <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                  {user.role === "ADMIN" && (
                    <Badge variant="secondary" className="bg-blue-600 text-white">
                      <Crown className="h-3 w-3 mr-1" />
                      Admin
                    </Badge>
                  )}
                </div>
                <p className="text-gray-400 text-lg mb-4">{user.email}</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  {user.phoneNumber && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Phone className="h-4 w-4" />
                      <span>{user.phoneNumber}</span>
                    </div>
                  )}
                  {user.address && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="h-4 w-4" />
                      <span>{user.address}</span>
                    </div>
                  )}
                  {user.createdAt && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar className="h-4 w-4" />
                      <span>Joined {new Date(user.createdAt).getFullYear()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <Card className="bg-gray-800/80 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Edit3 className="h-5 w-5" />
                      Edit Profile
                    </CardTitle>
                    <CardDescription className="text-gray-400">Update your profile information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-200">Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Full name" className="bg-gray-700/50 border-gray-600 text-white" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-200">Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="email@example.com" className="bg-gray-700/50 border-gray-600 text-white" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="phoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-200">Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="+1 234 567 8900" className="bg-gray-700/50 border-gray-600 text-white" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={profileForm.control}
                            name="dateOfBirth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-gray-200">Date of Birth</FormLabel>
                                <FormControl>
                                  <Input type="date" className="bg-gray-700/50 border-gray-600 text-white" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={profileForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-200">Address</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Your complete address" className="bg-gray-700/50 border-gray-600 text-white resize-none" rows={3} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="space-y-2">
                          <label className="text-gray-200 text-sm font-medium">Avatar Image</label>
                          <div className="flex items-center gap-4">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="bg-gray-700/50 border border-gray-600 text-white rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                            />
                            <Button type="button" variant="outline" size="sm" onClick={updateAvatar} className="border-gray-600 text-gray-300 hover:bg-gray-700">
                              Generate Avatar
                            </Button>
                          </div>
                          <p className="text-gray-400 text-xs">Upload an image or generate an avatar based on your name</p>
                        </div>

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <Card className="bg-gray-800/80 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Account Security
                    </CardTitle>
                    <CardDescription className="text-gray-400">Manage your password and account security</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-200">Current Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" className="bg-gray-700/50 border-gray-600 text-white" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-200">New Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" className="bg-gray-700/50 border-gray-600 text-white" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-200">Confirm New Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" className="bg-gray-700/50 border-gray-600 text-white" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                          <Shield className="h-4 w-4 mr-2" />
                          Change Password
                        </Button>

                        <Separator className="bg-gray-600" />

                        <Button variant="destructive" className="w-full" onClick={handleSignOut}>
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-gray-800/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/order-history">
                  <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Package className="h-4 w-4 mr-2" />
                    Order History
                  </Button>
                </Link>
                <Link href="/wishlist">
                  <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Heart className="h-4 w-4 mr-2" />
                    Wishlist
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Account Stats */}
            <Card className="bg-gray-800/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Account Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Orders</span>
                  <Badge variant="secondary" className="bg-blue-600">
                    {userStats.totalOrders}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Wishlist Items</span>
                  <Badge variant="secondary" className="bg-red-600">
                    {userStats.wishlistItems}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Recommendations */}
        {/* <ProductRecommendation maxItems={4} /> */}
      </div>
    </div>
  );
}
