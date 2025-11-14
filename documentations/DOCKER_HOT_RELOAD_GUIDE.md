# Docker Hot Reload Guide

Panduan lengkap untuk mengatur dan memahami hot reload di Docker untuk proyek Next.js.

## 📋 Daftar Isi

- [Ringkasan](#ringkasan)
- [Metode yang Digunakan](#metode-yang-digunakan)
- [Cara Kerja](#cara-kerja)
- [Setup dan Konfigurasi](#setup-dan-konfigurasi)
- [Testing Hot Reload](#testing-hot-reload)
- [Troubleshooting](#troubleshooting)
- [Alternatif Metode](#alternatif-metode)
- [FAQ](#faq)

---

## Ringkasan

Proyek ini menggunakan **Bind Mount + File Polling** untuk hot reload di Docker. Metode ini dipilih karena paling reliable untuk development di Windows.

### Fitur Hot Reload

- ✅ Auto-detect perubahan file di `src/`
- ✅ Auto-recompile Next.js saat file berubah
- ✅ No manual rebuild/restart needed
- ✅ Works dengan TypeScript, React, CSS

### Status

- **Platform**: Windows (Docker Desktop with WSL2)
- **Framework**: Next.js 15.5.2
- **Method**: Bind Mount + Webpack Polling
- **Status**: ✅ Working

---

## Metode yang Digunakan

### 1. Bind Mount Volumes

File dan folder di host di-mount langsung ke container:

```yaml
volumes:
  - ./src:/app/src:cached
  - ./prisma:/app/prisma:cached
  - ./public:/app/public:cached
  - ./middleware.ts:/app/middleware.ts:cached
  - ./next.config.ts:/app/next.config.ts:cached
  - ./tsconfig.json:/app/tsconfig.json:cached
```

**Penjelasan:**

- `./src:/app/src` → Folder `src` di host di-mount ke `/app/src` di container
- `:cached` → Optimasi performa untuk Mac/Windows (consistency mode)
- Perubahan di host langsung terlihat di container

### 2. Webpack File Polling

Next.js dikonfigurasi untuk aktif memeriksa perubahan file:

**next.config.ts:**

```typescript
webpack: (config, { isServer }) => {
  if (process.env.NODE_ENV === "development" && !isServer) {
    config.watchOptions = {
      poll: 1000, // Check setiap 1 detik
      aggregateTimeout: 300, // Wait 300ms before rebuild
    };
  }
  return config;
};
```

### 3. Environment Variables

Mengaktifkan polling di berbagai level:

```yaml
environment:
  WATCHPACK_POLLING: "true" # Webpack watchpack polling
  CHOKIDAR_USEPOLLING: "true" # Chokidar file watcher polling
```

### 4. Dev Script Tanpa Turbopack

```json
"dev:docker": "next dev"
```

Turbopack di-disable karena masih experimental dan kurang reliable dengan Docker polling di Windows.

---

## Cara Kerja

### Flow Diagram

```
┌─────────────────┐
│  Edit File di   │
│  VS Code (Host) │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Bind Mount Update File         │
│  di Container (/app/src)        │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Webpack Polling Detect Change  │
│  (setiap 1 detik)               │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Next.js Recompile Module       │
│  (Hot Module Replacement)       │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Browser Auto Refresh           │
│  (via WebSocket)                │
└─────────────────────────────────┘
```

### Timeline Typical

1. **0ms** - Simpan file di VS Code
2. **~100ms** - File ter-sync ke container (bind mount)
3. **~1000ms** - Webpack polling detect change
4. **~300ms** - Aggregation timeout
5. **~2000ms** - Next.js recompile
6. **~100ms** - Browser refresh

**Total: ~3.5 detik** dari save hingga tampil di browser

---

## Setup dan Konfigurasi

### 1. Docker Compose Configuration

**File**: `docker-compose.yml`

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: development
    container_name: ecommerce_app_dev
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development
      WATCHPACK_POLLING: "true"
      CHOKIDAR_USEPOLLING: "true"
    volumes:
      # Source code hot reload
      - ./src:/app/src:cached
      - ./prisma:/app/prisma:cached
      - ./public:/app/public:cached
      - ./middleware.ts:/app/middleware.ts:cached
      - ./next.config.ts:/app/next.config.ts:cached
      - ./tsconfig.json:/app/tsconfig.json:cached

      # Persistent uploads
      - uploads_data:/app/public/uploads

      # Exclude dari sync
      - /app/node_modules
      - /app/.next
```

### 2. Next.js Configuration

**File**: `next.config.ts`

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // Enable webpack polling for Docker hot reload
  webpack: (config, { isServer }) => {
    if (process.env.NODE_ENV === "development" && !isServer) {
      config.watchOptions = {
        poll: 1000, // Check for changes every second
        aggregateTimeout: 300, // Delay before rebuilding
      };
    }
    return config;
  },

  // ... rest of config
};

export default nextConfig;
```

### 3. Package.json Scripts

**File**: `package.json`

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "dev:docker": "next dev",
    "docker:dev": "docker compose up --build",
    "docker:dev:up": "docker compose up -d --build",
    "docker:stop": "docker compose down",
    "docker:logs": "docker compose logs -f app"
  }
}
```

### 4. Dockerfile Development Stage

**File**: `Dockerfile`

```dockerfile
# Development stage
FROM base AS development
ENV NODE_ENV=development

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install && npm cache clean --force

# Copy application files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Create uploads directory
RUN mkdir -p ./public/uploads && chmod 777 ./public/uploads

EXPOSE 3000

# Run dev server with hot reload
CMD npx prisma migrate dev --skip-seed && npm run dev:docker -- --hostname 0.0.0.0
```

---

## Testing Hot Reload

### Quick Test

1. **Start Docker container:**

   ```bash
   docker compose up -d
   ```

2. **Check logs:**

   ```bash
   docker compose logs -f app
   ```

   Tunggu hingga muncul:

   ```
   ✓ Ready in 2s
   ```

3. **Edit file (contoh: `src/app/(customer)/product/page.tsx`):**

   ```tsx
   <h1>Original Title</h1>
   // Ubah menjadi:
   <h1>New Title - Testing Hot Reload</h1>
   ```

4. **Monitor logs:**

   ```bash
   docker logs ecommerce_app_dev --tail=20
   ```

   Anda harus melihat:

   ```
   ✓ Compiled /product in 2.5s (1438 modules)
   ```

5. **Refresh browser:**
   - Buka `http://localhost:3000/product`
   - Hard refresh: `Ctrl + Shift + R`
   - Perubahan harus terlihat

### Test Checklist

- [ ] File `.tsx` di `src/app/` → Hot reload works
- [ ] File `.ts` di `src/components/` → Hot reload works
- [ ] File `.css` atau Tailwind classes → Hot reload works
- [ ] Prisma schema → Requires container restart
- [ ] `next.config.ts` → Requires container rebuild
- [ ] `package.json` → Requires container rebuild

---

## Troubleshooting

### Issue 1: Perubahan Tidak Terdeteksi

**Gejala:** Edit file tapi tidak ada recompile di logs

**Solusi:**

```bash
# 1. Restart container
docker compose restart app

# 2. Check volume mounts
docker inspect ecommerce_app_dev | grep -A 10 Mounts

# 3. Verify file dalam container
docker exec ecommerce_app_dev cat /app/src/app/(customer)/product/page.tsx
```

### Issue 2: Recompile Terlalu Lama

**Gejala:** Hot reload lambat (>10 detik)

**Solusi:**

```typescript
// Adjust polling di next.config.ts
config.watchOptions = {
  poll: 500, // Lebih cepat (was 1000)
  aggregateTimeout: 100, // Lebih cepat (was 300)
};
```

**Trade-off:** CPU usage lebih tinggi

### Issue 3: Browser Tidak Refresh

**Gejala:** Kompilasi berhasil tapi browser tidak update

**Solusi:**

1. Hard refresh: `Ctrl + Shift + R`
2. Clear browser cache
3. Buka di incognito mode
4. Check browser console untuk errors

### Issue 4: Container Crash After File Change

**Gejala:** Container stop setelah edit file

**Solusi:**

```bash
# Check error logs
docker logs ecommerce_app_dev

# Kemungkinan syntax error di code
# Fix syntax error lalu:
docker compose up -d
```

### Issue 5: Bind Mount Permission Denied

**Gejala:** Permission errors di Windows

**Solusi:**

1. Check Docker Desktop settings:
   - Settings → Resources → File Sharing
   - Add workspace folder: `C:\Workspace\Enfadev\ecommerce_V1`
2. Restart Docker Desktop
3. Rebuild container:
   ```bash
   docker compose down
   docker compose up --build
   ```

### Issue 6: Node Modules Conflict

**Gejala:** Module not found errors

**Solusi:**

```yaml
# Pastikan node_modules excluded
volumes:
  - /app/node_modules # This MUST be present
```

Rebuild:

```bash
docker compose down
docker compose build --no-cache app
docker compose up -d
```

---

## Alternatif Metode

### Metode 1: Docker Compose Watch (Linux/Mac)

**Konfigurasi:**

```yaml
services:
  app:
    develop:
      watch:
        - action: sync
          path: ./src
          target: /app/src
```

**Cara Pakai:**

```bash
docker compose up -d
docker compose watch
```

**Catatan:** Tidak reliable di Windows

### Metode 2: VS Code Dev Containers

**Setup:**

1. Install extension: `ms-vscode-remote.remote-containers`
2. Create `.devcontainer/devcontainer.json`:

```json
{
  "name": "Next.js Development",
  "dockerComposeFile": "../docker-compose.yml",
  "service": "app",
  "workspaceFolder": "/app",
  "customizations": {
    "vscode": {
      "extensions": ["dbaeumer.vscode-eslint", "esbenp.prettier-vscode"]
    }
  }
}
```

3. `Ctrl+Shift+P` → "Reopen in Container"

**Kelebihan:**

- Zero sync delay
- Native container experience
- Best performance

### Metode 3: Nodemon (Full Restart)

**Package.json:**

```json
{
  "scripts": {
    "dev:docker": "nodemon --watch src --exec 'next dev'"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

**Kelebihan:**

- Reliable
- Full restart memastikan clean state

**Kekurangan:**

- Slow (restart penuh)
- Kehilangan state

---

## Performance Tips

### 1. Optimize Polling Interval

Balance antara responsiveness dan CPU usage:

```typescript
// Fast but high CPU
poll: 500,
aggregateTimeout: 100,

// Balanced (recommended)
poll: 1000,
aggregateTimeout: 300,

// Slow but low CPU
poll: 2000,
aggregateTimeout: 500,
```

### 2. Use Cached Mount Mode

```yaml
volumes:
  - ./src:/app/src:cached # Prioritize container reads
```

**Mount modes:**

- `cached` - Container reads prioritized (recommended)
- `delegated` - Host writes prioritized
- `default` - No optimization

### 3. Exclude Unnecessary Files

```yaml
volumes:
  - ./src:/app/src:cached
  # DON'T mount these:
  # - ./node_modules (use container's version)
  # - ./.next (build artifacts)
  # - ./.git (not needed in container)
```

### 4. Increase Docker Resources

Docker Desktop → Settings → Resources:

- **CPU**: Minimum 4 cores
- **Memory**: Minimum 4GB
- **Swap**: 2GB

### 5. Use SSD for Project

Hot reload jauh lebih cepat di SSD dibanding HDD.

---

## FAQ

### Q: Kenapa tidak pakai Turbopack?

**A:** Turbopack masih experimental dan memiliki issues dengan file watching di Docker, terutama di Windows. Webpack lebih stable.

### Q: Apakah hot reload work untuk semua file?

**A:** Tidak semua. Berikut yang work:

- ✅ `.tsx`, `.ts`, `.jsx`, `.js` di `src/`
- ✅ CSS dan Tailwind classes
- ❌ `next.config.ts` (butuh rebuild)
- ❌ `package.json` (butuh rebuild)
- ❌ `Dockerfile` (butuh rebuild)
- ⚠️ Prisma schema (butuh restart + migrate)

### Q: Berapa lama normal untuk hot reload?

**A:**

- **File kecil** (1 component): 2-4 detik
- **File besar** (banyak dependencies): 5-8 detik
- **First compile**: 10-15 detik

### Q: Apakah bisa pakai watch dan bind mount bersamaan?

**A:** Tidak recommended. Docker compose watch akan skip path yang sudah di-bind mount, menyebabkan konflik.

### Q: Hot reload tidak work, tapi build manual work?

**A:** Kemungkinan besar masalah file watching. Solusi:

1. Verify environment variables: `WATCHPACK_POLLING=true`
2. Check webpack config ada polling
3. Restart container
4. Last resort: rebuild dengan `--no-cache`

### Q: Performa lebih lambat di Docker vs native?

**A:** Ya, overhead ~10-30% untuk:

- Bind mount I/O
- File polling
- Container network

Trade-off untuk consistency dan isolation.

### Q: Bisa hot reload untuk multiple services?

**A:** Ya! Tambahkan config yang sama di service lain:

```yaml
services:
  app:
    # ... hot reload config

  api:
    # ... same hot reload config
    volumes:
      - ./api/src:/app/src:cached
```

---

## Best Practices

### 1. ✅ DO

- Gunakan `:cached` untuk better performance
- Exclude `node_modules` dan `.next` dari bind mount
- Monitor logs untuk debug
- Use specific paths (bukan `.:/app`)
- Keep webpack polling ~1000ms
- Hard refresh browser saat test

### 2. ❌ DON'T

- Jangan bind mount seluruh project root
- Jangan mount `node_modules` dari host
- Jangan set polling terlalu cepat (<500ms)
- Jangan combine watch dan bind mount
- Jangan expect instant reload (allow 2-4s)
- Jangan commit container-generated files

---

## Monitoring Hot Reload

### Real-time Logs

```bash
# Follow app logs
docker compose logs -f app

# Filter untuk compile messages
docker compose logs -f app | grep -i compiled

# Watch container resource usage
docker stats ecommerce_app_dev
```

### Health Check

```bash
# Check if hot reload working
curl http://localhost:3000/api/health

# Check container status
docker compose ps
```

### Debug Mode

Enable verbose logging:

```dockerfile
ENV DEBUG="*"
ENV NODE_OPTIONS="--trace-warnings"
```

---

## Kesimpulan

Setup hot reload saat ini menggunakan **Bind Mount + Webpack Polling** karena:

✅ **Kelebihan:**

- Reliable di Windows
- Simple setup
- No additional tools
- Works out of the box

⚠️ **Kekurangan:**

- Slightly slower than native
- CPU overhead dari polling
- Not as fast as Mac/Linux

Untuk development di Windows, ini adalah **best practice** dan **production-ready solution**.

---

## Update Log

| Date       | Version | Changes                                   |
| ---------- | ------- | ----------------------------------------- |
| 2025-10-07 | 1.0.0   | Initial setup dengan bind mount + polling |
|            |         | Tested dan verified working di Windows    |
|            |         | Documentation created                     |

---

## References

- [Docker Compose Watch Documentation](https://docs.docker.com/compose/file-watch/)
- [Next.js Docker Deployment](https://nextjs.org/docs/deployment#docker-image)
- [Webpack Watch Options](https://webpack.js.org/configuration/watch/)
- [Docker Volume Performance](https://docs.docker.com/storage/volumes/)

---

**Dokumentasi ini dibuat untuk**: eCommerce V1 Project  
**Maintainer**: EnFaDev Team  
**Last Updated**: October 7, 2025
