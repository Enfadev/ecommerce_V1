import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard } from "../page-editor/SectionCard";
import { ItemCard } from "../page-editor/ItemCard";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  description: string;
}

interface TeamSectionProps {
  teamMembers: TeamMember[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof TeamMember, value: string) => void;
}

export function TeamSection({ teamMembers, onAdd, onRemove, onUpdate }: TeamSectionProps) {
  const membersArray = Array.isArray(teamMembers) ? teamMembers : [];

  return (
    <SectionCard title="Team Members" onAdd={onAdd} addButtonText="Add Team Member">
      {membersArray.map((member, index) => (
        <ItemCard key={index} title={member.name || `Team Member ${index + 1}`} borderColor="border-purple-500" onRemove={() => onRemove(index)}>
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <Input placeholder="Member name" value={member.name} onChange={(e) => onUpdate(index, "name", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Role/Position</label>
            <Input placeholder="Member role" value={member.role} onChange={(e) => onUpdate(index, "role", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <Input placeholder="/team-member.jpg" value={member.image} onChange={(e) => onUpdate(index, "image", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea placeholder="Member description" value={member.description} onChange={(e) => onUpdate(index, "description", e.target.value)} rows={2} />
          </div>
        </ItemCard>
      ))}
    </SectionCard>
  );
}
