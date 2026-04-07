#!/bin/bash
# ============================================================
# Transport Metrics Dashboard - Linux Build Script
# ============================================================
# This script automates the entire build process on Linux.
# Just copy the source files to a Linux machine and run this.
# ============================================================

set -e  # Exit on any error

echo ""
echo "============================================================"
echo "  Transport Metrics Dashboard - Linux Build Script"
echo "============================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_ok() { echo -e "${GREEN}[OK]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }
print_info() { echo -e "${YELLOW}[INFO]${NC} $1"; }

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed!"
    echo ""
    echo "Install Node.js using one of these methods:"
    echo ""
    echo "  Ubuntu/Debian:"
    echo "    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
    echo "    sudo apt-get install -y nodejs"
    echo ""
    echo "  Fedora:"
    echo "    sudo dnf install nodejs"
    echo ""
    echo "  Arch Linux:"
    echo "    sudo pacman -S nodejs npm"
    echo ""
    echo "  Or use nvm (recommended):"
    echo "    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "    source ~/.bashrc"
    echo "    nvm install 20"
    echo ""
    exit 1
fi

print_ok "Node.js found: $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed!"
    exit 1
fi

print_ok "npm found: $(npm --version)"
echo ""

# Navigate to script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"
print_info "Working directory: $PWD"
echo ""

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found!"
    echo "Make sure you run this script from the project folder."
    exit 1
fi

# Install build dependencies for electron-builder
echo "============================================================"
echo "[STEP 0/3] Checking system dependencies..."
echo "============================================================"
echo ""

# Detect package manager and install dependencies
if command -v apt-get &> /dev/null; then
    print_info "Debian/Ubuntu detected. Installing build dependencies..."
    sudo apt-get update
    sudo apt-get install -y build-essential libfuse2 rpm fakeroot dpkg || true
elif command -v dnf &> /dev/null; then
    print_info "Fedora/RHEL detected. Installing build dependencies..."
    sudo dnf groupinstall -y "Development Tools" || true
    sudo dnf install -y fuse rpm-build || true
elif command -v pacman &> /dev/null; then
    print_info "Arch Linux detected. Installing build dependencies..."
    sudo pacman -S --noconfirm base-devel fuse2 || true
else
    print_info "Unknown distro. Make sure you have build tools installed."
fi
echo ""

# Install npm dependencies
echo "============================================================"
echo "[STEP 1/3] Installing npm dependencies..."
echo "============================================================"
echo ""
npm install
print_ok "Dependencies installed successfully."
echo ""

# Build the Electron app for Linux
echo "============================================================"
echo "[STEP 2/3] Building Electron app for Linux..."
echo "============================================================"
echo ""
npm run electron:build:linux
print_ok "Build completed successfully."
echo ""

# Show output files
echo "============================================================"
echo "[STEP 3/3] Build Complete!"
echo "============================================================"
echo ""
echo "Output files are located in the 'release/linux-unpacked' folder:"
echo ""

if [ -d "release/linux-unpacked" ]; then
    ls -la release/linux-unpacked/transport-metrics-dashboard 2>/dev/null || true
    echo ""
fi

echo "TO RUN THE APP:"
echo ""
echo "  cd release/linux-unpacked"
echo "  chmod +x transport-metrics-dashboard"
echo "  ./transport-metrics-dashboard --no-sandbox"
echo ""
echo "IMPORTANT: The --no-sandbox flag is required on Linux!"
echo ""
echo "To transfer to another machine:"
echo "  1. Zip the folder: zip -r TransportMetrics-Linux.zip release/linux-unpacked/*"
echo "  2. Copy to target machine"
echo "  3. Extract and run with --no-sandbox"
echo ""

# Make executable
if [ -d "release/linux-unpacked" ]; then
    chmod +x release/linux-unpacked/transport-metrics-dashboard 2>/dev/null || true
    print_ok "Made transport-metrics-dashboard executable."
fi

echo ""
echo "Done! Press Enter to exit."
read -r
