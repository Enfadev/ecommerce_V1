"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";

interface HeroSlide {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  badgeText: string;
  badgeIcon: string;
  bgGradient: string;
  rightIcon: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
  bgColor: string;
}

interface StatData {
  label: string;
  value: string;
  icon: string;
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
  statsData: StatData[];
  aboutPreview: object;
  testimonialsData: TestimonialData[];
}

export default function AdminHomePageEditor() {
  const [data, setData] = useState<HomePageData>({
    id: 0,
    heroTitle: "Welcome to Our Store",
    heroSubtitle: "Best Quality Products",
    heroDescription: "Discover amazing products at great prices",
    heroSlides: [],
    features: [],
    statsData: [],
    aboutPreview: {},
    testimonialsData: [],
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

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
          setData(pageData);
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
    setSaving(true);
    try {
      const method = data.id ? "PUT" : "POST";
      const res = await fetch("/api/home-page", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
      title: "New Slide",
      subtitle: "Subtitle",
      description: "Description",
      buttonText: "Action Button",
      buttonLink: "#",
      badgeText: "Badge",
      badgeIcon: "🔥",
      bgGradient: "from-blue-600 to-purple-600",
      rightIcon: "Gift",
    };
    setData({ ...data, heroSlides: [...data.heroSlides, newSlide] });
  };

  const removeHeroSlide = (index: number) => {
    const newSlides = data.heroSlides.filter((_, i) => i !== index);
    setData({ ...data, heroSlides: newSlides });
  };

  const updateHeroSlide = (index: number, field: keyof HeroSlide, value: string) => {
    const newSlides = [...data.heroSlides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setData({ ...data, heroSlides: newSlides });
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

  const addStat = () => {
    const newStat: StatData = {
      label: "New Stat",
      value: "100+",
      icon: "Users",
    };
    setData({ ...data, statsData: [...data.statsData, newStat] });
  };

  const removeStat = (index: number) => {
    const newStats = data.statsData.filter((_, i) => i !== index);
    setData({ ...data, statsData: newStats });
  };

  const updateStat = (index: number, field: keyof StatData, value: string) => {
    const newStats = [...data.statsData];
    newStats[index] = { ...newStats[index], [field]: value };
    setData({ ...data, statsData: newStats });
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

      {/* Hero Section */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Hero Title</label>
            <Input
              value={data.heroTitle}
              onChange={(e) => setData({ ...data, heroTitle: e.target.value })}
              placeholder="Main hero title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
            <Input
              value={data.heroSubtitle}
              onChange={(e) => setData({ ...data, heroSubtitle: e.target.value })}
              placeholder="Hero subtitle"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Hero Description</label>
            <Textarea
              value={data.heroDescription}
              onChange={(e) => setData({ ...data, heroDescription: e.target.value })}
              placeholder="Hero description"
              rows={3}
            />
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
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Slide title"
                  value={slide.title}
                  onChange={(e) => updateHeroSlide(index, "title", e.target.value)}
                />
                <Input
                  placeholder="Slide subtitle"
                  value={slide.subtitle}
                  onChange={(e) => updateHeroSlide(index, "subtitle", e.target.value)}
                />
                <Input
                  placeholder="Badge text"
                  value={slide.badgeText}
                  onChange={(e) => updateHeroSlide(index, "badgeText", e.target.value)}
                />
                <Input
                  placeholder="Background gradient (e.g., from-blue-600 to-purple-600)"
                  value={slide.bgGradient}
                  onChange={(e) => updateHeroSlide(index, "bgGradient", e.target.value)}
                />
                <div className="md:col-span-2">
                  <Textarea
                    placeholder="Slide description"
                    value={slide.description}
                    onChange={(e) => updateHeroSlide(index, "description", e.target.value)}
                    rows={2}
                  />
                </div>
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
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Icon name (e.g., Shield, Truck)"
                  value={feature.icon}
                  onChange={(e) => updateFeature(index, "icon", e.target.value)}
                />
                <Input
                  placeholder="Feature title"
                  value={feature.title}
                  onChange={(e) => updateFeature(index, "title", e.target.value)}
                />
                <Input
                  placeholder="Background color class"
                  value={feature.bgColor}
                  onChange={(e) => updateFeature(index, "bgColor", e.target.value)}
                />
                <div className="md:col-span-3">
                  <Textarea
                    placeholder="Feature description"
                    value={feature.description}
                    onChange={(e) => updateFeature(index, "description", e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Statistics Section */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Statistics Section</CardTitle>
            <Button onClick={addStat}>
              <Plus className="h-4 w-4 mr-2" />
              Add Statistic
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.statsData.map((stat, index) => (
            <Card key={index} className="border-l-4 border-yellow-500">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Statistic {index + 1}</h4>
                  <Button variant="outline" size="sm" onClick={() => removeStat(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  placeholder="Statistic label"
                  value={stat.label}
                  onChange={(e) => updateStat(index, "label", e.target.value)}
                />
                <Input
                  placeholder="Statistic value"
                  value={stat.value}
                  onChange={(e) => updateStat(index, "value", e.target.value)}
                />
                <Input
                  placeholder="Icon name"
                  value={stat.icon}
                  onChange={(e) => updateStat(index, "icon", e.target.value)}
                />
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
