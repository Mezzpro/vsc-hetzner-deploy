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
  secure: false,
  xfwd: true,
  logLevel: 'info',
  pathRewrite: {
    '^/': '/'
  },
  onProxyReq: (proxyReq, req, res) => {
    const host = req.headers.host;
    const route = getRouteForHost(host) || routingConfig.routes[0];
    
    console.log(`🔄 Proxying: ${req.method} ${req.url} → code-server`);
    
    // Add venture context headers
    proxyReq.setHeader('X-Venture-Name', route.workspace);
    proxyReq.setHeader('X-Venture-Domain', route.domain);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`✅ Code-server response: ${proxyRes.statusCode} for ${req.url}`);
  },
  onError: (err, req, res) => {
    console.error('❌ Proxy error:', err.message);
    if (res && !res.headersSent) {
      res.status(500).send('Code-server proxy error');
    }
  },
  onProxyReqWs: (proxyReq, req, socket, options, head) => {
    const host = req.headers.host;
    const route = getRouteForHost(host) || routingConfig.routes[0];
    
    console.log(`🔌 WebSocket proxy request: ${req.url} for ${host} → ${route.workspace}`);
    
    // Set proper origin for VS Code server WebSocket security
    proxyReq.setHeader('Origin', routingConfig.codeServer.url);
    
    // Forward cookies for authentication
    if (req.headers.cookie) {
      proxyReq.setHeader('Cookie', req.headers.cookie);
      console.log(`🍪 Forwarding cookies for WebSocket: ${req.headers.cookie.substring(0, 50)}...`);
    }
    
    // Forward other important headers
    if (req.headers['user-agent']) {
      proxyReq.setHeader('User-Agent', req.headers['user-agent']);
    }
    
    proxyReq.on('error', (err) => {
      console.error('❌ WebSocket proxy request error:', err.message);
      socket.end();
    });
  },
  onProxyResWs: (proxyRes, proxySocket, proxyHead) => {
    console.log(`✅ WebSocket proxy response established`);
    
    proxySocket.on('error', (err) => {
      console.error('❌ WebSocket proxy socket error:', err.message);
    });
    
    proxySocket.on('close', (code, reason) => {
      console.log(`🔌 WebSocket proxy socket closed: ${code} ${reason || 'no reason'}`);
    });
  }
});

// Direct downloads proxy - handle before general routing
app.use('/proxy/:port/downloads/*', (req, res) => {
  const port = req.params.port;
  const downloadPath = req.path.replace(`/proxy/${port}`, '');
  
  console.log(`📥 Direct download proxy: ${req.path} → port ${port}${downloadPath}`);
  
  // Map ports to venture containers
  const portMap = {
    '3001': 'vsc-system-cradle',
    '3002': 'vsc-venture-mezzpro', 
    '3003': 'vsc-venture-bizcradle'
  };
  
  const containerName = portMap[port];
  if (!containerName) {
    return res.status(404).json({ error: 'Service not found' });
  }
  
  // Create download proxy
  const downloadProxy = createProxyMiddleware({
    target: `http://${containerName}:${port}`,
    changeOrigin: true,
    pathRewrite: {
      [`^/proxy/${port}`]: ''
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`📦 Proxying download: ${req.url} → ${containerName}:${port}`);
    }
  });
  
  downloadProxy(req, res);
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
  console.log(`🔍 WebSocket URL: ${req.url}`);
  console.log(`🔍 WebSocket Headers:`, {
    host: req.headers.host,
    origin: req.headers.origin,
    'sec-websocket-protocol': req.headers['sec-websocket-protocol'],
    'sec-websocket-version': req.headers['sec-websocket-version']
  });
  
  // Handle socket errors
  socket.on('error', (err) => {
    console.error('❌ WebSocket upgrade socket error:', err.message);
  });
  
  try {
    // Use the proxy for WebSocket upgrades  
    vscodeProxy.upgrade(req, socket, head);
    console.log('✅ WebSocket upgrade delegated to proxy');
  } catch (err) {
    console.error('❌ WebSocket upgrade error:', err.message);
    socket.end();
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log('🌐 VSCode Proxy Gateway started');
  console.log(`📡 Listening on port ${port}`);
  console.log('📋 Route Configuration:');
  routingConfig.routes.forEach(route => {
    console.log(`   ${route.domain} → ${route.target} (${route.workspace})`);
  });
});