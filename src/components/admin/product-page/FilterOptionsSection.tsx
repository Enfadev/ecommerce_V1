import { Input } from "@/components/ui/input";
import { SectionCard } from "../page-editor/SectionCard";
import { ItemCard } from "../page-editor/ItemCard";

interface FilterOption {
  type: string;
  label: string;
  options: string[];
}

interface FilterOptionsSectionProps {
  filters: FilterOption[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof FilterOption, value: string | string[]) => void;
}

export function FilterOptionsSection({ filters, onAdd, onRemove, onUpdate }: FilterOptionsSectionProps) {
  const filtersArray = Array.isArray(filters) ? filters : [];

  return (
    <SectionCard title="Filter Options" onAdd={onAdd} addButtonText="Add Filter">
      {filtersArray.map((filter, index) => (
        <ItemCard key={index} title={`Filter ${index + 1}`} borderColor="border-yellow-500" onRemove={() => onRemove(index)}>
          <div>
            <label className="block text-sm font-medium mb-2">Filter Type</label>
            <Input placeholder="category, price, brand..." value={filter.type} onChange={(e) => onUpdate(index, "type", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Label</label>
            <Input placeholder="Filter label" value={filter.label} onChange={(e) => onUpdate(index, "label", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Options (comma-separated)</label>
            <Input
              placeholder="Option 1, Option 2, Option 3"
              value={filter.options.join(", ")}
              onChange={(e) =>
                onUpdate(
                  index,
                  "options",
                  e.target.value.split(",").map((s) => s.trim())
                )
              }
            />
          </div>
        </ItemCard>
      ))}
    </SectionCard>
  );
}
