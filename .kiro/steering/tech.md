# Technology Stack

## Runtime & Platform

- **Node.js**: Version 24.10.0 (Alpine Linux base)
- **Environment**: Production-ready containerized deployment
- **Port**: Application serves on port 5253
- **Interface**: Conversational text interface (voice interface out of scope)

## Core Dependencies

### LLM Integration

- **Primary**: OpenAI GPT-4 or Anthropic Claude for conversation management
- **Fallback**: Configurable secondary LLM provider
- **Response Format**: Structured JSON for conversation state management
- **Timeout**: 30-second maximum response time with circuit breaker

### Testing Framework

- **BDD**: Cucumber.js for Gherkin scenario execution
- **Test Runner**: Jest for unit and integration testing
- **Mocking**: Sinon.js for LLM and external service mocks
- **Coverage**: NYC/Istanbul for test coverage reporting

### State Management & Persistence

- **Session Storage**: Redis for temporary conversation state
- **Audit Storage**: PostgreSQL for persistent logging and transactions
- **Configuration**: node-config for environment-specific settings
- **Validation**: Joi for data schema validation and sanitization
- **Logging**: Winston with structured JSON logging
- **ORM**: Sequelize or Prisma for PostgreSQL data modeling

## Containerization

### Docker Configuration

- **Base Image**: `node:24.10.0-alpine` for minimal attack surface
- **Multi-Stage Build**: Development, testing, and production stages
- **Security**: Non-root user execution with minimal privileges
- **Layer Optimization**: Dependency caching for faster builds

### Docker Compose Services

```yaml
services:
  verification-agent:
    build: .
    ports:
      - '5253:5253'
    environment:
      - NODE_ENV=development
      - LLM_API_KEY=${LLM_API_KEY}
      - JOB_TENURE_THRESHOLD=24
      - DATABASE_URL=postgresql://user:pass@postgres:5432/verification_db
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=verification_db
      - POSTGRES_USER=verification_user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./src/database/migrations:/docker-entrypoint-initdb.d

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

  test-runner:
    build:
      target: test
    volumes:
      - ./tests:/app/tests
    environment:
      - NODE_ENV=test
      - DATABASE_URL=postgresql://test:test@postgres:5432/verification_test_db
    depends_on:
      - postgres
    command: npm run test:bdd

volumes:
  postgres_data:
  redis_data:
```

## Development Commands

### Local Development

```bash
# Build and run full stack with database
docker compose up --build

# Run database migrations
docker compose run verification-agent npm run db:migrate

# Seed test data (development only)
docker compose run verification-agent npm run db:seed

# Run BDD tests in Docker
docker compose run test-runner npm run test:bdd

# Run all tests with coverage
docker compose run test-runner npm run test:coverage

# Interactive conversation simulator
docker compose run verification-agent npm run simulate

# View audit logs
docker compose exec postgres psql -U verification_user -d verification_db -c "SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 10;"
```

### Testing & Validation

```bash
# Run identity verification scenarios
docker compose run test-runner npm run test:identity

# Run financial verification scenarios
docker compose run test-runner npm run test:financial

# Run failure handling scenarios
docker compose run test-runner npm run test:failures

# Generate test data (PII-free)
docker compose run test-runner npm run generate:testdata
```

## Environment Configuration

### Required Environment Variables

```bash
# LLM Integration
LLM_PROVIDER=openai|anthropic|azure
LLM_API_KEY=your_api_key_here
LLM_MODEL=gpt-4|claude-3|gpt-3.5-turbo
LLM_TIMEOUT=30000

# Business Logic
JOB_TENURE_THRESHOLD=24
IDENTITY_RETRY_LIMIT=3
SESSION_TIMEOUT=1800

# Security
ENCRYPTION_KEY=your_encryption_key
SESSION_SECRET=your_session_secret
LOG_LEVEL=info|debug|error

# Storage
REDIS_URL=redis://localhost:6379
REDIS_SESSION_TTL=1800
DATABASE_URL=postgresql://user:pass@localhost:5432/verification_db
DB_PASSWORD=your_secure_db_password
DB_POOL_SIZE=10
DB_CONNECTION_TIMEOUT=30000

# Audit & Compliance
AUDIT_LOG_RETENTION_DAYS=2555  # 7 years for financial compliance
TRANSACTION_LOG_RETENTION_DAYS=2555
PII_PSEUDONYMIZATION_KEY=your_pseudonymization_key

# Application
NODE_ENV=development|production|test
PORT=5253
```

