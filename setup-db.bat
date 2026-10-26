@echo off
title Hackathon Management System - Database Setup

echo.
echo ========================================
echo Hackathon Management System
echo Database Setup
echo ========================================
echo.

cd /d "%~dp0.."

echo Step 1: Creating database...
mysql -u root -e "CREATE DATABASE IF NOT EXISTS hackathon;"

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Could not connect to MySQL.
    echo.
    echo Make sure MySQL is running in XAMPP.
    echo.
    pause
    exit /b 1
)

echo Database ready.
echo.

echo Step 2: Creating main database schema...
mysql -u root hackathon < database\hackathon_schema.sql

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to create main schema.
    pause
    exit /b 1
)

echo Main schema completed.
echo.

echo Step 3: Adding mentor tables...
mysql -u root hackathon < database\mentor_tables.sql

if %errorlevel% neq 0 (
    echo Warning: Mentor tables may already exist.
)

echo.

echo Step 4: Adding leaderboard functionality...
mysql -u root hackathon < database\add_leaderboard_final.sql

if %errorlevel% neq 0 (
    echo Warning: Leaderboard changes may already exist.
)

echo.

echo Step 5: Adding project ZIP functionality...
mysql -u root hackathon < database\add_project_zip_column.sql

if %errorlevel% neq 0 (
    echo Warning: Project ZIP column may already exist.
)

echo.

echo Step 6: Adding message delete functionality...
mysql -u root hackathon < database\add_message_delete.sql

if %errorlevel% neq 0 (
    echo Warning: Message delete functionality may already exist.
)

echo.
echo ========================================
echo Database setup completed successfully!
echo ========================================
echo.
echo Next step:
echo node BACKEND\create-admin.js
echo.
pause