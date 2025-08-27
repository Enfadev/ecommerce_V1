"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Switch } from "../ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";
import Image from "next/image";
import { Upload, X, Plus, AlertCircle, Package, Tag, Globe, BarChart, DollarSign } from "lucide-react";

const productSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, "Product name is required"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  stock: z.number().min(0, "Stock must be 0 or more"),
  status: z.enum(["active", "inactive", "draft"]),
  sku: z.string().min(2, "SKU is required"),
  brand: z.string().optional(),
  slug: z.string().min(2, "Slug is required"),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  discountPrice: z.number().min(0).optional().nullable(),
  promoExpired: z.string().optional(),
  weight: z.number().min(0, "Weight must be positive").optional(),
  dimensions: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().optional(),
  allowBackorder: z.boolean().optional(),
  trackQuantity: z.boolean().optional(),
  requiresShipping: z.boolean().optional(),
  taxable: z.boolean().optional(),
  compareAtPrice: z.number().min(0).optional().nullable(),
  costPerItem: z.number().min(0).optional().nullable(),
  barcode: z.string().optional(),
  warranty: z.string().optional(),
  minimumOrderQuantity: z.number().min(1).optional(),
  maximumOrderQuantity: z.number().min(1).optional(),
});

type ProductFormData = z.infer<typeof productSchema> & {
  imageFiles?: File[];
  imageUrl?: string;
  gallery?: string[];
};

type ProductFormProps = {
  product?: ProductFormData;
  onSave: (product: ProductFormData) => void;
  onCancel: () => void;
};

const defaultCategories = ["Electronics", "Clothing", "Home & Garden", "Books", "Sports", "Beauty", "Toys", "Food & Beverages", "Automotive", "Health"];

const statusOptions = [
  { value: "active", label: "Active", color: "bg-green-100 text-green-800" },
  { value: "inactive", label: "Inactive", color: "bg-red-100 text-red-800" },
  { value: "draft", label: "Draft", color: "bg-yellow-100 text-yellow-800" },
];

