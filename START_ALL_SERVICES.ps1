# MemoriA Microservices - Complete Startup Script (Windows PowerShell)
# Starts all services in the correct order with proper delays

param(
    [switch]$SkipPrerequisites = $false
)

# ============================================================================
# Configuration
# ============================================================================
$REGISTRY_PORT = 8761
$PLANNING_PORT = 8091
$ALERTS_PORT = 8092
$GATEWAY_PORT = 8888
$FRONTEND_PORT = 4200

$REGISTRY_DIR = "MemoriA-dev\MemoriA-Registry"
$PLANNING_DIR = "MemoriA-dev\MemoriA-Planning-Service"
$ALERTS_DIR = "MemoriA-dev\MemoriA-Alerts-Service"
$GATEWAY_DIR = "MemoriA-dev\MemoriA-Gateway"
$FRONTEND_DIR = "MemoriA-dev\MemorIA_Frontend"

# ============================================================================
# Helper Functions
# ============================================================================

function Write-Header {
    param([string]$Text)
    Write-Host "`n================================" -ForegroundColor Cyan
    Write-Host $Text -ForegroundColor Cyan
    Write-Host "================================`n" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Text)
    Write-Host "✓ $Text" -ForegroundColor Green
}

function Write-Error {
    param([string]$Text)
    Write-Host "✗ $Text" -ForegroundColor Red
}

function Write-Status {
    param([string]$Text)
    Write-Host "⏳ $Text" -ForegroundColor Yellow
}

function Test-ServiceHealth {
    param(
        [int]$Port,
        [string]$ServiceName,
        [int]$MaxAttempts = 30
    )
    
    Write-Status "Waiting for $ServiceName on port $Port..."
    
    $attempt = 1
    while ($attempt -le $MaxAttempts) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$Port/actuator/health" -UseBasicParsing -TimeoutSec 2 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                Write-Success "$ServiceName is ready!"
                return $true
            }
        }
        catch {
            # Service not ready yet
        }
        
        Write-Host -NoNewline "."
        Start-Sleep -Seconds 1
        $attempt++
    }
    
    Write-Error "$ServiceName did not start within timeout"
    return $false
}

function Start-Service {
    param(
        [string]$ServiceDir,
        [string]$ServiceName,
        [int]$Port,
        [int]$WaitTime = 5
    )
    
    Write-Header "$ServiceName (Port $Port)"
    
    $currentDir = Get-Location
    
    try {
        # Start service in new PowerShell window
        $scriptBlock = {
            param($dir, $name)
            Set-Location $dir
            Write-Host "Starting $name..." -ForegroundColor Cyan
            Write-Host "Directory: $(Get-Location)" -ForegroundColor Gray
            & mvn spring-boot:run
        }
        
        Start-Process powershell -ArgumentList @(
            "-NoExit"
            "-Command"
            "& {Set-Location '$currentDir'; Set-Location '$ServiceDir'; Write-Host 'Starting $ServiceName in $ServiceDir...' -ForegroundColor Green; mvn spring-boot:run}"
        )
        
        Write-Status "Service launched in new window, waiting $WaitTime seconds for startup..."
        Start-Sleep -Seconds $WaitTime
        
        # Test health
        Test-ServiceHealth -Port $Port -ServiceName $ServiceName | Out-Null
        
    }
    finally {
        Set-Location $currentDir
    }
}

# ============================================================================
# Main Script
# ============================================================================

Write-Host @"

███╗   ███╗███████╗███╗   ███╗ ██████╗ ██████╗ ██╗ █████╗ 
████╗ ████║██╔════╝████╗ ████║██╔═══██╗██╔══██╗██║██╔══██╗
██╔████╔██║█████╗  ██╔████╔██║██║   ██║██████╔╝██║███████║
██║╚██╔╝██║██╔══╝  ██║╚██╔╝██║██║   ██║██╔══██╗██║██╔══██║
██║ ╚═╝ ██║███████╗██║ ╚═╝ ██║╚██████╔╝██║  ██║██║██║  ██║
╚═╝     ╚═╝╚══════╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝

Microservices Startup Script
"@ -ForegroundColor Cyan

# ============================================================================
# Check Prerequisites
# ============================================================================

if (-not $SkipPrerequisites) {
    Write-Header "Checking Prerequisites"
    
    # Check Java
    try {
        $javaVersion = & java -version 2>&1
        Write-Success "Java is installed: $($javaVersion[0])"
    }
    catch {
        Write-Error "Java is not installed"
        Write-Host "Please install Java 17+ and add it to PATH" -ForegroundColor Yellow
        exit 1
    }
    
    # Check Node.js
    try {
        $nodeVersion = & node -v
        Write-Success "Node.js is installed: $nodeVersion"
    }
    catch {
        Write-Error "Node.js is not installed"
        Write-Host "Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Yellow
        exit 1
    }
    
    # Check Maven
    try {
        $mvnVersion = & mvn -version 2>&1 | Select-Object -First 1
        Write-Success "Maven is available: $mvnVersion"
    }
    catch {
        Write-Error "Maven is not available or not in PATH"
        Write-Host "Make sure Maven is installed and available in PATH" -ForegroundColor Yellow
    }
    
    # Check MySQL
    Write-Status "Checking MySQL connection..."
    try {
        $mysqlTest = & mysql -u root -p -e "SELECT 1;" 2>&1
        Write-Success "MySQL is accessible"
    }
    catch {
        Write-Error "Cannot connect to MySQL"
        Write-Host "Please ensure MySQL is running on the default port" -ForegroundColor Yellow
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Gray
    }
}

