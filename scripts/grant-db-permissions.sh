#!/bin/sh
# Script to grant necessary permissions to database user for Prisma Migrate

echo "🔑 Granting ALL PRIVILEGES to ecommerce_user for development..."

docker compose exec db mysql -u root -p"${DB_ROOT_PASSWORD:-rootpassword}" -e "
GRANT ALL PRIVILEGES ON *.* TO '${DB_USER:-ecommerce_user}'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
SELECT User, Host FROM mysql.user WHERE User = '${DB_USER:-ecommerce_user}';
"

echo "✅ Permissions granted successfully!"
echo ""
echo "You can now run:"
echo "  npm run docker:migrate"
echo "or"
echo "  docker compose exec app npx prisma migrate dev"
