"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Globe } from "lucide-react";
import { toast } from "sonner";
import type { GeneralSettings } from "@/types/settings";

interface SEOSettingsFormProps {
  initialSettings: Pick<GeneralSettings, "defaultMetaTitle" | "defaultMetaDescription" | "defaultMetaKeywords" | "defaultOgImageUrl" | "twitterHandle" | "facebookPage" | "canonicalBaseUrl" | "enableIndexing">;
}

export function SEOSettingsForm({ initialSettings }: SEOSettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState(initialSettings);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success("SEO settings updated successfully!");
        } else {
          toast.error(data.message || "Failed to update settings");
        }
      } else {
        toast.error("Failed to update settings");
      }
    } catch (error) {
      console.error("Save settings error:", error);
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          SEO & Meta Defaults
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Default Meta Title</label>
          <Input value={settings.defaultMetaTitle} onChange={(e) => setSettings((prev) => ({ ...prev, defaultMetaTitle: e.target.value }))} placeholder="Site default title (used as fallback)" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Default Meta Description</label>
          <Textarea value={settings.defaultMetaDescription} onChange={(e) => setSettings((prev) => ({ ...prev, defaultMetaDescription: e.target.value }))} placeholder="Default description for pages without specific SEO" rows={3} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Default Meta Keywords</label>
          <Input value={settings.defaultMetaKeywords} onChange={(e) => setSettings((prev) => ({ ...prev, defaultMetaKeywords: e.target.value }))} placeholder="keyword1, keyword2, keyword3" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Default OG Image URL</label>
          <Input value={settings.defaultOgImageUrl} onChange={(e) => setSettings((prev) => ({ ...prev, defaultOgImageUrl: e.target.value }))} placeholder="/uploads/og-default.jpg or https://..." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Twitter Handle</label>
            <Input value={settings.twitterHandle} onChange={(e) => setSettings((prev) => ({ ...prev, twitterHandle: e.target.value }))} placeholder="@brand" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Facebook Page URL</label>
            <Input value={settings.facebookPage} onChange={(e) => setSettings((prev) => ({ ...prev, facebookPage: e.target.value }))} placeholder="https://facebook.com/yourpage" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Canonical Base URL</label>
          <Input value={settings.canonicalBaseUrl} onChange={(e) => setSettings((prev) => ({ ...prev, canonicalBaseUrl: e.target.value }))} placeholder="https://www.example.com" />
        </div>
        <div className="flex items-center justify-between p-3 border rounded-md">
          <div>
            <div className="text-sm font-medium">Enable Indexing</div>
            <div className="text-xs text-muted-foreground">Allow search engines to index the site</div>
          </div>
          <Button type="button" variant={settings.enableIndexing ? "default" : "outline"} onClick={() => setSettings((prev) => ({ ...prev, enableIndexing: !prev.enableIndexing }))}>
            {settings.enableIndexing ? "Enabled" : "Disabled"}
          </Button>
        </div>

        <Button onClick={handleSave} className="w-full" disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
}
