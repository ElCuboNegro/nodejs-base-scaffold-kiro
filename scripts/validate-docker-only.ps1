# Validate Docker-only environment for Windows PowerShell

Write-Host "Validating Docker-only environment..." -ForegroundColor Cyan

# Check if Docker is running
try {
    docker info | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Docker is not running. Please start Docker Desktop." -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "ERROR: Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Check for forbidden local installations
if (Test-Path "node_modules") {
    # Check if package-lock.json exists without Docker marker (indicates local npm install)
    if (Test-Path "package-lock.json") {
        if (-not (Test-Path ".docker-only-marker")) {
            Write-Host "VIOLATION: Local package-lock.json without Docker marker" -ForegroundColor Red
            Write-Host "   This indicates local npm install was used" -ForegroundColor Red
            Write-Host "   Remove it: Remove-Item -Recurse -Force node_modules" -ForegroundColor Yellow
            Write-Host "   Use Docker: docker compose run --rm verification-agent npm install" -ForegroundColor Yellow
            exit 1
        }
    }

    # Check if .npm cache exists (indicates local npm usage)
    $npmCache = Join-Path $env:USERPROFILE ".npm"
    if (Test-Path $npmCache) {
        Write-Host "WARNING: Local npm cache exists" -ForegroundColor Yellow
        Write-Host "   Consider clearing: Remove-Item -Recurse -Force `"$npmCache`"" -ForegroundColor Yellow
    }

    Write-Host "OK: node_modules directory detected (Docker volume mount)" -ForegroundColor Green
}

# Check for package-lock.json without Docker marker
if (Test-Path "package-lock.json") {
    if (-not (Test-Path ".docker-only-marker")) {
        Write-Host "VIOLATION: Local package-lock.json without Docker marker" -ForegroundColor Red
        Write-Host "   Remove it: Remove-Item package-lock.json" -ForegroundColor Yellow
        Write-Host "   Use Docker: docker compose run --rm verification-agent npm install" -ForegroundColor Yellow
        exit 1
    }
}

# Create Docker-only marker if it doesn't exist
if (-not (Test-Path ".docker-only-marker")) {
    "docker-only-development" | Out-File -FilePath ".docker-only-marker" -Encoding UTF8
    Write-Host "Created Docker-only marker file" -ForegroundColor Green
}

Write-Host "SUCCESS: Docker environment validation passed" -ForegroundColor Green
exit 0
