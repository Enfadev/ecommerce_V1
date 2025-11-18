"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

interface SeoData {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;
  noindex?: boolean;
}

interface SeoSettingsCardProps {
  data: SeoData;
  onChange: (field: keyof SeoData, value: string | boolean) => void;
  pageName: string;
}

export default function SeoSettingsCard({ data, onChange, pageName }: SeoSettingsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5" />
          SEO Settings - {pageName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Meta Title</label>
          <Input value={data.metaTitle || ""} onChange={(e) => onChange("metaTitle", e.target.value)} placeholder={`Custom title for ${pageName} page`} />
          <p className="text-xs text-muted-foreground mt-1">Leave empty to use default title. Recommended: 50-60 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Meta Description</label>
          <Textarea value={data.metaDescription || ""} onChange={(e) => onChange("metaDescription", e.target.value)} placeholder={`Brief description for ${pageName} page`} rows={3} />
          <p className="text-xs text-muted-foreground mt-1">Leave empty to use default description. Recommended: 150-160 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Meta Keywords</label>
          <Input value={data.metaKeywords || ""} onChange={(e) => onChange("metaKeywords", e.target.value)} placeholder="keyword1, keyword2, keyword3" />
          <p className="text-xs text-muted-foreground mt-1">Comma-separated keywords specific to this page</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Open Graph Title</label>
            <Input value={data.ogTitle || ""} onChange={(e) => onChange("ogTitle", e.target.value)} placeholder="Title for social media sharing" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Open Graph Image URL</label>
            <Input value={data.ogImageUrl || ""} onChange={(e) => onChange("ogImageUrl", e.target.value)} placeholder="/uploads/og-image.jpg" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Open Graph Description</label>
          <Textarea value={data.ogDescription || ""} onChange={(e) => onChange("ogDescription", e.target.value)} placeholder="Description for social media sharing" rows={2} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Canonical URL</label>
          <Input value={data.canonicalUrl || ""} onChange={(e) => onChange("canonicalUrl", e.target.value)} placeholder={`https://example.com/${pageName.toLowerCase()}`} />
          <p className="text-xs text-muted-foreground mt-1">Canonical URL for this specific page (optional)</p>
        </div>

        <div className="flex items-center justify-between p-3 border rounded-md">
          <div>
            <div className="text-sm font-medium">Search Engine Indexing</div>
            <div className="text-xs text-muted-foreground">Allow search engines to index this page</div>
          </div>
          <Button type="button" variant={!data.noindex ? "default" : "outline"} onClick={() => onChange("noindex", !data.noindex)}>
            {!data.noindex ? "Enabled" : "Disabled"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
