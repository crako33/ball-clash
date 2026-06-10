@echo off
title Ball Fighters
echo Starting Ball Fighters development server...
echo.

:: Open browser in 2 seconds in a separate process
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:5173"

:: Start the dev server in the current window
npm run dev
