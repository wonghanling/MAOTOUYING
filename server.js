const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'www')));

// 设置正确的MIME类型
app.use((req, res, next) => {
  // 设置PWA相关的MIME类型
  if (req.url.endsWith('.webmanifest') || req.url.endsWith('manifest.json')) {
    res.setHeader('Content-Type', 'application/manifest+json');
  }
  if (req.url.endsWith('.js')) {
    res.setHeader('Content-Type', 'application/javascript');
  }
  if (req.url.endsWith('.css')) {
    res.setHeader('Content-Type', 'text/css');
  }

  // 设置HTTPS重定向头（Render会处理HTTPS）
  res.setHeader('X-Forwarded-Proto', 'https');

  next();
});

// 处理所有路由，返回index.html（SPA支持）
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'www', 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 猫头鹰邮信SMS应用运行在端口 ${PORT}`);
  console.log(`📱 PWA功能已启用`);
  console.log(`🔗 访问地址: http://localhost:${PORT}`);
});

// 优雅关闭处理
process.on('SIGTERM', () => {
  console.log('🛑 收到SIGTERM信号，正在关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 收到SIGINT信号，正在关闭服务器...');
  process.exit(0);
});