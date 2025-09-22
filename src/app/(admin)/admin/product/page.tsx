"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus, Eye, Edit, Trash2, Package, MoreHorizontal, Layout } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { SimpleProductForm } from "@/components/product/SimpleProductForm";
import { AdminExportButton } from "@/components/admin/AdminExportButton";
import { DiscountDisplay } from "@/components/admin/DiscountDisplay";
import { ExpiringPromoAlert } from "@/components/admin/ExpiringPromoAlert";

interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock?: number;
  status?: string;
  sku?: string;
  brand?: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  discountPrice?: number | null;
  promoExpired?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
  gallery?: string[];
}

interface ProductFormData {
  id?: number;
  name: string;
  price: number;
  description?: string;
  category?: string;
  stock?: number;
  status?: "active" | "inactive" | "draft";
  sku?: string;
  brand?: string;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  discountPrice?: number | null;
  promoExpired?: string;
  imageFile?: File;
  imageFiles?: File[];
  gallery?: string[];
  weight?: number;
  dimensions?: string;
  tags?: string[];
  featured?: boolean;
  allowBackorder?: boolean;
  trackQuantity?: boolean;
  requiresShipping?: boolean;
  taxable?: boolean;
  compareAtPrice?: number | null;
  costPerItem?: number | null;
  barcode?: string;
  warranty?: string;
  minimumOrderQuantity?: number;
  maximumOrderQuantity?: number;
}

