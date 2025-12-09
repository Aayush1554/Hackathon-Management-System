@echo off
echo Setting up Hackathon Management System Database...
echo.

cd /d "%~dp0.."

echo Step 1: Creating main database schema...
mysql -u root hackathon < database\hackathon_schema.sql
if %errorlevel% neq 0 (
    echo Error: Failed to create main schema
    pause
    exit /b 1
)

echo Step 2: Adding mentor tables...
mysql -u root hackathon < database\mentor_tables.sql
if %errorlevel% neq 0 (
    echo Warning: Mentor tables may already exist
)

echo Step 3: Adding leaderboard finalization...
mysql -u root hackathon < database\add_leaderboard_final.sql
if %errorlevel% neq 0 (
    echo Warning: Leaderboard columns may already exist
)

echo Step 4: Adding project zip column...
mysql -u root hackathon < database\add_project_zip_column.sql
if %errorlevel% neq 0 (
    echo Warning: Project zip column may already exist
)

echo Step 5: Adding message delete functionality...
mysql -u root hackathon < database\add_message_delete.sql
if %errorlevel% neq 0 (
    echo Warning: Message delete may already exist
)

echo.
echo ========================================
echo Database setup completed successfully!
echo ========================================
echo.
echo Now run: node BACKEND\create-admin.js
echo.
pause
