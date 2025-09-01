"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface LogoUploadProps {
  currentLogoUrl?: string;
  onLogoChange: (logoUrl: string | null) => void;
  disabled?: boolean;
}

export function LogoUpload({ currentLogoUrl, onLogoChange, disabled }: LogoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentLogoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, WebP, or SVG)');
      return;
    }

    // Validate file size (2MB limit)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      alert('File size must be less than 2MB');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'logo');

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.url) {
        setPreview(data.url);
        onLogoChange(data.url);
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Logo upload error:', error);
      alert('Failed to upload logo. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveLogo = () => {
    setPreview(null);
    onLogoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium mb-2">Website Logo</label>
      
      {/* Current Logo Preview */}
      {preview && (
        <div className="relative w-32 h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg overflow-hidden bg-muted/20">
          <Image
            src={preview}
            alt="Logo Preview"
            fill
            className="object-contain p-2"
            sizes="(max-width: 128px) 128px"
          />
          {!disabled && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6"
              onClick={handleRemoveLogo}
              disabled={uploading}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}

      {/* Upload Area */}
      {!preview && (
        <div
          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-2">
            Drop your logo here or click to browse
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            Supports: JPEG, PNG, WebP, SVG (max 2MB)
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Uploading...' : 'Choose File'}
          </Button>
        </div>
      )}

      {/* Replace Logo Button */}
      {preview && !disabled && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? 'Uploading...' : 'Replace Logo'}
        </Button>
      )}

      {/* Hidden File Input */}
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled || uploading}
      />

      <p className="text-xs text-muted-foreground">
        Recommended size: 200x200px or larger. The logo will be automatically resized to fit different sections.
      </p>
    </div>
  );
}
