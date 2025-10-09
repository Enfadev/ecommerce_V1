# =====================================
# Environment Setup Helper (PowerShell)
# =====================================
# Script untuk memudahkan setup environment di Windows

param(
    [Parameter(Position=0)]
    [string]$Environment
)

function Generate-Secret {
    param([int]$Length = 32)
    
    try {
        $bytes = New-Object byte[] $Length
        [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
        return [Convert]::ToBase64String($bytes)
    } catch {
        return "PLEASE_GENERATE_SECRET_$(Get-Date -Format 'yyyyMMddHHmmss')"
    }
}

Write-Host "🔧 Environment Setup Helper" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

if ($Environment -eq "local" -or $Environment -eq "dev") {
    Write-Host "📦 Setting up LOCAL development environment..." -ForegroundColor Green
    
    if (Test-Path .env) {
        Write-Host "⚠️  .env already exists!" -ForegroundColor Yellow
        $confirm = Read-Host "   Overwrite? (y/n)"
        if ($confirm -ne "y" -and $confirm -ne "Y") {
            Write-Host "❌ Cancelled." -ForegroundColor Red
            exit 1
        }
    }
    
    Copy-Item .env.local .env -Force
    Write-Host "✅ Copied .env.local to .env" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Local environment ready!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📝 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Run: npm run dev:docker" -ForegroundColor White
    Write-Host "   2. Or: npm run dev (without Docker)" -ForegroundColor White
    Write-Host "   3. Access: http://localhost:3000" -ForegroundColor White
    
} elseif ($Environment -eq "prod" -or $Environment -eq "production") {
    Write-Host "🚀 Setting up PRODUCTION environment..." -ForegroundColor Cyan
    Write-Host "⚠️  WARNING: This will create production config!" -ForegroundColor Yellow
    Write-Host ""
    
    if (Test-Path .env.production) {
        Write-Host "⚠️  .env.production already exists!" -ForegroundColor Yellow
        $confirm = Read-Host "   Overwrite? (y/n)"
        if ($confirm -ne "y" -and $confirm -ne "Y") {
            Write-Host "❌ Cancelled." -ForegroundColor Red
            exit 1
        }
    }
    
    Copy-Item .env.prod .env.production -Force
    
    Write-Host ""
    Write-Host "🔐 Generating secrets..." -ForegroundColor Cyan
    $nextauthSecret = Generate-Secret -Length 32
    $jwtSecret = Generate-Secret -Length 48
    $dbRootPassword = Generate-Secret -Length 32
    $dbPassword = Generate-Secret -Length 24
    
    Write-Host ""
    Write-Host "✅ Generated secrets:" -ForegroundColor Green
    Write-Host "   NEXTAUTH_SECRET=$nextauthSecret" -ForegroundColor White
    Write-Host "   JWT_SECRET=$jwtSecret" -ForegroundColor White
    Write-Host "   DB_ROOT_PASSWORD=$dbRootPassword" -ForegroundColor White
    Write-Host "   DB_PASSWORD=$dbPassword" -ForegroundColor White
    Write-Host ""
    Write-Host "📝 Next steps:" -ForegroundColor Yellow
    Write-Host "   1. Edit .env.production"
    Write-Host "   2. Update domain, OAuth, Stripe, PayPal credentials"
    Write-Host "   3. Replace generated secrets above"
    Write-Host "   4. Deploy: docker-compose -f docker-compose.prod.yml up -d"
    
} elseif ($Environment -eq "secrets") {
    Write-Host "🔐 Generating new secrets..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "NEXTAUTH_SECRET (32 chars):" -ForegroundColor Yellow
    Write-Host (Generate-Secret -Length 32) -ForegroundColor White
    Write-Host ""
    Write-Host "JWT_SECRET (48 chars):" -ForegroundColor Yellow
    Write-Host (Generate-Secret -Length 48) -ForegroundColor White
    Write-Host ""
    Write-Host "DB_ROOT_PASSWORD (32 chars):" -ForegroundColor Yellow
    Write-Host (Generate-Secret -Length 32) -ForegroundColor White
    Write-Host ""
    Write-Host "DB_PASSWORD (24 chars):" -ForegroundColor Yellow
    Write-Host (Generate-Secret -Length 24) -ForegroundColor White
    
} else {
    Write-Host "Usage: .\setup-env.ps1 [local|prod|secrets]" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  local, dev        - Setup local development environment"
    Write-Host "  prod, production  - Setup production environment"
    Write-Host "  secrets           - Generate new secrets"
    Write-Host ""
    Write-Host "Examples:"
    Write-Host "  .\setup-env.ps1 local"
    Write-Host "  .\setup-env.ps1 prod"
    Write-Host "  .\setup-env.ps1 secrets"
    exit 1
}

Write-Host ""
Write-Host "📚 For more info, see: ENV_GUIDE.md" -ForegroundColor Cyan
