-- ================================================
-- MemoriA Microservices - Database Setup Script
-- ================================================

-- Create planning_db
CREATE DATABASE IF NOT EXISTS planning_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE planning_db;

-- Reminders table
CREATE TABLE IF NOT EXISTS reminders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    reminder_type VARCHAR(50),
    reminder_status VARCHAR(50) DEFAULT 'PENDING',
    scheduled_date DATETIME NOT NULL,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    INDEX idx_patient_id (patient_id),
    INDEX idx_status (reminder_status),
    INDEX idx_scheduled_date (scheduled_date)
);

-- Adherence table
CREATE TABLE IF NOT EXISTS adherence (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    reminder_id BIGINT,
    adherence_date DATE NOT NULL,
    adherence_status VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reminder_id) REFERENCES reminders(id) ON DELETE SET NULL,
    INDEX idx_patient_id (patient_id),
    INDEX idx_adherence_date (adherence_date)
);

-- ================================================
-- Create alerts_db
CREATE DATABASE IF NOT EXISTS alerts_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE alerts_db;

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    alert_type VARCHAR(50) NOT NULL,
    alert_category VARCHAR(50),
    alert_status VARCHAR(50) DEFAULT 'PENDING',
    message TEXT NOT NULL,
    severity VARCHAR(20),
    triggered_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_date TIMESTAMP NULL,
    INDEX idx_patient_id (patient_id),
    INDEX idx_status (alert_status),
    INDEX idx_triggered_date (triggered_date)
);

-- Alert recipients table
CREATE TABLE IF NOT EXISTS alert_recipients (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    alert_id BIGINT NOT NULL,
    recipient_id BIGINT NOT NULL,
    notification_status VARCHAR(50) DEFAULT 'PENDING',
    notification_date TIMESTAMP NULL,
    FOREIGN KEY (alert_id) REFERENCES alerts(id) ON DELETE CASCADE,
    INDEX idx_alert_id (alert_id)
);

-- SMS notifications table
CREATE TABLE IF NOT EXISTS sms_notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    alert_id BIGINT,
    recipient_phone VARCHAR(20),
    message TEXT,
    sent_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    delivery_status VARCHAR(50),
    twilio_sid VARCHAR(100),
    FOREIGN KEY (alert_id) REFERENCES alerts(id) ON DELETE SET NULL
);

-- ================================================
-- Verification
SHOW DATABASES;
USE planning_db;
SHOW TABLES;
USE alerts_db;
SHOW TABLES;
