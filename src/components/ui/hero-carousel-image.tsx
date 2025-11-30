"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const PLACEHOLDER_HERO = "/placeholder-hero.svg";

interface HeroCarouselImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function HeroCarouselImage({ src, alt, className }: HeroCarouselImageProps) {
  const validSrc = src && src.trim() !== "" ? src : PLACEHOLDER_HERO;
  const [imgSrc, setImgSrc] = useState(validSrc);

  useEffect(() => {
    const newValidSrc = src && src.trim() !== "" ? src : PLACEHOLDER_HERO;
    setImgSrc(newValidSrc);
  }, [src]);

  return <Image src={imgSrc} alt={alt} fill className={className} onError={() => setImgSrc(PLACEHOLDER_HERO)} priority sizes="100vw" style={{ objectFit: "cover" }} />;
}
