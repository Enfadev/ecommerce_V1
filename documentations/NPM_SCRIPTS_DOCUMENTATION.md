# 📦 NPM Scripts Documentation

**Date:** October 7, 2025

---

## 🎯 Overview

Semua Docker commands sekarang sudah tersedia sebagai **npm scripts** di `package.json`. File helper scripts (`docker.sh` dan `docker.ps1`) sudah dihapus karena tidak diperlukan untuk production dan sudah digantikan dengan npm scripts yang lebih universal.

---

## 🚀 Quick Start

```bash
# Development
npm run docker:dev          # Start dev mode (foreground)
npm run docker:dev:up       # Start dev mode (background)
npm run docker:dev:watch    # Start with watch mode

# Production
npm run docker:prod         # Start production mode

# Stop
npm run docker:stop         # Stop containers
npm run docker:stop:all     # Stop & remove volumes
```

---

## 📋 Available Commands

### **Development Commands**

| Command                    | Description                    | Equivalent Docker Command      |
| -------------------------- | ------------------------------ | ------------------------------ |
| `npm run docker:dev`       | Start development (foreground) | `docker compose up --build`    |
| `npm run docker:dev:up`    | Start development (background) | `docker compose up -d --build` |
| `npm run docker:dev:watch` | Start with watch mode          | `docker compose watch`         |

**Examples:**

```bash
# Start development (see logs in terminal)
npm run docker:dev

# Start development (background, terminal free)
npm run docker:dev:up

# Start with hot reload watch mode
npm run docker:dev:watch
```

---

### **Production Commands**

| Command                    | Description        | Equivalent Docker Command                                 |
| -------------------------- | ------------------ | --------------------------------------------------------- |
| `npm run docker:prod`      | Start production   | `docker compose -f docker-compose.prod.yml up -d --build` |
| `npm run docker:prod:pull` | Pull latest images | `docker compose -f docker-compose.prod.yml pull`          |

**Examples:**

```bash
# Start production environment
npm run docker:prod

# Pull latest images before starting
npm run docker:prod:pull
npm run docker:prod
```

---

### **Container Management**

| Command                   | Description                              | Equivalent Docker Command          |
| ------------------------- | ---------------------------------------- | ---------------------------------- |
| `npm run docker:stop`     | Stop containers                          | `docker compose down`              |
| `npm run docker:stop:all` | Stop & remove volumes                    | `docker compose down -v`           |
| `npm run docker:restart`  | Restart containers                       | `docker compose restart`           |
| `npm run docker:status`   | Show container status                    | `docker compose ps`                |
| `npm run docker:rebuild`  | Rebuild without cache                    | `docker compose build --no-cache`  |
| `npm run docker:clean`    | Remove all (containers, volumes, images) | `docker compose down -v --rmi all` |

**Examples:**

```bash
# Stop containers (keep volumes)
npm run docker:stop

# Stop containers and remove volumes (fresh start)
npm run docker:stop:all

# Check if containers are running
npm run docker:status

# Full cleanup (WARNING: deletes everything!)
npm run docker:clean
```

---

### **Logs & Debugging**

| Command                   | Description             | Equivalent Docker Command    |
| ------------------------- | ----------------------- | ---------------------------- |
| `npm run docker:logs`     | Show all logs           | `docker compose logs -f`     |
| `npm run docker:logs:app` | Show app logs only      | `docker compose logs -f app` |
| `npm run docker:logs:db`  | Show database logs only | `docker compose logs -f db`  |

**Examples:**

```bash
# Follow all logs
npm run docker:logs

# Follow only app logs
npm run docker:logs:app

# Follow only database logs
npm run docker:logs:db
```

---

### **Shell Access**

| Command                   | Description                 | Equivalent Docker Command                    |
| ------------------------- | --------------------------- | -------------------------------------------- |
| `npm run docker:exec:app` | Open shell in app container | `docker compose exec app sh`                 |
| `npm run docker:exec:db`  | Open MySQL shell            | `docker compose exec db mysql -u root -p...` |

**Examples:**

```bash
# Access app container shell
npm run docker:exec:app
# Now you're inside the container:
ls
pwd
exit

# Access MySQL shell
npm run docker:exec:db
# Now you're in MySQL:
SHOW DATABASES;
USE ecommerce;
SHOW TABLES;
exit
```

---

### **Database Operations**

