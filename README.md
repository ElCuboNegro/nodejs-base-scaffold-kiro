# AI Voice Verification Agent

Node.js conversational verification system for financial services conducting secure identity
verification through voice-optimized interactions for loan processing applications.

## 🐳 DOCKER-ONLY DEVELOPMENT ENVIRONMENT

**⚠️ CRITICAL: This project enforces a Docker-only development environment. NO local npm, node, or
JavaScript execution is allowed.**

### Why Docker-Only?

- **Consistency**: Identical environment across all developers
- **Security**: Isolated execution environment
- **Reliability**: Reproducible builds and tests
- **Compliance**: Financial services security requirements

## 🚀 Quick Start

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) (required)
- Git (required)
- Make (optional, for convenience commands)

### Initial Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd ai-voice-verification-agent

# 2. Run setup script
make setup
# OR manually:
# cp .env.example .env
# Edit .env with your values

# 3. Start development environment
make up
# OR: docker compose up --build
```

## 📋 Available Commands

### Using Make (Recommended)

```bash
# Development
make up          # Start all services
make down        # Stop all services
make logs        # View logs
make shell       # Open container shell

# Testing
make test        # Run all tests
make test-bdd    # Run BDD tests
make test-unit   # Run unit tests

# Quality
make lint        # Run ESLint
make format      # Format code
make security    # Security scan
make quality     # All quality checks

# Database
make db-migrate  # Run migrations
make db-seed     # Seed test data

# Utilities
make clean       # Clean Docker resources
make validate    # Validate environment
make help        # Show all commands
```

### Using Docker Compose Directly

```bash
# Development
docker compose up --build                              # Start all services
docker compose down                                    # Stop all services

# Testing
docker compose run --rm test-runner npm run _test     # All tests
docker compose run --rm bdd-runner npm run test:bdd   # BDD tests

# Quality
docker compose run --rm quality-runner npm run _lint  # Linting
docker compose run --rm quality-runner npm run _format # Formatting
docker compose run --rm quality-runner npm run _security:scan # Security

# Application
docker compose run --rm verification-agent npm run _dev # Development mode
```

## ❌ FORBIDDEN COMMANDS

**These commands are absolutely prohibited and will fail:**

```bash
# Package Management - FORBIDDEN
npm install      # ❌ Use: make install
npm ci          # ❌ Use: make install
npm run test    # ❌ Use: make test
npm run lint    # ❌ Use: make lint
npm start       # ❌ Use: make up

# Node.js Execution - FORBIDDEN
node src/index.js    # ❌ Use: make up
node --version       # ❌ Use: make shell

# NPX Commands - FORBIDDEN
npx cucumber-js      # ❌ Use: make test-bdd
npx eslint src/      # ❌ Use: make lint
npx prettier .       # ❌ Use: make format
```

## 🏗️ Project Structure

```
├── .kiro/                     # Kiro AI configuration
│   └── steering/              # Development standards
├── src/                       # Application source code
│   ├── agents/               # Verification agent implementations
│   ├── flows/                # Conversation flow definitions
│   ├── services/             # External service integrations
│   ├── utils/                # Utilities and helpers
│   └── models/               # Data models
├── tests/                    # Test suites
│   ├── features/             # BDD Gherkin feature files
│   ├── steps/                # Cucumber step definitions
│   ├── support/              # Test support files
│   └── mocks/                # Mock data and services
├── scripts/                  # Utility scripts
├── docs/                     # Documentation
├── reports/                  # Generated reports
├── Dockerfile                # Multi-stage Docker build
├── compose.yaml              # Docker Compose configuration
├── Makefile                  # Convenience commands
└── README.md                 # This file
```

## 🧪 Testing

### BDD Tests (Cucumber)

```bash
# Run all BDD tests
make test-bdd

