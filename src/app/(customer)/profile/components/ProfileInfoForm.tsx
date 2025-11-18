"use client";

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Save, Edit3 } from "lucide-react";
import { ProfileValues } from "../types";
import { AvatarManager } from "./AvatarManager";

interface ProfileInfoFormProps {
  form: UseFormReturn<ProfileValues>;
  isLoading: boolean;
  hasUploadedAvatar: boolean;
  onSubmit: (values: ProfileValues) => Promise<void>;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerateAvatar: () => void;
  onDeleteAvatar: () => void;
}

export function ProfileInfoForm({ form, isLoading, hasUploadedAvatar, onSubmit, onImageUpload, onGenerateAvatar, onDeleteAvatar }: ProfileInfoFormProps) {
  return (
    <Card className="bg-gray-800/80 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Edit3 className="h-5 w-5" />
          Edit Profile
        </CardTitle>
        <CardDescription className="text-gray-400">Update your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name and Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
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
                control={form.control}
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

            {/* Phone and Date of Birth Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
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
                control={form.control}
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

            {/* Address Field */}
            <FormField
              control={form.control}
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

            {/* Avatar Manager */}
            <AvatarManager hasUploadedAvatar={hasUploadedAvatar} onImageUpload={onImageUpload} onGenerateAvatar={onGenerateAvatar} onDeleteAvatar={onDeleteAvatar} />

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2 text-white" />
              <span className="text-white font-medium">Save Changes</span>
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
