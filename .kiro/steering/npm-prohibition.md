---
inclusion: always
---

# NPM and Node.js Local Execution Prohibition

## ZERO TOLERANCE POLICY: NO LOCAL NPM/NODE COMMANDS

This document establishes **absolute prohibition** of any local npm, node, or JavaScript execution
outside of Docker containers.

## Complete Prohibition List

### Package Management - FORBIDDEN

```bash
# These commands will result in immediate development workflow failure
npm install                    # ❌ FORBIDDEN
npm ci                        # ❌ FORBIDDEN
npm update                    # ❌ FORBIDDEN
npm audit                     # ❌ FORBIDDEN
npm fund                      # ❌ FORBIDDEN
npm outdated                  # ❌ FORBIDDEN
npm list                      # ❌ FORBIDDEN
npm cache clean               # ❌ FORBIDDEN
npm config                    # ❌ FORBIDDEN
npm init                      # ❌ FORBIDDEN
npm publish                   # ❌ FORBIDDEN
npm pack                      # ❌ FORBIDDEN
npm link                      # ❌ FORBIDDEN
npm unlink                    # ❌ FORBIDDEN
npm rebuild                   # ❌ FORBIDDEN
npm dedupe                    # ❌ FORBIDDEN
npm prune                     # ❌ FORBIDDEN
npm shrinkwrap                # ❌ FORBIDDEN
```

### Script Execution - FORBIDDEN

```bash
# All npm scripts must run in Docker
npm run start                 # ❌ FORBIDDEN
npm run dev                   # ❌ FORBIDDEN
npm run test                  # ❌ FORBIDDEN
npm run build                 # ❌ FORBIDDEN
npm run lint                  # ❌ FORBIDDEN
npm run format                # ❌ FORBIDDEN
npm run security:scan         # ❌ FORBIDDEN
npm run docs:generate         # ❌ FORBIDDEN
npm run <any-script>          # ❌ FORBIDDEN
npm start                     # ❌ FORBIDDEN
npm test                      # ❌ FORBIDDEN
```

### NPX Commands - FORBIDDEN

```bash
# No npx execution allowed locally
npx <any-command>             # ❌ FORBIDDEN
npx cucumber-js               # ❌ FORBIDDEN
npx eslint                    # ❌ FORBIDDEN
npx prettier                  # ❌ FORBIDDEN
npx jest                      # ❌ FORBIDDEN
npx create-react-app          # ❌ FORBIDDEN
npx @angular/cli              # ❌ FORBIDDEN
npx typescript                # ❌ FORBIDDEN
```

### Node.js Execution - FORBIDDEN

```bash
# No direct Node.js execution
node <any-file>               # ❌ FORBIDDEN
node src/index.js             # ❌ FORBIDDEN
node scripts/setup.js         # ❌ FORBIDDEN
node --version                # ❌ FORBIDDEN (use docker version)
node -e "console.log('test')" # ❌ FORBIDDEN
node -p "process.version"     # ❌ FORBIDDEN
```

### Binary Execution - FORBIDDEN

```bash
# No direct binary execution from node_modules
./node_modules/.bin/eslint    # ❌ FORBIDDEN
./node_modules/.bin/prettier  # ❌ FORBIDDEN
./node_modules/.bin/jest      # ❌ FORBIDDEN
./node_modules/.bin/cucumber-js # ❌ FORBIDDEN
./node_modules/.bin/<any-bin> # ❌ FORBIDDEN
```

### Alternative Package Managers - FORBIDDEN

```bash
# Other package managers also forbidden
yarn install                 # ❌ FORBIDDEN
yarn add                     # ❌ FORBIDDEN
yarn remove                  # ❌ FORBIDDEN
yarn run                     # ❌ FORBIDDEN
yarn <any-command>           # ❌ FORBIDDEN

pnpm install                 # ❌ FORBIDDEN
pnpm add                     # ❌ FORBIDDEN
pnpm run                     # ❌ FORBIDDEN
pnpm <any-command>           # ❌ FORBIDDEN

bun install                  # ❌ FORBIDDEN
bun run                      # ❌ FORBIDDEN
bun <any-command>            # ❌ FORBIDDEN
```

## Mandatory Docker Replacements

### Package Management Replacements

```bash
# Instead of: npm install
docker compose run --rm verification-agent npm install

# Instead of: npm ci
docker compose run --rm verification-agent npm ci

# Instead of: npm audit
docker compose run --rm quality-runner npm audit

# Instead of: npm update
docker compose run --rm verification-agent npm update

# Instead of: npm outdated
docker compose run --rm verification-agent npm outdated

# Instead of: npm list
docker compose run --rm verification-agent npm list
```

