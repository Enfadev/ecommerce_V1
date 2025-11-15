import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface PromotionalBanner {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  bgColor: string;
  isActive: boolean;
}

interface PromotionalBannerSectionProps {
  banner: PromotionalBanner;
  onUpdate: (field: keyof PromotionalBanner, value: string | boolean) => void;
}

export function PromotionalBannerSection({ banner, onUpdate }: PromotionalBannerSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Promotional Banner</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <input type="checkbox" checked={banner.isActive} onChange={(e) => onUpdate("isActive", e.target.checked)} />
          <label className="text-sm font-medium">Enable Promotional Banner</label>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Banner Title</label>
          <Input placeholder="Banner title" value={banner.title} onChange={(e) => onUpdate("title", e.target.value)} disabled={!banner.isActive} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Banner Description</label>
          <Textarea placeholder="Banner description" value={banner.description} onChange={(e) => onUpdate("description", e.target.value)} rows={2} disabled={!banner.isActive} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Button Text</label>
            <Input placeholder="Shop Now" value={banner.buttonText} onChange={(e) => onUpdate("buttonText", e.target.value)} disabled={!banner.isActive} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Button Link</label>
            <Input placeholder="/products/sale" value={banner.buttonLink} onChange={(e) => onUpdate("buttonLink", e.target.value)} disabled={!banner.isActive} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Background Color</label>
          <Input placeholder="#3b82f6 or bg-blue-500" value={banner.bgColor} onChange={(e) => onUpdate("bgColor", e.target.value)} disabled={!banner.isActive} />
        </div>
      </CardContent>
    </Card>
  );
}
