# Jalankan toko (web + live chat di SATU proses, port 8080).
#   powershell -ExecutionPolicy Bypass -File tools/start.ps1
Set-Location (Split-Path $PSScriptRoot -Parent)
$env:TENUN_WORKERS = "1"
Write-Host "[start] http + websocket -> http://localhost:8080"
tenun
