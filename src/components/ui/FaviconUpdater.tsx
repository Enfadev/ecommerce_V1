"use client";

import { useEffect } from "react";

interface FaviconUpdaterProps {
  logoUrl?: string;
  storeName: string;
}

function generateSVGFavicon(initial: string): string {
  const svg = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" fill="#334155" rx="6"/>
      <text x="16" y="22" text-anchor="middle" fill="white" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="bold">
        ${initial}
      </text>
    </svg>
  `;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export function FaviconUpdater({ logoUrl, storeName }: FaviconUpdaterProps) {
  useEffect(() => {
    const faviconUrl = logoUrl || generateSVGFavicon(storeName.charAt(0).toUpperCase());
    
    const existingFavicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (existingFavicon) {
      existingFavicon.href = faviconUrl;
    } else {
      const newFavicon = document.createElement('link');
      newFavicon.rel = 'icon';
      newFavicon.href = faviconUrl;
      document.head.appendChild(newFavicon);
    }

    const existingAppleIcon = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;
    if (existingAppleIcon) {
      existingAppleIcon.href = faviconUrl;
    } else {
      const newAppleIcon = document.createElement('link');
      newAppleIcon.rel = 'apple-touch-icon';
      newAppleIcon.href = faviconUrl;
      document.head.appendChild(newAppleIcon);
    }
  }, [logoUrl, storeName]);

  return null;
}
