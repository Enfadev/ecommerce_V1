"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Settings } from "lucide-react";
import { LogoUpload } from "@/components/admin/LogoUpload";
import { toast } from "sonner";
import type { GeneralSettings } from "@/types/settings";

interface GeneralSettingsFormProps {
  initialSettings: GeneralSettings;
}

export function GeneralSettingsForm({ initialSettings }: GeneralSettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<GeneralSettings>(initialSettings);

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
          toast.success("General settings updated successfully!");
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
          <Settings className="w-5 h-5" />
          General Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <LogoUpload currentLogoUrl={settings.logoUrl || undefined} onLogoChange={(logoUrl) => setSettings((prev) => ({ ...prev, logoUrl }))} disabled={loading} />
        <div>
          <label className="block text-sm font-medium mb-2">Store Name</label>
          <Input value={settings.storeName} onChange={(e) => setSettings((prev) => ({ ...prev, storeName: e.target.value }))} placeholder="Enter store name" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <Textarea value={settings.storeDescription} onChange={(e) => setSettings((prev) => ({ ...prev, storeDescription: e.target.value }))} placeholder="Enter store description" rows={3} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Contact Email</label>
          <Input type="email" value={settings.contactEmail} onChange={(e) => setSettings((prev) => ({ ...prev, contactEmail: e.target.value }))} placeholder="contact@store.com" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Phone Number</label>
          <Input type="tel" value={settings.phoneNumber} onChange={(e) => setSettings((prev) => ({ ...prev, phoneNumber: e.target.value }))} placeholder="+1 (555) 123-4567" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Office Address</label>
          <Textarea value={settings.officeAddress} onChange={(e) => setSettings((prev) => ({ ...prev, officeAddress: e.target.value }))} placeholder="123 Business Street, Suite 100, City, State, Country" rows={3} />
        </div>
        <Button onClick={handleSave} className="w-full" disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
}
