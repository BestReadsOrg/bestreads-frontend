@echo off
REM BestReads Frontend Startup Script for Windows

echo ========================================
echo    BestReads Frontend Server
echo ========================================
echo.

REM Check if Node.js is installed
echo [1/3] Checking Node.js installation...
node -v >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18 or higher
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js found

REM Check if node_modules exists, if not, install dependencies
echo [2/3] Checking dependencies...
if not exist "node_modules\" (
    echo Installing dependencies... This may take a few minutes.
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo ✓ Dependencies already installed
)

REM Check if .env.local exists
if not exist ".env.local" (
    echo.
    echo WARNING: .env.local file not found
    echo Creating .env.local from example...
    if exist ".env.local.example" (
        copy .env.local.example .env.local >nul
        echo ✓ Created .env.local
    ) else (
        echo Please create .env.local with:
        echo NEXT_PUBLIC_API_URL=http://localhost:8080/api
    )
    echo.
)

REM Start the frontend development server
echo [3/3] Starting Frontend Development Server...
echo.
echo Frontend will start on: http://localhost:3000
echo.
echo Make sure the Backend is running on: http://localhost:8080/api
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

call npm run dev

pause
