# Simple HTTP Server for Unit Converter PWA
# Run this script to start a local web server

$port = 8000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Write-Host "✅ Server started successfully!" -ForegroundColor Green
    Write-Host "🌐 Open your browser and go to: http://localhost:$port"
    Write-Host "📱 Test the PWA features and mobile responsiveness"
    Write-Host "⏹️  Press Ctrl+C to stop the server"
    Write-Host ""
    
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Get the requested file path
        $localPath = $request.Url.LocalPath
        if ($localPath -eq '/') { $localPath = '/index.html' }
        $filePath = "." + $localPath
        
        try {
            if (Test-Path $filePath -PathType Leaf) {
                # Determine content type
                $contentType = switch ([System.IO.Path]::GetExtension($filePath).ToLower()) {
                    '.html' { 'text/html' }
                    '.css'  { 'text/css' }
                    '.js'   { 'application/javascript' }
                    '.json' { 'application/json' }
                    '.png'  { 'image/png' }
                    '.jpg'  { 'image/jpeg' }
                    '.jpeg' { 'image/jpeg' }
                    '.svg'  { 'image/svg+xml' }
                    '.ico'  { 'image/x-icon' }
                    default { 'application/octet-stream' }
                }
                
                $response.ContentType = $contentType
                $buffer = [System.IO.File]::ReadAllBytes($filePath)
                $response.ContentLength64 = $buffer.Length
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
                
                Write-Host "$(Get-Date -Format 'HH:mm:ss') - Served: $localPath" -ForegroundColor Gray
            } else {
                $response.StatusCode = 404
                $buffer = [System.Text.Encoding]::UTF8.GetBytes("File not found: $localPath")
                $response.ContentLength64 = $buffer.Length
                $response.OutputStream.Write($buffer, 0, $buffer.Length)
                
                Write-Host "$(Get-Date -Format 'HH:mm:ss') - 404 Not Found: $localPath" -ForegroundColor Yellow
            }
        } catch {
            $response.StatusCode = 500
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("Server error: $($_.Exception.Message)")
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            
            Write-Host "$(Get-Date -Format 'HH:mm:ss') - 500 Error: $($_.Exception.Message)" -ForegroundColor Red
        }
        
        $response.OutputStream.Close()
    }
} catch {
    Write-Host "❌ Error starting server: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Make sure no other application is using port $port" -ForegroundColor Yellow
} finally {
    if ($listener) {
        $listener.Stop()
        Write-Host "`n🛑 Server stopped" -ForegroundColor Yellow
    }
}