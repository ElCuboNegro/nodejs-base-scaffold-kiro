# Pre-commit Setup Guide

This guide explains how to set up pre-commit hooks for the AI Voice Verification Agent project.

## Quick Setup

### Windows

```cmd
# Run the Windows setup script
scripts\setup-pre-commit-windows.cmd
```

### Linux/macOS

```bash
# Run the Unix setup script
./scripts/setup-pre-commit.sh
```

## Manual Setup

If the automated scripts don't work, follow these manual steps:

### 1. Install Python (if not already installed)

**Windows:**

```cmd
# Using winget
winget install Python.Python.3

# Or download from https://python.org
```

**Linux:**

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install python3 python3-pip

# CentOS/RHEL
sudo yum install python3 python3-pip
```

**macOS:**

```bash
# Using Homebrew
brew install python3

# Or download from https://python.org
```

### 2. Install pre-commit

```bash
# Install pre-commit globally
pip install pre-commit

# Or install for current user only
pip install --user pre-commit
```

### 3. Install hooks

```bash
# Install pre-commit hooks
pre-commit install

# Install commit message hooks
pre-commit install --hook-type commit-msg
```

### 4. Test the setup

```bash
# Run all hooks manually
pre-commit run --all-files
```

## How It Works

### Pre-commit Framework

- Runs automatically on `git commit`
- Uses `.pre-commit-config.yaml` configuration
- Executes quality checks in Docker containers
- Prevents commits if checks fail

### Husky Integration

- Provides fallback if pre-commit is not installed
- Located in `.husky/pre-commit`
- Runs Docker-based quality checks

### Quality Checks Performed

1. **Docker Environment Validation** - Ensures Docker-only development
2. **Code Formatting** - Prettier formatting in Docker
3. **Linting** - ESLint validation in Docker
4. **File Checks** - Trailing whitespace, JSON/YAML validation
5. **Security** - Basic file and dependency checks

## Usage

### Automatic (Recommended)

Pre-commit hooks run automatically when you commit:

```bash
git add .
git commit -m "feat: add new feature"
# Hooks run automatically here
```

### Manual Execution

Run hooks manually without committing:

```bash
# Run all hooks
pre-commit run --all-files

# Run specific hook
pre-commit run prettier-docker

# Run on staged files only
pre-commit run
```

### Updating Hooks

Update to latest hook versions:

```bash
pre-commit autoupdate
```

### Skipping Hooks (Not Recommended)

Skip hooks in emergency situations:

```bash
git commit --no-verify -m "emergency fix"
```

## Troubleshooting

### Unicode Errors on Windows

If you see `UnicodeDecodeError`, ensure you're using:

- Python 3.8+ with UTF-8 support
- Windows Terminal or PowerShell (not Command Prompt)
- Latest version of pre-commit

### Docker Not Running

Ensure Docker Desktop is running before committing:

```bash
docker info
# Should show Docker system information
```

### Permission Errors

On Unix systems, ensure scripts are executable:

```bash
chmod +x scripts/*.sh
chmod +x .husky/*
```

### Hook Failures

If hooks fail, fix the issues and commit again:

```bash
# Fix the issues reported by hooks
# Then commit again
git add .
git commit -m "fix: resolve hook issues"
```

## Configuration Files

- `.pre-commit-config.yaml` - Main pre-commit configuration
- `.husky/pre-commit` - Husky fallback hook
- `scripts/validate-docker-only.cmd` - Windows Docker validation
- `scripts/pre-commit-quality.cmd` - Windows quality checks

## Docker Integration

All quality checks run in Docker containers to ensure:

- Consistent environment across all developers
- No local dependency conflicts
- Proper isolation and security
- Cross-platform compatibility

The hooks use these Docker services:

- `quality-runner` - ESLint, Prettier, security tools
- `bdd-runner` - BDD test validation
- `verification-agent` - Main application container
