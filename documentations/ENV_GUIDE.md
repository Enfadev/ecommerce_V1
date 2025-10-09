# Environment Configuration Guide

File ini menjelaskan cara menggunakan konfigurasi environment untuk local development dan production.

## 📁 File yang Tersedia

- **`.env.local`** - Untuk development di local machine
- **`.env.prod`** - Untuk production deployment
- **`.env.example`** - Template umum (reference)
- **`.env.production.example`** - Template production (reference)

## 🚀 Quick Setup

### Local Development

```bash
# Copy file local
cp .env.local .env

# Atau langsung jalankan dengan .env.local
npm run dev
# atau
npm run dev:docker
```

### Production Deployment

```bash
# Copy file production
cp .env.prod .env.production

# Edit dan ganti semua nilai
nano .env.production

# Set permission (Linux/Mac)
chmod 600 .env.production

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 🔧 Konfigurasi Local (.env.local)

File `.env.local` sudah berisi nilai default yang siap pakai untuk development:

- ✅ Database: MySQL via Docker atau Laragon
- ✅ Port: 3000 (default Next.js)
- ✅ Test credentials untuk Stripe & PayPal
- ✅ Development OAuth credentials

**Langkah:**

1. Copy `.env.local` menjadi `.env`
2. Jalankan aplikasi dengan `npm run dev` atau `npm run dev:docker`
3. Akses di `http://localhost:3000`

## 🌐 Konfigurasi Production (.env.prod)

File `.env.prod` berisi template untuk production yang **WAJIB** diubah:

### Checklist Wajib:

- [ ] **Database Passwords** - Ganti `DB_ROOT_PASSWORD` dan `DB_PASSWORD`
- [ ] **Secrets** - Generate `NEXTAUTH_SECRET` dan `JWT_SECRET`
- [ ] **Domain** - Update `NEXTAUTH_URL` dan `NEXT_PUBLIC_BASE_URL`
- [ ] **Google OAuth** - Gunakan production credentials
- [ ] **Stripe** - Gunakan LIVE mode (`pk_live_...`, `sk_live_...`)
- [ ] **PayPal** - Gunakan LIVE mode (bukan sandbox)
- [ ] **Security** - Set file permission `chmod 600`

### Generate Secrets:

```bash
# Generate NEXTAUTH_SECRET (32 chars)
openssl rand -base64 32

# Generate JWT_SECRET (48 chars)
openssl rand -base64 48

# Atau gunakan website
# https://generate-secret.vercel.app/32
```

## 📋 Perbedaan Local vs Production

| Aspek        | Local (.env.local) | Production (.env.prod) |
| ------------ | ------------------ | ---------------------- |
| **Database** | localhost/Docker   | External/Managed DB    |
| **Domain**   | localhost:3000     | https://yourdomain.com |
| **Stripe**   | Test mode          | Live mode              |
| **PayPal**   | Sandbox            | Live                   |
| **Secrets**  | Weak (OK)          | Strong (WAJIB)         |
| **NODE_ENV** | development        | production             |

## ⚠️ Keamanan

### DO:

✅ Simpan `.env.prod` dengan aman  
✅ Gunakan password minimal 24 karakter  
✅ Generate secrets dengan tool kripto  
✅ Set file permission `chmod 600`  
✅ Backup `.env.prod` terenkripsi  
✅ Gunakan secrets manager jika tersedia

### DON'T:

❌ JANGAN commit `.env`, `.env.local`, atau `.env.prod` ke Git  
❌ JANGAN share credentials di chat/email  
❌ JANGAN gunakan password default  
❌ JANGAN gunakan test keys di production

## 🔄 Workflow Development

```bash
# 1. Setup awal
cp .env.local .env

# 2. Jalankan dengan Docker
npm run dev:docker

# 3. Atau tanpa Docker (pastikan MySQL running)
npm run dev

# 4. Akses aplikasi
open http://localhost:3000
```

## 🚢 Workflow Production

```bash
# 1. Prepare environment file
cp .env.prod .env.production

# 2. Edit values (WAJIB!)
nano .env.production

# 3. Upload ke server
scp .env.production user@server:/path/to/app/

# 4. Di server, set permission
ssh user@server
cd /path/to/app
chmod 600 .env.production

# 5. Deploy dengan Docker
docker-compose -f docker-compose.prod.yml up -d

# 6. Run migrations
npm run prisma:migrate:deploy

# 7. Verify
curl https://yourdomain.com/api/health
```

## 📚 Dokumentasi Terkait

- [PRODUCTION_QUICK_GUIDE.md](./PRODUCTION_QUICK_GUIDE.md) - Panduan deployment lengkap
- [PRODUCTION_DEPLOYMENT_CLOUDFLARE.md](./documentations/PRODUCTION_DEPLOYMENT_CLOUDFLARE.md) - Deploy dengan Cloudflare
- [DOCKER_QUICK_START.md](./documentations/DOCKER_QUICK_START.md) - Panduan Docker
- [GOOGLE_OAUTH_SETUP.md](./documentations/GOOGLE_OAUTH_SETUP.md) - Setup Google OAuth

## 💡 Tips

1. **Local Development**: Gunakan `.env.local` langsung tanpa edit
2. **Testing Production**: Buat `.env.staging` untuk testing sebelum production
3. **Multiple Environments**: Gunakan naming `.env.{environment}`
4. **Secrets Management**: Pertimbangkan AWS Secrets Manager, Azure Key Vault, dll untuk production

## ❓ Troubleshooting

### Database connection error?

- Pastikan `DATABASE_URL` sesuai dengan setup Anda
- Cek MySQL service running: `docker ps` atau `service mysql status`

### NextAuth error?

- Pastikan `NEXTAUTH_URL` dan `NEXTAUTH_SECRET` sudah diisi
- Untuk production, domain harus HTTPS

### Payment not working?

- Local: Pastikan menggunakan test/sandbox keys
- Production: Pastikan menggunakan live keys

---

**Need Help?** Check [README.md](./README.md) or [documentations/](./documentations/)
