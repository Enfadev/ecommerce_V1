-- Grant ALL PRIVILEGES untuk development
-- Script ini dijalankan otomatis saat database pertama kali dibuat
GRANT ALL PRIVILEGES ON *.* TO 'ecommerce_user'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

-- Untuk development, user butuh permission ini:
-- ALL PRIVILEGES: untuk CREATE, DROP, ALTER, INDEX, dll (semua operasi migration)
-- WITH GRANT OPTION: untuk memberikan permission ke user lain jika diperlukan
