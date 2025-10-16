@echo off
REM Setup pre-commit for Windows

echo 🔧 Setting up pre-commit hooks for Windows...

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed or not in PATH
    echo    Please install Python from https://python.org
    echo    Or use Windows Store: winget install Python.Python.3
    exit /b 1
)

REM Install Python requirements (includes pre-commit)
echo 📦 Installing Python requirements...
pip install -r requirements.txt

REM Install pre-commit hooks
echo 🪝 Installing pre-commit hooks...
pre-commit install

REM Install commit-msg hook
echo 💬 Installing commit-msg hook...
pre-commit install --hook-type commit-msg

REM Test the installation
echo 🧪 Testing pre-commit installation...
pre-commit run --all-files

echo ✅ Pre-commit setup completed successfully!
echo.
echo To manually run pre-commit:
echo   pre-commit run --all-files
echo.
echo To update hooks:
echo   pre-commit autoupdate
echo.
echo All hooks will now run automatically on git commit.
