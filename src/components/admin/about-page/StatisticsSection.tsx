import { Input } from "@/components/ui/input";
import { SectionCard } from "../page-editor/SectionCard";
import { ItemCard } from "../page-editor/ItemCard";
import { IconSelect } from "@/components/admin/IconSelect";

interface Statistic {
  label: string;
  value: string;
  icon: string;
}

interface StatisticsSectionProps {
  statistics: Statistic[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof Statistic, value: string) => void;
}

export function StatisticsSection({ statistics, onAdd, onRemove, onUpdate }: StatisticsSectionProps) {
  const statisticsArray = Array.isArray(statistics) ? statistics : [];

  return (
    <SectionCard title="Statistics" onAdd={onAdd} addButtonText="Add Statistic">
      {statisticsArray.map((stat, index) => (
        <ItemCard key={index} title={`Statistic ${index + 1}`} borderColor="border-green-500" onRemove={() => onRemove(index)}>
          <div>
            <label className="block text-sm font-medium mb-2">Icon</label>
            <IconSelect value={stat.icon} onChange={(v) => onUpdate(index, "icon", v)} placeholder="Select an icon" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Label</label>
            <Input placeholder="Statistic label" value={stat.label} onChange={(e) => onUpdate(index, "label", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Value</label>
            <Input placeholder="e.g., 100+" value={stat.value} onChange={(e) => onUpdate(index, "value", e.target.value)} />
          </div>
        </ItemCard>
      ))}
    </SectionCard>
  );
}
