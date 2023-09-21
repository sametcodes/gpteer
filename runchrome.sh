#!/bin/bash

pkill -f "Google Chrome"
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome https://chat.openai.com  --remote-debugging-port=9222 --no-first-run --no-default-browser-check > output.log 2>&1 &

while true; do
  if grep -q 'DevTools listening on' output.log; then
    WS_ENDPOINT=$(grep 'DevTools listening on' output.log | awk '{print $4}')
    echo "BROWSER_WS_ENDPOINT=\"$WS_ENDPOINT\"" > .env
    rm output.log
    break
  fi
  sleep 1
done
