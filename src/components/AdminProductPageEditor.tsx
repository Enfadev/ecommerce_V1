"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Save, Plus, Trash2 } from "lucide-react";

interface FeaturedCategory {
  name: string;
  description: string;
  image: string;
  link: string;
  bgColor: string;
}

interface FilterOption {
  type: string;
  label: string;
  options: string[];
}

interface SortOption {
  value: string;
  label: string;
}

interface SeoContentBlock {
  title: string;
  content: string;
  type: string;
}

interface ProductPageData {
  id: number;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  featuredCategories: FeaturedCategory[];
  promotionalBanner: {
    title: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    bgColor: string;
    isActive: boolean;
  };
  filterOptions: FilterOption[];
  sortOptions: SortOption[];
  seoContent: SeoContentBlock[];
}

export default function AdminProductPageEditor() {
  const [data, setData] = useState<ProductPageData>({
    id: 0,
    heroTitle: "Our Products",
    heroSubtitle: "Quality Products",
    heroDescription: "Discover our amazing product collection",
    featuredCategories: [],
    promotionalBanner: {
      title: "",
      description: "",
      buttonText: "",
      buttonLink: "",
      bgColor: "",
      isActive: false,
    },
    filterOptions: [],
    sortOptions: [],
    seoContent: [],
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProductPageData();
  }, []);

  const fetchProductPageData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/product-page");
      if (res.ok) {
        const pageData = await res.json();
        if (pageData) {
          // Ensure arrays are properly handled from JSON fields
          const processedData = {
            ...pageData,
            featuredCategories: Array.isArray(pageData.featuredCategories) 
              ? pageData.featuredCategories 
              : [],
            filterOptions: Array.isArray(pageData.filterOptions) 
              ? pageData.filterOptions 
              : [],
            sortOptions: Array.isArray(pageData.sortOptions) 
              ? pageData.sortOptions 
              : [],
            seoContent: Array.isArray(pageData.seoContent) 
              ? pageData.seoContent 
              : (pageData.seoContent ? [pageData.seoContent] : []),
            promotionalBanner: pageData.promotionalBanner || {
              title: "",
              description: "",
              buttonText: "",
              buttonLink: "",
              bgColor: "#3b82f6",
              isActive: false
            }
          };
          setData(processedData);
        }
      }
    } catch (error) {
      console.error("Error fetching product page data:", error);
      toast.error("Failed to load product page data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const method = data.id ? "PUT" : "POST";
      const res = await fetch("/api/product-page", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const savedData = await res.json();
        setData(savedData);
        toast.success("Product page updated successfully!");
      } else {
        toast.error("Failed to save product page");
      }
    } catch (error) {
      console.error("Error saving product page:", error);
      toast.error("Failed to save product page");
    } finally {
      setSaving(false);
    }
  };

  const addFeaturedCategory = () => {
    const newCategory: FeaturedCategory = {
      name: "New Category",
      description: "Category description",
      image: "/category-placeholder.jpg",
      link: "/category/new",
      bgColor: "bg-blue-100",
    };
    setData({ 
      ...data, 
      featuredCategories: Array.isArray(data.featuredCategories) 
        ? [...data.featuredCategories, newCategory]
        : [newCategory]
    });
  };

  const removeFeaturedCategory = (index: number) => {
    if (!Array.isArray(data.featuredCategories)) return;
    const newCategories = data.featuredCategories.filter((_, i) => i !== index);
    setData({ ...data, featuredCategories: newCategories });
  };

  const updateFeaturedCategory = (index: number, field: keyof FeaturedCategory, value: string) => {
    if (!Array.isArray(data.featuredCategories)) return;
    const newCategories = [...data.featuredCategories];
    newCategories[index] = { ...newCategories[index], [field]: value };
    setData({ ...data, featuredCategories: newCategories });
  };

  const addFilterOption = () => {
    const newFilter: FilterOption = {
      type: "category",
      label: "New Filter",
      options: ["Option 1", "Option 2"],
    };
    setData({ ...data, filterOptions: [...data.filterOptions, newFilter] });
  };

  const removeFilterOption = (index: number) => {
    const newFilters = data.filterOptions.filter((_, i) => i !== index);
    setData({ ...data, filterOptions: newFilters });
  };

  const updateFilterOption = (index: number, field: keyof FilterOption, value: string | string[]) => {
    const newFilters = [...data.filterOptions];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setData({ ...data, filterOptions: newFilters });
  };

  const addSortOption = () => {
    const newSort: SortOption = {
      value: "new_sort",
      label: "New Sort Option",
    };
    setData({ 
      ...data, 
      sortOptions: Array.isArray(data.sortOptions) 
        ? [...data.sortOptions, newSort]
        : [newSort]
    });
  };

  const removeSortOption = (index: number) => {
    if (!Array.isArray(data.sortOptions)) return;
    const newSorts = data.sortOptions.filter((_, i) => i !== index);
    setData({ ...data, sortOptions: newSorts });
  };

  const updateSortOption = (index: number, field: keyof SortOption, value: string) => {
    if (!Array.isArray(data.sortOptions)) return;
    const newSorts = [...data.sortOptions];
    newSorts[index] = { ...newSorts[index], [field]: value };
    setData({ ...data, sortOptions: newSorts });
  };

  const addSeoContent = () => {
    const newContent: SeoContentBlock = {
      title: "New SEO Block",
      content: "SEO content description",
      type: "text",
    };
    setData({ 
      ...data, 
      seoContent: Array.isArray(data.seoContent) 
        ? [...data.seoContent, newContent]
        : [newContent]
    });
  };

  const removeSeoContent = (index: number) => {
    if (!Array.isArray(data.seoContent)) return;
    const newContent = data.seoContent.filter((_, i) => i !== index);
    setData({ ...data, seoContent: newContent });
  };

  const updateSeoContent = (index: number, field: keyof SeoContentBlock, value: string) => {
    if (!Array.isArray(data.seoContent)) return;
    const newContent = [...data.seoContent];
    newContent[index] = { ...newContent[index], [field]: value };
    setData({ ...data, seoContent: newContent });
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
        <h1 className="text-2xl font-bold">Product Page Editor</h1>
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
              placeholder="Product page title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
            <Input
              value={data.heroSubtitle}
              onChange={(e) => setData({ ...data, heroSubtitle: e.target.value })}
              placeholder="Product page subtitle"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Hero Description</label>
            <Textarea
              value={data.heroDescription}
              onChange={(e) => setData({ ...data, heroDescription: e.target.value })}
              placeholder="Product page description"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Promotional Banner */}
      <Card>
        <CardHeader>
          <CardTitle>Promotional Banner</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={data.promotionalBanner.isActive}
              onChange={(e) =>
                setData({
                  ...data,
                  promotionalBanner: { ...data.promotionalBanner, isActive: e.target.checked },
                })
              }
            />
            <label className="text-sm font-medium">Enable Promotional Banner</label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Banner title"
              value={data.promotionalBanner.title}
              onChange={(e) =>
                setData({
                  ...data,
                  promotionalBanner: { ...data.promotionalBanner, title: e.target.value },
                })
              }
            />
            <Input
              placeholder="Button text"
              value={data.promotionalBanner.buttonText}
              onChange={(e) =>
                setData({
                  ...data,
                  promotionalBanner: { ...data.promotionalBanner, buttonText: e.target.value },
                })
              }
            />
            <Input
              placeholder="Button link"
              value={data.promotionalBanner.buttonLink}
              onChange={(e) =>
                setData({
                  ...data,
                  promotionalBanner: { ...data.promotionalBanner, buttonLink: e.target.value },
                })
              }
            />
            <Input
              placeholder="Background color class"
              value={data.promotionalBanner.bgColor}
              onChange={(e) =>
                setData({
                  ...data,
                  promotionalBanner: { ...data.promotionalBanner, bgColor: e.target.value },
                })
              }
            />
          </div>
          <Textarea
            placeholder="Banner description"
            value={data.promotionalBanner.description}
            onChange={(e) =>
              setData({
                ...data,
                promotionalBanner: { ...data.promotionalBanner, description: e.target.value },
              })
            }
            rows={2}
          />
        </CardContent>
      </Card>

      {/* Featured Categories */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Featured Categories</CardTitle>
            <Button onClick={addFeaturedCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.isArray(data.featuredCategories) && data.featuredCategories.map((category, index) => (
            <Card key={index} className="border-l-4 border-blue-500">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Category {index + 1}</h4>
                  <Button variant="outline" size="sm" onClick={() => removeFeaturedCategory(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Category name"
                  value={category.name}
                  onChange={(e) => updateFeaturedCategory(index, "name", e.target.value)}
                />
                <Input
                  placeholder="Category link"
                  value={category.link}
                  onChange={(e) => updateFeaturedCategory(index, "link", e.target.value)}
                />
                <Input
                  placeholder="Image URL"
                  value={category.image}
                  onChange={(e) => updateFeaturedCategory(index, "image", e.target.value)}
                />
                <Input
                  placeholder="Background color class"
                  value={category.bgColor}
                  onChange={(e) => updateFeaturedCategory(index, "bgColor", e.target.value)}
                />
                <div className="md:col-span-2">
                  <Textarea
                    placeholder="Category description"
                    value={category.description}
                    onChange={(e) => updateFeaturedCategory(index, "description", e.target.value)}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Sort Options */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Sort Options</CardTitle>
            <Button onClick={addSortOption}>
              <Plus className="h-4 w-4 mr-2" />
              Add Sort Option
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.isArray(data.sortOptions) && data.sortOptions.map((sort, index) => (
            <Card key={index} className="border-l-4 border-green-500">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Sort Option {index + 1}</h4>
                  <Button variant="outline" size="sm" onClick={() => removeSortOption(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Sort value"
                  value={sort.value}
                  onChange={(e) => updateSortOption(index, "value", e.target.value)}
                />
                <Input
                  placeholder="Sort label"
                  value={sort.label}
                  onChange={(e) => updateSortOption(index, "label", e.target.value)}
                />
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* SEO Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>SEO Content Blocks</CardTitle>
            <Button onClick={addSeoContent}>
              <Plus className="h-4 w-4 mr-2" />
              Add Content Block
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.isArray(data.seoContent) && data.seoContent.map((content, index) => (
            <Card key={index} className="border-l-4 border-purple-500">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Content Block {index + 1}</h4>
                  <Button variant="outline" size="sm" onClick={() => removeSeoContent(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Content title"
                  value={content.title}
                  onChange={(e) => updateSeoContent(index, "title", e.target.value)}
                />
                <Input
                  placeholder="Content type"
                  value={content.type}
                  onChange={(e) => updateSeoContent(index, "type", e.target.value)}
                />
                <div className="md:col-span-2">
                  <Textarea
                    placeholder="Content description"
                    value={content.content}
                    onChange={(e) => updateSeoContent(index, "content", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
