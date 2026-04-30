# MemoriA Microservices - Complete Startup Script (Windows)
# Usage: .\START_ALL_COMPLETE_SERVICES.ps1

$ErrorActionPreference = "Stop"

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "MemoriA Microservices - Full Startup" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Function to run command in new terminal tab
function Start-ServiceInNewTab {
    param(
        [string]$ServiceName,
        [string]$ServicePath,
        [string]$ServicePort,
        [string]$Command
    )
    
    $title = "$ServiceName (Port $ServicePort)"
    Write-Host "Starting $title..." -ForegroundColor Green
    
    $pinfo = New-Object System.Diagnostics.ProcessStartInfo
    $pinfo.FileName = "cmd.exe"
    $pinfo.Arguments = "/k title $title && cd /d `"$ServicePath`" && $Command"
    $pinfo.UseShellExecute = $true
    
    [System.Diagnostics.Process]::Start($pinfo) | Out-Null
    Start-Sleep -Seconds 2
}

# Check if MySQL is running
Write-Host "Checking MySQL connection..." -ForegroundColor Yellow
try {
    # Try to connect to MySQL
    $testConnection = New-Object System.Net.Sockets.TcpClient
    $testConnection.Connect("localhost", 3307)
    $testConnection.Close()
    Write-Host "✓ MySQL is running on port 3307" -ForegroundColor Green
} catch {
    Write-Host "✗ MySQL is NOT running on port 3307" -ForegroundColor Red
    Write-Host "Please start MySQL first!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Starting services..." -ForegroundColor Yellow
Write-Host ""

# Base path
$basePath = Get-Location
$devPath = "$basePath\MemoriA-dev"

# 1. Start Eureka Registry
Start-ServiceInNewTab "Eureka Registry" "$devPath\MemoriA-Registry" "8761" "mvn clean install; mvn spring-boot:run"

Write-Host "Waiting 8 seconds for Eureka to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 8

# 2. Start User Service
Start-ServiceInNewTab "User Service" "$devPath\MemoriA-User-Service" "8094" "mvn clean install; mvn spring-boot:run"
Start-Sleep -Seconds 4

# 3. Start Planning Service
Start-ServiceInNewTab "Planning Service" "$devPath\MemoriA-Planning-Service" "8091" "mvn clean install; mvn spring-boot:run"
Start-Sleep -Seconds 4

# 4. Start Alerts Service
Start-ServiceInNewTab "Alerts Service" "$devPath\MemoriA-Alerts-Service" "8092" "mvn clean install; mvn spring-boot:run"
Start-Sleep -Seconds 4

# 5. Start API Gateway
Start-ServiceInNewTab "API Gateway" "$devPath\MemoriA-Gateway" "8888" "mvn clean install; mvn spring-boot:run"
Start-Sleep -Seconds 4

# 6. Start Frontend
Start-ServiceInNewTab "Frontend Angular" "$devPath\MemorIA_Frontend" "4200" "ng serve"

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "All services are starting!" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services will be available at:" -ForegroundColor Yellow
Write-Host "  - Eureka Registry: http://localhost:8761" -ForegroundColor Cyan
Write-Host "  - API Gateway: http://localhost:8888" -ForegroundColor Cyan
Write-Host "  - User Service: http://localhost:8094" -ForegroundColor Cyan
Write-Host "  - Planning Service: http://localhost:8091" -ForegroundColor Cyan
Write-Host "  - Alerts Service: http://localhost:8092" -ForegroundColor Cyan
Write-Host "  - Frontend: http://localhost:4200" -ForegroundColor Cyan
Write-Host ""
Write-Host "Waiting for services to register with Eureka..." -ForegroundColor Yellow
Write-Host "This may take 30-60 seconds. Please be patient."
Write-Host ""

# Open Eureka dashboard in browser
Write-Host "Opening Eureka dashboard..." -ForegroundColor Yellow
Start-Sleep -Seconds 15
Start-Process "http://localhost:8761"

# Open Frontend in browser
Write-Host "Opening Frontend in browser..." -ForegroundColor Yellow
Start-Sleep -Seconds 15
Start-Process "http://localhost:4200"

Write-Host ""
Write-Host "✓ All services started! Check the terminal windows for startup logs." -ForegroundColor Green
Write-Host ""
