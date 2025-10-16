#!/bin/bash
# Pre-commit setup script for cross-platform development
# Sets up pre-commit hooks that work with Docker

set -e

echo "🔧 Setting up pre-commit hooks..."

# Check if we're on Windows
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
    echo "🪟 Windows detected, using Windows setup script..."
    ./scripts/setup-pre-commit-windows.cmd
    exit 0
fi

# Unix/Linux/macOS setup
echo "🐧 Unix-like system detected..."

# Check if Python is available
if ! command -v python3 &> /dev/null && ! command -v python &> /dev/null; then
    echo "❌ Python is not installed"
    echo "   Please install Python 3.8+ from your package manager"
    exit 1
fi

# Use python3 if available, otherwise python
PYTHON_CMD="python3"
if ! command -v python3 &> /dev/null; then
    PYTHON_CMD="python"
fi

# Install Python requirements (includes pre-commit)
echo "📦 Installing Python requirements..."
$PYTHON_CMD -m pip install --user -r requirements.txt

# Install pre-commit hooks
echo "🪝 Installing pre-commit hooks..."
pre-commit install

# Install commit-msg hook
echo "💬 Installing commit-msg hook..."
pre-commit install --hook-type commit-msg

# Install Husky hooks
echo "🐕 Setting up Husky hooks..."
docker compose run --rm verification-agent npx husky install

# Make scripts executable
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
chmod +x .husky/commit-msg
chmod +x .husky/_/husky.sh
chmod +x scripts/*.sh

# Test the installation
echo "🧪 Testing pre-commit installation..."
pre-commit run --all-files

echo "✅ Pre-commit setup completed successfully!"
echo ""
echo "To manually run pre-commit:"
echo "  pre-commit run --all-files"
echo ""
echo "To update hooks:"
echo "  pre-commit autoupdate"
echo ""
echo "All hooks will now run automatically on git commit."
