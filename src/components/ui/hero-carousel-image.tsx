"use client";

interface HeroCarouselImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function HeroCarouselImage({ src, alt, className }: HeroCarouselImageProps) {
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/placeholder.jpg";
  };

  return <img src={src} alt={alt} className={className} onError={handleError} />;
}
