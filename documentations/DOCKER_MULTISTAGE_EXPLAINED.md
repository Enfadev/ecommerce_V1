# 🎯 Docker Multi-Stage Build: Dev vs Prod

## Pertanyaan: Bagaimana Dockerfile Universal Membedakan Dev dan Prod?

**Jawaban:** Menggunakan **`target`** parameter di Docker Compose!

---

## 🔍 Cara Kerja Multi-Stage Build

### 1. **Dockerfile Memiliki Multiple Stages**

```dockerfile
# Dockerfile (Universal)

# ========== Base Stage ==========
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache curl

# ========== Dependencies Stage ==========
FROM base AS deps
COPY package*.json ./
RUN npm ci

# ========== Builder Stage ==========
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ========== Production Stage ========== 👈 STAGE NAME
FROM base AS production
ENV NODE_ENV=production
# Production-specific config
CMD npx prisma migrate deploy && node server.js

# ========== Development Stage ========== 👈 STAGE NAME
FROM base AS development
ENV NODE_ENV=development
# Development-specific config
CMD npx prisma migrate dev --skip-seed && npm run dev
```

**Key Points:**

- `FROM ... AS stagename` - Mendefinisikan stage dengan nama
- `production` - Stage untuk production
- `development` - Stage untuk development

---

### 2. **Docker Compose Menentukan Stage Mana yang Digunakan**

#### **Development (docker-compose.yml)**

```yaml
app:
  build:
    context: .
    dockerfile: Dockerfile
    target: development # 👈 MENGGUNAKAN STAGE "development"
  container_name: ecommerce_app_dev
  environment:
    NODE_ENV: development
```

#### **Production (docker-compose.prod.yml)**

```yaml
app:
  build:
    context: .
    dockerfile: Dockerfile
    target: production # 👈 MENGGUNAKAN STAGE "production"
  container_name: ecommerce_app_prod
  environment:
    NODE_ENV: production
```

---

## 🎬 Flow Execution

### **Development Mode**

```bash
npm run docker:dev
# atau
docker compose up --build
```

**Yang Terjadi:**

1. ✅ Docker membaca `docker-compose.yml`
2. ✅ Melihat `target: development`
3. ✅ Build hanya sampai stage `development`
4. ✅ Skip stage `production` (tidak di-build)
5. ✅ Container menjalankan: `npm run dev`

**Build Steps:**

```
base (Alpine + curl)
  ↓
deps (npm ci)
  ↓
builder (build app) ← SKIP! (tidak perlu untuk dev)
  ↓
development ← BUILD SAMPAI SINI
  ↓
production ← SKIP! (tidak di-build)
```

---

### **Production Mode**

```bash
npm run docker:prod
# atau
docker compose -f docker-compose.prod.yml up --build
```

**Yang Terjadi:**

1. ✅ Docker membaca `docker-compose.prod.yml`
2. ✅ Melihat `target: production`
3. ✅ Build melalui stage `builder` (untuk compile app)
4. ✅ Build sampai stage `production`
5. ✅ Skip stage `development` (tidak di-build)
6. ✅ Container menjalankan: `node server.js`

**Build Steps:**

```
base (Alpine + curl)
  ↓
deps (npm ci)
  ↓
builder (build app) ← BUILD! (perlu untuk prod)
  ↓
development ← SKIP! (tidak di-build)
  ↓
production ← BUILD SAMPAI SINI
```

---

## 📊 Perbedaan Dev vs Prod

| Aspect            | Development       | Production       |
| ----------------- | ----------------- | ---------------- |
| **Target Stage**  | `development`     | `production`     |
| **Node Modules**  | All dependencies  | Production only  |
| **Next.js Build** | Skip (dev mode)   | Full build       |
| **Source Code**   | Mounted from host | Copied to image  |
| **Hot Reload**    | ✅ Enabled        | ❌ Disabled      |
| **Image Size**    | ~1GB              | ~800MB           |
| **Startup Time**  | ~30s              | ~15s             |
| **CMD**           | `npm run dev`     | `node server.js` |
| **Migration**     | `migrate dev`     | `migrate deploy` |

