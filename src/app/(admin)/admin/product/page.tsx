"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, RefreshCw } from "lucide-react";
import { AdminExportButton } from "@/components/admin/AdminExportButton";
import { ExpiringPromoAlert } from "@/components/admin/ExpiringPromoAlert";
import { ProductStats } from "@/components/admin/products/ProductStats";
import { ProductFilters } from "@/components/admin/products/ProductFilters";
import { ProductTable } from "@/components/admin/products/ProductTable";
import { ProductFormDialog } from "@/components/admin/products/ProductFormDialog";
import { useProducts, type Product } from "@/hooks/useProducts";
import { saveProduct } from "@/lib/product-actions";
import { toast } from "sonner";
import { PRODUCT_TABLE_COLUMNS, DEFAULT_VISIBLE_COLUMNS } from "@/types/product";
import type { ProductFormData } from "@/types/product";

export default function AdminProductManagement() {
  const { products, stats, loading, error, fetchProducts, deleteProduct, updateProductStatus, setProducts } = useProducts();

  const [visibleColumns, setVisibleColumns] = useState<string[]>([...DEFAULT_VISIBLE_COLUMNS]);
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
      matchesDiscount = !!(product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price && (!product.promoExpired || new Date(product.promoExpired) > new Date()));
    } else if (discountFilter === "no-discount") {
      matchesDiscount = !product.discountPrice || product.discountPrice <= 0 || product.discountPrice >= product.price || !!(product.promoExpired && new Date(product.promoExpired) <= new Date());
    }

    return matchesSearch && matchesCategory && matchesDiscount;
  });

  const categories = ["all", ...new Set(products.map((p) => p.category).filter(Boolean))] as string[];

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
      await deleteProduct(id);
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const action = newStatus === "active" ? "activate" : "deactivate";

    if (!window.confirm(`Are you sure you want to ${action} this product?`)) return;

    try {
      await updateProductStatus(id, newStatus);
      toast.success(`Product ${action}d successfully`);
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update product status");
    }
  };

  const handleSave = async (productData: ProductFormData) => {
    await saveProduct(productData, editingProduct, products, setProducts);
    setShowForm(false);
    setEditingProduct(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p className="text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <p className="text-lg text-red-500 mb-4">{error}</p>
          <Button onClick={fetchProducts}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      <ExpiringPromoAlert products={products} />

      <ProductStats stats={stats} />

      <ProductFilters
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        discountFilter={discountFilter}
        categories={categories}
        visibleColumns={visibleColumns}
        allColumns={PRODUCT_TABLE_COLUMNS}
        onSearchChange={setSearchQuery}
        onCategoryChange={setSelectedCategory}
        onDiscountFilterChange={setDiscountFilter}
        onToggleColumn={(key) => setVisibleColumns((prev) => (prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]))}
      />

      <ProductTable products={filteredProducts} visibleColumns={visibleColumns} allColumns={PRODUCT_TABLE_COLUMNS} onEdit={handleEdit} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />

      <ProductFormDialog open={showForm} editingProduct={editingProduct} onOpenChange={setShowForm} onSave={handleSave} />
    </div>
  );
}
