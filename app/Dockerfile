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
    && export NVM_DIR="/root/.nvm" \
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
COPY extensions/ /home/coder/extensions/

# Install Node.js dependencies and build extension
RUN cd /home/coder && npm install --production

# Build Cradle Business Extension  
RUN cd /home/coder/extensions/cradle-business-extension \
    && npm install \
    && npm run compile \
    && mkdir -p /home/coder/.local/share/code-server/extensions \
    && cp -r /home/coder/extensions/cradle-business-extension /home/coder/.local/share/code-server/extensions/

# Build MezzPro Blockchain Extension
RUN cd /home/coder/extensions/mezzpro-blockchain-extension \
    && npm install \
    && npm run compile \
    && cp -r /home/coder/extensions/mezzpro-blockchain-extension /home/coder/.local/share/code-server/extensions/

# Build Bizcradle Business Extension
RUN cd /home/coder/extensions/bizcradle-business-extension \
    && npm install \
    && npm run compile \
    && cp -r /home/coder/extensions/bizcradle-business-extension /home/coder/.local/share/code-server/extensions/

# Configure PATH for gemini CLI and set ownership
RUN echo 'export NVM_DIR="/root/.nvm"' >> /home/coder/.bashrc \
    && echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> /home/coder/.bashrc \
    && echo 'export PATH=/root/.nvm/versions/node/v20.19.4/bin:$PATH' >> /home/coder/.bashrc \
    && chmod +x /home/coder/start.sh \
    && chmod +x /home/coder/themes/*.sh \
    && chmod +x /home/coder/scripts/*.js \
    && chmod +x /home/coder/extensions/cradle-business-extension/build.sh || true \
    && chmod +x /home/coder/extensions/mezzpro-blockchain-extension/build.sh || true \
    && chmod +x /home/coder/extensions/bizcradle-business-extension/build.sh || true \
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