const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const routingConfig = require('./routing-config.json');
const http = require('http');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Function to load version data
function loadVersionData(venture) {
  try {
    const filePath = path.join(__dirname, 'version-data', `${venture}-versions.json`);
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (error) {
    console.error(`Error loading version data for ${venture}:`, error);
  }
  
  // Fallback to basic version info
  return {
    venture: venture,
    latest: {
      version: "1.0.0",
      releaseDate: "2025-09-07",
      filename: `${venture}-Setup-v1.0.0.exe`,
      size: "1.7 MB",
      highlights: ["Initial release"]
    },
    previousVersions: []
  };
}

// Function to generate enhanced download HTML
function generateDownloadHTML(venture, versionData, themeColors) {
  const latest = versionData.latest;
  const previousVersions = versionData.previousVersions || [];
  
  // Generate highlights HTML
  const highlightsHTML = latest.highlights.map(highlight => 
    `<li>• ${highlight}</li>`
  ).join('');
  
  // Generate previous versions HTML
  const previousVersionsHTML = previousVersions.map(version => `
    <div class="version-item">
      <div class="version-header">
        <span class="version-number">v${version.version}</span>
        <span class="version-date">(${version.releaseDate})</span>
      </div>
      <div class="version-changes">
        ${version.changes ? version.changes.map(change => `• ${change}`).join('<br>') : ''}
      </div>
      <a href="/downloads/${venture}/${version.filename}" class="download-btn secondary" download>
        ⬇️ Download v${version.version}
      </a>
    </div>
  `).join('');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Download ${venture.charAt(0).toUpperCase() + venture.slice(1)} - Enhanced Version</title>
      <style>
        /* Auto dark/light theme detection */
        @media (prefers-color-scheme: light) {
          body { 
            background: #f8f8f8; 
            color: #333;
          }
          .container { 
            background: #ffffff; 
            border: 1px solid #e1e4e8;
            box-shadow: 0 4px 20px ${themeColors.shadowLight};
          }
          p, .description { color: #586069; }
          .info, .version-item { 
            background: #f6f8fa;
            color: #586069;
            border: 1px solid #e1e4e8;
          }
          .version-header { color: #24292e; }
        }
        
        @media (prefers-color-scheme: dark) {
          body { 
            background: #0d1117; 
            color: #c9d1d9;
          }
          .container { 
            background: #161b22; 
            border: 1px solid #30363d;
            box-shadow: 0 4px 20px ${themeColors.shadowDark};
          }
          p, .description { color: #8b949e; }
          .info, .version-item { 
            background: #21262d;
            color: #8b949e;
            border: 1px solid #30363d;
          }
          .version-header { color: #f0f6fc; }
        }

        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; 
          text-align: center; 
          padding: 20px; 
          margin: 0;
          min-height: 100vh;
        }
        .container { 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 30px; 
          border-radius: 8px; 
        }
        h1 { 
          color: ${themeColors.primary}; 
          margin-bottom: 20px; 
          font-size: 28px;
        }
        
        /* Latest Version Section */
        .latest-section {
          background: ${themeColors.primary}15;
          border: 2px solid ${themeColors.primary}30;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
        }
        .latest-badge {
          background: ${themeColors.primary};
          color: white;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 10px;
          display: inline-block;
        }
        .version-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .highlights {
          text-align: left;
          max-width: 500px;
          margin: 15px auto;
        }
        .highlights ul {
          list-style: none;
          padding: 0;
        }
        .highlights li {
          margin: 8px 0;
          padding-left: 20px;
        }
        
        /* Download Buttons */
        .download-btn { 
          display: inline-block; 
          background: ${themeColors.primary}; 
          color: #ffffff; 
          padding: 15px 30px; 
          text-decoration: none; 
          border-radius: 6px; 
          font-size: 18px; 
          font-weight: bold;
          transition: background 0.3s ease;
          margin: 10px;
          border: 1px solid ${themeColors.primary};
        }
        .download-btn:hover { 
          background: ${themeColors.primaryHover}; 
          border-color: ${themeColors.primaryHover};
        }
        .download-btn.secondary {
          background: transparent;
          color: ${themeColors.primary};
          font-size: 14px;
          padding: 10px 20px;
        }
        .download-btn.secondary:hover {
          background: ${themeColors.primary};
          color: white;
        }
        
        /* Version History */
        .version-history {
          margin-top: 40px;
          text-align: left;
        }
        .version-history h3 {
          color: ${themeColors.primary};
          margin-bottom: 20px;
        }
        .version-item {
          padding: 15px;
          margin: 10px 0;
          border-radius: 6px;
          border-left: 4px solid ${themeColors.primary};
        }
        .version-header {
          font-weight: bold;
          margin-bottom: 8px;
        }
        .version-number {
          font-size: 16px;
        }
        .version-date {
          font-size: 12px;
          opacity: 0.8;
          margin-left: 10px;
        }
        .version-changes {
          font-size: 14px;
          margin: 10px 0;
          line-height: 1.4;
        }
        
        .info { 
          margin-top: 20px; 
          font-size: 14px; 
          padding: 15px;
          border-radius: 6px;
          line-height: 1.4;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>${venture === 'bizcradle' ? '🚀' : venture === 'mezzpro' ? '⛓️' : '🏢'} ${venture.charAt(0).toUpperCase() + venture.slice(1)} Downloads</h1>
        
        <!-- Latest Version Section -->
        <div class="latest-section">
          <div class="latest-badge">LATEST VERSION</div>
          <div class="version-title">v${latest.version}</div>
          <p class="description">Released: ${latest.releaseDate}</p>
          
          <a href="/downloads/${venture}/${latest.filename}" class="download-btn" download>
            💻 Download Latest Version
          </a>
          
          <div class="highlights">
            <strong>✨ What's included in v${latest.version}:</strong>
            <ul>${highlightsHTML}</ul>
          </div>
        </div>
        
        <div class="info">
          <strong>File:</strong> ${latest.filename}<br>
          <strong>Size:</strong> ${latest.size}<br>
          <strong>Compatible:</strong> Windows 10/11
        </div>
        
        ${previousVersions.length > 0 ? `
        <div class="version-history">
          <h3>📋 Previous Versions</h3>
          ${previousVersionsHTML}
        </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;
}

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

// Domain-aware download page
app.get('/download', (req, res) => {
  const host = req.headers.host;
  const route = getRouteForHost(host) || routingConfig.routes[0];
  
  console.log(`📄 Download page requested for ${host} → ${route.workspace}`);
  
  if (route.workspace === 'bizcradle') {
    // Redirect to specific BizCradle download page
    res.redirect('/download-bizcradle');
  } else if (route.workspace === 'mezzpro') {
    // Redirect to specific MezzPro download page  
    res.redirect('/download-mezzpro');
  } else {
    // Default CradleSystems download page
    const versionData = loadVersionData('cradlesystems');
    const themeColors = {
      primary: '#007acc',
      primaryHover: '#005a9e',
      shadowLight: 'rgba(0, 122, 204, 0.15)',
      shadowDark: 'rgba(0, 122, 204, 0.25)'
    };
    
    res.send(generateDownloadHTML('cradlesystems', versionData, themeColors));
  }
});

// BizCradle download page - Dark theme with orange branding
app.get('/download-bizcradle', (req, res) => {
  console.log('📄 BizCradle download page requested');
  
  const versionData = loadVersionData('bizcradle');
  const themeColors = {
    primary: '#FF8C00',
    primaryHover: '#e67e00',
    shadowLight: 'rgba(255, 140, 0, 0.15)',
    shadowDark: 'rgba(255, 140, 0, 0.25)'
  };
  
  res.send(generateDownloadHTML('bizcradle', versionData, themeColors));
});
    <html>
    <head>
      <title>Download BizCradle - Business Management Platform</title>
      <style>
        /* Auto dark/light theme detection */
        @media (prefers-color-scheme: light) {
          body { 
            background: #f8f8f8; 
            color: #333;
          }
          .container { 
            background: #ffffff; 
            border: 1px solid #e1e4e8;
            box-shadow: 0 4px 20px rgba(255, 140, 0, 0.15);
          }
          p { color: #586069; }
          .info { 
            background: #f6f8fa;
            color: #586069;
            border: 1px solid #e1e4e8;
          }
        }
        
        @media (prefers-color-scheme: dark) {
          body { 
            background: #0d1117; 
            color: #c9d1d9;
          }
          .container { 
            background: #161b22; 
            border: 1px solid #30363d;
            box-shadow: 0 4px 20px rgba(255, 140, 0, 0.25);
          }
          p { color: #8b949e; }
          .info { 
            background: #21262d;
            color: #8b949e;
            border: 1px solid #30363d;
          }
        }

        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif; 
          text-align: center; 
          padding: 50px; 
          margin: 0;
          min-height: 100vh;
        }
        .container { 
          max-width: 500px; 
          margin: 0 auto; 
          padding: 40px; 
          border-radius: 8px; 
        }
        h1 { 
          color: #FF8C00; 
          margin-bottom: 30px; 
          font-size: 28px;
        }
        p { 
          font-size: 16px; 
          line-height: 1.5; 
          margin-bottom: 20px;
        }
        .download-btn { 
          display: inline-block; 
          background: #FF8C00; 
          color: #ffffff; 
          padding: 15px 30px; 
          text-decoration: none; 
          border-radius: 6px; 
          font-size: 18px; 
          font-weight: bold;
          transition: background 0.3s ease;
          margin-top: 20px;
          border: 1px solid #FF8C00;
        }
        .download-btn:hover { 
          background: #e67e00; 
          border-color: #e67e00;
        }
        .info { 
          margin-top: 20px; 
          font-size: 14px; 
          padding: 15px;
          border-radius: 6px;
          line-height: 1.4;
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
  
  const versionData = loadVersionData('mezzpro');
  const themeColors = {
    primary: '#8B5CF6',
    primaryHover: '#7c3aed',
    shadowLight: 'rgba(139, 92, 246, 0.15)',
    shadowDark: 'rgba(139, 92, 246, 0.25)'
  };
  
  res.send(generateDownloadHTML('mezzpro', versionData, themeColors));
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