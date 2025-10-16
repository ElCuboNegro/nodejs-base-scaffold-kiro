#!/bin/bash

# Development Environment Setup Script
# Ensures Docker-based development environment is properly configured

set -e

echo "🚀 Setting up AI Voice Verification Agent Development Environment"
echo "================================================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop first."
    echo "   Download from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker compose &> /dev/null; then
    echo "❌ Docker Compose is not available. Please update Docker Desktop."
    exit 1
fi

# Check if Docker daemon is running
if ! docker info &> /dev/null; then
    echo "❌ Docker daemon is not running. Please start Docker Desktop."
    exit 1
fi

echo "✅ Docker is installed and running"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your actual values before proceeding"
else
    echo "✅ .env file already exists"
fi

# Create reports directory
mkdir -p reports
echo "✅ Reports directory created"

# Build Docker images
echo "🔨 Building Docker images..."
docker compose build

echo "✅ Docker images built successfully"

# Start services to verify setup
echo "🧪 Testing Docker setup..."
docker compose up -d postgres redis

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Test database connection
if docker compose exec -T postgres pg_isready -U verification_user; then
    echo "✅ PostgreSQL is ready"
else
    echo "❌ PostgreSQL connection failed"
    docker compose logs postgres
    exit 1
fi

# Test Redis connection
if docker compose exec -T redis redis-cli ping | grep -q PONG; then
    echo "✅ Redis is ready"
else
    echo "❌ Redis connection failed"
    docker compose logs redis
    exit 1
fi

# Stop test services
docker compose down

echo ""
echo "🎉 Development environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your actual values"
echo "2. Start development: docker compose up"
echo "3. Run tests: docker compose run --rm bdd-runner npm run test:bdd"
echo ""
echo "Available commands:"
echo "  docker compose up                                    # Start all services"
echo "  docker compose run --rm bdd-runner npm run test:bdd # Run BDD tests"
echo "  docker compose run --rm quality-runner npm run quality:check # Quality checks"
echo "  docker compose down                                 # Stop all services"
echo ""
