# Jalankan chat WS (:3000) + web (:8080) sekaligus.
#   powershell -ExecutionPolicy Bypass -File tools/start.ps1
$ErrorActionPreference = "Stop"
Set-Location (Split-Path $PSScriptRoot -Parent)
$env:TENUN_WORKERS = "1"

# Chat WebSocket di proses terpisah (background).
$chat = Start-Process -PassThru -WindowStyle Hidden tenun -ArgumentList "chat.tenun"
Write-Host "[start] chat WS  -> ws://localhost:3000 (pid $($chat.Id))"
Write-Host "[start] web      -> http://localhost:8080"
try {
    tenun   # web (index.tenun), foreground
} finally {
    if ($chat -and -not $chat.HasExited) { Stop-Process -Id $chat.Id -Force }
}
