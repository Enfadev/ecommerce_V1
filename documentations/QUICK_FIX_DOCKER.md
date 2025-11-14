# 🚀 Quick Fix: Docker Database Permission Error

## ⚠️ Gejala Masalah

Jika kamu mendapat error seperti ini di Docker logs:

```
Error: P1010
Prisma Migrate could not create the shadow database
User was denied access on the database

Error: P3018
ALTER command denied to user 'ecommerce_user'
```

## ✅ Solusi Cepat (3 Langkah)

### **Langkah 1: Update `.env`**

Pastikan `.env` menggunakan konfigurasi Docker:

```env
# Docker Database Configuration (Active)
DATABASE_URL="mysql://ecommerce_user:ecommerce_password@localhost:3306/ecommerce"

# Docker Environment Variables
DB_ROOT_PASSWORD=rootpassword
DB_NAME=ecommerce
DB_USER=ecommerce_user
DB_PASSWORD=ecommerce_password
DB_PORT=3306
APP_PORT=3000
```

Komentar konfigurasi Laragon (local):

```env
# DATABASE_URL="mysql://root:@localhost:3306/ecommerce_db_v1"
```

---

### **Langkah 2: Grant Database Permissions**

Jalankan command ini untuk memberikan ALL PRIVILEGES:

#### **Opsi A: Otomatis (Recommended)**

```powershell
# Stop containers
docker compose down

# Start database
docker compose up -d db

# Tunggu 10 detik
Start-Sleep -Seconds 10

# Grant permissions
docker compose exec db mysql -u root -prootpassword -e "GRANT ALL PRIVILEGES ON *.* TO 'ecommerce_user'@'%' WITH GRANT OPTION; FLUSH PRIVILEGES;"
```

#### **Opsi B: Manual via MySQL**

```powershell
# Masuk ke MySQL container
docker compose exec db mysql -u root -prootpassword

# Di dalam MySQL, jalankan:
GRANT ALL PRIVILEGES ON *.* TO 'ecommerce_user'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
SHOW GRANTS FOR 'ecommerce_user'@'%';
exit;
```

---

### **Langkah 3: Reset Database & Start App**

```powershell
# Reset database dengan migrations
npx prisma migrate reset --force

# Start semua containers
docker compose up -d

# Cek logs untuk memastikan sukses
docker compose logs -f app
```

---

## 📊 Verifikasi Berhasil

Jika berhasil, kamu akan melihat:

```
✓ Ready in 2.3s
- Local:        http://localhost:3000
GET /api/health 200 in 300ms
```

---

## 🆘 Troubleshooting Tambahan

### **Masalah: Migration Case Sensitivity Error**

Jika kamu mendapat error seperti:

```
Table 'ecommerce.aboutpage' doesn't exist
```

Padahal table yang ada adalah `AboutPage` (PascalCase), maka:

1. Buka file migration yang bermasalah (biasanya di `prisma/migrations/`)
2. Ubah semua lowercase table names menjadi PascalCase:

   - `aboutpage` → `AboutPage`
   - `contactpage` → `ContactPage`
   - `homepage` → `HomePage`
   - `productpage` → `ProductPage`
   - `category` → `Category`
   - `product` → `Product`
   - Kecuali: `system_settings` tetap lowercase (sesuai dengan CREATE TABLE)

3. Jalankan lagi `npx prisma migrate reset --force`

---

### **Masalah: Container Restart Loop**

Jika app container terus restart:

```powershell
# Cek error logs
docker compose logs app --tail 100

# Stop semua
docker compose down

# Hapus volumes (HATI-HATI: ini akan hapus semua data)
docker compose down -v

# Start fresh
docker compose up -d db
# Lalu ikuti Langkah 2 & 3 lagi
```

---

### **Masalah: Database Volume Sudah Ada**

File `prisma/grant-permissions.sql` **hanya berjalan saat database pertama kali dibuat**.

Jika database sudah pernah dibuat sebelumnya:

#### **Opsi A: Fresh Start (Hapus semua data)**

```powershell
docker compose down -v
docker compose up -d
```

#### **Opsi B: Manual Grant (Tanpa hapus data)**

```powershell
# Grant permissions secara manual (lihat Langkah 2)
docker compose exec db mysql -u root -prootpassword -e "GRANT ALL PRIVILEGES ON *.* TO 'ecommerce_user'@'%' WITH GRANT OPTION; FLUSH PRIVILEGES;"
```

---

## 🎯 One-Line Fix (Complete Reset)

Jika kamu mau fresh start cepat:

```powershell
docker compose down -v; Start-Sleep -Seconds 2; docker compose up -d db; Start-Sleep -Seconds 10; docker compose exec db mysql -u root -prootpassword -e "GRANT ALL PRIVILEGES ON *.* TO 'ecommerce_user'@'%' WITH GRANT OPTION; FLUSH PRIVILEGES;"; npx prisma migrate reset --force; docker compose up -d
```

⚠️ **WARNING**: Command ini akan **menghapus semua data** di database!

---

## 📝 Penjelasan Teknis

### **Kenapa Butuh ALL PRIVILEGES?**

Prisma Migrate butuh berbagai permissions:

- `CREATE` - Buat shadow database & tables baru
- `DROP` - Hapus shadow database & cleanup
- `ALTER` - Ubah struktur table
- `INDEX` - Buat/hapus indexes
- `REFERENCES` - Foreign key relationships
- `SELECT, INSERT, UPDATE, DELETE` - Data operations

Untuk **development**, lebih aman dan mudah memberikan `ALL PRIVILEGES`.

Untuk **production**, sebaiknya berikan hanya permission yang diperlukan.

### **Kenapa Shadow Database?**

Shadow database digunakan Prisma untuk:

1. ✅ Validasi migration history
2. ✅ Deteksi schema drift (perubahan manual)
3. ✅ Test migrations sebelum apply ke database utama

---

## 🔐 Login Credentials (Setelah Seed)

```
Admin: admin@demo.com / Admin1234
User: user@demo.com / User1234
```

---

## 📚 Referensi

- [Prisma Shadow Database](https://pris.ly/d/migrate-shadow)
- [Error P1010](https://www.prisma.io/docs/reference/api-reference/error-reference#p1010)
- [Docker Setup Guide](./documentations/DOCKER_SETUP.md)
- [Complete Fix Documentation](./documentations/PRISMA_SHADOW_DB_FIX.md)

---

## 💡 Tips

1. ✅ Selalu gunakan `docker compose down` sebelum perubahan besar
2. ✅ Backup data production sebelum migration
3. ✅ Test di development dulu sebelum production
4. ✅ Gunakan `.env.example` sebagai template untuk setup baru
5. ✅ Cek logs dengan `docker compose logs -f` untuk debug

---

**Made with ❤️ for easy Docker setup**
