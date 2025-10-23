#!/bin/bash
# Kill any processes using the dev server port (51346)
# This ensures clean state before running E2E tests

PORT=51346

echo "Checking for processes on port $PORT..."
PIDS=$(lsof -ti:$PORT 2>/dev/null)

if [ -z "$PIDS" ]; then
  echo "No processes found on port $PORT"
  exit 0
fi

echo "Found processes: $PIDS"
echo "Killing processes..."

for PID in $PIDS; do
  kill $PID 2>/dev/null && echo "Killed process $PID" || echo "Process $PID already gone"
done

echo "Port $PORT is now available"
