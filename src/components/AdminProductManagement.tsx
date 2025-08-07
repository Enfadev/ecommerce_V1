"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus, Eye, Edit, Trash2, Package, MoreHorizontal, ArrowUpDown, Download } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { ProductForm } from "./ProductForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
  status: string;
  image: string;
  description?: string;
  createdAt?: string;
}

interface ProductFormData {
  id?: number;
  name: string;
  price: number;
  description?: string;
  imageFile?: File;
}

export default function AdminProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/product");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.map((p: {
            id: number;
            name: string;
            price: number;
            imageUrl: string | null;
            description: string | null;
            createdAt: string;
          }) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            image: p.imageUrl || "/placeholder-image.svg",
            category: "General", // Default category since it's not in DB
            stock: Math.floor(Math.random() * 50) + 1, // Random stock for demo
            status: "active",
            description: p.description || "",
            createdAt: new Date(p.createdAt).toLocaleDateString("en-US"),
          })));
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
      
      setProducts(products.map((p) => (p.id === productData.id ? { ...p, ...productData, updatedAt: new Date().toLocaleDateString("id-ID") } : p)));
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

      {/* Products Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("name")} className="gap-1 p-0 h-auto">
                  Product Name
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("price")} className="gap-1 p-0 h-auto">
                  Price
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("stock")} className="gap-1 p-0 h-auto">
                  Stock
                  <ArrowUpDown className="w-4 h-4" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-12">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product, index) => (
              <TableRow key={product.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden relative">
                    {product.image && product.image !== "/placeholder-image.svg" ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                        onError={() => {
                          // Fallback handled by Next.js automatically
                        }}
                      />
                    ) : (
                      <Package className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{product.category}</Badge>
                </TableCell>
                <TableCell className="font-medium">${product.price.toLocaleString("en-US", { style: "currency", currency: "USD" })}</TableCell>
                <TableCell>
                  <span className="font-mono">{product.stock}</span>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(product.status, product.stock)}>{getStatusText(product.status, product.stock)}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">{product.createdAt}</TableCell>
                <TableCell>
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
