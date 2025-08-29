# Proxy Gateway Container
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json .

# Install dependencies
RUN npm install --production

# Copy proxy server and configuration
COPY proxy-server.js .
COPY routing-config.json .

# Expose proxy port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Start proxy server
CMD ["node", "proxy-server.js"]