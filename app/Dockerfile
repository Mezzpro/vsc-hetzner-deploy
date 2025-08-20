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
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install nvm, Node.js 20, and Gemini CLI globally
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash \
    && export NVM_DIR="/home/coder/.nvm" \
    && [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" \
    && nvm install 20 \
    && nvm use 20 \
    && npm install -g @google/gemini-cli@latest

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
COPY login-themes/ /home/coder/login-themes/
COPY tasks/ /home/coder/tasks/
COPY keybindings/ /home/coder/keybindings/
COPY scripts/ /home/coder/scripts/

# Install Node.js dependencies
RUN cd /home/coder && npm install --production

# Configure PATH for gemini CLI and set ownership
RUN echo 'export NVM_DIR="/home/coder/.nvm"' >> /home/coder/.bashrc \
    && echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> /home/coder/.bashrc \
    && echo 'export PATH=/home/coder/.nvm/versions/node/v20.19.4/bin:$PATH' >> /home/coder/.bashrc \
    && chmod +x /home/coder/start.sh \
    && chmod +x /home/coder/themes/*.sh \
    && chmod +x /home/coder/scripts/*.js \
    && chown -R coder:coder /home/coder

# Switch back to coder user
USER coder

# Set working directory
WORKDIR /home/coder

# Environment variables
ENV PORT=3000
ENV SHELL=/bin/bash
ENV GEMINI_API_KEY=""

# Start services
ENTRYPOINT ["/home/coder/start.sh"]