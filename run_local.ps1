# Stotra Sangraha Local Dev Server Launcher

Write-Host "====================================================" -ForegroundColor Gold
Write-Host "  Starting Stotra Sangraha Local Dev Server" -ForegroundColor Yellow
Write-Host "====================================================" -ForegroundColor Gold
Write-Host ""
Write-Host "Opening http://localhost:8080 in your default browser..." -ForegroundColor Cyan

Start-Process "http://localhost:8080"

Write-Host "Server running at http://localhost:8080/" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server.`n" -ForegroundColor Gray

python -m http.server 8080
