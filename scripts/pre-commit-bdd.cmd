@echo off
REM BDD test validation for pre-commit hooks

echo 🧪 Running BDD test validation...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop.
    exit /b 1
)

REM Run pre-commit hook tests (critical)
echo 🪝 Running pre-commit hook tests...
docker compose run --rm bdd-runner npm run test:bdd -- --tags "@task-4"
if %errorlevel% neq 0 (
    echo ❌ Pre-commit hook tests FAILED - this is critical!
    exit /b 1
)

REM Run project setup tests (critical)
echo 📦 Running project setup tests...
docker compose run --rm bdd-runner npm run test:bdd -- --tags "@task-1"
if %errorlevel% neq 0 (
    echo ❌ Project setup tests FAILED - this is critical!
    exit /b 1
)

REM Run code quality tests (important)
echo 🔍 Running code quality tests...
docker compose run --rm bdd-runner npm run test:bdd -- --tags "@task-2 or @task-3"
if %errorlevel% neq 0 (
    echo ⚠️  Code quality tests had issues (non-critical for commit)
)

REM Run security tests (important)
echo 🔒 Running security tests...
docker compose run --rm bdd-runner npm run test:bdd -- --tags "@task-5"
if %errorlevel% neq 0 (
    echo ⚠️  Security tests had issues (non-critical for commit)
)

echo ✅ BDD test validation completed successfully!
echo 🎉 All critical tests passed - ready to commit!
exit /b 0
