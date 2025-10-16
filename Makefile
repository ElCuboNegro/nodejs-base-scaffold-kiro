# Makefile for AI Voice Verification Agent
# Enforces Docker-only development environment

.PHONY: help setup install test test-bdd test-unit test-integration test-performance
.PHONY: lint format security quality docs build up down clean
.PHONY: db-migrate db-seed logs shell

# Default target
.DEFAULT_GOAL := help

help: ## Show this help message
	@echo "🐳 AI Voice Verification Agent - Docker-Only Commands"
	@echo "====================================================="
	@echo ""
	@echo "Setup Commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep -E '^(setup|install)' | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Development Commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep -E '^(build|up|down|logs|shell)' | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Testing Commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep -E '^(test)' | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Quality Commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep -E '^(lint|format|security|quality|docs)' | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Database Commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep -E '^(db-)' | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Utility Commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | grep -E '^(clean)' | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Setup and Installation
setup: ## Run initial project setup
	@echo "🚀 Setting up development environment..."
	@bash scripts/setup-development.sh

install: ## Install dependencies in Docker
	@echo "📦 Installing dependencies in Docker..."
	docker compose run --rm verification-agent npm ci

# Development Commands
build: ## Build Docker images
	@echo "🔨 Building Docker images..."
	docker compose build

up: ## Start all services
	@echo "🚀 Starting all services..."
	docker compose up --build

down: ## Stop all services
	@echo "🛑 Stopping all services..."
	docker compose down

logs: ## View logs from all services
	@echo "📋 Viewing logs..."
	docker compose logs -f

shell: ## Open shell in verification-agent container
	@echo "🐚 Opening shell in verification-agent container..."
	docker compose run --rm verification-agent bash

# Testing Commands
test: ## Run all tests with coverage
	@echo "🧪 Running all tests with coverage..."
	docker compose run --rm test-runner npm run _test

test-bdd: ## Run BDD tests
	@echo "🥒 Running BDD tests..."
	docker compose run --rm bdd-runner npm run test:bdd

test-unit: ## Run unit tests
	@echo "🔬 Running unit tests..."
	docker compose run --rm test-runner npm run test:unit

test-integration: ## Run integration tests
	@echo "🔗 Running integration tests..."
	docker compose run --rm test-runner npm run test:integration

test-performance: ## Run performance tests
	@echo "⚡ Running performance tests..."
	docker compose run --rm performance-runner npm run test:endurance

# Quality Commands
lint: ## Run ESLint
	@echo "🔍 Running ESLint..."
	docker compose run --rm quality-runner npm run _lint

lint-fix: ## Fix ESLint issues
	@echo "🔧 Fixing ESLint issues..."
	docker compose run --rm quality-runner npm run _lint:fix

format: ## Format code with Prettier
	@echo "💅 Formatting code..."
	docker compose run --rm quality-runner npm run _format

format-check: ## Check code formatting
	@echo "👀 Checking code formatting..."
	docker compose run --rm quality-runner npm run _format:check

security: ## Run security scan
	@echo "🔒 Running security scan..."
	docker compose run --rm quality-runner npm run _security:scan

quality: ## Run all quality checks
	@echo "✨ Running all quality checks..."
	docker compose run --rm quality-runner npm run quality:check

docs: ## Generate documentation
	@echo "📚 Generating documentation..."
	docker compose run --rm quality-runner npm run docs:generate

# Database Commands
db-migrate: ## Run database migrations
	@echo "🗃️  Running database migrations..."
	docker compose run --rm verification-agent npm run db:migrate

db-seed: ## Seed database with test data
	@echo "🌱 Seeding database..."
	docker compose run --rm verification-agent npm run db:seed

# Utility Commands
clean: ## Clean up Docker resources
	@echo "🧹 Cleaning up Docker resources..."
	docker compose down -v
	docker system prune -f

clean-violations: ## Clean up local violations
	@echo "🚫 Cleaning up local violations..."
	@if [ -d "node_modules" ]; then \
		echo "Removing local node_modules..."; \
		rm -rf node_modules; \
	fi
	@if [ -f "package-lock.json" ]; then \
		echo "Removing local package-lock.json..."; \
		rm package-lock.json; \
	fi
	@touch .docker-only-marker
	@echo "✅ Violations cleaned up"

validate: ## Validate Docker-only environment
	@echo "🔍 Validating Docker-only environment..."
	@if [ -d "node_modules" ]; then \
		echo "❌ Local node_modules found. Run 'make clean-violations'"; \
		exit 1; \
	fi
	@if [ -f "package-lock.json" ] && [ ! -f ".docker-only-marker" ]; then \
		echo "❌ Local package-lock.json without Docker marker. Run 'make clean-violations'"; \
		exit 1; \
	fi
	@if ! docker info > /dev/null 2>&1; then \
		echo "❌ Docker is not running. Please start Docker Desktop."; \
		exit 1; \
	fi
	@echo "✅ Environment validation passed"

# Prevent direct npm/node usage
npm:
	@echo "❌ Direct npm usage is forbidden!"
	@echo "✅ Use: make install, make test, make lint, etc."
	@exit 1

node:
	@echo "❌ Direct node usage is forbidden!"
	@echo "✅ Use: make up, make shell, etc."
	@exit 1

npx:
	@echo "❌ Direct npx usage is forbidden!"
	@echo "✅ Use appropriate make commands instead."
	@exit 1

# Development workflow shortcuts
dev: up ## Alias for 'up' - start development environment

start: up ## Alias for 'up' - start all services

stop: down ## Alias for 'down' - stop all services

restart: down up ## Restart all services

status: ## Show status of all services
	@echo "📊 Service status:"
	docker compose ps
