# 🚀 Quick Start Guide - MemoriA Microservices

## ⚡ 5-Minute Quick Start

### Windows (PowerShell)
```powershell
# Navigate to project root
cd MemoriA-planning

# Run startup script
.\START_ALL_SERVICES.ps1
```

### Linux/Mac (Bash)
```bash
# Navigate to project root
cd MemoriA-planning

# Make script executable
chmod +x START_ALL_SERVICES.sh

# Run startup script
./START_ALL_SERVICES.sh
```

---

## 📍 Service Endpoints

| Service | Port | URL | Type |
|---------|------|-----|------|
| Frontend | 4200 | http://localhost:4200 | Angular App |
| API Gateway | 8888 | http://localhost:8888 | Load Balancer |
| Planning Service | 8091 | http://localhost:8091 | Spring Boot |
| Alerts Service | 8092 | http://localhost:8092 | Spring Boot |
| Eureka Registry | 8761 | http://localhost:8761 | Service Discovery |

---

## 🔗 API Routes (via Gateway)

### Planning Service
```
GET    http://localhost:8888/api/planning/reminders
POST   http://localhost:8888/api/planning/reminders
PUT    http://localhost:8888/api/planning/reminders/{id}
DELETE http://localhost:8888/api/planning/reminders/{id}
```

### Alerts Service
```
GET    http://localhost:8888/api/alerts/me
POST   http://localhost:8888/api/alerts
PUT    http://localhost:8888/api/alerts/{id}
DELETE http://localhost:8888/api/alerts/{id}
```

---

## 🧪 Quick Test Commands

```bash
# Test Gateway is up
curl http://localhost:8888/actuator/health

# Test Planning Service via Gateway
curl http://localhost:8888/api/planning/reminders

# Test Alerts Service via Gateway
curl http://localhost:8888/api/alerts/me

# Test Planning Service directly
curl http://localhost:8091/api/planning/reminders

# Test Alerts Service directly
curl http://localhost:8092/api/alerts/me

# Check Eureka Registry
curl http://localhost:8761/eureka/apps
```

---

## 📋 Service Startup Order

1. **Eureka Registry** (8761)
2. **Planning Service** (8091)
3. **Alerts Service** (8092)
4. **API Gateway** (8888)
5. **Frontend** (4200)

> **Tip:** Each service needs 5-10 seconds to register with Eureka. Wait for confirmation in logs.

---

## ✅ Verification Checklist

- [ ] All 5 service windows opened
- [ ] Eureka Registry shows 3 registered services
- [ ] Gateway shows "Started MemoriA Gateway"
- [ ] Frontend shows "Compiled successfully"
- [ ] Browser opens to http://localhost:4200
- [ ] Network requests go to :8888 (check DevTools)

---

## 🐛 Troubleshooting

### Service won't start
```bash
# Check if port is in use
netstat -an | grep LISTEN | grep 8091
# Kill process if needed (Windows)
netstat -ano | findstr :8091
taskkill /PID <PID> /F
```

### Gateway returns 503
```bash
# Check Eureka Registry
curl http://localhost:8761/eureka/apps

# Verify services are registered
# Should see: PLANNING-SERVICE, ALERTS-SERVICE, MEMORIA-GATEWAY
```

### Frontend can't reach API
```bash
# Check frontend is using correct URL
# Open DevTools → Network tab
# API calls should go to: http://localhost:8888

# Check environment.ts
cat MemoriA-dev/MemorIA_Frontend/src/environments/environment.ts
# Should have: apiUrl: 'http://localhost:8888'
```

### MySQL connection issues
```bash
# Check MySQL is running
mysql -u root -p
# Enter password: root

# Verify databases exist
SHOW DATABASES;
# Should include: planning_db, alerts_db
```

---

## 📚 Documentation Links

- **Full Integration Guide**: [MICROSERVICES_INTEGRATION_COMPLETE.md](./MICROSERVICES_INTEGRATION_COMPLETE.md)
- **Microservices Setup**: [MICROSERVICES_SETUP.md](./MICROSERVICES_SETUP.md)
- **Migration Checklist**: [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md)
- **Architecture**: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)

---

## 🎯 Common Tasks

### View Frontend Logs
```bash
# In the Frontend terminal window
# Check browser console (F12)
# Angular compilation status
# HTTP requests
```

### View Backend Logs
```bash
# Check the respective service terminal window
# Look for: "Tomcat started on port 809X"
# Look for: "Successfully registered with Eureka"
# Look for: any error messages
```

### Restart a Service
```bash
# Stop: Press Ctrl+C in service window
# Start: Run the startup script again or:
cd MemoriA-dev/<SERVICE-DIR>
mvn spring-boot:run
```

### Change Database
Edit `application.yml` in each service:
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3307/planning_db
    username: root
    password: root
```

---

## 📞 Getting Help

If services don't start:
1. Check all prerequisites are installed (Java 17+, Node 18+, MySQL running)
2. Verify port 8761, 8091, 8092, 8888, 4200 are not in use
3. Check application.yml files have correct MySQL credentials
4. Review logs in each service terminal for error messages
5. See TROUBLESHOOTING section in [MICROSERVICES_INTEGRATION_COMPLETE.md](./MICROSERVICES_INTEGRATION_COMPLETE.md)

---

## 🎉 You're All Set!

MemoriA is now running as a modern microservices architecture. Each service can be:
- Scaled independently
- Deployed separately
- Debugged individually
- Monitored in real-time

Happy coding! 🚀
