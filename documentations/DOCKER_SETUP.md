# Docker Setup Guide

Dokumentasi lengkap untuk menjalankan aplikasi E-Commerce menggunakan Docker.

## Prerequisites

- Docker Desktop (Windows/Mac) atau Docker Engine (Linux)
- Docker Compose V2 (sudah termasuk di Docker Desktop)

## Quick Start

### 1. Setup Environment Variables

Copy file `.env.example` menjadi `.env` dan isi dengan konfigurasi yang sesuai:

```powershell
Copy-Item .env.example .env
```

Edit file `.env` dan sesuaikan nilai-nilai konfigurasi.

### 2. Development Mode

Jalankan aplikasi dalam mode development dengan hot reload:

```powershell
# Build dan jalankan containers
docker compose up --build

# Atau jalankan di background
docker compose up -d --build
```

Aplikasi akan tersedia di: http://localhost:3000

### 3. Production Mode

Jalankan aplikasi dalam mode production:

```powershell
docker compose -f docker-compose.prod.yml up --build -d
```

## Docker Watch Mode

Docker Compose sudah dikonfigurasi dengan `develop.watch` untuk hot reload otomatis:

- **Sync**: Perubahan di folder `./src` akan langsung disinkronkan ke container
- **Rebuild**: Perubahan di `package.json` akan trigger rebuild container

Untuk mengaktifkan watch mode:

```powershell
docker compose watch
```

## Database Management

### Migrate Database

```powershell
# Masuk ke container app
docker compose exec app sh

# Jalankan migration
npx prisma migrate deploy

# Atau buat migration baru
npx prisma migrate dev --name migration_name
```

### Seed Database

```powershell
docker compose exec app npm run seed
```

### Prisma Studio

```powershell
docker compose exec app npm run prisma:studio
```

Buka browser: http://localhost:5555

### Reset Database

```powershell
docker compose exec app npm run prisma:reset
```

## Useful Commands

### Lihat Logs

```powershell
# Semua services
docker compose logs -f

# Specific service
docker compose logs -f app
docker compose logs -f db
```

### Stop Containers

```powershell
docker compose down
```

### Stop dan Hapus Volumes

```powershell
docker compose down -v
```

### Rebuild Containers

```powershell
docker compose up --build
```

### Restart Services

```powershell
docker compose restart
```

### Exec ke Container

```powershell
# App container
docker compose exec app sh

# Database container
docker compose exec db bash
```

## File Structure

```
├── Dockerfile                 # Multi-stage Dockerfile untuk dev & prod
├── docker-compose.yml         # Development configuration
├── docker-compose.prod.yml    # Production configuration
├── .dockerignore              # Files yang diabaikan saat build
└── .env                       # Environment variables
```

## Environment Variables

### Required Variables

- `DATABASE_URL`: Connection string untuk Prisma
- `NEXTAUTH_SECRET`: Secret key untuk NextAuth
- `NEXTAUTH_URL`: URL aplikasi

### Optional Variables

- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Google OAuth
- `STRIPE_SECRET_KEY` & `STRIPE_PUBLISHABLE_KEY`: Stripe payment
- `PAYPAL_CLIENT_ID` & `PAYPAL_CLIENT_SECRET`: PayPal payment

## Troubleshooting

### Port sudah digunakan

Jika port 3000 atau 3306 sudah digunakan, ubah di file `.env`:

```env
APP_PORT=3001
DB_PORT=3307
```

### Database connection error

Pastikan database sudah healthy sebelum app start. Docker compose sudah dikonfigurasi dengan healthcheck.

### Hot reload tidak bekerja

Pastikan menggunakan `docker compose watch` atau restart container:

```powershell
docker compose restart app
```

### Permission issues (Linux/Mac)

Jika ada masalah permission, set ownership:

```bash
sudo chown -R $USER:$USER .
```

## Production Deployment

### 1. Update Environment Variables

Edit `.env` dengan nilai production:

```env
NODE_ENV=production
NEXTAUTH_URL=https://yourdomain.com
DB_ROOT_PASSWORD=strong-password
DB_PASSWORD=strong-password
# ... other production values
```

### 2. Build Production Image

```powershell
docker compose -f docker-compose.prod.yml build
```

### 3. Run Production Containers

```powershell
docker compose -f docker-compose.prod.yml up -d
```

### 4. Run Migrations

```powershell
docker compose -f docker-compose.prod.yml exec app npx prisma migrate deploy
```

### 5. Seed Data (Optional)

```powershell
docker compose -f docker-compose.prod.yml exec app npm run seed
```

## Advanced Configuration

### Custom Network

Jika ingin menggunakan external network:

```yaml
networks:
  ecommerce_network:
    external: true
    name: your_network_name
```

### Volume Backup

Backup database volume:

```powershell
docker run --rm -v ecommerce_v1_db_data:/data -v ${PWD}:/backup alpine tar czf /backup/db_backup.tar.gz -C /data .
```

Restore database volume:

```powershell
docker run --rm -v ecommerce_v1_db_data:/data -v ${PWD}:/backup alpine tar xzf /backup/db_backup.tar.gz -C /data
```

## Notes

- Development mode menggunakan `npm run dev` dengan Turbopack
- Production mode menggunakan Next.js standalone output untuk performa optimal
- Database data disimpan di Docker volume untuk persistence
- Hot reload aktif di development mode dengan watch configuration
