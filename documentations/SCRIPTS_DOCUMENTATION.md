# 📜 Project Scripts Documentation

**Date:** October 7, 2025

---

## 🎯 Overview

Project ini memiliki 3 script files utama:

1. **healthcheck.sh** - Health check untuk Docker container
2. **docker.sh** - Docker helper script untuk Linux/Mac
3. **docker.ps1** - Docker helper script untuk Windows (PowerShell)

---

## 📋 Script Analysis

### 1. **healthcheck.sh**

```bash
#!/bin/sh
# Health check script for Docker container

set -e

# Check if the app is responding
curl -f http://localhost:3000/api/health || exit 1
```

#### **Fungsi:**

- 🏥 **Health check** untuk Docker container
- 📊 **Monitor** status aplikasi
- ✅ **Verify** aplikasi running dengan baik

#### **Kapan Digunakan:**

- ✅ Otomatis dipanggil oleh Docker HEALTHCHECK
- ✅ Setiap 30 detik (interval setting di Dockerfile)
- ✅ Saat container berjalan

#### **Cara Kerja:**

1. Curl ke `http://localhost:3000/api/health`
2. Jika sukses (status 200): Return exit 0 (healthy)
3. Jika gagal: Return exit 1 (unhealthy)

#### **Digunakan Di:**

```dockerfile
# Dockerfile - Production Stage
COPY healthcheck.sh ./
RUN chmod +x healthcheck.sh

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD ./healthcheck.sh || exit 1
```

#### **Pentingnya:**

🟢 **PENTING untuk Production!**

**Alasan:**

- ✅ **Auto-monitoring** - Docker tahu kapan app bermasalah
- ✅ **Auto-restart** - Container restart otomatis jika unhealthy
- ✅ **Orchestration** - Kubernetes/Docker Swarm butuh ini
- ✅ **Load balancer** - Tahu container mana yang sehat
- ⚠️ **Opsional untuk Development** - Tapi tetap bagus punya

**Tanpa healthcheck.sh:**

- ❌ Container bisa "running" tapi app crash
- ❌ Tidak ada auto-restart
- ❌ Tidak ada monitoring status
- ❌ Load balancer tidak tahu container bermasalah

---

### 2. **docker.sh** (Linux/Mac)

```bash
#!/bin/bash
# Docker Helper Script untuk E-Commerce App

# Functions: dev, dev:up, dev:watch, prod, stop, logs,
#           exec:app, exec:db, migrate, seed, studio, etc.
```

#### **Fungsi:**

- 🛠️ **Helper commands** untuk Docker operations
- 🚀 **Shortcuts** untuk docker compose commands
- 📝 **User-friendly** interface dengan colors
- ✅ **Auto-check** .env file

#### **Commands Available:**

| Command                 | Fungsi               | Equivalent Docker Command                                 |
| ----------------------- | -------------------- | --------------------------------------------------------- |
| `./docker.sh dev`       | Start dev mode       | `docker compose up --build`                               |
| `./docker.sh dev:up`    | Start dev (detached) | `docker compose up -d --build`                            |
| `./docker.sh dev:watch` | Start watch mode     | `docker compose watch`                                    |
| `./docker.sh prod`      | Start production     | `docker compose -f docker-compose.prod.yml up -d --build` |
| `./docker.sh stop`      | Stop containers      | `docker compose down`                                     |
| `./docker.sh logs`      | View logs            | `docker compose logs -f`                                  |
| `./docker.sh exec:app`  | Shell ke app         | `docker exec -it ecommerce_app_dev sh`                    |
| `./docker.sh exec:db`   | Shell ke database    | `docker exec -it ecommerce_db mysql ...`                  |
| `./docker.sh migrate`   | Run migrations       | `docker exec ... npx prisma migrate deploy`               |
| `./docker.sh seed`      | Seed database        | `docker exec ... npm run seed`                            |
| `./docker.sh studio`    | Open Prisma Studio   | `docker exec ... npx prisma studio`                       |
| `./docker.sh restart`   | Restart containers   | `docker compose restart`                                  |
| `./docker.sh status`    | Check status         | `docker compose ps`                                       |
| `./docker.sh clean`     | Clean all            | `docker compose down -v`                                  |
| `./docker.sh help`      | Show help            | -                                                         |

#### **Features:**

- ✅ **Colored output** (info, success, warning, error)
- ✅ **Auto .env check** - Create dari .env.example jika tidak ada
- ✅ **Error handling** - Stop on error
- ✅ **Help menu** - Show all commands
- ✅ **Multiple operations** - All-in-one script

#### **Pentingnya:**

🟡 **OPSIONAL tapi SANGAT MEMBANTU!**

**Benefits:**

- ✅ **Productivity** - Shortcut commands (type less!)
- ✅ **Consistency** - Semua developer pakai command sama
- ✅ **User-friendly** - Easier to remember
- ✅ **Safety** - Auto-check .env sebelum start
- ✅ **Documentation** - Built-in help menu