export default function AdminProductManagement() {
  const allColumns = [
    { key: "imageUrl", label: "Image" },
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "category", label: "Category" },
    { key: "price", label: "Price" },
    { key: "stock", label: "Stock" },
    { key: "status", label: "Status" },
    { key: "sku", label: "SKU" },
    { key: "brand", label: "Brand" },
    { key: "slug", label: "Slug" },
    { key: "metaTitle", label: "Meta Title" },
    { key: "metaDescription", label: "Meta Description" },
    { key: "discountPrice", label: "Discount Price" },
    { key: "promoExpired", label: "Promo Expired" },
    { key: "gallery", label: "Gallery" },
    { key: "createdAt", label: "Created At" },
    { key: "updatedAt", label: "Updated At" },
  ];

  const defaultImportantColumns = ["imageUrl", "name", "category", "price", "discountPrice", "stock", "status", "sku", "brand"];
  const [visibleColumns, setVisibleColumns] = useState<string[]>(defaultImportantColumns);

  const handleToggleColumn = (key: string) => {
    setVisibleColumns((prev) => (prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]));
  };
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/product");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [discountFilter, setDiscountFilter] = useState<"all" | "on-sale" | "no-discount">("all");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    
    let matchesDiscount = true;
    if (discountFilter === "on-sale") {
      matchesDiscount = !!(product.discountPrice && 
                          product.discountPrice > 0 && 
                          product.discountPrice < product.price &&
                          (!product.promoExpired || new Date(product.promoExpired) > new Date()));
    } else if (discountFilter === "no-discount") {
      matchesDiscount = !product.discountPrice || 
                       product.discountPrice <= 0 ||
                       product.discountPrice >= product.price ||
                       !!(product.promoExpired && new Date(product.promoExpired) <= new Date());
    }
    
    return matchesSearch && matchesCategory && matchesDiscount;
  });

  const categories = ["all", ...new Set(products.map((p) => p.category).filter(Boolean))];

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch("/api/product", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to delete product");
        return;
      }

      setProducts(products.filter((p) => p.id !== id));
      alert("Product deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete product");
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const action = newStatus === "active" ? "activate" : "deactivate";

    if (!window.confirm(`Are you sure you want to ${action} this product?`)) return;

    try {
      const res = await fetch("/api/product", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to update product status");
        return;
      }

      setProducts(products.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
      alert(`Product ${action}d successfully`);
    } catch (error) {
      console.error("Status update error:", error);
      alert("Failed to update product status");
    }
  };

  const handleSave = async (productData: ProductFormData) => {
    if (editingProduct) {
      try {
        let imageUrl = editingProduct.imageUrl;
        let galleryUrls = editingProduct.gallery || [];
        let hasNewImage = false;

        if (productData.imageFiles && productData.imageFiles.length > 0) {
          const formData = new FormData();
          formData.append("file", productData.imageFiles[0]);

          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!uploadRes.ok) {
            const errorData = await uploadRes.json();
            throw new Error(`Failed to upload image: ${errorData.error}`);
          }

          const uploadData = await uploadRes.json();
          imageUrl = uploadData.url;
          hasNewImage = true;

          if (productData.imageFiles.length > 1) {
            const galleryForm = new FormData();
            productData.imageFiles.slice(1).forEach((file: File) => {
              galleryForm.append("files", file);
            });

            const galleryRes = await fetch("/api/upload?gallery=1", {
              method: "POST",
              body: galleryForm,
            });

            if (!galleryRes.ok) {
              const errorData = await galleryRes.json();
              throw new Error(`Failed to upload gallery images: ${errorData.error}`);
            }

            const newGalleryData = await galleryRes.json();
            galleryUrls = [...(productData.gallery || []), ...newGalleryData.urls];
          } else {
            galleryUrls = productData.gallery || [];
          }
        } else {
          galleryUrls = productData.gallery || [];
        }

        // Prepare update data - only include imageUrl if there's a new image uploaded
        const updatePayload: Record<string, unknown> = {
          id: editingProduct.id,
          name: productData.name,
          price: productData.price,
          description: productData.description,
          category: productData.category,
          stock: productData.stock,
          status: productData.status,
          sku: productData.sku,
          brand: productData.brand,
          slug: productData.slug,
          metaTitle: productData.metaTitle,
          metaDescription: productData.metaDescription,
          discountPrice: productData.discountPrice,
          promoExpired: productData.promoExpired,
          gallery: galleryUrls,
        };

        // Only include imageUrl if there's a new image uploaded
        if (hasNewImage) {
          updatePayload.imageUrl = imageUrl;
        }

        const res = await fetch(`/api/product`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(`Failed to update product: ${errorData.error}`);
        }

        const updatedProduct = await res.json();

        setProducts(
          products.map((p) =>
            p.id === updatedProduct.id
              ? {
                  ...updatedProduct,
                  category: updatedProduct.category || "General",
                  stock: updatedProduct.stock || 0,
                  status: updatedProduct.status || "active",
                  discountPrice: updatedProduct.discountPrice,
                  promoExpired: updatedProduct.promoExpired,
                  gallery: updatedProduct.gallery || [],
                  createdAt: updatedProduct.createdAt ? new Date(updatedProduct.createdAt).toLocaleDateString("en-US") : "",
                  updatedAt: updatedProduct.updatedAt ? new Date(updatedProduct.updatedAt).toLocaleDateString("en-US") : "",
                }
              : p
          )
        );

        alert("Product updated successfully!");
      } catch (error: unknown) {
        console.error("Update product error:", error);
        alert(`Failed to update product: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    } else {
      try {
        let imageUrl = "";
        let galleryUrls: string[] = [];

        if (productData.imageFiles && productData.imageFiles.length > 0) {
          const formData = new FormData();
          formData.append("file", productData.imageFiles[0]);

          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });

          if (!uploadRes.ok) {
            const errorData = await uploadRes.json();
            throw new Error(`Failed to upload image: ${errorData.error}`);
          }

          const uploadData = await uploadRes.json();
          imageUrl = uploadData.url;

          if (productData.imageFiles.length > 1) {
            console.log("Uploading gallery images for new product...");
            const galleryForm = new FormData();
            productData.imageFiles.slice(1).forEach((file: File) => {
              galleryForm.append("files", file);
            });

            const galleryRes = await fetch("/api/upload?gallery=1", {
              method: "POST",
              body: galleryForm,
            });

            if (!galleryRes.ok) {
              const errorData = await galleryRes.json();
              throw new Error(`Failed to upload gallery images: ${errorData.error}`);
            }

            const galleryData = await galleryRes.json();
            galleryUrls = galleryData.urls;
          }
        }

        const res = await fetch("/api/product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: productData.name,
            price: productData.price,
            imageUrl,
            description: productData.description,
            category: productData.category,
            stock: productData.stock,
            status: productData.status,
            sku: productData.sku,
            brand: productData.brand,
            slug: productData.slug,
            metaTitle: productData.metaTitle,
            metaDescription: productData.metaDescription,
            discountPrice: productData.discountPrice,
            promoExpired: productData.promoExpired,
            gallery: galleryUrls,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(`Failed to add product: ${errorData.error}`);
        }

        const newProduct = await res.json();

        setProducts([
          {
            ...newProduct,
            category: newProduct.category || "General",
            stock: newProduct.stock || 0,
            status: newProduct.status || "active",
            gallery: newProduct.gallery || [],
            createdAt: new Date(newProduct.createdAt).toLocaleDateString("en-US"),
          },
          ...products,
        ]);

        alert("Product added successfully!");
      } catch (error: unknown) {
        console.error("Add product error:", error);
        alert(`Failed to add product: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }
    setShowForm(false);
    setEditingProduct(null);
  };

  const getStatusColor = (status: string, stock: number) => {
    if (stock === 0) return "bg-red-500/10 text-red-500 border-red-500/20";
    if (stock < 10) return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    return "bg-green-500/10 text-green-500 border-green-500/20";
  };

  const getStatusText = (status: string, stock: number) => {
    if (stock === 0) return "Out of Stock";
    if (stock < 10) return "Low Stock";
    return "Available";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground mt-1">Manage all products in your store</p>
        </div>
        <div className="flex gap-3">
          <AdminExportButton data={filteredProducts as unknown as Record<string, unknown>[]} filename={`products-${new Date().toISOString().split("T")[0]}`} type="products" className="" />
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Expiring Promo Alert */}
      <ExpiringPromoAlert products={products} />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-xl font-bold">{products.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Products</p>
              <p className="text-xl font-bold">{products.filter((p) => (p.stock ?? 0) > 0).length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <p className="text-xl font-bold">{products.filter((p) => (p.stock ?? 0) < 10 && (p.stock ?? 0) > 0).length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-xl font-bold">{products.filter((p) => (p.stock ?? 0) === 0).length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center">
              🏷️
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Products On Sale</p>
              <p className="text-xl font-bold">
                {products.filter((p) => 
                  p.discountPrice && 
                  p.discountPrice > 0 && 
                  p.discountPrice < p.price &&
                  (!p.promoExpired || new Date(p.promoExpired) > new Date())
                ).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex gap-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            {/* Tombol show/hide columns di antara search dan category */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Layout className="w-4 h-4" />
                  Columns: {visibleColumns.length}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="max-h-64 overflow-y-auto">
                <DropdownMenuLabel>Show/Hide Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {allColumns.map((col) => (
                  <DropdownMenuItem key={col.key} asChild>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={visibleColumns.includes(col.key)} onChange={() => handleToggleColumn(col.key)} />
                      {col.label}
                    </label>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Tombol kategori */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Category: {selectedCategory === "all" ? "All" : selectedCategory}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Select Category</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {categories.map((category) => (
                  <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category || "all")}>
                    {category === "all" ? "All Categories" : category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Tombol filter diskon */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  🏷️
                  {discountFilter === "all" ? "All Products" : 
                   discountFilter === "on-sale" ? "On Sale" : "No Discount"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Discount Filter</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setDiscountFilter("all")}>
                  All Products
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDiscountFilter("on-sale")}>
                  🔥 Products On Sale
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDiscountFilter("no-discount")}>
                  Regular Priced
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card>
        <div className="overflow-x-auto border rounded-lg custom-scrollbar">
          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              height: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: hsl(var(--muted));
              border-radius: 3px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: hsl(var(--border));
              border-radius: 3px;
              transition: background-color 0.2s ease;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: hsl(var(--muted-foreground) / 0.4);
            }
            /* Firefox */
            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: hsl(var(--border)) hsl(var(--muted));
            }
          `}</style>
          <div className="min-w-fit">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead className="w-12 text-center sticky left-0 bg-muted/30 z-10 border-r shadow-sm">#</TableHead>
                  {allColumns.map(
                    (col) =>
                      visibleColumns.includes(col.key) && (
                        <TableHead key={col.key} className="text-center whitespace-nowrap min-w-[160px] px-4 py-3">
                          {col.label}
                        </TableHead>
                      )
                  )}
                  <TableHead className="w-24 text-center sticky right-0 bg-muted/30 z-10 border-l shadow-sm">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product, index) => (
                  <TableRow key={product.id} className="hover:bg-muted/20">
                    <TableCell className="text-center sticky left-0 bg-background z-10 border-r font-medium shadow-sm">{index + 1}</TableCell>
                    {allColumns.map(
                      (col) =>
                        visibleColumns.includes(col.key) && (
                          <TableCell key={col.key} className="text-center whitespace-nowrap min-w-[160px] px-4 py-4">
                            {col.key === "imageUrl" ? (
                              product.imageUrl ? (
                                <div className="flex justify-center">
                                  <Image src={product.imageUrl} alt={product.name} width={64} height={64} className="object-cover rounded-lg border" />
                                </div>
                              ) : (
                                <div className="flex justify-center">
                                  <Package className="w-8 h-8 text-muted-foreground" />
                                </div>
                              )
                            ) : col.key === "gallery" ? (
                              product.gallery && product.gallery.length > 0 ? (
                                <div className="flex gap-2 flex-wrap justify-center max-w-[140px] mx-auto">
                                  {product.gallery.slice(0, 3).map((url, idx) => (
                                    <Image key={idx} src={url} alt={`Gallery ${idx + 1}`} width={32} height={32} className="object-cover rounded border" />
                                  ))}
                                  {product.gallery.length > 3 && <div className="w-8 h-8 bg-muted rounded flex items-center justify-center text-xs font-medium border">+{product.gallery.length - 3}</div>}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )
                            ) : col.key === "price" ? (
                              <DiscountDisplay 
                                originalPrice={product.price}
                                discountPrice={product.discountPrice}
                                promoExpired={product.promoExpired}
                                compact={true}
                                showExpiry={false}
                              />
                            ) : col.key === "discountPrice" ? (
                              product.discountPrice && 
                              product.discountPrice > 0 && 
                              product.discountPrice < product.price &&
                              (!product.promoExpired || new Date(product.promoExpired) > new Date()) ? (
                                <div className="space-y-1">
                                  <Badge variant="destructive" className="text-xs">
                                    -{Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                                  </Badge>
                                  <div className="text-xs text-muted-foreground">
                                    ${(product.price - product.discountPrice).toFixed(2)} saved
                                  </div>
                                  {product.promoExpired && (
                                    <div className="text-xs text-orange-600">
                                      Expires: {new Date(product.promoExpired).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">No discount</span>
                              )
                            ) : col.key === "createdAt" || col.key === "updatedAt" ? (
                              product[col.key as keyof Product] ? (
                                <span className="text-sm font-medium">{new Date(product[col.key as keyof Product] as string).toLocaleDateString()}</span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )
                            ) : col.key === "status" ? (
                              <Badge variant="outline" className={`${getStatusColor(product.status || "", product.stock || 0)} px-3 py-1 font-medium`}>
                                {getStatusText(product.status || "", product.stock || 0)}
                              </Badge>
                            ) : col.key === "stock" ? (
                              <span className={`font-bold text-base ${(product.stock || 0) === 0 ? "text-red-500" : (product.stock || 0) < 10 ? "text-yellow-600" : "text-green-600"}`}>{product.stock || 0}</span>
                            ) : col.key === "name" ? (
                              <span className="max-w-[140px] truncate block font-medium text-sm" title={String(product[col.key as keyof Product] || "-")}>
                                {product[col.key as keyof Product] || <span className="text-muted-foreground">-</span>}
                              </span>
                            ) : (
                              <span className="max-w-[140px] truncate block text-sm" title={String(product[col.key as keyof Product] || "-")}>
                                {product[col.key as keyof Product] || <span className="text-muted-foreground">-</span>}
                              </span>
                            )}
                          </TableCell>
                        )
                    )}
                    <TableCell className="text-center sticky right-0 bg-background z-10 border-l shadow-sm">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Action</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEdit(product)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleToggleStatus(product.id, product.status || "active")} className={product.status === "active" ? "text-yellow-600" : "text-green-600"}>
                            <Package className="w-4 h-4 mr-2" />
                            {product.status === "active" ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(product.id)} className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
        {visibleColumns.length > 8 && (
          <div className="p-2 text-center text-sm text-muted-foreground bg-muted/20 border-t">
            <p>💡 Tip: Scroll horizontally to view all {visibleColumns.length} columns. Use the Columns button to hide unnecessary fields.</p>
          </div>
        )}
      </Card>

      {/* Product Form Dialog */}
      {/* Enhanced Product Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-none w-[75vw] h-[80vh] overflow-hidden p-0 grid grid-rows-[auto_1fr]" style={{ maxWidth: "calc(75vw - 1rem)", width: "calc(75vw - 1rem)" }}>
          <DialogHeader className="px-6 py-4 border-b shrink-0">
            <DialogTitle className="text-xl">{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto min-h-0">
            <div className="p-6">
              <SimpleProductForm
                product={
                  editingProduct
                    ? {
                        id: editingProduct.id,
                        name: editingProduct.name,
                        price: editingProduct.price,
                        description: editingProduct.description || "",
                        category: editingProduct.category || "",
                        stock: editingProduct.stock || 0,
                        status: (editingProduct.status as "active" | "inactive" | "draft") || "active",
                        sku: editingProduct.sku || "",
                        brand: editingProduct.brand || "",
                        slug: editingProduct.slug || "",
                        metaTitle: editingProduct.metaTitle || "",
                        metaDescription: editingProduct.metaDescription || "",
                        discountPrice: editingProduct.discountPrice || null,
                        promoExpired: editingProduct.promoExpired || "",
                        gallery: editingProduct.gallery || [],
                      }
                    : undefined
                }
                onSave={handleSave}
                onCancel={() => setShowForm(false)}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
