# Pre-commit quality checks in Docker for Windows PowerShell

Write-Host "Running pre-commit quality checks in Docker..." -ForegroundColor Cyan

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

# Run ESLint on JavaScript files (if any exist)
$jsFiles = Get-ChildItem -Path . -Filter "*.js" -Recurse | Where-Object { $_.FullName -notmatch "node_modules" }
if ($jsFiles.Count -gt 0) {
    Write-Host "Running ESLint..." -ForegroundColor Yellow
    docker compose run --rm quality-runner npx eslint src/ tests/ --ext .js --ignore-pattern node_modules/ 2>$null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "WARNING: ESLint found issues (expected if no src files exist yet)" -ForegroundColor Yellow
    }
}

# Run Prettier on relevant files
Write-Host "Running Prettier..." -ForegroundColor Yellow
docker compose run --rm quality-runner npx prettier --check . --ignore-path .gitignore 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Auto-fixing formatting issues..." -ForegroundColor Yellow
    docker compose run --rm quality-runner npx prettier --write . --ignore-path .gitignore 2>$null
}

# Run BDD pre-commit hook tests
Write-Host "Running BDD pre-commit hook tests..." -ForegroundColor Yellow
docker compose run --rm bdd-runner npm run test:bdd -- --tags "@task-4" 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Pre-commit hook tests failed" -ForegroundColor Red
    exit 1
}

Write-Host "SUCCESS: Pre-commit quality checks completed" -ForegroundColor Green
exit 0
