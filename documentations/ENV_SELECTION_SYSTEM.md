# 🔄 Environment File Selection System

## Bagaimana Docker Tahu File Mana yang Dipakai?

Docker Compose menggunakan **explicit `--env-file` flag** untuk menentukan file environment mana yang akan digunakan.

---

## 📋 Mekanisme Kerja

### Default Behavior (Tanpa Flag)

```bash
docker compose up
# Docker akan mencari file ini secara berurutan:
# 1. .env (di root project)
# 2. .env.local (fallback)
```

### Explicit Selection (Dengan Flag)

```bash
# Development - gunakan .env
docker compose --env-file .env up

# Production - gunakan .env.production
docker compose -f docker-compose.prod.yml --env-file .env.production up
```

---

## 🎯 Implementasi di Project

### 1️⃣ File Structure

```
📁 ecommerce_V1/
├── .env                      ← Active local (created from .env.local)
├── .env.production           ← Active production (created from .env.prod)
├── .env.local                ← Template local (ready to use)
├── .env.prod                 ← Template production (needs editing)
├── docker-compose.yml        ← Development config
└── docker-compose.prod.yml   ← Production config
```

### 2️⃣ NPM Scripts Configuration

**Development Scripts** (menggunakan `.env`):

```json
"docker:dev": "docker compose --env-file .env up --build",
"docker:dev:up": "docker compose --env-file .env up -d --build",
"docker:logs": "docker compose --env-file .env logs -f",
```

**Production Scripts** (menggunakan `.env.production`):

```json
"docker:prod": "docker compose -f docker-compose.prod.yml --env-file .env.production up -d --build",
"docker:prod:logs": "docker compose -f docker-compose.prod.yml --env-file .env.production logs -f",
```

### 3️⃣ Helper Scripts

**`setup-env.ps1` / `setup-env.sh`**:

- `local` → Copy `.env.local` ke `.env`
- `prod` → Copy `.env.prod` ke `.env.production` + generate secrets

---

## 🚀 Workflow Lengkap

### Local Development

```bash
# 1. Setup environment
.\setup-env.ps1 local
# Hasil: .env.local → .env

# 2. Jalankan Docker
npm run dev:docker
# Eksekusi: docker compose --env-file .env up

# 3. Docker membaca .env
# Variables dari .env digunakan oleh docker-compose.yml
```

### Production Deployment

```bash
# 1. Setup environment
.\setup-env.ps1 prod
# Hasil: .env.prod → .env.production (+ generate secrets)

# 2. Edit .env.production
nano .env.production

# 3. Deploy
npm run docker:prod
# Eksekusi: docker compose -f docker-compose.prod.yml --env-file .env.production up

# 4. Docker membaca .env.production
# Variables dari .env.production digunakan oleh docker-compose.prod.yml
```

---

## 📊 Flow Diagram

```
LOCAL DEVELOPMENT
─────────────────
  ┌─────────────┐
  │ .env.local  │ (template)
  └──────┬──────┘
         │ setup-env.ps1 local
         ▼
  ┌─────────────┐
  │    .env     │ (active config)
  └──────┬──────┘
         │ npm run dev:docker
         │ (docker compose --env-file .env up)
         ▼
  ┌──────────────────────┐
  │  docker-compose.yml  │ (reads .env)
  └──────────────────────┘
         │
         ▼
  [Container Running]


PRODUCTION DEPLOYMENT
────────────────────
  ┌─────────────┐
  │  .env.prod  │ (template)
  └──────┬──────┘
         │ setup-env.ps1 prod
         ▼
  ┌──────────────────┐
  │ .env.production  │ (active config)
  └────────┬─────────┘
           │ npm run docker:prod
           │ (docker compose -f docker-compose.prod.yml --env-file .env.production up)
           ▼
  ┌──────────────────────────┐
  │ docker-compose.prod.yml  │ (reads .env.production)
  └──────────────────────────┘
           │
           ▼
  [Container Running in Production]
```

---

## 🔍 Cara Docker Membaca Environment Variables

### 1. Command Line Flag (Highest Priority)

```bash
docker compose --env-file .env.production up
#                         ^^^^^^^^^^^^^^^^
#                         File yang digunakan
```

### 2. File yang Dibaca

