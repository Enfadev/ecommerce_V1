# 🎯 Scripts Quick Reference

> **TL;DR:** Visual guide untuk memahami 3 script files di project ini

---

## 📊 Quick Comparison

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PROJECT SCRIPTS                              │
├─────────────────┬─────────────────┬─────────────────┬──────────────┤
│ Script          │ healthcheck.sh  │ docker.sh       │ docker.ps1   │
├─────────────────┼─────────────────┼─────────────────┼──────────────┤
│ Purpose         │ Health Check    │ Docker Helper   │ Docker Helper│
│ Platform        │ Linux (Docker)  │ Linux/Mac       │ Windows      │
│ Lines of Code   │ 8               │ 264             │ 229          │
│ Importance      │ 🟢 HIGH         │ 🟡 MEDIUM       │ 🟡 MEDIUM    │
│ Production      │ ✅ REQUIRED     │ ❌ OPTIONAL     │ ❌ OPTIONAL  │
│ Development     │ ⚠️ NICE TO HAVE │ ✅ RECOMMENDED  │ ✅ RECOMMENDED│
│ Can Remove?     │ ❌ NO           │ ✅ YES          │ ✅ YES       │
└─────────────────┴─────────────────┴─────────────────┴──────────────┘
```

---

## 🏥 healthcheck.sh

```
┌──────────────────────────────────────────────────────────┐
│                    HEALTHCHECK.SH                        │
├──────────────────────────────────────────────────────────┤
│  Purpose: Monitor Docker container health               │
│  Size: 8 lines                                           │
│  Status: 🟢 CRITICAL for PRODUCTION                     │
└──────────────────────────────────────────────────────────┘

How it works:
  [Container] → [healthcheck.sh] → [curl /api/health]
       ↓                                    ↓
  [Docker]  ← [exit 0/1]  ←  [Response 200/5xx]

Every 30 seconds:
  ✅ Healthy   → Container running normally
  ❌ Unhealthy → Docker can restart automatically

Used by:
  • Docker HEALTHCHECK directive
  • Kubernetes liveness/readiness probes
  • Load balancers
  • Monitoring systems
```

---

## 🛠️ docker.sh (Linux/Mac)

```
┌──────────────────────────────────────────────────────────┐
│                      DOCKER.SH                           │
├──────────────────────────────────────────────────────────┤
│  Purpose: Developer productivity & consistency           │
│  Size: 264 lines                                         │
│  Status: 🟡 OPTIONAL but HIGHLY RECOMMENDED              │
└──────────────────────────────────────────────────────────┘

Commands Available (20+):

┌─────────────────┬────────────────────────────────────────┐
│ ./docker.sh dev │ Start development mode                 │
│ ./docker.sh prod│ Start production mode                  │
│ ./docker.sh stop│ Stop all containers                    │
│ ./docker.sh logs│ View container logs                    │
├─────────────────┼────────────────────────────────────────┤
│ Database Commands:                                       │
│ ./docker.sh migrate │ Run Prisma migrations             │
│ ./docker.sh seed    │ Seed database with data           │
│ ./docker.sh studio  │ Open Prisma Studio                │
│ ./docker.sh exec:db │ Access MySQL shell                │
├─────────────────┼────────────────────────────────────────┤
│ Container Commands:                                      │
│ ./docker.sh exec:app│ Shell into app container          │
│ ./docker.sh restart │ Restart containers                │
│ ./docker.sh status  │ Check container status            │
│ ./docker.sh clean   │ Remove all containers & volumes   │
└─────────────────┴────────────────────────────────────────┘

Features:
  ✅ Colored output (info, success, warning, error)
  ✅ Auto .env check and creation
  ✅ Error handling
  ✅ Built-in help menu
  ✅ Shortcuts for long docker commands
```

---

## 🪟 docker.ps1 (Windows)

```
┌──────────────────────────────────────────────────────────┐
│                     DOCKER.PS1                           │
├──────────────────────────────────────────────────────────┤
│  Purpose: Windows version of docker.sh                   │
│  Size: 229 lines                                         │
│  Status: 🟡 OPTIONAL but HIGHLY RECOMMENDED              │
└──────────────────────────────────────────────────────────┘

Commands Available:

┌──────────────────┬───────────────────────────────────────┐
│ .\docker.ps1 dev │ Start development mode                │
│ .\docker.ps1 prod│ Start production mode                 │
│ .\docker.ps1 stop│ Stop all containers                   │
│ ... (all commands same as docker.sh)                     │
└──────────────────┴───────────────────────────────────────┘

