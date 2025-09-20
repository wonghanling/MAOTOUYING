// 支付配置管理
class PaymentConfig {
    constructor() {
        // 支付配置（生产环境需要替换为真实配置）
        this.config = {
            // 虎皮椒支付配置
            hupijiaoConfig: {
                enabled: true,
                appid: 'YOUR_HUPIJIOA_APPID', // 需要替换为真实的虎皮椒APPID
                appSecret: 'YOUR_HUPIJIOA_SECRET', // 需要替换为真实的密钥
                apiUrl: 'https://api.xunhupay.com/payment/do.html',
                notifyUrl: `${window.location.origin}/api/payment/notify`
            },

            // 微信支付配置
            wechatConfig: {
                enabled: false,
                appId: 'YOUR_WECHAT_APPID',
                mchId: 'YOUR_MCH_ID'
            },

            // 支付宝配置
            alipayConfig: {
                enabled: false,
                appId: 'YOUR_ALIPAY_APPID'
            },

            // 测试模式配置
            testMode: {
                enabled: true, // 开发阶段启用测试模式
                mockPayment: true
            }
        };
    }

    // 获取支付配置
    getPaymentConfig() {
        return this.config;
    }

    // 获取虎皮椒配置
    getHupijiaoConfig() {
        return this.config.hupijiaoConfig;
    }

    // 是否启用测试模式
    isTestMode() {
        return this.config.testMode.enabled;
    }

    // 设置虎皮椒配置
    setHupijiaoConfig(appid, appSecret) {
        this.config.hupijiaoConfig.appid = appid;
        this.config.hupijiaoConfig.appSecret = appSecret;
        this.config.hupijiaoConfig.enabled = true;
    }

    // 验证配置
    validateConfig() {
        const hupijiaoConfig = this.config.hupijiaoConfig;

        if (hupijiaoConfig.enabled) {
            if (!hupijiaoConfig.appid || hupijiaoConfig.appid === 'YOUR_HUPIJIOA_APPID') {
                console.warn('虎皮椒APPID未配置，将使用测试模式');
                return false;
            }

            if (!hupijiaoConfig.appSecret || hupijiaoConfig.appSecret === 'YOUR_HUPIJIOA_SECRET') {
                console.warn('虎皮椒密钥未配置，将使用测试模式');
                return false;
            }
        }

        return true;
    }
}

// 支付处理器
class PaymentProcessor {
    constructor() {
        this.paymentConfig = new PaymentConfig();
        this.hupijiaoSDK = null;
        this.init();
    }

    init() {
        const config = this.paymentConfig.getHupijiaoConfig();

        if (config.enabled) {
            // 初始化虎皮椒SDK
            this.hupijiaoSDK = new HupijiaoPay(config);
        }
    }

    // 获取可用的支付方式
    getAvailablePaymentMethods() {
        const methods = [];
        const config = this.paymentConfig.getPaymentConfig();

        if (config.hupijiaoConfig.enabled) {
            methods.push({
                id: 'hupijioa',
                name: '虎皮椒支付',
                description: '支持微信、支付宝等多种支付方式',
                icon: 'payment'
            });
        }

        if (config.testMode.enabled) {
            methods.push({
                id: 'test',
                name: '测试支付',
                description: '仅用于开发测试',
                icon: 'science'
            });
        }

        return methods;
    }

    // 创建支付订单
    async createPayment(paymentMethod, orderData) {
        console.log('创建支付订单:', paymentMethod, orderData);

        switch (paymentMethod) {
            case 'hupijioa':
                return await this.createHupijiaoPayment(orderData);
            case 'test':
                return await this.createTestPayment(orderData);
            default:
                throw new Error('不支持的支付方式');
        }
    }

    // 创建虎皮椒支付
    async createHupijiaoPayment(orderData) {
        if (!this.hupijiaoSDK) {
            throw new Error('虎皮椒SDK未初始化');
        }

        if (!this.paymentConfig.validateConfig()) {
            throw new Error('支付配置无效，请检查APPID和密钥');
        }

        return await this.hupijiaoSDK.createPayment(orderData);
    }

    // 创建测试支付
    async createTestPayment(orderData) {
        // 模拟支付延迟
        await new Promise(resolve => setTimeout(resolve, 1000));

        const orderId = 'TEST_' + Date.now();

        // 模拟支付成功
        return {
            success: true,
            orderId: orderId,
            paymentUrl: '#test-payment',
            testMode: true,
            data: {
                orderId: orderId,
                amount: orderData.amount,
                title: orderData.title
            }
        };
    }

    // 处理支付回调
    handlePaymentCallback(paymentMethod, callbackData) {
        switch (paymentMethod) {
            case 'hupijioa':
                return this.handleHupijiaoCallback(callbackData);
            case 'test':
                return this.handleTestCallback(callbackData);
            default:
                return false;
        }
    }

    // 处理虎皮椒回调
    handleHupijiaoCallback(callbackData) {
        if (!this.hupijiaoSDK) {
            return false;
        }

        return this.hupijiaoSDK.verifyCallback(callbackData);
    }

    // 处理测试回调
    handleTestCallback(callbackData) {
        // 测试模式下总是返回成功
        return true;
    }
}

// 导出到全局
window.PaymentConfig = PaymentConfig;
window.PaymentProcessor = PaymentProcessor;