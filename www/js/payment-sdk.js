// 虎皮椒支付SDK - 前端版本
class HupijiaoPay {
    constructor(config = {}) {
        // 这些配置将在部署时通过环境变量或配置文件设置
        this.config = {
            appid: config.appid || 'YOUR_APPID', // 虎皮椒APPID
            appSecret: config.appSecret || 'YOUR_APP_SECRET', // 虎皮椒密钥
            apiUrl: 'https://api.xunhupay.com/payment/do.html',
            notifyUrl: config.notifyUrl || '', // 支付回调地址
            ...config
        };
    }

    // MD5哈希函数 (简单实现)
    md5(str) {
        // 注意：这里需要引入MD5库，或者使用服务端计算签名
        // 为了安全考虑，建议在服务端计算签名
        return this.simpleMd5(str);
    }

    // 简单的MD5实现（生产环境建议使用专业库）
    simpleMd5(str) {
        // 这里使用crypto-js库的MD5，需要先引入
        // 或者调用后端API来计算签名
        return btoa(str).replace(/=/g, ''); // 临时实现
    }

    // 生成签名
    getHash(params, appSecret) {
        const sortedParams = Object.keys(params)
            .filter(key => params[key] && key !== 'hash') // 过滤掉空值和hash本身
            .sort()
            .map(key => `${key}=${params[key]}`)
            .join('&');

        const stringSignTemp = sortedParams + appSecret;
        const hash = this.md5(stringSignTemp);
        return hash;
    }

    // 生成随机字符串
    generateNonce() {
        return Date.now().toString(16).slice(0, 6) + '-' + Math.random().toString(16).slice(2, 8);
    }

    // 生成订单号
    generateOrderId() {
        return 'SMS_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // 获取当前时间戳
    nowDate() {
        return Math.floor(new Date().valueOf() / 1000);
    }

    // 发起支付
    async createPayment(options) {
        const orderId = this.generateOrderId();

        const params = {
            version: '1.1',
            appid: this.config.appid,
            trade_order_id: orderId,
            total_fee: options.amount, // 金额，最多两位小数
            title: options.title || '短信充值',
            time: this.nowDate(),
            notify_url: this.config.notifyUrl,
            nonce_str: this.generateNonce(),
            type: 'WAP', // 手机网页支付
            wap_url: window.location.origin,
            wap_name: '短信群发应用'
        };

        // 生成签名
        const hash = this.getHash(params, this.config.appSecret);

        // 构建请求参数
        const requestParams = {
            ...params,
            hash
        };

        try {
            // 由于前端跨域限制，这里需要通过后端代理或JSONP
            // 实际部署时，建议在后端处理支付请求
            const response = await this.makePaymentRequest(requestParams);

            return {
                success: true,
                orderId: orderId,
                paymentUrl: response.url,
                data: response
            };
        } catch (error) {
            console.error('支付请求失败:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 发送支付请求（需要后端支持）
    async makePaymentRequest(params) {
        // 方案1：直接跳转到支付页面（推荐）
        const formData = new URLSearchParams(params);
        const paymentUrl = `${this.config.apiUrl}?${formData.toString()}`;

        // 打开支付页面
        window.open(paymentUrl, '_blank');

        return { url: paymentUrl };

        // 方案2：通过后端代理（更安全）
        // const response = await fetch('/api/payment/create', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(params)
        // });
        // return response.json();
    }

    // 验证支付回调（后端使用）
    verifyCallback(data) {
        const hash = this.getHash(data, this.config.appSecret);
        return hash === data.hash;
    }

    // 处理支付成功回调
    onPaymentSuccess(callback) {
        // 监听页面消息或轮询订单状态
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'payment_success') {
                callback(event.data);
            }
        });
    }

    // 固定的三个充值套餐
    getRechargePackages() {
        return [
            {
                id: 1,
                smsCount: 100,
                amount: 3,
                title: '基础套餐',
                description: '100条短信',
                unitPrice: '3分/条'
            },
            {
                id: 2,
                smsCount: 1000,
                amount: 30,
                title: '标准套餐',
                description: '1000条短信',
                unitPrice: '3分/条'
            },
            {
                id: 3,
                smsCount: 10000,
                amount: 300,
                title: '企业套餐',
                description: '10000条短信',
                unitPrice: '3分/条'
            }
        ];
    }
}

// 导出供其他模块使用
window.HupijiaoPay = HupijiaoPay;