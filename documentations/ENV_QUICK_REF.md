# 🚀 Environment Quick Reference

## File Structure

```
.env.local          → Local development (ready to use)
.env.prod           → Production template (needs configuration)
.env                → Active config (gitignored)
.env.production     → Active production config (gitignored)
```

## Quick Commands

### Local Development

```bash
# Windows PowerShell
.\setup-env.ps1 local
npm run dev:docker

# Linux/Mac
./setup-env.sh local
npm run dev:docker
```

### Production Setup

```bash
# Windows PowerShell
.\setup-env.ps1 prod

# Linux/Mac
./setup-env.sh prod
```

### Generate Secrets

```bash
# Windows PowerShell
.\setup-env.ps1 secrets

# Linux/Mac
./setup-env.sh secrets

# Manual
openssl rand -base64 32  # untuk NEXTAUTH_SECRET
openssl rand -base64 48  # untuk JWT_SECRET
```

## Environment Variables Overview

| Variable            | Local        | Production | Required |
| ------------------- | ------------ | ---------- | -------- |
| `DATABASE_URL`      | ✅ Default   | ⚠️ Update  | YES      |
| `NEXTAUTH_SECRET`   | ✅ Weak OK   | ⚠️ Strong  | YES      |
| `JWT_SECRET`        | ✅ Weak OK   | ⚠️ Strong  | YES      |
| `NEXTAUTH_URL`      | ✅ localhost | ⚠️ Domain  | YES      |
| `GOOGLE_CLIENT_ID`  | ✅ Test      | ⚠️ Update  | YES      |
| `STRIPE_SECRET_KEY` | ✅ Test      | ⚠️ Live    | YES      |
| `PAYPAL_CLIENT_ID`  | ✅ Sandbox   | ⚠️ Live    | YES      |

## Common Issues

### ❌ Database connection error

```bash
# Check MySQL running
docker ps | grep mysql
# or
docker-compose up db
```

### ❌ NextAuth error

```bash
# Check these variables are set:
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
```

### ❌ Payment not working (local)

- Pastikan menggunakan TEST/SANDBOX keys
- Stripe: `pk_test_...` dan `sk_test_...`
- PayPal: Sandbox API `https://api-m.sandbox.paypal.com`

### ❌ Payment not working (production)

- Pastikan menggunakan LIVE keys
- Stripe: `pk_live_...` dan `sk_live_...`
- PayPal: Live API `https://api-m.paypal.com`

## Security Checklist

### Local (OK)

- ✅ Weak passwords OK
- ✅ Test credentials OK
- ✅ HTTP OK

### Production (MUST)

- ⚠️ Strong passwords (min 24 chars)
- ⚠️ Live credentials
- ⚠️ HTTPS only
- ⚠️ `chmod 600 .env.production`
- ⚠️ Never commit to Git

## Need Help?

- 📖 Full guide: [ENV_GUIDE.md](./ENV_GUIDE.md)
- 🚀 Production: [PRODUCTION_QUICK_GUIDE.md](./PRODUCTION_QUICK_GUIDE.md)
- 🔧 Docker: [DOCKER_QUICK_START.md](./documentations/DOCKER_QUICK_START.md)
