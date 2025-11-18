import { Input } from "@/components/ui/input";
import { SectionCard } from "../page-editor/SectionCard";
import { ItemCard } from "../page-editor/ItemCard";
import { IconSelect } from "@/components/admin/shared/IconSelect";

interface SocialMedia {
  name: string;
  link: string;
  icon: string;
  color: string;
}

interface SocialMediaSectionProps {
  socialMedia: SocialMedia[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof SocialMedia, value: string) => void;
}

export function SocialMediaSection({ socialMedia, onAdd, onRemove, onUpdate }: SocialMediaSectionProps) {
  const socialArray = Array.isArray(socialMedia) ? socialMedia : [];

  return (
    <SectionCard title="Social Media" onAdd={onAdd} addButtonText="Add Social Media">
      {socialArray.map((social, index) => (
        <ItemCard key={index} title={social.name || `Social ${index + 1}`} borderColor="border-purple-500" onRemove={() => onRemove(index)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input placeholder="Facebook" value={social.name} onChange={(e) => onUpdate(index, "name", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Link</label>
              <Input placeholder="https://facebook.com/..." value={social.link} onChange={(e) => onUpdate(index, "link", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Icon</label>
              <IconSelect value={social.icon} onChange={(v) => onUpdate(index, "icon", v)} placeholder="Select an icon" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Color (Tailwind class)</label>
              <Input placeholder="text-blue-600" value={social.color} onChange={(e) => onUpdate(index, "color", e.target.value)} />
            </div>
          </div>
        </ItemCard>
      ))}
    </SectionCard>
  );
}
