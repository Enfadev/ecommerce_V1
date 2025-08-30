"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProfileAvatarProps {
  src?: string | null;
  alt: string;
  name: string;
  size?: number;
  className?: string;
  fallbackClassName?: string;
  onError?: () => void;
}

export function ProfileAvatar({ 
  src, 
  alt, 
  name, 
  size = 128, 
  className = "", 
  fallbackClassName = "",
  onError 
}: ProfileAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const generateAvatarUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff&size=${size}`;
  };

  const getValidSrc = () => {
    if (imageError || !src || src === 'null' || src === 'undefined' || src.trim() === '') {
      return generateAvatarUrl(name);
    }
    
    if (src.startsWith('http') || src.startsWith('/uploads/')) {
      return src;
    }
    
    if (src.includes('ui-avatars.com')) {
      return src;
    }
    
    return generateAvatarUrl(name);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
    onError?.();
  };

  const handleImageLoad = () => {
    setImageError(false);
    setIsLoading(false);
  };

  return (
    <div className={cn(`relative overflow-hidden bg-gray-700`, className)}>
      {isLoading && !imageError && (
        <div className={cn(
          "absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center",
          fallbackClassName
        )}>
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <Image
        src={getValidSrc()}
        alt={alt}
        width={size}
        height={size}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onError={handleImageError}
        onLoad={handleImageLoad}
        priority
        unoptimized={getValidSrc().includes('ui-avatars.com')}
      />
    </div>
  );
}
