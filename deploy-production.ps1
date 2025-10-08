# Production Deployment Script (PowerShell)
# Usage: .\deploy-production.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting Production Deployment..." -ForegroundColor Cyan

# Check if .env.production exists
if (-not (Test-Path .env.production)) {
    Write-Host "❌ Error: .env.production file not found!" -ForegroundColor Red
    Write-Host "Please create .env.production with production configurations" -ForegroundColor Yellow
    exit 1
}

Write-Host "📋 Pre-deployment Checklist:" -ForegroundColor Yellow
Write-Host "1. ✅ .env.production exists" -ForegroundColor Green
Write-Host "2. ⏳ Checking Docker..." -ForegroundColor Yellow

# Check Docker
try {
    docker info | Out-Null
    Write-Host "   ✅ Docker is ready" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running!" -ForegroundColor Red
    exit 1
}

# Pull latest changes (optional)
Write-Host "📥 Pulling latest changes..." -ForegroundColor Yellow
try {
    git pull origin main
} catch {
    Write-Host "⚠️  Git pull failed or not a git repo" -ForegroundColor Yellow
}

# Stop existing containers
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
docker compose -f docker-compose.prod.yml down

# Remove old images
Write-Host "🧹 Cleaning up old images..." -ForegroundColor Yellow
docker image prune -f

# Build and start services
Write-Host "🏗️  Building production images..." -ForegroundColor Yellow
docker compose -f docker-compose.prod.yml build --no-cache

Write-Host "🚀 Starting production services..." -ForegroundColor Yellow
docker compose -f docker-compose.prod.yml up -d

# Wait for services
Write-Host "⏳ Waiting for services to be healthy..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check health
Write-Host "🏥 Checking service health..." -ForegroundColor Yellow
for ($i = 1; $i -le 30; $i++) {
    $status = docker compose -f docker-compose.prod.yml ps
    if ($status -match "unhealthy") {
        Write-Host "   ⏳ Waiting... ($i/30)" -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    } else {
        break
    }
}

# Show status
Write-Host "`n✅ Deployment completed!" -ForegroundColor Green
Write-Host "`n📊 Container Status:" -ForegroundColor Yellow
docker compose -f docker-compose.prod.yml ps

Write-Host "`n📝 Quick Commands:" -ForegroundColor Yellow
Write-Host "  View logs:      docker compose -f docker-compose.prod.yml logs -f"
Write-Host "  View app logs:  docker compose -f docker-compose.prod.yml logs -f app"
Write-Host "  View db logs:   docker compose -f docker-compose.prod.yml logs -f db"
Write-Host "  Stop services:  docker compose -f docker-compose.prod.yml down"
Write-Host "  Restart:        docker compose -f docker-compose.prod.yml restart"

Write-Host "`n🎉 Application is now running!" -ForegroundColor Green
Write-Host "   Access via Cloudflare Tunnel" -ForegroundColor Cyan
