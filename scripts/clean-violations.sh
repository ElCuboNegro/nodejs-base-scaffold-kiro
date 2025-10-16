#!/bin/bash
# Clean up Docker policy violations
# Removes local installations and enforces Docker-only development

echo "🧹 Cleaning up Docker policy violations..."

violations_cleaned=0

# Remove local node_modules
if [ -d "node_modules" ]; then
    echo "Removing local node_modules..."
    rm -rf node_modules
    violations_cleaned=$((violations_cleaned + 1))
fi

# Remove local package-lock.json
if [ -f "package-lock.json" ] && [ ! -f ".docker-only-marker" ]; then
    echo "Removing local package-lock.json..."
    rm package-lock.json
    violations_cleaned=$((violations_cleaned + 1))
fi

# Clear npm cache
if [ -d "$HOME/.npm" ]; then
    echo "Clearing npm cache..."
    rm -rf "$HOME/.npm"
    violations_cleaned=$((violations_cleaned + 1))
fi

# Remove yarn cache if exists
if [ -d "$HOME/.yarn" ]; then
    echo "Clearing yarn cache..."
    rm -rf "$HOME/.yarn"
    violations_cleaned=$((violations_cleaned + 1))
fi

# Create Docker-only marker
if [ ! -f ".docker-only-marker" ]; then
    echo "docker-only-development" > .docker-only-marker
    echo "📝 Created Docker-only marker file"
fi

# Create .dockerignore if missing
if [ ! -f ".dockerignore" ]; then
    echo "📝 Creating .dockerignore file..."
    cat > .dockerignore << 'EOF'
node_modules
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.npm
.yarn
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
coverage/
reports/
.nyc_output
*.log
.DS_Store
Thumbs.db
EOF
fi

# Report results
if [ $violations_cleaned -gt 0 ]; then
    echo "✅ Cleaned up $violations_cleaned violation(s)"
else
    echo "✅ No violations found to clean"
fi

echo "🎉 Environment is now compliant with Docker-only policy"
echo ""
echo "Next steps:"
echo "  1. Install dependencies: docker compose run --rm verification-agent npm install"
echo "  2. Run tests: docker compose run --rm bdd-runner npm run test:bdd"
echo "  3. Start development: docker compose up --build"
