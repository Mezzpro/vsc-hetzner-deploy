# Use the official code-server image
FROM codercom/code-server:4.103.0

# Switch to root for installations
USER root

# Install Node.js, npm, and other essentials
RUN apt-get update && apt-get install -y \
    curl \
    git \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Create workspace directories
RUN mkdir -p /home/coder/workspace-admin \
    /home/coder/workspace-mezzpro \
    /home/coder/workspace-minqro \
    /home/coder/workspace-sobuai \
    /home/coder/workspace-bizcradle \
    && chown -R coder:coder /home/coder

# Copy application files
COPY package.json /home/coder/package.json
COPY proxy-server.js /home/coder/proxy-server.js
COPY start-services.sh /home/coder/start.sh
COPY themes/ /home/coder/themes/

# Install Node.js dependencies
RUN cd /home/coder && npm install --production

# Make scripts executable and set ownership
RUN chmod +x /home/coder/start.sh \
    && chmod +x /home/coder/themes/*.sh \
    && chown -R coder:coder /home/coder

# Switch back to coder user
USER coder

# Set working directory
WORKDIR /home/coder

# Environment variables
ENV PORT=3000
ENV SHELL=/bin/bash

# Start services
ENTRYPOINT ["/home/coder/start.sh"]