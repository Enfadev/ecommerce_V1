# Docker Setup - Summary

## ✅ Files Created

Setup Docker telah berhasil dibuat dengan file-file berikut:

### Core Docker Files

- ✅ `Dockerfile` - Multi-stage build (development & production)
- ✅ `docker-compose.yml` - Development configuration dengan watch mode
- ✅ `docker-compose.prod.yml` - Production configuration
- ✅ `.dockerignore` - Exclude files saat build
- ✅ `.env.example` - Template environment variables

### Helper Scripts

- ✅ `docker.sh` - Bash script untuk Linux/Mac
- ✅ `docker.ps1` - PowerShell script untuk Windows
- ✅ `healthcheck.sh` - Health check script

### Documentation

- ✅ `DOCKER_SETUP.md` - Dokumentasi lengkap
- ✅ `DOCKER_QUICK_START.md` - Quick start guide
- ✅ `docker-compose.override.yml.example` - Template untuk custom config

### API & Configuration

- ✅ `src/app/api/health/route.ts` - Health check endpoint
- ✅ `.github/workflows/docker-build.yml` - CI/CD GitHub Actions
- ✅ Updated `next.config.ts` - Tambah standalone output
- ✅ Updated `package.json` - Tambah docker scripts
- ✅ Updated `README.md` - Tambah Docker instructions
- ✅ Updated `.gitignore` - Exclude docker files

## 🎯 Key Features

### 1. Watch Mode (Hot Reload)

```yaml
develop:
  watch:
    - action: sync
      path: ./src
      target: /app/src
      ignore:
        - node_modules/
    - action: rebuild
      path: package.json
```

Perubahan di `./src` langsung sync, perubahan di `package.json` trigger rebuild.

### 2. Multi-Stage Build

- **Development**: Full Node.js dengan hot reload
- **Production**: Optimized standalone build

### 3. Services

- **App**: Next.js application (port 3000)
- **Database**: MySQL 8.0 (port 3306)
- **Volumes**: Persistent data storage

### 4. Helper Scripts

Windows (PowerShell):

```powershell
.\docker.ps1 dev:watch    # Start dengan hot reload
.\docker.ps1 dev:up       # Start background
.\docker.ps1 stop         # Stop
.\docker.ps1 migrate      # Run migrations
.\docker.ps1 seed         # Seed database
.\docker.ps1 help         # All commands
```

Linux/Mac (Bash):

```bash
./docker.sh dev:watch
./docker.sh dev:up
./docker.sh stop
```

## 🚀 Quick Start

### 1. Setup Environment

```powershell
Copy-Item .env.example .env
# Edit .env sesuai kebutuhan
```

### 2. Start Development

```powershell
# Option A: Hot reload (recommended)
.\docker.ps1 dev:watch

# Option B: Background
.\docker.ps1 dev:up

# Option C: Foreground
docker compose up --build
```

### 3. Setup Database

```powershell
.\docker.ps1 migrate
.\docker.ps1 seed
```

### 4. Access

- App: http://localhost:3000
- Health Check: http://localhost:3000/api/health
- Prisma Studio: http://localhost:5555 (run: `.\docker.ps1 studio`)

## 📝 Common Commands

### Development

```powershell
.\docker.ps1 dev:watch     # Start dengan hot reload
.\docker.ps1 dev:up        # Start background
.\docker.ps1 logs          # View logs
.\docker.ps1 logs app      # View app logs only
.\docker.ps1 restart       # Restart containers
.\docker.ps1 stop          # Stop containers
```

### Database

```powershell
.\docker.ps1 migrate       # Run migrations
.\docker.ps1 migrate:dev init  # Create new migration
.\docker.ps1 seed          # Seed database
.\docker.ps1 studio        # Open Prisma Studio
.\docker.ps1 reset         # Reset database
```

### Container Management

```powershell
.\docker.ps1 exec:app      # Shell to app container
.\docker.ps1 exec:db       # Shell to database container
.\docker.ps1 status        # Container status
.\docker.ps1 rebuild       # Rebuild containers
.\docker.ps1 clean         # Remove all (containers, volumes, images)
```

### Production

```powershell
.\docker.ps1 prod          # Start production
docker compose -f docker-compose.prod.yml logs -f
```

## 🔧 Configuration

### Environment Variables (.env)

```env
# Database
DB_ROOT_PASSWORD=rootpassword
DB_NAME=ecommerce
DB_USER=ecommerce_user
DB_PASSWORD=ecommerce_password
DB_PORT=3306

# App
APP_PORT=3000
NODE_ENV=development
DATABASE_URL=mysql://ecommerce_user:ecommerce_password@localhost:3306/ecommerce

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# OAuth & Payments
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
STRIPE_SECRET_KEY=...
PAYPAL_CLIENT_ID=...
```

### Custom Configuration

Create `docker-compose.override.yml` from example:

```powershell
Copy-Item docker-compose.override.yml.example docker-compose.override.yml
```

## 🐛 Troubleshooting

### Port Already in Use

Edit `.env`:

```env
APP_PORT=3001
DB_PORT=3307
```

### Container Won't Start

```powershell
.\docker.ps1 rebuild
```

### Database Connection Error

```powershell
# Check logs
.\docker.ps1 logs db

# Wait for healthy state
docker compose ps
```

### Hot Reload Not Working

```powershell
# Use watch mode
.\docker.ps1 dev:watch

# Or restart
.\docker.ps1 restart
```

### Clean Start

```powershell
.\docker.ps1 clean
.\docker.ps1 dev:up
.\docker.ps1 migrate
.\docker.ps1 seed
```

## 📊 Architecture

```
┌─────────────────────────────────────┐
│   Docker Compose Network            │
│                                     │
│  ┌──────────────┐  ┌─────────────┐ │
│  │  Next.js App │  │   MySQL DB  │ │
│  │  Port: 3000  │──│  Port: 3306 │ │
│  │              │  │             │ │
│  │  - Hot Reload│  │  - Volume   │ │
│  │  - Watch Mode│  │  - Health   │ │
│  └──────────────┘  └─────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

## 📚 Documentation Links

- [DOCKER_SETUP.md](./DOCKER_SETUP.md) - Dokumentasi lengkap
- [DOCKER_QUICK_START.md](./DOCKER_QUICK_START.md) - Quick start guide
- [README.md](./README.md) - Project overview

## ✨ Next Steps

1. ✅ Setup environment variables
2. ✅ Start containers dengan `.\docker.ps1 dev:watch`
3. ✅ Run migrations dengan `.\docker.ps1 migrate`
4. ✅ Seed database dengan `.\docker.ps1 seed`
5. 🎨 Customize branding & theme
6. 🔐 Configure OAuth providers
7. 💳 Setup payment gateways
8. 🚀 Deploy to production

## 🎉 Success!

Docker setup berhasil dibuat dengan fitur:

- ✅ Hot reload untuk development
- ✅ Watch mode untuk auto-sync
- ✅ Multi-stage build
- ✅ Helper scripts (Windows & Unix)
- ✅ Health check endpoint
- ✅ CI/CD ready
- ✅ Production ready
- ✅ Complete documentation

Selamat coding! 🚀
