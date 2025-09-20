// 虎皮椒支付SDK - 移动端优化版本
class HupijiaoPay {
    constructor(config = {}) {
        this.config = {
            appid: config.appid || 'YOUR_APPID',
            appSecret: config.appSecret || 'YOUR_SECRET',
            apiUrl: 'https://api.xunhupay.com/payment/do.html',
            notifyUrl: config.notifyUrl || '',
            ...config
        };

        // 加载MD5库
        this.loadMD5Library();
    }

    // 动态加载MD5库
    async loadMD5Library() {
        if (window.CryptoJS) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/crypto-js.min.js';
            script.onload = () => {
                console.log('MD5库加载成功');
                resolve();
            };
            script.onerror = () => {
                console.warn('MD5库加载失败，使用备用方法');
                resolve(); // 即使失败也继续，使用备用MD5
            };
            document.head.appendChild(script);
        });
    }

    // MD5哈希函数
    md5(str) {
        if (window.CryptoJS && window.CryptoJS.MD5) {
            return window.CryptoJS.MD5(str).toString();
        } else {
            // 备用简单MD5实现
            return this.simpleMd5(str);
        }
    }

    // 简单MD5实现（用于备用）
    simpleMd5(str) {
        let hash = 0;
        if (str.length === 0) return hash.toString();

        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 转换为32位整数
        }

        return Math.abs(hash).toString(16);
    }

    // 生成签名
    getHash(params, appSecret) {
        // 过滤掉空值和hash本身，然后按键名排序
        const sortedParams = Object.keys(params)
            .filter(key => params[key] !== '' && params[key] !== null && params[key] !== undefined && key !== 'hash')
            .sort()
            .map(key => `${key}=${params[key]}`)
            .join('&');

        const stringSignTemp = sortedParams + appSecret;
        console.log('签名字符串:', stringSignTemp);

        const hash = this.md5(stringSignTemp);
        console.log('生成的签名:', hash);

        return hash;
    }

    // 生成随机字符串
    generateNonce() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }

    // 生成订单号
    generateOrderId() {
        return 'SMS_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
    }

    // 获取当前时间戳
    nowDate() {
        return Math.floor(Date.now() / 1000);
    }

    // 发起支付
    async createPayment(options) {
        console.log('开始创建支付订单:', options);

        // 等待MD5库加载
        await this.loadMD5Library();

        const orderId = this.generateOrderId();
        const timestamp = this.nowDate();

        const params = {
            version: '1.1',
            appid: this.config.appid,
            trade_order_id: orderId,
            total_fee: options.amount.toFixed(2), // 确保是两位小数
            title: options.title || '短信充值',
            time: timestamp,
            notify_url: this.config.notifyUrl,
            nonce_str: this.generateNonce(),
            type: 'WAP', // 手机网页支付
            wap_url: window.location.origin,
            wap_name: '短信群发应用'
        };

        console.log('支付参数:', params);

        // 生成签名
        const hash = this.getHash(params, this.config.appSecret);
        params.hash = hash;

        try {
            const response = await this.makePaymentRequest(params);

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
                error: error.message || '支付请求失败'
            };
        }
    }

    // 发送支付请求
    async makePaymentRequest(params) {
        console.log('发送支付请求:', params);

        // 检查是否为测试环境
        if (this.config.appid === 'YOUR_APPID' || this.config.appSecret === 'YOUR_SECRET') {
            console.warn('使用测试配置，模拟支付流程');
            return this.simulatePayment(params);
        }

        // 构建支付URL
        const formData = new URLSearchParams(params);
        const paymentUrl = `${this.config.apiUrl}?${formData.toString()}`;

        console.log('支付URL:', paymentUrl);

        // 在移动端打开支付页面
        if (this.isMobileDevice()) {
            // 移动端直接跳转
            window.location.href = paymentUrl;
        } else {
            // 桌面端新窗口打开
            const paymentWindow = window.open(paymentUrl, '_blank', 'width=800,height=600');

            if (!paymentWindow) {
                throw new Error('支付页面被浏览器拦截，请允许弹出窗口');
            }
        }

        return { url: paymentUrl };
    }

    // 模拟支付（测试用）
    async simulatePayment(params) {
        console.log('模拟支付流程');

        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 模拟支付成功，延迟3秒后回调
        setTimeout(() => {
            const mockData = {
                trade_order_id: params.trade_order_id,
                total_fee: params.total_fee,
                transaction_id: 'MOCK_' + Date.now(),
                status: 'OD'
            };

            // 触发支付成功事件
            window.dispatchEvent(new CustomEvent('paymentSuccess', {
                detail: mockData
            }));
        }, 3000);

        return {
            url: '#mock-payment',
            mockPayment: true
        };
    }

    // 检测是否为移动设备
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.screen.width <= 768;
    }

    // 验证支付回调
    verifyCallback(data) {
        const hash = this.getHash(data, this.config.appSecret);
        return hash === data.hash;
    }

    // 监听支付成功
    onPaymentSuccess(callback) {
        // 监听支付成功事件
        window.addEventListener('paymentSuccess', (event) => {
            console.log('支付成功回调:', event.detail);
            callback(event.detail);
        });

        // 监听页面消息（用于跨窗口通信）
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'payment_success') {
                console.log('支付成功消息:', event.data);
                callback(event.data);
            }
        });

        // 监听页面焦点（用户可能从支付页面返回）
        window.addEventListener('focus', () => {
            console.log('页面重新获得焦点，检查支付状态');
            // 这里可以添加检查支付状态的逻辑
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