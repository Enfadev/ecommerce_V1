# 🚀 Production Deployment - Quick Guide

## 📋 Overview

Setup Docker production untuk deployment di Ubuntu Server dengan Cloudflare Tunnel.

---

## ⚡ Quick Start

### 1. Setup Environment

```bash
# Copy template
cp .env.production.example .env.production

# Edit dengan credentials production
nano .env.production
```

**Generate NEXTAUTH_SECRET:**

```bash
openssl rand -base64 32
```

### 2. Deploy

```bash
# Menggunakan script otomatis
chmod +x deploy-production.sh
./deploy-production.sh

# Atau manual
docker compose -f docker-compose.prod.yml up -d --build
```

### 3. Verify

```bash
# Check status
docker compose -f docker-compose.prod.yml ps

# Check logs
docker compose -f docker-compose.prod.yml logs -f

# Test health
curl http://localhost/health
```

---

## 📊 Common Commands

```bash
# Start
npm run docker:prod

# Stop
npm run docker:prod:down

# Logs
npm run docker:prod:logs
npm run docker:prod:logs:app

# Status
npm run docker:prod:status

# Restart
npm run docker:prod:restart
```

---

## 🏗️ Architecture

```
Cloudflare Tunnel (SSL/TLS)
         ↓
    Nginx (Port 80)
         ↓
   Next.js App (Port 3000)
         ↓
   MySQL Database (Port 3306)
```

---

## 📚 Full Documentation

- **[PRODUCTION_DEPLOYMENT_CLOUDFLARE.md](./documentations/PRODUCTION_DEPLOYMENT_CLOUDFLARE.md)** - Complete deployment guide
- **[PRODUCTION_CHECKLIST.md](./documentations/PRODUCTION_CHECKLIST.md)** - Pre-deployment checklist
- **[PRODUCTION_READY_SUMMARY.md](./documentations/PRODUCTION_READY_SUMMARY.md)** - Overview & summary

---

## 🔒 Important Notes

- ✅ Database hanya accessible dari internal container network
- ✅ Use strong passwords (min 16 characters)
- ✅ NEVER commit `.env.production` to Git
- ✅ Setup Cloudflare Tunnel untuk public access
- ✅ Regular backups untuk database dan uploads

---

## 🆘 Troubleshooting

```bash
# View logs
docker compose -f docker-compose.prod.yml logs app

# Restart services
docker compose -f docker-compose.prod.yml restart

# Full rebuild
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build
```

---

**Status:** ✅ Ready for Production

**Last Updated:** October 8, 2025
