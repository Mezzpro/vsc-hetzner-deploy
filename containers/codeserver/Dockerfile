# VSCode Code-Server Base Container
FROM codercom/code-server:4.103.0

# Set up coder user environment
USER coder
WORKDIR /home/coder

# Install Node.js, npm, and sudo for permission fixes
USER root
RUN apt-get update && apt-get install -y \
    curl \
    git \
    nodejs \
    npm \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# Add coder user to sudo group for permission fixes
RUN usermod -aG sudo coder
# Configure sudo to work without password for coder user
RUN echo "coder ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

# Switch back to coder user
USER coder

# Create base directory structure
RUN mkdir -p \
    /home/coder/.local/share/code-server/extensions \
    /home/coder/.config/code-server \
    /home/coder/workspaces

# Copy base configuration, extension installer, and startup script
COPY config/settings.json /home/coder/.local/share/code-server/User/settings.json
COPY install-extensions.sh /home/coder/install-extensions.sh
COPY start-with-extensions.sh /home/coder/start-with-extensions.sh

# Set ownership and make scripts executable
USER root
RUN chown -R coder:coder /home/coder && \
    chmod +x /home/coder/install-extensions.sh && \
    chmod +x /home/coder/start-with-extensions.sh
USER coder

# Expose code-server port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/healthz || exit 1

# Start code-server with extension management
CMD ["/home/coder/start-with-extensions.sh"]