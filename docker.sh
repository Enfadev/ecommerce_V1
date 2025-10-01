#!/bin/bash

# Docker Helper Script untuk E-Commerce App

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

print_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

print_error() {
    echo -e "${RED}✗ ${1}${NC}"
}

check_env() {
    if [ ! -f .env ]; then
        print_warning ".env file tidak ditemukan!"
        print_info "Membuat .env dari .env.example..."
        cp .env.example .env
        print_success ".env file berhasil dibuat. Silakan edit konfigurasi di .env"
        exit 1
    fi
}

dev_up() {
    print_info "Starting development environment..."
    check_env
    docker compose up --build
}

dev_up_detached() {
    print_info "Starting development environment (detached)..."
    check_env
    docker compose up -d --build
    print_success "Containers running in background"
    print_info "Access app: http://localhost:3000"
}

dev_watch() {
    print_info "Starting development with watch mode..."
    check_env
    docker compose watch
}

prod_up() {
    print_info "Starting production environment..."
    check_env
    docker compose -f docker-compose.prod.yml up -d --build
    print_success "Production containers started"
}

stop() {
    print_info "Stopping containers..."
    docker compose down
    print_success "Containers stopped"
}

stop_all() {
    print_info "Stopping all containers and removing volumes..."
    docker compose down -v
    print_success "Containers and volumes removed"
}

logs() {
    print_info "Showing logs..."
    docker compose logs -f "${@:2}"
}

exec_app() {
    print_info "Executing command in app container..."
    docker compose exec app sh
}

exec_db() {
    print_info "Executing command in database container..."
    docker compose exec db bash
}

migrate() {
    print_info "Running database migrations..."
    docker compose exec app npx prisma migrate deploy
    print_success "Migrations completed"
}

migrate_dev() {
    print_info "Creating new migration..."
    if [ -z "$2" ]; then
        print_error "Migration name required: ./docker.sh migrate:dev <name>"
        exit 1
    fi
    docker compose exec app npx prisma migrate dev --name "$2"
    print_success "Migration created: $2"
}

seed() {
    print_info "Seeding database..."
    docker compose exec app npm run seed
    print_success "Database seeded"
}

studio() {
    print_info "Opening Prisma Studio..."
    docker compose exec app npm run prisma:studio
    print_info "Prisma Studio available at: http://localhost:5555"
}

reset_db() {
    print_warning "This will reset the database!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Resetting database..."
        docker compose exec app npm run prisma:reset
        print_success "Database reset completed"
    else
        print_info "Operation cancelled"
    fi
}

rebuild() {
    print_info "Rebuilding containers..."
    docker compose build --no-cache
    print_success "Rebuild completed"
}

restart() {
    print_info "Restarting containers..."
    docker compose restart
    print_success "Containers restarted"
}

status() {
    print_info "Container status:"
    docker compose ps
}

clean() {
    print_warning "This will remove all containers, volumes, and images!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Cleaning up..."
        docker compose down -v --rmi all
        print_success "Cleanup completed"
    else
        print_info "Operation cancelled"
    fi
}

help() {
    cat << EOF
Docker Helper Script - E-Commerce App

Usage: ./docker.sh <command>

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
  ./docker.sh dev              # Start in foreground
  ./docker.sh dev:up           # Start in background
  ./docker.sh dev:watch        # Start with watch mode
  ./docker.sh logs app         # Show app logs
  ./docker.sh migrate:dev init # Create migration named 'init'
  ./docker.sh seed             # Seed database

EOF
}

# Main
case "$1" in
    dev)
        dev_up
        ;;
    dev:up)
        dev_up_detached
        ;;
    dev:watch)
        dev_watch
        ;;
    prod)
        prod_up
        ;;
    stop)
        stop
        ;;
    stop:all)
        stop_all
        ;;
    logs)
        logs "$@"
        ;;
    exec:app)
        exec_app
        ;;
    exec:db)
        exec_db
        ;;
    migrate)
        migrate
        ;;
    migrate:dev)
        migrate_dev "$@"
        ;;
    seed)
        seed
        ;;
    studio)
        studio
        ;;
    reset)
        reset_db
        ;;
    rebuild)
        rebuild
        ;;
    restart)
        restart
        ;;
    status)
        status
        ;;
    clean)
        clean
        ;;
    help|*)
        help
        ;;
esac
