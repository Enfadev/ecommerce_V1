"use client";

import React, { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { products as productsData, Product } from "../data/products";
import { Package, AlertTriangle, CheckCircle, Search, Filter, Download, RefreshCw } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

// Komponen utama manajemen stok & inventaris
export default function InventoryManager() {
  // Simulasi data produk, seharusnya dari API/database
  const [products, setProducts] = useState<Product[]>(
    productsData.map((p) => ({
      ...p,
      stock: p.stock || Math.floor(Math.random() * 100),
    }))
  );
  const [editId, setEditId] = useState<number | null>(null);
  const [newStock, setNewStock] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Edit stok produk
  const handleEditStock = (id: number) => {
    setEditId(id);
    const prod = products.find((p: Product) => p.id === id);
    setNewStock(prod?.stock ?? 0);
  };

  // Simpan stok baru
  const handleSaveStock = (id: number) => {
    setProducts((prev: Product[]) => prev.map((p: Product) => (p.id === id ? { ...p, stock: newStock } : p)));
    setEditId(null);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { status: "out", text: "Out of Stock", color: "bg-red-500/10 text-red-500 border-red-500/20", icon: AlertTriangle };
    if (stock < 10) return { status: "low", text: "Low", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: AlertTriangle };
    return { status: "good", text: "Good", color: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle };
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ["all", ...new Set(products.map((p) => p.category))];

  // Calculate stats
  const stats = {
    total: products.length,
    outOfStock: products.filter((p) => p.stock === 0).length,
    lowStock: products.filter((p) => p.stock < 10 && p.stock > 0).length,
    goodStock: products.filter((p) => p.stock >= 10).length,
    totalValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground mt-1">Monitor and manage product stock</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-xl font-bold">{stats.total}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-xl font-bold">{stats.outOfStock}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <p className="text-xl font-bold">{stats.lowStock}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Good Stock</p>
              <p className="text-xl font-bold">{stats.goodStock}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Inventory Value</p>
              <p className="text-lg font-bold">Rp {stats.totalValue.toLocaleString("id-ID")}</p>
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
              <Input placeholder="Search product..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
          <div className="flex gap-2">
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-3 py-2 border border-border rounded-md bg-background">
              <option value="all">All Categories</option>
              {categories
                .filter((c) => c !== "all")
                .map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Inventory Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Current Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product, index) => {
              const stockInfo = getStockStatus(product.stock);
              const StockIcon = stockInfo.icon;

              return (
                <TableRow key={product.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          target.nextElementSibling?.classList.remove("hidden");
                        }}
                      />
                      <Package className="w-6 h-6 text-muted-foreground hidden" />
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
                  <TableCell className="font-medium">Rp {product.price.toLocaleString("id-ID")}</TableCell>
                  <TableCell>
                    {editId === product.id ? <Input type="number" min={0} value={newStock} onChange={(e) => setNewStock(Number(e.target.value))} className="w-20" /> : <span className="font-mono text-lg">{product.stock}</span>}
                  </TableCell>
                  <TableCell>
                    <Badge className={stockInfo.color}>
                      <StockIcon className="w-3 h-3 mr-1" />
                      {stockInfo.text}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">Rp {(product.price * product.stock).toLocaleString("id-ID")}</TableCell>
                  <TableCell>
                    {editId === product.id ? (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSaveStock(product.id)}>
                          Save
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setEditId(null)}>
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleEditStock(product.id)}>
                        Edit Stock
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
