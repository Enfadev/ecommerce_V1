# Development Environment Setup

## Database Options

### Option 1: Fix MySQL Authentication (Recommended)

1. **Connect to MySQL as root:**
```bash
mysql -u root -p
```

2. **Update user authentication:**
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
FLUSH PRIVILEGES;
```

3. **Create database:**
```sql
CREATE DATABASE IF NOT EXISTS ecommerce_db_v1;
```

### Option 2: Use SQLite for Development (Quick Fix)

Edit your `.env` file:
```env
# Use SQLite for development (comment MySQL line)
DATABASE_URL="file:./dev.db"

# MySQL for production (uncomment when ready)
# DATABASE_URL="mysql://root@localhost:3306/ecommerce_db_v1?ssl=false&authPlugin=mysql_native_password"
```

Then run:
```bash
npx prisma db push
npx prisma db seed
```

### Option 3: Use PostgreSQL (Alternative)

Install PostgreSQL and update `.env`:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/ecommerce_db_v1"
```

Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Quick Development Setup

Choose SQLite for fastest setup:

1. **Update .env:**
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long-for-security"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
```

2. **Update schema (optional for dev):**
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

3. **Initialize database:**
```bash
npx prisma db push
npx prisma db seed
```

4. **Start application:**
```bash
npm run dev
```
