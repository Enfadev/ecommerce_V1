import { Input } from "@/components/ui/input";
import { SectionCard } from "../page-editor/SectionCard";
import { ItemCard } from "../page-editor/ItemCard";

interface SortOption {
  value: string;
  label: string;
}

interface SortOptionsSectionProps {
  sortOptions: SortOption[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof SortOption, value: string) => void;
}

export function SortOptionsSection({ sortOptions, onAdd, onRemove, onUpdate }: SortOptionsSectionProps) {
  const optionsArray = Array.isArray(sortOptions) ? sortOptions : [];

  return (
    <SectionCard title="Sort Options" onAdd={onAdd} addButtonText="Add Sort Option">
      {optionsArray.map((option, index) => (
        <ItemCard key={index} title={`Sort ${index + 1}`} borderColor="border-cyan-500" onRemove={() => onRemove(index)}>
          <div>
            <label className="block text-sm font-medium mb-2">Value</label>
            <Input placeholder="price_asc, name_desc..." value={option.value} onChange={(e) => onUpdate(index, "value", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Label</label>
            <Input placeholder="Price: Low to High" value={option.label} onChange={(e) => onUpdate(index, "label", e.target.value)} />
          </div>
        </ItemCard>
      ))}
    </SectionCard>
  );
}
