const express = require('express');
const path = require('path');
const open = require('open');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3001;

// 1) 先把 /api 转发到 T8000
app.use('/api', createProxyMiddleware({
  target: 'http://192.168.10.189:9000',
  changeOrigin: true,
  // 如果后端路径本来就有 /api，这里不需要 rewrite
  // pathRewrite: { '^/api': '/api' },
}));

// 2) 再 serve 静态文件
app.use(express.static(path.join(__dirname, '../embedded/dist')));

// 3) SPA fallback（必须放最后）
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../embedded/dist/index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✓ GUI Started!`);
  console.log(`✓ Local: http://localhost:${PORT}`);
  console.log(`✓ Network: http://192.168.10.164:${PORT}`);
  open(`http://localhost:${PORT}`);
});
