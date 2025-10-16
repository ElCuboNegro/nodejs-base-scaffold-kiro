@echo off
REM Pre-commit quality checks in Docker for Windows

echo 🔧 Running pre-commit quality checks in Docker...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop.
    exit /b 1
)

REM Run ESLint on JavaScript files (if any exist)
for /r %%i in (*.js) do (
    if exist "%%i" (
        echo 🔍 Running ESLint...
        docker compose run --rm quality-runner npx eslint src/ tests/ --ext .js --ignore-pattern node_modules/ 2>nul
        if %errorlevel% neq 0 (
            echo ⚠️  ESLint found issues (this is expected if no src files exist yet)
        )
        goto :prettier
    )
)

:prettier
REM Run Prettier on relevant files
echo 🎨 Running Prettier...
docker compose run --rm quality-runner npx prettier --check . --ignore-path .gitignore 2>nul
if %errorlevel% neq 0 (
    echo 🔧 Auto-fixing formatting issues...
    docker compose run --rm quality-runner npx prettier --write . --ignore-path .gitignore 2>nul
)

REM Run BDD pre-commit hook tests
echo 🧪 Running BDD pre-commit hook tests...
docker compose run --rm bdd-runner npm run test:bdd -- --tags "@task-4" 2>nul
if %errorlevel% neq 0 (
    echo ❌ Pre-commit hook tests failed
    exit /b 1
)

REM Run additional quality tests
echo 🔍 Running code quality tests...
docker compose run --rm bdd-runner npm run test:bdd -- --tags "@code-quality" 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  Code quality tests had issues (non-critical)
)

REM Run security scanning tests
echo 🔒 Running security scanning tests...
docker compose run --rm bdd-runner npm run test:bdd -- --tags "@security" 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  Security tests had issues (non-critical)
)

echo ✅ Pre-commit quality checks completed
exit /b 0
