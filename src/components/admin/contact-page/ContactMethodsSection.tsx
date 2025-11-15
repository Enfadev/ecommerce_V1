import { Input } from "@/components/ui/input";
import { SectionCard } from "../page-editor/SectionCard";
import { ItemCard } from "../page-editor/ItemCard";
import { IconSelect } from "@/components/admin/IconSelect";

interface ContactMethod {
  icon: string;
  title: string;
  subtitle: string;
  value: string;
  link: string;
  bgColor: string;
}

interface ContactMethodsSectionProps {
  methods: ContactMethod[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof ContactMethod, value: string) => void;
}

export function ContactMethodsSection({ methods, onAdd, onRemove, onUpdate }: ContactMethodsSectionProps) {
  const methodsArray = Array.isArray(methods) ? methods : [];

  return (
    <SectionCard title="Contact Methods" onAdd={onAdd} addButtonText="Add Method">
      {methodsArray.map((method, index) => (
        <ItemCard key={index} title={`Contact ${index + 1}`} borderColor="border-blue-500" onRemove={() => onRemove(index)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Icon</label>
              <IconSelect value={method.icon} onChange={(v) => onUpdate(index, "icon", v)} placeholder="Select an icon" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Background Color</label>
              <Input placeholder="bg-blue-500" value={method.bgColor} onChange={(e) => onUpdate(index, "bgColor", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input placeholder="Call Us" value={method.title} onChange={(e) => onUpdate(index, "title", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subtitle</label>
              <Input placeholder="Mon-Fri 9am-5pm" value={method.subtitle} onChange={(e) => onUpdate(index, "subtitle", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Value</label>
              <Input placeholder="+1 234 567 890" value={method.value} onChange={(e) => onUpdate(index, "value", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Link</label>
              <Input placeholder="tel:+1234567890" value={method.link} onChange={(e) => onUpdate(index, "link", e.target.value)} />
            </div>
          </div>
        </ItemCard>
      ))}
    </SectionCard>
  );
}
