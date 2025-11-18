"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Shield, LogOut } from "lucide-react";
import { PasswordValues } from "../types";

interface PasswordFormProps {
  form: UseFormReturn<PasswordValues>;
  onSubmit: (values: PasswordValues) => Promise<void>;
  onSignOut: () => void;
}

export function PasswordForm({ form, onSubmit, onSignOut }: PasswordFormProps) {
  return (
    <Card className="bg-gray-800/80 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Account Security
        </CardTitle>
        <CardDescription className="text-gray-400">Manage your password and account security</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Current Password */}
            <FormField
              control={form.control}
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

            {/* New Password */}
            <FormField
              control={form.control}
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

            {/* Confirm New Password */}
            <FormField
              control={form.control}
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

            {/* Change Password Button */}
            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
              <Shield className="h-4 w-4 mr-2" />
              Change Password
            </Button>

            <Separator className="bg-gray-600" />

            {/* Sign Out Button */}
            <Button variant="destructive" className="w-full" onClick={onSignOut} type="button">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
