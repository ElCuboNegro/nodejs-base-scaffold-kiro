---
inclusion: always
---

# Docker-Only Development Environment Enforcement

## MANDATORY POLICY: ALL DEVELOPMENT ACTIVITIES MUST USE DOCKER

This project enforces a **Docker-only development environment**. No development, testing, or quality
checks should be performed directly on the host system.

## Why Docker-Only?

### Consistency

- Identical environment across all developers
- Eliminates "works on my machine" issues
- Consistent Node.js version (24.10.0)
- Identical dependency versions

### Security

- Isolated execution environment
- No host system contamination
- Controlled access to system resources
- Secure handling of sensitive operations

### Reliability

- Reproducible builds and tests
- Predictable behavior across environments
- Proper dependency management
- Clean state for each execution

## Enforced Docker Commands

### Development Workflow

```bash
# Start development environment
docker compose up --build

# Run application in development mode
docker compose run --rm verification-agent npm run dev

# Stop all services
docker compose down
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

### Quality Assurance Commands

```bash
# Run all quality checks
docker compose run --rm quality-runner npm run quality:check

# Run security scanning
docker compose run --rm quality-runner npm run security:scan

# Run linting
docker compose run --rm quality-runner npm run lint

# Run code formatting
docker compose run --rm quality-runner npm run format

# Generate documentation
docker compose run --rm quality-runner npm run docs:generate
```

### Database Operations

```bash
# Run database migrations
docker compose run --rm verification-agent npm run db:migrate

# Seed test data
docker compose run --rm verification-agent npm run db:seed

# Access PostgreSQL directly
docker compose exec postgres psql -U verification_user -d verification_db
```

## NPM Scripts Integration

All npm scripts have corresponding Docker commands:

```json
{
  "scripts": {
    "docker:test:bdd": "docker compose run --rm bdd-runner npm run test:bdd",
    "docker:test:project": "docker compose run --rm bdd-runner npm run test:bdd:project",
    "docker:test:quality": "docker compose run --rm bdd-runner npm run test:bdd:quality",
    "docker:test:security": "docker compose run --rm bdd-runner npm run test:bdd:security",
    "docker:test:performance": "docker compose run --rm bdd-runner npm run test:bdd:performance",
    "docker:quality:check": "docker compose run --rm quality-runner npm run quality:check",
    "docker:security:scan": "docker compose run --rm quality-runner npm run security:scan"
  }
}
```

## Docker Service Architecture

### Core Services

- **verification-agent**: Main application service
- **postgres**: PostgreSQL database for audit logs
- **redis**: Redis for session state management

### Testing Services

- **test-runner**: General testing environment
- **bdd-runner**: Dedicated BDD/Cucumber testing
- **quality-runner**: Code quality and security tools
- **performance-runner**: Performance and endurance testing

### Service Profiles

```bash
# BDD testing profile
docker compose --profile bdd up

# Quality tools profile
docker compose --profile quality up

# Performance testing profile
docker compose --profile performance up

# Full testing suite
docker compose --profile testing up
```

## Volume Management

### Persistent Volumes

- **postgres_data**: Database persistence
- **redis_data**: Redis persistence
- **node_modules**: Dependency caching
- **reports**: Test and quality reports

### Bind Mounts

- Source code mounted for development
- Reports directory for output access
- Configuration files for runtime

## Environment Variables

### Required Variables

```bash
# LLM Integration
LLM_API_KEY=your_api_key_here
LLM_PROVIDER=openai

# Security
ENCRYPTION_KEY=your_encryption_key
SESSION_SECRET=your_session_secret

# Database
DB_PASSWORD=your_secure_password

# Security Scanning
SNYK_TOKEN=your_snyk_token
```

### Environment Files

- Use `.env` file for local development
- Never commit `.env` files to version control
- Use `.env.example` as template

## Forbidden Host Commands

### ❌ NEVER RUN THESE ON HOST

```bash
# These commands are FORBIDDEN
npm install          # Use Docker instead
npm run test:bdd     # Use docker:test:bdd
npm run lint         # Use docker:quality:check
npx cucumber-js      # Use docker:test:bdd
node src/index.js    # Use docker compose up
```

### ✅ ALWAYS USE DOCKER EQUIVALENTS

```bash
# Correct Docker commands
docker compose run --rm bdd-runner npm install
docker compose run --rm bdd-runner npm run test:bdd
docker compose run --rm quality-runner npm run lint
docker compose run --rm bdd-runner npx cucumber-js
docker compose up verification-agent
```

## Development Workflow

### Initial Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd ai-voice-verification-agent

# 2. Copy environment template
cp .env.example .env

# 3. Edit environment variables
# Edit .env file with your values

# 4. Build and start services
docker compose up --build
```

### Daily Development

```bash
# Start development environment
docker compose up

# Run tests before committing
docker compose run --rm bdd-runner npm run test:bdd
docker compose run --rm quality-runner npm run quality:check

# Stop services when done
docker compose down
```

### Pre-commit Workflow

```bash
# Run all quality checks
docker compose run --rm quality-runner npm run quality:check

# Run BDD tests
docker compose run --rm bdd-runner npm run test:bdd

# Run security scanning
docker compose run --rm quality-runner npm run security:scan

# Only commit if all checks pass
```

## CI/CD Integration

### GitHub Actions

```yaml
name: Quality Gates
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run BDD Tests
        run: docker compose run --rm bdd-runner npm run test:bdd
      - name: Run Quality Checks
        run: docker compose run --rm quality-runner npm run quality:check
      - name: Run Security Scan
        run: docker compose run --rm quality-runner npm run security:scan
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 5253, 5432, 6379 are available
2. **Permission issues**: Use `--rm` flag to clean up containers
3. **Volume issues**: Use `docker compose down -v` to reset volumes
4. **Build issues**: Use `docker compose build --no-cache` for clean builds

### Debugging

```bash
# View logs
docker compose logs verification-agent
docker compose logs postgres
docker compose logs redis

# Access container shell
docker compose exec verification-agent sh
docker compose exec postgres bash

# Clean up everything
docker compose down -v
docker system prune -f
```

## Enforcement Mechanisms

### Pre-commit Hooks

- Husky hooks verify Docker usage
- Block commits that bypass Docker
- Validate environment setup

### CI/CD Validation

- All pipelines use Docker exclusively
- No host-based commands allowed
- Docker-compose validation required

### Code Review Requirements

- All scripts must use Docker commands
- Documentation must reference Docker usage
- No host-based instructions allowed

This Docker-only policy ensures consistent, secure, and reliable development practices across the
entire AI Voice Verification Agent project.
