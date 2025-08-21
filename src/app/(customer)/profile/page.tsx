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
import { User, Phone, MapPin, Calendar, Settings, LogOut, Camera, Save, Shield, Package, Heart, Edit3, Crown } from "lucide-react";
import { useAuth } from "@/components/auth-context";
import { Toast } from "@/components/ui/toast";
import ProductRecommendation from "@/components/ProductRecommendation";

const profileSchema = z.object({
  name: z.string().min(2, { message: "Nama minimal 2 karakter" }),
  email: z.string().email({ message: "Email tidak valid" }),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  dateOfBirth: z.string().optional(),
  image: z.string().url({ message: "URL avatar tidak valid" }).optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, { message: "Password lama minimal 6 karakter" }),
    newPassword: z.string().min(8, { message: "Password baru minimal 8 karakter" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateProfile, signOut, isLoading, isAuthenticated } = useAuth();
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  });

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      address: "",
      dateOfBirth: "",
      image: "",
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
        image: user.avatar || "",
      });
    }
  }, [user, profileForm]);

  async function onProfileSubmit(values: ProfileValues) {
    try {
      const success = await updateProfile(values);

      if (success) {
        setToast({
          show: true,
          message: "Profil berhasil diperbarui!",
          type: "success",
        });
      } else {
        setToast({
          show: true,
          message: "Gagal memperbarui profil. Silakan coba lagi.",
          type: "error",
        });
      }
    } catch {
      setToast({
        show: true,
        message: "Terjadi kesalahan saat memperbarui profil",
        type: "error",
      });
    }
  }

  async function onPasswordSubmit(values: PasswordValues) {
    try {
      // Call the change password API
      console.log("Password change values:", values); // For future implementation

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
          message: "Password berhasil diubah!",
          type: "success",
        });
        passwordForm.reset();
      } else {
        const errorData = await res.json();
        setToast({
          show: true,
          message: errorData.error || "Gagal mengubah password",
          type: "error",
        });
      }
    } catch {
      setToast({
        show: true,
        message: "Terjadi kesalahan saat mengubah password",
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

  const updateAvatar = () => {
    if (user?.name) {
      const newAvatarUrl = generateAvatarUrl(user.name);
      profileForm.setValue("image", newAvatarUrl);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto" />
          <p className="text-gray-400">Memuat profil...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
      {toast.show && <Toast title={toast.type === "success" ? "Berhasil!" : "Error!"} description={toast.message} variant={toast.type} onClose={() => setToast({ ...toast, show: false })} />}

      <div>
        {/* Header Profile */}
        <Card className="mb-8 bg-gray-800/80 backdrop-blur-sm border-gray-700 shadow-2xl">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-600 shadow-xl">
                  <Image src={profileForm.watch("image") || user.avatar || generateAvatarUrl(user.name)} alt="Avatar" className="w-full h-full object-cover" width={128} height={128} />
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
                      <span>Bergabung {new Date(user.createdAt).getFullYear()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Link href="/order-history">
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Package className="h-4 w-4 mr-2" />
                    Pesanan
                  </Button>
                </Link>
                <Link href="/wishlist">
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Heart className="h-4 w-4 mr-2" />
                    Wishlist
                  </Button>
                </Link>
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
                  Profil
                </TabsTrigger>
                <TabsTrigger value="security" className="data-[state=active]:bg-gray-700">
                  <Shield className="h-4 w-4 mr-2" />
                  Keamanan
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-gray-700">
                  <Settings className="h-4 w-4 mr-2" />
                  Pengaturan
                </TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile">
                <Card className="bg-gray-800/80 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Edit3 className="h-5 w-5" />
                      Edit Profil
                    </CardTitle>
                    <CardDescription className="text-gray-400">Perbarui informasi profil Anda</CardDescription>
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
                                <FormLabel className="text-gray-200">Nama Lengkap</FormLabel>
                                <FormControl>
                                  <Input placeholder="Nama lengkap" className="bg-gray-700/50 border-gray-600 text-white" {...field} />
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
                                <FormLabel className="text-gray-200">Nomor Telepon</FormLabel>
                                <FormControl>
                                  <Input placeholder="+62 812 3456 7890" className="bg-gray-700/50 border-gray-600 text-white" {...field} />
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
                                <FormLabel className="text-gray-200">Tanggal Lahir</FormLabel>
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
                              <FormLabel className="text-gray-200">Alamat</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Alamat lengkap Anda" className="bg-gray-700/50 border-gray-600 text-white resize-none" rows={3} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={profileForm.control}
                          name="image"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-200">URL Avatar</FormLabel>
                              <FormControl>
                                <Input type="url" placeholder="https://example.com/avatar.jpg" className="bg-gray-700/50 border-gray-600 text-white" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                          <Save className="h-4 w-4 mr-2" />
                          Simpan Perubahan
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
                      Keamanan Akun
                    </CardTitle>
                    <CardDescription className="text-gray-400">Kelola password dan keamanan akun Anda</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-200">Password Lama</FormLabel>
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
                              <FormLabel className="text-gray-200">Password Baru</FormLabel>
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
                              <FormLabel className="text-gray-200">Konfirmasi Password Baru</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" className="bg-gray-700/50 border-gray-600 text-white" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                          <Shield className="h-4 w-4 mr-2" />
                          Ubah Password
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <Card className="bg-gray-800/80 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Pengaturan Akun
                    </CardTitle>
                    <CardDescription className="text-gray-400">Kelola preferensi dan pengaturan akun</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                        <div>
                          <h4 className="text-white font-medium">Notifikasi Email</h4>
                          <p className="text-gray-400 text-sm">Terima update tentang pesanan dan promosi</p>
                        </div>
                        <Button variant="outline" size="sm" className="border-gray-600">
                          Aktif
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                        <div>
                          <h4 className="text-white font-medium">Notifikasi Push</h4>
                          <p className="text-gray-400 text-sm">Terima notifikasi langsung di browser</p>
                        </div>
                        <Button variant="outline" size="sm" className="border-gray-600">
                          Nonaktif
                        </Button>
                      </div>
                    </div>

                    <Separator className="bg-gray-600" />

                    <div className="space-y-4">
                      <Button variant="destructive" className="w-full" onClick={handleSignOut}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Keluar dari Akun
                      </Button>
                    </div>
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
                <CardTitle className="text-white text-lg">Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/order-history">
                  <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Package className="h-4 w-4 mr-2" />
                    Riwayat Pesanan
                  </Button>
                </Link>
                <Link href="/wishlist">
                  <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Heart className="h-4 w-4 mr-2" />
                    Daftar Keinginan
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Settings className="h-4 w-4 mr-2" />
                  Pengaturan
                </Button>
              </CardContent>
            </Card>

            {/* Account Stats */}
            <Card className="bg-gray-800/80 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Statistik Akun</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Pesanan</span>
                  <Badge variant="secondary" className="bg-blue-600">
                    12
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Item di Wishlist</span>
                  <Badge variant="secondary" className="bg-red-600">
                    5
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Points Reward</span>
                  <Badge variant="secondary" className="bg-green-600">
                    2,450
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Product Recommendations */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Rekomendasi Untuk Anda</h2>
          <ProductRecommendation maxItems={4} />
        </div>
      </div>
    </div>
  );
}
