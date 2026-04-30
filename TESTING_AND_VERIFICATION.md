# TESTING_AND_VERIFICATION.md

## Pre-Deployment Testing Checklist

### Phase 1: Infrastructure Verification

#### 1.1 MySQL Database Check
- [ ] MySQL running on port 3307
  ```bash
  mysql -h localhost -P 3307 -u root -p
  ```

- [ ] Databases created
  ```sql
  SHOW DATABASES;
  -- Should see: auth_db, users_db, chat_db, planning_db, alerts_db
  ```

- [ ] Schemas initialized
  ```bash
  mysql -u root -p auth_db < MemoriA-dev/MemoriA-Auth-Service/src/main/resources/init.sql
  mysql -u root -p users_db < MemoriA-dev/MemoriA-User-Service/src/main/resources/init.sql
  mysql -u root -p chat_db < MemoriA-dev/MemoriA-Chat-Service/src/main/resources/init.sql
  ```

#### 1.2 Maven & Java Check
- [ ] Maven installed: `mvn --version` (should be 3.6+)
- [ ] Java installed: `java --version` (should be 17+)
- [ ] JAVA_HOME set correctly

#### 1.3 Port Availability
- [ ] Ports 8761, 8093, 8094, 8091, 8092, 8095, 8888 are free
  ```bash
  netstat -ano | findstr :8761
  netstat -ano | findstr :8093
  # etc.
  ```

### Phase 2: Individual Service Tests

#### 2.1 Registry Service (Port 8761)
```bash
# Start service
cd MemoriA-dev\MemoriA-Registry
mvn spring-boot:run

# Test
curl http://localhost:8761
# Should get HTML response (Eureka dashboard)
```

✓ Verify:
- [ ] Service starts without errors
- [ ] Console shows: "Eureka Server initialized"
- [ ] Dashboard accessible at http://localhost:8761

#### 2.2 Auth Service (Port 8093)
```bash
# Start service
cd MemoriA-dev\MemoriA-Auth-Service
mvn spring-boot:run

# Test signup
curl -X POST http://localhost:8093/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@memoria.com",
    "password": "test123",
    "firstName": "Test",
    "lastName": "User",
    "role": "PATIENT"
  }'

# Expected response:
# {
#   "id": 1,
#   "email": "test@memoria.com",
#   "token": "eyJhbGc...",
#   "message": "Signup successful"
# }
```

✓ Verify:
- [ ] Service starts without errors
- [ ] Registered with Eureka (check dashboard)
- [ ] Signup endpoint returns JWT token
- [ ] Login endpoint works with valid credentials
- [ ] Invalid credentials return 401 Unauthorized
- [ ] Verify endpoint validates tokens correctly

#### 2.3 User Service (Port 8094)
```bash
# Start service
cd MemoriA-dev\MemoriA-User-Service
mvn spring-boot:run

# Test create patient
curl -X POST http://localhost:8094/api/users/patients \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "firstName": "Jean",
    "lastName": "Patient",
    "email": "jean@example.com",
    "phone": "+33612345678",
    "medicalConditions": "Hypertension"
  }'

# Test get patient
curl http://localhost:8094/api/users/patients/1
```

✓ Verify:
- [ ] Service starts without errors
- [ ] Registered with Eureka
- [ ] Create patient returns patient ID
- [ ] Get patient returns patient data
- [ ] List patients returns all patients
- [ ] Soignant and Accompagnant endpoints work

#### 2.4 Chat Service (Port 8095)
```bash
# Start service
cd MemoriA-dev\MemoriA-Chat-Service
mvn spring-boot:run

# Test send message
curl -X POST http://localhost:8095/api/chat/send \
  -H "Content-Type: application/json" \
  -d '{
    "senderId": 1,
    "recipientId": 2,
    "message": "Hello World"
  }'

# Test get conversation
curl http://localhost:8095/api/chat/conversation/1/2
```

✓ Verify:
- [ ] Service starts without errors
- [ ] Registered with Eureka
- [ ] Send message returns message ID
- [ ] Get conversation returns sorted messages
- [ ] Unread messages endpoint works
- [ ] Mark as read updates status

#### 2.5 Planning Service (Port 8091)
```bash
# Start service
cd MemoriA-dev\MemoriA-Planning-Service
mvn spring-boot:run

# Test (depends on existing endpoints)
curl http://localhost:8091/api/planning/reminders/patient/1
```

✓ Verify:
- [ ] Service starts without errors
- [ ] Connected to planning_db
- [ ] Registered with Eureka
- [ ] Existing endpoints still work

#### 2.6 Alerts Service (Port 8092)
```bash
# Start service
cd MemoriA-dev\MemoriA-Alerts-Service
mvn spring-boot:run

# Test (depends on existing endpoints)
curl http://localhost:8092/api/alerts/patient/1
```

