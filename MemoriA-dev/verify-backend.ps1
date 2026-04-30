param(
  [string]$BackendUrl = "http://localhost:8089",
  [string]$FrontendProxyUrl = "http://localhost:4200/api"
)

$ErrorActionPreference = "Stop"

Write-Host "== Backend health check ==" -ForegroundColor Cyan
try {
  $resp = Invoke-WebRequest -UseBasicParsing "$BackendUrl/api/doctor-planning/ping" -TimeoutSec 8
  Write-Host "Backend OK: $($resp.StatusCode) $($resp.StatusDescription)" -ForegroundColor Green
} catch {
  Write-Host "Backend DOWN: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n== Direct API check (/api/auth) ==" -ForegroundColor Cyan
try {je veux que les patient soient recuperes a partir
  $resp2 = Invoke-WebRequest -UseBasicParsing "$BackendUrl/api/auth/test" -TimeoutSec 8
  Write-Host "Direct API reachable: $($resp2.StatusCode)" -ForegroundColor Green
} catch {
  Write-Host "Direct API check returned: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n== Frontend proxy check (requires ng serve running) ==" -ForegroundColor Cyan
try {
  $proxyResp = Invoke-WebRequest -UseBasicParsing "$FrontendProxyUrl/doctor-planning/ping" -TimeoutSec 8
  Write-Host "Proxy OK: $($proxyResp.StatusCode)" -ForegroundColor Green
} catch {
  Write-Host "Proxy issue (or ng serve not running): $($_.Exception.Message)" -ForegroundColor Yellow
}

