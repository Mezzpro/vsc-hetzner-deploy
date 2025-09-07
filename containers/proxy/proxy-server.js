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

// Simple download page
app.get('/download', (req, res) => {
  console.log('📄 Download page requested');
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Download Cradle Systems Installer</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
        .container { max-width: 500px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; margin-bottom: 30px; }
        .download-btn { 
          display: inline-block; 
          background: #000; 
          color: white; 
          padding: 15px 30px; 
          text-decoration: none; 
          border-radius: 5px; 
          font-size: 18px; 
          font-weight: bold;
          transition: background 0.3s;
        }
        .download-btn:hover { background: #333; }
        .info { color: #666; margin-top: 20px; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🏢 Cradle Systems Installer</h1>
        <p>Click the button below to download the Cradle Systems installer for Windows.</p>
        <a href="/downloads/CradleSystemsInstaller-v1.0.0.exe" class="download-btn" download>
          💻 Download Windows Installer
        </a>
        <div class="info">
          File: CradleSystemsInstaller-v1.0.0.exe<br>
          Size: ~1.8 MB<br>
          Compatible with Windows 10/11
        </div>
      </div>
    </body>
    </html>
  `);
});

// BizCradle download page - Dark theme with orange branding
app.get('/download-bizcradle', (req, res) => {
  console.log('📄 BizCradle download page requested');
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Download BizCradle - Business Management Platform</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          text-align: center; 
          padding: 50px; 
          background: #1a1a1a; 
          color: #fff; 
        }
        .container { 
          max-width: 500px; 
          margin: 0 auto; 
          background: #2d2d2d; 
          padding: 40px; 
          border-radius: 10px; 
          box-shadow: 0 4px 20px rgba(255, 140, 0, 0.3);
          border: 2px solid #FF8C00;
        }
        h1 { color: #FF8C00; margin-bottom: 30px; }
        p { color: #cccccc; font-size: 16px; line-height: 1.5; }
        .download-btn { 
          display: inline-block; 
          background: #FF8C00; 
          color: white; 
          padding: 15px 30px; 
          text-decoration: none; 
          border-radius: 5px; 
          font-size: 18px; 
          font-weight: bold;
          transition: background 0.3s;
          margin-top: 20px;
        }
        .download-btn:hover { background: #e67e00; }
        .info { 
          color: #999; 
          margin-top: 20px; 
          font-size: 14px; 
          background: #333;
          padding: 15px;
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🏢 BizCradle Desktop</h1>
        <p>Professional business management platform for Windows. Click below to download the installer.</p>
        <a href="/downloads/bizcradle/BizCradle-Setup-v1.0.0.exe" class="download-btn" download>
          💻 Download BizCradle for Windows
        </a>
        <div class="info">
          File: BizCradle-Setup-v1.0.0.exe<br>
          Size: ~1.7 MB<br>
          Compatible with Windows 10/11<br>
          Business Management Platform
        </div>
      </div>
    </body>
    </html>
  `);
});

// MezzPro download page - Light theme with purple branding
app.get('/download-mezzpro', (req, res) => {
  console.log('📄 MezzPro download page requested');
  
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Download MezzPro - Blockchain Development Platform</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          text-align: center; 
          padding: 50px; 
          background: #f8f9fa; 
          color: #333; 
        }
        .container { 
          max-width: 500px; 
          margin: 0 auto; 
          background: white; 
          padding: 40px; 
          border-radius: 10px; 
          box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
          border: 2px solid #8B5CF6;
        }
        h1 { color: #8B5CF6; margin-bottom: 30px; }
        p { color: #555; font-size: 16px; line-height: 1.5; }
        .download-btn { 
          display: inline-block; 
          background: #8B5CF6; 
          color: white; 
          padding: 15px 30px; 
          text-decoration: none; 
          border-radius: 5px; 
          font-size: 18px; 
          font-weight: bold;
          transition: background 0.3s;
          margin-top: 20px;
        }
        .download-btn:hover { background: #7c3aed; }
        .info { 
          color: #666; 
          margin-top: 20px; 
          font-size: 14px; 
          background: #f5f3ff;
          padding: 15px;
          border-radius: 5px;
          border-left: 4px solid #8B5CF6;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>⛓️ MezzPro Desktop</h1>
        <p>Advanced blockchain development platform for Windows. Download the installer to get started.</p>
        <a href="/downloads/mezzpro/MezzPro-Setup-v1.0.0.exe" class="download-btn" download>
          💻 Download MezzPro for Windows
        </a>
        <div class="info">
          File: MezzPro-Setup-v1.0.0.exe<br>
          Size: ~1.8 MB<br>
          Compatible with Windows 10/11<br>
          Blockchain Development Platform
        </div>
      </div>
    </body>
    </html>
  `);
});

// Direct downloads - serve installer files (bypass auth)
app.get('/downloads/*', (req, res) => {
  const filename = req.path.split('/downloads/')[1];
  
  console.log(`📥 Direct download request: ${filename}`);
  
  // Determine target container based on path
  let targetContainer = 'http://vsc-system-cradle:3001'; // default
  
  if (filename.startsWith('bizcradle/')) {
    targetContainer = 'http://vsc-venture-bizcradle:3003';
    console.log(`🏢 Routing to BizCradle container: ${filename}`);
  } else if (filename.startsWith('mezzpro/')) {
    targetContainer = 'http://vsc-venture-mezzpro:3002';
    console.log(`⛓️ Routing to MezzPro container: ${filename}`);
  } else {
    console.log(`🏢 Routing to CradleSystems container: ${filename}`);
  }
  
  // Create proxy for the appropriate container
  const downloadProxy = createProxyMiddleware({
    target: targetContainer,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      console.log(`📦 Downloading: ${filename} from ${targetContainer}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      console.log(`✅ Download response: ${proxyRes.statusCode} for ${filename}`);
    },
    onError: (err, req, res) => {
      console.error('❌ Download error:', err.message);
      if (res && !res.headersSent) {
        res.status(500).json({ error: 'Download failed' });
      }
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