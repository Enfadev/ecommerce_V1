# ✅ Docker Setup Testing Checklist

Gunakan checklist ini untuk memastikan semua perbaikan Docker berfungsi dengan baik.

---

## 📋 Pre-Testing Setup

- [ ] Docker Desktop is running
- [ ] Port 3000 is available
- [ ] Port 3306 is available
- [ ] `.env` file configured
- [ ] Git changes committed (optional, for rollback)

---

## 🧪 Development Mode Tests

### 1. Basic Startup

```bash
npm run docker:dev
```

- [ ] Database container starts successfully
- [ ] App container starts successfully
- [ ] Database healthcheck shows "healthy"
- [ ] App healthcheck shows "healthy"
- [ ] No errors in logs
- [ ] App accessible at http://localhost:3000

### 2. Health Endpoint

```bash
curl http://localhost:3000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2025-10-07T...",
  "uptime": 123.456
}
```

- [ ] Health endpoint returns 200 OK
- [ ] Response includes status, timestamp, uptime
- [ ] Response is valid JSON

### 3. Database Migration

```bash
docker logs ecommerce_app_dev | Select-String "migration"
```

- [ ] Migrations run automatically on startup
- [ ] No migration errors in logs
- [ ] Database schema is up-to-date

Check migration status:

```bash
docker exec -it ecommerce_app_dev npx prisma migrate status
```

- [ ] Shows "Database schema is up to date!"

### 4. Uploads Directory

```bash
docker exec -it ecommerce_app_dev ls -la /app/public/uploads
```

- [ ] Directory exists
- [ ] Has correct permissions (777 or rwxrwxrwx)
- [ ] Can write to directory

Test upload via UI:

- [ ] Go to Admin Panel
- [ ] Upload a logo/image
- [ ] Image displays correctly
- [ ] Image file exists in container

### 5. Data Persistence

```bash
# Upload a file via UI
# Then restart container
npm run docker:stop
npm run docker:dev
```

- [ ] Database data still exists after restart
- [ ] Uploaded files still exist after restart
- [ ] App state is preserved

### 6. Hot Reload (Watch Mode)

```bash
npm run docker:dev:watch
```

Edit a file in `src/`:

- [ ] Changes detected
- [ ] App reloads automatically
- [ ] Changes visible in browser
- [ ] No errors in console

### 7. Logs

```bash
npm run docker:logs
```

- [ ] Logs display for both services
- [ ] No critical errors
- [ ] Migration logs visible
- [ ] App startup logs visible

---

## 🏭 Production Mode Tests

### 1. Production Build

```bash
npm run docker:prod
```

- [ ] Build completes successfully
- [ ] No build errors
- [ ] Image size is reasonable (~800MB)
- [ ] Containers start successfully

### 2. Production Health

```bash
docker ps
```

- [ ] Both containers show "healthy"
- [ ] App responds at http://localhost:3000
- [ ] Health endpoint works

### 3. Production Migrations

```bash
docker logs ecommerce_app_prod | Select-String "migration"
```

- [ ] Migrations run automatically
- [ ] Uses `migrate deploy` (not `migrate dev`)
- [ ] No errors

### 4. Production Uploads

- [ ] Upload directory exists
- [ ] Can upload files via UI
- [ ] Files persist after restart

### 5. Production Performance

- [ ] App starts in ~15 seconds
- [ ] Pages load quickly
- [ ] No memory leaks
- [ ] Stable under load

---

## 🔍 Volume Tests

### 1. Check Volumes Exist

```bash
docker volume ls
```

Expected volumes:

- [ ] `ecommerce_v1_db_data`
- [ ] `ecommerce_v1_uploads_data`

### 2. Inspect Volumes

```bash
docker volume inspect ecommerce_v1_uploads_data
docker volume inspect ecommerce_v1_db_data
```

- [ ] Volumes have correct mount points
- [ ] Volumes are accessible

### 3. Volume Backup

```bash
docker run --rm -v ecommerce_v1_uploads_data:/uploads -v ${PWD}:/backup alpine tar czf /backup/uploads-backup.tar.gz -C /uploads .
```

- [ ] Backup file created
- [ ] Backup file is not empty
- [ ] Backup contains expected files

### 4. Volume Restore

```bash
docker run --rm -v ecommerce_v1_uploads_data:/uploads -v ${PWD}:/backup alpine tar xzf /backup/uploads-backup.tar.gz -C /uploads
```

- [ ] Restore completes successfully
- [ ] Files restored correctly
- [ ] App can access restored files

---

## 🐛 Error Handling Tests

### 1. Database Connection Error

```bash
# Stop database container
docker stop ecommerce_db
```

- [ ] App healthcheck becomes unhealthy
- [ ] Error logged appropriately
- [ ] App attempts reconnection
- [ ] App recovers when DB restarts

### 2. Migration Failure

```bash
# Create conflicting migration manually
docker exec -it ecommerce_app_dev npx prisma migrate dev --name test --create-only
# Edit migration to cause error
```

