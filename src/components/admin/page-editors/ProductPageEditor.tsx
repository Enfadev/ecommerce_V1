"use client";

import { Loader2, Package, Globe } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeroSectionEditor } from "../page-editor/HeroSectionEditor";
import { SaveButton } from "../page-editor/SaveButton";
import { PromotionalBannerSection } from "../product-page/PromotionalBannerSection";
import { FeaturedCategoriesSection } from "../product-page/FeaturedCategoriesSection";
import { FilterOptionsSection } from "../product-page/FilterOptionsSection";
import { SortOptionsSection } from "../product-page/SortOptionsSection";
import { SeoContentSection } from "../product-page/SeoContentSection";
import SeoSettingsCard from "@/components/admin/shared/SeoSettingsCard";
import { usePageEditor } from "@/hooks/usePageEditor";

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
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;
  noindex?: boolean;
}

const initialData: ProductPageData = {
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
    bgColor: "#3b82f6",
    isActive: false,
  },
  filterOptions: [],
  sortOptions: [],
  seoContent: [],
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  ogTitle: "",
  ogDescription: "",
  ogImageUrl: "",
  canonicalUrl: "",
  noindex: false,
};

export default function AdminProductPageEditor() {
  const { data, setData, loading, saving, saveData } = usePageEditor<ProductPageData>({
    apiEndpoint: "/api/product-page",
    initialData,
    successMessage: "Product page updated successfully!",
  });

  const addFeaturedCategory = () => {
    setData({
      ...data,
      featuredCategories: [...data.featuredCategories, { name: "New Category", description: "Category description", image: "/category-placeholder.jpg", link: "/category/new", bgColor: "bg-blue-100" }],
    });
  };

  const removeFeaturedCategory = (index: number) => {
    setData({ ...data, featuredCategories: data.featuredCategories.filter((_, i) => i !== index) });
  };

  const updateFeaturedCategory = (index: number, field: keyof FeaturedCategory, value: string) => {
    const newCategories = [...data.featuredCategories];
    newCategories[index] = { ...newCategories[index], [field]: value };
    setData({ ...data, featuredCategories: newCategories });
  };

  const addFilterOption = () => {
    setData({ ...data, filterOptions: [...data.filterOptions, { type: "category", label: "New Filter", options: ["Option 1", "Option 2"] }] });
  };

  const removeFilterOption = (index: number) => {
    setData({ ...data, filterOptions: data.filterOptions.filter((_, i) => i !== index) });
  };

  const updateFilterOption = (index: number, field: keyof FilterOption, value: string | string[]) => {
    const newFilters = [...data.filterOptions];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setData({ ...data, filterOptions: newFilters });
  };

  const addSortOption = () => {
    setData({ ...data, sortOptions: [...data.sortOptions, { value: "new_sort", label: "New Sort Option" }] });
  };

  const removeSortOption = (index: number) => {
    setData({ ...data, sortOptions: data.sortOptions.filter((_, i) => i !== index) });
  };

  const updateSortOption = (index: number, field: keyof SortOption, value: string) => {
    const newSorts = [...data.sortOptions];
    newSorts[index] = { ...newSorts[index], [field]: value };
    setData({ ...data, sortOptions: newSorts });
  };

  const addSeoContent = () => {
    setData({ ...data, seoContent: [...data.seoContent, { title: "New SEO Block", content: "SEO content description", type: "text" }] });
  };

  const removeSeoContent = (index: number) => {
    setData({ ...data, seoContent: data.seoContent.filter((_, i) => i !== index) });
  };

  const updateSeoContent = (index: number, field: keyof SeoContentBlock, value: string) => {
    const newContent = [...data.seoContent];
    newContent[index] = { ...newContent[index], [field]: value };
    setData({ ...data, seoContent: newContent });
  };

  const updatePromotionalBanner = (field: keyof ProductPageData["promotionalBanner"], value: string | boolean) => {
    setData({ ...data, promotionalBanner: { ...data.promotionalBanner, [field]: value } });
  };

  const handleSeoFieldChange = (field: keyof ProductPageData, value: string | boolean) => {
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
        <h1 className="text-2xl font-bold">Product Page Editor</h1>
        <SaveButton onClick={saveData} saving={saving} />
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="content" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
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

          <PromotionalBannerSection banner={data.promotionalBanner} onUpdate={updatePromotionalBanner} />

          <FeaturedCategoriesSection categories={data.featuredCategories} onAdd={addFeaturedCategory} onRemove={removeFeaturedCategory} onUpdate={updateFeaturedCategory} />

          <FilterOptionsSection filters={data.filterOptions} onAdd={addFilterOption} onRemove={removeFilterOption} onUpdate={updateFilterOption} />

          <SortOptionsSection sortOptions={data.sortOptions} onAdd={addSortOption} onRemove={removeSortOption} onUpdate={updateSortOption} />

          <SeoContentSection seoContent={data.seoContent} onAdd={addSeoContent} onRemove={removeSeoContent} onUpdate={updateSeoContent} />
        </TabsContent>

        <TabsContent value="seo">
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
            onChange={handleSeoFieldChange}
            pageName="Product"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
