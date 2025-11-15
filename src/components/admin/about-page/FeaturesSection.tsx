import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard } from "../page-editor/SectionCard";
import { ItemCard } from "../page-editor/ItemCard";
import { IconSelect } from "@/components/admin/IconSelect";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  features: Feature[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof Feature, value: string) => void;
}

export function FeaturesSection({ features, onAdd, onRemove, onUpdate }: FeaturesSectionProps) {
  const featuresArray = Array.isArray(features) ? features : [];

  return (
    <SectionCard title="Features" onAdd={onAdd} addButtonText="Add Feature">
      {featuresArray.map((feature, index) => (
        <ItemCard key={index} title={`Feature ${index + 1}`} borderColor="border-orange-500" onRemove={() => onRemove(index)}>
          <div>
            <label className="block text-sm font-medium mb-2">Icon</label>
            <IconSelect value={feature.icon} onChange={(v) => onUpdate(index, "icon", v)} placeholder="Select an icon" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input placeholder="Feature title" value={feature.title} onChange={(e) => onUpdate(index, "title", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea placeholder="Feature description" value={feature.description} onChange={(e) => onUpdate(index, "description", e.target.value)} rows={2} />
          </div>
        </ItemCard>
      ))}
    </SectionCard>
  );
}
