@echo off
REM ============================================================
REM Transport Metrics Dashboard - Create Distribution Package
REM ============================================================
REM This script creates a clean package with only the files needed
REM to build the app on another machine (excludes node_modules, etc.)
REM ============================================================

echo.
echo ============================================================
echo   Creating Distribution Package
echo ============================================================
echo.

REM Navigate to script directory
cd /d "%~dp0"

REM Set output folder name
set DIST_FOLDER=TransportMetrics_Source
set DIST_ZIP=TransportMetrics_Source.zip

REM Remove old distribution folder/zip if exists
if exist "%DIST_FOLDER%" (
    echo Removing old distribution folder...
    rmdir /s /q "%DIST_FOLDER%"
)
if exist "%DIST_ZIP%" (
    echo Removing old zip file...
    del /q "%DIST_ZIP%"
)

REM Create distribution folder
echo Creating distribution folder...
mkdir "%DIST_FOLDER%"

REM Copy required files and folders
echo Copying source files...

REM Core files
copy "package.json" "%DIST_FOLDER%\" >nul
copy "package-lock.json" "%DIST_FOLDER%\" >nul 2>nul
copy "vite.config.js" "%DIST_FOLDER%\" >nul
copy "index.html" "%DIST_FOLDER%\" >nul

REM Build scripts
copy "BUILD_WINDOWS.bat" "%DIST_FOLDER%\" >nul
copy "BUILD_LINUX.sh" "%DIST_FOLDER%\" >nul
copy "BUILD_ALL.bat" "%DIST_FOLDER%\" >nul 2>nul

REM Documentation
copy "MIGRATION_GUIDE.md" "%DIST_FOLDER%\" >nul 2>nul
copy "*.md" "%DIST_FOLDER%\" >nul 2>nul

REM Source folders
echo Copying src folder...
xcopy "src" "%DIST_FOLDER%\src\" /E /I /Q >nul

echo Copying electron folder...
xcopy "electron" "%DIST_FOLDER%\electron\" /E /I /Q >nul

echo Copying public folder...
if exist "public" (
    xcopy "public" "%DIST_FOLDER%\public\" /E /I /Q >nul
)

REM Copy jsx file in root if exists
if exist "transport_fiber_cut_dashboard.jsx" (
    copy "transport_fiber_cut_dashboard.jsx" "%DIST_FOLDER%\" >nul
)

REM Create the zip file using PowerShell
echo.
echo Creating zip archive...
powershell -Command "Compress-Archive -Path '%DIST_FOLDER%\*' -DestinationPath '%DIST_ZIP%' -Force"

if exist "%DIST_ZIP%" (
    echo.
    echo ============================================================
    echo   Package Created Successfully!
    echo ============================================================
    echo.
    echo Created: %DIST_ZIP%
    echo.
    for %%I in ("%DIST_ZIP%") do echo Size: %%~zI bytes
    echo.
    echo This package contains everything needed to build the app.
    echo.
    echo To use on another machine:
    echo   1. Extract the zip file
    echo   2. Run BUILD_WINDOWS.bat (Windows) or BUILD_LINUX.sh (Linux)
    echo.
    
    REM Clean up folder, keep zip
    rmdir /s /q "%DIST_FOLDER%"
    
    echo Opening folder...
    explorer /select,"%DIST_ZIP%"
) else (
    echo [ERROR] Failed to create zip file!
)

echo.
pause
