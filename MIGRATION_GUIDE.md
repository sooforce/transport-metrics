# Transport Metrics Dashboard - Migration Guide

**Quick and easy way to transfer this app to Windows or Linux machines.**

---

## Quick Start (TL;DR)

### Option 1: Use Pre-Built Packages (Easiest - No Build Required)

On your development machine, run **`BUILD_ALL.bat`** to create:
- `release/TransportMetrics-Windows.zip` (~114 MB)
- `release/TransportMetrics-Linux.zip` (~109 MB)

Transfer the appropriate zip to the target machine, extract, and run!

### Option 2: Transfer Source Code (Build on Target)

1. Run **`CREATE_PACKAGE.bat`** → Creates `TransportMetrics_Source.zip` (~1-2 MB)
2. Transfer to target machine
3. Extract and run `BUILD_WINDOWS.bat` or `BUILD_LINUX.sh`

---

## Pre-Built Package Instructions

### Windows Target Machine

1. Copy `TransportMetrics-Windows.zip` to the target PC
2. Extract to any folder (e.g., `C:\Apps\TransportMetrics\`)
3. Double-click **`Transport Metrics Dashboard.exe`**

**That's it!** No installation, no prerequisites.

### Linux Target Machine

1. Copy `TransportMetrics-Linux.zip` to the target machine
2. Extract:
   ```bash
   unzip TransportMetrics-Linux.zip -d ~/transport-metrics
   cd ~/transport-metrics
   ```
3. Run:
   ```bash
   chmod +x transport-metrics-dashboard
   ./transport-metrics-dashboard --no-sandbox
   ```

**Note:** The `--no-sandbox` flag is required on Linux.

---

## Source Code Package Contents

If you use `CREATE_PACKAGE.bat`, the zip contains (~1-2 MB):

```
TransportMetrics_Source/
├── BUILD_WINDOWS.bat      # Windows build script (double-click)
├── BUILD_LINUX.sh         # Linux build script
├── BUILD_ALL.bat          # Build both platforms + create zips
├── CREATE_PACKAGE.bat     # Re-create source package
├── package.json           # Dependencies & config
├── package-lock.json      # Locked versions
├── vite.config.js         # Vite configuration
├── index.html             # Entry HTML
├── src/                   # React source code
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── electron/              # Electron main process
│   ├── main.cjs
│   └── preload.js
├── public/                # Static assets
└── *.md                   # Documentation
```

**NOT included** (downloaded/generated during build):
- `node_modules/` (~250 MB)
- `dist/` - Generated during build
- `release/` - Generated during build

---

## Building from Source

### On Windows Target Machine

**Prerequisites:** Node.js 18+ from https://nodejs.org/

```powershell
# Extract source and run
cd TransportMetrics_Source
BUILD_WINDOWS.bat
```

Or manually:
```powershell
npm install
npm run electron:build:win
```

Output: `release\win-unpacked\Transport Metrics Dashboard.exe`

### On Linux Target Machine

**Prerequisites:** Node.js 18+

```bash
# Install Node.js (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Extract source and run
cd TransportMetrics_Source
chmod +x BUILD_LINUX.sh
./BUILD_LINUX.sh
```

Or manually:
```bash
npm install
npm run electron:build:linux
```

Output: `release/linux-unpacked/transport-metrics-dashboard`

---

## Running the App

### Windows
```
Double-click "Transport Metrics Dashboard.exe"
```

### Linux
```bash
./transport-metrics-dashboard --no-sandbox
```

**Why `--no-sandbox`?** Chrome's sandbox requires special permissions on Linux. This flag is safe for trusted applications.

---

## Troubleshooting

### Windows: SmartScreen Warning
Click "More info" → "Run anyway" (app is unsigned)

### Linux: Permission Denied
```bash
chmod +x transport-metrics-dashboard
```

### Linux: GLIBC Error
Your Linux version may be too old. Try Ubuntu 20.04+ or similar.

### Linux: libfuse2 Missing (for AppImage)
```bash
sudo apt install libfuse2
```

---

## Quick Reference

| Script | Purpose |
|--------|---------|
| `BUILD_ALL.bat` | Build both platforms + create zip packages |
| `BUILD_WINDOWS.bat` | Build Windows version only |
| `BUILD_LINUX.sh` | Build Linux version only |
| `CREATE_PACKAGE.bat` | Create source code package for transfer |

| File | Size | Target |
|------|------|--------|
