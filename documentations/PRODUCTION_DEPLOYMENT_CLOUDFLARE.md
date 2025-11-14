# 🚀 Production Deployment Guide - Cloudflare Tunnel

Panduan lengkap untuk deploy aplikasi e-commerce ke production server menggunakan Cloudflare Tunnel.

---

## 📋 Prerequisites

### Server Requirements:

- ✅ Ubuntu/Debian Linux server (atau Windows Server)
- ✅ Docker & Docker Compose installed
- ✅ Minimal 2GB RAM, 2 CPU cores
- ✅ 20GB storage space
- ✅ Port 80 dan 3306 available

### Cloudflare Requirements:

- ✅ Domain terdaftar di Cloudflare
- ✅ Cloudflare Tunnel configured
- ✅ Tunnel token ready

---

## 🔧 Setup Steps

### 1. Install Docker di Server

**Ubuntu/Debian:**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Add user to docker group
sudo usermod -aG docker $USER

# Logout and login again, then verify
docker --version
docker compose version
```

---

### 2. Clone Project ke Server

```bash
# Clone repository
git clone https://github.com/your-username/ecommerce_V1.git
cd ecommerce_V1

# Atau upload via FTP/SCP jika tidak menggunakan Git
```

---

### 3. Setup Environment Variables

```bash
# Copy template
cp .env.example .env.production

# Edit dengan credentials production
nano .env.production
```

**Konfigurasi .env.production:**

```bash
# Database Production
DATABASE_URL=mysql://ecommerce_user:STRONG_PASSWORD_HERE@db:3306/ecommerce
DB_ROOT_PASSWORD=VERY_STRONG_ROOT_PASSWORD_HERE
DB_NAME=ecommerce
DB_USER=ecommerce_user
DB_PASSWORD=STRONG_PASSWORD_HERE
DB_PORT=3306

# Application
APP_PORT=3000
NGINX_PORT=80
NODE_ENV=production

# NextAuth - WAJIB diganti!
NEXTAUTH_URL=https://yourdomain.com  # Domain Cloudflare Tunnel Anda
NEXTAUTH_SECRET=GENERATE_WITH_COMMAND_BELOW

# Google OAuth
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret

# Stripe
STRIPE_SECRET_KEY=sk_live_YOUR_STRIPE_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_STRIPE_PUBLISHABLE_KEY

# PayPal
PAYPAL_CLIENT_ID=your-production-paypal-client-id
PAYPAL_CLIENT_SECRET=your-production-paypal-client-secret
```

**Generate NEXTAUTH_SECRET:**

```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

---

### 4. Setup Cloudflare Tunnel

#### Option A: Menggunakan Cloudflare Dashboard (Recommended)

1. **Login ke Cloudflare Dashboard**

   - Buka https://dash.cloudflare.com
   - Pilih domain Anda

2. **Buat Tunnel**

   - Zero Trust → Access → Tunnels
   - Create a tunnel
   - Pilih "Cloudflared"
   - Beri nama: `ecommerce-production`
   - Copy token yang diberikan

3. **Install Cloudflared di Server**

   ```bash
   # Ubuntu/Debian
   curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o cloudflared.deb
   sudo dpkg -i cloudflared.deb

   # Verify
   cloudflared --version
   ```

4. **Run Tunnel dengan Token**

   ```bash
   # Jalankan tunnel
   cloudflared tunnel run --token YOUR_TUNNEL_TOKEN

   # Atau sebagai service (recommended)
   sudo cloudflared service install YOUR_TUNNEL_TOKEN
   sudo systemctl start cloudflared
   sudo systemctl enable cloudflared
   ```

5. **Configure Public Hostname**
   - Di Cloudflare Dashboard → Public Hostname
   - Domain: `yourdomain.com` atau `shop.yourdomain.com`
   - Service: `http://localhost:80`
   - Save

#### Option B: Menggunakan Config File

```bash
# Login ke Cloudflare
cloudflared tunnel login

# Buat tunnel
cloudflared tunnel create ecommerce-production

# Edit config file
nano ~/.cloudflared/config.yml
```

**Config file:**

```yaml
tunnel: ecommerce-production
credentials-file: /home/YOUR_USER/.cloudflared/TUNNEL_ID.json

ingress:
  - hostname: yourdomain.com
    service: http://localhost:80
  - hostname: www.yourdomain.com
    service: http://localhost:80
  - service: http_status:404
```

**Start tunnel:**

```bash
cloudflared tunnel run ecommerce-production
```

---

### 5. Deploy Application

**Menggunakan Script Otomatis:**

```bash
# Beri permission
chmod +x deploy-production.sh

# Deploy
./deploy-production.sh
```

**Atau Manual:**

```bash
# Stop container lama jika ada
docker compose -f docker-compose.prod.yml down

# Build dan start
docker compose -f docker-compose.prod.yml up -d --build

# Cek status
docker compose -f docker-compose.prod.yml ps

# Lihat logs
docker compose -f docker-compose.prod.yml logs -f
```

---

### 6. Verify Deployment

**1. Check Container Health:**

```bash
docker compose -f docker-compose.prod.yml ps
```

Output expected:

```
NAME                    STATUS              PORTS
ecommerce_db_prod       Up (healthy)        0.0.0.0:3306->3306/tcp
ecommerce_app_prod      Up (healthy)        3000/tcp
ecommerce_nginx_prod    Up (healthy)        0.0.0.0:80->80/tcp
```

