"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { AdminExportButton } from "@/components/admin/shared/ExportButton";
import { ExpiringPromoAlert } from "@/components/admin/shared/ExpiringPromoAlert";
import { ProductStats } from "@/components/admin/products/ProductStats";
import { ProductFilters } from "@/components/admin/products/ProductFilters";
import { ProductTable } from "@/components/admin/products/ProductTable";
import { ProductFormDialog } from "@/components/admin/products/ProductFormDialog";
import { saveProduct } from "@/lib/actions";
import { toast } from "sonner";
import { PRODUCT_TABLE_COLUMNS, DEFAULT_VISIBLE_COLUMNS } from "@/types/product";
import type { ProductFormData } from "@/types/product";
import type { Product, ProductStats as Stats } from "@/lib/actions/products";
import { useRouter } from "next/navigation";

interface ProductsWrapperProps {
  initialProducts: Product[];
  initialStats: Stats;
}

export function ProductsWrapper({ initialProducts, initialStats }: ProductsWrapperProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [stats] = useState<Stats>(initialStats);

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
      matchesDiscount = !(product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price && (!product.promoExpired || new Date(product.promoExpired) > new Date()));
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
      const res = await fetch("/api/product", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete product");
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted successfully");

      // Refresh server data
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to delete product");
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
        throw new Error(data.error || "Failed to update product status");
      }

      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p)));
      toast.success(`Product ${action}d successfully`);

      // Refresh server data
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update product status");
    }
  };

  const handleSave = async (productData: ProductFormData) => {
    await saveProduct(productData, editingProduct, products, setProducts);
    setShowForm(false);
    setEditingProduct(null);

    // Refresh server data
    startTransition(() => {
      router.refresh();
    });
  };

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Product Management</h1>
          <p className="text-muted-foreground mt-1">Manage all products in your store</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleRefresh} disabled={isPending} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} />
            Refresh
          </Button>
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
