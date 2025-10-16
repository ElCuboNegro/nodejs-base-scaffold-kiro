# Python Requirements for Pre-commit

This document explains the Python requirements and setup needed for pre-commit hooks to work
properly in the AI Voice Verification Agent project.

## Overview

While this is primarily a Node.js project, we use Python-based tools for:

- **Pre-commit framework** - Git hook management
- **Code quality tools** - Linting, formatting, security scanning
- **YAML/JSON validation** - Configuration file validation
- **Documentation tools** - Automated documentation generation

## Python Files in the Repository

### Core Requirements

- `requirements.txt` - Core Python dependencies for pre-commit
- `requirements-dev.txt` - Additional development dependencies
- `pyproject.toml` - Modern Python project configuration

### Setup Scripts

- `scripts/setup-python-env.py` - Automated Python environment setup
- `scripts/setup-pre-commit.sh` - Unix/Linux setup script
- `scripts/setup-pre-commit-windows.cmd` - Windows setup script

## Installation Methods

### Method 1: Automated Setup (Recommended)

**Windows:**

```cmd
# Run the Python setup script
python scripts/setup-python-env.py

# Or use the Windows batch script
scripts\setup-pre-commit-windows.cmd
```

**Linux/macOS:**

```bash
# Run the Python setup script
python3 scripts/setup-python-env.py

# Or use the shell script
./scripts/setup-pre-commit.sh
```

### Method 2: Manual Installation

1. **Install Python Requirements:**

   ```bash
   # Core requirements only
   pip install -r requirements.txt

   # Or with development tools
   pip install -r requirements-dev.txt
   ```

2. **Install Pre-commit Hooks:**

   ```bash
   pre-commit install
   pre-commit install --hook-type commit-msg
   ```

3. **Test Installation:**
   ```bash
   pre-commit run --all-files
   ```

## Python Dependencies Explained

### Core Dependencies (`requirements.txt`)

| Package      | Version          | Purpose                |
| ------------ | ---------------- | ---------------------- |
| `pre-commit` | >=3.0.0,<4.0.0   | Git hook framework     |
| `PyYAML`     | >=6.0,<7.0       | YAML file validation   |
| `jsonschema` | >=4.0.0,<5.0.0   | JSON schema validation |
| `black`      | >=23.0.0,<24.0.0 | Python code formatter  |
| `flake8`     | >=6.0.0,<7.0.0   | Python linter          |
| `bandit`     | >=1.7.0,<2.0.0   | Security scanner       |
| `safety`     | >=2.0.0,<3.0.0   | Vulnerability scanner  |

### Development Dependencies (`requirements-dev.txt`)

Additional tools for development:

- **ipython** - Enhanced Python REPL
- **mypy** - Static type checker
- **pytest** - Testing framework
- **sphinx** - Documentation generator
- **coverage** - Code coverage reporting

## Pre-commit Hooks Configuration

Our `.pre-commit-config.yaml` includes:

### Standard Hooks

- **trailing-whitespace** - Remove trailing spaces
- **end-of-file-fixer** - Ensure files end with newline
- **check-yaml** - Validate YAML syntax
- **check-json** - Validate JSON syntax
- **check-toml** - Validate TOML syntax

### Python-Specific Hooks

- **black** - Code formatting
- **isort** - Import sorting
- **flake8** - Linting
- **bandit** - Security scanning

### Docker-Based Hooks

- **prevent-local-npm** - Enforce Docker-only development
- **docker-quality-check** - Run quality checks in Docker

## Troubleshooting

### Common Issues

#### 1. Python Not Found

```bash
# Install Python 3.8+
# Windows: winget install Python.Python.3
# macOS: brew install python3
# Ubuntu: sudo apt install python3 python3-pip
```

#### 2. Permission Errors

```bash
# Use --user flag for user installation
pip install --user -r requirements.txt
```

#### 3. Pre-commit Not Found

```bash
# Add Python user bin to PATH
export PATH="$HOME/.local/bin:$PATH"  # Linux/macOS
# Or use full path: ~/.local/bin/pre-commit
```

#### 4. Hook Installation Fails

```bash
# Clean pre-commit cache and reinstall
pre-commit clean
pre-commit install --install-hooks
```

### Windows-Specific Issues

#### 1. Long Path Names

Enable long path support in Windows:

```cmd
git config --system core.longpaths true
```

#### 2. Execution Policy

Allow script execution in PowerShell:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### 3. Unicode Errors

Ensure UTF-8 encoding:

```cmd
chcp 65001
set PYTHONIOENCODING=utf-8
```

## Integration with Docker

While Python tools run locally for pre-commit, our main development workflow uses Docker:

### Local Python (Pre-commit)

- Runs on `git commit`
- Fast execution
- Cross-platform compatibility
- Validates files before commit

### Docker (Development)

- Main application development
- Quality tools (ESLint, Prettier)
- BDD testing
- Consistent environment

## Maintenance

### Updating Dependencies

1. **Update requirements:**

   ```bash
   pip-compile --upgrade requirements.in
   ```

2. **Update pre-commit hooks:**

   ```bash
   pre-commit autoupdate
   ```

3. **Test updates:**
   ```bash
   pre-commit run --all-files
   ```

### Adding New Python Tools

1. Add to `requirements.txt` or `requirements-dev.txt`
2. Update `.pre-commit-config.yaml` if needed
3. Update `pyproject.toml` configuration
4. Test with `pre-commit run --all-files`

## Best Practices

1. **Pin versions** - Use version ranges for stability
2. **Separate concerns** - Core vs development dependencies
3. **Test regularly** - Run `pre-commit run --all-files`
4. **Document changes** - Update this file when adding tools
5. **Use virtual environments** - Isolate Python dependencies

## Verification

To verify your Python setup is working:

```bash
# Check Python version
python --version  # Should be 3.8+

# Check pre-commit installation
pre-commit --version

# Test all hooks
pre-commit run --all-files

# Verify BDD tests still pass
docker compose run --rm bdd-runner npm run test:bdd -- --tags "@task-4"
```

All checks should pass, confirming that both Python pre-commit hooks and Docker-based development
tools are working correctly.
