const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const routingConfig = require('./routing-config.json');

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

// Proxy middleware for venture routing
app.use('/', (req, res, next) => {
  const host = req.headers.host;
  const route = getRouteForHost(host);
  
  if (!route) {
    // Default to cradle system
    const defaultRoute = routingConfig.routes[0];
    console.log(`🔄 No route found for ${host}, defaulting to ${defaultRoute.domain}`);
    
    const proxy = createProxyMiddleware({
      target: defaultRoute.target,
      changeOrigin: true,
      ws: true,
      pathRewrite: {
        '^/': '/'
      }
    });
    
    return proxy(req, res, next);
  }

  console.log(`🎯 Routing ${host} to ${route.target} (${route.workspace})`);
  
  // Create proxy for matched route
  const proxy = createProxyMiddleware({
    target: route.target,
    changeOrigin: true,
    ws: true,
    pathRewrite: {
      '^/': '/'
    },
    onProxyReq: (proxyReq, req, res) => {
      // Add venture context headers
      proxyReq.setHeader('X-Venture-Name', route.workspace);
      proxyReq.setHeader('X-Venture-Domain', route.domain);
    }
  });
  
  proxy(req, res, next);
});

app.listen(port, '0.0.0.0', () => {
  console.log('🌐 VSCode Proxy Gateway started');
  console.log(`📡 Listening on port ${port}`);
  console.log('📋 Route Configuration:');
  routingConfig.routes.forEach(route => {
    console.log(`   ${route.domain} → ${route.target} (${route.workspace})`);
  });
});