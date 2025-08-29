const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', venture: 'cradle', timestamp: new Date().toISOString() });
});

// Venture info endpoint
app.get('/info', (req, res) => {
  res.json({
    name: 'cradle',
    displayName: 'CradleSystem',
    description: 'Business Administration Platform',
    theme: 'Dark Modern'
  });
});

// Extension endpoint
app.get('/extension', (req, res) => {
  res.json({
    name: 'vsc-system-cradle',
    version: '1.0.0',
    path: '/app/extensions/vsc-system-cradle'
  });
});

// Workspace endpoint
app.get('/workspace', (req, res) => {
  res.json({
    name: 'cradle',
    path: '/app/workspace',
    settings: '/app/workspace/.vscode/settings.json'
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🏢 Cradle System Container running on port ${port}`);
});