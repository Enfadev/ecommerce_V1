"use client";

import { Loader2, Home, Globe } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeroSectionEditor } from "./page-editor/HeroSectionEditor";
import { SaveButton } from "./page-editor/SaveButton";
import { HeroSlidesSection } from "./home-page/HeroSlidesSection";
import { HomeFeaturesSection } from "./home-page/HomeFeaturesSection";
import SeoSettingsCard from "@/components/admin/SeoSettingsCard";
import { usePageEditor } from "@/hooks/usePageEditor";
import { toast } from "sonner";

interface HeroSlide {
  imageUrl: string;
  alt?: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
  bgColor: string;
}

interface HomePageData {
  id: number;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroSlides: HeroSlide[];
  features: Feature[];
  aboutPreview: object;
  testimonialsData: unknown[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;
  noindex?: boolean;
}

const initialData: HomePageData = {
  id: 0,
  heroTitle: "Welcome to Our Store",
  heroSubtitle: "Best Quality Products",
  heroDescription: "Discover amazing products at great prices",
  heroSlides: [],
  features: [],
  aboutPreview: {},
  testimonialsData: [],
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  ogTitle: "",
  ogDescription: "",
  ogImageUrl: "",
  canonicalUrl: "",
  noindex: false,
};

export default function AdminHomePageEditor() {
  const { data, setData, loading, saving, saveData } = usePageEditor<HomePageData>({
    apiEndpoint: "/api/home-page",
    initialData,
    successMessage: "Home page updated successfully!",
  });

  const handleSave = async () => {
    const validSlides = data.heroSlides.filter((slide) => slide.imageUrl && slide.imageUrl.trim() !== "");
    if (validSlides.length === 0) {
      toast.error("At least one carousel image is required");
      return;
    }

    await saveData();
  };

  const addHeroSlide = () => {
    setData({ ...data, heroSlides: [...data.heroSlides, { imageUrl: "", alt: "Hero slide image" }] });
  };

  const removeHeroSlide = async (index: number) => {
    if (data.heroSlides.length === 1) {
      toast.error("At least one carousel image is required");
      return;
    }

    const slideToRemove = data.heroSlides[index];
    if (slideToRemove.imageUrl && slideToRemove.imageUrl.startsWith("/uploads/carousel/")) {
      try {
        const res = await fetch("/api/upload-carousel", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl: slideToRemove.imageUrl }),
        });

        if (!res.ok) {
          console.error("Failed to delete image file");
        }
      } catch (error) {
        console.error("Error deleting image file:", error);
      }
    }

    const newSlides = data.heroSlides.filter((_, i) => i !== index);
    setData({ ...data, heroSlides: newSlides });
    toast.success("Slide removed successfully!");
  };

  const updateHeroSlide = (index: number, field: keyof HeroSlide, value: string) => {
    const newSlides = [...data.heroSlides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setData({ ...data, heroSlides: newSlides });
  };

  const addFeature = () => {
    setData({ ...data, features: [...data.features, { icon: "Shield", title: "New Feature", description: "Feature description", bgColor: "bg-blue-100" }] });
  };

  const removeFeature = (index: number) => {
    setData({ ...data, features: data.features.filter((_, i) => i !== index) });
  };

  const updateFeature = (index: number, field: keyof Feature, value: string) => {
    const newFeatures = [...data.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setData({ ...data, features: newFeatures });
  };

  const handleSeoChange = (field: keyof HomePageData, value: string | boolean) => {
    setData({ ...data, [field]: value });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Home Page Editor</h1>
        <SaveButton onClick={handleSave} saving={saving} />
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="seo" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            SEO Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-6">
          <HeroSectionEditor
            title={data.heroTitle}
            subtitle={data.heroSubtitle}
            description={data.heroDescription}
            onTitleChange={(v: string) => setData({ ...data, heroTitle: v })}
            onSubtitleChange={(v: string) => setData({ ...data, heroSubtitle: v })}
            onDescriptionChange={(v: string) => setData({ ...data, heroDescription: v })}
          />

          <HeroSlidesSection slides={data.heroSlides} onAdd={addHeroSlide} onRemove={removeHeroSlide} onUpdate={updateHeroSlide} />

          <HomeFeaturesSection features={data.features} onAdd={addFeature} onRemove={removeFeature} onUpdate={updateFeature} />
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <SeoSettingsCard
            data={{
              metaTitle: data.metaTitle,
              metaDescription: data.metaDescription,
              metaKeywords: data.metaKeywords,
              ogTitle: data.ogTitle,
              ogDescription: data.ogDescription,
              ogImageUrl: data.ogImageUrl,
              canonicalUrl: data.canonicalUrl,
              noindex: data.noindex,
            }}
            onChange={handleSeoChange}
            pageName="Home"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
