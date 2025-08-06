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
  name: z.string().min(2, "Nama produk wajib diisi"),
  price: z.number().min(1, "Harga harus lebih dari 0"),
  image: z.string().url("URL gambar tidak valid"),
  description: z.string().optional(),
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


  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data: any) => {
    onSave({ ...product, ...data, imageFile });
    reset();
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div>
        <Label>Nama Produk</Label>
        <Input {...register("name")} />
        {errors.name && <p className="text-red-500 text-xs">{errors.name.message as string}</p>}
      <div>
        <Label>Upload Gambar</Label>
        <Input type="file" accept="image/*" onChange={onImageChange} />
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover mt-2 rounded" />
        )}
      </div>
      </div>
      <div>
        <Label>URL Gambar</Label>
        <Input {...register("image")} />
        {errors.image && <p className="text-red-500 text-xs">{errors.image.message as string}</p>}
      </div>
      <div>
        <Label>Deskripsi</Label>
        <Input {...register("description")} />
      </div>
      <div className="flex gap-2">
        <Button type="submit">Simpan</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
      </div>
    </form>
  );
}
