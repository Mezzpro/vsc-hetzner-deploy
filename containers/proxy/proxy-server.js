const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const routingConfig = require('./routing-config.json');
const http = require('http');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'vsc-proxy-gateway',
    timestamp: new Date().toISOString()
  });
});

// Route matching function
const getRouteForHost = (host) => {
  const hostname = host.split(':')[0];
  return routingConfig.routes.find(route => 
    route.domain === hostname || 
    hostname.includes(route.domain.split('.')[0])
  );
};

// Create a single proxy instance for VS Code server
const vscodeProxy = createProxyMiddleware({
  target: routingConfig.codeServer.url,
  changeOrigin: true,
  ws: true,
  pathRewrite: {
    '^/': '/'
  },
  onProxyReq: (proxyReq, req, res) => {
    const host = req.headers.host;
    const route = getRouteForHost(host) || routingConfig.routes[0];
    
    // Add venture context headers
    proxyReq.setHeader('X-Venture-Name', route.workspace);
    proxyReq.setHeader('X-Venture-Domain', route.domain);
  }
});

// Proxy middleware for venture routing
app.use('/', (req, res, next) => {
  const host = req.headers.host;
  const route = getRouteForHost(host) || routingConfig.routes[0]; // Default to cradle
  
  console.log(`🎯 Routing ${host} to ${route.workspace} workspace`);
  
  // Redirect root requests to workspace-specific folder
  if (req.path === '/' && !req.query.folder) {
    const workspaceFolder = `/home/coder/workspaces/${route.workspace}`;
    return res.redirect(`/?folder=${encodeURIComponent(workspaceFolder)}`);
  }
  
  // Use the single proxy instance
  vscodeProxy(req, res, next);
});

// Create HTTP server to handle WebSocket upgrades
const server = http.createServer(app);

// Handle WebSocket upgrades
server.on('upgrade', (req, socket, head) => {
  const host = req.headers.host;
  const route = getRouteForHost(host) || routingConfig.routes[0];
  
  console.log(`🔌 WebSocket upgrade for ${host} to ${route.workspace} workspace`);
  
  // Use the proxy for WebSocket upgrades
  vscodeProxy.upgrade(req, socket, head);
});

server.listen(port, '0.0.0.0', () => {
  console.log('🌐 VSCode Proxy Gateway started');
  console.log(`📡 Listening on port ${port}`);
  console.log('📋 Route Configuration:');
  routingConfig.routes.forEach(route => {
    console.log(`   ${route.domain} → ${route.target} (${route.workspace})`);
  });
});