"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus, Eye, Edit, Trash2, Package, MoreHorizontal, ArrowUpDown, Download, Layout } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { ProductForm } from "./ProductForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  hargaDiskon?: number;
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
  imageFile?: File;
}

export default function AdminProductManagement() {
  // Daftar semua field produk yang bisa ditampilkan
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
    { key: "hargaDiskon", label: "Discount Price" },
    { key: "promoExpired", label: "Promo Expired" },
    { key: "gallery", label: "Gallery" },
    { key: "createdAt", label: "Created At" },
    { key: "updatedAt", label: "Updated At" },
  ];

  // State untuk kolom yang ditampilkan
  const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumns.map(col => col.key));

  // Handler untuk toggle kolom
  const handleToggleColumn = (key: string) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
    );
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
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<keyof Product>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      const modifier = sortOrder === "asc" ? 1 : -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return aValue.localeCompare(bValue) * modifier;
      }
      if (typeof aValue === "number" && typeof bValue === "number") {
        return (aValue - bValue) * modifier;
      }
      return 0;
    });

  const categories = ["all", ...new Set(products.map((p) => p.category).filter(Boolean))];

  const handleSort = (field: keyof Product) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch('/api/product', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error('Failed to delete product');
      setProducts(products.filter((p) => p.id !== id));
    } catch {
      alert('Failed to delete product');
    }
  };

  const handleSave = async (productData: ProductFormData) => {
    if (editingProduct) {
      try {
        let imageUrl = editingProduct.image;
        let galleryUrls = editingProduct.gallery || [];
        // Upload gambar utama jika ada file baru
        if (productData.imageFiles && productData.imageFiles.length > 0) {
          const formData = new FormData();
          formData.append("file", productData.imageFiles[0]);
          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          if (!uploadRes.ok) throw new Error("Failed to upload image");
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.url;
        }
        // Upload gallery images jika ada file baru
        if (productData.imageFiles && productData.imageFiles.length > 1) {
          const galleryForm = new FormData();
          productData.imageFiles.slice(1).forEach((file: File) => {
            galleryForm.append("files", file);
          });
          const galleryRes = await fetch("/api/upload?gallery=1", {
            method: "POST",
            body: galleryForm,
          });
          if (!galleryRes.ok) throw new Error("Failed to upload gallery images");
          const galleryData = await galleryRes.json();
          galleryUrls = galleryData.urls;
        }
        // Update produk ke database dengan semua field
        const res = await fetch(`/api/product`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingProduct.id,
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
            hargaDiskon: productData.hargaDiskon,
            promoExpired: productData.promoExpired,
            gallery: galleryUrls,
          }),
        });
        if (!res.ok) throw new Error("Failed to update product");
        const updatedProduct = await res.json();
        setProducts(products.map((p) => (p.id === updatedProduct.id ? {
          ...p,
          name: updatedProduct.name,
          price: updatedProduct.price,
          image: updatedProduct.imageUrl || "/placeholder-image.svg",
          description: updatedProduct.description || "",
        } : p)));
      } catch {
        alert("Failed to update product");
      }
    } else {
      try {
        let imageUrl = "";
        if (productData.imageFile) {
          const formData = new FormData();
          formData.append("file", productData.imageFile);
          const uploadRes = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
          if (!uploadRes.ok) throw new Error("Failed to upload image");
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.url;
        }
        const res = await fetch("/api/product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: productData.name,
            price: productData.price,
            imageUrl,
            description: productData.description,
          }),
        });
        if (!res.ok) throw new Error("Failed to add product");
        const newProduct = await res.json();
        setProducts([{
          id: newProduct.id,
          name: newProduct.name,
          price: newProduct.price,
          image: newProduct.imageUrl || "/placeholder-image.svg",
          category: "General",
          stock: Math.floor(Math.random() * 50) + 1,
          status: "active",
          description: newProduct.description || "",
          createdAt: new Date(newProduct.createdAt).toLocaleDateString("en-US"),
        }, ...products]);
      } catch {
        alert("Failed to add product");
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
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button onClick={handleAdd} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>
      </div>

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
              <p className="text-xl font-bold">{products.filter((p) => p.stock > 0).length}</p>
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
              <p className="text-xl font-bold">{products.filter((p) => p.stock < 10 && p.stock > 0).length}</p>
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
              <p className="text-xl font-bold">{products.filter((p) => p.stock === 0).length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2">
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
          </div>
        </div>
      </Card>

      {/* Show/Hide Columns */}
      <Card className="mb-4 p-4">
        <div className="flex items-center gap-4">
          {/* ...existing search and category UI... */}
          <div className="flex items-center gap-2">
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
                {allColumns.map(col => (
                  <DropdownMenuItem key={col.key} asChild>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={visibleColumns.includes(col.key)}
                        onChange={() => handleToggleColumn(col.key)}
                      />
                      {col.label}
                    </label>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
            <TableHead className="w-12 text-center">#</TableHead>
            {allColumns.map(col => visibleColumns.includes(col.key) && (
              <TableHead key={col.key} className="text-center">{col.label}</TableHead>
            ))}
            <TableHead className="w-16 text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product, index) => (
              <TableRow key={product.id}>
                <TableCell className="text-center">{index + 1}</TableCell>
                {allColumns.map(col => visibleColumns.includes(col.key) && (
                  <TableCell key={col.key} className="text-center">
                    {col.key === "imageUrl"
                      ? (product.imageUrl ? <Image src={product.imageUrl} alt={product.name} width={48} height={48} className="object-cover rounded" /> : <Package className="w-6 h-6 text-muted-foreground" />)
                      : col.key === "gallery"
                        ? (product.gallery && product.gallery.length > 0 ? (
                            <div className="flex gap-1 flex-wrap justify-center">
                              {product.gallery.map((url, idx) => (
                                <Image key={idx} src={url} alt={`Gallery ${idx + 1}`} width={32} height={32} className="object-cover rounded" />
                              ))}
                            </div>
                          ) : "-")
                        : (product[col.key as keyof Product] ?? "-")}
                  </TableCell>
                ))}
                <TableCell className="text-center">
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
      </Card>

      {/* Product Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <ProductForm product={editingProduct} onSave={handleSave} onCancel={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