**Tanpa docker.sh:**

- ⚠️ Harus hafal/type full docker compose commands
- ⚠️ Lebih banyak typing
- ⚠️ Risk typo di command
- ✅ Masih bisa pakai docker compose langsung

**Alternative:**

```bash
# Tanpa docker.sh:
docker compose up --build
docker compose -f docker-compose.prod.yml up -d --build
docker exec -it ecommerce_app_dev npx prisma migrate deploy

# Dengan docker.sh:
./docker.sh dev
./docker.sh prod
./docker.sh migrate
```

---

### 3. **docker.ps1** (Windows/PowerShell)

```powershell
# Docker Helper Script untuk E-Commerce App (PowerShell)

# Same functions as docker.sh but for Windows
```

#### **Fungsi:**

- 🪟 **Windows version** dari docker.sh
- 🛠️ **Same functionality** dengan docker.sh
- 💻 **PowerShell syntax** untuk Windows users

#### **Commands Available:**

**SAMA PERSIS** dengan docker.sh!

| Command                    | Fungsi               |
| -------------------------- | -------------------- |
| `.\docker.ps1 dev`         | Start dev mode       |
| `.\docker.ps1 dev:up`      | Start dev (detached) |
| `.\docker.ps1 dev:watch`   | Start watch mode     |
| `.\docker.ps1 prod`        | Start production     |
| `.\docker.ps1 stop`        | Stop containers      |
| _(... semua command sama)_ |                      |

#### **Differences from docker.sh:**

- 🪟 PowerShell syntax (not bash)
- 🎨 Windows colors (Write-Host)
- 📝 PowerShell error handling
- ✅ **Functionality 100% sama**

#### **Pentingnya:**

🟡 **OPSIONAL tapi SANGAT MEMBANTU untuk Windows Users!**

**Benefits:**

- ✅ **Cross-platform** - Windows users bisa pakai helper
- ✅ **Same experience** - Sama seperti Linux/Mac users
- ✅ **PowerShell native** - Better integration di Windows
- ✅ **Consistency** - All developers use same commands

**Tanpa docker.ps1:**

- ⚠️ Windows users harus type full docker commands
- ⚠️ Inconsistent dengan Linux/Mac workflow
- ✅ Masih bisa pakai docker compose langsung

---

## 📊 Importance Matrix

| Script             | Importance | Environment | Can Remove?                          |
| ------------------ | ---------- | ----------- | ------------------------------------ |
| **healthcheck.sh** | 🟢 HIGH    | Production  | ❌ NO (production) ✅ YES (dev only) |
| **docker.sh**      | 🟡 MEDIUM  | Linux/Mac   | ✅ YES (use docker compose directly) |
| **docker.ps1**     | 🟡 MEDIUM  | Windows     | ✅ YES (use docker compose directly) |

---

## 🎯 Detailed Analysis

### **healthcheck.sh**

#### **Status: PENTING! 🟢**

**Production: MUST HAVE ✅**

```
Alasan:
1. Docker orchestration (K8s, Swarm) butuh health status
2. Load balancer butuh tahu container mana yang sehat
3. Auto-restart jika unhealthy
4. Monitoring & alerting
5. Zero-downtime deployment
```

**Development: NICE TO HAVE ⚠️**

```
Alasan:
1. Good for testing healthcheck setup
2. Simulasi production environment
3. Tidak critical (dev di local)
```

**Jika Dihapus:**

```dockerfile
# Hapus ini dari Dockerfile:
COPY healthcheck.sh ./
RUN chmod +x healthcheck.sh
HEALTHCHECK ... CMD ./healthcheck.sh || exit 1

# Replace dengan inline command:
HEALTHCHECK ... CMD curl -f http://localhost:3000/api/health || exit 1
```

**Recommendation:**

- ✅ **KEEP IT!** - Already setup, working, and important for production
- ✅ Better to have separate script (easier to modify)
- ✅ Good practice (separation of concerns)

---

### **docker.sh & docker.ps1**

#### **Status: OPSIONAL tapi RECOMMENDED! 🟡**

**Benefits:**

1. **Developer Experience**

   ```bash
   # Without script:
   docker compose up --build
   docker compose -f docker-compose.prod.yml up -d --build
   docker exec -it ecommerce_app_dev npx prisma migrate deploy

   # With script:
   ./docker.sh dev
   ./docker.sh prod
   ./docker.sh migrate
   ```

2. **Consistency**

   ```
   All developers menggunakan command yang sama
   No confusion about which docker command to use
   ```

3. **Safety**

   ```powershell
   # Auto-check .env before starting
   function Check-Env {
       if (-not (Test-Path .env)) {
           # Auto create from .env.example
       }
   }
   ```

4. **Documentation**

   ```bash
   ./docker.sh help  # Show all commands
   ```

5. **Productivity**
   ```
   Type less, do more
   Faster workflow
   Less memorization
   ```

**Jika Dihapus:**

