#!/bin/bash

# ModGuardAI Backend Startup Script
# This script helps you get the backend running quickly

echo "🛡️  ModGuardAI Backend Setup"
echo "============================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your database credentials"
    echo ""
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "🐍 Creating Python virtual environment..."
    python3 -m venv venv
    echo "✅ Virtual environment created"
    echo ""
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📦 Installing dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt
echo "✅ Dependencies installed"
echo ""

# Check if database exists
echo "🗄️  Checking database..."
python -c "
from app.core.config import settings
import sys

# Parse DATABASE_URL
url = settings.DATABASE_URL
if 'postgresql' in url:
    db_name = url.split('/')[-1].split('?')[0]
    print(f'Database name: {db_name}')
    print('')
    print('To create the database, run:')
    print(f'  createdb {db_name}')
    print('')
    print('Or using psql:')
    print(f'  psql -U postgres -c \"CREATE DATABASE {db_name};\"')
"

# Initialize database
read -p "Initialize database tables? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🏗️  Initializing database..."
    python init_db.py
    echo ""
fi

# Start server
echo "🚀 Starting FastAPI server..."
echo "   API Docs: http://localhost:8000/docs"
echo "   Health Check: http://localhost:8000/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
