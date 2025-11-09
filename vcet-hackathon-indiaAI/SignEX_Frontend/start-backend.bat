@echo off
title SignEX FastAPI Backend
color 0B

echo.
echo ================================
echo   SignEX FastAPI Backend
echo ================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed
    echo Please install Python from https://python.org
    pause
    exit /b 1
)

echo ✅ Python is installed
python --version

REM Check if pip is available
pip --version >nul 2>&1
if errorlevel 1 (
    echo ❌ pip is not available
    pause
    exit /b 1
)

echo ✅ pip is available

REM Install requirements
echo.
echo 📦 Installing Python dependencies...
pip install -r backend-requirements.txt

if errorlevel 1 (
    echo ❌ Failed to install dependencies
    echo Try running: pip install fastapi uvicorn pillow python-multipart
    pause
    exit /b 1
)

echo.
echo ✅ Dependencies installed successfully
echo.
echo 🚀 Starting FastAPI server...
echo.
echo 📱 Backend will be available at:
echo    Local:    http://localhost:8000
echo    Network:  http://0.0.0.0:8000
echo    API Docs: http://localhost:8000/docs
echo.
echo 💡 Press Ctrl+C to stop the server
echo ================================
echo.

REM Start the FastAPI server
python fastapi-backend.py

pause
