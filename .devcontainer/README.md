# Dev Container Configuration

This folder contains the configuration for VS Code Dev Containers.

## 📁 Files

- **devcontainer.json** - Main configuration file
- **docker-compose.devcontainer.yml** - Docker Compose setup for dev container
- **.env.example** - Environment variables template
- **.gitignore** - Git ignore rules

## 🚀 Quick Start

1. Install Docker Desktop
2. Install VS Code "Dev Containers" extension
3. Open this project in VS Code
4. Press `F1` → "Dev Containers: Reopen in Container"
5. Wait for setup to complete
6. Run `npm run dev:docker` to start development server

## 📚 Full Documentation

See [DEV_CONTAINERS_GUIDE.md](../documentations/DEV_CONTAINERS_GUIDE.md) for complete guide.

## ⚙️ What's Included

- ✅ Node.js 20 Alpine
- ✅ MySQL 8.0 database
- ✅ All VS Code extensions pre-installed
- ✅ Zsh with Oh My Zsh
- ✅ Hot reload support
- ✅ Prisma Client auto-generated
- ✅ Database migrations auto-run

## 🔧 Customization

Edit `devcontainer.json` to customize:

- Add/remove VS Code extensions
- Change VS Code settings
- Add post-create commands
- Configure port forwarding
