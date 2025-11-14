# Database Connection Fix - Dev Container

## Problem

Aplikasi mengalami error `PrismaClientInitializationError` dengan pesan:

```
Can't reach database server at `localhost:3306`
```

Error ini terjadi karena:

1. `.env` file menggunakan `DATABASE_URL` dengan hostname `localhost:3306`
2. `devcontainer.json` tidak menggunakan docker-compose, sehingga container app tidak terhubung ke database

## Root Cause

- Dev container berjalan sebagai single container (tidak menggunakan docker-compose)
- Database service `db` yang didefinisikan di `docker-compose.devcontainer.yml` tidak tersambung
- Hostname `db` tidak dapat di-resolve dari dalam container

## Solution Applied

### 1. Update DATABASE_URL di .env

Changed from:

```env
DATABASE_URL="mysql://ecommerce_user:ecommerce_password@localhost:3306/ecommerce"
```

To:

```env
DATABASE_URL="mysql://ecommerce_user:ecommerce_password@db:3306/ecommerce"
```

### 2. Update devcontainer.json

Changed from standalone container build to docker-compose:

**Before:**

```json
{
  "name": "E-Commerce Development",
  "build": {
    "dockerfile": "../Dockerfile",
    "target": "development",
    "context": ".."
  },
  "workspaceFolder": "/workspace",
  "workspaceMount": "source=${localWorkspaceFolder},target=/workspace,type=bind"
}
```

**After:**

```json
{
  "name": "E-Commerce Development",
  "dockerComposeFile": "./docker-compose.devcontainer.yml",
  "service": "app",
  "workspaceFolder": "/workspace",
  "shutdownAction": "stopCompose"
}
```

### 3. Update docker-compose.devcontainer.yml

Changed app service command to use `sleep infinity` instead of `stdin_open/tty`:

```yaml
command: sleep infinity
```

This allows VS Code to manage the application lifecycle while keeping the container running.

## How It Works Now

1. VS Code starts dev container using docker-compose
2. Both `app` and `db` services start on the same Docker network (`ecommerce_network`)
3. Hostname `db` resolves to the database container
4. Prisma can connect to `db:3306` successfully
5. VS Code manages running `npm run dev` through tasks

## Verification Steps

After rebuilding dev container:

1. Check hostname resolution:

   ```bash
   ping -c 2 db
   ```

   Should successfully ping the database container.

2. Test Prisma connection:

   ```bash
   npx prisma db pull --force
   ```

   Should connect without errors.

3. Run dev server:
   ```bash
   npm run dev
   ```
   Should start without database connection errors.

## Important Notes

- **For Local Development (outside Docker):** Use `localhost:3306` in DATABASE_URL
- **For Dev Container:** Use `db:3306` in DATABASE_URL
- The current setup is optimized for Dev Container usage
- Port 3307 is forwarded to host for external database access if needed

## Related Files Modified

- `/workspace/.env` - Updated DATABASE_URL hostname
- `/workspace/.devcontainer/devcontainer.json` - Changed to use docker-compose
- `/workspace/.devcontainer/docker-compose.devcontainer.yml` - Updated app service command

## Resolution Steps Completed

### 1. ✅ Updated Configuration Files

- Modified `.env` to use `db:3306` hostname
- Updated `devcontainer.json` to use docker-compose
- Modified `docker-compose.devcontainer.yml` app service command

### 2. ✅ Database Setup

```bash
npx prisma migrate deploy  # Applied 7 migrations successfully
npx prisma generate        # Generated Prisma Client
npm run seed              # Seeded database with initial data
```

### 3. ✅ Verification

- Dev server started successfully
- Homepage accessible at http://localhost:3000
- Database connection working
- Products displaying correctly (30 products seeded)

## Database Statistics After Seeding

- 👥 Total Users: 2 (Admin + User)
- 📦 Total Products: 30
- 🛍️ Total Orders: 5
- 🏷️ Categories: 5
- 📄 Pages: 4 (HomePage, AboutPage, ProductPage, ContactPage)

## Login Credentials

- **Admin:** admin@demo.com / Admin1234
- **User:** user@demo.com / User1234

## Status

✅ **RESOLVED** - Application is now running successfully with database connection working properly.

## Date

October 8, 2025
