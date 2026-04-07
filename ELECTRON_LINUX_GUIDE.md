# Transport Metrics Dashboard - Linux Deployment Guide

This guide explains how to build, distribute, and run the Electron app on Linux machines.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Building on Linux](#building-on-linux)
3. [Output Files](#output-files)
4. [Installation Methods](#installation-methods)
5. [Transferring to Other Linux Machines](#transferring-to-other-linux-machines)
6. [Distribution-Specific Instructions](#distribution-specific-instructions)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### On the Development Machine (where you build)

1. **Node.js** (v18 or higher)
   ```bash
   # Using NodeSource (recommended)
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Or using nvm
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
   nvm install 20
   nvm use 20
   ```
   
   Verify: `node --version`

2. **Build tools** (for native modules)
   ```bash
   # Debian/Ubuntu
   sudo apt-get install build-essential
   
   # Fedora/RHEL
   sudo dnf groupinstall "Development Tools"
   
   # Arch Linux
   sudo pacman -S base-devel
   ```

3. **Additional dependencies for electron-builder**
   ```bash
   # Debian/Ubuntu
   sudo apt-get install rpm fakeroot dpkg
   
   # For AppImage
   sudo apt-get install libfuse2
   ```

### On Target Machines (where you run the app)

- **AppImage**: Only needs `libfuse2` (most distros have it)
- **.deb package**: Debian, Ubuntu, Linux Mint, Pop!_OS
- **.rpm package**: Fedora, RHEL, CentOS, openSUSE

---

## Building on Linux

### Step 1: Clone/Copy the Project

```bash
cd ~/projects
# If using git:
git clone <repository-url> Transport_Metrics
cd Transport_Metrics

# Or copy from USB/network
cp -r /media/usb/Transport_Metrics ~/projects/
cd ~/projects/Transport_Metrics
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Build the Application

```bash
npm run electron:build:linux
```

This will:
1. Build the React/Vite frontend into `dist/`
2. Package everything into Electron
3. Create Linux packages in `release/`

**Build time**: Approximately 2-5 minutes

---

## Output Files

After building, check the `release/` folder:

```
release/
├── TransportMetrics-Linux.zip                      # Ready-to-distribute zip
├── linux-unpacked/                                 # Unpacked app folder
│   └── transport-metrics-dashboard
└── builder-effective-config.yaml
```

### File Descriptions

| File | Size (approx) | Best For |
|------|---------------|----------|
| `TransportMetrics-Linux.zip` | ~109 MB | Distribution to other machines |
| `linux-unpacked/` | ~200+ MB | Testing, custom deployment |

**Note:** Use `BUILD_ALL.bat` (on Windows dev machine) to automatically create the zip file.

---

## Installation Methods

### Method 1: Zip Package (Recommended)

```bash
# Extract
unzip TransportMetrics-Linux.zip -d ~/transport-metrics
cd ~/transport-metrics

# Make executable and run
chmod +x transport-metrics-dashboard
./transport-metrics-dashboard --no-sandbox
```

**IMPORTANT:** The `--no-sandbox` flag is required on Linux!

### Method 2: Unpacked Folder

```bash
# Copy folder to desired location
cp -r linux-unpacked /opt/transport-metrics

# Run the application
/opt/transport-metrics/transport-metrics-dashboard --no-sandbox

# Create symlink for easy access
sudo ln -s /opt/transport-metrics/transport-metrics-dashboard /usr/local/bin/transport-metrics
```

---

## Running the Application

**Always use the `--no-sandbox` flag on Linux:**

```bash
./transport-metrics-dashboard --no-sandbox
```

### Why `--no-sandbox`?

Chrome's sandbox requires special kernel permissions (SUID bit on `chrome-sandbox`). The `--no-sandbox` flag bypasses this requirement. This is safe for trusted applications running on your own machine.

### Creating a Desktop Shortcut

```bash
cat > ~/.local/share/applications/transport-metrics.desktop << 'EOF'
[Desktop Entry]
Version=1.0
Type=Application
Name=Transport Metrics Dashboard
Comment=Fiber Cut Analysis Dashboard
Exec=/path/to/transport-metrics-dashboard --no-sandbox
Terminal=false
Categories=Utility;Office;
EOF

chmod +x ~/.local/share/applications/transport-metrics.desktop
```

### Creating a Shell Alias

Add to `~/.bashrc` or `~/.zshrc`:
```bash
alias transport-metrics='/path/to/transport-metrics-dashboard --no-sandbox'
```

---

## Transferring to Other Linux Machines

### Option A: USB Drive Transfer

```bash
# Copy the zip to USB
cp TransportMetrics-Linux.zip /media/usb/

# On target machine
cp /media/usb/TransportMetrics-Linux.zip ~/
unzip TransportMetrics-Linux.zip -d ~/transport-metrics
cd ~/transport-metrics
chmod +x transport-metrics-dashboard
./transport-metrics-dashboard --no-sandbox
```

### Option B: SCP (Secure Copy over Network)

```bash
# From source machine to target
scp TransportMetrics-Linux.zip user@target-ip:~/

# On target machine
unzip TransportMetrics-Linux.zip -d ~/transport-metrics
cd ~/transport-metrics
chmod +x transport-metrics-dashboard
./transport-metrics-dashboard --no-sandbox
```

### Option C: rsync (For folder)

```bash
# Sync the unpacked folder directly
rsync -avz linux-unpacked/ user@target-ip:~/transport-metrics/

# On target machine
cd ~/transport-metrics
chmod +x transport-metrics-dashboard
./transport-metrics-dashboard --no-sandbox
```

---

## Distribution-Specific Notes

The zip package works on **all Linux distributions**. Just extract and run with `--no-sandbox`.

### Ubuntu / Debian / Mint
```bash
unzip TransportMetrics-Linux.zip -d ~/transport-metrics
cd ~/transport-metrics
chmod +x transport-metrics-dashboard
./transport-metrics-dashboard --no-sandbox
```

### Fedora / RHEL / CentOS
```bash
unzip TransportMetrics-Linux.zip -d ~/transport-metrics
cd ~/transport-metrics
chmod +x transport-metrics-dashboard
./transport-metrics-dashboard --no-sandbox
```

### Arch Linux / Manjaro
```bash
unzip TransportMetrics-Linux.zip -d ~/transport-metrics
cd ~/transport-metrics
chmod +x transport-metrics-dashboard
./transport-metrics-dashboard --no-sandbox
```

---

## Configuration & Data

### Data Storage Location

User data is stored in:
```
~/.config/transport-metrics-dashboard/
```

### Log Files

```
~/.config/transport-metrics-dashboard/logs/
```

### Migrating Data Between Machines

```bash
# On source machine
tar -czvf transport-metrics-data.tar.gz ~/.config/transport-metrics-dashboard/

# Transfer to target machine
scp transport-metrics-data.tar.gz user@target:~/

# On target machine
tar -xzvf transport-metrics-data.tar.gz -C ~/
```

---

## Troubleshooting

### SUID Sandbox Error (Most Common)

**Error**: `The SUID sandbox helper binary was found, but is not configured correctly`

**Solution**: Always run with `--no-sandbox`:
```bash
./transport-metrics-dashboard --no-sandbox
```

This is the expected way to run the app on Linux.

### Permission Denied

```bash
chmod +x transport-metrics-dashboard
```

### Application Crashes on Start

```bash
# Run from terminal to see error messages
./transport-metrics-dashboard --no-sandbox

# If GPU issues, also add:
./transport-metrics-dashboard --no-sandbox --disable-gpu
```

### Blank/White Screen

```bash
# Disable hardware acceleration
./transport-metrics-dashboard --no-sandbox --disable-gpu
```

### Missing Libraries

```bash
# Check what's missing
ldd transport-metrics-dashboard | grep "not found"

# Install common missing libraries (Debian/Ubuntu)
sudo apt install libgtk-3-0 libnotify4 libnss3 libxss1 libxtst6 xdg-utils libatspi2.0-0 libuuid1 libsecret-1-0
```

### Wayland Display Issues

```bash
# Force X11 backend
GDK_BACKEND=x11 ./transport-metrics-dashboard --no-sandbox

# Or for Wayland
./transport-metrics-dashboard --no-sandbox --enable-features=UseOzonePlatform --ozone-platform=wayland
```

### High Memory Usage

Electron apps use Chromium, so ~150-300 MB RAM is normal.

---

## Quick Reference

| Task | Command |
|------|---------|
| Run the app | `./transport-metrics-dashboard --no-sandbox` |
| Build for Linux | `npm run electron:build:linux` |
| Build for all | `npm run electron:build:all` |

| File Location | Path |
|---------------|------|
| Built packages | `release/` |
| Distribution zip | `release/TransportMetrics-Linux.zip` |
| User data | `~/.config/transport-metrics-dashboard/` |

---

## Support

For issues or questions:
1. Check this guide's troubleshooting section
2. Review terminal output when running the app
3. Ensure you're using `--no-sandbox` flag
