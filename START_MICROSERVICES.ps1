# ============================================================
# MemoriA Microservices - Start All Services
# ============================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "      MemoriA Microservices - Services Startup" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

# Get current directory
$projectRoot = "C:\Users\Fatma\Desktop\MemoriA\MemoriA-planning\MemoriA-dev"

if (-not (Test-Path $projectRoot)) {
    Write-Host "ERROR: Project root not found: $projectRoot" -ForegroundColor Red
    exit 1
}

Write-Host "[OK] Project root: $projectRoot" -ForegroundColor Green
Write-Host ""

# Services to start
$services = @(
    @{
        name = "Eureka Registry";
        path = "MemoriA-Registry";
        port = "8761";
        wait = 15;
    },
    @{
        name = "Planning Service";
        path = "MemoriA-Planning-Service";
        port = "8091";
        wait = 10;
    },
    @{
        name = "Alerts Service";
        path = "MemoriA-Alerts-Service";
        port = "8092";
        wait = 10;
    },
    @{
        name = "API Gateway";
        path = "MemoriA-Gateway";
        port = "8888";
        wait = 10;
    }
)

Write-Host "Services to start:" -ForegroundColor Yellow
Write-Host "  1. Eureka Registry     (port 8761)" -ForegroundColor Cyan
Write-Host "  2. Planning Service    (port 8091)" -ForegroundColor Cyan
Write-Host "  3. Alerts Service      (port 8092)" -ForegroundColor Cyan
Write-Host "  4. API Gateway         (port 8888)" -ForegroundColor Cyan
Write-Host ""

Write-Host "Each service will open in a new PowerShell window" -ForegroundColor Yellow
Write-Host "Services will start in sequence with delays" -ForegroundColor Yellow
Write-Host ""

$response = Read-Host "Do you want to continue? (y/n)"
if ($response -ne 'y' -and $response -ne 'Y') {
    Write-Host "CANCELLED" -ForegroundColor Red
    exit 0
}

Write-Host ""

# Start each service
foreach ($service in $services) {
    $serviceName = $service.name
    $servicePath = $service.path
    $port = $service.port
    $wait = $service.wait

    Write-Host "Starting $serviceName..." -ForegroundColor Green
    
    $fullPath = Join-Path $projectRoot $servicePath
    
    if (-not (Test-Path $fullPath)) {
        Write-Host "ERROR: Service path not found: $fullPath" -ForegroundColor Red
        continue
    }

    # Start service in new window
    $processArguments = @(
        "-NoExit",
        "-Command",
        "cd '$fullPath'; Write-Host 'Starting $serviceName...' -ForegroundColor Cyan; mvn spring-boot:run"
    )

    Start-Process powershell.exe -ArgumentList $processArguments

    Write-Host "Waiting $wait seconds for $serviceName to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds $wait

    Write-Host "[OK] $serviceName started (port $port)" -ForegroundColor Green
    Write-Host ""
}

Write-Host "==========================================================" -ForegroundColor Green
Write-Host "     All services started successfully!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host ""

Write-Host "Verification URLs:" -ForegroundColor Cyan
Write-Host "  * Eureka Dashboard:  http://localhost:8761" -ForegroundColor White
Write-Host "  * API Gateway:       http://localhost:8888" -ForegroundColor White
Write-Host "  * Planning Service:  http://localhost:8091" -ForegroundColor White
Write-Host "  * Alerts Service:    http://localhost:8092" -ForegroundColor White
Write-Host ""

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Check Eureka Dashboard (http://localhost:8761)" -ForegroundColor White
Write-Host "  2. Verify all 3 services are registered" -ForegroundColor White
Write-Host "  3. Update Frontend environment.ts (apiUrl to 8888)" -ForegroundColor White
Write-Host "  4. Start Frontend: ng serve" -ForegroundColor White
Write-Host "  5. Open http://localhost:4200" -ForegroundColor White
Write-Host ""

Write-Host "Troubleshooting:" -ForegroundColor Yellow
Write-Host "  * Each service opens in its own PowerShell window" -ForegroundColor White
Write-Host "  * Check console logs for startup errors" -ForegroundColor White
Write-Host "  * Wait 10-15 seconds between service starts" -ForegroundColor White
Write-Host "  * Check MySQL is running on port 3307" -ForegroundColor White
Write-Host ""

Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
