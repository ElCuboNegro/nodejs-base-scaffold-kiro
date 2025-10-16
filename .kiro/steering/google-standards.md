# Google Code and Documentation Standards

## JavaScript Style Guide

All JavaScript code in this project MUST follow the
[Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html).

### Key Requirements

#### Code Formatting

- **Indentation**: 2 spaces, no tabs
- **Line Length**: 80 characters maximum
- **Semicolons**: Required for all statements
- **Quotes**: Single quotes for strings, double quotes for JSDoc
- **Trailing Commas**: Required in multiline arrays and objects

#### Naming Conventions

- **Variables/Functions**: camelCase (`getUserData`, `sessionTimeout`)
- **Constants**: SCREAMING_SNAKE_CASE (`MAX_RETRY_ATTEMPTS`, `API_BASE_URL`)
- **Classes**: PascalCase (`VerificationAgent`, `ConversationState`)
- **Files**: kebab-case (`verification-agent.js`, `conversation-state.js`)
- **Private Methods**: Prefix with underscore (`_validateInput`, `_logAudit`)

#### Function Documentation

```javascript
/**
 * Validates user identity information for verification gate.
 * @param {string} dateOfBirth - Date in MM/DD/YYYY format
 * @param {string} ssnLast4 - Last 4 digits of SSN
 * @return {Promise<boolean>} True if identity verification passes
 * @throws {ValidationError} When input format is invalid
 */
async function validateIdentity(dateOfBirth, ssnLast4) {
  // Implementation
}
```

#### Class Documentation

```javascript
/**
 * Manages conversation state and flow for verification agent.
 *
 * Handles secure session management, identity verification gates,
 * and conversation flow progression through verification nodes.
 *
 * @example
 * const agent = new VerificationAgent({
 *   sessionTimeout: 1800,
 *   maxRetries: 3
 * });
 *
 * @see {@link https://internal-docs/verification-flows}
 */
class VerificationAgent {
  /**
   * Creates a new verification agent instance.
   * @param {Object} config - Configuration options
   * @param {number} config.sessionTimeout - Session timeout in seconds
   * @param {number} config.maxRetries - Maximum retry attempts
   */
  constructor(config) {
    // Implementation
  }
}
```

## Documentation Standards

All documentation MUST follow
[Google's Documentation Style Guide](https://developers.google.com/style).

### README Structure

````markdown
# Project Name

Brief description of what the project does.

## Prerequisites

- Node.js 24.10.0 or later
- Docker and Docker Compose
- Required environment variables (see Configuration)

## Quick Start

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment: `cp .env.example .env`
4. Start services: `docker compose up`

## Configuration

### Environment Variables

| Variable          | Description                | Required | Default |
| ----------------- | -------------------------- | -------- | ------- |
| `LLM_API_KEY`     | API key for LLM service    | Yes      | -       |
| `SESSION_TIMEOUT` | Session timeout in seconds | No       | 1800    |

## API Reference

### Endpoints

#### POST /api/conversation/start

Initiates a new verification conversation.

**Request Body:**

```json
{
  "sessionId": "string (required)"
}
```
````

**Response:**

```json
{
  "success": true,
  "conversationId": "uuid",
  "nextNode": 1
}
```

## Development

### Running Tests

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# BDD tests
npm run test:bdd
```

### Code Quality

```bash
# Lint code
npm run lint

# Format code
npm run format

# Security scan
npm run security:scan
```

## Contributing

1. Follow Google JavaScript Style Guide
2. Write comprehensive JSDoc comments
3. Include unit tests for new functionality
4. Update documentation for API changes

## License

[License information]

````

### Code Comments
- **Purpose**: Explain WHY, not WHAT
- **Complexity**: Document complex algorithms and business logic
- **Security**: Mark security-critical sections
- **TODO**: Use `TODO(username): description` format

```javascript
// TODO(security-team): Implement rate limiting for identity verification attempts

/**
 * Validates SSN format and performs security checks.
 *
 * SECURITY: This function handles PII data. Ensure proper logging
 * and audit trail without storing actual SSN values.
 */
function validateSSN(ssnLast4) {
  // Validate format (4 digits only)
  if (!/^\d{4}$/.test(ssnLast4)) {
    throw new ValidationError('SSN must be exactly 4 digits')
  }

  // Additional security validation logic
}
````

## ESLint Configuration

Use Google's ESLint configuration as the base:

```javascript
// .eslintrc.js
module.exports = {
  extends: ['google'],
  env: {
    node: true,
    es2022: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  rules: {
    // Google standard overrides for financial services
    'max-len': [
      'error',
      {
        code: 80,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
      },
    ],
    'require-jsdoc': [
      'error',
      {
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
          ArrowFunctionExpression: false,
          FunctionExpression: false,
        },
      },
    ],
    'valid-jsdoc': [
      'error',
      {
        requireReturn: true,
        requireReturnType: true,
        requireParamDescription: true,
        requireReturnDescription: true,
      },
    ],
  },
};
```

## Prettier Configuration

```javascript
// .prettierrc.js
module.exports = {
  // Google style preferences
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  useTabs: false,
  printWidth: 80,
  trailingComma: 'es5',
  bracketSpacing: false,
  arrowParens: 'always',
};
```

## Enforcement

All Google standards are enforced through:

- Pre-commit hooks with ESLint Google configuration
- CI/CD pipeline validation
- Automated formatting with Prettier
- JSDoc validation for all public APIs
- Documentation linting with markdownlint

Violations will block commits and deployments until resolved.
