@echo off
echo Starting Unit Converter PWA...
echo.
echo You can use one of these methods to start a local server:
echo.
echo Method 1: Using Python (if installed)
echo   python -m http.server 8000
echo.
echo Method 2: Using Node.js (if installed)
echo   npx http-server -p 8000
echo.
echo Method 3: Using PHP (if installed)
echo   php -S localhost:8000
echo.
echo Method 4: Using PowerShell
echo   powershell -Command "Start-Process 'powershell' -ArgumentList '-Command', 'Get-Content -Path . -Stream * | Select-String -Pattern '' -Context 0,1' -PassThru | ForEach-Object { Write-Output \"Serving files on http://localhost:8000\" }"
echo.
echo Or simply open index.html directly in your browser for basic functionality.
echo For full PWA features (offline, install), you need a local server.
echo.
echo Once server is running, open: http://localhost:8000
echo.
pause