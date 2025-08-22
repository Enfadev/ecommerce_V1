"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, ShoppingBag, ArrowRight } from "lucide-react";
import { useAuth } from "@/components/auth-context";
import { Toast } from "@/components/ui/toast";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().optional(),
});

type SignInValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const router = useRouter();
  const { signIn, isLoading, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({
    show: false,
    message: "",
    type: "success",
  });

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  async function onSubmit(values: SignInValues) {
    try {
      const success = await signIn(values.email, values.password);

      if (success) {
        setToast({
          show: true,
          message: "Sign in successful! Redirecting...",
          type: "success",
        });

        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        setToast({
          show: true,
          message: "Incorrect email or password.",
          type: "error",
        });
      }
    } catch {
      setToast({
        show: true,
        message: "An error occurred during sign in.",
        type: "error",
      });
    }
  }


  return (
    <div className="flex items-center justify-center p-4">
      {toast.show && <Toast title={toast.type === "success" ? "Success!" : "Error!"} description={toast.message} variant={toast.type} onClose={() => setToast({ ...toast, show: false })} />}

      <div className="w-full max-w-lg">
        {/* Header with Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-xl mb-4 shadow-lg">
            <ShoppingBag className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome</h1>
          <p className="text-gray-400">Sign in to your account to continue</p>
        </div>

        <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700 shadow-2xl">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-white text-center">Sign In</CardTitle>
            <CardDescription className="text-gray-400 text-center">Enter your email and password</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input type="email" placeholder="your@email.com" className="pl-10 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-200">Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="pl-10 pr-10 bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                          />
                          <Button type="button" variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1 hover:bg-gray-600" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="rememberMe" className="rounded border-gray-600 bg-gray-700" {...form.register("rememberMe")} />
                    <label htmlFor="rememberMe" className="text-sm text-gray-300">
                      Remember me
                    </label>
                  </div>
                  <Link href="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300 hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200 transform hover:scale-[1.02]" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>
            </Form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-800 px-2 text-gray-400">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In Button */}
            <GoogleSignInButton disabled={isLoading} />

            {/* ...existing code... */}
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-gray-400">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors">
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
