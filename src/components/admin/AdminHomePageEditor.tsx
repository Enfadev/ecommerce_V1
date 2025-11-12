"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Save, Plus, Trash2, Globe, Home, X } from "lucide-react";
import SeoSettingsCard from "@/components/admin/SeoSettingsCard";
import { IconSelect } from "@/components/admin/IconSelect";

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

interface TestimonialData {
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

interface HomePageData {
  id: number;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroSlides: HeroSlide[];
  features: Feature[];
  aboutPreview: object;
  testimonialsData: TestimonialData[];
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;
  noindex?: boolean;
}

export default function AdminHomePageEditor() {
  const [data, setData] = useState<HomePageData>({
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
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchHomePageData();
  }, []);

  const fetchHomePageData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/home-page");
      if (res.ok) {
        const pageData = await res.json();
        if (pageData) {
          setData({
            ...pageData,
            metaTitle: pageData.metaTitle || "",
            metaDescription: pageData.metaDescription || "",
            metaKeywords: pageData.metaKeywords || "",
            ogTitle: pageData.ogTitle || "",
            ogDescription: pageData.ogDescription || "",
            ogImageUrl: pageData.ogImageUrl || "",
            canonicalUrl: pageData.canonicalUrl || "",
            noindex: pageData.noindex || false,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching home page data:", error);
      toast.error("Failed to load home page data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const validSlides = data.heroSlides.filter((slide) => slide.imageUrl && slide.imageUrl.trim() !== "");
    if (validSlides.length === 0) {
      toast.error("At least one carousel image is required");
      return;
    }

    const dataToSave = {
      ...data,
      heroSlides: validSlides,
    };

    setSaving(true);
    try {
      const method = dataToSave.id ? "PUT" : "POST";
      const res = await fetch("/api/home-page", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });

      if (res.ok) {
        const savedData = await res.json();
        setData(savedData);
        toast.success("Home page updated successfully!");
      } else {
        toast.error("Failed to save home page");
      }
    } catch (error) {
      console.error("Error saving home page:", error);
      toast.error("Failed to save home page");
    } finally {
      setSaving(false);
    }
  };

  const addHeroSlide = () => {
    const newSlide: HeroSlide = {
      imageUrl: "",
      alt: "Hero slide image",
    };
    setData({ ...data, heroSlides: [...data.heroSlides, newSlide] });
  };

  const removeHeroSlide = (index: number) => {
    if (data.heroSlides.length === 1) {
      toast.error("At least one carousel image is required");
      return;
    }
    const newSlides = data.heroSlides.filter((_, i) => i !== index);
    setData({ ...data, heroSlides: newSlides });
  };

  const updateHeroSlide = (index: number, field: keyof HeroSlide, value: string) => {
    const newSlides = [...data.heroSlides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setData({ ...data, heroSlides: newSlides });
  };

  const handleImageUpload = async (index: number, file: File) => {
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
        updateHeroSlide(index, "imageUrl", url);
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
      updateHeroSlide(index, "imageUrl", "");
      return;
    }

    try {
      const res = await fetch("/api/upload-carousel", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });

      if (res.ok) {
        updateHeroSlide(index, "imageUrl", "");
        toast.success("Image deleted successfully!");
      } else {
        toast.error("Failed to delete image");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete image");
    }
  };

  const addFeature = () => {
    const newFeature: Feature = {
      icon: "Shield",
      title: "New Feature",
      description: "Feature description",
      bgColor: "bg-blue-100",
    };
    setData({ ...data, features: [...data.features, newFeature] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = data.features.filter((_, i) => i !== index);
    setData({ ...data, features: newFeatures });
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
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
          Save Changes
        </Button>
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
          {/* Hero Section */}
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Hero Title</label>
                <Input value={data.heroTitle} onChange={(e) => setData({ ...data, heroTitle: e.target.value })} placeholder="Main hero title" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
                <Input value={data.heroSubtitle} onChange={(e) => setData({ ...data, heroSubtitle: e.target.value })} placeholder="Hero subtitle" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hero Description</label>
                <Textarea value={data.heroDescription} onChange={(e) => setData({ ...data, heroDescription: e.target.value })} placeholder="Hero description" rows={3} />
              </div>
            </CardContent>
          </Card>

          {/* Hero Slides */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Hero Carousel Slides</CardTitle>
                <Button onClick={addHeroSlide}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Slide
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.heroSlides.map((slide, index) => (
                <Card key={index} className="border-l-4 border-blue-500">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Slide {index + 1}</h4>
                      <Button variant="outline" size="sm" onClick={() => removeHeroSlide(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Upload Image</label>
                      <div className="flex gap-2">
                        <Input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(index, file);
                            }
                          }}
                          disabled={uploadingIndex === index}
                          className="flex-1"
                        />
                        {uploadingIndex === index && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Uploading...
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Max 5MB. Recommended: 1920x1080px (16:9). Supported: JPG, PNG, WebP</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Alt Text (Optional)</label>
                      <Input placeholder="Description of the image" value={slide.alt || ""} onChange={(e) => updateHeroSlide(index, "alt", e.target.value)} />
                    </div>
                    {slide.imageUrl && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium">Preview</label>
                          <Button variant="outline" size="sm" onClick={() => handleDeleteImage(index, slide.imageUrl)} className="text-red-600 hover:text-red-700">
                            <X className="h-4 w-4 mr-1" />
                            Remove Image
                          </Button>
                        </div>
                        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={slide.imageUrl}
                            alt={slide.alt || `Hero slide ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.jpg";
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Features Section */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Features Section</CardTitle>
                <Button onClick={addFeature}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.features.map((feature, index) => (
                <Card key={index} className="border-l-4 border-green-500">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Feature {index + 1}</h4>
                      <Button variant="outline" size="sm" onClick={() => removeFeature(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Icon</label>
                      <IconSelect value={feature.icon} onChange={(value) => updateFeature(index, "icon", value)} placeholder="Select an icon" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Feature Title</label>
                      <Input placeholder="Feature title" value={feature.title} onChange={(e) => updateFeature(index, "title", e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Background Color Class</label>
                      <Input placeholder="e.g., bg-blue-100" value={feature.bgColor} onChange={(e) => updateFeature(index, "bgColor", e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Feature Description</label>
                      <Textarea placeholder="Feature description" value={feature.description} onChange={(e) => updateFeature(index, "description", e.target.value)} rows={2} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
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
