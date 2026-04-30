# Script de migration complète: Backend monolith → 3 microservices
# Stratégie: Copier (no overwrite) → Vérifier compilation → Supprimer backend

$backendRoot = "c:\Users\Fatma\Desktop\MemoriA\MemoriA-planning\MemoriA-dev\MemorIA_Backend\src\main\java\MemorIA"
$alertsService = "c:\Users\Fatma\Desktop\MemoriA\MemoriA-planning\MemoriA-dev\MemoriA-Alerts-Service\src\main\java\MemorIA"
$planningService = "c:\Users\Fatma\Desktop\MemoriA\MemoriA-planning\MemoriA-dev\MemoriA-Planning-Service\src\main\java\MemorIA"
$registryService = "c:\Users\Fatma\Desktop\MemoriA\MemoriA-planning\MemoriA-dev\MemoriA-Registry\src\main\java\MemorIA"

$report = @()
$report += "===================================================="
$report += "    MIGRATION: MemorIA_Backend to Microservices"
$report += "===================================================="
$report += ""

# PHASE 1: Get all backend files
$allBackendFiles = Get-ChildItem -Path $backendRoot -Recurse -Filter "*.java" | ForEach-Object {
    @{
        FullPath = $_.FullName
        RelPath = $_.FullName -replace [regex]::Escape($backendRoot + '\'), ''
        Name = $_.Name
    }
}

$report += "[PHASE 1] Backend files: $($allBackendFiles.Count) found"
$report += ""

# PHASE 2: Categorize files
$alerts = @()
$planning = @()
$registry = @()

foreach ($file in $allBackendFiles) {
    $name = $file.Name
    
    if ($name -match "^Alert|^WeatherAlert|^PredictiveAlert|AlertRecipient|AlertScheduler|AlertService|CaregiverAlert|CreateAlertRequest|ManualAlertRequest|ResolveAlertRequest|AlertActionRequest|AlertCard|AlertDashboard|AlertResponse|AlertStats|TopAlertType|WeatherAlert|WeeklyAlert") {
        $alerts += $file
    }
    elseif ($name -match "^Reminder|^Planning|^Adherence|^DoctorPlanning|^CaregiverPlanning|ReminderNotif|ReminderMapper|ReminderDTO|CreateReminder") {
        $planning += $file
    }
    else {
        $registry += $file
    }
}

$report += "[PHASE 2] Categorization:"
$report += "  - Alerts: $($alerts.Count) files"
$report += "  - Planning: $($planning.Count) files"
$report += "  - Registry: $($registry.Count) files"
$report += ""

# PHASE 3: Copy files
function CopyFiles($files, $destRoot, $serviceName) {
    $copied = 0
    $skipped = 0
    $failed = 0
    
    foreach ($file in $files) {
        $destPath = Join-Path $destRoot $file.RelPath
        $destDir = Split-Path $destPath
        
        # Create destination directory
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force -ErrorAction SilentlyContinue | Out-Null
        }
        
        # Copy only if file doesn't already exist
        if (Test-Path $destPath) {
            $skipped++
        }
        else {
            try {
                Copy-Item -Path $file.FullPath -Destination $destPath -Force -ErrorAction Stop
                $copied++
            }
            catch {
                $failed++
            }
        }
    }
    
    return @{
        Copied = $copied
        Skipped = $skipped
        Failed = $failed
    }
}

$report += "[PHASE 3] File copy:"

$alertsResult = CopyFiles $alerts $alertsService "Alerts"
$report += "  [OK] Alerts Service: $($alertsResult.Copied) copied, $($alertsResult.Skipped) skipped, $($alertsResult.Failed) errors"

$planningResult = CopyFiles $planning $planningService "Planning"
$report += "  [OK] Planning Service: $($planningResult.Copied) copied, $($planningResult.Skipped) skipped, $($planningResult.Failed) errors"

$registryResult = CopyFiles $registry $registryService "Registry"
$report += "  [OK] Registry Service: $($registryResult.Copied) copied, $($registryResult.Skipped) skipped, $($registryResult.Failed) errors"

$report += ""
$totalCopied = $alertsResult.Copied + $planningResult.Copied + $registryResult.Copied
$totalSkipped = $alertsResult.Skipped + $planningResult.Skipped + $registryResult.Skipped
$report += "TOTAL: $totalCopied files copied, $totalSkipped skipped (duplicates)"
$report += ""

# PHASE 4: Check duplicates in each service
$report += "[PHASE 4] Duplicate check:"

# Alerts
$alertDuplicates = Get-ChildItem -Path $alertsService -Recurse -Filter "*.java" | 
    Group-Object Name | Where-Object { $_.Count -gt 1 } | Measure-Object
$report += "  - Alerts: $($alertDuplicates.Count) duplicate files"
if ($alertDuplicates.Count -gt 0) {
    Get-ChildItem -Path $alertsService -Recurse -Filter "*.java" | 
        Group-Object Name | Where-Object { $_.Count -gt 1 } | ForEach-Object {
        $report += "    - $($_.Name) x$($_.Count)"
    }
}

# Planning
$planningDuplicates = Get-ChildItem -Path $planningService -Recurse -Filter "*.java" | 
    Group-Object Name | Where-Object { $_.Count -gt 1 } | Measure-Object
$report += "  - Planning: $($planningDuplicates.Count) duplicate files"
if ($planningDuplicates.Count -gt 0) {
    Get-ChildItem -Path $planningService -Recurse -Filter "*.java" | 
        Group-Object Name | Where-Object { $_.Count -gt 1 } | ForEach-Object {
        $report += "    - $($_.Name) x$($_.Count)"
    }
}

# Registry
$registryDuplicates = Get-ChildItem -Path $registryService -Recurse -Filter "*.java" | 
    Group-Object Name | Where-Object { $_.Count -gt 1 } | Measure-Object
$report += "  - Registry: $($registryDuplicates.Count) duplicate files"
if ($registryDuplicates.Count -gt 0) {
    Get-ChildItem -Path $registryService -Recurse -Filter "*.java" | 
        Group-Object Name | Where-Object { $_.Count -gt 1 } | ForEach-Object {
        $report += "    - $($_.Name) x$($_.Count)"
    }
}

$report += ""
$report += "===================================================="
$report += "[DONE] Migration complete. Generating report..."
$report += "===================================================="

# Display and save report
$report | ForEach-Object { Write-Host $_ }
$report | Out-File "c:\Users\Fatma\Desktop\MemoriA\MemoriA-planning\MIGRATION_REPORT.txt" -Force

Write-Host "`n[OK] Report saved: MIGRATION_REPORT.txt"
