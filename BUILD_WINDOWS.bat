@echo off
REM ============================================================
REM Transport Metrics Dashboard - Windows Build Script
REM ============================================================
REM This script automates the entire build process on Windows.
REM Just copy the source files to a Windows machine and run this.
REM ============================================================

echo.
echo ============================================================
echo   Transport Metrics Dashboard - Windows Build Script
echo ============================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Download the LTS version and run the installer.
    echo After installation, restart this script.
    echo.
    pause
    exit /b 1
)

REM Display Node.js version
echo [OK] Node.js found:
node --version
echo.

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed!
    pause
    exit /b 1
)

echo [OK] npm found:
call npm --version
echo.

REM Navigate to script directory
cd /d "%~dp0"
echo [INFO] Working directory: %CD%
echo.

REM Check if package.json exists
if not exist "package.json" (
    echo [ERROR] package.json not found!
    echo Make sure you run this script from the project folder.
    pause
    exit /b 1
)

REM Install dependencies
echo ============================================================
echo [STEP 1/3] Installing dependencies...
echo ============================================================
echo.
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install dependencies!
    pause
    exit /b 1
)
echo.
echo [OK] Dependencies installed successfully.
echo.

REM Build the Electron app for Windows
echo ============================================================
echo [STEP 2/3] Building Electron app for Windows...
echo ============================================================
echo.
call npm run electron:build:win
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)
echo.
echo [OK] Build completed successfully.
echo.

REM Show output files
echo ============================================================
echo [STEP 3/3] Build Complete!
echo ============================================================
echo.
echo Output files are located in the "release" folder:
echo.
if exist "release" (
    dir /b "release\*.exe" 2>nul
    echo.
)
echo.
echo Installation options:
echo   1. Setup installer: "Transport Metrics Dashboard Setup X.X.X.exe"
echo   2. Portable version: "Transport Metrics Dashboard X.X.X.exe"
echo.
echo You can now copy these files to any Windows machine!
echo.

REM Open release folder
echo Opening release folder...
if exist "release" (
    explorer "release"
)

pause
