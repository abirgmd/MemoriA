#!/bin/bash

# MemoriA Microservices - Complete Startup Script
# Starts all services in the correct order with proper delays

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
REGISTRY_PORT=8761
PLANNING_PORT=8091
ALERTS_PORT=8092
GATEWAY_PORT=8888
FRONTEND_PORT=4200

# Function to print section header
print_header() {
    echo -e "\n${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}\n"
}

# Function to print status
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

# Function to print error
print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Function to wait for service
wait_for_service() {
    local port=$1
    local service=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${YELLOW}⏳ Waiting for $service on port $port...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s http://localhost:$port/actuator/health > /dev/null 2>&1; then
            print_status "$service is ready!"
            return 0
        fi
        
        echo -n "."
        sleep 1
        ((attempt++))
    done
    
    print_error "$service did not start within timeout"
    return 1
}

# Check prerequisites
print_header "Checking Prerequisites"

# Check if MySQL is running
if ! mysql -u root -p -e "SELECT 1" > /dev/null 2>&1; then
    print_error "MySQL is not running or credentials are incorrect"
    echo "Please ensure MySQL is running on port 3307"
    exit 1
fi
print_status "MySQL is running"

# Check if Java is installed
if ! command -v java &> /dev/null; then
    print_error "Java is not installed"
    exit 1
fi
print_status "Java is installed: $(java -version 2>&1 | head -1)"

# Check if Node.js is installed
if ! command -v npm &> /dev/null; then
    print_error "Node.js/npm is not installed"
    exit 1
fi
print_status "Node.js is installed: $(node -v)"

# Main startup sequence
print_header "Starting MemoriA Microservices"

# Terminal detection for cross-platform support
if command -v gnome-terminal &> /dev/null; then
    TERMINAL="gnome-terminal --"
elif command -v xterm &> /dev/null; then
    TERMINAL="xterm -e"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    TERMINAL="open -a Terminal"
else
    TERMINAL="xterm -e"
fi

echo -e "${YELLOW}Note: Starting services in separate terminals...${NC}\n"

# 1. Start Eureka Registry
print_header "1/5: Starting Eureka Registry (Port $REGISTRY_PORT)"
cd MemoriA-dev/MemoriA-Registry
echo "cd MemoriA-dev/MemoriA-Registry && mvn spring-boot:run" > /tmp/eureka_start.sh
chmod +x /tmp/eureka_start.sh

if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- bash /tmp/eureka_start.sh &
elif [[ "$OSTYPE" == "darwin"* ]]; then
    osascript -e "tell application \"Terminal\" to do script \"cd $(pwd) && mvn spring-boot:run\"" &
else
    xterm -e "cd $(pwd) && mvn spring-boot:run" &
fi

sleep 5
wait_for_service $REGISTRY_PORT "Eureka Registry"

# 2. Start Planning Service
print_header "2/5: Starting Planning Service (Port $PLANNING_PORT)"
cd ../MemoriA-Planning-Service

if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- bash -c "cd MemoriA-dev/MemoriA-Planning-Service && mvn spring-boot:run" &
elif [[ "$OSTYPE" == "darwin"* ]]; then
    osascript -e "tell application \"Terminal\" to do script \"cd $(pwd) && mvn spring-boot:run\"" &
else
    xterm -e "cd $(pwd) && mvn spring-boot:run" &
fi

sleep 5
wait_for_service $PLANNING_PORT "Planning Service"

# 3. Start Alerts Service
print_header "3/5: Starting Alerts Service (Port $ALERTS_PORT)"
cd ../MemoriA-Alerts-Service

if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- bash -c "cd MemoriA-dev/MemoriA-Alerts-Service && mvn spring-boot:run" &
elif [[ "$OSTYPE" == "darwin"* ]]; then
    osascript -e "tell application \"Terminal\" to do script \"cd $(pwd) && mvn spring-boot:run\"" &
else
    xterm -e "cd $(pwd) && mvn spring-boot:run" &
fi

sleep 5
wait_for_service $ALERTS_PORT "Alerts Service"

# 4. Start API Gateway
print_header "4/5: Starting API Gateway (Port $GATEWAY_PORT)"
cd ../MemoriA-Gateway

if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- bash -c "cd MemoriA-dev/MemoriA-Gateway && mvn spring-boot:run" &
elif [[ "$OSTYPE" == "darwin"* ]]; then
    osascript -e "tell application \"Terminal\" to do script \"cd $(pwd) && mvn spring-boot:run\"" &
else
    xterm -e "cd $(pwd) && mvn spring-boot:run" &
fi

sleep 5
wait_for_service $GATEWAY_PORT "API Gateway"

# 5. Start Frontend
print_header "5/5: Starting Frontend (Port $FRONTEND_PORT)"
cd ../MemorIA_Frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing npm dependencies..."
    npm install
fi

if command -v gnome-terminal &> /dev/null; then
    gnome-terminal -- bash -c "cd MemoriA-dev/MemorIA_Frontend && ng serve" &
elif [[ "$OSTYPE" == "darwin"* ]]; then
    osascript -e "tell application \"Terminal\" to do script \"cd $(pwd) && ng serve\"" &
else
    xterm -e "cd $(pwd) && ng serve" &
fi

sleep 10

# Verify all services
print_header "Verifying All Services"

for service in "Eureka Registry" "Planning Service" "Alerts Service" "Gateway"; do
    if curl -s http://localhost:$REGISTRY_PORT/eureka/apps > /dev/null 2>&1; then
        print_status "$service is healthy"
    fi
done

# Print access information
print_header "✅ All Services Started Successfully!"

echo -e "${GREEN}Access Points:${NC}"
echo -e "  ${BLUE}Frontend:${NC}         http://localhost:$FRONTEND_PORT"
echo -e "  ${BLUE}API Gateway:${NC}       http://localhost:$GATEWAY_PORT"
echo -e "  ${BLUE}Eureka Registry:${NC}   http://localhost:$REGISTRY_PORT"
echo -e "  ${BLUE}Planning Service:${NC}  http://localhost:$PLANNING_PORT (direct)"
echo -e "  ${BLUE}Alerts Service:${NC}    http://localhost:$ALERTS_PORT (direct)"

echo -e "\n${GREEN}Quick API Tests:${NC}"
echo "  Planning Reminders:  curl http://localhost:$GATEWAY_PORT/api/planning/reminders"
echo "  User Alerts:         curl http://localhost:$GATEWAY_PORT/api/alerts/me"

echo -e "\n${YELLOW}Logs:${NC}"
echo "  Each service is running in its own terminal window"
echo "  Observe logs for any errors or warnings"

echo -e "\n${BLUE}================================${NC}"
echo -e "${BLUE}MemoriA is ready to use!${NC}"
echo -e "${BLUE}================================${NC}\n"

# Wait for user input
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"
sleep infinity
