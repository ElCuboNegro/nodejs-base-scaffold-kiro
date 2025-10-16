# IDE Setup Guide

## Overview

This guide provides comprehensive setup instructions for Visual Studio Code and other IDEs to work
optimally with the AI Voice Verification Agent project's Docker-only development environment.

## Visual Studio Code Setup

### Required Extensions

Install these extensions for optimal development experience:

#### Core Development Extensions

- **ESLint** (`ms-vscode.vscode-eslint`) - JavaScript linting with Google standards
- **Prettier** (`esbenp.prettier-vscode`) - Code formatting
- **Docker** (`ms-azuretools.vscode-docker`) - Docker container management
- **JSON** (`ms-vscode.vscode-json`) - JSON file support with validation

#### Testing Extensions

- **Cucumber (Gherkin) Full Support** (`alexkrechik.cucumberautocomplete`) - BDD test support
- **Cucumber** (`stevejpurves.cucumber`) - Additional Gherkin syntax support
- **Jest** (`orta.vscode-jest`) - Unit test integration
- **Jest Runner** (`firsttris.vscode-jest-runner`) - Run individual tests

#### Documentation Extensions

- **Markdown All in One** (`yzhang.markdown-all-in-one`) - Markdown editing
- **markdownlint** (`davidanson.vscode-markdownlint`) - Markdown linting
- **Auto Rename Tag** (`formulahendry.auto-rename-tag`) - HTML/XML tag management

#### Git and Collaboration

- **GitLens** (`eamodio.gitlens`) - Enhanced Git capabilities
- **GitHub Pull Requests** (`github.vscode-pull-request-github`) - GitHub integration

#### Productivity Extensions

- **Path Intellisense** (`christian-kohler.path-intellisense`) - File path autocompletion
- **TODO Tree** (`gruntfuggly.todo-tree`) - TODO comment management
- **Better Comments** (`aaron-bond.better-comments`) - Enhanced comment styling
- **Code Spell Checker** (`streetsidesoftware.code-spell-checker`) - Spell checking

### Automatic Extension Installation

VS Code will automatically suggest installing recommended extensions when you open the project. You
can also install them manually:

```bash
# Install all recommended extensions at once
code --install-extension ms-vscode.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension ms-azuretools.vscode-docker
code --install-extension alexkrechik.cucumberautocomplete
code --install-extension stevejpurves.cucumber
code --install-extension orta.vscode-jest
code --install-extension yzhang.markdown-all-in-one
code --install-extension davidanson.vscode-markdownlint
code --install-extension eamodio.gitlens
code --install-extension github.vscode-pull-request-github
```

### Workspace Configuration

The project includes pre-configured VS Code settings in `.vscode/`:

#### Settings (`.vscode/settings.json`)

- **Docker Integration**: All npm/node commands run in Docker containers
- **Code Formatting**: Automatic formatting on save with Prettier
- **ESLint Integration**: Real-time linting with Google JavaScript Style Guide
- **File Associations**: Proper syntax highlighting for all file types
- **Search Exclusions**: Excludes node_modules, coverage, and build artifacts

#### Tasks (`.vscode/tasks.json`)

Pre-configured tasks for common development activities:

- **Docker: Start Development Environment** - `Ctrl+Shift+P` → "Tasks: Run Task"
- **Docker: Run All BDD Tests** - Execute complete BDD test suite
- **Docker: Run Quality Checks** - Run linting, formatting, and security scans
- **Docker: Install Dependencies** - Install npm packages in Docker
- **Run Developer Onboarding** - Execute environment validation script

#### Launch Configurations (`.vscode/launch.json`)

Debugging configurations for:

- **Docker: Debug Verification Agent** - Attach debugger to running container
- **Docker: Run BDD Tests** - Debug BDD test execution
- **Docker: Run Jest Tests** - Debug unit test execution
- **Docker: Run Developer Onboarding** - Debug onboarding script

### Using VS Code with Docker

#### Terminal Integration

The project is configured to use Docker containers for all terminal operations:

1. **Default Terminal**: Opens in Docker container context
2. **Integrated Tasks**: All tasks run Docker commands automatically
3. **Command Palette**: Use `Ctrl+Shift+P` to access Docker tasks

#### Running Commands

**✅ CORRECT - Use VS Code Tasks:**

