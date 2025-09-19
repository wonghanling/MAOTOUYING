# 🦉 猫头鹰邮信短信群发 PWA

一站式企业短信群发服务平台，支持PWA安装，可离线使用。

## 🚀 快速开始

### 本地开发
```bash
npm install
npm run dev
```

### 生产部署
```bash
npm start
```

## 📱 PWA功能

- ✅ 可安装到桌面/主屏幕
- ✅ 离线缓存支持
- ✅ 推送通知
- ✅ 原生应用体验

## 🌐 Render部署说明

1. 将代码推送到GitHub
2. 在Render中连接你的仓库
3. 选择"Web Service"
4. 构建命令：`npm install`
5. 启动命令：`npm start`
6. 自动部署完成

## 📂 项目结构

```
sms-messenger/
├── www/                 # 前端静态文件
│   ├── index.html      # 主页面
│   ├── manifest.json   # PWA配置
│   ├── sw.js          # Service Worker
│   ├── css/           # 样式文件
│   ├── js/            # JavaScript文件
│   ├── pages/         # 页面文件
│   └── icons/         # PWA图标
├── server.js           # Express服务器
├── package.json        # 依赖配置
└── README.md          # 项目说明
```

## 🔧 环境要求

- Node.js 14+
- NPM 6+

## 📱 支持的功能

- 📧 短信模板管理
- 👥 联系人分组管理
- 📊 发送统计分析
- 💰 充值和余额管理
- 🔔 消息推送通知

## 🛡️ 隐私和安全

本应用采用前端存储方案，所有数据保存在用户设备本地，确保隐私安全。