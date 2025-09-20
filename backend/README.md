# SMS支付API服务

## 本地开发
```bash
cd backend
npm install
npm start
```

## 部署到Render

### 1. 在Render创建新的Web Service
- 连接GitHub仓库
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

### 2. 设置环境变量
```
HUPIJIAO_APPID=你的虎皮椒APPID
HUPIJIAO_SECRET=你的虎皮椒密钥
PAYMENT_NOTIFY_URL=https://your-api-domain.onrender.com/api/payment/notify
```

### 3. API接口

#### 创建支付订单
```
POST /api/payment/create
Content-Type: application/json

{
  "amount": 30,
  "title": "充值1000条短信",
  "description": "标准套餐",
  "smsCount": 1000,
  "userId": "user123"
}
```

#### 查询支付状态
```
GET /api/payment/status/:orderId
```

#### 支付回调（虎皮椒回调）
```
POST /api/payment/notify
```

### 4. APP端配置
部署后，修改APP代码中的API_BASE_URL：
```javascript
const API_BASE_URL = 'https://your-actual-api.onrender.com';
```