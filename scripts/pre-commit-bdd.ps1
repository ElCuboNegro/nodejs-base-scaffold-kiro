# BDD test validation for pre-commit hooks

Write-Host "Running BDD test validation..." -ForegroundColor Cyan

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

# Run pre-commit hook tests (critical)
Write-Host "Running pre-commit hook tests..." -ForegroundColor Yellow
docker compose run --rm bdd-runner npm run test:bdd -- --tags "@task-4"
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Pre-commit hook tests FAILED - this is critical!" -ForegroundColor Red
    exit 1
}

# Run project setup tests (critical)
Write-Host "Running project setup tests..." -ForegroundColor Yellow
docker compose run --rm bdd-runner npm run test:bdd -- --tags "@task-1"
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Project setup tests FAILED - this is critical!" -ForegroundColor Red
    exit 1
}

Write-Host "SUCCESS: BDD test validation completed successfully!" -ForegroundColor Green
Write-Host "All critical tests passed - ready to commit!" -ForegroundColor Green
exit 0
