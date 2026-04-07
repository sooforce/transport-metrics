@echo off
REM ============================================================
REM Transport Metrics Dashboard - Create Distribution Packages
REM ============================================================
REM This script builds the app for Windows and Linux, then 
REM creates zip files for easy distribution.
REM ============================================================

echo.
echo ============================================================
echo   Building and Packaging Transport Metrics Dashboard
echo ============================================================
echo.

cd /d "%~dp0"

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js found: 
node --version
echo.

REM Install dependencies if needed
if not exist "node_modules" (
    echo [STEP 1/4] Installing dependencies...
    call npm install
    echo.
)

REM Clear problematic electron-builder cache (fixes symlink errors)
echo Clearing electron-builder cache...
if exist "%LOCALAPPDATA%\electron-builder\Cache\winCodeSign" (
    rmdir /s /q "%LOCALAPPDATA%\electron-builder\Cache\winCodeSign" 2>nul
)

REM Build for both Windows and Linux
echo [STEP 2/4] Building for Windows and Linux...
call npm run electron:build:all
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)
echo.

REM Remove old zip files
echo [STEP 3/4] Creating distribution packages...
if exist "release\TransportMetrics-Windows.zip" del "release\TransportMetrics-Windows.zip"
if exist "release\TransportMetrics-Linux.zip" del "release\TransportMetrics-Linux.zip"

REM Create Windows zip
if exist "release\win-unpacked" (
    echo Creating Windows package...
    powershell -Command "Compress-Archive -Path 'release\win-unpacked\*' -DestinationPath 'release\TransportMetrics-Windows.zip' -Force"
    echo [OK] Created: release\TransportMetrics-Windows.zip
)

REM Create Linux zip
if exist "release\linux-unpacked" (
    echo Creating Linux package...
    powershell -Command "Compress-Archive -Path 'release\linux-unpacked\*' -DestinationPath 'release\TransportMetrics-Linux.zip' -Force"
    echo [OK] Created: release\TransportMetrics-Linux.zip
)

echo.
echo [STEP 4/4] Done!
echo ============================================================
echo.
echo Distribution packages created in the "release" folder:
echo.
if exist "release\TransportMetrics-Windows.zip" (
    for %%I in ("release\TransportMetrics-Windows.zip") do echo   Windows: TransportMetrics-Windows.zip (%%~zI bytes)
)
if exist "release\TransportMetrics-Linux.zip" (
    for %%I in ("release\TransportMetrics-Linux.zip") do echo   Linux:   TransportMetrics-Linux.zip (%%~zI bytes)
)
echo.
echo HOW TO USE:
echo.
echo   Windows:
echo     1. Extract TransportMetrics-Windows.zip
echo     2. Run "Transport Metrics Dashboard.exe"
echo.
echo   Linux:
echo     1. Extract TransportMetrics-Linux.zip
echo     2. chmod +x transport-metrics-dashboard 
echo     3. ./transport-metrics-dashboard --no-sandbox
echo.
echo ============================================================
echo.

explorer "release"
pause
