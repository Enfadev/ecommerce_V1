import { Input } from "@/components/ui/input";
import { SectionCard } from "../page-editor/SectionCard";
import { ItemCard } from "../page-editor/ItemCard";

interface BusinessHour {
  day: string;
  hours: string;
  closed: boolean;
}

interface BusinessHoursSectionProps {
  businessHours: BusinessHour[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof BusinessHour, value: string | boolean) => void;
}

export function BusinessHoursSection({ businessHours, onAdd, onRemove, onUpdate }: BusinessHoursSectionProps) {
  const hoursArray = Array.isArray(businessHours) ? businessHours : [];

  return (
    <SectionCard title="Business Hours" onAdd={onAdd} addButtonText="Add Hours">
      {hoursArray.map((hour, index) => (
        <ItemCard key={index} title={hour.day || `Day ${index + 1}`} borderColor="border-orange-500" onRemove={() => onRemove(index)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Day</label>
              <Input placeholder="Monday" value={hour.day} onChange={(e) => onUpdate(index, "day", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hours</label>
              <Input placeholder="9:00 AM - 5:00 PM" value={hour.hours} onChange={(e) => onUpdate(index, "hours", e.target.value)} disabled={hour.closed} />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" checked={hour.closed} onChange={(e) => onUpdate(index, "closed", e.target.checked)} />
            <label className="text-sm font-medium">Closed</label>
          </div>
        </ItemCard>
      ))}
    </SectionCard>
  );
}
