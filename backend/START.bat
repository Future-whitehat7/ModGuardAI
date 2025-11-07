@echo off
REM ModGuardAI Backend Startup Script for Windows

echo.
echo 🛡️  ModGuardAI Backend Setup
echo ============================
echo.

REM Check if .env exists
if not exist .env (
    echo 📝 Creating .env file from template...
    copy .env.example .env
    echo ⚠️  Please edit .env file with your database credentials
    echo.
)

REM Check if virtual environment exists
if not exist venv (
    echo 🐍 Creating Python virtual environment...
    python -m venv venv
    echo ✅ Virtual environment created
    echo.
)

REM Activate virtual environment
echo 🔧 Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo 📦 Installing dependencies...
python -m pip install --upgrade pip --quiet
pip install -r requirements.txt --quiet
echo ✅ Dependencies installed
echo.

REM Database info
echo 🗄️  Database Setup
echo.
echo To create the database, run:
echo   createdb modguardai
echo.
echo Or using psql:
echo   psql -U postgres -c "CREATE DATABASE modguardai;"
echo.

REM Ask to initialize database
set /p INIT="Initialize database tables? (y/n): "
if /i "%INIT%"=="y" (
    echo 🏗️  Initializing database...
    python init_db.py
    echo.
)

REM Start server
echo 🚀 Starting FastAPI server...
echo    API Docs: http://localhost:8000/docs
echo    Health Check: http://localhost:8000/health
echo.
echo Press Ctrl+C to stop the server
echo.

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

pause
