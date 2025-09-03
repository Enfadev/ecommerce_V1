"use client";

import { useEffect, useState } from "react";
import { FaviconUpdater } from "./FaviconUpdater";

interface LogoSettings {
  logoUrl?: string;
  storeName: string;
}

export function DynamicFavicon() {
  const [settings, setSettings] = useState<LogoSettings | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings/public');
        if (response.ok) {
          const data = await response.json();
          setSettings({
            logoUrl: data.settings?.logoUrl,
            storeName: data.settings?.siteName || data.settings?.companyName || "Store"
          });
        } else {
          // Fallback if API fails
          setSettings({
            storeName: "Store"
          });
        }
      } catch (error) {
        console.error("Failed to fetch logo for favicon:", error);
        // Fallback
        setSettings({
          storeName: "Store"
        });
      }
    };

    fetchSettings();
  }, []);

  if (!settings) {
    return null;
  }

  return <FaviconUpdater logoUrl={settings.logoUrl} storeName={settings.storeName} />;
}