✓ Verify:
- [ ] Service starts without errors
- [ ] Connected to alerts_db
- [ ] Registered with Eureka
- [ ] Existing endpoints still work

#### 2.7 Gateway (Port 8888)
```bash
# Start service AFTER all others
cd MemoriA-dev\MemoriA-Gateway
mvn spring-boot:run

# Test routing - should get 404 not found, but routing works
curl -v http://localhost:8888/api/auth/verify
# Should see: HTTP/1.1 401 or 200 (depending on implementation)
```

✓ Verify:
- [ ] Gateway starts without errors
- [ ] Registered with Eureka
- [ ] All services visible in Eureka dashboard
- [ ] Routes configured for: /api/auth/**, /api/users/**, /api/planning/**, /api/alerts/**, /api/chat/**

### Phase 3: Integration Tests (Through Gateway)

#### 3.1 Authentication Flow Through Gateway
```bash
# 1. Signup through gateway
curl -X POST http://localhost:8888/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "gateway-test@memoria.com",
    "password": "test123",
    "firstName": "Gateway",
    "lastName": "Test",
    "role": "DOCTOR"
  }'

# 2. Extract token from response (JWT token)
# TOKEN="eyJhbGc..."

# 3. Login through gateway
curl -X POST http://localhost:8888/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "gateway-test@memoria.com",
    "password": "test123"
  }'

# 4. Verify token through gateway
curl -X POST http://localhost:8888/api/auth/verify \
  -H "Authorization: Bearer $TOKEN"
```

✓ Verify:
- [ ] Gateway routes /api/auth/** to Auth Service
- [ ] JWT tokens can be used across services
- [ ] All auth endpoints accessible through gateway

#### 3.2 User Management Through Gateway
```bash
# Get user ID from auth response (let's say it's 1)

# Create patient profile
curl -X POST http://localhost:8888/api/users/patients \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "firstName": "Dr. Gateway",
    "lastName": "Test",
    "email": "gateway@example.com",
    "medicalConditions": "None"
  }'

# Get patient
curl http://localhost:8888/api/users/patients/1
```

✓ Verify:
- [ ] Gateway routes /api/users/** to User Service
- [ ] User profiles created and retrieved
- [ ] Patient, Soignant, Accompagnant endpoints all work

#### 3.3 Chat Through Gateway
```bash
# Send message through gateway
curl -X POST http://localhost:8888/api/chat/send \
  -H "Content-Type: application/json" \
  -d '{
    "senderId": 1,
    "recipientId": 2,
    "message": "Gateway test message"
  }'

# Get conversation
curl http://localhost:8888/api/chat/conversation/1/2
```

✓ Verify:
- [ ] Gateway routes /api/chat/** to Chat Service
- [ ] Messages sent and retrieved through gateway

#### 3.4 Planning Through Gateway
```bash
curl http://localhost:8888/api/planning/reminders/patient/1
```

✓ Verify:
- [ ] Gateway routes /api/planning/** to Planning Service

#### 3.5 Alerts Through Gateway
```bash
curl http://localhost:8888/api/alerts/patient/1
```

✓ Verify:
- [ ] Gateway routes /api/alerts/** to Alerts Service

### Phase 4: Service Discovery Tests

#### 4.1 Eureka Registration
```bash
# Open browser
http://localhost:8761

# Should see registered instances:
# - auth-service (8093)
# - user-service (8094)
# - planning-service (8091)
# - alerts-service (8092)
# - chat-service (8095)
# - memoria-gateway (8888)
```

✓ Verify:
- [ ] All 6 services appear in Eureka dashboard
- [ ] Status of each service is UP
- [ ] Available replicas = 1 for each service

#### 4.2 Load Balancing
```bash
# Multiple calls to gateway should be distributed
# (If there were multiple instances)
# For now, just verify gateway is using Eureka:
curl http://localhost:8888/actuator/health
# Should show status: UP
```

✓ Verify:
- [ ] Gateway health check shows UP
- [ ] Service discovery configured

### Phase 5: Frontend Integration Tests

#### 5.1 Frontend Configuration
```typescript
// Check MemoriA_Frontend/src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8888'  // Should be Gateway
};
```

✓ Verify:
- [ ] apiUrl is set to http://localhost:8888

#### 5.2 Frontend Login Flow
```bash
# Start frontend
cd MemoriA-dev\MemoriA_Frontend
npm install
ng serve

# Open browser http://localhost:4200
# Try to login with:
# Email: test@memoria.com
# Password: test123

# Check browser console for:
# - POST /api/auth/login
# - Token stored in localStorage
# - Redirect to dashboard
```

✓ Verify:
- [ ] Frontend starts without errors
- [ ] Login page loads
- [ ] Login request goes to /api/auth/login
- [ ] JWT token received and stored
- [ ] User can access protected routes
- [ ] Can create/view patients
- [ ] Can send/receive messages
- [ ] All features accessible

#### 5.3 API Calls Through Gateway
```bash
# Check browser network tab while using frontend
# All calls should go to http://localhost:8888/api/**
# - http://localhost:8888/api/auth/login
# - http://localhost:8888/api/users/patients
# - http://localhost:8888/api/chat/send
# - http://localhost:8888/api/planning/reminders
# - http://localhost:8888/api/alerts
```

✓ Verify:
- [ ] All frontend calls route through Gateway
- [ ] Response times are acceptable
- [ ] No CORS errors
- [ ] JWT tokens properly included in headers

### Phase 6: Performance & Stability Tests

#### 6.1 Load Test
```bash
# Send multiple requests to each service
for i in {1..10}; do
  curl -s http://localhost:8888/api/users/patients | head -c 100
done
```

✓ Verify:
- [ ] All requests succeed
- [ ] No timeouts
- [ ] Consistent response times

#### 6.2 Error Handling
```bash
# Test invalid endpoints
curl http://localhost:8888/api/auth/invalid-endpoint
# Should return 404

# Test invalid data
curl -X POST http://localhost:8888/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "wrong@example.com", "password": "wrong"}'
# Should return 401
```

✓ Verify:
- [ ] Error responses are appropriate
- [ ] No unexpected server errors
- [ ] Proper HTTP status codes

#### 6.3 Long-Running Stability
```bash
# Monitor services for 5+ minutes
# Check:
# - No memory leaks in console
# - No repeated errors
# - Response times stable
# - Services remain registered with Eureka
```

✓ Verify:
- [ ] Services remain stable
- [ ] No resource exhaustion
- [ ] Eureka registration maintained

### Phase 7: Cleanup & Decommissioning

#### 7.1 Backup Old Backend
```bash
# Before deletion, backup the monolithic backend
Copy-Item -Path "MemoriA_Backend" -Destination "MemoriA_Backend.backup" -Recurse
```

✓ Verify:
- [ ] Backup created successfully

#### 7.2 Verify No Dependencies
```bash
# Search codebase for any references to old backend
grep -r "MemoriA_Backend" .
# Should return no matches in active code
```

✓ Verify:
- [ ] No references to old backend in:
  - [ ] Frontend code
  - [ ] Microservices code
  - [ ] Documentation
  - [ ] Configuration files

#### 7.3 Delete Old Backend (After Full Verification)
```bash
# Only after all tests pass
Remove-Item -Path "MemoriA_Backend" -Recurse -Force
```

✓ Verify:
- [ ] Old backend deleted
- [ ] All microservices still working
- [ ] Frontend still functional

## Test Results Summary

| Test Category | Status | Notes |
|---------------|--------|-------|
| Infrastructure | ✓/✗ | Database, Maven, Ports |
| Registry | ✓/✗ | Eureka dashboard accessible |
| Auth Service | ✓/✗ | Signup, Login, Verify working |
| User Service | ✓/✗ | Patient, Soignant, Accompagnant CRUD |
| Chat Service | ✓/✗ | Send, Get, Unread, Mark-read |
| Planning Service | ✓/✗ | Existing endpoints working |
| Alerts Service | ✓/✗ | Existing endpoints working |
| Gateway | ✓/✗ | All routes configured |
| Service Discovery | ✓/✗ | All services registered |
| Frontend | ✓/✗ | Login, API calls through gateway |
| Integration | ✓/✗ | End-to-end flow working |
| Performance | ✓/✗ | No timeouts, stable |
| Cleanup | ✓/✗ | Old backend removed |

## Common Issues & Troubleshooting

### Issue: Service won't start
```
Error: "Could not resolve placeholder 'jwt.secret'"
Solution: Check application.yml has jwt.secret configured
```

### Issue: Gateway routing fails
```
Error: "503 Service Unavailable"
Solution: Verify service is registered with Eureka first
```

### Issue: Database connection error
```
Error: "Connection refused"
Solution: Verify MySQL running on port 3307, database exists
```

### Issue: JWT validation fails
```
Error: "Invalid token"
Solution: Verify JWT secret is same across all services
```

### Issue: Frontend can't reach backend
```
Error: "CORS error" or "Failed to fetch"
Solution: Check environment.apiUrl is http://localhost:8888
```

## Sign-Off

- [ ] All tests passed
- [ ] No critical issues remaining
- [ ] Performance acceptable
- [ ] Frontend integration complete
- [ ] Ready for production deployment
- [ ] Old backend removed/archived
- [ ] Documentation updated

**Tested By**: _________________ **Date**: _________

**Approved By**: ________________ **Date**: _________
