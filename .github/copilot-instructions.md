# GitHub Copilot Instructions - Next.js E-commerce Project

> **Version**: Disesuaikan untuk Next.js 16.x (Latest Stable)

## Next.js 16 - What's New

### Breaking Changes & Updates

- **Turbopack by Default**: Sekarang default untuk `next dev` dan `next build` (tidak perlu flag `--turbo` lagi)
- **Async Request APIs**: `cookies()`, `headers()`, `draftMode()`, `params`, `searchParams` sekarang HARUS async
- **middleware → proxy**: File `middleware.ts` diganti dengan `proxy.ts` (edge runtime tidak support di proxy, gunakan nodejs runtime)
- **React 19.2**: App Router menggunakan React 19.2 dengan fitur View Transitions, useEffectEvent, Activity
- **Cache Components**: PPR sekarang menggunakan `cacheComponents` config (bukan `experimental.ppr`)
- **Node.js 20.9+**: Minimum version (Node.js 18 tidak didukung lagi)
- **TypeScript 5.1+**: Minimum version TypeScript 5.1.0

### New Caching APIs (Stable)

- `cacheLife()` - mengatur cache lifetime profile
- `cacheTag()` - cache tagging untuk revalidation
- `updateTag()` - immediate cache invalidation dengan read-your-writes semantics (untuk Server Actions)
- `refresh()` - refresh client router dari Server Action
- `after()` - run code after response sent
- `revalidateTag()` - sekarang accept cacheLife profile sebagai argument kedua

### React Compiler Support (Stable)

- Built-in support untuk React Compiler 1.0
- Enable dengan `reactCompiler: true` di next.config.ts
- Automatic memoization tanpa perlu manual `useMemo`/`useCallback`

## Next.js Best Practices

### 1. Project Structure

- Gunakan `src/app` untuk App Router (Next.js 13+)
- Pisahkan komponen reusable ke `src/components`
- Letakkan utility functions di `src/lib` atau `src/utils`
- Simpan types/interfaces di `src/types`
- Gunakan struktur folder berdasarkan feature untuk aplikasi besar

### 2. Rendering Strategy

- **Server Components (Default)**: Gunakan untuk komponen yang tidak memerlukan interaktivity

  ```tsx
  // app/page.tsx - Server Component by default
  async function Page() {
    const data = await fetch("https://api.example.com/data");
    return <div>{data}</div>;
  }
  ```

- **Client Components**: Gunakan hanya ketika diperlukan (interactivity, hooks, event listeners)

  ```tsx
  "use client";
  import { useState } from "react";

  export function Counter() {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
  }
  ```

- **Static Generation (SSG)**: Default, terbaik untuk performa
- **Server-Side Rendering (SSR)**: Gunakan `fetch` dengan `{ cache: 'no-store' }` untuk data dynamic
- **Incremental Static Regeneration (ISR)**: Gunakan `revalidate` option untuk update periodic

### 3. Data Fetching

- Fetch data di Server Components untuk mengurangi client-side JavaScript
- Gunakan `fetch` API dengan caching options:

  ```tsx
  // Static data (default)
  const data = await fetch("https://api.example.com/data");

  // Revalidate setiap 60 detik
  const data = await fetch("https://api.example.com/data", {
    next: { revalidate: 60 },
  });

  // Dynamic data (no cache)
  const data = await fetch("https://api.example.com/data", {
    cache: "no-store",
  });
  ```

- Parallel data fetching untuk performa lebih baik:
  ```tsx
  async function Page() {
    const [user, posts] = await Promise.all([fetch("/api/user"), fetch("/api/posts")]);
  }
  ```

### 4. Routing & Navigation

- Gunakan `Link` component untuk client-side navigation
- Leverage route groups `(group)` untuk organisasi tanpa mempengaruhi URL
- Gunakan dynamic routes `[id]` dan catch-all routes `[...slug]`
- Implementasi loading states dengan `loading.tsx`
- Handle errors dengan `error.tsx`
- Gunakan `useRouter` dari `next/navigation` (bukan `next/router`)

### 5. Image Optimization

