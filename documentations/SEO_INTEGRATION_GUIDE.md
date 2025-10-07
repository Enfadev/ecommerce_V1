# SEO Integration Documentation

## Overview

This project implements dynamic SEO metadata integration between the admin panel and client-side pages. SEO settings configured in the admin panel are automatically applied to corresponding pages.

## Architecture

### 1. Admin Panel SEO Settings

- **Location**: `/admin/settings` → Page Management → SEO Settings tab
- **Components**:
  - `SeoSettingsCard`: Reusable SEO form component
  - Individual page editors: `AdminHomePageEditor`, `AdminAboutPageEditor`, etc.

### 2. Database Schema

SEO fields are stored in each page table:

- `HomePage`: SEO fields for home page
- `AboutPage`: SEO fields for about page
- `ContactPage`: SEO fields for contact page
- `ProductPage`: SEO fields for products page

### 3. API Endpoints

All page API routes now handle SEO fields:

- `/api/home-page`
- `/api/about-page`
- `/api/contact-page`
- `/api/product-page`

### 4. Client-Side Integration

- **Utility**: `src/lib/seo-utils.ts` - Centralizes metadata generation
- **Implementation**: Next.js `generateMetadata` function for each page
- **Fallback**: System-wide SEO defaults from admin settings

## SEO Fields Available

### Meta Tags

- `metaTitle`: Page-specific title
- `metaDescription`: Page description (150-160 characters recommended)
- `metaKeywords`: Comma-separated keywords

### Open Graph (Social Media)

- `ogTitle`: Title for social media sharing
- `ogDescription`: Description for social media
- `ogImageUrl`: Image URL for social media preview

### Technical SEO

- `canonicalUrl`: Canonical URL for the page
- `noindex`: Boolean to prevent search engine indexing

## Usage Examples

### Admin Panel

1. Go to `/admin/settings`
2. Click "Page Management" tab
3. Select a page (Home, About, Contact, Products)
4. Click "SEO Settings" tab
5. Fill in SEO fields
6. Click "Save Changes"

### Adding SEO to a New Page

#### 1. Server Component (Recommended)

```typescript
import { generatePageMetadata } from "@/lib/seo-utils";
import { prisma } from "@/lib/prisma";

export async function generateMetadata() {
  const pageData = await prisma.yourPage.findFirst();
  return generatePageMetadata({
    pageData,
    fallbackTitle: "Your Page Title",
    defaultPath: "/your-path",
  });
}
```

#### 2. Client Component (Use Layout)

For "use client" pages, create a `layout.tsx` file with the metadata:

```typescript
// app/your-page/layout.tsx
import { generatePageMetadata } from "@/lib/seo-utils";

export async function generateMetadata() {
  // Your metadata logic
}

export default function Layout({ children }) {
  return children;
}
```

### JSON-LD Structured Data

```typescript
import JsonLd from "@/components/seo/JsonLd";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  // ... your structured data
};

// In your component
<JsonLd data={structuredData} />;
```

## Best Practices

### 1. Meta Titles

- Keep under 60 characters
- Include primary keyword
- Make it unique and descriptive

### 2. Meta Descriptions

- 150-160 characters optimal
- Include call-to-action
- Accurately describe page content

### 3. Open Graph Images

- Recommended size: 1200x630 pixels
- Use high-quality images
- Include text overlay if needed

### 4. Canonical URLs

- Use absolute URLs
- Ensure consistency
- Avoid self-referencing loops

## Testing

### 1. Metadata Verification

- View page source to see `<meta>` tags
- Use browser dev tools
- Test with social media validators

### 2. SEO Tools

- Google Search Console
- Facebook Open Graph Debugger
- Twitter Card Validator

## Troubleshooting

### SEO Data Not Appearing

1. Check if page data exists in database
2. Verify API endpoint includes SEO fields
3. Ensure `generateMetadata` function is implemented
4. Check for TypeScript errors

### Default Values Not Working

1. Verify system settings are configured
2. Check `generatePageMetadata` utility usage
3. Ensure fallback values are provided

## Files Structure

```
src/
├── lib/
│   └── seo-utils.ts                 # SEO utility functions
├── components/
│   ├── admin/
│   │   └── SeoSettingsCard.tsx      # Admin SEO form
│   └── seo/
│       └── JsonLd.tsx               # Structured data component
├── app/
│   ├── (admin)/admin/settings/      # Admin SEO management
│   ├── (customer)/                  # Client pages with SEO
│   └── api/                         # API endpoints with SEO
```

This implementation provides a complete SEO management system with fallbacks, ensuring all pages have proper metadata for search engines and social media sharing.
