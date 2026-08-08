@echo off
title Stotra Sangraha Local Dev Server
echo ====================================================
echo   Starting Stotra Sangraha Local Dev Server
echo ====================================================
echo.
echo Opening http://localhost:8080 in your default browser...
start http://localhost:8080
echo.
echo Server running at http://localhost:8080/
echo Press Ctrl+C in this window to stop the server.
echo.
python -m http.server 8080
