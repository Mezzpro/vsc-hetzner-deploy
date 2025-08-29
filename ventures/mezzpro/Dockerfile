# MezzPro Venture Container
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package.json .
RUN npm install --production

# Copy extension, workspace, and server
COPY extension/ ./extension/
COPY workspace/ ./workspace/
COPY server.js .

# Build extension
WORKDIR /app/extension
RUN npm install && npm run compile

# Create extension directory and copy compiled extension
RUN mkdir -p /app/extensions/vsc-venture-mezzpro
RUN cp -r /app/extension/* /app/extensions/vsc-venture-mezzpro/

WORKDIR /app

# Copy startup script
COPY start.sh .
RUN chmod +x start.sh

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3002/health || exit 1

# Start venture container
CMD ["./start.sh"]