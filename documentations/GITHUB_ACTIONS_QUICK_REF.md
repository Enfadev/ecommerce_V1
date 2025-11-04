# GitHub Actions - Quick Reference

## 🚀 Quick Commands

### Setup GitHub Secrets

```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Tambahkan di: Settings → Secrets → Actions
```

### Local Testing

```bash
# Build dan test seperti CI
docker compose build && docker compose up -d
curl http://localhost:3000/api/health
docker compose down -v
```

## 📋 Workflow Jobs

| Job               | Purpose                   | Duration | Can Fail? |
| ----------------- | ------------------------- | -------- | --------- |
| **lint**          | Code quality check        | ~2 min   | Yes ❌    |
| **docker-build**  | Build & Integration tests | ~5-8 min | Yes ❌    |
| **security-scan** | Vulnerability scan        | ~3 min   | No ✅     |

## 🔑 Required Secrets

### Minimal (untuk workflow berjalan):

- `NEXTAUTH_SECRET` - NextAuth secret key

### Optional (untuk full functionality):

- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
- `STRIPE_SECRET_KEY` & `STRIPE_PUBLISHABLE_KEY`
- `PAYPAL_CLIENT_ID` & `PAYPAL_CLIENT_SECRET`
- `RESEND_API_KEY`

## ✅ Success Checklist

- [ ] Lint passed
- [ ] Docker build successful
- [ ] Database connected
- [ ] App health check OK
- [ ] Migrations applied
- [ ] Homepage accessible

## 🐛 Quick Fixes

### Workflow Gagal - Lint Error

```bash
npm run lint
# Fix errors, kemudian commit
```

### Workflow Gagal - Health Check

```bash
# Check health endpoint locally
curl http://localhost:3000/api/health
# Should return: {"status":"ok",...}
```

### Workflow Gagal - Database Connection

```bash
# Test database
docker compose exec db mysql -u ecommerce_user -pecommerce_password ecommerce
```

## 📊 Workflow Flow

```
Push/PR → Lint → Docker Build → Tests → Clean Up
           ↓
    Security Scan (parallel)
```

## 🔄 Trigger Workflow Manually

1. Go to **Actions** tab
2. Select **Docker Build and Test**
3. Click **Run workflow**
4. Choose branch
5. Click **Run workflow**

## 📱 Status Badge

Tambahkan di README.md:

```markdown
![CI](https://github.com/EnFaDev/ecommerce_V1/workflows/Docker%20Build%20and%20Test/badge.svg)
```

## 🎯 Performance Tips

1. **Cache layers**: Buildx sudah enabled
2. **Parallel jobs**: Lint & Security scan parallel
3. **Smart timeouts**: DB (60s), App (90s)
4. **Resource cleanup**: Always runs

## 📞 Need Help?

- Check workflow logs di GitHub Actions tab
- Test locally dengan commands di atas
- Review [Full Documentation](./GITHUB_ACTIONS_UPDATED.md)

---

**Quick Ref Version**: 1.0  
**Last Updated**: Nov 4, 2025
