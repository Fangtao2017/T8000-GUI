-- 1. 创建数据库 (如果不存在)
CREATE DATABASE IF NOT EXISTS t8000_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. 创建专用用户 (用户名: t8000_user, 密码: t8000_password)
-- 注意: 在生产环境中请使用更复杂的密码
CREATE USER IF NOT EXISTS 't8000_user'@'%' IDENTIFIED BY 't8000_password';

-- 3. 赋予权限
GRANT ALL PRIVILEGES ON t8000_db.* TO 't8000_user'@'%';
FLUSH PRIVILEGES;

-- 4. 使用数据库
USE t8000_db;

-- 5. 创建一个示例表：设备表
CREATE TABLE IF NOT EXISTS devices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45),
    status VARCHAR(20) DEFAULT 'offline',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. 插入一些测试数据
INSERT INTO devices (name, ip_address, status) VALUES 
('Sensor-001', '192.168.1.101', 'online'),
('Gateway-A', '192.168.1.1', 'online'),
('Camera-Front', '192.168.1.50', 'offline');
