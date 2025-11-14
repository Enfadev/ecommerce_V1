# E-Commerce Test - Next.js

Ini adalah project e-commerce berbasis [Next.js](https://nextjs.org) dengan dark mode sebagai tema utama. Website ini memiliki beberapa fitur utama seperti katalog produk, wishlist, keranjang belanja, checkout, riwayat pesanan, dan halaman admin untuk pengelolaan produk.

## Daftar Halaman & Navigasi

- [Beranda](https://localhost:3000/) (`/`)
- [Produk](https://localhost:3000/product) (`/product`)
- [Detail Produk](https://localhost:3000/product/[slug]) (`/product/[slug]`)
- [Wishlist](https://localhost:3000/wishlist) (`/wishlist`)
- [Keranjang & Checkout](https://localhost:3000/checkout) (`/checkout`)
- [Riwayat Pesanan](https://localhost:3000/order-history) (`/order-history`)
- [Profil](https://localhost:3000/profile) (`/profile`)
- [Sign In](https://localhost:3000/signin) (`/signin`)
- [Register](https://localhost:3000/register) (`/register`)
- [Admin Produk](https://localhost:3000/admin/product) (`/admin/product`)
- [Tentang](https://localhost:3000/about) (`/about`)
- [FAQ](https://localhost:3000/faq) (`/faq`)
- [Kontak](https://localhost:3000/kontak) (`/kontak`)

## Fitur Utama

- Katalog produk dengan filter
- Wishlist produk
- Keranjang belanja & ringkasan pesanan
- Checkout dengan form validasi
- Riwayat pesanan
- Halaman admin untuk tambah/edit produk
- Dark mode sebagai default
- Responsive & modern UI

## Stack & Library

- Next.js App Router
- Tailwind CSS (dark mode enabled)
- Komponen UI: shadcn/ui (lihat di `src/components/ui/`)
- State management: Context API (cart, wishlist)
- Form: React Hook Form + Zod
- Data dummy: `src/data/products.ts`

## 🚀 Quick Start

### Environment Setup (Wajib!)

Sebelum menjalankan aplikasi, setup environment variables terlebih dahulu:

```powershell
# Windows PowerShell
.\setup-env.ps1 local

# Linux/Mac
./setup-env.sh local
```

Atau manual:

```bash
# Copy file environment
cp .env.local .env
```

**Dokumentasi lengkap:** [ENV_GUIDE.md](./ENV_GUIDE.md) | [Quick Reference](./ENV_QUICK_REF.md)

---

## Cara Menjalankan

### Option 1: Dev Containers (VS Code - Recommended) 🆕

Cara paling modern untuk development dengan VS Code:

1. **Prerequisites:**
   - Install Docker Desktop
   - Install VS Code extension: "Dev Containers"
2. **Quick Start:**
   - Buka project di VS Code
   - Tekan `F1` → pilih "Dev Containers: Reopen in Container"
   - Tunggu setup selesai (pertama kali ~5-10 menit)
   - Jalankan `npm run dev:docker` di terminal

3. **Fitur:**
   - ✅ Environment konsisten untuk semua developer
   - ✅ Extensions & settings auto-install
   - ✅ Hot reload berfungsi sempurna
   - ✅ Database & migrations auto-setup
   - ✅ Integrated terminal & debugging

**Dokumentasi lengkap:** [DEV_CONTAINERS_GUIDE.md](./documentations/DEV_CONTAINERS_GUIDE.md)

---

### Option 2: Docker Compose (CLI)

Cara termudah untuk menjalankan aplikasi lengkap dengan database:

1. Pastikan Docker Desktop sudah terinstall dan berjalan
2. Copy environment variables:
   ```powershell
   Copy-Item .env.example .env
   ```
3. Edit file `.env` sesuai kebutuhan
4. Jalankan dengan npm scripts:

   ```bash
   # Development mode dengan watch (hot reload)
   npm run docker:dev:watch

   # Atau development biasa (background)
   npm run docker:dev:up

   # Atau development (foreground dengan logs)
   npm run docker:dev
   ```

5. Akses aplikasi di [http://localhost:3000](http://localhost:3000)

**Docker Commands:**

```bash
npm run docker:dev          # Start development (foreground)
npm run docker:dev:up       # Start development (background)
npm run docker:dev:watch    # Start dengan hot reload
npm run docker:stop         # Stop containers
npm run docker:logs         # Show all logs
npm run docker:logs:app     # Show app logs only
npm run docker:migrate      # Run migrations
npm run docker:seed         # Seed database
npm run docker:studio       # Open Prisma Studio
npm run docker:status       # Show container status
npm run docker:restart      # Restart containers
npm run docker:exec:app     # Shell into app container
```

Dokumentasi lengkap: [NPM_SCRIPTS_DOCUMENTATION.md](./documentations/NPM_SCRIPTS_DOCUMENTATION.md) | [DOCKER_SETUP.md](./documentations/DOCKER_SETUP.md)

---

### Option 3: Local Development

1. Install dependencies:
   ```bash
   npm install
   # atau
   yarn install
   ```
2. Setup database (lihat bagian "Database & Prisma" di bawah)
3. Jalankan development server:
   ```bash
   npm run dev
   # atau
   yarn dev
   ```
4. Buka [http://localhost:3000](http://localhost:3000) di browser.

## Database & Prisma (MySQL)

Project ini menggunakan Prisma dengan provider MySQL. Pastikan MySQL berjalan dan environment variable `DATABASE_URL` tersedia.

### 1) Siapkan Environment Variables

Pilih salah satu:

- Buat file `.env` di root project:

  ```bash
  DATABASE_URL="mysql://root:@localhost:3306/ecommerce_db_v1"
  NODE_ENV="development"
  JWT_SECRET="dev-secret-change-this"
  ```

- Atau set sementara di Windows (cmd) sebelum menjalankan perintah:

  ```bash
  set DATABASE_URL=mysql://root:@localhost:3306/ecommerce_db_v1
  ```

Catatan: Sesuaikan user/password/host/port/nama database dengan environment Anda. Jika perlu, buat database di MySQL: `CREATE DATABASE ecommerce_db_v1;`.

### 2) Skrip yang Tersedia

Berikut skrip npm untuk membantu proses Prisma:

- `npm run prisma:migrate:status` — melihat status migrasi di DB target
- `npm run prisma:migrate:dev` — (development) membuat migrasi baru dari perubahan schema dan menerapkannya
- `npm run prisma:migrate:deploy` — (deploy/production) menerapkan migrasi yang sudah ada tanpa membuat yang baru
- `npm run prisma:generate` — generate Prisma Client
- `npm run prisma:studio` — membuka Prisma Studio (GUI untuk data)
- `npm run prisma:reset` — reset database (drop + apply semua migrasi) lalu menjalankan seed

### 3) Jalankan Migrasi

Development (membuat & menerapkan migrasi baru jika ada perubahan pada `prisma/schema.prisma`):

```bash
npm run prisma:migrate:dev
```

Deploy/Production (hanya menerapkan migrasi yang sudah ada):

```bash
npm run prisma:migrate:deploy
```

Lihat status migrasi:

```bash
npm run prisma:migrate:status
```

### 4) Seed Data (opsional)

Project ini menyertakan `prisma/seed.js`:

```bash
npm run seed
```

Atau reset DB bersih lalu seed ulang:

```bash
npm run prisma:reset
```

### 5) Prisma Studio (opsional)

```bash
npm run prisma:studio
```

### Troubleshooting Cepat

- Missing `DATABASE_URL`: pastikan `.env` atau sudah `set DATABASE_URL=...` di terminal yang sama.
- Error koneksi (ECONNREFUSED/ER_ACCESS_DENIED_ERROR): cek host/port/user/password MySQL, dan pastikan database ada.
- Hak akses membuat skema/tabel: gunakan user MySQL dengan hak CREATE/ALTER/TABLE.

### Troubleshooting Docker Issues

**Error: Permission Denied (P1010, P3018)**

Jika Anda mendapat error database permission:

```
Error: P1010 - User was denied access
Error: P3018 - ALTER command denied
```

**Quick Fix:**

```powershell
# Grant permissions
npm run docker:grant

# Reset database
npx prisma migrate reset --force

# Restart containers
docker compose restart
```

📖 **Panduan Lengkap**: Lihat [QUICK_FIX_DOCKER.md](./QUICK_FIX_DOCKER.md) untuk troubleshooting lengkap.

**Other Docker Issues:**

- Container restart loop → Cek logs: `docker compose logs app`
- Database connection error → Verifikasi `.env` configuration
- Migration fails → Lihat [PRISMA_SHADOW_DB_FIX.md](./documentations/PRISMA_SHADOW_DB_FIX.md)

### Catatan Production

- Gunakan `npm run prisma:migrate:deploy` di lingkungan production/CI.
- Simpan environment variables melalui platform hosting (bukan file `.env`).
- Ganti `JWT_SECRET` dengan nilai kuat dan rahasiakan.

## Struktur Folder Penting

- `src/app/` - Routing & halaman utama
- `src/components/` - Komponen utama & UI
- `src/data/` - Data dummy produk
- `src/hooks/` - Custom hooks
- `src/lib/` - Utility functions
- `documentations/` - Semua dokumentasi project

## 📚 Documentation

Semua dokumentasi project tersedia di folder **[documentations/](./documentations/)**

### Quick Links:

- **[Documentation Index](./documentations/INDEX.md)** - Katalog lengkap semua dokumentasi
- **[Docker Quick Start](./documentations/DOCKER_QUICK_START.md)** - Panduan cepat Docker setup
- **[Docker Setup Guide](./documentations/DOCKER_SETUP.md)** - Panduan lengkap Docker
- **[Feature Documentation](./documentations/)** - Dokumentasi fitur-fitur

### Categories:

- 🐳 **Docker** - Complete Docker documentation (10 files)
- 🛒 **E-commerce Features** - Product, cart, checkout docs
- 💬 **Chat System** - Chat and messaging documentation
- 🔐 **Admin & Security** - Admin panel and security docs
- 📊 **Analytics** - Analytics and monitoring
- 🔧 **Integration** - OAuth, PayPal, SEO guides
- 🧪 **Testing** - Test documentation and reports

[**→ Browse All Documentation**](./documentations/INDEX.md)

## Catatan

- Semua tampilan default dark mode.
- Dokumentasi lengkap tersedia di folder `documentations/`
- Untuk Docker setup, lihat [DOCKER_QUICK_START.md](./documentations/DOCKER_QUICK_START.md)

---

_Project ini dibuat untuk kebutuhan demo dan pengembangan fitur e-commerce modern berbasis Next.js._
