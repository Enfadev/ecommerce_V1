# ✅ Production Deployment Checklist

Gunakan checklist ini sebelum deploy ke production untuk memastikan semuanya ready.

---

## 🔐 Security & Configuration

- [ ] **Environment Variables**

  - [ ] `.env.production` sudah dibuat (copy dari `.env.production.example`)
  - [ ] `NEXTAUTH_SECRET` sudah di-generate dengan `openssl rand -base64 32`
  - [ ] `NEXTAUTH_URL` sudah diisi dengan domain production
  - [ ] `DB_ROOT_PASSWORD` sudah diganti (min 16 characters)
  - [ ] `DB_PASSWORD` sudah diganti (min 16 characters)
  - [ ] Semua password BERBEDA satu sama lain
  - [ ] File `.env.production` TIDAK masuk Git

- [ ] **OAuth Configuration**

  - [ ] Google OAuth production keys sudah di-setup
  - [ ] Authorized redirect URIs sudah ditambahkan: `https://yourdomain.com/api/auth/callback/google`
  - [ ] Test login Google di production

- [ ] **Payment Gateway**
  - [ ] Stripe production keys sudah configured
  - [ ] Stripe webhook sudah di-setup (jika diperlukan)
  - [ ] PayPal production credentials sudah configured
  - [ ] Test payment flow

---

## 🚀 Server Setup

- [ ] **Server Requirements**

  - [ ] Server specs: Min 2GB RAM, 2 CPU cores
  - [ ] Storage: Min 20GB available
  - [ ] OS: Ubuntu/Debian (recommended) atau Windows Server

- [ ] **Docker Installation**

  - [ ] Docker installed: `docker --version`
  - [ ] Docker Compose installed: `docker compose version`
  - [ ] User added to docker group: `sudo usermod -aG docker $USER`

- [ ] **Firewall Configuration**
  - [ ] Port 80 open (untuk Nginx)
  - [ ] Port 443 open (untuk Cloudflare Tunnel)
  - [ ] Port 3306 CLOSED dari public (database internal only)

---

## ☁️ Cloudflare Tunnel

- [ ] **Tunnel Setup**

  - [ ] Cloudflared installed di server
  - [ ] Tunnel created via Dashboard atau CLI
  - [ ] Public hostname configured: `yourdomain.com → http://localhost:80`
  - [ ] Tunnel running as service: `sudo systemctl status cloudflared`
  - [ ] SSL mode di Cloudflare: "Full" atau "Full (strict)"

- [ ] **DNS Configuration**
  - [ ] Domain pointing ke Cloudflare
  - [ ] CNAME record untuk tunnel sudah auto-created
  - [ ] Test domain access: `curl https://yourdomain.com/health`

---

## 📦 Application Files

- [ ] **Project Files**

  - [ ] Latest code pulled dari Git: `git pull origin main`
  - [ ] `nginx.conf` sudah ada di root folder
  - [ ] `healthcheck.sh` sudah ada dan executable
  - [ ] `deploy-production.sh` sudah ada dan executable: `chmod +x deploy-production.sh`

- [ ] **Docker Files**
  - [ ] `Dockerfile` ready (multi-stage build)
  - [ ] `docker-compose.prod.yml` configured
  - [ ] `.dockerignore` configured properly

---

## 🗄️ Database

- [ ] **Database Configuration**

  - [ ] Database credentials strong dan secure
  - [ ] Database hanya accessible dari internal container network
  - [ ] Backup strategy sudah direncanakan

- [ ] **Migrations**
  - [ ] Prisma schema up-to-date
  - [ ] Migrations akan auto-run saat container start

---

## 🧪 Testing

- [ ] **Pre-Deployment Tests**
  - [ ] Build test locally: `docker compose -f docker-compose.prod.yml build`
  - [ ] Test production config locally (jika memungkinkan)
  - [ ] All tests passing: `npm test`

---

## 🚀 Deployment

- [ ] **Initial Deployment**

  - [ ] Run deployment script: `./deploy-production.sh`
  - [ ] Or manual: `docker compose -f docker-compose.prod.yml up -d --build`
  - [ ] Wait for services healthy (30-60 seconds)

- [ ] **Health Checks**

  - [ ] Check container status: `docker compose -f docker-compose.prod.yml ps`
  - [ ] All containers showing "Up (healthy)"
  - [ ] Test local health: `curl http://localhost/health`
  - [ ] Test domain health: `curl https://yourdomain.com/health`

- [ ] **Functional Tests**
  - [ ] Homepage loads: `https://yourdomain.com`
  - [ ] Login works (email & Google)
  - [ ] Product pages load
  - [ ] Shopping cart works
  - [ ] Checkout flow works
  - [ ] Payment gateway integration works
  - [ ] Admin panel accessible
  - [ ] Image uploads work

---

## 📊 Monitoring

- [ ] **Logging**

  - [ ] Can view logs: `docker compose -f docker-compose.prod.yml logs -f`
  - [ ] No critical errors in logs
  - [ ] Application responding normally

- [ ] **Resource Monitoring**
  - [ ] Check resource usage: `docker stats`
  - [ ] Memory usage acceptable (<80%)
  - [ ] CPU usage normal
  - [ ] Disk space sufficient

---

## 🔄 Backup & Recovery

- [ ] **Backup Setup**

  - [ ] Database backup script tested
  - [ ] Uploads backup strategy ready
  - [ ] Backup schedule planned (daily recommended)
  - [ ] Backup storage location configured

- [ ] **Recovery Test**
  - [ ] Know how to restore database
  - [ ] Know how to rollback deployment
  - [ ] Emergency contact list ready

---

## 📚 Documentation

- [ ] **Team Knowledge**
  - [ ] Deployment guide shared with team
  - [ ] Emergency procedures documented
  - [ ] Monitoring dashboard accessible
  - [ ] Credentials stored securely (password manager)

---

## 🎯 Post-Deployment

- [ ] **Final Checks (24 hours after deployment)**

  - [ ] No errors in logs
  - [ ] Application stable
  - [ ] All features working
  - [ ] Performance acceptable
  - [ ] Users can access normally

- [ ] **Optimization**
  - [ ] Monitor slow queries (if any)
  - [ ] Check cache hit rates
  - [ ] Review error rates
  - [ ] Plan for scaling (if needed)

---

## 📞 Emergency Contacts

**In case of issues:**

1. **Check Logs:**

   ```bash
   docker compose -f docker-compose.prod.yml logs -f app
   ```

2. **Restart Services:**

   ```bash
   docker compose -f docker-compose.prod.yml restart
   ```

3. **Rollback:**

   ```bash
   docker compose -f docker-compose.prod.yml down
   git checkout <previous-commit>
   ./deploy-production.sh
   ```

4. **Get Status:**
   ```bash
   docker compose -f docker-compose.prod.yml ps
   curl https://yourdomain.com/health
   ```

---

**Last Updated:** October 8, 2025

**Status:** Ready for Production ✅