| Command                  | Description        | Equivalent Docker Command                           |
| ------------------------ | ------------------ | --------------------------------------------------- |
| `npm run docker:migrate` | Run migrations     | `docker compose exec app npx prisma migrate deploy` |
| `npm run docker:seed`    | Seed database      | `docker compose exec app npm run seed`              |
| `npm run docker:studio`  | Open Prisma Studio | `docker compose exec app npm run prisma:studio`     |
| `npm run docker:reset`   | Reset database     | `docker compose exec app npm run prisma:reset`      |

**Examples:**

```bash
# Run pending migrations
npm run docker:migrate

# Seed database with test data
npm run docker:seed

# Open Prisma Studio (GUI for database)
npm run docker:studio
# Then open: http://localhost:5555

# Reset database (WARNING: deletes all data!)
npm run docker:reset
```

---

## 📖 Complete Command Reference

### **All Available Commands:**

```bash
# Next.js Commands
npm run dev                  # Start Next.js dev server (no Docker)
npm run build                # Build Next.js app
npm run start                # Start Next.js production server
npm run lint                 # Run ESLint

# Database Commands (Local - no Docker)
npm run seed                 # Seed database
npm run clear-db             # Clear database
npm run prisma:generate      # Generate Prisma Client
npm run prisma:studio        # Open Prisma Studio
npm run prisma:migrate:status # Check migration status
npm run prisma:migrate:dev   # Create & apply migration (dev)
npm run prisma:migrate:deploy # Apply migrations (prod)
npm run prisma:reset         # Reset database

# Docker Development
npm run docker:dev           # Start dev (foreground)
npm run docker:dev:up        # Start dev (background)
npm run docker:dev:watch     # Start with watch mode

# Docker Production
npm run docker:prod          # Start production
npm run docker:prod:pull     # Pull latest images

# Docker Management
npm run docker:stop          # Stop containers
npm run docker:stop:all      # Stop & remove volumes
npm run docker:restart       # Restart containers
npm run docker:status        # Show status
npm run docker:rebuild       # Rebuild (no cache)
npm run docker:clean         # Remove everything

# Docker Logs
npm run docker:logs          # All logs
npm run docker:logs:app      # App logs only
npm run docker:logs:db       # DB logs only

# Docker Shell Access
npm run docker:exec:app      # Shell into app
npm run docker:exec:db       # MySQL shell

# Docker Database
npm run docker:migrate       # Run migrations
npm run docker:seed          # Seed database
npm run docker:studio        # Prisma Studio
npm run docker:reset         # Reset database
```

---

## 🎓 Common Workflows

### **1. Fresh Start (Development)**

```bash
# Clean everything and start fresh
npm run docker:clean
npm run docker:dev

# Or if you want background:
npm run docker:dev:up
npm run docker:logs
```

---

### **2. Daily Development**

```bash
# Start development with hot reload
npm run docker:dev:watch

# In another terminal, check logs if needed:
npm run docker:logs:app

# Access database if needed:
npm run docker:studio
```

---

### **3. Database Changes**

```bash
# After changing schema.prisma:

# 1. Create migration (local - no Docker)
npm run prisma:migrate:dev -- --name add_new_field

# 2. Apply to Docker containers
npm run docker:migrate

# 3. Verify in Prisma Studio
npm run docker:studio
```

---

### **4. Seed Database**

```bash
# Seed with test data
npm run docker:seed

# Or reset & seed (fresh data)
npm run docker:reset
```

---

### **5. Debugging Issues**

```bash
# Check container status
npm run docker:status

# View logs
npm run docker:logs

# Access container for debugging
npm run docker:exec:app
ls -la
cat .env
exit

# Restart if needed
npm run docker:restart

# Full rebuild if still issues
npm run docker:rebuild
```

---

### **6. Production Deployment**

```bash
# Pull latest code
git pull origin main

# Build and start production
npm run docker:prod

# Check if healthy
npm run docker:status
npm run docker:logs

# Run migrations if needed
npm run docker:migrate
```

---

## 🆚 Migration Guide (from docker.sh/ps1)

### **Old Commands → New Commands**

| Old (docker.sh/ps1)     | New (npm scripts)          |
| ----------------------- | -------------------------- |
| `./docker.sh dev`       | `npm run docker:dev`       |
| `./docker.sh dev:up`    | `npm run docker:dev:up`    |
| `./docker.sh dev:watch` | `npm run docker:dev:watch` |
| `./docker.sh prod`      | `npm run docker:prod`      |
| `./docker.sh stop`      | `npm run docker:stop`      |
| `./docker.sh logs`      | `npm run docker:logs`      |
| `./docker.sh exec:app`  | `npm run docker:exec:app`  |
| `./docker.sh exec:db`   | `npm run docker:exec:db`   |
| `./docker.sh migrate`   | `npm run docker:migrate`   |
| `./docker.sh seed`      | `npm run docker:seed`      |
| `./docker.sh studio`    | `npm run docker:studio`    |
| `./docker.sh reset`     | `npm run docker:reset`     |
| `./docker.sh rebuild`   | `npm run docker:rebuild`   |
| `./docker.sh restart`   | `npm run docker:restart`   |
| `./docker.sh status`    | `npm run docker:status`    |
| `./docker.sh clean`     | `npm run docker:clean`     |

