import RichTextDisplay from "@/components/forms/RichTextDisplay";

interface ProductDescriptionProps {
  description: string;
}

export default function ProductDescription({ description }: ProductDescriptionProps) {
  return (
    <div className="bg-card rounded-2xl shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-foreground mb-4">Description</h2>
      <RichTextDisplay content={description} className="text-muted-foreground leading-relaxed" />
    </div>
  );
}
