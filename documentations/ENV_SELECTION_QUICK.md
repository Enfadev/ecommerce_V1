# 🎯 Environment Selection - Quick Summary

## Pertanyaan: Bagaimana Docker Tahu File Mana yang Dipakai?

**Jawaban Singkat:** Docker diberitahu secara **explicit** melalui flag `--env-file` di semua npm scripts.

---

## 📊 Visual Overview

```
┌─────────────────────────────────────────────────────────┐
│           ENVIRONMENT FILE SELECTION SYSTEM             │
└─────────────────────────────────────────────────────────┘

Development:                 Production:
───────────                  ───────────

.env.local (template)        .env.prod (template)
     │                            │
     │ setup-env.ps1 local        │ setup-env.ps1 prod
     ▼                            ▼
.env (active)               .env.production (active)
     │                            │
     │ npm run dev:docker         │ npm run docker:prod
     │                            │
     ▼                            ▼
docker compose               docker compose
--env-file .env              -f docker-compose.prod.yml
                             --env-file .env.production
```

---

## 🔑 Key Points

### 1. Explicit Flag

```bash
# Development
docker compose --env-file .env up
#              ^^^^^^^^^^^^^^^^^^^^
#              Explicitly specify which file

# Production
docker compose --env-file .env.production up
#              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
#              Different file for production
```

### 2. NPM Scripts Handle It

```json
// package.json
{
  "docker:dev": "docker compose --env-file .env up",
  "docker:prod": "docker compose -f docker-compose.prod.yml --env-file .env.production up"
}
```

### 3. Setup Scripts Create Correct Files

```powershell
.\setup-env.ps1 local  → Creates .env
.\setup-env.ps1 prod   → Creates .env.production
```

---

## ✅ Verification

### Check Current Setup

```bash
# List env files
ls -la .env*

# Should see:
# .env                  ← Active local (from .env.local)
# .env.production       ← Active production (from .env.prod)
# .env.local            ← Template
# .env.prod             ← Template
```

### Test Commands

```bash
# Development (uses .env)
npm run dev:docker

# Production (uses .env.production)
npm run docker:prod
```

### Verify Which File Is Used

```bash
# Check development config
docker compose --env-file .env config | grep DATABASE_URL

# Check production config
docker compose -f docker-compose.prod.yml --env-file .env.production config | grep DATABASE_URL
```

---

## 🎯 Simple Rules

1. **Local Development**

   - Run: `.\setup-env.ps1 local`
   - Creates: `.env`
   - Docker uses: `.env`

2. **Production**

   - Run: `.\setup-env.ps1 prod`
   - Creates: `.env.production`
   - Docker uses: `.env.production`

3. **No Confusion**
   - Different files
   - Different commands
   - Can't mix up!

---

## 📋 Command Reference

| Action      | Command                    | Env File Used             |
| ----------- | -------------------------- | ------------------------- |
| Setup Local | `.\setup-env.ps1 local`    | Creates `.env`            |
| Setup Prod  | `.\setup-env.ps1 prod`     | Creates `.env.production` |
| Run Local   | `npm run dev:docker`       | Uses `.env`               |
| Run Prod    | `npm run docker:prod`      | Uses `.env.production`    |
| Stop Local  | `npm run docker:stop`      | Uses `.env`               |
| Stop Prod   | `npm run docker:prod:down` | Uses `.env.production`    |

---

## 🔒 Security

### What's Tracked in Git?

```
✅ .env.local            (template - tracked)
✅ .env.prod             (template - tracked)
❌ .env                  (active - NOT tracked)
❌ .env.production       (active - NOT tracked)
```

### Why Safe?

- Templates tracked → Everyone has same starting point
- Active configs NOT tracked → Your secrets stay private
- Clear separation → No confusion

---

## 💡 Best Practice

**Always use npm scripts, never manual docker commands:**

```bash
# ✅ GOOD - Uses correct env file
npm run dev:docker
npm run docker:prod

# ⚠️ AVOID - Might use wrong env file
docker compose up
docker compose -f docker-compose.prod.yml up
```

---

## 🆘 Troubleshooting

### Problem: Variables not loading

```bash
# Check file exists
ls .env
ls .env.production

# Verify contents
cat .env | grep DATABASE_URL
```

### Problem: Using wrong environment

```bash
# Check which npm script you used
npm run dev:docker        # ✅ Development
npm run docker:prod       # ✅ Production

# Check docker ps
docker ps
# Look at container names:
# - ecommerce_app_dev     = Development
# - ecommerce_app_prod    = Production
```

---

## 📚 Full Documentation

Untuk detail lengkap, baca: **[ENV_SELECTION_SYSTEM.md](./ENV_SELECTION_SYSTEM.md)**

---

**TL;DR:** Docker tahu karena kita kasih tahu dengan `--env-file` flag. Development pakai `.env`, Production pakai `.env.production`. NPM scripts handle semuanya otomatis! 🎉
