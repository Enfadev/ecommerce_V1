"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "./ui/input";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Label } from "./ui/label";

const productSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, "Product name is required"),
  price: z.number().min(1, "Price must be greater than 0"),
  description: z.string().optional(),
  category: z.string().min(2, "Category is required"),
  stock: z.number().min(0, "Stock must be 0 or more"),
  status: z.string().min(2, "Status is required"),
  sku: z.string().min(2, "SKU is required"),
  brand: z.string().optional(),
  slug: z.string().min(2, "Slug is required"),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  hargaDiskon: z.number().optional(),
  promoExpired: z.string().optional(),
});

type ProductFormProps = {
  product?: any;
  onSave: (product: any) => void;
  onCancel: () => void;
};

export function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: product || { name: "", price: 0, image: "", description: "" },
  });


  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const onImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const onSubmit = (data: any) => {
    onSave({ ...product, ...data, imageFiles });
    reset();
    setImageFiles([]);
    setImagePreviews([]);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div>
        <Label>Product Name</Label>
        <Input {...register("name" )} />
        {errors.name && <p className="text-red-500 text-xs">{errors.name.message as string}</p>}
      </div>
      <div>
        <Label>Price</Label>
        <Input type="number" {...register("price", { valueAsNumber: true })} />
        {errors.price && <p className="text-red-500 text-xs">{errors.price.message as string}</p>}
      </div>
      <div>
        <Label>Category</Label>
        <Input {...register("category")} />
        {errors.category && <p className="text-red-500 text-xs">{errors.category.message as string}</p>}
      </div>
      <div>
        <Label>Stock</Label>
        <Input type="number" {...register("stock", { valueAsNumber: true })} />
        {errors.stock && <p className="text-red-500 text-xs">{errors.stock.message as string}</p>}
      </div>
      <div>
        <Label>Status</Label>
        <Input {...register("status")} />
        {errors.status && <p className="text-red-500 text-xs">{errors.status.message as string}</p>}
      </div>
      <div>
        <Label>SKU</Label>
        <Input {...register("sku")} />
        {errors.sku && <p className="text-red-500 text-xs">{errors.sku.message as string}</p>}
      </div>
      <div>
        <Label>Brand</Label>
        <Input {...register("brand")} />
      </div>
      <div>
        <Label>Slug</Label>
        <Input {...register("slug")} />
        {errors.slug && <p className="text-red-500 text-xs">{errors.slug.message as string}</p>}
      </div>
      <div>
        <Label>Meta Title</Label>
        <Input {...register("metaTitle")} />
      </div>
      <div>
        <Label>Meta Description</Label>
        <Input {...register("metaDescription")} />
      </div>
      <div>
        <Label>Discount Price</Label>
        <Input type="number" {...register("hargaDiskon", { valueAsNumber: true })} />
      </div>
      <div>
        <Label>Promo Expired</Label>
        <Input type="date" {...register("promoExpired")} />
      </div>
      <div>
        <Label>Upload Images (Gallery)</Label>
        <Input type="file" accept="image/*" multiple onChange={onImagesChange} />
        {imagePreviews.length > 0 && (
          <div className="flex gap-2 mt-2 flex-wrap">
            {imagePreviews.map((src, idx) => (
              <img key={idx} src={src} alt={`Preview ${idx + 1}`} className="w-20 h-20 object-cover rounded" />
            ))}
          </div>
        )}
      </div>
      <div>
        <Label>Description</Label>
        <Input {...register("description")} />
      </div>
      <div className="flex gap-2">
        <Button type="submit">Save</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
