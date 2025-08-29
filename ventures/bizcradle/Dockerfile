# Bizcradle Venture Container
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package.json .
RUN npm install --production

# Copy extension and workspace
COPY extension/ ./extension/
COPY workspace/ ./workspace/
COPY config/ ./config/

# Build extension
WORKDIR /app/extension
RUN npm install && npm run compile

# Create extension directory and copy compiled extension
RUN mkdir -p /app/extensions/vsc-venture-bizcradle
RUN cp -r /app/extension/* /app/extensions/vsc-venture-bizcradle/

WORKDIR /app

# Copy startup script
COPY start.sh .
RUN chmod +x start.sh

# Expose port
EXPOSE 3003

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3003/health || exit 1

# Start venture container
CMD ["./start.sh"]