const express = require('express');
const path = require('path');
const open = require('open');

const app = express();
const PORT = 3002;

// Serve static files from cloud/dist
app.use(express.static(path.join(__dirname, '../cloud/dist')));

// All routes return index.html (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../cloud/dist/index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✓ T8000 Cloud Platform Started!`);
  console.log(`✓ Local: http://localhost:${PORT}`);
  console.log(`✓ Network: http://0.0.0.0:${PORT}`);
  console.log(`✓ Press Ctrl+C to stop\n`);
  
  // Automatically open browser
  open(`http://localhost:${PORT}`);
});
