# 🚀 Quick Start Guide - Docker

Panduan cepat untuk menjalankan aplikasi E-Commerce dengan Docker.

## Prerequisites

✅ Docker Desktop terinstall dan berjalan

## Setup dalam 3 Langkah

### 1. Clone & Setup Environment

```powershell
# Clone repository
git clone <repository-url>
cd ecommerce_V1

# Copy environment variables
Copy-Item .env.example .env
```

Edit `.env` dan sesuaikan konfigurasi (minimal: `NEXTAUTH_SECRET`)

### 2. Jalankan dengan Docker

**Option A: Development dengan Hot Reload (Recommended)**

```powershell
.\docker.ps1 dev:watch
```

**Option B: Development Background**

```powershell
.\docker.ps1 dev:up
```

**Option C: Production**

```powershell
.\docker.ps1 prod
```

### 3. Setup Database

```powershell
# Jalankan migrations
.\docker.ps1 migrate

# Seed data (optional)
.\docker.ps1 seed
```

✅ **Aplikasi siap!** Buka: http://localhost:3000

## Common Commands

```powershell
.\docker.ps1 dev:watch    # Start dengan hot reload
.\docker.ps1 dev:up       # Start background
.\docker.ps1 stop         # Stop containers
.\docker.ps1 logs         # Lihat logs
.\docker.ps1 logs app     # Logs app saja
.\docker.ps1 exec:app     # Shell ke app container
.\docker.ps1 studio       # Prisma Studio
.\docker.ps1 restart      # Restart containers
.\docker.ps1 help         # Semua commands
```

## What's Running?

| Service       | Port | Description         |
| ------------- | ---- | ------------------- |
| App           | 3000 | Next.js Application |
| Database      | 3306 | MySQL 8.0           |
| Prisma Studio | 5555 | Database GUI        |

## Features

✨ **Hot Reload**: Perubahan di `./src` langsung sync ke container  
🔄 **Auto Rebuild**: Perubahan `package.json` trigger rebuild  
💾 **Data Persistence**: Database data tersimpan di Docker volume  
🔒 **Environment Isolation**: Config terpisah untuk dev & prod

## Troubleshooting

**Port sudah digunakan?**
Edit `.env`:

```env
APP_PORT=3001
DB_PORT=3307
```

**Container tidak start?**

```powershell
.\docker.ps1 rebuild
```

**Database error?**

```powershell
.\docker.ps1 reset
```

**Clean start?**

```powershell
.\docker.ps1 clean
```

## Next Steps

- 📖 Full documentation: [DOCKER_SETUP.md](./DOCKER_SETUP.md)
- 🎨 Customize theme & branding
- 🔐 Setup OAuth providers (Google, etc.)
- 💳 Configure payment gateways (Stripe, PayPal)

---

Need help? Run `.\docker.ps1 help`
