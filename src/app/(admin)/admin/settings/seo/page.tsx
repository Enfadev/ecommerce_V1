"use client";

import { useState, useEffect } from "react";
import { SEOSettingsForm } from "@/components/admin/settings/SEOSettingsForm";

export default function SEOSettingsPage() {
  const [settings, setSettings] = useState({
    defaultMetaTitle: "",
    defaultMetaDescription: "",
    defaultMetaKeywords: "",
    defaultOgImageUrl: "",
    twitterHandle: "",
    facebookPage: "",
    canonicalBaseUrl: "",
    enableIndexing: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSettings({
            defaultMetaTitle: data.settings.defaultMetaTitle || "",
            defaultMetaDescription: data.settings.defaultMetaDescription || "",
            defaultMetaKeywords: data.settings.defaultMetaKeywords || "",
            defaultOgImageUrl: data.settings.defaultOgImageUrl || "",
            twitterHandle: data.settings.twitterHandle || "",
            facebookPage: data.settings.facebookPage || "",
            canonicalBaseUrl: data.settings.canonicalBaseUrl || "",
            enableIndexing: data.settings.enableIndexing ?? true,
          });
        }
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  return <SEOSettingsForm initialSettings={settings} />;
}
