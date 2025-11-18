"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface AvatarManagerProps {
  hasUploadedAvatar: boolean;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerateAvatar: () => void;
  onDeleteAvatar: () => void;
}

export function AvatarManager({ hasUploadedAvatar, onImageUpload, onGenerateAvatar, onDeleteAvatar }: AvatarManagerProps) {
  return (
    <div className="space-y-2">
      <label className="text-gray-200 text-sm font-medium">Avatar Image</label>
      <div className="flex items-center gap-4">
        <input
          id="avatar-upload-form"
          type="file"
          accept="image/*"
          onChange={onImageUpload}
          className="bg-gray-700/50 border border-gray-600 text-white rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          aria-label="Upload avatar image"
        />
        <label htmlFor="avatar-upload-form" className="sr-only">
          Upload avatar image
        </label>
        <Button type="button" variant="outline" size="sm" onClick={onGenerateAvatar} className="border-gray-600 text-gray-300 hover:bg-gray-700">
          Generate Avatar
        </Button>
        {hasUploadedAvatar && (
          <Button type="button" variant="destructive" size="sm" onClick={onDeleteAvatar}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Avatar
          </Button>
        )}
      </div>
      <p className="text-gray-400 text-xs">Upload an image, generate an avatar based on your name, or delete current uploaded image</p>
    </div>
  );
}