```bash
# Use Command Palette (Ctrl+Shift+P)
Tasks: Run Task → Docker: Run All BDD Tests
Tasks: Run Task → Docker: Run Quality Checks
Tasks: Run Task → Docker: Start Development Environment
```

**❌ INCORRECT - Never run these directly:**

```bash
npm install          # Use Docker task instead
npm run test:bdd     # Use Docker task instead
node src/index.js    # Use Docker task instead
```

#### Debugging Setup

1. **Start Application with Debug Port**:

   ```bash
   docker compose run --rm -p 9229:9229 verification-agent node --inspect=0.0.0.0:9229 src/index.js
   ```

2. **Attach Debugger**:
   - Press `F5` or use "Run and Debug" panel
   - Select "Docker: Debug Verification Agent"
   - Set breakpoints in your code

3. **Debug Tests**:
   - Use "Docker: Run BDD Tests" or "Docker: Run Jest Tests" configurations
   - Set breakpoints in test files or source code

### Code Quality Integration

#### ESLint Integration

- **Real-time Linting**: Errors and warnings appear as you type
- **Auto-fix on Save**: Many issues fixed automatically
- **Google Standards**: Enforces Google JavaScript Style Guide
- **Problem Panel**: View all linting issues in Problems panel (`Ctrl+Shift+M`)

#### Prettier Integration

- **Format on Save**: Code automatically formatted when saving files
- **Format Selection**: Select code and use `Shift+Alt+F`
- **Google Standards**: Follows Google formatting preferences
- **Consistent Style**: Ensures consistent code formatting across team

#### Git Integration

- **Source Control Panel**: View changes, stage files, commit (`Ctrl+Shift+G`)
- **GitLens**: Enhanced Git blame, history, and repository insights
- **Pre-commit Hooks**: Automatic quality checks before commits
- **Diff View**: Side-by-side comparison of changes

### File Navigation and Search

#### Optimized Search

The workspace is configured to exclude irrelevant files from search:

- `node_modules/` - Dependencies (managed by Docker)
- `coverage/` - Test coverage reports
- `reports/` - Generated reports
- `.git/` - Git metadata
- `dist/` and `build/` - Build artifacts

#### File Associations

Proper syntax highlighting for:

- `*.feature` - Gherkin/Cucumber files
- `*.md` - Markdown documentation
- `Dockerfile*` - Docker configuration files
- `compose*.yaml` - Docker Compose files

#### Quick Navigation

- **Go to File**: `Ctrl+P` - Quick file search
- **Go to Symbol**: `Ctrl+Shift+O` - Navigate to functions/classes
- **Go to Definition**: `F12` - Jump to function/variable definition
- **Find References**: `Shift+F12` - Find all usages

### Workspace Shortcuts

#### Essential Shortcuts

| Shortcut       | Action                             |
| -------------- | ---------------------------------- |
| `Ctrl+Shift+P` | Command Palette (access all tasks) |
| `Ctrl+``       | Toggle integrated terminal         |
| `Ctrl+Shift+G` | Source Control panel               |
| `Ctrl+Shift+E` | Explorer panel                     |
| `Ctrl+Shift+M` | Problems panel (ESLint errors)     |
| `F5`           | Start debugging                    |
| `Ctrl+F5`      | Run without debugging              |
| `Shift+Alt+F`  | Format document                    |

#### Docker-Specific Shortcuts

| Task              | Access Method                                                                |
| ----------------- | ---------------------------------------------------------------------------- |
| Start Development | `Ctrl+Shift+P` → "Tasks: Run Task" → "Docker: Start Development Environment" |
| Run BDD Tests     | `Ctrl+Shift+P` → "Tasks: Run Task" → "Docker: Run All BDD Tests"             |
| Quality Check     | `Ctrl+Shift+P` → "Tasks: Run Task" → "Docker: Run Quality Checks"            |
| Format Code       | `Ctrl+Shift+P` → "Tasks: Run Task" → "Docker: Format Code with Prettier"     |

## Alternative IDEs

### JetBrains WebStorm

#### Configuration

1. **Docker Integration**:
   - Install Docker plugin
   - Configure Docker daemon connection
   - Set up Docker Compose run configurations

2. **Code Quality**:
   - Configure ESLint with Google standards
   - Set up Prettier for code formatting
   - Enable real-time error highlighting

3. **Testing**:
   - Configure Jest test runner
   - Set up Cucumber plugin for BDD tests
   - Create run configurations for Docker-based tests

#### Run Configurations

Create run configurations for:

- Docker Compose Up
- BDD Test Execution
- Quality Checks
- Individual Test Files

### Vim/Neovim

#### Essential Plugins

```vim
" Package manager (vim-plug)
call plug#begin()

