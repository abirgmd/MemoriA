# Script to archive MemoriA-Auth-Service (DEPRECATED)
# This service has been merged into MemoriA-User-Service (Identity-Service)

$authServicePath = "C:\Users\Fatma\Desktop\MemoriA\MemoriA-planning\MemoriA-dev\MemoriA-Auth-Service"
$archivePath = "C:\Users\Fatma\Desktop\MemoriA\MemoriA-planning\ARCHIVED"
$timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$archiveName = "MemoriA-Auth-Service_ARCHIVED_$timestamp"

Write-Host "=================================" -ForegroundColor Cyan
Write-Host "MemoriA Auth Service Archival" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

if (Test-Path $authServicePath) {
    Write-Host "✓ Found MemoriA-Auth-Service at: $authServicePath" -ForegroundColor Green
    
    # Create archive directory if not exists
    if (-not (Test-Path $archivePath)) {
        New-Item -ItemType Directory -Path $archivePath | Out-Null
        Write-Host "✓ Created archive directory: $archivePath" -ForegroundColor Green
    }
    
    # Rename (archive) the directory
    $archivedPath = Join-Path $archivePath $archiveName
    Move-Item -Path $authServicePath -Destination $archivedPath
    
    Write-Host "✓ Archived to: $archivedPath" -ForegroundColor Green
    Write-Host ""
    Write-Host "✅ MemoriA-Auth-Service has been archived!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Note: This service has been merged into MemoriA-User-Service (Identity-Service)" -ForegroundColor Yellow
    Write-Host "      All authentication endpoints are now available at port 8094" -ForegroundColor Yellow
    
} else {
    Write-Host "✗ MemoriA-Auth-Service not found at: $authServicePath" -ForegroundColor Red
    Write-Host "  Maybe it's already been archived?" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "Next: Restart Identity Service (8094)" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
