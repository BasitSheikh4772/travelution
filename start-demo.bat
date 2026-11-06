@echo off
cd /d "%~dp0"
if not exist node_modules (echo Installing dependencies... & call npm install)
if not exist .env.local copy .env.example .env.local >nul
echo Building demo...
call npm run build || (echo Build failed & pause & exit /b 1)
start "" http://localhost:3000
call npm start
