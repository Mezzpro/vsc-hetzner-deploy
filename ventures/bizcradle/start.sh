#!/bin/sh

echo "🚀 Starting Bizcradle Venture Container..."

# Start venture service
node server.js &

# Keep container running
wait