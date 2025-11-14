# 🚀 Dev Containers - Quick Reference Card

> **Quick cheatsheet untuk daily workflow dengan Dev Containers**

---

## ⚡ Getting Started

### First Time Setup

```
1. Install Docker Desktop
2. Install VS Code extension: "Dev Containers"
3. F1 → "Dev Containers: Reopen in Container"
4. Wait ~5-10 minutes
5. npm run dev:docker
```

---

## 🎯 Daily Commands

### Start Development

```bash
npm run dev:docker          # Start Next.js dev server
```

### Database Operations

```bash
npm run seed                # Seed database
npm run prisma:studio       # GUI for database
npm run prisma:migrate:dev  # Create migration
npm run prisma:reset        # Reset database
```

### Build & Test

```bash
npm run build              # Production build
npm run lint               # Run linting
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut        | Action          |
| --------------- | --------------- |
| `F1`            | Command Palette |
| `F5`            | Start Debugging |
| `Ctrl+Shift+P`  | Command Palette |
| `Ctrl+Shift+\`` | New Terminal    |
| `Ctrl+Shift+5`  | Split Terminal  |
| `Ctrl+,`        | Settings        |

---

## 🔧 Quick Tasks (F1 → Tasks)

- 🚀 **Start Dev Server** - Launch Next.js
- 🗄️ **Prisma Studio** - Database GUI
- 🔄 **Prisma Migrate Dev** - Run migrations
- 🌱 **Seed Database** - Populate data
- 🔄 **Reset Database** - Clean start

---

## 🌐 Port Access

| Port | Service       | URL                   |
| ---- | ------------- | --------------------- |
| 3000 | Next.js       | http://localhost:3000 |
| 3306 | MySQL         | localhost:3306        |
| 5555 | Prisma Studio | http://localhost:5555 |

---

## 🐛 Troubleshooting Quick Fixes

### Build Error

```
F1 → "Dev Containers: Rebuild Container"
```

### Port in Use

```bash
npm run docker:stop  # Stop other containers
```

### Hot Reload Not Working

```bash
# Restart dev server
Ctrl+C → npm run dev:docker
```

### Database Connection Error

```bash
# Check database
docker compose -f .devcontainer/docker-compose.devcontainer.yml logs db
```

---

## 📦 Extensions (Auto-Installed)

✅ ESLint  
✅ Prettier  
✅ Tailwind CSS IntelliSense  
✅ Prisma  
✅ Docker  
✅ GitHub Copilot  
✅ Error Lens  
✅ Auto Rename Tag

---

## 💡 Pro Tips

1. **Multiple Terminals** - Run dev server & Prisma Studio simultaneously
2. **Use Tasks** - Faster than typing commands
3. **Debugging** - Set breakpoint → F5 → Done!
4. **Git Works** - Commit/push normally
5. **Terminal**: Zsh with Oh My Zsh (better than sh)

---

## 📚 Full Documentation

👉 [DEV_CONTAINERS_GUIDE.md](./DEV_CONTAINERS_GUIDE.md)

---

## 🆘 Need Help?

1. Check [DEV_CONTAINERS_GUIDE.md](./DEV_CONTAINERS_GUIDE.md) - Comprehensive guide
2. Check [DEV_CONTAINERS_MIGRATION_SUMMARY.md](./DEV_CONTAINERS_MIGRATION_SUMMARY.md) - Migration info
3. Ask team members
4. Check Docker logs

---

**Quick Start**: `F1` → `Dev Containers: Reopen in Container` → `npm run dev:docker` → 🚀
