# Use the official code-server image
FROM codercom/code-server:4.103.0

# Switch to root for installations
USER root

# Install Node.js, npm, Python, and other essentials
RUN apt-get update && apt-get install -y \
    curl \
    git \
    nodejs \
    npm \
    python3 \
    python3-pip \
    python3-venv \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install Gemini CLI (Google AI CLI)
RUN pip3 install google-generativeai --break-system-packages

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

# Make scripts executable and set ownership
RUN chmod +x /home/coder/start.sh \
    && chmod +x /home/coder/themes/*.sh \
    && chmod +x /home/coder/scripts/*.py \
    && ln -s /home/coder/scripts/gemini-cli.py /usr/local/bin/gemini \
    && chown -R coder:coder /home/coder

# Switch back to coder user
USER coder

# Set working directory
WORKDIR /home/coder

# Environment variables
ENV PORT=3000
ENV SHELL=/bin/bash
ENV GEMINI_API_KEY="AIzaSyCuvxmglLYKsaFq4JWXudl3Ugol8_5eReU"

# Start services
ENTRYPOINT ["/home/coder/start.sh"]