# 🚀 Quick Start Guide - Docker

Panduan cepat untuk menjalankan aplikasi E-Commerce dengan Docker.

---

## Prerequisites

✅ Docker Desktop terinstall dan berjalan  
✅ Git installed  
✅ Port 3000 dan 3306 tersedia

---

## 🎯 Setup dalam 3 Langkah

### 1. Clone & Setup Environment

```powershell
# Clone repository
git clone <repository-url>
cd ecommerce_V1

# Copy environment variables
Copy-Item .env.example .env
```

Edit `.env` dan sesuaikan konfigurasi (minimal: `NEXTAUTH_SECRET`)

**Required Environment Variables:**

```env
# Database
DB_ROOT_PASSWORD=rootpassword
DB_NAME=ecommerce
DB_USER=ecommerce_user
DB_PASSWORD=ecommerce_password

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Optional: Google OAuth, Stripe, PayPal
```

### 2. Jalankan dengan Docker

**Option A: Development dengan Hot Reload (Recommended)**

```powershell
npm run docker:dev:watch
```

✅ Auto-reload on code changes  
✅ Prisma migrations otomatis  
✅ Database seeding otomatis

**Option B: Development Standard**

```powershell
npm run docker:dev
```

**Option C: Production**

```powershell
npm run docker:prod
```

### 3. Access Application

| Service          | URL                              | Credentials   |
| ---------------- | -------------------------------- | ------------- |
| **Web App**      | http://localhost:3000            | -             |
| **Health Check** | http://localhost:3000/api/health | -             |
| **MySQL**        | localhost:3306                   | See .env file |

---

## 🔍 Monitoring

### Check Container Status

```powershell
docker ps
```

Look for **HEALTH** status:

- `healthy` ✅ - Normal
- `unhealthy` ❌ - Ada masalah
- `starting` 🔄 - Sedang start

### View Logs

```powershell
npm run docker:logs
```

---

## 🗄️ Database Commands

### Prisma Studio (Database GUI)

```powershell
docker exec -it ecommerce_app_dev npx prisma studio
```

Access: http://localhost:5555

### Seed Database

```powershell
docker exec -it ecommerce_app_dev npm run seed
```

### Migration Status

```powershell
docker exec -it ecommerce_app_dev npx prisma migrate status
```

---

## 🛑 Stop Containers

```powershell
npm run docker:stop
```

---

## 🐛 Troubleshooting

### Port Already in Use

```powershell
# Check port 3000
netstat -ano | findstr :3000

# Kill process
taskkill /PID <PID> /F
```

### Container Won't Start

```powershell
# Remove and rebuild
docker compose down -v
npm run docker:dev
```

### View Container Logs

```powershell
docker logs ecommerce_app_dev -f
docker logs ecommerce_db -f
```

---

## 📦 Data Persistence

Data berikut persist di Docker volumes:

- ✅ Database data (`db_data`)
- ✅ Uploaded files (`uploads_data`)

### Backup Uploads

```powershell
docker run --rm -v ecommerce_v1_uploads_data:/uploads -v ${PWD}:/backup alpine tar czf /backup/uploads-backup.tar.gz -C /uploads .
```

---

---

## 🔄 Common Tasks

### Update Dependencies

```powershell
# Stop containers
npm run docker:stop

# Rebuild
npm run docker:dev
```

### Clean Rebuild

```powershell
# Remove containers and images
docker compose down
docker rmi $(docker images -f "dangling=true" -q)

# Rebuild from scratch
npm run docker:dev
```

### Reset Everything

```powershell
# WARNING: This deletes all data!
docker compose down -v
docker volume rm ecommerce_v1_db_data ecommerce_v1_uploads_data

# Start fresh
npm run docker:dev
```

---

## 📚 What's Running?

| Service           | Port | Description                 |
| ----------------- | ---- | --------------------------- |
| **Next.js App**   | 3000 | Web application             |
| **MySQL**         | 3306 | Database server             |
| **Prisma Studio** | 5555 | Database GUI (when running) |

---

## ✨ Features

✅ **Auto Migration**: Database schema otomatis ter-update  
✅ **Hot Reload**: Code changes langsung ter-apply (watch mode)  
✅ **Health Monitoring**: Auto-check setiap 30 detik  
✅ **Data Persistence**: Database & uploads tetap ada setelah restart  
✅ **Production Ready**: Optimized build untuk deployment

---

## 🎓 Best Practices

1. **Selalu gunakan watch mode untuk development**

   ```powershell
   npm run docker:dev:watch
   ```

2. **Check health status secara berkala**

   ```powershell
   docker ps
   ```

3. **Backup data penting secara berkala**

   - Database: Gunakan MySQL dump
   - Uploads: Backup Docker volume

4. **Gunakan strong passwords di production**

   - Edit `.env.production` dengan credentials kuat

5. **Monitor logs jika ada masalah**
   ```powershell
   npm run docker:logs
   ```

---

## 📖 Full Documentation

Untuk panduan lengkap dan troubleshooting detail:

- 📄 **[DOCKERFILE_IMPROVEMENTS.md](./DOCKERFILE_IMPROVEMENTS.md)** - Technical details & improvements
- 📄 **[DOCKER_SETUP.md](./DOCKER_SETUP.md)** - Complete setup guide

---

## 🆘 Need Help?

1. **Check logs first:** `npm run docker:logs`
2. **Check container health:** `docker ps`
3. **Verify environment variables** in `.env`
4. **Try restart:** `npm run docker:stop && npm run docker:dev`
5. **Last resort:** Clean rebuild

---

**Happy Coding! 🚀**
