# Dev Containers Setup Guide

## 📋 Daftar Isi

- [Pendahuluan](#pendahuluan)
- [Prerequisites](#prerequisites)
- [Setup Awal](#setup-awal)
- [Cara Menggunakan](#cara-menggunakan)
- [Fitur Dev Container](#fitur-dev-container)
- [Troubleshooting](#troubleshooting)
- [Tips & Tricks](#tips--tricks)

---

## 🎯 Pendahuluan

Dev Containers adalah fitur VS Code yang memungkinkan Anda bekerja di dalam container Docker yang sudah dikonfigurasi dengan lengkap. Ini memberikan:

- ✅ **Environment konsisten** - Semua developer menggunakan environment yang sama
- ✅ **Setup otomatis** - Extensions, settings, dan tools terinstall otomatis
- ✅ **Isolasi penuh** - Tidak mempengaruhi sistem lokal Anda
- ✅ **Hot reload** - Perubahan code langsung terdeteksi
- ✅ **Terintegrasi penuh** - Terminal, debugging, dan Git bekerja seamless

---

## 📦 Prerequisites

### 1. Install Docker Desktop

- **Windows**: [Download Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
- **Mac**: [Download Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/)
- **Linux**: Install Docker Engine + Docker Compose

### 2. Install VS Code Extensions

Buka VS Code dan install extension ini:

- **Dev Containers** (ms-vscode-remote.remote-containers)

### 3. System Requirements

- RAM: Minimal 8GB, recommended 16GB
- Disk: Minimal 10GB free space
- Docker Desktop harus running

---

## 🚀 Setup Awal

### Langkah 1: Clone Repository

```bash
git clone <repository-url>
cd ecommerce_V1
```

### Langkah 2: Setup Environment Variables

```bash
# Copy file .env.example ke .env di root project
cp .env.example .env

# Edit .env sesuai kebutuhan
# Minimal yang perlu diisi:
# - NEXTAUTH_SECRET (generate dengan: openssl rand -base64 32)
```

### Langkah 3: Buka di Dev Container

**Cara 1: Melalui Command Palette**

1. Buka VS Code
2. Tekan `F1` atau `Ctrl+Shift+P` (Windows/Linux) / `Cmd+Shift+P` (Mac)
3. Ketik dan pilih: **"Dev Containers: Reopen in Container"**
4. Tunggu proses build selesai (pertama kali bisa 5-10 menit)

**Cara 2: Melalui Notifikasi**

1. Buka folder project di VS Code
2. VS Code akan mendeteksi `.devcontainer/devcontainer.json`
3. Klik **"Reopen in Container"** pada notifikasi yang muncul

---

## 💻 Cara Menggunakan

### Pertama Kali Membuka Dev Container

Setelah container siap, otomatis akan menjalankan:

1. ✅ `npm install` - Install dependencies
2. ✅ `npx prisma generate` - Generate Prisma Client
3. ✅ `npx prisma migrate deploy` - Jalankan migrasi database

### Menjalankan Development Server

Dev Container **TIDAK** otomatis menjalankan dev server. Anda harus jalankan manual:

```bash
# Di terminal VS Code (sudah di dalam container)
npm run dev:docker
```

Atau buat task di VS Code untuk kemudahan.

### Port yang Tersedia

Secara otomatis, port berikut di-forward:

- **3000** - Next.js Application (http://localhost:3000)
- **3306** - MySQL Database
- **5555** - Prisma Studio (jalankan dengan `npm run prisma:studio`)

### Database Management

```bash
# Jalankan migrasi
npx prisma migrate dev

# Seed database
npm run seed

# Prisma Studio (GUI untuk database)
npm run prisma:studio

# Reset database
npm run prisma:reset
```

### Git Operations

Git bekerja normal di dalam Dev Container:

```bash
git status
git add .
git commit -m "Your message"
git push
```

---

## 🎨 Fitur Dev Container

### Extensions yang Otomatis Terinstall

Dev Container sudah dikonfigurasi dengan extensions berikut:

- ✅ **ESLint** - Linting
- ✅ **Prettier** - Code formatting
- ✅ **Tailwind CSS IntelliSense** - Autocomplete Tailwind
- ✅ **Prisma** - Syntax highlighting untuk schema
- ✅ **Docker** - Docker file support
- ✅ **GitHub Copilot** - AI pair programming
- ✅ **Auto Rename Tag** - Auto rename HTML/JSX tags
- ✅ **Path Intellisense** - Autocomplete file paths
- ✅ **Error Lens** - Inline error messages
- ✅ **Code Spell Checker** - Spell checking

### Settings yang Otomatis Dikonfigurasi

- ✅ Format on save (Prettier)
- ✅ ESLint auto-fix on save
- ✅ Tailwind CSS class sorting
- ✅ Prisma formatter
- ✅ Terminal default: Zsh dengan Oh My Zsh

### Hot Reload

Code changes akan langsung terdeteksi dan aplikasi reload otomatis berkat:

- File watching dengan polling
- Volume mounting yang optimal
- Turbopack untuk build cepat

---

## 🐛 Troubleshooting

### Container Build Gagal

**Problem**: Error saat build container

```bash
# Solusi 1: Rebuild tanpa cache
# Tekan F1 → "Dev Containers: Rebuild Container"

# Solusi 2: Clean Docker images
docker system prune -a
# Lalu rebuild container
```

### Port Already in Use

**Problem**: Port 3000 atau 3306 sudah dipakai

```bash
# Cek process yang pakai port
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000

# Stop container lain yang pakai port tersebut
docker ps
docker stop <container-id>
```

### Hot Reload Tidak Berfungsi

**Problem**: Perubahan code tidak terdeteksi

```bash
# Pastikan environment variables sudah di-set
# Cek di devcontainer.json:
"containerEnv": {
  "WATCHPACK_POLLING": "true",
  "CHOKIDAR_USEPOLLING": "true"
}

# Jika masih tidak work, restart dev server
# Ctrl+C di terminal, lalu jalankan lagi:
npm run dev:docker
```

### Database Connection Error

**Problem**: Cannot connect to MySQL

**Solusi 1: Tunggu database selesai initialize**

```bash
# Check database health
docker compose ps

# Lihat logs database
docker compose logs db
```

**Solusi 2: Verify environment variables**

```bash
# Pastikan .env ada dan berisi:
DATABASE_URL="mysql://ecommerce_user:ecommerce_password@db:3306/ecommerce"
```

**Solusi 3: Grant permissions manually**

```bash
# Masuk ke database container
docker compose exec db mysql -u root -prootpassword

# Jalankan grant permissions
GRANT ALL PRIVILEGES ON *.* TO 'ecommerce_user'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
EXIT;
```

### Prisma Generate Error

**Problem**: Error saat generate Prisma Client

```bash
# Solusi: Re-generate Prisma Client
npx prisma generate

# Jika masih error, hapus node_modules dan reinstall
rm -rf node_modules
npm install
npx prisma generate
```

### Out of Memory

**Problem**: Container kehabisan memory

```bash
# Increase Docker memory limit di Docker Desktop settings
# Recommended: 4GB minimal, 8GB optimal

# Atau restart Docker Desktop
```

---

## 💡 Tips & Tricks

### 1. Quick Commands dengan Tasks

Buat file `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Dev Server",
      "type": "shell",
      "command": "npm run dev:docker",
      "isBackground": true,
      "problemMatcher": []
    },
    {
      "label": "Prisma Studio",
      "type": "shell",
      "command": "npm run prisma:studio",
      "isBackground": true
    }
  ]
}
```

Jalankan dengan: `F1` → `Tasks: Run Task`

### 2. Multiple Terminal Sessions

Dev Container mendukung multiple terminals:

- Split terminal: `Ctrl+Shift+5`
- New terminal: `Ctrl+Shift+\``
- Bisa jalankan dev server di satu terminal, Prisma Studio di terminal lain

### 3. Git Configuration

Git config dari host otomatis di-share ke container. Tapi jika perlu set manual:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 4. Debugging

VS Code debugging works di Dev Container:

1. Set breakpoint di code
2. Tekan `F5` atau jalankan debug configuration
3. Debugging experience sama seperti development lokal

### 5. Extend Container dengan Custom Scripts

Edit `devcontainer.json` untuk tambah custom commands:

```json
{
  "postCreateCommand": "npm install && npx prisma generate",
  "postStartCommand": "npx prisma migrate deploy || true",
  "postAttachCommand": "echo 'Container ready! Run: npm run dev:docker'"
}
```

### 6. Performance Optimization

Untuk performance optimal:

```json
// di devcontainer.json, gunakan cached mount
"mounts": [
  "source=${localWorkspaceFolder},target=/workspace,type=bind,consistency=cached"
]
```

### 7. Access Container dari Terminal Luar

Jika perlu akses container dari luar VS Code:

```bash
# List running containers
docker ps

# Execute command
docker compose exec app npm run seed

# Shell access
docker compose exec app sh
```

---

## 🔄 Migrasi dari Docker Compose Biasa

### Perbedaan dengan Setup Lama

| Feature             | Docker Compose Lama | Dev Containers  |
| ------------------- | ------------------- | --------------- |
| VS Code Integration | ❌ Manual           | ✅ Otomatis     |
| Extensions          | ❌ Install manual   | ✅ Auto-install |
| Terminal            | ❌ Separate         | ✅ Integrated   |
| Debugging           | ⚠️ Complex          | ✅ Built-in     |
| Hot Reload          | ✅ Ya               | ✅ Ya           |
| Port Forwarding     | ⚠️ Manual           | ✅ Otomatis     |

### Setup Lama Masih Bisa Dipakai

Docker Compose files lama (`docker-compose.yml`) masih bisa digunakan untuk:

- Production deployment
- CI/CD pipelines
- Team members yang tidak pakai VS Code

### Command Mapping

| Old Command               | Dev Container Equivalent                     |
| ------------------------- | -------------------------------------------- |
| `npm run docker:dev`      | Open in Dev Container + `npm run dev:docker` |
| `npm run docker:stop`     | Close Dev Container window                   |
| `npm run docker:logs:app` | VS Code integrated terminal                  |
| `npm run docker:exec:app` | Sudah di dalam container                     |

---

## 📚 Resources

### Official Documentation

- [VS Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers)
- [Dev Container Specification](https://containers.dev/)
- [Docker Documentation](https://docs.docker.com/)

### Tutorial Videos

- [VS Code Dev Containers Tutorial](https://www.youtube.com/watch?v=Uvf2FVS1F8k)
- [Docker for Developers](https://www.youtube.com/watch?v=gAkwW2tuIqE)

### Community

- [VS Code Dev Containers GitHub](https://github.com/microsoft/vscode-dev-containers)
- [Docker Community Forums](https://forums.docker.com/)

---

## 🎓 Next Steps

Setelah setup Dev Container berhasil:

1. ✅ **Explore Extensions** - Coba fitur-fitur extension yang sudah terinstall
2. ✅ **Setup Database** - Jalankan migration dan seed data
3. ✅ **Start Development** - Mulai coding dengan hot reload
4. ✅ **Commit Changes** - Git works normal di Dev Container
5. ✅ **Share dengan Team** - Team members tinggal reopen in container

---

## ❓ FAQ

**Q: Apakah Dev Container wajib digunakan?**  
A: Tidak. Setup Docker Compose biasa masih bisa digunakan. Dev Container hanya memberikan developer experience yang lebih baik.

**Q: Apakah bisa switch antara Dev Container dan local development?**  
A: Ya. Tutup Dev Container window dan buka folder secara normal.

**Q: Bagaimana jika team member tidak pakai VS Code?**  
A: Mereka bisa pakai docker-compose.yml biasa. Kedua setup bisa coexist.

**Q: Apakah data database aman saat restart container?**  
A: Ya. Database menggunakan persistent volume, data tidak hilang.

**Q: Bagaimana cara update Dev Container configuration?**  
A: Edit `.devcontainer/devcontainer.json`, lalu rebuild container (`F1` → `Dev Containers: Rebuild Container`).

---

## 📝 Changelog

### v1.0.0 (2025-10-07)

- ✅ Initial Dev Container setup
- ✅ Docker Compose configuration untuk dev container
- ✅ VS Code extensions dan settings
- ✅ Hot reload support
- ✅ Prisma dan database integration
- ✅ Complete documentation

---

**Happy Coding! 🚀**
