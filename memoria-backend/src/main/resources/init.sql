-- Run this once to create the database
-- psql -U postgres -c "CREATE DATABASE memoria_db;"

-- Tables are auto-created by Hibernate (spring.jpa.hibernate.ddl-auto=update)
-- This file contains useful seed data for testing

-- Insert test users (password = "password123" BCrypt encoded)
INSERT INTO users (email, password, nom, prenom, telephone, role)
VALUES
  ('docteur@memoria.fr', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBpwTqyVkUONXi', 'Martin', 'Sophie', '0612345678', 'soignant'),
  ('accompagnant@memoria.fr', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBpwTqyVkUONXi', 'Bernard', 'Paul', '0698765432', 'accompagnant'),
  ('patient@memoria.fr', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBpwTqyVkUONXi', 'Dupont', 'Jean', '0711223344', 'patient')
ON CONFLICT (email) DO NOTHING;
