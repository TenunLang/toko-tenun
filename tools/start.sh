#!/usr/bin/env bash
# Jalankan toko (web + live chat di SATU proses, port 8080).  bash tools/start.sh
cd "$(dirname "$0")/.."
export TENUN_WORKERS=1
echo "[start] http + websocket -> http://localhost:8080"
tenun
