@echo off
REM Validate Docker-only environment for Windows

echo 🔍 Validating Docker-only environment...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop.
    exit /b 1
)

REM Check for forbidden local installations
if exist "node_modules" (
    REM Check if package-lock.json exists without Docker marker (indicates local npm install)
    if exist "package-lock.json" (
        if not exist ".docker-only-marker" (
            echo ❌ VIOLATION: Local package-lock.json without Docker marker
            echo    This indicates local npm install was used
            echo    Remove it: rmdir /s /q node_modules
            echo    Use Docker: docker compose run --rm verification-agent npm install
            exit /b 1
        )
    )

    REM Check if .npm cache exists (indicates local npm usage)
    if exist "%USERPROFILE%\.npm" (
        echo ⚠️  WARNING: Local npm cache exists
        echo    Consider clearing: rmdir /s /q "%USERPROFILE%\.npm"
    )

    echo ✅ node_modules directory detected (Docker volume mount - OK)
)

if exist "package-lock.json" (
    if not exist ".docker-only-marker" (
        echo ❌ VIOLATION: Local package-lock.json without Docker marker
        echo    Remove it: del package-lock.json
        echo    Use Docker: docker compose run --rm verification-agent npm install
        exit /b 1
    )
)

REM Create Docker-only marker if it doesn't exist
if not exist ".docker-only-marker" (
    echo docker-only-development > .docker-only-marker
    echo 📝 Created Docker-only marker file
)

echo ✅ Docker environment validation passed
exit /b 0
