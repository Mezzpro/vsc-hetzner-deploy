const express = require('express');
const cors = require('cors');
const app = express();
const port = 3003;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', venture: 'bizcradle', timestamp: new Date().toISOString() });
});

// Venture info endpoint
app.get('/info', (req, res) => {
  res.json({
    name: 'bizcradle',
    displayName: 'Bizcradle',
    description: 'Marketing Automation Platform',
    theme: 'Light Modern'
  });
});

// Extension endpoint
app.get('/extension', (req, res) => {
  res.json({
    name: 'vsc-venture-bizcradle',
    version: '1.0.0',
    path: '/app/extensions/vsc-venture-bizcradle'
  });
});

// Workspace endpoint
app.get('/workspace', (req, res) => {
  res.json({
    name: 'bizcradle',
    path: '/app/workspace',
    settings: '/app/workspace/.vscode/settings.json'
  });
});

// Installer download endpoints
app.use('/downloads/bizcradle', express.static('/app/installers', {
  setHeaders: (res, path, stat) => {
    res.set('Content-Disposition', 'attachment');
    res.set('Content-Type', 'application/octet-stream');
    console.log(`📥 Serving installer file: ${path}`);
  }
}));

// Installer info endpoint
app.get('/installer/info', (req, res) => {
  res.json({
    name: 'BizCradle',
    version: '1.0.0',
    filename: 'BizCradle-Setup-v1.0.0.exe',
    size: '1.7 MB',
    platform: 'Windows',
    description: 'Business Management Platform Desktop Application'
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Bizcradle Venture Container running on port ${port}`);
});