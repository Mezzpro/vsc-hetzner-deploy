const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Domain to workspace folder mapping
const DOMAIN_WORKSPACE_MAP = {
    'cradlesystems.xyz': '/home/coder/workspace-admin',
    'www.cradlesystems.xyz': '/home/coder/workspace-admin',
    'mezzpro.xyz': '/home/coder/workspace-mezzpro',
    'www.mezzpro.xyz': '/home/coder/workspace-mezzpro',
    'minqro.xyz': '/home/coder/workspace-minqro',
    'www.minqro.xyz': '/home/coder/workspace-minqro',
    'sobuai.xyz': '/home/coder/workspace-sobuai',
    'www.sobuai.xyz': '/home/coder/workspace-sobuai',
    'bizcradle.xyz': '/home/coder/workspace-bizcradle',
    'www.bizcradle.xyz': '/home/coder/workspace-bizcradle',
    'localhost': '/home/coder/workspace-admin'
};

// Default workspace for unknown domains
const DEFAULT_WORKSPACE = '/home/coder/workspace-admin';

// Code-server runs on port 8080
const CODE_SERVER_PORT = 8080;

// Middleware to handle domain-based redirects
app.use('/', (req, res, next) => {
    const hostname = req.get('host') || '';
    const folderParam = req.query.folder;
    
    console.log(`🌐 Request: ${hostname}${req.url}`);
    console.log(`📂 Current folder param: ${folderParam || 'none'}`);
    
    // Skip redirect for VS Code static assets and system paths
    if (req.path.startsWith('/_static/') || 
        req.path.startsWith('/static/') || 
        req.path.startsWith('/stable-') ||
        req.path.includes('.js') || 
        req.path.includes('.css') || 
        req.path.includes('.ico') || 
        req.path.includes('.svg') ||
        req.path.includes('.json')) {
        console.log(`🔧 VS Code asset, proxying directly`);
        return next();
    }
    
    // If folder parameter already exists, just proxy to code-server
    if (folderParam) {
        console.log(`✅ Folder param exists, proxying to code-server`);
        return next();
    }
    
    // Only redirect root path and workspace paths
    if (req.path !== '/' && !req.path.startsWith('/login')) {
        console.log(`🔧 Non-root path, proxying directly`);
        return next();
    }
    
    // Get workspace for current domain
    const targetWorkspace = DOMAIN_WORKSPACE_MAP[hostname.toLowerCase()] || DEFAULT_WORKSPACE;
    
    // Build redirect URL with folder parameter
    const redirectUrl = `${req.protocol}://${hostname}${req.path}?folder=${encodeURIComponent(targetWorkspace)}`;
    
    console.log(`🔄 Redirecting ${hostname} → ${targetWorkspace}`);
    console.log(`📍 Redirect URL: ${redirectUrl}`);
    
    // Issue HTTP 302 redirect
    return res.redirect(302, redirectUrl);
});

// Proxy all requests to code-server
const proxyOptions = {
    target: `http://127.0.0.1:${CODE_SERVER_PORT}`,
    changeOrigin: true,
    ws: true, // Enable WebSocket proxying for VS Code
    secure: false,
    xfwd: true,
    logLevel: 'info',
    onError: (err, req, res) => {
        console.error('❌ Proxy error:', err.message);
        if (res && !res.headersSent) {
            res.status(500).send('Code-server proxy error');
        }
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`🔄 Proxying: ${req.method} ${req.url} → code-server`);
    },
    onProxyRes: (proxyRes, req, res) => {
        console.log(`✅ Code-server response: ${proxyRes.statusCode} for ${req.url}`);
    },
    onProxyReqWs: (proxyReq, req, socket, options, head) => {
        console.log(`🔌 WebSocket proxy request: ${req.url}`);
        proxyReq.setHeader('Origin', `http://127.0.0.1:${CODE_SERVER_PORT}`);
        
        if (req.headers.cookie) {
            proxyReq.setHeader('Cookie', req.headers.cookie);
        }
        
        proxyReq.on('error', (err) => {
            console.error('❌ WebSocket proxy request error:', err.message);
        });
    },
    onProxyResWs: (proxyRes, proxySocket, proxyHead) => {
        console.log(`✅ WebSocket proxy response established`);
        proxySocket.on('error', (err) => {
            console.error('❌ WebSocket proxy socket error:', err.message);
        });
    }
};

// Create proxy middleware
const proxy = createProxyMiddleware(proxyOptions);
app.use('/', proxy);

// Start proxy server
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 VSC Hetzner Proxy Server running on port ${PORT}`);
    console.log(`🔗 Code-server target: http://localhost:${CODE_SERVER_PORT}`);
    console.log(`🌐 Domain mappings:`);
    Object.entries(DOMAIN_WORKSPACE_MAP).forEach(([domain, workspace]) => {
        console.log(`   ${domain} → ${workspace}`);
    });
});

// Handle WebSocket upgrades for VS Code
server.on('upgrade', (request, socket, head) => {
    console.log('🔌 WebSocket upgrade request');
    
    socket.on('error', (err) => {
        console.error('❌ WebSocket upgrade socket error:', err.message);
    });
    
    try {
        proxy.upgrade(request, socket, head);
        console.log('✅ WebSocket upgrade delegated to proxy');
    } catch (err) {
        console.error('❌ WebSocket upgrade error:', err.message);
        socket.end();
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully');
    server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT, shutting down gracefully');
    server.close(() => {
        console.log('✅ HTTP server closed');
        process.exit(0);
    });
});