```json
// Update package.json:
{
  "scripts": {
    "docker:dev": "docker compose up --build",
    "docker:dev:watch": "docker compose watch",
    "docker:prod": "docker compose -f docker-compose.prod.yml up -d --build",
    "docker:stop": "docker compose down",
    "docker:logs": "docker compose logs -f"
  }
}
```

**Then use:**

```bash
npm run docker:dev
npm run docker:prod
npm run docker:stop
```

**Recommendation:**

- ✅ **KEEP IT!** - Already setup and very helpful
- ✅ Especially useful untuk Windows users (docker.ps1)
- ✅ Good for onboarding new developers
- ⚠️ Could remove if team prefer npm scripts only

---

## 🎓 Best Practice Recommendations

### **1. Keep All Scripts! ✅**

**Alasan:**

- Already setup and working
- Minimal overhead (3 small files)
- Very helpful for team
- Important for production (healthcheck.sh)

### **2. Alternative: Hybrid Approach**

Keep scripts but also add npm scripts:

```json
{
  "scripts": {
    // Existing
    "dev": "next dev --turbopack",
    "build": "next build",

    // Docker shortcuts (call the helper scripts)
    "docker:dev": "./docker.sh dev || .\\docker.ps1 dev",
    "docker:prod": "./docker.sh prod || .\\docker.ps1 prod",
    "docker:stop": "./docker.sh stop || .\\docker.ps1 stop",
    "docker:logs": "./docker.sh logs || .\\docker.ps1 logs"
  }
}
```

**Benefits:**

- ✅ npm scripts work cross-platform
- ✅ Still use helper scripts (colored output, auto-check)
- ✅ Familiar `npm run` commands

### **3. Minimum Required**

Jika ingin minimalis:

**MUST KEEP:**

- ✅ `healthcheck.sh` - Critical untuk production

**CAN REMOVE:**

- ⚠️ `docker.sh` - Use docker compose directly
- ⚠️ `docker.ps1` - Use docker compose directly

**But add npm scripts:**

```json
{
  "scripts": {
    "docker:dev": "docker compose up --build",
    "docker:prod": "docker compose -f docker-compose.prod.yml up -d --build",
    "docker:stop": "docker compose down",
    "docker:logs": "docker compose logs -f"
  }
}
```

---

## 📝 Summary

### **healthcheck.sh**

```
Status: 🟢 PENTING
Production: REQUIRED ✅
Development: NICE TO HAVE ⚠️
Can Remove: NO (production), YES (dev only)
Recommendation: KEEP IT!
```

### **docker.sh**

```
Status: 🟡 OPSIONAL tapi RECOMMENDED
Purpose: Developer productivity & consistency
Can Remove: YES (use docker compose or npm scripts)
Recommendation: KEEP IT! (very helpful)
```

### **docker.ps1**

```
Status: 🟡 OPSIONAL tapi RECOMMENDED
Purpose: Windows user experience
Can Remove: YES (use docker compose or npm scripts)
Recommendation: KEEP IT! (Windows team members benefit)
```

---

## 🎯 Final Recommendation

### **KEEP ALL 3 SCRIPTS! ✅**

**Reasoning:**

1. **healthcheck.sh** - Critical untuk production monitoring
2. **docker.sh** - Great developer experience
3. **docker.ps1** - Windows users deserve good UX too

**Total Overhead:** ~300 lines of code across 3 files
**Benefits:** Huge (productivity, safety, consistency)

**Trade-off:** Minimal cost, maximum benefit! 🚀

---

## 📖 Usage Examples

### Using Helper Scripts

```bash
# Linux/Mac
./docker.sh dev          # Start development
./docker.sh migrate      # Run migrations
./docker.sh studio       # Open Prisma Studio
./docker.sh help         # Show all commands

# Windows
.\docker.ps1 dev         # Start development
.\docker.ps1 migrate     # Run migrations
.\docker.ps1 studio      # Open Prisma Studio
.\docker.ps1 help        # Show all commands
```

### Without Helper Scripts

```bash
# Manual docker compose commands
docker compose up --build
docker compose down
docker compose logs -f
docker exec -it ecommerce_app_dev npx prisma migrate deploy
docker exec -it ecommerce_app_dev npx prisma studio
```

### Using npm Scripts (Alternative)

```bash
npm run docker:dev
npm run docker:prod
npm run docker:stop
npm run docker:logs
```

---

## ✅ Conclusion

**All 3 scripts are valuable:**

- **healthcheck.sh** = Production necessity
- **docker.sh** = Developer productivity
- **docker.ps1** = Cross-platform consistency

**Recommendation: Keep them all! 🎉**

---

**Related Documentation:**

- [DOCKER_QUICK_START.md](./DOCKER_QUICK_START.md)
- [DOCKER_SETUP.md](./DOCKER_SETUP.md)
- [DOCKERFILE_IMPROVEMENTS.md](./DOCKERFILE_IMPROVEMENTS.md)
