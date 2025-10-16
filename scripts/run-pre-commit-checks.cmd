@echo off
REM Simulate pre-commit run for Windows

echo 🔍 Running pre-commit checks...

REM Check Docker environment
echo 🐳 Validating Docker environment...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop.
    exit /b 1
)

REM Check for local node_modules
if exist "node_modules" (
    echo ❌ Local node_modules detected. Use Docker only.
    exit /b 1
)

REM Run Prettier check
echo 🎨 Checking code formatting...
docker compose run --rm quality-runner npx prettier --check . --ignore-path .gitignore
if %errorlevel% neq 0 (
    echo 🔧 Auto-fixing formatting issues...
    docker compose run --rm quality-runner npx prettier --write . --ignore-path .gitignore
)

REM Validate Docker Compose
echo 📋 Validating Docker Compose configuration...
docker compose config >nul
if %errorlevel% neq 0 (
    echo ❌ Docker Compose configuration is invalid
    exit /b 1
)

REM Run BDD tests for pre-commit hooks
echo 🧪 Running pre-commit hook tests...
docker compose run --rm bdd-runner npm run test:bdd -- --tags "@task-4"
if %errorlevel% neq 0 (
    echo ❌ Pre-commit hook tests failed
    exit /b 1
)

echo ✅ All pre-commit checks passed!
echo.
echo 🎉 Your code is ready to commit!
exit /b 0
