#!/bin/bash
# Docker environment validation script
# Ensures Docker-only development environment compliance

set -e

echo "🔍 Validating Docker-only environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Install Docker Desktop."
    echo "   Visit: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Start Docker Desktop."
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose is not available."
    exit 1
fi

# Check for forbidden local installations
violations=0

if [ -d "node_modules" ]; then
    # Check if node_modules has any content (which would indicate local npm install)
    if [ "$(ls -A node_modules 2>/dev/null)" ]; then
        echo "❌ VIOLATION: Local node_modules directory contains files"
        echo "   This indicates local npm install was used"
        echo "   Remove it: rm -rf node_modules"
        echo "   Use Docker: docker compose run --rm verification-agent npm install"
        violations=$((violations + 1))
    else
        echo "✅ Empty node_modules directory detected (Docker volume mount - OK)"
    fi
fi

if [ -f "package-lock.json" ] && [ ! -f ".docker-only-marker" ]; then
    echo "❌ VIOLATION: Local package-lock.json without Docker marker"
    echo "   Remove it: rm package-lock.json"
    echo "   Use Docker: docker compose run --rm verification-agent npm install"
    violations=$((violations + 1))
fi

# Check for local npm cache
if [ -d "$HOME/.npm" ]; then
    echo "⚠️  WARNING: Local npm cache exists at $HOME/.npm"
    echo "   Consider clearing: rm -rf $HOME/.npm"
fi

# Check bash history for forbidden commands (if accessible)
if [ -f "$HOME/.bash_history" ]; then
    if grep -q "npm \|node \|npx " "$HOME/.bash_history" 2>/dev/null; then
        echo "⚠️  WARNING: Forbidden commands found in bash history"
        echo "   Use Docker equivalents instead"
    fi
fi

# Validate Docker Compose configuration
echo "🐳 Validating Docker Compose configuration..."
if ! docker compose config > /dev/null 2>&1; then
    echo "❌ Invalid Docker Compose configuration"
    exit 1
fi

# Check if required services are defined
required_services=("verification-agent" "postgres" "redis" "bdd-runner" "quality-runner" "test-runner")
for service in "${required_services[@]}"; do
    if ! docker compose config --services | grep -q "^${service}$"; then
        echo "❌ Required service '${service}' not found in Docker Compose"
        violations=$((violations + 1))
    fi
done

# Report results
if [ $violations -gt 0 ]; then
    echo "❌ $violations violation(s) detected"
    echo "   Fix violations and try again"
    exit 1
else
    echo "✅ Docker environment validation passed"
    echo "   All checks completed successfully"
fi

# Create Docker-only marker if it doesn't exist
if [ ! -f ".docker-only-marker" ]; then
    echo "docker-only-development" > .docker-only-marker
    echo "📝 Created Docker-only marker file"
fi

echo "🎉 Environment is properly configured for Docker-only development"
