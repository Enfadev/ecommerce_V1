#!/bin/bash

# =====================================
# Environment Setup Helper
# =====================================
# Script untuk memudahkan setup environment

set -e

echo "🔧 Environment Setup Helper"
echo "============================"
echo ""

# Function to generate secret
generate_secret() {
    openssl rand -base64 $1 2>/dev/null || echo "PLEASE_GENERATE_SECRET_$(date +%s)"
}

# Check which environment to setup
if [ "$1" = "local" ] || [ "$1" = "dev" ]; then
    echo "📦 Setting up LOCAL development environment..."
    
    if [ -f .env ]; then
        echo "⚠️  .env already exists!"
        read -p "   Overwrite? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "❌ Cancelled."
            exit 1
        fi
    fi
    
    cp .env.local .env
    echo "✅ Copied .env.local to .env"
    echo ""
    echo "🎉 Local environment ready!"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Run: npm run dev:docker"
    echo "   2. Or: npm run dev (without Docker)"
    echo "   3. Access: http://localhost:3000"
    
elif [ "$1" = "prod" ] || [ "$1" = "production" ]; then
    echo "🚀 Setting up PRODUCTION environment..."
    echo "⚠️  WARNING: This will create production config!"
    echo ""
    
    if [ -f .env.production ]; then
        echo "⚠️  .env.production already exists!"
        read -p "   Overwrite? (y/n) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "❌ Cancelled."
            exit 1
        fi
    fi
    
    cp .env.prod .env.production
    
    echo ""
    echo "🔐 Generating secrets..."
    NEXTAUTH_SECRET=$(generate_secret 32)
    JWT_SECRET=$(generate_secret 48)
    DB_ROOT_PASSWORD=$(generate_secret 32)
    DB_PASSWORD=$(generate_secret 24)
    
    echo ""
    echo "✅ Generated secrets:"
    echo "   NEXTAUTH_SECRET=$NEXTAUTH_SECRET"
    echo "   JWT_SECRET=$JWT_SECRET"
    echo "   DB_ROOT_PASSWORD=$DB_ROOT_PASSWORD"
    echo "   DB_PASSWORD=$DB_PASSWORD"
    echo ""
    echo "📝 Next steps:"
    echo "   1. Edit .env.production"
    echo "   2. Update domain, OAuth, Stripe, PayPal credentials"
    echo "   3. Replace generated secrets above"
    echo "   4. Set permission: chmod 600 .env.production"
    echo "   5. Deploy: docker-compose -f docker-compose.prod.yml up -d"
    
elif [ "$1" = "secrets" ]; then
    echo "🔐 Generating new secrets..."
    echo ""
    echo "NEXTAUTH_SECRET (32 chars):"
    generate_secret 32
    echo ""
    echo "JWT_SECRET (48 chars):"
    generate_secret 48
    echo ""
    echo "DB_ROOT_PASSWORD (32 chars):"
    generate_secret 32
    echo ""
    echo "DB_PASSWORD (24 chars):"
    generate_secret 24
    
else
    echo "Usage: ./setup-env.sh [local|prod|secrets]"
    echo ""
    echo "Commands:"
    echo "  local, dev        - Setup local development environment"
    echo "  prod, production  - Setup production environment"
    echo "  secrets           - Generate new secrets"
    echo ""
    echo "Examples:"
    echo "  ./setup-env.sh local"
    echo "  ./setup-env.sh prod"
    echo "  ./setup-env.sh secrets"
    exit 1
fi

echo ""
echo "📚 For more info, see: ENV_GUIDE.md"
