-- Script untuk membuat database di MySQL Laragon
-- Jalankan di HeidiSQL atau phpMyAdmin

CREATE DATABASE IF NOT EXISTS ecommerce_db_v1 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Optional: Create user untuk production (ganti password)
-- CREATE USER 'ecommerce_user'@'localhost' IDENTIFIED BY 'secure_password_here';
-- GRANT ALL PRIVILEGES ON ecommerce_db_v1.* TO 'ecommerce_user'@'localhost';
-- FLUSH PRIVILEGES;

USE ecommerce_db_v1;
