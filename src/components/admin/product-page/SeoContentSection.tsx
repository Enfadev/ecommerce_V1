import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard } from "../page-editor/SectionCard";
import { ItemCard } from "../page-editor/ItemCard";

interface SeoContentBlock {
  title: string;
  content: string;
  type: string;
}

interface SeoContentSectionProps {
  seoContent: SeoContentBlock[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof SeoContentBlock, value: string) => void;
}

export function SeoContentSection({ seoContent, onAdd, onRemove, onUpdate }: SeoContentSectionProps) {
  const contentArray = Array.isArray(seoContent) ? seoContent : [];

  return (
    <SectionCard title="SEO Content" onAdd={onAdd} addButtonText="Add Content Block">
      {contentArray.map((content, index) => (
        <ItemCard key={index} title={`Content ${index + 1}`} borderColor="border-pink-500" onRemove={() => onRemove(index)}>
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input placeholder="Content title" value={content.title} onChange={(e) => onUpdate(index, "title", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <Input placeholder="text, faq, etc." value={content.type} onChange={(e) => onUpdate(index, "type", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <Textarea placeholder="SEO content description" value={content.content} onChange={(e) => onUpdate(index, "content", e.target.value)} rows={3} />
          </div>
        </ItemCard>
      ))}
    </SectionCard>
  );
}
