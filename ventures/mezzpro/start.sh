#!/bin/sh

echo "⛓️ Starting MezzPro Venture Container..."

# Start venture service
node server.js &

# Keep container running
wait