- Selalu gunakan `next/image` untuk optimisasi otomatis

  ```tsx
  import Image from "next/image";

  <Image
    src="/photo.jpg"
    alt="Description"
    width={500}
    height={300}
    priority // untuk LCP images
    placeholder="blur" // untuk better UX
  />;
  ```

- Konfigurasi `remotePatterns` di `next.config.js` untuk external images
- Gunakan `priority` prop untuk above-the-fold images
- Specify `sizes` prop untuk responsive images

### 6. Metadata & SEO

- Export metadata dari setiap page/layout:

  ```tsx
  import type { Metadata } from "next";

  export const metadata: Metadata = {
    title: "Page Title",
    description: "Page description",
    openGraph: {
      title: "OG Title",
      description: "OG Description",
      images: ["/og-image.jpg"],
    },
  };
  ```

- Gunakan `generateMetadata` untuk dynamic metadata:
  ```tsx
  export async function generateMetadata({ params }): Promise<Metadata> {
    const product = await fetchProduct(params.id);
    return {
      title: product.name,
      description: product.description,
    };
  }
  ```

### 7. API Routes

- Buat API routes di `app/api/[route]/route.ts`
- Export HTTP method handlers: GET, POST, PUT, DELETE, etc.

  ```tsx
  export async function GET(request: Request) {
    return Response.json({ data: "value" });
  }

  export async function POST(request: Request) {
    const body = await request.json();
    return Response.json({ success: true });
  }
  ```

- Gunakan Route Handlers untuk server-side logic
- Implement proper error handling dan status codes
- Validate input data sebelum processing

### 7a. Async Request APIs (Next.js 16 Required)

- **BREAKING CHANGE**: `cookies()`, `headers()`, `draftMode()` HARUS diakses dengan `await`:

  ```tsx
  import { cookies, headers } from "next/headers";

  export async function GET() {
    const cookieStore = await cookies();
    const headersList = await headers();

    const token = cookieStore.get("token");
    return Response.json({ token });
  }
  ```

- `params` dan `searchParams` di page/layout juga HARUS async:

  ```tsx
  // page.tsx - Next.js 16
  export default async function Page({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ [key: string]: string }> }) {
    const { id } = await params;
    const query = await searchParams;

    return <div>Product {id}</div>;
  }
  ```

### 8. Performance Optimization

- **Code Splitting**: Automatic dengan Next.js, gunakan dynamic imports untuk heavy components

  ```tsx
  import dynamic from "next/dynamic";

  const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
    loading: () => <p>Loading...</p>,
  });
  ```

- **Lazy Loading**: Gunakan untuk komponen below the fold
- **Bundle Analysis**: Gunakan `@next/bundle-analyzer`
- **Font Optimization**: Gunakan `next/font` untuk self-hosted fonts

  ```tsx
  import { Inter } from "next/font/google";

  const inter = Inter({ subsets: ["latin"] });
  ```

### 9. Environment Variables

- Prefix dengan `NEXT_PUBLIC_` untuk client-side access
- Simpan secrets di server-side only (tanpa prefix)
- Gunakan `.env.local` untuk development
- Never commit `.env.local` ke repository

### 10. TypeScript Best Practices

- Gunakan TypeScript untuk type safety
- Define interfaces untuk props, API responses, database models
- Leverage Next.js built-in types: `Metadata`, `PageProps`, dll
- Enable strict mode di `tsconfig.json`

### 11. State Management

- **Server State**: Gunakan Server Components dan data fetching
- **Client State**:
  - React hooks (`useState`, `useReducer`) untuk local state
  - Context API untuk shared state (minimal)
  - Consider Zustand/Jotai untuk complex state
- Avoid unnecessary client-side state, prefer server state

### 12. Caching Strategy (Updated for Next.js 16)

- Understand Next.js caching layers:
  - Request Memoization (automatic)
  - Data Cache (fetch with caching)
  - Full Route Cache (static rendering)
  - Router Cache (client-side)

