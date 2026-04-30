# START_ALL_MICROSERVICES.ps1
# MemoriA Microservices Startup Script
# Starts all services in the correct order

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MemoriA Microservices Startup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Set base path
$basePath = "C:\Users\Fatma\Desktop\MemoriA\MemoriA-planning\MemoriA-dev"

# Check if base path exists
if (-not (Test-Path $basePath)) {
    Write-Host "ERROR: Base path not found: $basePath" -ForegroundColor Red
    exit 1
}

# Array of services to start
$services = @(
    @{ name = "MemoriA-Registry"; port = 8761; order = 1 },
    @{ name = "MemoriA-User-Service"; port = 8094; order = 2 },
    @{ name = "MemoriA-Planning-Service"; port = 8091; order = 3 },
    @{ name = "MemoriA-Alerts-Service"; port = 8092; order = 4 },
    @{ name = "MemoriA-Gateway"; port = 8888; order = 5 }
)

# Sort services by order
$services = $services | Sort-Object { $_.order }

Write-Host "Services to start:" -ForegroundColor Yellow
foreach ($service in $services) {
    Write-Host "  [$($service.order)] $($service.name) - Port $($service.port)" -ForegroundColor Green
}
Write-Host ""

# Function to start a service
function Start-MicroService {
    param(
        [string]$serviceName,
        [int]$port,
        [int]$order
    )
    
    $servicePath = Join-Path $basePath $serviceName
    
    if (-not (Test-Path $servicePath)) {
        Write-Host "ERROR: Service path not found: $servicePath" -ForegroundColor Red
        return $false
    }
    
    Write-Host "[$order] Starting $serviceName (Port $port)..." -ForegroundColor Cyan
    
    # Check if Maven is available
    $mvn = Get-Command mvn -ErrorAction SilentlyContinue
    if (-not $mvn) {
        Write-Host "ERROR: Maven not found in PATH. Please install Maven or add it to PATH." -ForegroundColor Red
        return $false
    }
    
    # Start the service in a new PowerShell window
    $script = {
        param($path, $name)
        Set-Location $path
        Write-Host "Starting $name in $(Get-Location)"
        & mvn spring-boot:run
    }
    
    Start-Process pwsh -ArgumentList "-NoExit", "-Command", "Set-Location '$servicePath'; mvn spring-boot:run" -WindowStyle Normal
    
    Write-Host "  ✓ $serviceName started in new window" -ForegroundColor Green
    Write-Host "  Waiting 5 seconds before starting next service..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    return $true
}

# Start all services
Write-Host "Starting services..." -ForegroundColor Cyan
Write-Host ""

$failedServices = @()

foreach ($service in $services) {
    $result = Start-MicroService -serviceName $service.name -port $service.port -order $service.order
    if (-not $result) {
        $failedServices += $service.name
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Microservices Startup Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($failedServices.Count -gt 0) {
    Write-Host "FAILED SERVICES:" -ForegroundColor Red
    foreach ($service in $failedServices) {
        Write-Host "  ✗ $service" -ForegroundColor Red
    }
} else {
    Write-Host "All services started successfully!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Services will appear in separate PowerShell windows." -ForegroundColor Yellow
Write-Host ""

Write-Host "Access Points:" -ForegroundColor Cyan
Write-Host "  • Eureka Registry: http://localhost:8761" -ForegroundColor Green
Write-Host "  • Identity Service: http://localhost:8094" -ForegroundColor Green
Write-Host "  • Planning Service: http://localhost:8091" -ForegroundColor Green
Write-Host "  • Alerts Service: http://localhost:8092" -ForegroundColor Green
Write-Host "  • API Gateway: http://localhost:8888" -ForegroundColor Green
Write-Host ""

Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Wait for all services to start (check console windows)" -ForegroundColor Yellow
Write-Host "  2. Check Eureka Registry to verify all services are registered" -ForegroundColor Yellow
Write-Host "  3. Start Frontend: npm install && ng serve (in MemoriA_Frontend)" -ForegroundColor Yellow
Write-Host "  4. Open http://localhost:4200 in browser" -ForegroundColor Yellow
Write-Host ""

Write-Host "To stop all services: Close the PowerShell windows or press Ctrl+C" -ForegroundColor Yellow
Write-Host ""

Write-Host "Script complete. Monitoring services..." -ForegroundColor Green

# Keep script running to monitor services
while ($true) {
    Start-Sleep -Seconds 30
}
