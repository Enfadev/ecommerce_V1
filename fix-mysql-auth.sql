-- Script untuk memperbaiki MySQL Authentication Plugin Error
-- Jalankan di MySQL Command Line atau MySQL Workbench

-- 1. Connect sebagai root
-- mysql -u root -p

-- 2. Check current authentication plugin
SELECT user, host, plugin FROM mysql.user WHERE user = 'root';

-- 3. Update root user untuk menggunakan mysql_native_password
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';

-- 4. Jika Anda ingin menggunakan password, ganti '' dengan password Anda
-- ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';

-- 5. Flush privileges
FLUSH PRIVILEGES;

-- 6. Create database jika belum ada
CREATE DATABASE IF NOT EXISTS ecommerce_db_v1;

-- 7. Verify authentication plugin changed
SELECT user, host, plugin FROM mysql.user WHERE user = 'root';

-- 8. Test connection (opsional - buat user khusus untuk aplikasi)
-- CREATE USER 'ecommerce_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password123';
-- GRANT ALL PRIVILEGES ON ecommerce_db_v1.* TO 'ecommerce_user'@'localhost';
-- FLUSH PRIVILEGES;
