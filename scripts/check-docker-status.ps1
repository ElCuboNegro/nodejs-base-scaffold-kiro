# PowerShell script to check Docker status and provide guidance
# Follows Docker-only enforcement policy

Write-Host "🔍 Checking Docker Environment Status" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Check if Docker is installed
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker is installed: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed" -ForegroundColor Red
    Write-Host "   Install Docker Desktop: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Check if Docker daemon is running
try {
    docker info | Out-Null
    Write-Host "✅ Docker daemon is running" -ForegroundColor Green

    # Check if Docker Compose is available
    try {
        docker compose version | Out-Null
        Write-Host "✅ Docker Compose is available" -ForegroundColor Green
    } catch {
        Write-Host "❌ Docker Compose is not available" -ForegroundColor Red
        exit 1
    }

} catch {
    Write-Host "❌ Docker daemon is not running" -ForegroundColor Red
    Write-Host "   Please start Docker Desktop and try again" -ForegroundColor Yellow
    Write-Host "" -ForegroundColor White
    Write-Host "Steps to start Docker Desktop:" -ForegroundColor White
    Write-Host "1. Open Docker Desktop application" -ForegroundColor White
    Write-Host "2. Wait for Docker to start (whale icon in system tray)" -ForegroundColor White
    Write-Host "3. Run this script again to verify" -ForegroundColor White
    Write-Host "" -ForegroundColor White
    Write-Host "Once Docker is running, use these commands:" -ForegroundColor White
    Write-Host "  docker compose run --rm bdd-runner npm run test:bdd" -ForegroundColor Cyan
    Write-Host "  docker compose up --build" -ForegroundColor Cyan
    exit 1
}

# Check for local violations
Write-Host "" -ForegroundColor White
Write-Host "📋 Checking for Docker policy violations..." -ForegroundColor Cyan

$violations = 0

if (Test-Path "node_modules") {
    Write-Host "❌ VIOLATION: Local node_modules directory found" -ForegroundColor Red
    Write-Host "   Remove with: Remove-Item -Recurse -Force node_modules" -ForegroundColor Yellow
    $violations++
}

if ((Test-Path "package-lock.json") -and (-not (Test-Path ".docker-only-marker"))) {
    Write-Host "❌ VIOLATION: Local package-lock.json without Docker marker" -ForegroundColor Red
    Write-Host "   Remove with: Remove-Item package-lock.json" -ForegroundColor Yellow
    $violations++
}

if ($violations -eq 0) {
    Write-Host "✅ No Docker policy violations found" -ForegroundColor Green
} else {
    Write-Host "❌ $violations violation(s) found" -ForegroundColor Red
    Write-Host "   Clean up with: docker compose run --rm verification-agent npm ci" -ForegroundColor Yellow
}

Write-Host "" -ForegroundColor White
Write-Host "🎉 Docker environment is ready!" -ForegroundColor Green
Write-Host "" -ForegroundColor White
Write-Host "Available Docker commands:" -ForegroundColor White
Write-Host "  docker compose up --build                              # Start all services" -ForegroundColor Cyan
Write-Host "  docker compose run --rm bdd-runner npm run test:bdd    # Run BDD tests" -ForegroundColor Cyan
Write-Host "  docker compose run --rm quality-runner npm run _lint   # Run linting" -ForegroundColor Cyan
Write-Host "  docker compose run --rm test-runner npm run _test      # Run all tests" -ForegroundColor Cyan
Write-Host "  docker compose down                                    # Stop all services" -ForegroundColor Cyan
