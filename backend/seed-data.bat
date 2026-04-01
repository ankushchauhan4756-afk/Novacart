@echo off
REM NovaCart Database Seed Script
REM Seeds MongoDB with sample data

title NovaCart - Database Seeding
echo.
echo =====================================
echo  NovaCart - Database Seeding
echo =====================================
echo.
echo Make sure MongoDB is running!
echo.
echo Seeding database with sample data...
echo.

cd backend
call npm install
call npm run seed

pause