" Language Server Protocol
Plug 'neoclide/coc.nvim', {'branch': 'release'}

" Docker integration
Plug 'ekalinin/Dockerfile.vim'

" JavaScript/TypeScript
Plug 'pangloss/vim-javascript'
Plug 'leafgarland/typescript-vim'

" Testing
Plug 'vim-test/vim-test'

" Git integration
Plug 'tpope/vim-fugitive'

call plug#end()
```

#### Configuration

```vim
" Use Docker for all commands
let g:test#javascript#jest#executable = 'docker compose run --rm test-runner npm run test'
let g:test#javascript#cucumber#executable = 'docker compose run --rm bdd-runner npm run test:bdd'

" ESLint integration
let g:coc_global_extensions = ['coc-eslint', 'coc-prettier', 'coc-json']
```

### Emacs

#### Package Configuration

```elisp
;; Docker integration
(use-package docker
  :ensure t)

(use-package dockerfile-mode
  :ensure t)

;; JavaScript development
(use-package js2-mode
  :ensure t)

(use-package prettier-js
  :ensure t
  :hook (js2-mode . prettier-js-mode))

;; Testing
(use-package jest
  :ensure t)
```

## Common IDE Issues and Solutions

### ESLint Not Working

**Problem**: ESLint errors not showing in IDE

**Solution**:

1. Verify ESLint extension is installed and enabled
2. Check that `.eslintrc.js` exists and is valid
3. Restart IDE after installing extensions
4. Ensure Docker containers have been built with dependencies

### Prettier Not Formatting

**Problem**: Code not formatting on save

**Solution**:

1. Verify Prettier extension is installed
2. Check "Format on Save" is enabled in settings
3. Ensure `.prettierrc.js` configuration exists
4. Verify no conflicting formatters are enabled

### Docker Commands Not Working

**Problem**: Docker tasks failing in IDE

**Solution**:

1. Verify Docker Desktop is running
2. Check Docker daemon is accessible from IDE
3. Ensure Docker Compose is installed and in PATH
4. Restart IDE after starting Docker

### Debugging Not Connecting

**Problem**: Cannot attach debugger to Docker container

**Solution**:

1. Ensure debug port (9229) is exposed in Docker run command
2. Check firewall settings allow port 9229
3. Verify container is running with `--inspect` flag
4. Use correct launch configuration in IDE

### File Watching Issues

**Problem**: Changes not detected or hot reload not working

**Solution**:

1. Increase file watcher limits (Linux):

   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

2. Ensure proper volume mounts in Docker Compose
3. Check IDE file watching settings
4. Restart Docker containers and IDE

## Best Practices

### Workspace Organization

1. **Use Workspace Folders**: Organize related files in logical folders
2. **Configure File Associations**: Ensure proper syntax highlighting
3. **Set Up Search Exclusions**: Exclude generated files and dependencies
4. **Use Consistent Formatting**: Enable format-on-save for all team members

### Docker Integration

1. **Always Use Docker Tasks**: Never run npm/node commands directly
2. **Use Proper Launch Configurations**: Debug through Docker containers
3. **Monitor Resource Usage**: Keep Docker Desktop resource limits appropriate
4. **Clean Up Regularly**: Remove unused containers and images

### Code Quality

1. **Enable Real-time Linting**: Fix issues as you type
2. **Use Auto-formatting**: Let Prettier handle code style
3. **Review Problems Panel**: Address all ESLint warnings and errors
4. **Run Quality Checks**: Use pre-commit hooks and manual quality tasks

### Team Collaboration

1. **Share IDE Configuration**: Commit `.vscode/` folder to repository
2. **Document Custom Settings**: Add team-specific IDE configurations to docs
3. **Use Consistent Extensions**: Ensure all team members use recommended extensions
4. **Standardize Shortcuts**: Document and share useful keyboard shortcuts

This IDE setup ensures optimal development experience while maintaining the Docker-only development
policy and code quality standards.
