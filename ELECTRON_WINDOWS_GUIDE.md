# Transport Metrics Dashboard - Windows Deployment Guide

This guide explains how to build, distribute, and run the Electron app on Windows machines.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Building on Windows](#building-on-windows)
3. [Output Files](#output-files)
4. [Installation Methods](#installation-methods)
5. [Transferring to Other Windows Machines](#transferring-to-other-windows-machines)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### On the Development Machine (where you build)

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify: `npm --version`

3. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

### On Target Machines (where you run the app)

- **No prerequisites required!** The built app is self-contained.
- Supported: Windows 10, Windows 11 (64-bit)

---

## Building on Windows

### Step 1: Install Dependencies

Open PowerShell or Command Prompt in the project folder:

```powershell
cd "C:\path\to\Transport_Metrics"
npm install
```

### Step 2: Build the Application

```powershell
npm run electron:build:win
```

This will:
1. Build the React/Vite frontend into `dist/`
2. Package everything into Electron
3. Create installers in `release/`

**Build time**: Approximately 2-5 minutes (first build may take longer)

---

## Output Files

After building, check the `release/` folder:

```
release/
├── TransportMetrics-Windows.zip               # Ready-to-distribute zip
├── win-unpacked/                               # Unpacked app folder
│   └── Transport Metrics Dashboard.exe
└── builder-effective-config.yaml
```

### File Descriptions

| File | Size (approx) | Description |
|------|---------------|-------------|
| `TransportMetrics-Windows.zip` | ~114 MB | Zipped app, ready to transfer |
| `win-unpacked/` | ~200+ MB | Extracted app folder |

**Note:** Use `BUILD_ALL.bat` to automatically create the zip file.

---

## Installation Methods

### Method 1: Zip Package (Recommended)

1. Extract `TransportMetrics-Windows.zip` to any folder
2. Double-click `Transport Metrics Dashboard.exe`
3. No installation needed, no admin rights required

### Method 2: Unpacked Folder

1. Copy the entire `win-unpacked/` folder
2. Run `Transport Metrics Dashboard.exe` inside it
3. Useful for testing or restricted environments

---

## Transferring to Other Windows Machines

### Option A: USB Drive Transfer

1. **Copy the portable executable**:
   ```
   Transport Metrics Dashboard 1.0.0.exe
   ```

2. Plug USB into target machine

3. Run directly from USB or copy to local drive

### Option B: Network Share

1. Place the portable `.exe` on a shared network folder

2. On target machine:
   ```powershell
   # Copy from network share
   Copy-Item "\\server\share\Transport Metrics Dashboard 1.0.0.exe" "C:\Apps\"
   ```

3. Run from local copy (recommended) or directly from share

### Option C: Send Installer via Cloud Storage

1. Upload `Transport Metrics Dashboard Setup 1.0.0.exe` to:
   - Google Drive
   - OneDrive
   - Dropbox

2. Share link with target users

3. Download and run installer on target machine

### Option D: Create a ZIP Archive

```powershell
# In the release folder
Compress-Archive -Path "win-unpacked" -DestinationPath "TransportMetrics-Windows.zip"
```

Transfer the ZIP file and extract on the target machine.

---

## Running the Application

### First Launch

1. Double-click the executable or shortcut
2. Windows SmartScreen may show a warning (first run only):
   - Click "More info"
   - Click "Run anyway"

### Creating a Desktop Shortcut (Portable version)

1. Right-click the `.exe` file
2. Select "Create shortcut"
3. Move shortcut to Desktop

### Adding to Start Menu (Portable version)

```powershell
# Create Start Menu shortcut
$WshShell = New-Object -comObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Transport Metrics Dashboard.lnk")
$Shortcut.TargetPath = "C:\Path\To\Transport Metrics Dashboard 1.0.0.exe"
$Shortcut.Save()
```

---

## Configuration & Data

### Data Storage Location

User data is stored in:
```
%APPDATA%\transport-metrics-dashboard\
```

To find this folder:
```powershell
explorer "$env:APPDATA\transport-metrics-dashboard"
```

### Migrating Data Between Machines

1. On source machine, copy:
   ```
   %APPDATA%\transport-metrics-dashboard\
   ```

2. On target machine, paste to the same location

---

## Troubleshooting

### "Windows protected your PC" (SmartScreen)

This appears because the app isn't code-signed. Solutions:
1. Click "More info" → "Run anyway"
2. Right-click .exe → Properties → Check "Unblock" → OK

### Application won't start

1. Make sure you're running 64-bit Windows
2. Try running as Administrator
3. Check Windows Event Viewer for errors
4. Delete `%APPDATA%\transport-metrics-dashboard` and retry

### Missing DLL errors

Install Visual C++ Redistributable:
- Download from: https://aka.ms/vs/17/release/vc_redist.x64.exe

### Antivirus blocking the app

Some antivirus software may flag unsigned Electron apps:
1. Add the application to your antivirus exceptions
2. Or use the installer version which is more trusted

### High memory usage

Electron apps use Chromium, so ~150-300 MB RAM is normal.

---

## Building for Distribution

### Customizing the installer

Edit `package.json` under the `"build"` section:

```json
"nsis": {
  "oneClick": false,           // Show installation options
  "perMachine": true,          // Install for all users
  "allowToChangeInstallationDirectory": true,
  "installerIcon": "public/icon.ico",
  "uninstallerIcon": "public/icon.ico",
  "license": "LICENSE.txt"     // Optional license agreement
}
```

### Adding an application icon

1. Create a 256x256 PNG icon: `public/icon.png`
2. For Windows, also create an ICO file: `public/icon.ico`
   - Use https://convertico.com/ to convert PNG to ICO
3. Rebuild: `npm run electron:build:win`

### Code Signing (Optional - for professional distribution)

To remove SmartScreen warnings, sign your app:

1. Obtain a Code Signing Certificate from:
   - DigiCert
   - Sectigo
   - GlobalSign

2. Add to `package.json`:
   ```json
   "win": {
     "certificateFile": "path/to/certificate.pfx",
     "certificatePassword": "your-password"
   }
   ```

---

## Quick Reference

| Task | Command |
|------|---------|
| Install dependencies | `npm install` |
| Run in development | `npm run electron:dev` |
| Build for Windows | `npm run electron:build:win` |
| Build for all platforms | `npm run electron:build:all` |

| File Location | Path |
|---------------|------|
| Built installers | `release/` |
| User data | `%APPDATA%\transport-metrics-dashboard\` |
| Logs | `%APPDATA%\transport-metrics-dashboard\logs\` |

---

## Support

For issues or questions:
1. Check this guide's troubleshooting section
2. Review the console output during build
3. Check Node.js and npm versions are up to date
