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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import Image from "next/image";
import { Upload, X, AlertCircle, Package, Globe, DollarSign } from "lucide-react";
import { CategoryInput } from "../ui/category-input";

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
  tags: z.array(z.string()).optional(),
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

const statusOptions = [
  { value: "active", label: "Active", color: "bg-green-100 text-green-800" },
  { value: "inactive", label: "Inactive", color: "bg-red-100 text-red-800" },
  { value: "draft", label: "Draft", color: "bg-yellow-100 text-yellow-800" },
];

export function SimpleProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("basic");
  const [tags, setTags] = useState<string[]>(product?.tags || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      ...product,
      status: product?.status || "active",
      discountPrice: product?.discountPrice ?? undefined,
      promoExpired: product?.promoExpired
        ? (() => {
            try {
              // If it's already in local datetime format, use it directly
              if (product.promoExpired.includes("T") && product.promoExpired.length === 16) {
                return product.promoExpired;
              } else {
                // Convert ISO string to local datetime-local format
                const date = new Date(product.promoExpired);
                if (!isNaN(date.getTime())) {
                  const year = date.getFullYear();
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  const day = String(date.getDate()).padStart(2, "0");
                  const hours = String(date.getHours()).padStart(2, "0");
                  const minutes = String(date.getMinutes()).padStart(2, "0");
                  return `${year}-${month}-${day}T${hours}:${minutes}`;
                }
              }
              return "";
            } catch {
              return "";
            }
          })()
        : "",
    },
  });

  const watchedPrice = watch("price");
  const watchedDiscountPrice = watch("discountPrice");

  useEffect(() => {
    if (product?.gallery) {
      setImagePreviews(product.gallery);
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      // Format promoExpired for datetime-local input (preserve original input)
      let formattedPromoExpired = "";
      if (product.promoExpired) {
        try {
          // If it's already in local datetime format, use it directly
          if (product.promoExpired.includes("T") && product.promoExpired.length === 16) {
            formattedPromoExpired = product.promoExpired;
          } else {
            // Convert ISO string to local datetime-local format
            const date = new Date(product.promoExpired);
            if (!isNaN(date.getTime())) {
              // Create local datetime string manually to avoid timezone conversion
              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, "0");
              const day = String(date.getDate()).padStart(2, "0");
              const hours = String(date.getHours()).padStart(2, "0");
              const minutes = String(date.getMinutes()).padStart(2, "0");
              formattedPromoExpired = `${year}-${month}-${day}T${hours}:${minutes}`;
            }
          }
        } catch (error) {
          console.error("Error formatting promoExpired date:", error);
        }
      }

      reset({
        ...product,
        status: product?.status || "active",
        discountPrice: product?.discountPrice ?? undefined,
        promoExpired: formattedPromoExpired,
      });
      setTags(product?.tags || []);
    }
  }, [product, reset]);

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

  const onSubmit = (data: ProductFormData) => {
    // Ensure proper handling of empty values for discountPrice and promoExpired
    const cleanedData = {
      ...data,
      discountPrice: data.discountPrice || undefined,
      promoExpired: data.promoExpired || undefined,
      gallery: imagePreviews,
      tags,
    };
    onSave(cleanedData);
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
    <div className="w-full max-w-none">
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
              <TabsTrigger value="seo" className="flex items-center gap-2 px-6 py-3 text-sm font-medium whitespace-nowrap">
                <Globe className="w-4 h-4 shrink-0" />
                SEO & Media
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input id="name" onChange={handleNameChange} placeholder="Enter product name" defaultValue={product?.name} className="h-11" />
                    {errors.name && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug *</Label>
                    <Input id="slug" {...register("slug")} placeholder="product-url-slug" className="h-11" />
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
                  <Textarea id="description" {...register("description")} placeholder="Describe your product..." rows={3} className="resize-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  <div className="space-y-2 min-w-0">
                    <Label htmlFor="category">Category *</Label>
                    <CategoryInput value={watch("category")} onChange={(value: string) => setValue("category", value)} placeholder="Select or create category" className="h-11 w-full" />
                    {errors.category && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.category.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 min-w-0">
                    <Label htmlFor="brand">Brand</Label>
                    <Input id="brand" {...register("brand")} placeholder="Enter brand name" className="h-11 w-full" />
                  </div>

                  <div className="space-y-2 min-w-0">
                    <Label htmlFor="sku">SKU *</Label>
                    <Input id="sku" {...register("sku")} placeholder="Product SKU" className="h-11 w-full" />
                    {errors.sku && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.sku.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 min-w-0">
                    <Label htmlFor="stock">Stock *</Label>
                    <Input id="stock" type="number" {...register("stock", { valueAsNumber: true })} placeholder="0" className="h-11 w-full" />
                    {errors.stock && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.stock.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2 min-w-0">
                    <Label htmlFor="status">Status *</Label>
                    <Select onValueChange={(value: string) => setValue("status", value as "active" | "inactive" | "draft")} defaultValue={product?.status}>
                      <SelectTrigger className="h-11 w-full">
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
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input id="price" type="number" step="0.01" {...register("price", { valueAsNumber: true })} placeholder="0.00" className="h-12" />
                    {errors.price && (
                      <p className="text-red-500 text-xs flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.price.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discountPrice">Sale Price</Label>
                    <Input
                      id="discountPrice"
                      type="number"
                      step="0.01"
                      {...register("discountPrice", {
                        valueAsNumber: true,
                        setValueAs: (value) => (value === "" ? undefined : Number(value)),
                      })}
                      placeholder="0.00"
                      className="h-12"
                    />
                    {watchedDiscountPrice && watchedPrice && <p className="text-xs text-green-600">{getDiscountPercentage()}% discount</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="promoExpired">Sale End Date</Label>
                    <Input id="promoExpired" type="datetime-local" {...register("promoExpired")} className="h-12" />
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
                  <Globe className="w-5 h-5" />
                  SEO & Meta Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input id="metaTitle" {...register("metaTitle")} placeholder="SEO title for search engines" className="h-12" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea id="metaDescription" {...register("metaDescription")} placeholder="SEO description for search engines" rows={3} className="resize-none" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Product Images
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="images">Upload Images</Label>
                  <Input id="images" type="file" multiple accept="image/*" onChange={onImagesChange} className="h-12" />
                  <p className="text-xs text-muted-foreground">Upload product images. First image will be the main image.</p>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4">
                    {imagePreviews.map((url, index) => (
                      <div key={index} className="relative group">
                        <Image src={url} alt={`Preview ${index + 1}`} width={120} height={120} className="w-full h-28 object-cover rounded-lg border" />
                        <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <X className="w-4 h-4" />
                        </button>
                        {index === 0 && <Badge className="absolute bottom-1 left-1 text-xs">Main</Badge>}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
