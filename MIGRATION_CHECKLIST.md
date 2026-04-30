# ============================================================
# MemoriA Microservices - Quick Checklist
# ============================================================

## ✅ MIGRATION STEPS COMPLETED

### 1. ✅ Database Schema Created
- File: `setup-databases.sql`
- Action: Execute this SQL script
```sql
mysql -u root -p < setup-databases.sql
```

**Databases Created:**
- `planning_db` (Tables: reminders, adherence)
- `alerts_db` (Tables: alerts, alert_recipients, sms_notifications)

### 2. ✅ Planning Service Created
- Port: 8091
- Database: planning_db

**Files Created:**
```
MemoriA-Planning-Service/
├── pom.xml
├── src/main/java/MemorIA/
│   ├── PlanningServiceApplication.java
│   ├── entity/
│   │   ├── Reminder.java
│   │   └── Adherence.java
│   ├── repository/
│   │   ├── ReminderRepository.java
│   │   └── AdherenceRepository.java
│   ├── service/
│   │   ├── IReminderService.java
│   │   ├── IAdherenceService.java
│   │   ├── impl/ReminderServiceImpl.java
│   │   └── impl/AdherenceServiceImpl.java
│   └── controller/
│       ├── ReminderController.java
│       └── AdherenceController.java
├── src/main/resources/
│   └── application.yml (Configured)
```

**Endpoints Available:**
- POST /api/planning/reminders
- GET /api/planning/reminders/patient/{id}
- GET /api/planning/reminders/{id}
- PUT /api/planning/reminders/{id}
- DELETE /api/planning/reminders/{id}
- POST /api/planning/adherence
- GET /api/planning/adherence/patient/{id}
- GET /api/planning/adherence/patient/{id}/rate

### 3. ✅ Alerts Service Created
- Port: 8092
- Database: alerts_db

**Files Created:**
```
MemoriA-Alerts-Service/
├── pom.xml
├── src/main/java/MemorIA/
│   ├── AlertsServiceApplication.java
│   ├── entity/
│   │   ├── Alert.java
│   │   ├── AlertRecipient.java
│   │   └── SmsNotification.java
│   ├── repository/
│   │   ├── AlertRepository.java
│   │   ├── AlertRecipientRepository.java
│   │   └── SmsNotificationRepository.java
│   ├── service/
│   │   ├── IAlertService.java
│   │   ├── ISmsNotificationService.java
│   │   ├── impl/AlertServiceImpl.java
│   │   └── impl/SmsNotificationServiceImpl.java
│   └── controller/
│       ├── AlertController.java
│       └── SmsNotificationController.java
├── src/main/resources/
│   └── application.yml (Configured)
```

**Endpoints Available:**
- POST /api/alerts
- GET /api/alerts/patient/{id}
- GET /api/alerts/{id}
- PUT /api/alerts/{id}
- DELETE /api/alerts/{id}
- POST /api/alerts/sms
- GET /api/alerts/sms/alert/{id}
- GET /api/alerts/sms/pending

---

## ⏳ NEXT STEPS

### Step 1: Create Databases
```bash
# Execute the SQL setup script
mysql -u root -p < setup-databases.sql

# Verify databases were created
mysql -u root -p
> SHOW DATABASES;  # Should see: planning_db, alerts_db
> USE planning_db;
> SHOW TABLES;     # Should see: reminders, adherence
> USE alerts_db;
> SHOW TABLES;     # Should see: alerts, alert_recipients, sms_notifications
```

### Step 2: Verify MySQL Connection
```bash
# Test connection on port 3307
mysql -h localhost -P 3307 -u root -p

# If error, check:
# - MySQL is running on port 3307 (not default 3306)
# - Update application.yml if using different port/credentials
```

### Step 3: Start Services (Order Important!)
```bash
# Option A: Manual start in separate terminals
# Terminal 1 - Eureka Registry (FIRST)
cd MemoriA-dev/MemoriA-Registry
mvn spring-boot:run

# Wait 15 seconds, then Terminal 2
cd MemoriA-dev/MemoriA-Planning-Service
mvn spring-boot:run

# Wait 10 seconds, then Terminal 3
cd MemoriA-dev/MemoriA-Alerts-Service
mvn spring-boot:run

# Wait 10 seconds, then Terminal 4
cd MemoriA-dev/MemoriA-Gateway
mvn spring-boot:run

# Option B: Automated start (PowerShell)
./START_MICROSERVICES.ps1
```