**2. Test Health Endpoint:**

```bash
curl http://localhost/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2025-10-08T12:00:00.000Z",
  "uptime": 123.45
}
```

**3. Test via Domain:**

```bash
curl https://yourdomain.com/health
```

**4. Open in Browser:**

- https://yourdomain.com

---

## 🔄 Update/Redeploy

```bash
# Pull latest code
git pull origin main

# Redeploy
./deploy-production.sh

# Atau manual
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build
```

---

## 📊 Monitoring & Maintenance

### View Logs:

```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# App only
docker compose -f docker-compose.prod.yml logs -f app

# Database only
docker compose -f docker-compose.prod.yml logs -f db

# Nginx only
docker compose -f docker-compose.prod.yml logs -f nginx

# Last 100 lines
docker compose -f docker-compose.prod.yml logs --tail=100
```

### Container Management:

```bash
# Status
docker compose -f docker-compose.prod.yml ps

# Restart all
docker compose -f docker-compose.prod.yml restart

# Restart app only
docker compose -f docker-compose.prod.yml restart app

# Stop all
docker compose -f docker-compose.prod.yml down

# Start all
docker compose -f docker-compose.prod.yml up -d
```

### Database Backup:

```bash
# Backup database
docker compose -f docker-compose.prod.yml exec db \
  mysqldump -u root -p$DB_ROOT_PASSWORD ecommerce > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore database
docker compose -f docker-compose.prod.yml exec -T db \
  mysql -u root -p$DB_ROOT_PASSWORD ecommerce < backup_20251008_120000.sql
```

### Uploads Backup:

```bash
# Backup uploads folder
docker compose -f docker-compose.prod.yml exec app \
  tar -czf /tmp/uploads_$(date +%Y%m%d_%H%M%S).tar.gz /app/public/uploads

# Copy to host
docker cp ecommerce_app_prod:/tmp/uploads_20251008_120000.tar.gz ./
```

---

## 🔒 Security Best Practices

### 1. Firewall Configuration:

```bash
# Ubuntu UFW
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. Update Passwords:

- Ganti semua default passwords di `.env.production`
- Use strong passwords (minimal 16 characters)
- Use different passwords untuk setiap service

### 3. SSL/TLS:

- Cloudflare sudah provide SSL otomatis
- Pastikan SSL mode di Cloudflare: "Full" atau "Full (strict)"

### 4. Database Access:

```bash
# Database TIDAK boleh diakses dari public
# Hanya internal container network saja
```

### 5. Regular Updates:

```bash
# Update Docker images
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d

# Update system
sudo apt update && sudo apt upgrade -y
```

---

## 🆘 Troubleshooting

### Problem: Container unhealthy

**Solution:**

```bash
# Check logs
docker compose -f docker-compose.prod.yml logs app

# Check health
docker inspect ecommerce_app_prod | grep -A 10 Health

# Restart
docker compose -f docker-compose.prod.yml restart app
```

---

### Problem: Database connection failed

**Solution:**

```bash
# Check database status
docker compose -f docker-compose.prod.yml ps db

# Check database logs
docker compose -f docker-compose.prod.yml logs db

# Verify credentials
docker compose -f docker-compose.prod.yml exec db \
  mysql -u ecommerce_user -p$DB_PASSWORD -e "SELECT 1"
```

---

### Problem: Cloudflare Tunnel down

**Solution:**

```bash
# Check tunnel status
sudo systemctl status cloudflared

# Restart tunnel
sudo systemctl restart cloudflared

# View tunnel logs
sudo journalctl -u cloudflared -f
```

---

### Problem: Out of disk space

**Solution:**

```bash
# Check disk usage
df -h

# Clean unused Docker resources
docker system prune -a --volumes

# Remove old images
docker image prune -a -f

# Remove old logs
docker compose -f docker-compose.prod.yml logs --tail=0 -f > /dev/null
```

---

## 📈 Performance Optimization

### 1. Database Optimization:

```sql
-- Run inside container
docker compose -f docker-compose.prod.yml exec db mysql -u root -p

-- Optimize tables
USE ecommerce;
OPTIMIZE TABLE products, orders, users;
```

### 2. Monitor Resource Usage:

```bash
# Container stats
docker stats

# Specific container
docker stats ecommerce_app_prod
```

### 3. Nginx Caching:

- Sudah dikonfigurasi di `nginx.conf`
- Static files cached for 60 minutes
- Images cached for 7 days

---

## 🎯 Quick Reference

### Common Commands:

```bash
# Deploy/Update
./deploy-production.sh

# View logs
docker compose -f docker-compose.prod.yml logs -f app

# Restart
docker compose -f docker-compose.prod.yml restart

# Status
docker compose -f docker-compose.prod.yml ps

# Shell into app
docker compose -f docker-compose.prod.yml exec app sh

# Database shell
docker compose -f docker-compose.prod.yml exec db mysql -u root -p
```

---

## 📞 Support

Jika mengalami masalah:

1. Check logs: `docker compose -f docker-compose.prod.yml logs`
2. Check container health: `docker compose -f docker-compose.prod.yml ps`
3. Verify environment variables: `cat .env.production`
4. Test health endpoint: `curl http://localhost/health`

---

**Last Updated:** October 8, 2025