### Script Execution Replacements

```bash
# Instead of: npm run test
docker compose run --rm test-runner npm run test

# Instead of: npm run test:bdd
docker compose run --rm bdd-runner npm run test:bdd

# Instead of: npm run lint
docker compose run --rm quality-runner npm run lint

# Instead of: npm run format
docker compose run --rm quality-runner npm run format

# Instead of: npm run security:scan
docker compose run --rm quality-runner npm run security:scan

# Instead of: npm start
docker compose up verification-agent

# Instead of: npm run dev
docker compose run --rm verification-agent npm run dev
```

### NPX Replacements

```bash
# Instead of: npx cucumber-js
docker compose run --rm bdd-runner npx cucumber-js

# Instead of: npx eslint src/
docker compose run --rm quality-runner npx eslint src/

# Instead of: npx prettier --write .
docker compose run --rm quality-runner npx prettier --write .

# Instead of: npx jest
docker compose run --rm test-runner npx jest
```

### Node.js Execution Replacements

```bash
# Instead of: node src/index.js
docker compose up verification-agent

# Instead of: node scripts/setup.js
docker compose run --rm verification-agent node scripts/setup.js

# Instead of: node --version
docker compose run --rm verification-agent node --version
```

## Enforcement Mechanisms

### Package.json Script Overrides

```json
{
  "scripts": {
    "preinstall": "echo '❌ FORBIDDEN: Use docker compose run --rm verification-agent npm install' && exit 1",
    "install": "echo '❌ FORBIDDEN: Use docker compose run --rm verification-agent npm install' && exit 1",
    "postinstall": "echo '❌ FORBIDDEN: Use Docker containers only' && exit 1",
    "test": "echo '❌ FORBIDDEN: Use docker compose run --rm test-runner npm run test' && exit 1",
    "start": "echo '❌ FORBIDDEN: Use docker compose up verification-agent' && exit 1",
    "dev": "echo '❌ FORBIDDEN: Use docker compose run --rm verification-agent npm run dev' && exit 1",
    "lint": "echo '❌ FORBIDDEN: Use docker compose run --rm quality-runner npm run lint' && exit 1",
    "format": "echo '❌ FORBIDDEN: Use docker compose run --rm quality-runner npm run format' && exit 1",
    "build": "echo '❌ FORBIDDEN: Use docker compose build' && exit 1"
  }
}
```

### Shell Function Overrides

```bash
# Add to ~/.bashrc, ~/.zshrc, or ~/.profile

# Override npm command
npm() {
  echo "❌ FORBIDDEN: Local npm usage is prohibited"
  echo "✅ Use: docker compose run --rm <service> npm <command>"
  echo ""
  echo "Examples:"
  echo "  docker compose run --rm verification-agent npm install"
  echo "  docker compose run --rm test-runner npm run test"
  echo "  docker compose run --rm quality-runner npm run lint"
  return 1
}

# Override node command
node() {
  echo "❌ FORBIDDEN: Local node usage is prohibited"
  echo "✅ Use: docker compose run --rm <service> node <command>"
  echo ""
  echo "Examples:"
  echo "  docker compose up verification-agent"
  echo "  docker compose run --rm verification-agent node scripts/setup.js"
  return 1
}

# Override npx command
npx() {
  echo "❌ FORBIDDEN: Local npx usage is prohibited"
  echo "✅ Use: docker compose run --rm <service> npx <command>"
  echo ""
  echo "Examples:"
  echo "  docker compose run --rm bdd-runner npx cucumber-js"
  echo "  docker compose run --rm quality-runner npx eslint src/"
  return 1
}

# Override yarn command
yarn() {
  echo "❌ FORBIDDEN: Yarn usage is prohibited"
  echo "✅ Use: docker compose run --rm verification-agent npm <command>"
  return 1
}

# Override pnpm command
pnpm() {
  echo "❌ FORBIDDEN: PNPM usage is prohibited"
  echo "✅ Use: docker compose run --rm verification-agent npm <command>"
  return 1
}
```

### Git Hooks Enforcement