---

## ✅ Benefits of NPM Scripts

### **1. Cross-Platform** 🌍

```
✅ Works on Windows, Mac, Linux
✅ No need for separate .sh and .ps1 files
✅ Same commands for all developers
```

### **2. Standard & Familiar** 📚

```
✅ Everyone knows `npm run`
✅ Documented in package.json
✅ Easy to discover with `npm run`
```

### **3. IDE Integration** 💻

```
✅ VS Code shows scripts in explorer
✅ Auto-completion in terminal
✅ Can run from GUI
```

### **4. Production Ready** 🚀

```
✅ CI/CD can use same commands
✅ No custom scripts to maintain
✅ Part of standard Node.js ecosystem
```

### **5. Composable** 🔧

```bash
# Can chain commands:
"docker:fresh": "npm run docker:clean && npm run docker:dev"

# Can use pre/post hooks:
"predocker:dev": "npm run prisma:generate"
```

---

## 🔧 Customization

### **Add Your Own Scripts:**

Edit `package.json`:

```json
{
  "scripts": {
    // Add custom workflows:
    "docker:fresh": "npm run docker:clean && npm run docker:dev",
    "docker:reset:seed": "npm run docker:reset && npm run docker:seed",
    "docker:prod:deploy": "git pull && npm run docker:prod && npm run docker:migrate"
  }
}
```

---

## 📝 Tips & Tricks

### **1. List All Available Scripts:**

```bash
npm run
```

### **2. Pass Arguments to Scripts:**

```bash
# Some scripts accept arguments:
npm run prisma:migrate:dev -- --name my_migration
```

### **3. Run Multiple Commands:**

```bash
# Sequential (&&):
npm run docker:stop && npm run docker:dev

# Parallel (with npm-run-all):
npm install -D npm-run-all
npx npm-run-all --parallel docker:dev docker:logs
```

### **4. Create Aliases (Optional):**

**Bash/Zsh (~/.bashrc or ~/.zshrc):**

```bash
alias dd="npm run docker:dev"
alias du="npm run docker:dev:up"
alias ds="npm run docker:stop"
alias dl="npm run docker:logs"
```

**PowerShell ($PROFILE):**

```powershell
function dd { npm run docker:dev }
function du { npm run docker:dev:up }
function ds { npm run docker:stop }
function dl { npm run docker:logs }
```

---

## 🚨 Important Notes

### **Environment Variables:**

Some commands need environment variables from `.env`:

```bash
# Make sure .env exists:
cp .env.example .env

# Edit with your values:
# MYSQL_ROOT_PASSWORD=your_password
# DATABASE_URL=mysql://...
```

### **Docker Must Be Running:**

All `docker:*` commands require Docker Desktop to be running:

```bash
# Check if Docker is running:
docker --version
docker compose version

# Start Docker Desktop if needed
```

### **Network & Ports:**

Make sure these ports are free:

- `3000` - Next.js app
- `3306` - MySQL database
- `5555` - Prisma Studio

---

## 📚 Related Documentation

- [DOCKER_QUICK_START.md](./DOCKER_QUICK_START.md) - Quick start guide
- [DOCKER_SETUP.md](./DOCKER_SETUP.md) - Complete Docker setup
- [PRODUCTION_DECISION_GUIDE.md](./PRODUCTION_DECISION_GUIDE.md) - Production scripts analysis

---

## ✅ Summary

**Before (with docker.sh/ps1):**

```bash
./docker.sh dev      # Linux/Mac
.\docker.ps1 dev     # Windows
```

**Now (with npm scripts):**

```bash
npm run docker:dev   # ✅ Works everywhere!
```

**Benefits:**

- ✅ Cross-platform (Windows, Mac, Linux)
- ✅ Standard npm commands
- ✅ No separate script files to maintain
- ✅ Better IDE integration
- ✅ Production-ready (CI/CD compatible)

**Total Commands Available:** 32 npm scripts for all Docker operations! 🎉
