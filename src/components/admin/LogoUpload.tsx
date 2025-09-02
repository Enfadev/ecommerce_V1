"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Image as ImageIcon, CheckCircle, AlertCircle } from "lucide-react";
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
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, WebP, or SVG)");
      return;
    }

    // Validate file size (2MB limit)
    const maxSize = 2 * 1024 * 1024; // 2MB
    if (file.size > maxSize) {
      alert("File size must be less than 2MB");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "logo");

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.url) {
        setPreview(data.url);
        onLogoChange(data.url);

        // Show optimization info
        if (data.optimizedType) {
          const savedPercent = Math.round((1 - data.size / data.originalSize) * 100);
          console.log(`Logo optimized: ${data.originalType} → ${data.optimizedType}, saved ${savedPercent}%`);
        }
      } else {
        throw new Error(data.message || "Upload failed");
      }
    } catch (error) {
      console.error("Logo upload error:", error);
      alert("Failed to upload logo. Please try again.");
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

  const handleRemoveLogo = async () => {
    const logoToDelete = preview || currentLogoUrl;

    if (logoToDelete && confirm("Are you sure you want to remove this logo?")) {
      try {
        // Delete the file from server
        const response = await fetch(`/api/admin/delete-file?fileUrl=${encodeURIComponent(logoToDelete)}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setPreview(null);
          onLogoChange(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        } else {
          // Even if server deletion fails, remove from UI
          setPreview(null);
          onLogoChange(null);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        }
      } catch (error) {
        console.error("Failed to delete logo file:", error);
        // Still remove from UI even if deletion fails
        setPreview(null);
        onLogoChange(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
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
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">Website Logo</label>
        {currentLogoUrl && (
          <Badge variant="outline" className="text-xs">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active Logo
          </Badge>
        )}
      </div>

      {/* Current Logo Status */}
      {currentLogoUrl && !preview && (
        <div className="p-3 bg-muted/30 rounded-lg border">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded overflow-hidden bg-background">
              <Image src={currentLogoUrl} alt="Current Logo" fill className="object-contain p-1" sizes="48px" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Current logo is active</p>
              <p className="text-xs text-muted-foreground">{currentLogoUrl.split("/").pop()}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                In Use
              </Badge>
              {!disabled && (
                <Button variant="outline" size="sm" onClick={handleRemoveLogo} disabled={uploading} className="h-7 px-2">
                  <X className="h-3 w-3 mr-1" />
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Current Logo Preview */}
      {preview && (
        <div className="relative w-32 h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg overflow-hidden bg-muted/20">
          <Image src={preview} alt="Logo Preview" fill className="object-contain p-2" sizes="(max-width: 128px) 128px" />
          {!disabled && (
            <Button variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={handleRemoveLogo} disabled={uploading}>
              <X className="h-3 w-3" />
            </Button>
          )}
          <div className="absolute bottom-1 left-1 right-1">
            <Badge variant="default" className="text-xs w-full justify-center">
              New Logo
            </Badge>
          </div>
        </div>
      )}

      {/* Upload Area */}
      {!preview && (
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors" onDrop={handleDrop} onDragOver={handleDragOver}>
          <ImageIcon className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground mb-2">Drop your logo here or click to browse</p>
          <p className="text-xs text-muted-foreground mb-3">Supports: JPEG, PNG, WebP, SVG (max 2MB)</p>
          {currentLogoUrl && (
            <div className="mb-3 p-2 bg-orange-50 border border-orange-200 rounded text-xs text-orange-700">
              <AlertCircle className="w-3 h-3 inline mr-1" />
              Uploading a new logo will replace the current one
            </div>
          )}
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={disabled || uploading}>
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? "Uploading..." : currentLogoUrl ? "Replace Logo" : "Choose File"}
          </Button>
        </div>
      )}

      {/* Replace Logo Button */}
      {preview && !disabled && (
        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={uploading} className="w-full">
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? "Uploading..." : "Replace Logo"}
        </Button>
      )}

      {/* Hidden File Input */}
      <Input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" onChange={handleFileInputChange} className="hidden" disabled={disabled || uploading} />

      <p className="text-xs text-muted-foreground">Recommended size: 200x200px or larger. Images will be automatically optimized to WebP format for better performance. SVG files will be preserved as vector format.</p>
    </div>
  );
}