export function EnhancedProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>(product?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [activeTab, setActiveTab] = useState("basic");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      ...product,
      featured: product?.featured || false,
      allowBackorder: product?.allowBackorder || false,
      trackQuantity: product?.trackQuantity || true,
      requiresShipping: product?.requiresShipping || true,
      taxable: product?.taxable || true,
      status: product?.status || "active",
    },
  });

  const watchedPrice = watch("price");
  const watchedDiscountPrice = watch("discountPrice");

  useEffect(() => {
    if (product?.gallery) {
      setImagePreviews(product.gallery);
    }
  }, [product]);

  // Cleanup URL objects on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreviews]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    setValue("name", name);
    setValue("slug", slug);
  };

  const onImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const filesArray = Array.from(files);
      setValue("imageFiles", filesArray);

      const previews = filesArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...previews]);
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => {
      const urlToRemove = prev[index];
      if (urlToRemove?.startsWith("blob:")) {
        URL.revokeObjectURL(urlToRemove);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      setValue("tags", newTags);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    setValue("tags", newTags);
  };

  const onSubmit = (data: ProductFormData) => {
    onSave({ ...data, tags, gallery: imagePreviews });
  };

  const calculateProfitMargin = () => {
    const price = watchedPrice || 0;
    const cost = watch("costPerItem") || 0;
    if (price > 0 && cost > 0) {
      return (((price - cost) / price) * 100).toFixed(1);
    }
    return "0";
  };

  const getDiscountPercentage = () => {
    const price = watchedPrice || 0;
    const discount = watchedDiscountPrice || 0;
    if (price > 0 && discount > 0 && discount < price) {
      return (((price - discount) / price) * 100).toFixed(1);
    }
    return "0";
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">{product ? "Edit Product" : "Add New Product"}</h2>
            <p className="text-muted-foreground">{product ? "Update product information" : "Create a new product for your store"}</p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">{product ? "Update Product" : "Create Product"}</Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="w-full overflow-x-auto">
            <TabsList className="inline-flex w-auto min-w-full h-auto p-1 bg-muted rounded-lg">
              <TabsTrigger value="basic" className="flex items-center gap-2 px-6 py-3 text-sm font-medium whitespace-nowrap">
                <Package className="w-4 h-4 shrink-0" />
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="pricing" className="flex items-center gap-2 px-6 py-3 text-sm font-medium whitespace-nowrap">
                <DollarSign className="w-4 h-4 shrink-0" />
                Pricing
              </TabsTrigger>
              <TabsTrigger value="inventory" className="flex items-center gap-2 px-6 py-3 text-sm font-medium whitespace-nowrap">
                <BarChart className="w-4 h-4 shrink-0" />
                Inventory
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex items-center gap-2 px-6 py-3 text-sm font-medium whitespace-nowrap">
                <Globe className="w-4 h-4 shrink-0" />
                SEO & Media
              </TabsTrigger>
              <TabsTrigger value="advanced" className="flex items-center gap-2 px-6 py-3 text-sm font-medium whitespace-nowrap">
                <Tag className="w-4 h-4 shrink-0" />
                Advanced
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-4 h-[500px] overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input id="name" onChange={handleNameChange} placeholder="Enter product name" defaultValue={product?.name} />
                    {errors.name && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug *</Label>
                    <Input id="slug" {...register("slug")} placeholder="product-url-slug" />
                    {errors.slug && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.slug.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" {...register("description")} placeholder="Describe your product..." rows={4} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select onValueChange={(value: string) => setValue("category", value)} defaultValue={product?.category}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {defaultCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input id="brand" {...register("brand")} placeholder="Enter brand name" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select onValueChange={(value: string) => setValue("status", value as "active" | "inactive" | "draft")} defaultValue={product?.status}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          <div className="flex items-center gap-2">
                            <Badge className={status.color}>{status.label}</Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.status && (
                    <p className="text-red-500 text-xs flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.status.message}
                    </p>
                  )}
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={tagInput}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTagInput(e.target.value)}
                      placeholder="Add a tag"
                      onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-red-500">
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="space-y-4 h-[500px] overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Pricing Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input id="price" type="number" step="0.01" {...register("price", { valueAsNumber: true })} placeholder="0.00" />
                    {errors.price && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="compareAtPrice">Compare at Price</Label>
                    <Input id="compareAtPrice" type="number" step="0.01" {...register("compareAtPrice", { valueAsNumber: true })} placeholder="0.00" />
                    <p className="text-xs text-muted-foreground">Show a higher price that you&apos;re comparing against</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="discountPrice">Sale Price</Label>
                    <Input id="discountPrice" type="number" step="0.01" {...register("discountPrice", { valueAsNumber: true })} placeholder="0.00" />
                    {watchedDiscountPrice && watchedPrice && <p className="text-xs text-green-600">{getDiscountPercentage()}% discount</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="costPerItem">Cost per Item</Label>
                    <Input id="costPerItem" type="number" step="0.01" {...register("costPerItem", { valueAsNumber: true })} placeholder="0.00" />
                    {watch("costPerItem") && watchedPrice && <p className="text-xs text-blue-600">Profit margin: {calculateProfitMargin()}%</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="promoExpired">Sale End Date</Label>
                  <Input id="promoExpired" type="datetime-local" {...register("promoExpired")} />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="taxable" defaultChecked={watch("taxable")} onCheckedChange={(checked: boolean) => setValue("taxable", checked)} />
                  <Label htmlFor="taxable">Charge tax on this product</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-4 h-[500px] overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="w-5 h-5" />
                  Inventory Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU *</Label>
                    <Input id="sku" {...register("sku")} placeholder="Product SKU" />
                    {errors.sku && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.sku.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="barcode">Barcode</Label>
                    <Input id="barcode" {...register("barcode")} placeholder="Product barcode" />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="trackQuantity" defaultChecked={watch("trackQuantity")} onCheckedChange={(checked: boolean) => setValue("trackQuantity", checked)} />
                  <Label htmlFor="trackQuantity">Track quantity</Label>
                </div>

                {watch("trackQuantity") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock Quantity *</Label>
                      <Input id="stock" type="number" {...register("stock", { valueAsNumber: true })} placeholder="0" />
                      {errors.stock && (
                        <p className="text-red-500 text-xs flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.stock.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 mt-6">
                      <Switch id="allowBackorder" defaultChecked={watch("allowBackorder")} onCheckedChange={(checked: boolean) => setValue("allowBackorder", checked)} />
                      <Label htmlFor="allowBackorder">Continue selling when out of stock</Label>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minimumOrderQuantity">Minimum Order Quantity</Label>
                    <Input id="minimumOrderQuantity" type="number" {...register("minimumOrderQuantity", { valueAsNumber: true })} placeholder="1" min="1" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maximumOrderQuantity">Maximum Order Quantity</Label>
                    <Input id="maximumOrderQuantity" type="number" {...register("maximumOrderQuantity", { valueAsNumber: true })} placeholder="No limit" min="1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO & Media Tab */}
          <TabsContent value="seo" className="space-y-4 h-[500px] overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Product Images
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Upload Images</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={onImagesChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-muted-foreground">Upload multiple images. First image will be the main product image.</p>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviews.map((src, index) => (
                      <div key={index} className="relative group">
                        <Image src={src} alt={`Preview ${index + 1}`} width={200} height={200} className="w-full h-32 object-cover rounded-lg border" />
                        <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-3 h-3" />
                        </button>
                        {index === 0 && (
                          <Badge className="absolute bottom-2 left-2" variant="default">
                            Main
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  SEO Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input id="metaTitle" {...register("metaTitle")} placeholder="SEO title for search engines" maxLength={60} />
                  <p className="text-xs text-muted-foreground">{watch("metaTitle")?.length || 0}/60 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea id="metaDescription" {...register("metaDescription")} placeholder="SEO description for search engines" rows={3} maxLength={160} />
                  <p className="text-xs text-muted-foreground">{watch("metaDescription")?.length || 0}/160 characters</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced" className="space-y-4 h-[500px] overflow-y-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Advanced Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input id="weight" type="number" step="0.01" {...register("weight", { valueAsNumber: true })} placeholder="0.0" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensions (L×W×H cm)</Label>
                    <Input id="dimensions" {...register("dimensions")} placeholder="e.g., 10×20×5" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="warranty">Warranty Information</Label>
                  <Input id="warranty" {...register("warranty")} placeholder="e.g., 1 year manufacturer warranty" />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Product Options</h4>

                  <div className="flex items-center space-x-2">
                    <Switch id="featured" defaultChecked={watch("featured")} onCheckedChange={(checked: boolean) => setValue("featured", checked)} />
                    <Label htmlFor="featured">Featured product</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch id="requiresShipping" defaultChecked={watch("requiresShipping")} onCheckedChange={(checked: boolean) => setValue("requiresShipping", checked)} />
                    <Label htmlFor="requiresShipping">This is a physical product</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
