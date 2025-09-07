const express = require('express');
const cors = require('cors');
const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', venture: 'mezzpro', timestamp: new Date().toISOString() });
});

// Venture info endpoint
app.get('/info', (req, res) => {
  res.json({
    name: 'mezzpro',
    displayName: 'MezzPro',
    description: 'Blockchain Development Platform',
    theme: 'Dark High Contrast'
  });
});

// Extension endpoint
app.get('/extension', (req, res) => {
  res.json({
    name: 'vsc-venture-mezzpro',
    version: '1.0.0',
    path: '/app/extensions/vsc-venture-mezzpro'
  });
});

// Workspace endpoint
app.get('/workspace', (req, res) => {
  res.json({
    name: 'mezzpro',
    path: '/app/workspace',
    settings: '/app/workspace/.vscode/settings.json'
  });
});

// Installer download endpoints
app.use('/downloads/mezzpro', express.static('/app/installers', {
  setHeaders: (res, path, stat) => {
    res.set('Content-Disposition', 'attachment');
    res.set('Content-Type', 'application/octet-stream');
    console.log(`📥 Serving installer file: ${path}`);
  }
}));

// Installer info endpoint
app.get('/installer/info', (req, res) => {
  res.json({
    name: 'MezzPro',
    version: '1.0.0',
    filename: 'MezzPro-Setup-v1.0.0.exe',
    size: '1.8 MB',
    platform: 'Windows',
    description: 'Blockchain Development Platform Desktop Application'
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`⛓️ MezzPro Venture Container running on port ${port}`);
});