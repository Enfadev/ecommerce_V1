import { toast } from "sonner";
import type { Product } from "@/hooks/use-products";
import type { ProductFormData } from "@/types/product";

export async function saveProduct(productData: ProductFormData, editingProduct: Product | null, products: Product[], setProducts: (products: Product[]) => void) {
  if (editingProduct) {
    return await updateProduct(productData, editingProduct, products, setProducts);
  } else {
    return await createProduct(productData, products, setProducts);
  }
}

async function updateProduct(productData: ProductFormData, editingProduct: Product, products: Product[], setProducts: (products: Product[]) => void) {
  try {
    let imageUrl = editingProduct.imageUrl;
    let galleryUrls = editingProduct.gallery || [];
    let hasNewImage = false;

    if (productData.imageFiles && productData.imageFiles.length > 0) {
      const uploadResult = await uploadImages(productData.imageFiles, productData.gallery);
      imageUrl = uploadResult.mainImage;
      galleryUrls = uploadResult.gallery;
      hasNewImage = true;
    } else {
      galleryUrls = productData.gallery || [];
    }

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
      metaKeywords: productData.metaKeywords,
      ogTitle: productData.ogTitle,
      ogDescription: productData.ogDescription,
      ogImageUrl: productData.ogImageUrl,
      canonicalUrl: productData.canonicalUrl,
      noindex: productData.noindex,
      structuredData: productData.structuredData,
      discountPrice: productData.discountPrice,
      promoExpired: productData.promoExpired,
      gallery: galleryUrls,
    };

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

    toast.success("Product updated successfully!");
  } catch (error: unknown) {
    console.error("Update product error:", error);
    toast.error(`Failed to update product: ${error instanceof Error ? error.message : "Unknown error"}`);
    throw error;
  }
}

async function createProduct(productData: ProductFormData, products: Product[], setProducts: (products: Product[]) => void) {
  try {
    let imageUrl = "";
    let galleryUrls: string[] = [];

    if (productData.imageFiles && productData.imageFiles.length > 0) {
      const uploadResult = await uploadImages(productData.imageFiles);
      imageUrl = uploadResult.mainImage;
      galleryUrls = uploadResult.gallery;
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
        metaKeywords: productData.metaKeywords,
        ogTitle: productData.ogTitle,
        ogDescription: productData.ogDescription,
        ogImageUrl: productData.ogImageUrl,
        canonicalUrl: productData.canonicalUrl,
        noindex: productData.noindex,
        structuredData: productData.structuredData,
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

    toast.success("Product added successfully!");
  } catch (error: unknown) {
    console.error("Add product error:", error);
    toast.error(`Failed to add product: ${error instanceof Error ? error.message : "Unknown error"}`);
    throw error;
  }
}

async function uploadImages(imageFiles: File[], existingGallery?: string[]) {
  const formData = new FormData();
  formData.append("file", imageFiles[0]);

  const uploadRes = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!uploadRes.ok) {
    const errorData = await uploadRes.json();
    throw new Error(`Failed to upload image: ${errorData.error}`);
  }

  const uploadData = await uploadRes.json();
  const mainImage = uploadData.url;
  let gallery: string[] = [];

  if (imageFiles.length > 1) {
    const galleryForm = new FormData();
    imageFiles.slice(1).forEach((file: File) => {
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
    gallery = [...(existingGallery || []), ...galleryData.urls];
  } else {
    gallery = existingGallery || [];
  }

  return { mainImage, gallery };
}
