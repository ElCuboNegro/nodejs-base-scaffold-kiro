#!/bin/bash

# Docker-Only Environment Validation Script
# Ensures no local npm/node execution is possible

set -e

echo "🔍 Validating Docker-Only Environment"
echo "===================================="

violations=0

# Check if Docker is installed and running
echo "📋 Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    echo "   Install Docker Desktop: https://www.docker.com/products/docker-desktop"
    violations=$((violations + 1))
else
    echo "✅ Docker is installed"
fi

if ! docker info &> /dev/null; then
    echo "❌ Docker daemon is not running"
    echo "   Start Docker Desktop"
    violations=$((violations + 1))
else
    echo "✅ Docker daemon is running"
fi

# Check for local node_modules
echo "📋 Checking for local violations..."
if [ -d "node_modules" ]; then
    echo "❌ VIOLATION: Local node_modules directory found"
    echo "   Remove with: rm -rf node_modules"
    echo "   Use Docker: docker compose run --rm verification-agent npm install"
    violations=$((violations + 1))
else
    echo "✅ No local node_modules found"
fi

# Check for local package-lock.json without Docker marker
if [ -f "package-lock.json" ] && [ ! -f ".docker-only-marker" ]; then
    echo "❌ VIOLATION: Local package-lock.json without Docker marker"
    echo "   Remove with: rm package-lock.json"
    echo "   Use Docker: docker compose run --rm verification-agent npm install"
    violations=$((violations + 1))
else
    echo "✅ No unauthorized package-lock.json found"
fi

# Check for local npm cache
if [ -d "$HOME/.npm" ]; then
    echo "⚠️  WARNING: Local npm cache exists at $HOME/.npm"
    echo "   Consider clearing: rm -rf $HOME/.npm"
fi

# Check for yarn.lock or pnpm-lock.yaml
if [ -f "yarn.lock" ]; then
    echo "❌ VIOLATION: yarn.lock found - Yarn is not allowed"
    echo "   Remove with: rm yarn.lock"
    violations=$((violations + 1))
fi

if [ -f "pnpm-lock.yaml" ]; then
    echo "❌ VIOLATION: pnpm-lock.yaml found - PNPM is not allowed"
    echo "   Remove with: rm pnpm-lock.yaml"
    violations=$((violations + 1))
fi

# Check Docker Compose configuration
echo "📋 Validating Docker Compose configuration..."
if ! docker compose config &> /dev/null; then
    echo "❌ Docker Compose configuration is invalid"
    violations=$((violations + 1))
else
    echo "✅ Docker Compose configuration is valid"
fi

# Check for required files
echo "📋 Checking required files..."
required_files=(
    "Dockerfile"
    "compose.yaml"
    ".dockerignore"
    ".env.example"
    "Makefile"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Missing required file: $file"
        violations=$((violations + 1))
    else
        echo "✅ Found: $file"
    fi
done

# Check package.json for enforcement scripts
echo "📋 Checking package.json enforcement..."
if [ -f "package.json" ]; then
    if grep -q "FORBIDDEN" package.json; then
        echo "✅ Package.json has enforcement scripts"
    else
        echo "❌ Package.json missing enforcement scripts"
        violations=$((violations + 1))
    fi
else
    echo "❌ package.json not found"
    violations=$((violations + 1))
fi

# Check for shell aliases (if possible)
echo "📋 Checking shell configuration..."
shell_configs=(
    "$HOME/.bashrc"
    "$HOME/.zshrc"
    "$HOME/.profile"
)

alias_found=false
for config in "${shell_configs[@]}"; do
    if [ -f "$config" ] && grep -q "npm.*FORBIDDEN\|node.*FORBIDDEN" "$config" 2>/dev/null; then
        echo "✅ Found Docker enforcement aliases in $config"
        alias_found=true
        break
    fi
done

if [ "$alias_found" = false ]; then
    echo "⚠️  WARNING: No shell aliases found for npm/node prohibition"
    echo "   Consider adding aliases from .kiro/steering/npm-prohibition.md"
fi

# Check git hooks
echo "📋 Checking Git hooks..."
if [ -f ".husky/pre-commit" ]; then
    if grep -q "docker compose" ".husky/pre-commit"; then
        echo "✅ Pre-commit hook uses Docker"
    else
        echo "❌ Pre-commit hook doesn't enforce Docker usage"
        violations=$((violations + 1))
    fi
else
    echo "⚠️  WARNING: No pre-commit hook found"
fi

# Check for IDE configuration
echo "📋 Checking IDE configuration..."
if [ -f ".vscode/settings.json" ]; then
    if grep -q "docker" ".vscode/settings.json"; then
        echo "✅ VS Code configured for Docker"
    else
        echo "⚠️  WARNING: VS Code not configured for Docker"
    fi
fi

# Test Docker services
echo "📋 Testing Docker services..."
if docker compose ps | grep -q "Up"; then
    echo "✅ Docker services are running"
else
    echo "ℹ️  Docker services are not currently running (this is OK)"
fi

# Generate compliance report
echo "📋 Generating compliance report..."
report_file="reports/docker-compliance-$(date +%Y%m%d-%H%M%S).txt"
mkdir -p reports

cat > "$report_file" << EOF
Docker-Only Environment Compliance Report
Generated: $(date)
==========================================

Validation Results:
- Violations Found: $violations
- Docker Installed: $(command -v docker &> /dev/null && echo "Yes" || echo "No")
- Docker Running: $(docker info &> /dev/null && echo "Yes" || echo "No")
- Local node_modules: $([ -d "node_modules" ] && echo "Found (VIOLATION)" || echo "Not found")
- Local package-lock.json: $([ -f "package-lock.json" ] && [ ! -f ".docker-only-marker" ] && echo "Found (VIOLATION)" || echo "Not found or authorized")
- Compose Config Valid: $(docker compose config &> /dev/null && echo "Yes" || echo "No")
- Enforcement Scripts: $(grep -q "FORBIDDEN" package.json && echo "Present" || echo "Missing")

$([ $violations -eq 0 ] && echo "✅ COMPLIANT: Environment follows Docker-only policy" || echo "❌ NON-COMPLIANT: $violations violation(s) found")
EOF

echo "📄 Compliance report saved to: $report_file"

# Summary
echo ""
echo "🏁 Validation Summary"
echo "===================="
if [ $violations -eq 0 ]; then
    echo "✅ PASSED: Environment is compliant with Docker-only policy"
    echo ""
    echo "You can now safely use:"
    echo "  make up          # Start development environment"
    echo "  make test-bdd    # Run BDD tests"
    echo "  make quality     # Run quality checks"
    exit 0
else
    echo "❌ FAILED: $violations violation(s) found"
    echo ""
    echo "Fix violations with:"
    echo "  make clean-violations    # Clean up local violations"
    echo "  make validate           # Re-run validation"
    echo ""
    echo "Then use Docker commands only:"
    echo "  make help               # Show available commands"
    exit 1
fi
