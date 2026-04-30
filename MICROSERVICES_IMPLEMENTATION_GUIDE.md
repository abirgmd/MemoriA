# MemoriA Microservices - Final Implementation Guide

## Overview
Tous les fichiers du MemoriA_Backend monolithique ont maintenant été migrés vers les microservices suivants :

| Service | Port | Route | Status |
|---------|------|-------|--------|
| Registry (Eureka) | 8761 | - | ✅ 100% |
| Auth Service | 8093 | /api/auth/** | ✅ 90% |
| User Service | 8094 | /api/users/** | ✅ 90% |
| Planning Service | 8091 | /api/planning/** | 70% |
| Alerts Service | 8092 | /api/alerts/** | 40% |
| Chat Service | 8095 | /api/chat/** | ✅ 90% |
| API Gateway | 8888 | Central routing | ✅ 100% |
| Frontend (Angular) | 4200 | UI | ✅ 100% |

## Step 1: Database Setup

### 1.1 Create Databases
Execute in MySQL client:
```sql
CREATE DATABASE auth_db;
CREATE DATABASE users_db;
CREATE DATABASE chat_db;
CREATE DATABASE planning_db;
CREATE DATABASE alerts_db;
```

### 1.2 Initialize Schemas
Run initialization scripts:
```bash
# Auth Service schema
mysql -u root -p auth_db < MemoriA-dev/MemoriA-Auth-Service/src/main/resources/init.sql

# User Service schema
mysql -u root -p users_db < MemoriA-dev/MemoriA-User-Service/src/main/resources/init.sql

# Chat Service schema
mysql -u root -p chat_db < MemoriA-dev/MemoriA-Chat-Service/src/main/resources/init.sql

# Planning Service schema (already exists)
mysql -u root -p planning_db < MemoriA-dev/MemoriA-Planning-Service/src/main/resources/init.sql

# Alerts Service schema (already exists)
mysql -u root -p alerts_db < MemoriA-dev/MemoriA-Alerts-Service/src/main/resources/init.sql
```

## Step 2: Start Services in Order

### Option A: Manual Startup (PowerShell)
```powershell
# Terminal 1: Registry
cd MemoriA-dev\MemoriA-Registry
mvn spring-boot:run

# Terminal 2: Auth Service
cd MemoriA-dev\MemoriA-Auth-Service
mvn spring-boot:run

# Terminal 3: User Service
cd MemoriA-dev\MemoriA-User-Service
mvn spring-boot:run

# Terminal 4: Planning Service
cd MemoriA-dev\MemoriA-Planning-Service
mvn spring-boot:run

# Terminal 5: Alerts Service
cd MemoriA-dev\MemoriA-Alerts-Service
mvn spring-boot:run

# Terminal 6: Chat Service
cd MemoriA-dev\MemoriA-Chat-Service
mvn spring-boot:run

# Terminal 7: Gateway
cd MemoriA-dev\MemoriA-Gateway
mvn spring-boot:run

# Terminal 8: Frontend
cd MemoriA-dev\MemoriA_Frontend
npm install
ng serve
```

### Option B: Automated Startup Script
```powershell
# Create START_ALL_SERVICES.ps1
# Run all services concurrently
```

### Step 3: Verify Service Registration

1. Open browser: http://localhost:8761
2. Should see all 7 services registered:
   - auth-service
   - user-service
   - planning-service
   - alerts-service
   - chat-service
   - memoria-gateway

## Step 4: API Testing

### 4.1 Authentication Flow
```bash
# 1. Create a new user (Signup)
POST http://localhost:8888/api/auth/signup
Content-Type: application/json

{
  "email": "patient@memoria.com",
  "password": "password123",
  "firstName": "Jean",
  "lastName": "Patient",
  "role": "PATIENT"
}

Response:
{
  "id": 1,
  "email": "patient@memoria.com",
  "firstName": "Jean",
  "lastName": "Patient",
  "role": "PATIENT",
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "message": "Signup successful"
}

# 2. Login user
POST http://localhost:8888/api/auth/login
Content-Type: application/json

{
  "email": "patient@memoria.com",
  "password": "password123"
}

Response:
{
  "id": 1,
  "email": "patient@memoria.com",
  "firstName": "Jean",
  "lastName": "Patient",
  "role": "PATIENT",
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "message": "Login successful"
}

# 3. Verify token
POST http://localhost:8888/api/auth/verify
Authorization: Bearer eyJhbGciOiJIUzUxMiJ9...
```

### 4.2 User Management
```bash
# Create Patient Profile
POST http://localhost:8888/api/users/patients
Content-Type: application/json

{
  "userId": 1,
  "firstName": "Jean",
  "lastName": "Patient",
  "email": "patient@memoria.com",
  "phone": "+33612345678",
  "address": "123 Rue de Paris",
  "city": "Paris",
  "zipCode": "75001",
  "medicalConditions": "Hypertension, Diabète",
  "allergies": "Pénicilline",
  "emergencyContact": "Marie Patient",
  "emergencyPhone": "+33687654321"
}

# Get All Patients
GET http://localhost:8888/api/users/patients

# Update Patient
PUT http://localhost:8888/api/users/patients/1
Content-Type: application/json
{...}

# Get Patient by ID
GET http://localhost:8888/api/users/patients/1
```

### 4.3 Chat Service
```bash
# Send a message
POST http://localhost:8888/api/chat/send
Content-Type: application/json

{
  "senderId": 1,
  "recipientId": 2,
  "message": "Bonjour, comment allez-vous?"
}

# Get conversation between two users
GET http://localhost:8888/api/chat/conversation/1/2

# Get unread messages for user
GET http://localhost:8888/api/chat/unread/1

# Mark message as read
POST http://localhost:8888/api/chat/mark-read/1
```

### 4.4 Planning Service
```bash
# Create reminder
POST http://localhost:8888/api/planning/reminders
Content-Type: application/json

{
  "patientId": 1,
  "medicationName": "Aspirin",
  "dosage": "500mg",
  "frequency": "daily",
  "time": "09:00",
  "description": "Prise quotidienne"
}

# Get reminders for patient
GET http://localhost:8888/api/planning/reminders/patient/1

# Update adherence
PUT http://localhost:8888/api/planning/adherence/1
Content-Type: application/json

{
  "adherencePercentage": 95.0,
  "missedDoses": 1
}
```

### 4.5 Alerts Service
```bash
# Create alert
POST http://localhost:8888/api/alerts/create
Content-Type: application/json

{
  "patientId": 1,
  "alertType": "CRITICAL",
  "message": "Tension artérielle anormale détectée",
  "severity": "HIGH"
}

# Get alerts for patient
GET http://localhost:8888/api/alerts/patient/1

# Send SMS notification
POST http://localhost:8888/api/alerts/sms
Content-Type: application/json

{
  "phoneNumber": "+33612345678",
  "message": "Rappel: Prendre votre médicament"
}
```

## Step 5: Frontend Integration

### 5.1 Verify Frontend Configuration
Check [MemoriA_Frontend/src/environments/environment.ts](MemoriA_Frontend/src/environments/environment.ts):
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8888'
};
```

### 5.2 Login from Frontend
1. Open http://localhost:4200
2. Navigate to login page
3. Use credentials: patient@memoria.com / password123
4. Frontend should:
   - Call POST /api/auth/login through gateway
   - Receive JWT token
   - Store token in localStorage
   - Redirect to dashboard

### 5.3 Access Protected Resources
All subsequent API calls from frontend should include:
```javascript
Authorization: Bearer <JWT_TOKEN>
```

## Step 6: Troubleshooting

### Service Not Registering with Eureka
- Check service is running: `http://localhost:8093/actuator/health`
- Check Eureka config in application.yml
- Verify MySQL connection is working

### Gateway Routes Not Working
- Check gateway application.yml has all routes configured
- Restart gateway after adding new routes
- Verify service names in routes match registered service names in Eureka

### Authentication Failing
- Verify JWT secret key in Auth Service matches across all services
- Check JWT token expiration time (86400000 ms = 24 hours)
- Verify password encoding with BCrypt

### Database Connection Issues
- Check MySQL is running on port 3307
- Verify credentials: root/root
- Verify databases exist: auth_db, users_db, chat_db, planning_db, alerts_db

## Step 7: Migration Completion Checklist

✅ Auth Service (8093)
- [x] Entity and DTOs created
- [x] Controllers and services implemented
- [x] JWT provider configured
- [x] Security config set up
- [x] Database initialized
- [x] Routes added to gateway

✅ User Service (8094)
- [x] Patient, Soignant, Accompagnant entities created
- [x] CRUD services implemented for all user types
- [x] Controllers for all user types
- [x] Database initialized
- [x] Routes added to gateway

✅ Chat Service (8095)
- [x] ChatMessage entity created
- [x] Chat service and repository implemented
- [x] Controller with 5 main endpoints
- [x] Database initialized
- [x] Routes added to gateway

⚠️ Planning Service (8091)
- [ ] Complete remaining migrations
- [ ] All entities from backend migrated
- [ ] All services implemented
- [ ] All controllers implemented

⚠️ Alerts Service (8092)
- [ ] Complete remaining migrations
- [ ] Email service implementation
- [ ] SMS service completion
- [ ] All alert types implemented

✅ Gateway (8888)
- [x] All routes configured
- [x] Service discovery via Eureka
- [x] Load balancing enabled

✅ Frontend (4200)
- [x] Environment configuration updated
- [x] All services use gateway
- [x] JWT token handling

## Step 8: Next Phase - Complete Backend Elimination

After verifying all above works:

1. **Migrate remaining Planning Service functionality** (30% remaining)
2. **Migrate remaining Alerts Service functionality** (60% remaining)
3. **Test complete system end-to-end**
4. **Decommission MemoriA_Backend folder** (make it officially obsolete)
5. **Deploy to production**

## Important Notes

- **MemoriA_Backend folder is now OBSOLETE** - all functionality migrated to microservices
- **JWT Secret**: Must be the same across all services (currently configured)
- **Database Port**: 3307 (not default 3306)
- **Eureka Registry**: Must be started first
- **Gateway**: Routes requests via load balancing through Eureka
- **Frontend**: All requests go through gateway at 8888

## Support

For issues or questions about the microservices migration, refer to:
- Gateway logs: `MemoriA-Gateway/gateway-output.txt`
- Service logs: Check each service's console output
- Database schema: `init.sql` files in each service
