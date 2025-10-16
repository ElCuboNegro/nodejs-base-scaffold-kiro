# Developer Setup Guide

## Overview

This guide provides comprehensive setup instructions for the AI Voice Verification Agent project's
development environment. All development activities must be performed within Docker containers
following our Docker-only policy.

## Prerequisites

### Required Software

- **Docker Desktop**: Version 4.0 or later
  - Windows: Download from
    [Docker Desktop for Windows](https://docs.docker.com/desktop/windows/install/)
  - macOS: Download from [Docker Desktop for Mac](https://docs.docker.com/desktop/mac/install/)
  - Linux: Follow [Docker Engine installation guide](https://docs.docker.com/engine/install/)

- **Git**: Version 2.30 or later
  - Windows: Download from [Git for Windows](https://git-scm.com/download/win)
  - macOS: Install via Homebrew `brew install git` or download from
    [Git website](https://git-scm.com/download/mac)
  - Linux: Install via package manager (e.g., `sudo apt install git`)

- **Visual Studio Code** (Recommended IDE)
  - Download from [VS Code website](https://code.visualstudio.com/)
  - Required extensions listed in [IDE Configuration](#ide-configuration)

### System Requirements

- **RAM**: Minimum 8GB, recommended 16GB
- **Storage**: Minimum 10GB free space for Docker images and containers
- **CPU**: Multi-core processor recommended for parallel testing

## Initial Setup

### 1. Repository Setup

```bash
# Clone the repository
git clone <repository-url>
cd ai-voice-verification-agent

# Copy environment template
cp .env.example .env

# Edit environment variables (see Environment Configuration section)
# Use your preferred text editor to modify .env
```

### 2. Environment Configuration

Edit the `.env` file with your specific values:

```bash
# LLM Integration
LLM_PROVIDER=openai
LLM_API_KEY=your_api_key_here
LLM_MODEL=gpt-4
LLM_TIMEOUT=30000

# Business Logic
JOB_TENURE_THRESHOLD=24
IDENTITY_RETRY_LIMIT=3
SESSION_TIMEOUT=1800

# Security
ENCRYPTION_KEY=your_32_character_encryption_key
SESSION_SECRET=your_session_secret_here
LOG_LEVEL=info

# Storage
REDIS_URL=redis://redis:6379
REDIS_SESSION_TTL=1800
DATABASE_URL=postgresql://verification_user:your_db_password@postgres:5432/verification_db
DB_PASSWORD=your_secure_db_password

# Security Scanning (Optional for development)
SNYK_TOKEN=your_snyk_token_here

# Application
NODE_ENV=development
PORT=5253
```

### 3. Docker Environment Validation

Run the environment validation script:

```bash
# Validate Docker setup
docker compose run --rm verification-agent node scripts/validate-docker-environment.js

# Verify all services can start
docker compose up --build
```

## Development Workflow

### Daily Development Commands

```bash
# Start development environment
docker compose up --build

# Run in detached mode (background)
docker compose up -d --build

# View logs
docker compose logs -f verification-agent

# Stop services
docker compose down

# Stop and remove volumes (clean slate)
docker compose down -v
```

### Quality Assurance Commands

```bash
# Run all quality checks
docker compose run --rm quality-runner npm run quality:check

# Run individual quality tools
docker compose run --rm quality-runner npm run lint
docker compose run --rm quality-runner npm run format
docker compose run --rm quality-runner npm run security:scan
docker compose run --rm quality-runner npm run docs:generate

# Fix common issues automatically
docker compose run --rm quality-runner npm run lint:fix
docker compose run --rm quality-runner npm run format:fix
```

### Testing Commands

```bash
# Run all BDD tests
docker compose run --rm bdd-runner npm run test:bdd

# Run specific test categories
docker compose run --rm bdd-runner npm run test:bdd:project
docker compose run --rm bdd-runner npm run test:bdd:quality
docker compose run --rm bdd-runner npm run test:bdd:security
docker compose run --rm bdd-runner npm run test:bdd:performance
docker compose run --rm bdd-runner npm run test:bdd:ci-cd
docker compose run --rm bdd-runner npm run test:bdd:docs

# Run unit and integration tests
docker compose run --rm test-runner npm run test:coverage

# Run performance tests
docker compose run --rm performance-runner npm run test:endurance
```

### Database Operations

```bash
# Run database migrations
docker compose run --rm verification-agent npm run db:migrate

# Seed test data
docker compose run --rm verification-agent npm run db:seed

# Access PostgreSQL directly
docker compose exec postgres psql -U verification_user -d verification_db

# View audit logs
docker compose exec postgres psql -U verification_user -d verification_db -c "SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 10;"
```

## Quality Tools Configuration

### ESLint (Code Linting)

**Configuration**: `.eslintrc.js` **Purpose**: Enforces Google JavaScript Style Guide standards

```bash
# Run linting
docker compose run --rm quality-runner npm run lint

# Fix auto-fixable issues
docker compose run --rm quality-runner npm run lint:fix

# Lint specific files
docker compose run --rm quality-runner npx eslint src/agents/VerificationAgent.js
```

### Prettier (Code Formatting)

**Configuration**: `.prettierrc.js` **Purpose**: Automatic code formatting following Google
standards

```bash
# Format all files
docker compose run --rm quality-runner npm run format

# Format specific files
docker compose run --rm quality-runner npx prettier --write src/agents/
```

### Husky (Git Hooks)

**Configuration**: `.husky/` directory **Purpose**: Automated quality checks on git operations

```bash
# Pre-commit hooks run automatically on git commit
# Pre-push hooks run automatically on git push

# Manually run pre-commit checks
docker compose run --rm quality-runner npm run pre-commit:check
```

### Snyk (Security Scanning)

**Configuration**: `.snyk` file and environment variables **Purpose**: Dependency vulnerability
scanning

```bash
# Run security scan
docker compose run --rm quality-runner npm run security:scan

# Monitor project (requires Snyk token)
docker compose run --rm quality-runner npx snyk monitor
```

### Jest (Unit Testing)

**Configuration**: `jest.config.js` **Purpose**: Unit and integration testing with coverage

```bash
# Run all tests with coverage
docker compose run --rm test-runner npm run test:coverage

# Run tests in watch mode
docker compose run --rm test-runner npm run test:watch

# Run specific test files
docker compose run --rm test-runner npx jest src/agents/VerificationAgent.test.js
```

### Cucumber (BDD Testing)

**Configuration**: `cucumber.js` **Purpose**: Behavior-driven development testing

```bash
# Run all BDD scenarios
docker compose run --rm bdd-runner npm run test:bdd

# Run specific feature files
docker compose run --rm bdd-runner npx cucumber-js tests/features/identity-verification.feature

# Generate BDD reports
docker compose run --rm bdd-runner npm run test:bdd -- --format html:reports/cucumber.html
```

### Artillery (Performance Testing)

**Configuration**: `artillery.yml` **Purpose**: Load and endurance testing

```bash
# Run endurance tests
docker compose run --rm performance-runner npm run test:endurance

# Run specific performance scenarios
docker compose run --rm performance-runner npx artillery run tests/performance/conversation-flow.yml
```

### JSDoc (Documentation Generation)

**Configuration**: `jsdoc.conf.json` **Purpose**: API documentation generation

```bash
# Generate documentation
docker compose run --rm quality-runner npm run docs:generate

# Validate documentation
docker compose run --rm quality-runner npm run docs:validate
```

## Pre-commit Workflow

### Automatic Quality Gates

When you commit code, the following checks run automatically:

1. **Code Formatting**: Prettier formats staged files
2. **Linting**: ESLint validates code quality
3. **Security Scanning**: Snyk scans for vulnerabilities
4. **Documentation**: JSDoc validates documentation
5. **Quick Tests**: Fast unit tests run

### Manual Pre-commit Checks

```bash
# Run all pre-commit checks manually
docker compose run --rm quality-runner npm run pre-commit:check

# Run individual checks
docker compose run --rm quality-runner npm run lint
docker compose run --rm quality-runner npm run security:scan
docker compose run --rm test-runner npm run test:quick
```

## Troubleshooting

See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for common issues and solutions.

## IDE Configuration

See [IDE-SETUP.md](./IDE-SETUP.md) for Visual Studio Code configuration.

## Advanced Topics

### Custom Docker Services

You can run custom commands in any service:

```bash
# Access shell in verification-agent service
docker compose run --rm verification-agent sh

# Run custom Node.js scripts
docker compose run --rm verification-agent node scripts/custom-script.js

# Install additional packages (temporary)
docker compose run --rm verification-agent npm install --save-dev new-package
```

### Performance Optimization

```bash
# Build images without cache for clean builds
docker compose build --no-cache

# Prune unused Docker resources
docker system prune -f

# View resource usage
docker stats
```

### Debugging

```bash
# Run with debug logging
NODE_ENV=debug docker compose up

# Access container logs
docker compose logs verification-agent
docker compose logs postgres
docker compose logs redis

# Debug specific services
docker compose run --rm verification-agent node --inspect=0.0.0.0:9229 src/index.js
```

## Getting Help

1. **Documentation**: Check this guide and related documentation files
2. **Troubleshooting**: See [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
3. **Issues**: Create GitHub issues for bugs or feature requests
4. **Team Chat**: Use team communication channels for questions

## Next Steps

After completing setup:

1. Run the full test suite to verify everything works
2. Review the [CONTRIBUTING.md](../CONTRIBUTING.md) guide
3. Check out the [ARCHITECTURE.md](./ARCHITECTURE.md) for system overview
4. Start with simple changes to familiarize yourself with the workflow
