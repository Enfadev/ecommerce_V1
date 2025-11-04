# Forgot Password - Quick Reference Card

## 🚀 Setup (5 Minutes)

### 1. Get Resend API Key
```
https://resend.com/signup
→ API Keys → Create → Copy
```

### 2. Add to .env
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
EMAIL_FROM=onboarding@resend.dev
```

### 3. Test
```
npm run dev
→ http://localhost:3000/signin
→ Click "Forgot password?"
```

---

## 📋 Routes

| URL | Purpose |
|-----|---------|
| `/forgot-password` | Request reset |
| `/reset-password?token=xxx` | Reset password |
| `/signin` | Login (has forgot link) |

---

## 🔌 API Endpoints

```bash
# Request reset
POST /api/auth/forgot-password
Body: { "email": "user@example.com" }

# Validate token
GET /api/auth/reset-password?token=xxx

# Reset password
POST /api/auth/reset-password
Body: { "token": "xxx", "password": "newPass" }
```

---

## 🧪 Test Accounts

```
user@demo.com / User1234
admin@demo.com / Admin1234
```

---

## 🔒 Security Features

- ✅ 256-bit secure tokens
- ✅ 1-hour expiration
- ✅ One-time use
- ✅ Bcrypt password hashing
- ✅ Email enumeration protection
- ⚠️ Rate limiting (ADD BEFORE PROD!)

---

## 📧 Email Settings

### Development
```bash
EMAIL_FROM=onboarding@resend.dev
# No setup needed!
```

### Production
```bash
EMAIL_FROM=noreply@yourdomain.com
# Verify domain in Resend first
```

---

## 🗂️ Files Created

```
src/lib/email.ts
src/app/api/auth/forgot-password/route.ts
src/app/api/auth/reset-password/route.ts
src/app/(auth)/forgot-password/page.tsx
src/app/(auth)/reset-password/page.tsx
prisma/migrations/.../migration.sql
```

---

## ⚡ Common Commands

```bash
# Generate Prisma Client
npx prisma generate

# Run migration
npx prisma migrate dev

# Reset database
npm run prisma:reset

# Start dev server
npm run dev
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Email not received | Check spam, verify API key |
| Token invalid | Expired (>1h) or already used |
| TypeScript errors | Run `npx prisma generate` |
| Database errors | Run `npx prisma migrate dev` |

---

## 🚨 BEFORE PRODUCTION

### CRITICAL: Add Rate Limiting!
```typescript
// Use @upstash/ratelimit (already installed)
import { Ratelimit } from "@upstash/ratelimit";

const limiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 h"),
});

// In forgot-password route:
const { success } = await limiter.limit(email);
if (!success) return error("Too many requests");
```

### Production Checklist:
- [ ] Rate limiting implemented
- [ ] Domain verified in Resend
- [ ] EMAIL_FROM updated
- [ ] HTTPS enabled
- [ ] Monitoring configured
- [ ] All tests passed

---

## 📚 Full Documentation

See `FORGOT_PASSWORD_INDEX.md` for complete docs index

---

## ⏱️ Token Lifecycle

```
Created → Valid (1 hour) → Expired
   ↓
  Used → Cannot reuse
```

---

## 🎯 Key Numbers

- **Token length:** 64 characters (hex)
- **Expiration:** 1 hour
- **Free emails:** 100/day (Resend)
- **Min password:** 8 characters

---

## 🔗 Important Links

- **Resend Docs:** https://resend.com/docs
- **Prisma Docs:** https://prisma.io/docs
- **OWASP Guide:** https://owasp.org/www-community/Forgot_Password_Cheat_Sheet

---

## 📞 Quick Help

1. **Setup issues:** → `FORGOT_PASSWORD_README_ID.md`
2. **Code issues:** → `FORGOT_PASSWORD_FEATURE.md`
3. **Deploy issues:** → `FORGOT_PASSWORD_PRODUCTION_CHECKLIST.md`
4. **Flow understanding:** → `FORGOT_PASSWORD_FLOW_DIAGRAM.md`

---

## ✅ Testing Checklist

- [ ] Request reset with valid email
- [ ] Receive email
- [ ] Click reset link
- [ ] Enter new password
- [ ] Login with new password
- [ ] Try reuse token (should fail)
- [ ] Wait 1h+ and try token (should fail)

---

## 💡 Pro Tips

1. Use `onboarding@resend.dev` for dev (no setup!)
2. Test with demo accounts first
3. Check Resend dashboard for email logs
4. Monitor rate limits before production
5. Keep API keys secret (never commit!)

---

**Version:** 1.0.0  
**Status:** ✅ Ready  
**Updated:** 2025-10-15

---

**Need more info?** See `FORGOT_PASSWORD_INDEX.md` 📖
