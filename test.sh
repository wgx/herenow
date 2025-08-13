#!/bin/bash


# remember to chmod +x this before running
# --- Configuration ---
# Change this to your deployed server address if you are not running it locally.
SERVER_URL="https://herenow-anhz7w.fly.dev"
PAGE_PATH="/test-page-from-cli"

# Generate two unique session IDs for the test.
SESSION_1="session-$(date +%s)-$RANDOM"
SESSION_2="session-$(date +%s)-$RANDOM"

echo ">>> Testing Counter Server at: $SERVER_URL"
echo ">>> Using page path: $PAGE_PATH"
echo

# --- Test 1: Ping with the first user ---
echo "[1] Pinging with first user (ID: $SESSION_1)..."
# The -s flag silences the progress meter from curl for cleaner output.
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\": \"$SESSION_1\", \"page\": \"$PAGE_PATH\"}" \
  "$SERVER_URL/ping"
echo "  Ping sent."
echo

# --- Test 2: Get the count, which should be 1 ---
echo "[2] Getting the count (expecting 1)..."
curl "$SERVER_URL/count?page=$PAGE_PATH"
echo
echo

# --- Test 3: Ping with the second user ---
echo "[3] Pinging with second user (ID: $SESSION_2)..."
curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "{\"sessionId\": \"$SESSION_2\", \"page\": \"$PAGE_PATH\"}" \
  "$SERVER_URL/ping"
echo "  Ping sent."
echo

# --- Test 4: Get the count again, which should be 2 ---
echo "[4] Getting the count (expecting 2)..."
curl "$SERVER_URL/count?page=$PAGE_PATH"
echo
echo

echo ">>> Test complete."