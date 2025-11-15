import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard } from "../page-editor/SectionCard";
import { ItemCard } from "../page-editor/ItemCard";
import { IconSelect } from "@/components/admin/IconSelect";

interface CompanyValue {
  icon: string;
  title: string;
  description: string;
}

interface ValuesSectionProps {
  values: CompanyValue[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof CompanyValue, value: string) => void;
}

export function ValuesSection({ values, onAdd, onRemove, onUpdate }: ValuesSectionProps) {
  const valuesArray = Array.isArray(values) ? values : [];

  return (
    <SectionCard title="Company Values" onAdd={onAdd} addButtonText="Add Value">
      {valuesArray.map((value, index) => (
        <ItemCard key={index} title={`Value ${index + 1}`} borderColor="border-blue-500" onRemove={() => onRemove(index)}>
          <div>
            <label className="block text-sm font-medium mb-2">Icon</label>
            <IconSelect value={value.icon} onChange={(v) => onUpdate(index, "icon", v)} placeholder="Select an icon" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input placeholder="Value title" value={value.title} onChange={(e) => onUpdate(index, "title", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea placeholder="Value description" value={value.description} onChange={(e) => onUpdate(index, "description", e.target.value)} rows={2} />
          </div>
        </ItemCard>
      ))}
    </SectionCard>
  );
}
