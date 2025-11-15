import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard } from "../page-editor/SectionCard";
import { ItemCard } from "../page-editor/ItemCard";

interface OfficeLocation {
  city: string;
  address: string;
  phone: string;
  isMain: boolean;
}

interface OfficeLocationsSectionProps {
  locations: OfficeLocation[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof OfficeLocation, value: string | boolean) => void;
}

export function OfficeLocationsSection({ locations, onAdd, onRemove, onUpdate }: OfficeLocationsSectionProps) {
  const locationsArray = Array.isArray(locations) ? locations : [];

  return (
    <SectionCard title="Office Locations" onAdd={onAdd} addButtonText="Add Location">
      {locationsArray.map((office, index) => (
        <ItemCard key={index} title={office.city || `Location ${index + 1}`} borderColor="border-green-500" onRemove={() => onRemove(index)}>
          <div>
            <label className="block text-sm font-medium mb-2">City</label>
            <Input placeholder="New York" value={office.city} onChange={(e) => onUpdate(index, "city", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Address</label>
            <Textarea placeholder="123 Main Street, Suite 100" value={office.address} onChange={(e) => onUpdate(index, "address", e.target.value)} rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <Input placeholder="+1 234 567 890" value={office.phone} onChange={(e) => onUpdate(index, "phone", e.target.value)} />
          </div>
          <div className="flex items-center space-x-2">
            <input type="checkbox" checked={office.isMain} onChange={(e) => onUpdate(index, "isMain", e.target.checked)} />
            <label className="text-sm font-medium">Main Office</label>
          </div>
        </ItemCard>
      ))}
    </SectionCard>
  );
}
