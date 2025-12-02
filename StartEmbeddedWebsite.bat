@echo off
echo ========================================
echo    T8000 Embedded GUI Starting...
echo ========================================
echo.
echo Starting server on port 3001...
echo The website will open automatically in your browser.
echo.
echo Tip: Closing this window will stop the website.
echo.
cd standalone
node server-embedded.js
pause