# Run specific test categories
docker compose run --rm bdd-runner npm run test:bdd:project
docker compose run --rm bdd-runner npm run test:bdd:security
docker compose run --rm bdd-runner npm run test:bdd:quality
```

### Unit and Integration Tests

```bash
# Run all tests with coverage
make test

# Run specific test types
make test-unit
make test-integration
```

### Performance Tests

```bash
# Run endurance tests
make test-performance
```

## 🔍 Code Quality

### Linting and Formatting

```bash
# Check code quality
make lint

# Fix linting issues
make lint-fix

# Format code
make format

# Check formatting
make format-check
```

### Security Scanning

```bash
# Run security scan
make security

# Run all quality checks
make quality
```

## 🗃️ Database Operations

```bash
# Run database migrations
make db-migrate

# Seed test data
make db-seed

# Access PostgreSQL directly
docker compose exec postgres psql -U verification_user -d verification_db
```

## 🔧 Development Workflow

### Daily Development

```bash
# 1. Start development environment
make up

# 2. Make code changes
# Edit files in your IDE

# 3. Run tests
make test-bdd
make test

# 4. Check code quality
make quality

# 5. Stop services when done
make down
```

### Pre-commit Workflow

```bash
# Run all quality checks before committing
make quality
make test-bdd
make security

# Only commit if all checks pass
git add .
git commit -m "Your commit message"
```

## 🐛 Troubleshooting

### Common Issues

1. **Docker not running**

   ```bash
   # Error: Cannot connect to Docker daemon
   # Solution: Start Docker Desktop
   ```

2. **Port conflicts**

   ```bash
   # Error: Port already in use
   # Solution: Stop conflicting services or change ports in compose.yaml
   ```

3. **Permission issues**

   ```bash
   # Error: Permission denied
   # Solution: Ensure Docker has proper permissions
   ```

4. **Local violations**
   ```bash
   # Error: Local node_modules found
   # Solution: make clean-violations
   ```

### Debugging

```bash
# View service logs
make logs

# Access container shell
make shell

# Check service status
docker compose ps

# Validate environment
make validate
```

### Clean Up

```bash
# Clean up Docker resources
make clean

# Clean up local violations
make clean-violations

# Complete reset
make clean
make clean-violations
make build
```

## 🔒 Security

### Environment Variables

Required environment variables (see `.env.example`):

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

### Security Scanning

```bash
# Run comprehensive security scan
make security

# Check for vulnerabilities
docker compose run --rm quality-runner npm audit

# License compliance check
docker compose run --rm quality-runner npm run security:licenses
```

## 📊 Monitoring and Reports

### Test Reports

Reports are generated in the `reports/` directory:

- `reports/cucumber.json` - BDD test results
- `reports/cucumber.html` - BDD test report
- `coverage/` - Test coverage reports

### Quality Reports

```bash
# Generate all reports
make quality

# View reports
open reports/cucumber.html
open coverage/lcov-report/index.html
```

## 🤝 Contributing

### Development Standards

- All code must follow Google JavaScript Style Guide
- 100% test coverage required
- All tests must pass in Docker containers
- Security scanning must pass
- BDD scenarios required for new features

### Pull Request Process

1. Create feature branch
2. Make changes following standards
3. Run full test suite: `make quality && make test-bdd`
4. Submit pull request
5. Ensure CI/CD pipeline passes

## 📚 Documentation

### API Documentation

```bash
# Generate API documentation
make docs

# View documentation
open docs/generated/index.html
```

### Additional Documentation

- [Architecture Overview](docs/architecture.md)
- [Security Considerations](docs/security.md)
- [Conversation Flow Design](docs/conversation-flows.md)
- [Testing Strategy](docs/testing.md)

## 📄 License

This project is proprietary software. See LICENSE file for details.

## 🆘 Support

For support and questions:

1. Check this README
2. Review troubleshooting section
3. Check project documentation
4. Contact the development team

---

**Remember: Always use Docker commands. Local npm/node execution is forbidden and will fail.**
