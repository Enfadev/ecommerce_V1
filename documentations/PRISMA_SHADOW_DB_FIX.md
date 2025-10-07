# Fix Prisma Migrate Shadow Database Error

## Problem

Error P1010 dan P3014 terjadi saat menjalankan `prisma migrate` di Docker container:

```
Prisma Migrate could not create the shadow database. Please make sure the database user has permission to create databases.
Error code: P1010
User was denied access on the database 'prisma_migrate_shadow_db_...'
```

## Root Cause

User MySQL (`ecommerce_user`) tidak memiliki privilege `CREATE DATABASE` dan `DROP DATABASE` yang diperlukan oleh Prisma Migrate untuk membuat shadow database sementara.

Shadow database digunakan oleh Prisma Migrate untuk:

1. Validasi migration history
2. Deteksi schema drift
3. Testing migrations sebelum apply ke database utama

## Solutions

### Solution 1: Disable Shadow Database (Quick Fix - Development Only)

Sudah diterapkan di `docker-compose.yml`:

```yaml
DATABASE_URL: mysql://user:pass@db:3306/ecommerce?shadowDatabaseUrl=
```

Parameter `shadowDatabaseUrl=` (empty) akan menonaktifkan shadow database.

**Pros:**

- ✅ Fix cepat, tidak perlu permission tambahan
- ✅ Cocok untuk development

**Cons:**

- ❌ Tidak bisa mendeteksi schema drift
- ❌ Migration validation terbatas
- ❌ Tidak recommended untuk production

### Solution 2: Grant Proper Permissions (Recommended)

Berikan permission yang diperlukan ke user database:

#### Automatic (via init script)

File `prisma/grant-permissions.sql` sudah di-mount ke container dan akan dijalankan saat database pertama kali dibuat.

Jika database sudah exist, jalankan manual:

#### Manual via Script

```bash
# Gunakan script helper
sh scripts/grant-db-permissions.sh
```

#### Manual via Docker

```bash
docker compose exec db mysql -u root -prootpassword -e "
GRANT CREATE ON *.* TO 'ecommerce_user'@'%';
GRANT DROP ON *.* TO 'ecommerce_user'@'%';
FLUSH PRIVILEGES;
"
```

#### Verify Permissions

```bash
docker compose exec db mysql -u root -prootpassword -e "
SELECT User, Host, Create_priv, Drop_priv
FROM mysql.user
WHERE User = 'ecommerce_user';
"
```

## Testing After Fix

### 1. Restart Containers

```bash
npm run docker:stop
npm run docker:dev:up
```

### 2. Check Database Connection

```bash
docker compose exec app npx prisma db push
```

### 3. Run Migration

```bash
npm run docker:migrate
# or
docker compose exec app npx prisma migrate dev
```

### 4. Expected Output

```
✅ Migrations applied successfully
✅ Prisma schema loaded
✅ Shadow database created and cleaned up
```

## Alternative: Use Root User for Migrations

Jika masih bermasalah, gunakan root user khusus untuk migration:

### Update .env

```env
# Regular app connection
DATABASE_URL="mysql://ecommerce_user:ecommerce_password@db:3306/ecommerce"

# Migration connection (with full privileges)
MIGRATION_DATABASE_URL="mysql://root:rootpassword@db:3306/ecommerce"
```

### Run Migration with Root

```bash
docker compose exec app sh -c "DATABASE_URL=$MIGRATION_DATABASE_URL npx prisma migrate dev"
```

## Best Practices

### Development

- ✅ Disable shadow database atau grant CREATE/DROP privileges
- ✅ Gunakan user dengan limited privileges untuk app runtime
- ✅ Gunakan root user hanya untuk migrations

### Production

- ✅ Jalankan migrations secara terpisah dari app deployment
- ✅ Gunakan dedicated migration user dengan privileges minimal yang diperlukan
- ✅ Never disable shadow database di production
- ✅ Backup database sebelum migration

## Related Commands

```bash
# Check migration status
npm run docker:exec:app
npx prisma migrate status

# Reset database (development only)
npm run docker:reset

# View database in Prisma Studio
npm run docker:studio

# Check container logs
npm run docker:logs:app
npm run docker:logs:db
```

## Files Modified

1. `docker-compose.yml` - Added shadowDatabaseUrl parameter & grant script volume
2. `prisma/grant-permissions.sql` - SQL script untuk grant permissions
3. `scripts/grant-db-permissions.sh` - Helper script untuk manual grant

## References

- [Prisma Migrate Shadow Database](https://pris.ly/d/migrate-shadow)
- [Prisma Error P1010](https://www.prisma.io/docs/reference/api-reference/error-reference#p1010)
- [MySQL Grant Privileges](https://dev.mysql.com/doc/refman/8.0/en/grant.html)