---

## 🔧 Konfigurasi Detail

### **Development Stage**

```dockerfile
FROM base AS development
ENV NODE_ENV=development

# Install ALL dependencies (including devDependencies)
COPY package*.json ./
RUN npm install && npm cache clean --force

# Copy all application files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Create uploads directory
RUN mkdir -p ./public/uploads && chmod 777 ./public/uploads

EXPOSE 3000

# Run migrations in dev mode and start dev server
CMD npx prisma migrate dev --skip-seed && npm run dev
```

**Karakteristik:**

- ✅ Install semua dependencies (termasuk dev)
- ✅ Copy semua files (karena tidak ada build)
- ✅ Run dev server dengan hot-reload
- ✅ Migration mode: `dev` (create new migrations)
- ✅ Lebih besar tapi lebih flexible

---

### **Production Stage**

```dockerfile
FROM base AS production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install ONLY production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy pre-built files from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Create uploads directory
RUN mkdir -p ./public/uploads && chmod 777 ./public/uploads

# Copy healthcheck script
COPY healthcheck.sh ./
RUN chmod +x healthcheck.sh

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD ./healthcheck.sh || exit 1

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run migrations and start server
CMD npx prisma migrate deploy && node server.js
```

**Karakteristik:**

- ✅ Install hanya production dependencies
- ✅ Copy hasil build dari builder stage
- ✅ Run production server (optimized)
- ✅ Migration mode: `deploy` (apply existing migrations)
- ✅ Lebih kecil dan lebih cepat

---

## 🎯 Mengapa Ini Bagus?

### 1. **Single Source of Truth**

- ✅ Satu Dockerfile untuk semua environment
- ✅ Tidak ada duplikasi konfigurasi
- ✅ Mudah maintenance

### 2. **Optimized untuk Setiap Environment**

- ✅ Dev: Fast iteration, hot-reload
- ✅ Prod: Small image, fast startup

### 3. **Shared Base Layers**

- ✅ Base, deps, builder stages di-cache
- ✅ Build lebih cepat
- ✅ Hemat disk space

### 4. **Clear Separation**

- ✅ Dev dan prod tidak campur
- ✅ Tidak ada risk produksi pakai dev config
- ✅ Easy to understand

---

## 🧪 Testing

### Test Development Stage

```powershell
# Build development stage
docker compose up --build

# Verify stage name
docker inspect ecommerce_app_dev | Select-String "NODE_ENV"
# Output: "NODE_ENV=development"

# Verify command
docker inspect ecommerce_app_dev | Select-String "Cmd"
# Output: npm run dev
```

### Test Production Stage

```powershell
# Build production stage
docker compose -f docker-compose.prod.yml up --build

# Verify stage name
docker inspect ecommerce_app_prod | Select-String "NODE_ENV"
# Output: "NODE_ENV=production"

# Verify command
docker inspect ecommerce_app_prod | Select-String "Cmd"
# Output: node server.js
```

---

## 🔍 Manual Build (Advanced)

### Build Specific Stage Manually

```powershell
# Build development stage
docker build --target development -t ecommerce:dev .

# Build production stage
docker build --target production -t ecommerce:prod .

# Compare image sizes
docker images | Select-String "ecommerce"
```

**Output Example:**

```
ecommerce:dev    ~1.0GB
ecommerce:prod   ~800MB
```

---

## 📋 Quick Reference

### Commands

| Action          | Command                                          | Target Stage  |
| --------------- | ------------------------------------------------ | ------------- |
| **Dev Build**   | `npm run docker:dev`                             | `development` |
| **Dev Watch**   | `npm run docker:dev:watch`                       | `development` |
| **Prod Build**  | `npm run docker:prod`                            | `production`  |
| **Manual Dev**  | `docker build --target development -t app:dev .` | `development` |
| **Manual Prod** | `docker build --target production -t app:prod .` | `production`  |

### Files