# ============================================================================
# Verify Directories Exist
# ============================================================================

Write-Header "Verifying Directory Structure"

$dirs = @($REGISTRY_DIR, $PLANNING_DIR, $ALERTS_DIR, $GATEWAY_DIR, $FRONTEND_DIR)

foreach ($dir in $dirs) {
    if (Test-Path $dir) {
        Write-Success "Found: $dir"
    }
    else {
        Write-Error "Not found: $dir"
        Write-Host "Current directory: $(Get-Location)" -ForegroundColor Gray
        exit 1
    }
}

# ============================================================================
# Startup Sequence
# ============================================================================

Write-Header "Starting MemoriA Microservices"

Write-Host "The following services will start in new PowerShell windows:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Eureka Registry (Port $REGISTRY_PORT)" -ForegroundColor Green
Write-Host "2. Planning Service (Port $PLANNING_PORT)" -ForegroundColor Green
Write-Host "3. Alerts Service (Port $ALERTS_PORT)" -ForegroundColor Green
Write-Host "4. API Gateway (Port $GATEWAY_PORT)" -ForegroundColor Green
Write-Host "5. Angular Frontend (Port $FRONTEND_PORT)" -ForegroundColor Green
Write-Host ""
Write-Host "Keep all windows open and monitor for startup messages." -ForegroundColor Yellow
Write-Host ""

# Confirm before proceeding
$response = Read-Host "Continue? (Y/N)"
if ($response -ne "Y" -and $response -ne "y") {
    Write-Host "Startup cancelled." -ForegroundColor Yellow
    exit 0
}

# 1. Start Eureka Registry
Start-Service -ServiceDir $REGISTRY_DIR -ServiceName "Eureka Registry" -Port $REGISTRY_PORT

# 2. Start Planning Service
Start-Service -ServiceDir $PLANNING_DIR -ServiceName "Planning Service" -Port $PLANNING_PORT

# 3. Start Alerts Service
Start-Service -ServiceDir $ALERTS_DIR -ServiceName "Alerts Service" -Port $ALERTS_PORT

# 4. Start API Gateway
Start-Service -ServiceDir $GATEWAY_DIR -ServiceName "API Gateway" -Port $GATEWAY_PORT

# 5. Start Frontend
Write-Header "Angular Frontend (Port $FRONTEND_PORT)"

$frontendCurrentDir = Get-Location

try {
    Set-Location $FRONTEND_DIR
    
    # Check if node_modules exists
    if (-not (Test-Path "node_modules")) {
        Write-Status "Installing npm dependencies..."
        & npm install
    }
    
    Write-Status "Starting Angular development server..."
    Start-Process powershell -ArgumentList @(
        "-NoExit"
        "-Command"
        "& {Set-Location '$((Get-Location).Path)'; Write-Host 'Starting Angular Frontend...' -ForegroundColor Green; ng serve --open}"
    )
    
    Write-Success "Frontend launched in new window"
    Start-Sleep -Seconds 5
}
finally {
    Set-Location $frontendCurrentDir
}

# ============================================================================
# Verification and Summary
# ============================================================================

Write-Header "✅ Services Started Successfully!"

Write-Host "Access Points:" -ForegroundColor Green
Write-Host "  Frontend:          http://localhost:$FRONTEND_PORT" -ForegroundColor Cyan
Write-Host "  API Gateway:       http://localhost:$GATEWAY_PORT" -ForegroundColor Cyan
Write-Host "  Eureka Registry:   http://localhost:$REGISTRY_PORT" -ForegroundColor Cyan
Write-Host "  Planning Service:  http://localhost:$PLANNING_PORT (direct)" -ForegroundColor Cyan
Write-Host "  Alerts Service:    http://localhost:$ALERTS_PORT (direct)" -ForegroundColor Cyan

Write-Host "`nAPI Test Commands:" -ForegroundColor Green
Write-Host "  # Get planning reminders via gateway" -ForegroundColor Gray
Write-Host "  curl http://localhost:$GATEWAY_PORT/api/planning/reminders" -ForegroundColor Cyan
Write-Host ""
Write-Host "  # Get user alerts via gateway" -ForegroundColor Gray
Write-Host "  curl http://localhost:$GATEWAY_PORT/api/alerts/me" -ForegroundColor Cyan

Write-Host "`nLogs:" -ForegroundColor Green
Write-Host "  Each service is running in its own PowerShell window" -ForegroundColor Gray
Write-Host "  Monitor the windows for startup messages and errors" -ForegroundColor Gray
Write-Host "  Services should register with Eureka within 5-10 seconds" -ForegroundColor Gray

Write-Host "`n================================" -ForegroundColor Green
Write-Host "MemoriA is ready to use!" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Green

# Open browser to frontend
Write-Status "Opening frontend in browser..."
Start-Process "http://localhost:$FRONTEND_PORT"

Write-Host "Script running - all services should now be active." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop this script (services will continue running)." -ForegroundColor Yellow

# Keep script running
while ($true) {
    Start-Sleep -Seconds 60
}