- **New Caching APIs** (Stable in Next.js 16):

  ```tsx
  import { cacheLife, cacheTag, updateTag, revalidateTag, refresh } from 'next/cache'

  // Gunakan cacheLife untuk set cache profiles
  export async function getData() {
    'use cache'
    cacheLife('hours')
    cacheTag('products')

    return fetch('/api/data')
  }

  // updateTag untuk immediate invalidation (Server Actions only)
  export async function updateProduct() {
    'use server'
    await db.products.update(...)
    updateTag('products') // Immediate refresh, user sees changes instantly
  }

  // revalidateTag untuk background revalidation
  export async function updateArticle() {
    'use server'
    await db.articles.update(...)
    revalidateTag('articles', 'max') // Stale-while-revalidate
  }

  // refresh untuk refresh client router
  export async function markAsRead() {
    'use server'
    await db.notifications.markAsRead(...)
    refresh() // Refresh client UI
  }
  ```

- Use `revalidatePath` dan `revalidateTag` untuk on-demand revalidation
- Implement proper cache invalidation strategy

### 13. Security

- Validate semua user inputs (client & server)
- Sanitize data sebelum rendering
- Implement CSRF protection untuk forms
- Use environment variables untuk sensitive data
- Implement proper authentication & authorization
- Set security headers di `next.config.js`

### 14. Testing

- Unit tests untuk utility functions
- Integration tests untuk API routes
- E2E tests dengan Playwright atau Cypress
- Test both Server dan Client Components
- Mock external API calls

### 15. Deployment

- Optimize untuk production dengan `npm run build`
- Analyze bundle size sebelum deploy
- Set proper environment variables di platform
- Configure CDN untuk static assets
- Implement monitoring dan error tracking
- Use Vercel untuk deployment yang optimal (recommended)

## Project-Specific Guidelines

### Database (Prisma)

- Gunakan Prisma Client untuk database queries
- Implement connection pooling untuk production
- Use transactions untuk multiple related operations
- Index fields yang frequently queried

### Authentication

- Implement secure session management
- Use httpOnly cookies untuk tokens
- Implement proper password hashing
- Add rate limiting untuk login attempts

### File Uploads

- Validate file types dan sizes
- Store uploaded files secara secure
- Implement proper error handling
- Consider cloud storage untuk production

### E-commerce Specific

- Implement proper cart management
- Secure payment processing
- Order tracking system
- Inventory management
- Email notifications

## Code Quality

### General Rules

- Follow DRY (Don't Repeat Yourself) principle
- Write self-documenting code dengan naming yang clear
- Keep functions small dan focused
- Implement error boundaries untuk error handling
- Add comments untuk complex logic
- Use ESLint dan Prettier untuk code consistency

### Component Guidelines

- Keep components small (< 200 lines)
- Extract reusable logic ke custom hooks
- Prop drilling maksimal 2-3 levels, use Context jika lebih
- Memoize expensive computations dengan `useMemo`
- Memoize callback functions dengan `useCallback`
- Use React.memo untuk prevent unnecessary re-renders

### File Naming

- Components: `PascalCase.tsx`
- Utils/Hooks: `camelCase.ts`
- Constants: `UPPER_SNAKE_CASE.ts`
- API routes: `route.ts`

---

**Note**: Panduan ini disesuaikan dengan Next.js 16.x (Latest Stable). Selalu refer ke [official Next.js documentation](https://nextjs.org/docs) untuk updates terbaru.

## Migration Checklist (Next.js 15 → 16)

- [ ] Update dependencies: `npm install next@latest react@latest react-dom@latest`
- [ ] Update Node.js ke versi 20.9 atau lebih tinggi
- [ ] Update TypeScript ke versi 5.1 atau lebih tinggi
- [ ] Rename `middleware.ts` ke `proxy.ts` (jika ada)
- [ ] Update semua Dynamic APIs menjadi async: `cookies()`, `headers()`, `params`, `searchParams`
- [ ] Update `next.config.js`: hapus `experimental.turbopack`, gunakan top-level `turbopack`
- [ ] Update `next.config.js`: rename `experimental.dynamicIO` ke `cacheComponents`
- [ ] Remove `unstable_` prefix dari `cacheLife` dan `cacheTag`
- [ ] Test Turbopack builds: `next build` (sekarang default menggunakan Turbopack)
- [ ] Update package.json scripts: hapus flag `--turbopack` atau `--turbo`
- [ ] Review dan update Image component configs jika ada (minimumCacheTTL default berubah 60s → 4 hours)