PowerShell-specific:
  ✅ Write-Host for colored output
  ✅ Test-Path for file checks
  ✅ Windows-native error handling
  ✅ 100% feature parity with docker.sh
```

---

## 🎯 Decision Tree

```
Should I keep these scripts?

START
  │
  ├─ healthcheck.sh?
  │   ├─ Production deployment? → ✅ KEEP (REQUIRED)
  │   └─ Dev only? → ⚠️ KEEP (good practice)
  │
  ├─ docker.sh?
  │   ├─ Linux/Mac users? → ✅ KEEP (very helpful)
  │   ├─ Want shortcuts? → ✅ KEEP (productivity++)
  │   └─ Prefer docker compose directly? → ⚠️ OPTIONAL
  │
  └─ docker.ps1?
      ├─ Windows users? → ✅ KEEP (essential for them)
      ├─ Cross-platform team? → ✅ KEEP (consistency)
      └─ Linux/Mac only? → ⚠️ OPTIONAL

Recommendation: KEEP ALL 3! 🎉
  - Minimal overhead (~300 lines total)
  - Maximum benefit (productivity, safety, monitoring)
```

---

## 📈 Value vs Overhead

```
          High Value
              │
    ╭─────────┼─────────╮
    │         │         │
    │    healthcheck.sh │  🟢 KEEP
    │         │         │  (production critical)
────┼─────────┼─────────┼──── Medium Overhead
    │         │         │
    │  docker.sh/ps1    │  🟡 KEEP
    │         │         │  (dev productivity)
    │         │         │
    ╰─────────┼─────────╯
              │
         Low Value
```

---

## 🚀 Usage Examples

### Quick Start (With Scripts)

```bash
# Linux/Mac
./docker.sh dev          # 1 command to start everything!
./docker.sh migrate      # Run migrations
./docker.sh studio       # Open Prisma Studio

# Windows
.\docker.ps1 dev         # Same experience!
.\docker.ps1 migrate
.\docker.ps1 studio
```

### Manual Way (Without Scripts)

```bash
# Need to type full commands every time
docker compose up --build
docker compose down
docker exec -it ecommerce_app_dev npx prisma migrate deploy
docker exec -it ecommerce_app_dev npx prisma studio

# More typing, more chance for typos! ⚠️
```

---

## ✅ Final Answer

### **Q: Apakah script-script ini penting?**

**A: Tergantung konteks:**

| Script             | Production     | Development        | Recommendation |
| ------------------ | -------------- | ------------------ | -------------- |
| **healthcheck.sh** | ✅ WAJIB       | ⚠️ Bagus punya     | **KEEP!**      |
| **docker.sh**      | ❌ Tidak perlu | ✅ Sangat membantu | **KEEP!**      |
| **docker.ps1**     | ❌ Tidak perlu | ✅ Sangat membantu | **KEEP!**      |

### **Q: Bisa dihapus?**

**A: Secara teknis bisa, tapi:**

```
❌ healthcheck.sh → Jangan hapus (production needs it!)
⚠️ docker.sh     → Bisa, tapi team productivity turun
⚠️ docker.ps1    → Bisa, tapi Windows users susah
```

### **Q: Alternative jika dihapus?**

**A: Tambah npm scripts:**

```json
{
  "scripts": {
    "docker:dev": "docker compose up --build",
    "docker:prod": "docker compose -f docker-compose.prod.yml up -d --build",
    "docker:stop": "docker compose down",
    "docker:migrate": "docker exec -it ecommerce_app_dev npx prisma migrate deploy"
  }
}
```

---

## 🎓 Best Practice

### **Recommendation: KEEP ALL 3 SCRIPTS! ✅**

**Alasan:**

1. ✅ Already setup and working
2. ✅ Minimal overhead (3 files, ~300 lines total)
3. ✅ Huge productivity gain
4. ✅ Team consistency
5. ✅ Production-ready (healthcheck)
6. ✅ Cross-platform support

**Trade-off:**

- Cost: ~300 lines of code
- Benefit: Better DX, monitoring, consistency
- Verdict: **Worth it! 🚀**

---

**Full Documentation:** [SCRIPTS_DOCUMENTATION.md](./SCRIPTS_DOCUMENTATION.md)

**Related:**

- [DOCKER_QUICK_START.md](./DOCKER_QUICK_START.md)
- [DOCKER_SETUP.md](./DOCKER_SETUP.md)
- [DOCKERFILE_IMPROVEMENTS.md](./DOCKERFILE_IMPROVEMENTS.md)