### Configuration Management

- **node-config**: Environment-specific configuration files
- **Validation**: Startup validation for all required environment variables
- **Secrets**: Docker secrets or environment variable injection
- **Hot Reload**: Configuration changes without restart (development only)

## Security Implementation

### Data Protection

- **Encryption**: AES-256-GCM for sensitive data at rest
- **Transport**: TLS 1.3 for all external communications
- **PII Handling**: Session-scoped pseudonymization with automatic cleanup
- **Database Encryption**: PostgreSQL TDE (Transparent Data Encryption)
- **Audit Logging**: Comprehensive logging without PII storage in PostgreSQL
- **Data Retention**: Automated purging based on compliance requirements

### Authentication & Authorization

- **API Keys**: Secure LLM provider authentication
- **Session Management**: Redis-based session state with TTL
- **Input Validation**: Joi schema validation for all user inputs
- **Rate Limiting**: Conversation attempt limiting per session

## Voice Optimization Libraries

### Text-to-Speech Formatting

```javascript
// Custom utility for voice optimization
const voiceFormatUtils = {
  formatSSN: (digits) => digits.split('').join('-'),
  formatEmail: (email) => email.split('').join(' '),
  formatDate: (date) => convertToSpokenFormat(date),
  formatCurrency: (amount) => convertToNaturalSpeech(amount),
};
```

### Response Generation

- **Template Engine**: Handlebars for dynamic response generation
- **Voice Patterns**: Predefined patterns for confirmations and questions
- **Pause Insertion**: Natural conversation pacing markers
- **Error Messages**: Professional, empathetic failure communication

## Testing Architecture

### BDD Framework Setup

```javascript
// Cucumber configuration
module.exports = {
  default: {
    require: ['tests/steps/**/*.js'],
    format: ['json:reports/cucumber.json', 'html:reports/cucumber.html'],
    paths: ['tests/features/**/*.feature'],
    parallel: 2,
  },
};
```

### Mock Services

- **LLM Mocking**: Deterministic responses for conversation testing
- **Verification Mocking**: Configurable identity verification outcomes
- **State Mocking**: In-memory session state for isolated testing
- **Data Generation**: PII-free test data with realistic patterns

## Performance & Monitoring

### Response Time Targets

- **Agent Response**: P95 < 2 seconds for conversation turns
- **Identity Verification**: P99 < 5 seconds for validation calls
- **State Persistence**: P95 < 100ms for session operations
- **LLM Integration**: P95 < 30 seconds with timeout handling

### Monitoring Stack

- **Metrics**: Prometheus metrics collection
- **Logging**: Structured JSON logs with correlation IDs
- **Tracing**: OpenTelemetry for distributed tracing
- **Health Checks**: Kubernetes-compatible health endpoints
- **Database Monitoring**: PostgreSQL performance metrics and query analysis
- **Audit Dashboards**: Real-time compliance and transaction monitoring

### Production Deployment

```bash
# Build for production with optimizations
docker build --target production -t verification-agent:latest .

# Multi-architecture build for cloud deployment
docker buildx build --platform linux/amd64,linux/arm64 -t verification-agent:latest .

# Health check endpoint
curl http://localhost:5253/health
```

## Integration Patterns

### LLM Service Integration

```javascript
class LLMService {
  constructor(provider, apiKey, model) {
    this.client = createClient(provider, apiKey);
    this.model = model;
    this.circuitBreaker = new CircuitBreaker(this.generateResponse);
  }

  async generateResponse(prompt, context) {
    // Structured conversation management
  }
}
```

### External Service Patterns

- **Circuit Breakers**: Resilient external service calls
- **Retry Logic**: Exponential backoff with jitter
- **Fallback Responses**: Graceful degradation for service failures
- **Timeout Handling**: Configurable timeouts with user communication
