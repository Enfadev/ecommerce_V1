import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface HeroSectionEditorProps {
  title: string;
  subtitle: string;
  description: string;
  onTitleChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export function HeroSectionEditor({ title, subtitle, description, onTitleChange, onSubtitleChange, onDescriptionChange }: HeroSectionEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Section</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Hero Title</label>
          <Input value={title} onChange={(e) => onTitleChange(e.target.value)} placeholder="Page title" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
          <Input value={subtitle} onChange={(e) => onSubtitleChange(e.target.value)} placeholder="Page subtitle" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Hero Description</label>
          <Textarea value={description} onChange={(e) => onDescriptionChange(e.target.value)} placeholder="Page description" rows={3} />
        </div>
      </CardContent>
    </Card>
  );
}
