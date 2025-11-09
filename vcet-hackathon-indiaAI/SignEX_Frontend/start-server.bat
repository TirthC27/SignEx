@echo off
title SignEX Network Server
color 0A

echo.
echo ================================
echo   SignEX Network Server
echo ================================
echo.

REM Get local IP address
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr /i "IPv4"') do (
    for /f "tokens=1" %%j in ("%%i") do (
        set LOCAL_IP=%%j
    )
)

REM Remove leading spaces
for /f "tokens=* delims= " %%a in ("%LOCAL_IP%") do set LOCAL_IP=%%a

echo 📱 Access your SignEX app from any device:
echo    Local:    http://localhost:3000
echo    Network:  http://%LOCAL_IP%:3000
echo.
echo 📋 Instructions for other devices:
echo    1. Connect to the same WiFi network
echo    2. Open browser and go to: http://%LOCAL_IP%:3000
echo    3. Allow Node.js through firewall if prompted
echo.
echo 💡 Press Ctrl+C to stop the server
echo ================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

REM Start the server
echo 🚀 Starting server...
npm run dev:network

pause
