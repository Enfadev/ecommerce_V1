#!/bin/bash

# Production Deployment Script
# Usage: ./deploy-production.sh

set -e

echo "🚀 Starting Production Deployment..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env.production exists
if [ ! -f .env.production ]; then
    echo -e "${RED}❌ Error: .env.production file not found!${NC}"
    echo "Please create .env.production with production configurations"
    exit 1
fi

# Load production environment
export $(cat .env.production | grep -v '^#' | xargs)

echo -e "${YELLOW}📋 Pre-deployment Checklist:${NC}"
echo "1. ✅ .env.production exists"
echo "2. ⏳ Checking Docker..."

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed!${NC}"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo -e "${RED}❌ Docker daemon is not running!${NC}"
    exit 1
fi

echo "   ✅ Docker is ready"

# Pull latest changes (optional, comment if deploying from local)
echo -e "${YELLOW}📥 Pulling latest changes...${NC}"
git pull origin main || echo "⚠️  Git pull failed or not a git repo"

# Stop existing containers
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker compose -f docker-compose.prod.yml down || true

# Remove old images (optional, saves space)
echo -e "${YELLOW}🧹 Cleaning up old images...${NC}"
docker image prune -f || true

# Build and start services
echo -e "${YELLOW}🏗️  Building production images...${NC}"
docker compose -f docker-compose.prod.yml build --no-cache

echo -e "${YELLOW}🚀 Starting production services...${NC}"
docker compose -f docker-compose.prod.yml up -d

# Wait for services to be healthy
echo -e "${YELLOW}⏳ Waiting for services to be healthy...${NC}"
sleep 10

# Check health
echo -e "${YELLOW}🏥 Checking service health...${NC}"
for i in {1..30}; do
    if docker compose -f docker-compose.prod.yml ps | grep -q "unhealthy"; then
        echo "   ⏳ Waiting... ($i/30)"
        sleep 2
    else
        break
    fi
done

# Show status
echo -e "${GREEN}✅ Deployment completed!${NC}"
echo ""
echo -e "${YELLOW}📊 Container Status:${NC}"
docker compose -f docker-compose.prod.yml ps

echo ""
echo -e "${YELLOW}📝 Quick Commands:${NC}"
echo "  View logs:      docker compose -f docker-compose.prod.yml logs -f"
echo "  View app logs:  docker compose -f docker-compose.prod.yml logs -f app"
echo "  View db logs:   docker compose -f docker-compose.prod.yml logs -f db"
echo "  Stop services:  docker compose -f docker-compose.prod.yml down"
echo "  Restart:        docker compose -f docker-compose.prod.yml restart"
echo ""
echo -e "${GREEN}🎉 Application is now running!${NC}"
echo -e "   Access via Cloudflare Tunnel: ${NEXTAUTH_URL}"