Docker Compose akan membaca variables dari file yang di-specify:

- `.env` untuk development
- `.env.production` untuk production

### 3. Substitusi di docker-compose.yml

```yaml
environment:
  DATABASE_URL: mysql://${DB_USER}:${DB_PASSWORD}@db:3306/${DB_NAME}
  #                     ^^^^^^^^   ^^^^^^^^^^^^         ^^^^^^^^
  #                     Dibaca dari --env-file
```

---

## ✅ Keuntungan System Ini

### 1. **Explicit & Clear**

- Jelas file mana yang digunakan
- Tidak ada ambiguitas
- Easy debugging

### 2. **Separation of Concerns**

- Local config terpisah dari production
- Tidak ada risk tercampur
- Safe switching

### 3. **Automated**

- NPM scripts handle semuanya
- No manual docker commands
- Consistent behavior

### 4. **Flexible**

- Bisa manual jika perlu
- Bisa override per variable
- Support multiple environments

---

## 🎯 Command Cheat Sheet

### Development

```bash
# Setup
.\setup-env.ps1 local          # Creates .env

# Run
npm run dev:docker             # Uses .env
npm run docker:logs            # Uses .env
npm run docker:stop            # Uses .env
```

### Production

```bash
# Setup
.\setup-env.ps1 prod           # Creates .env.production

# Deploy
npm run docker:prod            # Uses .env.production
npm run docker:prod:logs       # Uses .env.production
npm run docker:prod:down       # Uses .env.production
```

### Manual Commands

```bash
# Development (manual)
docker compose --env-file .env up

# Production (manual)
docker compose -f docker-compose.prod.yml --env-file .env.production up -d
```

---

## 🔐 Security Notes

### .gitignore Protection

```gitignore
.env*                    # Ignore all .env files
!.env.example            # Except templates
!.env.production.example
```

**Result:**

- ✅ `.env.local` → Tracked (template)
- ✅ `.env.prod` → Tracked (template)
- ❌ `.env` → Not tracked (active config)
- ❌ `.env.production` → Not tracked (active config)

---

## 🆘 Troubleshooting

### Problem: Docker masih pakai env file lama

**Solution:**

```bash
# Stop semua container
npm run docker:stop

# Rebuild dengan env file baru
npm run dev:docker
# atau
npm run docker:prod
```

### Problem: Variables tidak ter-load

**Solution:**

```bash
# Check env file exists
ls -la .env
ls -la .env.production

# Check file contents
cat .env | grep DATABASE_URL

# Test manual
docker compose --env-file .env config
```

### Problem: Production pakai development config

**Solution:**

```bash
# Pastikan command benar
npm run docker:prod  # ✅ Correct (uses .env.production)
npm run dev:docker   # ❌ Wrong (uses .env)

# Manual check
docker compose -f docker-compose.prod.yml --env-file .env.production config
```

---

## 💡 Best Practices

1. **Always Use NPM Scripts**

   ```bash
   npm run dev:docker      # ✅ Good
   docker compose up       # ⚠️ Might use wrong env
   ```

2. **Verify Before Deploy**

   ```bash
   # Check which env file will be used
   docker compose -f docker-compose.prod.yml --env-file .env.production config
   ```

3. **Keep Templates Updated**

   - Update `.env.local` when adding new variables
   - Update `.env.prod` with same variables
   - Document in ENV_GUIDE.md

4. **Never Commit Active Configs**
   - `.env` → Local use only
   - `.env.production` → Server only
   - Both in .gitignore

---

## 📚 Related Documentation

- [ENV_GUIDE.md](./ENV_GUIDE.md) - Complete environment guide
- [ENV_QUICK_REF.md](./ENV_QUICK_REF.md) - Quick reference
- [NPM_SCRIPTS_DOCUMENTATION.md](./documentations/NPM_SCRIPTS_DOCUMENTATION.md) - All npm scripts
- [DOCKER_SETUP.md](./documentations/DOCKER_SETUP.md) - Docker configuration

---

**Summary:** Docker tahu file mana yang dipakai karena kita **explicitly specify** dengan `--env-file` flag di semua npm scripts. Development pakai `.env`, Production pakai `.env.production`. Simple, clear, dan safe! 🎉
