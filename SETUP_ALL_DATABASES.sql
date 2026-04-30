-- MemoriA Microservices - Complete Database Setup
-- Execute this script in MySQL to create all databases and tables

-- ===== USERS DATABASE =====
CREATE DATABASE IF NOT EXISTS users_db;
USE users_db;

-- Main Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    role VARCHAR(50) NOT NULL,
    actif BOOLEAN DEFAULT true,
    profile_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Patients Table
CREATE TABLE IF NOT EXISTS patients (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    address VARCHAR(255),
    city VARCHAR(100),
    zip_code VARCHAR(20),
    medical_conditions LONGTEXT,
    allergies LONGTEXT,
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_id (user_id)
);

-- Soignants (Healthcare Providers) Table
CREATE TABLE IF NOT EXISTS soignants (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    speciality VARCHAR(100),
    license VARCHAR(100),
    hospital VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_id (user_id)
);

-- Accompagnants (Caregivers) Table
CREATE TABLE IF NOT EXISTS accompagnants (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    relation VARCHAR(100),
    address VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_id (user_id)
);

-- ===== PLANNING DATABASE =====
CREATE DATABASE IF NOT EXISTS planning_db;
USE planning_db;

-- Reminders Table
CREATE TABLE IF NOT EXISTS reminders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT,
    reminder_type VARCHAR(50) NOT NULL,
    reminder_status VARCHAR(50) DEFAULT 'PENDING',
    scheduled_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_patient_id (patient_id),
    INDEX idx_status (reminder_status),
    INDEX idx_scheduled_at (scheduled_at)
);

-- Adherence Table
CREATE TABLE IF NOT EXISTS adherence (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    reminder_id BIGINT,
    adherence_date DATE NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    completed_at DATETIME,
    notes LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reminder_id) REFERENCES reminders(id),
    INDEX idx_patient_id (patient_id),
    INDEX idx_adherence_date (adherence_date)
);

-- ===== ALERTS DATABASE =====
CREATE DATABASE IF NOT EXISTS alerts_db;
USE alerts_db;

-- Alerts Table
CREATE TABLE IF NOT EXISTS alerts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    alert_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description LONGTEXT,
    severity VARCHAR(50),
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    resolved_at DATETIME,
    INDEX idx_patient_id (patient_id),
    INDEX idx_status (status),
    INDEX idx_severity (severity)
);

-- Alert Recipients Table (who to notify)
CREATE TABLE IF NOT EXISTS alert_recipients (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    alert_id BIGINT NOT NULL,
    recipient_id BIGINT NOT NULL,
    recipient_type VARCHAR(50),
    notified_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alert_id) REFERENCES alerts(id),
    INDEX idx_alert_id (alert_id)
);

-- SMS Notifications Table
CREATE TABLE IF NOT EXISTS sms_notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    alert_id BIGINT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    message LONGTEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    sent_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alert_id) REFERENCES alerts(id),
    INDEX idx_alert_id (alert_id),
    INDEX idx_status (status)
);

-- ===== TEST DATA (Optional) =====
USE users_db;

-- Insert sample users
INSERT INTO users (email, password, nom, prenom, telephone, role, actif, profile_completed) 
VALUES 
('doctor@memoria.com', '$2a$10$ZX7u1AuLPvBGfAoB4r.r2OPST9/PgBkqquzi.Ss7KIUgO2t0jYHDm', 'Dupont', 'Jean', '0123456789', 'DOCTOR', true, true),
('patient@memoria.com', '$2a$10$ZX7u1AuLPvBGfAoB4r.r2OPST9/PgBkqquzi.Ss7KIUgO2t0jYHDm', 'Martin', 'Marie', '0987654321', 'PATIENT', true, false),
('caregiver@memoria.com', '$2a$10$ZX7u1AuLPvBGfAoB4r.r2OPST9/PgBkqquzi.Ss7KIUgO2t0jYHDm', 'Bernard', 'Pierre', '0555555555', 'CAREGIVER', true, true);

-- Note: All test passwords are "password123" (hashed with BCrypt)

SHOW DATABASES;
