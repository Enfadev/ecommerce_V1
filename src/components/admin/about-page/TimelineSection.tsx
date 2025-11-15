import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard } from "../page-editor/SectionCard";
import { ItemCard } from "../page-editor/ItemCard";

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
}

interface TimelineSectionProps {
  timeline: TimelineEvent[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof TimelineEvent, value: string) => void;
}

export function TimelineSection({ timeline, onAdd, onRemove, onUpdate }: TimelineSectionProps) {
  const timelineArray = Array.isArray(timeline) ? timeline : [];

  return (
    <SectionCard title="Company Timeline" onAdd={onAdd} addButtonText="Add Event">
      {timelineArray.map((event, index) => (
        <ItemCard key={index} title={`${event.year || "Year"} - ${event.title || "Event"}`} borderColor="border-red-500" onRemove={() => onRemove(index)}>
          <div>
            <label className="block text-sm font-medium mb-2">Year</label>
            <Input placeholder="2024" value={event.year} onChange={(e) => onUpdate(index, "year", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input placeholder="Milestone title" value={event.title} onChange={(e) => onUpdate(index, "title", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea placeholder="Event description" value={event.description} onChange={(e) => onUpdate(index, "description", e.target.value)} rows={2} />
          </div>
        </ItemCard>
      ))}
    </SectionCard>
  );
}