| File                        | Target        | Purpose          |
| --------------------------- | ------------- | ---------------- |
| **docker-compose.yml**      | `development` | Dev environment  |
| **docker-compose.prod.yml** | `production`  | Prod environment |
| **Dockerfile**              | Both          | Universal config |

---

## 💡 Tips & Tricks

### 1. **View Build Stages**

```powershell
# See all stages in Dockerfile
Select-String "FROM.*AS" Dockerfile
```

**Output:**

```
FROM node:20-alpine AS base
FROM base AS deps
FROM base AS builder
FROM base AS production
FROM base AS development
```

### 2. **Build Specific Stage**

```powershell
# Only build up to deps stage
docker build --target deps -t ecommerce:deps .

# Useful for debugging
```

### 3. **Check Which Stage is Running**

```powershell
# Development container
docker exec -it ecommerce_app_dev printenv NODE_ENV
# Output: development

# Production container
docker exec -it ecommerce_app_prod printenv NODE_ENV
# Output: production
```

### 4. **Verify CMD Difference**

```powershell
# Dev container
docker exec -it ecommerce_app_dev ps aux | Select-String "node"
# Output: npm run dev

# Prod container
docker exec -it ecommerce_app_prod ps aux | Select-String "node"
# Output: node server.js
```

---

## 🎓 Best Practices

### 1. **Always Name Your Stages**

```dockerfile
# ✅ Good
FROM node:20-alpine AS base

# ❌ Bad
FROM node:20-alpine
```

### 2. **Keep Base Stage Minimal**

```dockerfile
# ✅ Good - Only essentials
FROM node:20-alpine AS base
RUN apk add --no-cache curl
```

### 3. **Use Specific Target in Compose**

```yaml
# ✅ Good - Explicit
build:
  target: development

# ❌ Bad - Ambiguous
build:
  context: .
```

### 4. **Separate Dev and Prod Compose Files**

```
✅ docker-compose.yml (dev)
✅ docker-compose.prod.yml (prod)
❌ docker-compose.yml (both) - confusing!
```

---

## 🐛 Common Mistakes

### Mistake 1: Forget Target Parameter

```yaml
# ❌ WRONG - Will build last stage (development)
app:
  build:
    context: .
    dockerfile: Dockerfile
    # Missing target!
```

**Fix:**

```yaml
# ✅ CORRECT
app:
  build:
    context: .
    dockerfile: Dockerfile
    target: production # Explicit target!
```

### Mistake 2: Wrong Stage Order

```dockerfile
# ❌ WRONG - Development before production
FROM base AS development
# ...

FROM base AS production
# ...
```

**Fix:**

```dockerfile
# ✅ CORRECT - Production before development
FROM base AS production
# ...

FROM base AS development
# ...
```

**Note:** Urutan tidak masalah karena Docker build by target name, bukan urutan.

---

## ✅ Summary

### Cara Docker Membedakan Dev vs Prod:

1. **Dockerfile** mendefinisikan multiple stages dengan nama:

   - `AS development`
   - `AS production`

2. **Docker Compose** memilih stage dengan parameter `target`:

   - Dev: `target: development`
   - Prod: `target: production`

3. **Docker build** hanya build sampai target yang diminta:

   - Dev: Build stage `development` saja
   - Prod: Build stage `production` + dependencies-nya

4. **Result:**
   - ✅ One Dockerfile
   - ✅ Two environments
   - ✅ Optimized for each use case

---

## 🚀 Quick Start

```powershell
# Development
npm run docker:dev        # Target: development
npm run docker:dev:watch  # Target: development + watch

# Production
npm run docker:prod       # Target: production

# Verify
docker ps                 # Check running containers
docker inspect <container> | Select-String "NODE_ENV"
```

---

**Sekarang Anda paham cara Docker membedakan dev dan prod! 🎉**

## 📖 Related Documentation

- **DOCKERFILE_IMPROVEMENTS.md** - Technical improvements
- **DOCKER_HOT_RELOAD_FIX.md** - Hot reload setup
- **DOCKER_QUICK_START.md** - Quick start guide

---

**Happy Docker Multi-Stage Building! 🐳**
