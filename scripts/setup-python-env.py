#!/usr/bin/env python3
"""
Setup script for Python environment and pre-commit hooks.
This script ensures all Python dependencies are installed for pre-commit.
"""

import subprocess  # nosec B404
import sys
from pathlib import Path


def run_command(cmd, check=True, capture_output=False):
    """Run a shell command and handle errors."""
    print(f"Running: {' '.join(cmd)}")
    try:
        # nosec B603 - We control the command input
        result = subprocess.run(  # nosec B603
            cmd, check=check, capture_output=capture_output, text=True
        )
        if capture_output:
            return result.stdout.strip()
        return result.returncode == 0
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {e}")
        return False


def check_python_version():
    """Check if Python version is compatible."""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8+ is required")
        print(f"   Current version: {version.major}.{version.minor}")
        return False

    print(
        f"✅ Python {version.major}.{version.minor}.{version.micro} "
        f"is compatible"
    )
    return True


def install_requirements():
    """Install Python requirements."""
    requirements_file = Path("requirements.txt")

    if not requirements_file.exists():
        print("❌ requirements.txt not found")
        return False

    print("📦 Installing Python requirements...")

    # Try to install with --user flag first
    if run_command(
        [
            sys.executable,
            "-m",
            "pip",
            "install",
            "--user",
            "-r",
            "requirements.txt",
        ]
    ):
        print("✅ Requirements installed successfully (user)")
        return True

    # Fallback to system installation
    if run_command(
        [sys.executable, "-m", "pip", "install", "-r", "requirements.txt"]
    ):
        print("✅ Requirements installed successfully (system)")
        return True

    print("❌ Failed to install requirements")
    return False


def install_pre_commit():
    """Install and setup pre-commit hooks."""
    print("🪝 Setting up pre-commit hooks...")

    # Install pre-commit hooks
    if not run_command([sys.executable, "-m", "pre_commit", "install"]):
        print("❌ Failed to install pre-commit hooks")
        return False

    # Install commit-msg hook
    if not run_command(
        [
            sys.executable,
            "-m",
            "pre_commit",
            "install",
            "--hook-type",
            "commit-msg",
        ]
    ):
        print("⚠️  Failed to install commit-msg hook (non-critical)")

    print("✅ Pre-commit hooks installed successfully")
    return True


def test_pre_commit():
    """Test pre-commit installation."""
    print("🧪 Testing pre-commit installation...")

    # Run pre-commit on all files
    result = run_command(
        [sys.executable, "-m", "pre_commit", "run", "--all-files"], check=False
    )
    if result:
        print("✅ Pre-commit test passed")
        return True
    else:
        print("⚠️  Pre-commit test had issues (normal for first run)")
        return True  # Don't fail on pre-commit issues


def main():
    """Main setup function."""
    print("🔧 Setting up Python environment for pre-commit...")

    # Check Python version
    if not check_python_version():
        sys.exit(1)

    # Install requirements
    if not install_requirements():
        sys.exit(1)

    # Install pre-commit
    if not install_pre_commit():
        sys.exit(1)

    # Test installation
    test_pre_commit()

    print("🎉 Python environment setup completed successfully!")
    print("")
    print("Next steps:")
    print("  1. Run 'pre-commit run --all-files' to test hooks")
    print("  2. Commit your changes - hooks will run automatically")
    print("  3. Use 'pre-commit autoupdate' to update hook versions")


if __name__ == "__main__":
    main()
