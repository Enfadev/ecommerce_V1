import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import { SectionCard } from "../page-editor/SectionCard";
import { toast } from "sonner";

interface HeroSlide {
  imageUrl: string;
  alt?: string;
}

interface HeroSlidesSectionProps {
  slides: HeroSlide[];
  onAdd: () => void;
  onRemove: (index: number) => Promise<void>;
  onUpdate: (index: number, field: keyof HeroSlide, value: string) => void;
}

export function HeroSlidesSection({ slides, onAdd, onRemove, onUpdate }: HeroSlidesSectionProps) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const slidesArray = Array.isArray(slides) ? slides : [];

  const handleImageUpload = async (index: number, file: File, currentImageUrl: string) => {
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File too large. Maximum size is 5MB.");
      return;
    }

    setUploadingIndex(index);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload-carousel", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const { url } = await res.json();
        onUpdate(index, "imageUrl", url);

        if (currentImageUrl && currentImageUrl.startsWith("/uploads/carousel/")) {
          try {
            await fetch("/api/upload-carousel", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ imageUrl: currentImageUrl }),
            });
          } catch (deleteError) {
            console.error("Failed to delete old image:", deleteError);
          }
        }

        toast.success("Image uploaded successfully!");
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleDeleteImage = async (index: number, imageUrl: string) => {
    if (!imageUrl.startsWith("/uploads/carousel/")) {
      onUpdate(index, "imageUrl", "");
      return;
    }

    try {
      const res = await fetch("/api/upload-carousel", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });

      if (res.ok) {
        onUpdate(index, "imageUrl", "");
        toast.success("Image deleted successfully!");
      } else {
        toast.error("Failed to delete image");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete image");
    }
  };

  return (
    <SectionCard title="Hero Carousel Slides" onAdd={onAdd} addButtonText="Add Slide">
      {slidesArray.map((slide, index) => (
        <Card key={index} className="border-l-4 border-blue-500">
          <CardHeader>
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Slide {index + 1}</h3>
              <Button variant="destructive" size="sm" onClick={() => onRemove(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Image</label>
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(index, file, slide.imageUrl);
                  }}
                  disabled={uploadingIndex === index}
                />
                {uploadingIndex === index && <Loader2 className="h-4 w-4 animate-spin" />}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Alt Text</label>
              <Input placeholder="Description of the image" value={slide.alt || ""} onChange={(e) => onUpdate(index, "alt", e.target.value)} />
            </div>
            {slide.imageUrl && (
              <div className="relative w-full h-48 border rounded-lg overflow-hidden">
                <Image src={slide.imageUrl} alt={slide.alt || "Hero slide"} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                <Button variant="destructive" size="sm" className="absolute top-2 right-2" onClick={() => handleDeleteImage(index, slide.imageUrl)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </SectionCard>
  );
}
