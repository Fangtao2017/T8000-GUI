@echo off
echo ========================================
echo    T8000 Cloud Platform Starting...
echo ========================================
echo.
echo Starting server on port 3002...
echo The website will open automatically in your browser.
echo.
echo Tip: Closing this window will stop the website.
echo.
cd standalone
node server-cloud.js
pause
