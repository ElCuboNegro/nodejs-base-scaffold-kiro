---
inclusion: always
---

---

## inclusion: always

# AI Voice Verification Agent

Node.js conversational verification system for financial services conducting secure identity
verification through voice-optimized interactions for loan processing applications.

## Business Context

Financial services company verification system for collecting and verifying customer information
during loan processing. The agent handles sensitive personal and financial information while
maintaining professional, trustworthy conversation experience.

## Core Conversation Flow

### 1. Identity Verification (Critical Gate)

- **Date of Birth**: Month, day, year format with voice confirmation
- **SSN Last 4**: Digit-by-digit collection and confirmation
- **Gate Logic**: All subsequent nodes depend on successful identity verification
- **Failure Handling**: Professional termination with specific script

### 2. Personal Information Collection (Post-Identity Only)

- **Mailing Address**: Complete address with unit number verification
- **Email**: Letter-by-letter spelling with validation and confirmation

### 3. Financial Information Collection

- **Monthly Income**: Before taxes with format flexibility
- **Job Tenure**: Current position duration
- **Tenure Validation**: Compare against `job_tenure_in_months` threshold
- **Discrepancy Handling**: Professional explanation requests

### 4. Final Confirmation

- Complete information summary
- User confirmation before completion

## Security Standards

### Identity Verification Gate

- **Critical Security Checkpoint**: No progression without successful verification
- **Retry Logic**: Reasonable attempts with professional failure communication
- **Termination Script**: "I understand this can be frustrating. However, the last four digits of
  your Social Security Number and date of birth are required to proceed with the verification. Since
  we're unable to verify this information today, I'll need to conclude our call. Thank you for your
  time, and please feel free to call back when you have this information available."

### PII Handling

- **SSN**: Last 4 digits only, never full SSN
- **Data Storage**: Session-scoped only, no persistent PII storage
- **Credentials**: Environment variables only, never hardcoded
- **Encryption**: TLS 1.3 in transit, AES-256 at rest

## Voice-First Design Requirements

### TTS Optimization

- **Numbers**: Digit-by-digit pronunciation ("7-2-3-4" not "seven thousand two hundred thirty-four")
- **Emails**: Letter-by-letter spelling with natural pauses
- **Addresses**: Natural pause patterns for comprehension
- **Dates**: Full word formatting ("March fifteenth, nineteen eighty-five")
- **Financial Amounts**: Natural speech formatting
- **Call Termination**: Professional, empathetic tone

### Data Normalization

- **Dates**: Month, day, year collection format
- **SSN**: Last 4 digits with digit-by-digit confirmation
- **Email**: Regex validation + verbal letter-by-letter confirmation
- **Addresses**: Complete with unit verification
- **Income**: Accept various formats (annual, hourly conversions)

## Core System Architecture

### VerificationAgent Class Structure

```javascript
class VerificationAgent {
  constructor() {
    this.conversationState = {}
    this.currentNode = 1
    this.collectedData = {}
    this.job_tenure_in_months = 24 // Configurable threshold
    this.identityVerified = false
  }

  processUserInput(nodeId, userResponse)
  generatePrompt(nodeId, context)
  validateIdentity(dob, ssnLast4)
  handleIdentityFailure()
  validateFinancialData(data)
  handleTenureDiscrepancy(userTenure, thresholdTenure)
}
```

### State Management

- **Identity Gate**: Boolean flag controlling flow progression
- **Node-based Flow**: Sequential conversation management
- **Data Collection**: Structured storage of verified information
- **Conditional Logic**: Smart questioning based on collected data

## Testing Requirements

### BDD Framework

- **Gherkin Scenarios**: All conversation paths covered
- **Mock LLM**: Deterministic testing with mock responses
- **Docker-Only**: 100% test execution in containers
- **Coverage Target**: >90% BDD scenario coverage
- **Edge Cases**: Identity failures, tenure discrepancies, partial information

### Test Data

- **Mock Generators**: Various user scenarios without real PII
- **Employment Statuses**: Different tenure scenarios
- **Address Types**: Various address formats and unit configurations
- **Failure Scenarios**: Identity verification failures and recovery

## Professional Communication Standards

### Tone Requirements

- **Trust Building**: Professional interaction for sensitive financial questions
- **Empathy**: Understanding tone for verification difficulties
- **Security Focus**: Clear communication about verification requirements
- **Respectful Termination**: Professional closure when verification fails

### Conversation Quality

- **Natural Flow**: Smooth transitions between personal and financial sections
- **Appropriate Sensitivity**: Proper handling of financial information requests
- **Discrepancy Management**: Professional explanation requests for inconsistencies
- **Clear Next Steps**: Guidance for customers when verification fails

## Performance & Monitoring

### Response Targets

- **Latency**: P95 < 2 seconds for agent responses
- **Availability**: >99.5% uptime for verification system
- **Concurrent Sessions**: Support 100+ simultaneous verifications

### Audit Logging & Transaction Tracking

- **PostgreSQL**: Persistent audit logs and transaction records
- **Compliance**: Financial services audit trail requirements
- **Data Retention**: Configurable retention policies for regulatory compliance
- **Transaction Integrity**: ACID compliance for verification records

#### Audit Log Schema

```json
{
  "transaction_id": "uuid",
  "session_id": "uuid",
  "timestamp": "ISO-8601",
  "node_id": "string",
  "identity_verified": "boolean",
  "tenure_discrepancy": "boolean",
  "verification_attempts": "number",
  "call_outcome": "completed|failed|terminated",
  "failure_reason": "string",
  "agent_version": "string",
  "compliance_flags": ["pii_handled", "identity_verified", "audit_complete"]
}
```

#### Transaction Records

```json
{
  "transaction_id": "uuid",
  "customer_reference": "pseudonymized_id",
  "verification_status": "passed|failed|incomplete",
  "completion_timestamp": "ISO-8601",
  "data_collected": {
    "identity_verified": "boolean",
    "contact_collected": "boolean",
    "financial_collected": "boolean",
    "final_confirmation": "boolean"
  },
  "compliance_metadata": {
    "pii_pseudonymized": "boolean",
    "audit_trail_complete": "boolean",
    "retention_policy_applied": "boolean"
  }
}
```

## Integration Requirements

### External Services

- **LLM Integration**: Natural language processing for conversation management
- **Verification Services**: Identity validation against external databases
- **Session Storage**: Redis for temporary conversation state
- **Audit Storage**: PostgreSQL for persistent logging and transaction records
- **Monitoring**: Conversation logging and analysis tools

### Data Architecture

- **Hot Data**: Redis for active session state (TTL-based cleanup)
- **Cold Data**: PostgreSQL for audit logs and transaction history
- **PII Separation**: Pseudonymized identifiers linking session to audit records
- **Compliance**: Automated data retention and purging policies
