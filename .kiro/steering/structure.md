# Project Structure

## Root Level Organization

```
├── .dockerignore          # Docker build context exclusions
├── .git/                  # Git version control
├── .kiro/                 # Kiro AI assistant configuration
│   └── steering/          # AI guidance documents
├── compose.yaml           # Docker Compose configuration
├── Dockerfile             # Container build instructions
├── README.md              # Project documentation with setup instructions
├── package.json           # Node.js dependencies
├── package-lock.json      # Locked dependency versions
├── src/                   # Application source code
│   ├── agents/            # Verification agent implementations
│   ├── flows/             # Conversation flow definitions (JSON)
│   ├── services/          # External service integrations
│   ├── utils/             # Voice formatting and validation utilities
│   ├── models/            # Data models and validation schemas
│   └── config/            # Environment-specific configurations
├── tests/                 # Test suites
│   ├── features/          # BDD Gherkin feature files
│   ├── steps/             # Step definitions for BDD tests
│   ├── mocks/             # Mock LLM and service responses
│   └── data/              # Test data generators and fixtures
└── docs/                  # Additional documentation
    ├── conversation-examples/ # Sample conversation flows
    └── security-considerations.md
```

## Core Application Structure

### Agent Implementation (`src/agents/`)

```
├── VerificationAgent.js   # Main agent class with conversation logic
├── ConversationState.js   # State management for conversation flow
├── IdentityGate.js        # Identity verification gate logic
└── ResponseGenerator.js   # Voice-optimized response generation
```

### Conversation Flows (`src/flows/`)

```
├── identity-verification.json    # Node 1: Identity gate flow
├── contact-information.json      # Node 2: Address and email collection
├── financial-verification.json   # Node 3: Income and employment
├── final-confirmation.json       # Node 4: Summary and completion
└── failure-termination.json      # Failure handling flows
```

### Utilities (`src/utils/`)

```
├── voiceFormatUtils.js    # TTS optimization formatting
├── dataValidation.js      # Input validation and normalization
├── securityUtils.js       # PII handling and pseudonymization
└── conversationLogger.js  # Structured logging for conversations
```

### Services (`src/services/`)

```
├── LLMService.js          # LLM integration abstraction
├── VerificationService.js # External identity verification
├── StateManager.js        # Session state persistence (Redis)
├── AuditLogger.js         # PostgreSQL audit logging service
└── TransactionManager.js  # Transaction record management
```

### Database Layer (`src/database/`)

```
├── models/                # Database models and schemas
│   ├── AuditLog.js       # Audit log model with compliance fields
│   ├── Transaction.js    # Transaction record model
│   └── Session.js        # Session metadata model
├── migrations/           # Database schema migrations
│   ├── 001_create_audit_logs.sql
│   ├── 002_create_transactions.sql
│   └── 003_create_indexes.sql
├── seeds/               # Test data seeds for development
│   ├── audit_logs.sql
│   └── transactions.sql
└── connection.js        # PostgreSQL connection management
```

## Testing Structure

### BDD Framework (`tests/`)

```
├── features/
│   ├── identity-verification.feature     # Identity gate scenarios
│   ├── contact-collection.feature        # Address/email scenarios
│   ├── financial-verification.feature    # Income/employment scenarios
│   ├── tenure-discrepancy.feature        # Job tenure validation
│   └── failure-handling.feature          # Verification failure flows
├── steps/
│   ├── conversation-steps.js             # Common conversation steps
│   ├── identity-steps.js                 # Identity verification steps
│   └── validation-steps.js               # Data validation steps
├── mocks/
│   ├── mockLLMService.js                 # Deterministic LLM responses
│   ├── mockVerificationService.js        # Identity verification mocks
│   └── testDataGenerator.js              # PII-free test data generation
└── fixtures/
    ├── successful-flows.json             # Complete successful conversations
    ├── failure-scenarios.json            # Various failure cases
    └── edge-cases.json                   # Boundary condition tests
```

## Configuration Management

### Environment Configuration (`src/config/`)

```
├── default.js             # Default configuration values
├── development.js         # Development environment overrides
├── production.js          # Production environment settings
└── test.js                # Test environment configuration
```

### Key Configuration Areas

- **LLM Integration**: API endpoints, model selection, timeout settings
- **Verification Thresholds**: `job_tenure_in_months` and other business rules
- **Security Settings**: Encryption keys, session timeouts, retry limits
- **Voice Optimization**: TTS formatting rules, pause patterns
- **Logging Configuration**: Log levels, structured logging formats

## Docker Configuration

### Multi-Stage Build Pattern

- **Development Stage**: Full toolchain with testing dependencies
- **Production Stage**: Minimal runtime with security hardening
- **Test Stage**: Isolated environment for BDD test execution

### Container Orchestration

- **Main Application**: Verification agent service
- **Redis**: Session state management for active conversations
- **PostgreSQL**: Persistent audit logging and transaction records
- **Test Runner**: Isolated container for BDD test execution
- **Mock Services**: Containerized mocks for integration testing

## Development Patterns

### Security-First Architecture

- **Identity Gate**: Centralized security checkpoint implementation
- **PII Isolation**: Session-scoped data handling with automatic cleanup
- **Audit Logging**: Comprehensive conversation tracking without PII storage
- **Fail-Safe Defaults**: Secure termination on verification failures

### Voice-Optimized Design

- **Response Formatting**: Centralized TTS optimization utilities
- **Conversation Pacing**: Natural pause patterns in multi-part responses
- **Error Communication**: Professional, empathetic failure messaging
- **Confirmation Patterns**: Consistent digit-by-digit and letter-by-letter confirmations

### Testing Integration

- **Container-Only Testing**: All tests run in Docker without host dependencies
- **Mock-First Development**: Deterministic testing with comprehensive mocks
- **BDD Coverage**: Gherkin scenarios covering all conversation paths
- **Edge Case Validation**: Comprehensive failure scenario testing

## Documentation Standards

### Required Documentation

- **README.md**: Complete setup instructions with all configuration variables
- **API Documentation**: Service integration patterns and response formats
- **Security Considerations**: PII handling, encryption, and compliance notes
- **Conversation Examples**: Sample flows for successful and failed verifications
- **Testing Guide**: BDD scenario execution and mock data generation

### Code Documentation

- **Inline Comments**: Security-critical sections and business logic
- **JSDoc Standards**: Comprehensive function and class documentation
- **Configuration Comments**: Clear explanation of all environment variables
- **Flow Documentation**: JSON schema validation for conversation flows
