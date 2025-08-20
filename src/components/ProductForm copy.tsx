"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";

const productSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, "Nama produk wajib diisi"),
  price: z.number().min(1, "Harga harus lebih dari 0"),
  image: z.string().url("URL gambar tidak valid"),
  description: z.string().optional(),
});

type ProductData = z.infer<typeof productSchema>;

type ProductFormProps = {
  product?: ProductData;
  onSave: (product: ProductData) => void;
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

  const onSubmit = (data: ProductData) => {
    onSave({ ...product, ...data });
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div>
        <Label>Nama Produk</Label>
        <Input {...register("name")} />
        {errors.name && <p className="text-red-500 text-xs">{errors.name.message as string}</p>}
      </div>
      <div>
        <Label>Harga</Label>
        <Input type="number" {...register("price", { valueAsNumber: true })} />
        {errors.price && <p className="text-red-500 text-xs">{errors.price.message as string}</p>}
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
