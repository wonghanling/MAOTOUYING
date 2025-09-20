// Capacitor SMS插件初始化
window.capacitorSMS = {
    // 发送短信
    send: async function(options) {
        return new Promise((resolve, reject) => {
            try {
                if (window.Capacitor && window.Capacitor.isNativePlatform()) {
                    // 原生环境：调用Android SMS API
                    if (window.Android && window.Android.sendSMS) {
                        const result = window.Android.sendSMS(
                            JSON.stringify({
                                numbers: options.numbers,
                                text: options.text
                            })
                        );
                        resolve(JSON.parse(result));
                    } else {
                        reject(new Error('原生SMS接口未找到'));
                    }
                } else {
                    // Web环境：使用sms协议
                    const phone = options.numbers[0];
                    const message = options.text;
                    const smsUrl = `sms:${phone}?body=${encodeURIComponent(message)}`;

                    const link = document.createElement('a');
                    link.href = smsUrl;
                    link.style.display = 'none';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);

                    resolve({ success: true, method: 'web' });
                }
            } catch (error) {
                reject(error);
            }
        });
    },

    // 检查权限
    checkPermissions: async function() {
        return new Promise((resolve) => {
            if (window.Capacitor && window.Capacitor.isNativePlatform()) {
                if (window.Android && window.Android.checkSMSPermission) {
                    const result = window.Android.checkSMSPermission();
                    resolve(JSON.parse(result));
                } else {
                    resolve({ granted: false });
                }
            } else {
                resolve({ granted: true, message: 'Web环境不需要权限' });
            }
        });
    },

    // 请求权限
    requestPermissions: async function() {
        return new Promise((resolve) => {
            if (window.Capacitor && window.Capacitor.isNativePlatform()) {
                if (window.Android && window.Android.requestSMSPermission) {
                    const result = window.Android.requestSMSPermission();
                    resolve(JSON.parse(result));
                } else {
                    resolve({ granted: false });
                }
            } else {
                resolve({ granted: true, message: 'Web环境不需要权限' });
            }
        });
    }
};

console.log('Capacitor SMS插件已加载');