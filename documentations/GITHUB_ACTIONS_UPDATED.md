# GitHub Actions CI/CD - Updated Workflow

## 📋 Overview

Workflow GitHub Actions telah diperbarui untuk lebih sesuai dengan struktur project ecommerce ini. Workflow ini melakukan automated testing dan validation setiap kali ada push atau pull request.

## 🔄 Workflow Jobs

### 1. **Lint Job** (Quick Feedback)

- Dijalankan pertama kali untuk feedback cepat
- Memeriksa code quality menggunakan ESLint
- Gagal cepat jika ada masalah linting

### 2. **Docker Build Job** (Main Testing)

- Build Docker images dengan target development
- Start services (database + app)
- Menunggu services siap dengan timeout yang wajar
- Menjalankan berbagai tests:
  - Health check endpoint
  - Database connection
  - Migration status
  - Homepage accessibility
  - Database seeding (optional)

### 3. **Security Scan Job** (Optional)

- Scan vulnerabilities menggunakan Trivy
- Upload hasil ke GitHub Security tab
- Continue on error (tidak memblock merge)

## 🔑 Environment Variables

Workflow menggunakan GitHub Secrets untuk sensitive data:

### Required Secrets (Recommended):

- `NEXTAUTH_SECRET`: Secret key untuk NextAuth (generate dengan `openssl rand -base64 32`)

### Optional Secrets (untuk full functionality):

- `GOOGLE_CLIENT_ID`: Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth Secret
- `STRIPE_SECRET_KEY`: Stripe API Secret Key
- `STRIPE_PUBLISHABLE_KEY`: Stripe Publishable Key
- `PAYPAL_CLIENT_ID`: PayPal Client ID
- `PAYPAL_CLIENT_SECRET`: PayPal Client Secret
- `RESEND_API_KEY`: Resend Email API Key

**Note**: Jika secrets tidak disediakan, workflow akan menggunakan dummy values untuk testing purposes.

## 📝 Setup GitHub Secrets

1. Buka repository di GitHub
2. Navigate ke **Settings** → **Secrets and variables** → **Actions**
3. Klik **New repository secret**
4. Tambahkan secrets berikut:

```bash
# Minimal Required
NEXTAUTH_SECRET=your_generated_secret_key

# Optional (untuk full testing)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
RESEND_API_KEY=re_...
```

## 🎯 Workflow Triggers

Workflow dijalankan pada:

- **Push** ke branches: `main`, `develop`, `testing-docker`
- **Pull Request** ke branches: `main`, `develop`

## ✅ Success Criteria

Workflow dianggap berhasil jika:

1. ✅ Lint check passed
2. ✅ Docker images berhasil di-build
3. ✅ Database siap dan dapat menerima koneksi
4. ✅ App dapat di-start dan merespons health check
5. ✅ Migrations berhasil dijalankan
6. ✅ Homepage dapat diakses

## 🐛 Troubleshooting

### Workflow Gagal di "Wait for database"

- Database mungkin lambat start
- Timeout sudah di-set 60 detik (cukup untuk most cases)
- Check database logs di workflow output

### Workflow Gagal di "Wait for app"

- App mungkin butuh waktu lebih lama untuk build
- Timeout di-set 90 detik
- Periksa apakah ada error di app logs

### Health Check Gagal

- Pastikan endpoint `/api/health` exists dan return status 200
- Check app logs untuk error details

### Migration Gagal

- Periksa schema Prisma untuk errors
- Check migration files di `prisma/migrations/`
- Verifikasi DATABASE_URL format benar

## 🚀 Local Testing

Untuk test workflow behavior secara lokal:

```bash
# 1. Buat .env file sesuai workflow
cat > .env << EOF
DATABASE_URL=mysql://ecommerce_user:ecommerce_password@db:3306/ecommerce
DB_ROOT_PASSWORD=rootpassword
DB_NAME=ecommerce
DB_USER=ecommerce_user
DB_PASSWORD=ecommerce_password
NEXTAUTH_SECRET=test-secret-key
# ... dst
EOF

# 2. Build dan start services
docker compose build
docker compose up -d

# 3. Wait for services
until docker compose exec -T db mysqladmin ping -h localhost -u root -prootpassword --silent; do sleep 2; done
until curl -f http://localhost:3000/api/health; do sleep 3; done

# 4. Run tests
curl -f http://localhost:3000/api/health
curl -f -I http://localhost:3000

# 5. Cleanup
docker compose down -v
```

## 📊 Workflow Features

### Smart Waiting Strategy

- Database: Polling dengan timeout 60s
- App: Polling dengan timeout 90s
- Menggunakan actual health checks, bukan sleep

### Comprehensive Logging

- Menampilkan logs dari semua services
- Final logs di-show bahkan jika workflow gagal
- Helpful untuk debugging

### Resource Cleanup

- Automatic cleanup dengan `always()` condition
- Menghapus volumes untuk clean state
- Docker system prune untuk free up space

### Error Handling

- Seed step menggunakan `continue-on-error: true`
- Security scan tidak block main workflow
- Detailed error messages untuk troubleshooting

## 🔐 Security Best Practices

1. **Never commit secrets** ke repository
2. **Use GitHub Secrets** untuk sensitive data
3. **Rotate secrets regularly** (setiap 3-6 bulan)
4. **Enable security scanning** (Trivy job sudah included)
5. **Review security alerts** di GitHub Security tab

## 📈 Next Steps

### Recommended Improvements:

1. **Add Integration Tests**: Test API endpoints
2. **Add E2E Tests**: Test user flows dengan Playwright/Cypress
3. **Add Performance Tests**: Load testing dengan k6
4. **Deploy to Staging**: Automatic deploy setelah tests pass
5. **Notification**: Slack/Discord notification untuk build status

### Optional Jobs:

```yaml
# Code Coverage
- name: Generate coverage report
  run: npm run test:coverage

# Lighthouse CI
- name: Run Lighthouse
  uses: treosh/lighthouse-ci-action@v9

# Database Backup (before migration)
- name: Backup database
  run: docker compose exec -T db mysqldump ...
```

## 📚 Related Documentation

- [Docker Setup Guide](./DOCKER_SETUP.md)
- [Environment Variables Guide](./ENV_GUIDE.md)
- [Production Deployment](./PRODUCTION_DEPLOYMENT_CLOUDFLARE.md)
- [GitHub Actions CI/CD (Old)](./GITHUB_ACTIONS_CI_CD.md)

## 🤝 Contributing

Saat menambahkan fitur baru:

1. Pastikan tidak break existing tests
2. Update workflow jika ada dependency baru
3. Test secara lokal sebelum push
4. Add documentation untuk perubahan major

---

**Last Updated**: November 4, 2025  
**Version**: 2.0  
**Status**: ✅ Production Ready
