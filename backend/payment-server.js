const express = require('express');
const crypto = require('crypto');
const cors = require('cors');
const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 虎皮椒支付配置（在环境变量中设置）
const PAYMENT_CONFIG = {
    appid: process.env.HUPIJIAO_APPID || 'YOUR_REAL_APPID',
    appSecret: process.env.HUPIJIAO_SECRET || 'YOUR_REAL_SECRET',
    apiUrl: 'https://api.xunhupay.com/payment/do.html',
    notifyUrl: process.env.PAYMENT_NOTIFY_URL || 'https://your-api-domain.onrender.com/api/payment/notify'
};

// 存储订单状态（生产环境应使用数据库）
const orders = new Map();

// MD5签名函数
function md5(str) {
    return crypto.createHash('md5').update(str).digest('hex');
}

// 生成支付签名
function generateSignature(params, appSecret) {
    const sortedParams = Object.keys(params)
        .filter(key => params[key] !== '' && params[key] !== null && params[key] !== undefined && key !== 'hash')
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('&');

    const stringSignTemp = sortedParams + appSecret;
    return md5(stringSignTemp);
}

// 生成订单号
function generateOrderId() {
    return 'SMS_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
}

// 创建支付订单
app.post('/api/payment/create', async (req, res) => {
    try {
        const { amount, title, description, smsCount, userId } = req.body;

        // 验证参数
        if (!amount || !title || !smsCount || !userId) {
            return res.json({
                success: false,
                error: '参数不完整'
            });
        }

        const orderId = generateOrderId();
        const timestamp = Math.floor(Date.now() / 1000);

        // 构建支付参数
        const paymentParams = {
            version: '1.1',
            appid: PAYMENT_CONFIG.appid,
            trade_order_id: orderId,
            total_fee: amount.toFixed(2),
            title: title,
            time: timestamp,
            notify_url: PAYMENT_CONFIG.notifyUrl,
            nonce_str: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
            type: 'WAP',
            wap_url: req.headers.origin || 'https://yourdomain.com',
            wap_name: '短信群发应用'
        };

        // 生成签名
        const hash = generateSignature(paymentParams, PAYMENT_CONFIG.appSecret);
        paymentParams.hash = hash;

        // 构建支付URL
        const formData = new URLSearchParams(paymentParams);
        const paymentUrl = `${PAYMENT_CONFIG.apiUrl}?${formData.toString()}`;

        // 保存订单信息
        orders.set(orderId, {
            orderId,
            userId,
            amount,
            title,
            smsCount,
            status: 'pending',
            createdAt: new Date().toISOString(),
            paymentParams
        });

        console.log('创建支付订单:', {
            orderId,
            amount,
            userId,
            paymentUrl: paymentUrl.substring(0, 100) + '...'
        });

        res.json({
            success: true,
            orderId,
            paymentUrl,
            message: '支付订单创建成功'
        });

    } catch (error) {
        console.error('创建支付订单失败:', error);
        res.json({
            success: false,
            error: '服务器内部错误'
        });
    }
});

// 查询支付状态
app.get('/api/payment/status/:orderId', (req, res) => {
    const { orderId } = req.params;
    const order = orders.get(orderId);

    if (!order) {
        return res.json({
            success: false,
            error: '订单不存在'
        });
    }

    res.json({
        success: true,
        orderId,
        status: order.status,
        amount: order.amount,
        smsCount: order.smsCount
    });
});

// 支付回调处理
app.post('/api/payment/notify', (req, res) => {
    try {
        console.log('收到支付回调:', req.body);

        const { trade_order_id, total_fee, transaction_id, hash, status } = req.body;

        // 验证签名
        const calculatedHash = generateSignature(req.body, PAYMENT_CONFIG.appSecret);

        if (hash !== calculatedHash) {
            console.error('支付回调签名验证失败');
            return res.send('fail');
        }

        // 查找订单
        const order = orders.get(trade_order_id);
        if (!order) {
            console.error('订单不存在:', trade_order_id);
            return res.send('fail');
        }

        // 验证金额
        if (parseFloat(total_fee) !== order.amount) {
            console.error('金额不匹配:', { received: total_fee, expected: order.amount });
            return res.send('fail');
        }

        // 更新订单状态
        if (status === 'OD') {
            order.status = 'paid';
            order.transactionId = transaction_id;
            order.paidAt = new Date().toISOString();

            console.log('支付成功:', {
                orderId: trade_order_id,
                amount: total_fee,
                transactionId: transaction_id
            });

            // 这里可以添加：
            // 1. 更新数据库中的用户余额
            // 2. 发送邮件通知
            // 3. 其他业务逻辑

        } else {
            order.status = 'failed';
            console.log('支付失败:', trade_order_id);
        }

        res.send('success');

    } catch (error) {
        console.error('处理支付回调失败:', error);
        res.send('fail');
    }
});

// 测试接口
app.get('/api/test', (req, res) => {
    res.json({
        message: '支付API服务正常运行',
        timestamp: new Date().toISOString(),
        config: {
            appid: PAYMENT_CONFIG.appid.substring(0, 8) + '***',
            hasSecret: !!PAYMENT_CONFIG.appSecret && PAYMENT_CONFIG.appSecret !== 'YOUR_REAL_SECRET'
        }
    });
});

// 错误处理
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        success: false,
        error: '服务器内部错误'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`支付API服务器运行在端口 ${PORT}`);
    console.log(`测试地址: http://localhost:${PORT}/api/test`);

    if (PAYMENT_CONFIG.appid === 'YOUR_REAL_APPID') {
        console.warn('⚠️  警告: 请设置真实的虎皮椒APPID和密钥');
    }
});

module.exports = app;