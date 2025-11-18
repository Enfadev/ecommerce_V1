"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductDetail } from "../constants";

interface ProductImagesProps {
  product: ProductDetail;
}

export default function ProductImages({ product }: ProductImagesProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const hasValidImage = images[selectedImage] && images[selectedImage].trim() !== "" && images[selectedImage] !== "/placeholder-image.svg";

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="group">
        <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-muted/30 to-muted/10 shadow-lg border border-border/50 hover:shadow-xl transition-all duration-300">
          <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
            {hasValidImage ? (
              <Image src={images[selectedImage]} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="w-full h-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                <Image src="/placeholder-product.svg" alt="No image available" fill className="object-contain p-8" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Gallery Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(idx)}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === idx ? "border-foreground shadow-md" : "border-border/30 hover:border-border opacity-70 hover:opacity-100"}`}
            >
              {img && img.trim() !== "" && img !== "/placeholder-image.svg" ? (
                <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">No image</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