```bash
#!/bin/sh
# .husky/pre-commit

# Check for local node_modules
if [ -d "node_modules" ]; then
  echo "❌ FORBIDDEN: Local node_modules directory detected"
  echo "   Remove it: rm -rf node_modules"
  echo "   Use Docker only: docker compose run --rm verification-agent npm install"
  exit 1
fi

# Check for package-lock.json without Docker marker
if [ -f "package-lock.json" ] && [ ! -f ".docker-only-marker" ]; then
  echo "❌ FORBIDDEN: package-lock.json created outside Docker"
  echo "   Remove it: rm package-lock.json"
  echo "   Use Docker: docker compose run --rm verification-agent npm install"
  exit 1
fi

# Run quality checks in Docker
echo "🐳 Running quality checks in Docker..."
docker compose run --rm quality-runner npm run quality:check

if [ $? -ne 0 ]; then
  echo "❌ Quality checks failed in Docker"
  exit 1
fi

echo "✅ All checks passed in Docker containers"
```

### IDE Configuration Enforcement

#### VS Code settings.json

```json
{
  "terminal.integrated.defaultProfile.linux": "bash",
  "terminal.integrated.profiles.linux": {
    "Docker Container": {
      "path": "docker",
      "args": ["compose", "exec", "verification-agent", "bash"]
    }
  },
  "npm.packageManager": "docker",
  "npm.runSilent": true,
  "eslint.runtime": "docker",
  "eslint.nodePath": "/app/node_modules",
  "prettier.resolveGlobalModules": false,
  "typescript.preferences.includePackageJsonAutoImports": "off",
  "extensions.ignoreRecommendations": true,
  "npm.enableRunFromFolder": false
}
```

#### .vscode/tasks.json

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Docker: Install Dependencies",
      "type": "shell",
      "command": "docker compose run --rm verification-agent npm install",
      "group": "build",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "label": "Docker: Run Tests",
      "type": "shell",
      "command": "docker compose run --rm test-runner npm run test",
      "group": "test",
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared"
      }
    },
    {
      "label": "Docker: Run BDD Tests",
      "type": "shell",
      "command": "docker compose run --rm bdd-runner npm run test:bdd",
      "group": "test"
    }
  ]
}
```

## Violation Detection

### Automated Detection Script

```bash
#!/bin/bash
# scripts/detect-violations.sh

echo "🔍 Detecting Docker policy violations..."

violations=0

# Check for local node_modules
if [ -d "node_modules" ]; then
  echo "❌ VIOLATION: Local node_modules directory found"
  violations=$((violations + 1))
fi

# Check for local package-lock.json
if [ -f "package-lock.json" ] && [ ! -f ".docker-only-marker" ]; then
  echo "❌ VIOLATION: Local package-lock.json without Docker marker"
  violations=$((violations + 1))
fi

# Check for npm cache
if [ -d "$HOME/.npm" ]; then
  echo "⚠️  WARNING: Local npm cache exists"
fi

# Check bash history for forbidden commands
if grep -q "npm \|node \|npx " "$HOME/.bash_history" 2>/dev/null; then
  echo "⚠️  WARNING: Forbidden commands found in bash history"
fi

if [ $violations -gt 0 ]; then
  echo "❌ $violations violation(s) detected"
  echo "   Run: make clean-violations"
  exit 1
else
  echo "✅ No violations detected"
fi
```

### Violation Cleanup Script

```bash
#!/bin/bash
# scripts/clean-violations.sh

echo "🧹 Cleaning up Docker policy violations..."

# Remove local node_modules
if [ -d "node_modules" ]; then
  echo "Removing local node_modules..."
  rm -rf node_modules
fi

# Remove local package-lock.json
if [ -f "package-lock.json" ]; then
  echo "Removing local package-lock.json..."
  rm package-lock.json
fi

# Clear npm cache
if [ -d "$HOME/.npm" ]; then
  echo "Clearing npm cache..."
  rm -rf "$HOME/.npm"
fi

# Create Docker-only marker
touch .docker-only-marker

echo "✅ Violations cleaned up"
echo "   Use Docker commands only from now on"
```

## Monitoring and Reporting

### Daily Violation Check

```bash
#!/bin/bash
# scripts/daily-check.sh

# Run violation detection
./scripts/detect-violations.sh

# Check Docker usage in git log
recent_commits=$(git log --oneline -10 --grep="npm\|node\|npx")
if [ -n "$recent_commits" ]; then
  echo "⚠️  Recent commits mention forbidden commands:"
  echo "$recent_commits"
fi

# Generate compliance report
echo "📊 Docker Compliance Report - $(date)" > reports/compliance-$(date +%Y%m%d).txt
echo "=================================" >> reports/compliance-$(date +%Y%m%d).txt
./scripts/detect-violations.sh >> reports/compliance-$(date +%Y%m%d).txt
```

This comprehensive prohibition system ensures that no local npm, node, or JavaScript execution can
occur outside of Docker containers, maintaining absolute consistency and security in the development
environment.
