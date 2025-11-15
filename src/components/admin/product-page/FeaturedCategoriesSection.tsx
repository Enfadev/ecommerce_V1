import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SectionCard } from "../page-editor/SectionCard";
import { ItemCard } from "../page-editor/ItemCard";

interface FeaturedCategory {
  name: string;
  description: string;
  image: string;
  link: string;
  bgColor: string;
}

interface FeaturedCategoriesSectionProps {
  categories: FeaturedCategory[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof FeaturedCategory, value: string) => void;
}

export function FeaturedCategoriesSection({ categories, onAdd, onRemove, onUpdate }: FeaturedCategoriesSectionProps) {
  const categoriesArray = Array.isArray(categories) ? categories : [];

  return (
    <SectionCard title="Featured Categories" onAdd={onAdd} addButtonText="Add Category">
      {categoriesArray.map((category, index) => (
        <ItemCard key={index} title={`Category ${index + 1}`} borderColor="border-purple-500" onRemove={() => onRemove(index)}>
          <div>
            <label className="block text-sm font-medium mb-2">Category Name</label>
            <Input placeholder="Category name" value={category.name} onChange={(e) => onUpdate(index, "name", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea placeholder="Category description" value={category.description} onChange={(e) => onUpdate(index, "description", e.target.value)} rows={2} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Image URL</label>
            <Input placeholder="/category-image.jpg" value={category.image} onChange={(e) => onUpdate(index, "image", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Link</label>
            <Input placeholder="/category/electronics" value={category.link} onChange={(e) => onUpdate(index, "link", e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Background Color</label>
            <Input placeholder="bg-blue-100" value={category.bgColor} onChange={(e) => onUpdate(index, "bgColor", e.target.value)} />
          </div>
        </ItemCard>
      ))}
    </SectionCard>
  );
}
