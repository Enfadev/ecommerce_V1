# Docker Helper Script untuk E-Commerce App (PowerShell)

$ErrorActionPreference = "Stop"

# Colors
$InfoColor = "Blue"
$SuccessColor = "Green"
$WarningColor = "Yellow"
$ErrorColor = "Red"

function Print-Info($message) {
    Write-Host "ℹ $message" -ForegroundColor $InfoColor
}

function Print-Success($message) {
    Write-Host "✓ $message" -ForegroundColor $SuccessColor
}

function Print-Warning($message) {
    Write-Host "⚠ $message" -ForegroundColor $WarningColor
}

function Print-Error($message) {
    Write-Host "✗ $message" -ForegroundColor $ErrorColor
}

function Check-Env {
    if (-not (Test-Path .env)) {
        Print-Warning ".env file tidak ditemukan!"
        Print-Info "Membuat .env dari .env.example..."
        Copy-Item .env.example .env
        Print-Success ".env file berhasil dibuat. Silakan edit konfigurasi di .env"
        exit 1
    }
}

function Dev-Up {
    Print-Info "Starting development environment..."
    Check-Env
    docker compose up --build
}

function Dev-Up-Detached {
    Print-Info "Starting development environment (detached)..."
    Check-Env
    docker compose up -d --build
    Print-Success "Containers running in background"
    Print-Info "Access app: http://localhost:3000"
}

function Dev-Watch {
    Print-Info "Starting development with watch mode..."
    Check-Env
    docker compose watch
}

function Prod-Up {
    Print-Info "Starting production environment..."
    Check-Env
    docker compose -f docker-compose.prod.yml up -d --build
    Print-Success "Production containers started"
}

function Stop-Containers {
    Print-Info "Stopping containers..."
    docker compose down
    Print-Success "Containers stopped"
}

function Stop-All {
    Print-Info "Stopping all containers and removing volumes..."
    docker compose down -v
    Print-Success "Containers and volumes removed"
}

function Show-Logs {
    param([string]$Service = "")
    Print-Info "Showing logs..."
    if ($Service) {
        docker compose logs -f $Service
    } else {
        docker compose logs -f
    }
}

function Exec-App {
    Print-Info "Opening shell in app container..."
    docker compose exec app sh
}

function Exec-DB {
    Print-Info "Opening shell in database container..."
    docker compose exec db bash
}

function Run-Migrate {
    Print-Info "Running database migrations..."
    docker compose exec app npx prisma migrate deploy
    Print-Success "Migrations completed"
}

function Run-Migrate-Dev {
    param([string]$Name)
    if (-not $Name) {
        Print-Error "Migration name required: .\docker.ps1 migrate:dev <name>"
        exit 1
    }
    Print-Info "Creating new migration..."
    docker compose exec app npx prisma migrate dev --name $Name
    Print-Success "Migration created: $Name"
}

function Run-Seed {
    Print-Info "Seeding database..."
    docker compose exec app npm run seed
    Print-Success "Database seeded"
}

function Open-Studio {
    Print-Info "Opening Prisma Studio..."
    docker compose exec app npm run prisma:studio
    Print-Info "Prisma Studio available at: http://localhost:5555"
}

function Reset-Database {
    Print-Warning "This will reset the database!"
    $confirmation = Read-Host "Are you sure? (y/N)"
    if ($confirmation -eq 'y' -or $confirmation -eq 'Y') {
        Print-Info "Resetting database..."
        docker compose exec app npm run prisma:reset
        Print-Success "Database reset completed"
    } else {
        Print-Info "Operation cancelled"
    }
}

function Rebuild-Containers {
    Print-Info "Rebuilding containers..."
    docker compose build --no-cache
    Print-Success "Rebuild completed"
}

function Restart-Containers {
    Print-Info "Restarting containers..."
    docker compose restart
    Print-Success "Containers restarted"
}

function Show-Status {
    Print-Info "Container status:"
    docker compose ps
}

function Clean-All {
    Print-Warning "This will remove all containers, volumes, and images!"
    $confirmation = Read-Host "Are you sure? (y/N)"
    if ($confirmation -eq 'y' -or $confirmation -eq 'Y') {
        Print-Info "Cleaning up..."
        docker compose down -v --rmi all
        Print-Success "Cleanup completed"
    } else {
        Print-Info "Operation cancelled"
    }
}

function Show-Help {
    Write-Host @"
Docker Helper Script - E-Commerce App

Usage: .\docker.ps1 <command> [arguments]

Commands:
  dev               Start development environment (foreground)
  dev:up            Start development environment (background)
  dev:watch         Start development with watch mode
  prod              Start production environment
  stop              Stop containers
  stop:all          Stop containers and remove volumes
  logs [service]    Show logs (optional: specify service)
  exec:app          Open shell in app container
  exec:db           Open shell in database container
  migrate           Run database migrations
  migrate:dev <name> Create new migration
  seed              Seed database
  studio            Open Prisma Studio
  reset             Reset database
  rebuild           Rebuild containers
  restart           Restart containers
  status            Show container status
  clean             Remove all containers, volumes, and images
  help              Show this help message

Examples:
  .\docker.ps1 dev              # Start in foreground
  .\docker.ps1 dev:up           # Start in background
  .\docker.ps1 dev:watch        # Start with watch mode
  .\docker.ps1 logs app         # Show app logs
  .\docker.ps1 migrate:dev init # Create migration named 'init'
  .\docker.ps1 seed             # Seed database

"@
}

# Main
$command = $args[0]
$additionalArgs = $args[1..($args.Length-1)]

switch ($command) {
    "dev" { Dev-Up }
    "dev:up" { Dev-Up-Detached }
    "dev:watch" { Dev-Watch }
    "prod" { Prod-Up }
    "stop" { Stop-Containers }
    "stop:all" { Stop-All }
    "logs" { Show-Logs -Service $additionalArgs[0] }
    "exec:app" { Exec-App }
    "exec:db" { Exec-DB }
    "migrate" { Run-Migrate }
    "migrate:dev" { Run-Migrate-Dev -Name $additionalArgs[0] }
    "seed" { Run-Seed }
    "studio" { Open-Studio }
    "reset" { Reset-Database }
    "rebuild" { Rebuild-Containers }
    "restart" { Restart-Containers }
    "status" { Show-Status }
    "clean" { Clean-All }
    default { Show-Help }
}
