"use client";

import Image from "next/image";
import { useState } from "react";

interface HeroCarouselImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function HeroCarouselImage({ src, alt, className }: HeroCarouselImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return <Image src={imgSrc} alt={alt} fill className={className} onError={() => setImgSrc("/placeholder.jpg")} priority sizes="100vw" style={{ objectFit: "cover" }} />;
}
