"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "@/components/shared/ProfileAvatar";
import { Phone, MapPin, Calendar, Camera, Trash2, Crown } from "lucide-react";
import { User } from "../types";

interface ProfileHeaderProps {
  user: User;
  imagePreview: string;
  onUpdateAvatar: () => void;
  onDeleteAvatar: () => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileHeader({ user, imagePreview, onUpdateAvatar, onDeleteAvatar, onImageUpload }: ProfileHeaderProps) {
  const hasUploadedAvatar = user.avatar && user.avatar.startsWith("/uploads/");

  return (
    <Card className="mb-8 bg-gray-800/80 backdrop-blur-sm border-gray-700 shadow-2xl">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar Section */}
          <div className="relative">
            <ProfileAvatar
              src={imagePreview || user.avatar}
              alt="User avatar"
              name={user.name}
              size={128}
              className="w-32 h-32 rounded-full border-4 border-gray-600 shadow-xl"
              onError={() => {
                console.log("Avatar load error, using fallback");
              }}
            />

            {/* Hidden file input for avatar upload */}
            <input id="avatar-upload" type="file" accept="image/*" onChange={onImageUpload} className="hidden" aria-label="Upload avatar image" />

            {/* Avatar Action Buttons */}
            <div className="absolute bottom-2 right-2 flex gap-1">
              <Button size="sm" variant="secondary" className="rounded-full p-2 bg-gray-700 hover:bg-gray-600 border-gray-600" onClick={onUpdateAvatar}>
                <Camera className="h-4 w-4" aria-label="Upload avatar" />
                <span className="sr-only">Upload avatar</span>
              </Button>
              {hasUploadedAvatar && (
                <Button size="sm" variant="destructive" className="rounded-full p-2" onClick={onDeleteAvatar}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete avatar</span>
                </Button>
              )}
            </div>
          </div>

          {/* User Info Section */}
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

            {/* User Details Grid */}
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
  );
}
