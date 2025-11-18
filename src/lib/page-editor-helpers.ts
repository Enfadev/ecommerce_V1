/**
 * Common SEO field interface used across all page editors
 */
export interface SeoFields {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImageUrl?: string;
  canonicalUrl?: string;
  noindex?: boolean;
}

/**
 * Common hero section fields used across all page editors
 */
export interface HeroFields {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
}

/**
 * Base page data structure that all page editors extend
 */
export interface BasePageData extends SeoFields, HeroFields {
  id: number;
}

/**
 * Helper to extract SEO fields from page data
 */
export function extractSeoFields<T extends SeoFields>(data: T): SeoFields {
  return {
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    metaKeywords: data.metaKeywords,
    ogTitle: data.ogTitle,
    ogDescription: data.ogDescription,
    ogImageUrl: data.ogImageUrl,
    canonicalUrl: data.canonicalUrl,
    noindex: data.noindex,
  };
}

/**
 * Helper to extract hero fields from page data
 */
export function extractHeroFields<T extends HeroFields>(data: T): HeroFields {
  return {
    heroTitle: data.heroTitle,
    heroSubtitle: data.heroSubtitle,
    heroDescription: data.heroDescription,
  };
}

/**
 * Helper to update SEO fields in page data
 */
export function updateSeoFields<T extends SeoFields>(data: T, seoFields: Partial<SeoFields>): T {
  return {
    ...data,
    ...seoFields,
  };
}

/**
 * Helper to update hero fields in page data
 */
export function updateHeroFields<T extends HeroFields>(data: T, heroFields: Partial<HeroFields>): T {
  return {
    ...data,
    ...heroFields,
  };
}

/**
 * Default SEO fields for new pages
 */
export const defaultSeoFields: SeoFields = {
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  ogTitle: "",
  ogDescription: "",
  ogImageUrl: "",
  canonicalUrl: "",
  noindex: false,
};

/**
 * Default hero fields for new pages
 */
export const defaultHeroFields: HeroFields = {
  heroTitle: "",
  heroSubtitle: "",
  heroDescription: "",
};
