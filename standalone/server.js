const express = require('express');
const path = require('path');
const open = require('open');

const app = express();
const PORT = 4173;

// 提供静态文件
app.use(express.static(path.join(__dirname, '../web/dist')));

// 所有路由都返回index.html（支持前端路由）
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../web/dist/index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`\n✓ T8000 GUI 已启动！`);
  console.log(`✓ 网址: http://localhost:${PORT}`);
  console.log(`✓ 按 Ctrl+C 停止服务器\n`);
  
  // 自动打开浏览器
  open(`http://localhost:${PORT}`);
});