### Step 4: Verify Services
```bash
# Check Eureka Dashboard
# URL: http://localhost:8761
# Should show:
# - PLANNING-SERVICE (port 8091)
# - ALERTS-SERVICE (port 8092)
# - MEMORIA-GATEWAY (port 8888)

# Test API Gateway
curl http://localhost:8888/actuator/health
# Response: {"status":"UP"}
```

### Step 5: Update Frontend
```bash
# File: src/environments/environment.ts
# Change:
apiUrl: 'http://localhost:8080/api'
# To:
apiUrl: 'http://localhost:8888/api'

# Save and restart: ng serve
```

### Step 6: Test End-to-End
```bash
# Create a Reminder
curl -X POST http://localhost:8888/api/planning/reminders \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": 1,
    "title": "Take medication",
    "description": "Morning dose",
    "scheduledDate": "2026-04-30T09:00:00"
  }'

# Create an Alert
curl -X POST http://localhost:8888/api/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": 1,
    "alertType": "MEDICATION_REMINDER",
    "message": "Please take your medication",
    "severity": "HIGH"
  }'

# Get Reminders
curl http://localhost:8888/api/planning/reminders/patient/1

# Get Alerts
curl http://localhost:8888/api/alerts/patient/1
```

---

## 🔍 VERIFICATION CHECKLIST

- [ ] ✅ MySQL running on port 3307
- [ ] ✅ Databases created (planning_db, alerts_db)
- [ ] ✅ Tables created with correct schema
- [ ] ✅ Eureka Registry starts on port 8761
- [ ] ✅ Planning Service starts on port 8091
- [ ] ✅ Alerts Service starts on port 8092
- [ ] ✅ API Gateway starts on port 8888
- [ ] ✅ All 3 services visible in Eureka Dashboard
- [ ] ✅ Frontend points to http://localhost:8888/api
- [ ] ✅ Can create reminder via API Gateway
- [ ] ✅ Can create alert via API Gateway
- [ ] ✅ Can list reminders and alerts

---

## 📊 PORTS REFERENCE

| Service | Port | Status |
|---------|------|--------|
| Eureka Registry | 8761 | Dashboard available |
| Planning Service | 8091 | Registered with Eureka |
| Alerts Service | 8092 | Registered with Eureka |
| API Gateway | 8888 | Routes to services |
| Frontend (Angular) | 4200 | Calls Gateway |
| MySQL Database | 3307 | Should be ready |

---

## 🆘 TROUBLESHOOTING

### Services not appearing in Eureka
- [ ] Is Eureka running? (Check http://localhost:8761)
- [ ] Did you wait 15 seconds before starting Planning Service?
- [ ] Check service logs for registration errors
- [ ] Verify eureka.client.serviceUrl in application.yml

### Cannot connect to database
- [ ] Is MySQL running? (ps aux | grep mysql)
- [ ] Check port 3307 not 3306 (default)
- [ ] Check username/password in application.yml
- [ ] Run: `mysql -h localhost -P 3307 -u root -p`
- [ ] Run setup-databases.sql if not done

### Gateway returning 503 Service Unavailable
- [ ] Services not registered with Eureka
- [ ] Wait 10+ seconds after service startup
- [ ] Check service logs for startup errors
- [ ] Verify DNS resolution: lb://planning-service

### Frontend CORS errors
- [ ] Make sure Frontend calls Gateway (8888) not direct services
- [ ] CorsConfig.java allows http://localhost:4200
- [ ] Check browser console (F12) for exact error

### Port already in use
- [ ] Check what's running: `netstat -ano | findstr :8091`
- [ ] Kill process: `taskkill /PID <PID> /F`
- [ ] Or change port in application.yml

---

## 📚 DOCUMENTATION FILES

- `MIGRATION_COMPLETE.md` - Complete migration details
- `FRONTEND_UPDATE_GUIDE.md` - How to update Frontend
- `START_MICROSERVICES.ps1` - Automated startup script
- `setup-databases.sql` - Database setup script

---

## 🎯 FINAL CHECKLIST

Before considering migration complete:

1. [ ] All 4 services (Eureka, Gateway, Planning, Alerts) running
2. [ ] All 3 services visible in Eureka Dashboard
3. [ ] MySQL databases created and populated
4. [ ] Frontend updated to use Gateway (8888)
5. [ ] Can create/read reminders via API
6. [ ] Can create/read alerts via API
7. [ ] Can view adherence rate
8. [ ] No CORS errors in browser console
9. [ ] SMS service ready (with Twilio credentials)
10. [ ] Documentation complete and working

---

**Current Status: ✅ READY FOR DATABASE SETUP AND SERVICE START**

Execute: `mysql -u root -p < setup-databases.sql`
Then: `./START_MICROSERVICES.ps1`
