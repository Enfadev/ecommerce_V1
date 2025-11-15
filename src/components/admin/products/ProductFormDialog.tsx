import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SimpleProductForm } from "@/components/product/SimpleProductForm";
import type { Product } from "@/hooks/useProducts";
import type { ProductFormData } from "@/types/product";

interface ProductFormDialogProps {
  open: boolean;
  editingProduct: Product | null;
  onOpenChange: (open: boolean) => void;
  onSave: (data: ProductFormData) => Promise<void>;
}

export function ProductFormDialog({ open, editingProduct, onOpenChange, onSave }: ProductFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                      metaKeywords: editingProduct.metaKeywords || "",
                      ogTitle: editingProduct.ogTitle || "",
                      ogDescription: editingProduct.ogDescription || "",
                      ogImageUrl: editingProduct.ogImageUrl || "",
                      canonicalUrl: editingProduct.canonicalUrl || "",
                      noindex: editingProduct.noindex || false,
                      structuredData: editingProduct.structuredData || "",
                      discountPrice: editingProduct.discountPrice || null,
                      promoExpired: editingProduct.promoExpired || "",
                      gallery: editingProduct.gallery || [],
                    }
                  : undefined
              }
              onSave={onSave}
              onCancel={() => onOpenChange(false)}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
