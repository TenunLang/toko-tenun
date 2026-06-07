#!/usr/bin/env bash
# Jalankan chat WS (:3000) + web (:8080) sekaligus.  bash tools/start.sh
cd "$(dirname "$0")/.."
export TENUN_WORKERS=1
tenun chat.tenun &
CHAT=$!
trap "kill $CHAT 2>/dev/null" EXIT
echo "[start] chat WS -> ws://localhost:3000 (pid $CHAT)"
echo "[start] web     -> http://localhost:8080"
tenun
