#!/bin/sh

echo "🏢 Starting Cradle System Container..."

# Start venture service
node server.js &

# Keep container running
wait