const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
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

// Downloads endpoint - serve installer files
app.get('/downloads/:filename', (req, res) => {
  const filename = req.params.filename;
  console.log(`📥 Download requested: ${filename}`);
  
  // Map download filenames to actual local paths
  const downloadMap = {
    'CradleSystemsInstaller-v1.0.0.exe': path.join(__dirname, 'installers', 'CradleSystemsInstaller-v1.0.0.exe'),
    'cradle-mac.dmg': path.join(__dirname, 'installers', 'cradle-mac.dmg'),
    'cradle-linux.deb': path.join(__dirname, 'installers', 'cradle-linux.deb'),
    'business-suite.zip': path.join(__dirname, 'installers', 'business-suite.zip'),
    'reports.zip': path.join(__dirname, 'installers', 'reports.zip')
  };
  
  const filePath = downloadMap[filename];
  if (!filePath) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    return res.status(404).json({ error: 'Installer file not available' });
  }
  
  console.log(`✅ Serving file: ${filePath}`);
  
  // Set proper headers for download
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'application/octet-stream');
  
  // Send the actual file
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`❌ Error sending file: ${err.message}`);
      res.status(500).json({ error: 'Download failed' });
    } else {
      console.log(`✅ File sent successfully: ${filename}`);
    }
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🏢 Cradle System Container running on port ${port}`);
});