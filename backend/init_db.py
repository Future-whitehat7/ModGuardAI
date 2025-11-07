#!/usr/bin/env python3
"""
Database initialization script for ModGuardAI

This script creates all database tables defined in the models.
Run this before starting the application for the first time.

Usage:
    python init_db.py
"""

from app.core.database import engine, Base
from app.models.user import User

def init_db():
    """Initialize the database by creating all tables"""
    print("Creating database tables...")

    # Import all models to ensure they're registered with Base
    # This ensures all tables are created

    # Create all tables
    Base.metadata.create_all(bind=engine)

    print("✅ Database tables created successfully!")
    print("\nCreated tables:")
    for table in Base.metadata.sorted_tables:
        print(f"  - {table.name}")


if __name__ == "__main__":
    init_db()
