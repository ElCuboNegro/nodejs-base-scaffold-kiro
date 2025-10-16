# Troubleshooting Guide

## Overview

This guide provides solutions to common issues encountered during development of the AI Voice
Verification Agent project. All solutions follow our Docker-only development policy.

## Table of Contents

- [Docker Issues](#docker-issues)
- [Environment Configuration](#environment-configuration)
- [Quality Tools Issues](#quality-tools-issues)
- [Testing Problems](#testing-problems)
- [Performance Issues](#performance-issues)
- [IDE Configuration](#ide-configuration)
- [Git and Pre-commit Issues](#git-and-pre-commit-issues)
- [Database Issues](#database-issues)
- [Security Scanning Issues](#security-scanning-issues)
- [Getting Help](#getting-help)

## Docker Issues

### Docker Desktop Not Running

**Problem**: `Cannot connect to the Docker daemon`

**Solution**:

```bash
# Windows/macOS: Start Docker Desktop application
# Linux: Start Docker daemon
sudo systemctl start docker

# Verify Docker is running
docker info
```

### Port Already in Use

**Problem**: `Port 5253 is already allocated` or similar port conflicts

**Solution**:

```bash
# Find process using the port
# Windows
netstat -ano | findstr :5253
taskkill /PID <process_id> /F

# macOS/Linux
lsof -i :5253
kill -9 <process_id>

# Or use different ports in .env file
PORT=5254
```

### Docker Compose Build Failures

**Problem**: `failed to solve: process "/bin/sh -c npm ci" did not complete successfully`

**Solution**:

```bash
# Clean build without cache
docker compose build --no-cache

# Remove all containers and images
docker compose down -v
docker system prune -a -f

# Rebuild from scratch
docker compose up --build
```

### Container Memory Issues

**Problem**: `JavaScript heap out of memory` or container crashes

**Solution**:

```bash
# Increase Docker memory allocation in Docker Desktop settings
# Minimum 4GB recommended, 8GB preferred

# Or add memory limits to compose.yaml
services:
  verification-agent:
    deploy:
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G
```

### Volume Mount Issues

**Problem**: Files not syncing between host and container

**Solution**:

```bash
# Windows: Ensure drive is shared in Docker Desktop settings
# Check file permissions
ls -la

# Recreate volumes
docker compose down -v
docker compose up --build

# For Windows: Use WSL2 backend in Docker Desktop
```

## Environment Configuration

### Missing .env File

**Problem**: `Error: Cannot find module` or environment variables not loaded

**Solution**:

```bash
# Copy template and configure
cp .env.example .env

# Edit with your values
# Required variables:
# LLM_PROVIDER=openai
# LLM_API_KEY=your_api_key_here
# ENCRYPTION_KEY=your_32_character_key
# SESSION_SECRET=your_session_secret
# DB_PASSWORD=your_secure_password
```

### Invalid API Keys

**Problem**: `401 Unauthorized` or `Invalid API key`

**Solution**:

```bash
# Verify API key format
# OpenAI: sk-...
# Anthropic: sk-ant-...

# Test API key
docker compose run --rm verification-agent node -e "
const openai = require('openai');
const client = new openai({ apiKey: process.env.LLM_API_KEY });
console.log('API key format looks correct');
"
```

### Database Connection Issues

**Problem**: `ECONNREFUSED` or database connection errors

**Solution**:

```bash
# Ensure PostgreSQL service is running
docker compose ps

# Check database logs
docker compose logs postgres

# Reset database
docker compose down -v
docker compose up postgres -d
docker compose run --rm verification-agent npm run db:migrate
```

## Quality Tools Issues

### ESLint Configuration Errors

**Problem**: `Error: Failed to load config` or ESLint not working

**Solution**:

```bash
# Verify ESLint configuration
docker compose run --rm quality-runner npx eslint --print-config package.json

# Check for syntax errors in .eslintrc.js
docker compose run --rm quality-runner node -c "require('./.eslintrc.js')"

# Reinstall dependencies
docker compose run --rm quality-runner npm ci
```

### Prettier Formatting Issues

**Problem**: Code not formatting correctly or Prettier conflicts with ESLint

**Solution**:

```bash
# Check Prettier configuration
docker compose run --rm quality-runner npx prettier --check .

# Fix formatting conflicts
docker compose run --rm quality-runner npm run format

# Verify ESLint-Prettier integration
docker compose run --rm quality-runner npx eslint-config-prettier
```

### Pre-commit Hooks Failing

**Problem**: `husky - pre-commit hook exited with code 1`

**Solution**:

```bash
# Run pre-commit checks manually
docker compose run --rm quality-runner npm run pre-commit:check

# Fix individual issues
docker compose run --rm quality-runner npm run lint:fix
docker compose run --rm quality-runner npm run format

# Reinstall Husky hooks
docker compose run --rm verification-agent npx husky install
```

### JSDoc Generation Failures

**Problem**: Documentation generation fails or incomplete docs

**Solution**:

```bash
# Check JSDoc configuration
docker compose run --rm quality-runner npx jsdoc --version

# Validate JSDoc comments
docker compose run --rm quality-runner npm run docs:validate

# Generate docs with verbose output
docker compose run --rm quality-runner npx jsdoc -c jsdoc.conf.json --verbose
```

## Testing Problems

### BDD Tests Failing

**Problem**: Cucumber tests not running or failing unexpectedly

**Solution**:

```bash
# Run with verbose output
docker compose run --rm bdd-runner npx cucumber-js --verbose

# Check step definitions
docker compose run --rm bdd-runner npx cucumber-js --dry-run

# Verify test data
docker compose run --rm bdd-runner node -e "
const testData = require('./tests/fixtures/test-data.js');
console.log('Test data loaded successfully');
"

# Run specific feature
docker compose run --rm bdd-runner npx cucumber-js tests/features/project-initialization.feature
```

### Jest Tests Not Running

**Problem**: Unit tests failing or not executing

**Solution**:

```bash
# Check Jest configuration
docker compose run --rm test-runner npx jest --showConfig

# Run with verbose output
docker compose run --rm test-runner npx jest --verbose

# Clear Jest cache
docker compose run --rm test-runner npx jest --clearCache

# Run specific test file
docker compose run --rm test-runner npx jest tests/unit/example.test.js
```

### Coverage Issues

**Problem**: Coverage reports not generating or incorrect coverage

**Solution**:

```bash
# Generate coverage report
docker compose run --rm test-runner npm run test:coverage

# Check coverage configuration
docker compose run --rm test-runner npx jest --showConfig | grep coverage

# View detailed coverage
docker compose run --rm test-runner npx jest --coverage --verbose
```

### Mock Data Issues

**Problem**: Test data not loading or PII in test data

**Solution**:

```bash
# Validate test data generators
docker compose run --rm bdd-runner node tests/fixtures/validate-test-data.js

# Regenerate PII-free test data
docker compose run --rm bdd-runner npm run generate:testdata

# Check for PII patterns
docker compose run --rm quality-runner grep -r "SSN\|Social Security" tests/ || echo "No PII found"
```

## Performance Issues

### Slow Test Execution

**Problem**: Tests taking too long to run

**Solution**:

```bash
# Run tests in parallel
docker compose run --rm bdd-runner npx cucumber-js --parallel 2

# Use test profiles for faster feedback
docker compose run --rm bdd-runner npm run test:bdd:smoke

# Check resource usage
docker stats

# Optimize Docker resources in Docker Desktop settings
```

### Memory Leaks in Tests

**Problem**: Tests consuming excessive memory

**Solution**:

```bash
# Run with memory monitoring
docker compose run --rm test-runner node --max-old-space-size=4096 node_modules/.bin/jest

# Check for memory leaks
docker compose run --rm test-runner npx jest --detectLeaks

# Use --runInBand for debugging
docker compose run --rm test-runner npx jest --runInBand
```

### Artillery Performance Tests Failing

**Problem**: Load tests not completing or failing

**Solution**:

```bash
# Check Artillery configuration
docker compose run --rm performance-runner npx artillery validate tests/performance/conversation-flow.yml

# Run with debug output
docker compose run --rm performance-runner npx artillery run --debug tests/performance/conversation-flow.yml

# Reduce load for debugging
# Edit artillery.yml to lower arrivalRate and duration
```

## IDE Configuration

### VS Code Extensions Not Working

**Problem**: ESLint, Prettier, or other extensions not functioning

**Solution**:

1. Install recommended extensions from `.vscode/extensions.json`
2. Reload VS Code window: `Ctrl+Shift+P` → "Developer: Reload Window"
3. Check extension settings in `.vscode/settings.json`
4. Verify Docker integration:
   ```bash
   # Test Docker commands from VS Code terminal
   docker --version
   docker compose --version
   ```

### Terminal Integration Issues

**Problem**: Docker commands not working in VS Code terminal

**Solution**:

1. Set correct default terminal profile in VS Code settings
2. Use integrated terminal tasks from `Ctrl+Shift+P` → "Tasks: Run Task"
3. Verify Docker Desktop is running
4. Check PATH environment variable includes Docker

### Debugging Not Working

**Problem**: Cannot attach debugger to Docker containers

**Solution**:

```bash
# Start application with debug port exposed
docker compose run --rm -p 9229:9229 verification-agent node --inspect=0.0.0.0:9229 src/index.js

# Use VS Code launch configuration "Docker: Debug Verification Agent"
# Ensure firewall allows port 9229
```

## Git and Pre-commit Issues

### Pre-commit Hooks Not Running

**Problem**: Git commits succeed without running quality checks

**Solution**:

```bash
# Reinstall Husky hooks
docker compose run --rm verification-agent npx husky install

# Verify hook files exist
ls -la .husky/

# Test hooks manually
.husky/pre-commit

# Check Git configuration
git config --list | grep core.hooksPath
```

### Lint-staged Not Processing Files

**Problem**: Staged files not being processed by quality tools

**Solution**:

```bash
# Check lint-staged configuration
cat .lintstagedrc.json

# Run lint-staged manually
docker compose run --rm quality-runner npx lint-staged

# Verify file patterns match staged files
git diff --cached --name-only
```

### Git LFS Issues

**Problem**: Large files not handled correctly

**Solution**:

```bash
# Install Git LFS
git lfs install

# Track large files
git lfs track "*.zip" "*.tar.gz" "reports/*.html"

# Verify LFS configuration
git lfs ls-files
```

## Database Issues

### PostgreSQL Connection Refused

**Problem**: Cannot connect to PostgreSQL database

**Solution**:

```bash
# Check PostgreSQL service status
docker compose ps postgres

# View PostgreSQL logs
docker compose logs postgres

# Restart PostgreSQL service
docker compose restart postgres

# Connect directly to debug
docker compose exec postgres psql -U verification_user -d verification_db
```

### Migration Failures

**Problem**: Database migrations not running or failing

**Solution**:

```bash
# Check migration files
ls -la src/database/migrations/

# Run migrations with verbose output
docker compose run --rm verification-agent npm run db:migrate -- --verbose

# Reset database and re-run migrations
docker compose down -v
docker compose up postgres -d
docker compose run --rm verification-agent npm run db:migrate
```

### Redis Connection Issues

**Problem**: Session storage not working

**Solution**:

```bash
# Check Redis service
docker compose ps redis

# Test Redis connection
docker compose exec redis redis-cli ping

# View Redis logs
docker compose logs redis

# Clear Redis data
docker compose exec redis redis-cli FLUSHALL
```

## Security Scanning Issues

### Snyk Authentication Failures

**Problem**: `Authentication failed` or `Invalid token`

**Solution**:

```bash
# Set Snyk token in .env file
SNYK_TOKEN=your_snyk_token_here

# Authenticate Snyk
docker compose run --rm quality-runner npx snyk auth

# Test authentication
docker compose run --rm quality-runner npx snyk test --dry-run
```

### False Positive Vulnerabilities

**Problem**: Snyk reporting vulnerabilities in dev dependencies

**Solution**:

```bash
# Scan production dependencies only
docker compose run --rm quality-runner npx snyk test --production

# Create .snyk policy file to ignore false positives
# Edit .snyk file to add ignore rules

# Update vulnerable dependencies
docker compose run --rm verification-agent npm audit fix
```

### License Compliance Issues

**Problem**: Incompatible licenses detected

**Solution**:

```bash
# Check current licenses
docker compose run --rm quality-runner npx license-checker

# Update license whitelist in package.json
"license-check": {
  "allow": ["MIT", "Apache-2.0", "BSD-3-Clause", "ISC"]
}

# Remove problematic dependencies
docker compose run --rm verification-agent npm uninstall problematic-package
```

## Getting Help

### Documentation Resources

1. **Project Documentation**:
   - [DEVELOPER-SETUP.md](./DEVELOPER-SETUP.md) - Complete setup guide
   - [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
   - [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines

2. **External Documentation**:
   - [Docker Documentation](https://docs.docker.com/)
   - [Node.js Documentation](https://nodejs.org/en/docs/)
   - [Jest Documentation](https://jestjs.io/docs/getting-started)
   - [Cucumber.js Documentation](https://cucumber.io/docs/cucumber/)

### Diagnostic Commands

```bash
# System information
docker --version
docker compose version
node --version
git --version

# Project status
docker compose ps
docker compose logs --tail=50

# Resource usage
docker stats
df -h

# Network connectivity
docker compose exec verification-agent ping postgres
docker compose exec verification-agent ping redis
```

### Creating Support Requests

When asking for help, include:

1. **Error Message**: Full error output with stack trace
2. **Environment**: OS, Docker version, Node.js version
3. **Steps to Reproduce**: Exact commands that cause the issue
4. **Expected vs Actual**: What should happen vs what actually happens
5. **Diagnostic Output**: Results from diagnostic commands above

### Emergency Recovery

If the development environment is completely broken:

```bash
# Nuclear option: Clean everything and start fresh
docker compose down -v
docker system prune -a -f
docker volume prune -f

# Remove local files (be careful!)
rm -rf node_modules
rm package-lock.json

# Start fresh
cp .env.example .env
# Edit .env with your values
docker compose up --build

# Run onboarding script
node scripts/developer-onboarding.js
```

## Common Error Patterns

### Pattern: "Module not found"

- **Cause**: Missing dependencies or incorrect paths
- **Solution**: Run `docker compose run --rm verification-agent npm ci`

### Pattern: "Permission denied"

- **Cause**: File permission issues or Docker not running as expected user
- **Solution**: Check Docker Desktop settings, ensure proper volume mounts

### Pattern: "Port already in use"

- **Cause**: Another service using the same port
- **Solution**: Change ports in .env file or stop conflicting services

### Pattern: "Cannot connect to Docker daemon"

- **Cause**: Docker Desktop not running or Docker daemon not started
- **Solution**: Start Docker Desktop or Docker daemon

### Pattern: "Network timeout" or "Connection refused"

- **Cause**: Services not ready or network configuration issues
- **Solution**: Wait for services to start, check service dependencies

Remember: All development must be done within Docker containers. Never run npm, node, or other
development commands directly on the host system.