- [ ] Error logged clearly
- [ ] Container stays running (for debugging)
- [ ] Can recover from error

### 3. Port Conflict

```bash
# Change APP_PORT in .env
APP_PORT=3001
npm run docker:dev
```

- [ ] App starts on new port
- [ ] Health check works on new port
- [ ] No conflicts

---

## 📊 Performance Tests

### 1. Image Size

```bash
docker images | Select-String "ecommerce"
```

Expected sizes:

- [ ] Development image: ~1GB
- [ ] Production image: ~800MB

### 2. Startup Time

```bash
# Measure time from start to healthy
$start = Get-Date
npm run docker:dev
# Wait for "healthy"
$end = Get-Date
$duration = $end - $start
```

Expected times:

- [ ] Development: ~30 seconds
- [ ] Production: ~15 seconds

### 3. Rebuild Time

```bash
# Make a small change
# Measure rebuild time
$start = Get-Date
docker compose up --build -d
$end = Get-Date
$duration = $end - $start
```

Expected times:

- [ ] Development: ~45 seconds
- [ ] Production: ~60 seconds

---

## 🔐 Security Tests

### 1. Environment Variables

```bash
docker exec -it ecommerce_app_dev printenv | Select-String "SECRET"
```

- [ ] Sensitive variables not logged
- [ ] Variables loaded correctly
- [ ] No secrets in build logs

### 2. File Permissions

```bash
docker exec -it ecommerce_app_dev ls -la /app
```

- [ ] Uploads directory has write permissions
- [ ] Other directories have appropriate permissions
- [ ] No world-writable sensitive files

### 3. Network Isolation

```bash
docker network inspect ecommerce_v1_ecommerce_network
```

- [ ] Containers on same network
- [ ] Network properly configured
- [ ] No unnecessary external access

---

## 📝 Documentation Tests

### 1. Quick Start Guide

- [ ] Follow DOCKER_QUICK_START.md step-by-step
- [ ] All commands work
- [ ] All links work
- [ ] Clear and understandable

### 2. Improvements Doc

- [ ] Read DOCKERFILE_IMPROVEMENTS.md
- [ ] Technical details are accurate
- [ ] Examples work as described

### 3. Summary Doc

- [ ] Check DOCKERFILE_UPGRADE_SUMMARY.md
- [ ] Metrics are correct
- [ ] Changes properly documented

---

## 🎯 Final Validation

### All Services Running

```bash
docker ps
```

Expected output:

- [ ] 2 containers running
- [ ] Both show "healthy"
- [ ] Correct ports mapped
- [ ] No restart loops

### Full Application Test

- [ ] Home page loads
- [ ] Can browse products
- [ ] Can add to cart
- [ ] Can checkout (test mode)
- [ ] Admin panel accessible
- [ ] Can upload images
- [ ] Reviews work
- [ ] Search works
- [ ] All features functional

### Clean Shutdown

```bash
npm run docker:stop
```

- [ ] Containers stop gracefully
- [ ] No errors during shutdown
- [ ] Volumes remain intact
- [ ] Can restart successfully

---

## ✅ Sign Off

Testing completed by: ********\_\_********  
Date: ********\_\_********  
Result: [ ] PASS / [ ] FAIL

Notes:

---

---

---

---

## 🐛 Issues Found

If any tests fail, document here:

| Test | Issue | Severity        | Status     |
| ---- | ----- | --------------- | ---------- |
|      |       | Low/Medium/High | Open/Fixed |

---

## 📈 Test Results Summary

| Category         | Tests Passed  | Tests Failed | Success Rate |
| ---------------- | ------------- | ------------ | ------------ |
| Development Mode | \_\_ / 7      | \_\_         | \_\_%        |
| Production Mode  | \_\_ / 5      | \_\_         | \_\_%        |
| Volume Tests     | \_\_ / 4      | \_\_         | \_\_%        |
| Error Handling   | \_\_ / 3      | \_\_         | \_\_%        |
| Performance      | \_\_ / 3      | \_\_         | \_\_%        |
| Security         | \_\_ / 3      | \_\_         | \_\_%        |
| Documentation    | \_\_ / 3      | \_\_         | \_\_%        |
| Final Validation | \_\_ / 3      | \_\_         | \_\_%        |
| **TOTAL**        | **\_\_ / 31** | **\_\_**     | **\_\_%**    |

**Minimum to pass: 90% (28/31 tests)**

---

**Status:**

- [ ] ✅ ALL TESTS PASSED - READY FOR PRODUCTION
- [ ] ⚠️ MINOR ISSUES - ACCEPTABLE FOR PRODUCTION
- [ ] ❌ CRITICAL ISSUES - DO NOT DEPLOY

**Next Steps:**

1. Fix any failing tests
2. Re-run failed tests
3. Update documentation if needed
4. Deploy to production when ready

---

**Happy Testing! 🧪**
