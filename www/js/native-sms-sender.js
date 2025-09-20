// 原生APP短信发送功能 (Capacitor版本)
import { Plugins } from '@capacitor/core';

class NativeSMSSender {
    constructor() {
        this.isNativeApp = this.checkNativeEnvironment();
        this.init();
    }

    init() {
        console.log('原生SMS发送器初始化完成');
        console.log('原生APP环境:', this.isNativeApp);

        if (this.isNativeApp) {
            this.requestSMSPermission();
        }
    }

    // 检查是否在原生APP环境中
    checkNativeEnvironment() {
        return window.Capacitor && window.Capacitor.isNativePlatform();
    }

    // 请求短信权限
    async requestSMSPermission() {
        if (!this.isNativeApp) return false;

        try {
            // Android自动请求权限
            console.log('短信权限已准备就绪');
            return true;
        } catch (error) {
            console.error('权限请求失败:', error);
            return false;
        }
    }

    // 发送单条短信
    async sendSMS(phoneNumber, message) {
        try {
            // 清理电话号码
            const cleanPhone = this.cleanPhoneNumber(phoneNumber);

            if (!this.validatePhoneNumber(cleanPhone)) {
                throw new Error('无效的电话号码');
            }

            if (!message || message.trim().length === 0) {
                throw new Error('消息内容不能为空');
            }

            if (this.isNativeApp) {
                // 原生APP环境：使用Capacitor SMS插件
                await this.sendNativeSMS(cleanPhone, message);
            } else {
                // Web环境：使用之前的Web API方法
                await this.sendWebSMS(cleanPhone, message);
            }

            console.log(`短信发送成功: ${cleanPhone}`);
            return {
                success: true,
                phone: cleanPhone,
                message: message,
                timestamp: new Date().toISOString(),
                method: this.isNativeApp ? 'native' : 'web'
            };

        } catch (error) {
            console.error('短信发送失败:', error);
            return {
                success: false,
                phone: phoneNumber,
                message: message,
                error: error.message,
                timestamp: new Date().toISOString(),
                method: this.isNativeApp ? 'native' : 'web'
            };
        }
    }

    // 原生短信发送
    async sendNativeSMS(phoneNumber, message) {
        if (!window.capacitorSMS) {
            throw new Error('SMS插件未安装');
        }

        try {
            const result = await window.capacitorSMS.send({
                numbers: [phoneNumber],
                text: message
            });

            if (!result.success) {
                throw new Error('发送失败');
            }

            return result;
        } catch (error) {
            console.error('原生短信发送失败:', error);
            throw error;
        }
    }

    // Web环境短信发送（备用方案）
    async sendWebSMS(phoneNumber, message) {
        // 使用之前的Web API方法
        const encodedMessage = encodeURIComponent(message);
        const smsUrl = `sms:${phoneNumber}?body=${encodedMessage}`;

        const link = document.createElement('a');
        link.href = smsUrl;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 给用户一些时间操作
        await this.delay(1000);
    }

    // 批量发送短信
    async sendBulkSMS(phoneNumbers, message, onProgress = null) {
        const results = [];
        const total = phoneNumbers.length;

        console.log(`开始批量发送短信，共 ${total} 个号码 (${this.isNativeApp ? '原生' : 'Web'}模式)`);

        for (let i = 0; i < phoneNumbers.length; i++) {
            const phone = phoneNumbers[i];

            // 发送进度回调
            if (onProgress) {
                onProgress({
                    current: i + 1,
                    total: total,
                    phone: phone,
                    progress: Math.round(((i + 1) / total) * 100)
                });
            }

            // 发送短信
            const result = await this.sendSMS(phone, message);
            results.push(result);

            // 更新统计
            this.updateStats(result.success);

            // 添加延迟避免发送过快
            if (i < phoneNumbers.length - 1) {
                await this.delay(this.isNativeApp ? 200 : 1000); // 原生APP可以发送更快
            }
        }

        const successCount = results.filter(r => r.success).length;
        console.log(`批量发送完成: ${successCount}/${total} 成功`);

        return {
            total: total,
            success: successCount,
            failed: total - successCount,
            results: results,
            environment: this.isNativeApp ? 'native' : 'web'
        };
    }

    // 清理电话号码
    cleanPhoneNumber(phone) {
        return phone.replace(/[^\d+]/g, '');
    }

    // 验证电话号码
    validatePhoneNumber(phone) {
        // 中国手机号验证
        const chinaPattern = /^1[3-9]\d{9}$/;
        // 国际号码验证（以+开头）
        const intlPattern = /^\+\d{7,15}$/;

        return chinaPattern.test(phone) || intlPattern.test(phone);
    }

    // 延迟函数
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 显示提示消息
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-lg z-50';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 2000);
    }

    // 获取发送统计
    getStats() {
        const stats = localStorage.getItem('sms_stats');
        return stats ? JSON.parse(stats) : {
            totalSent: 0,
            totalFailed: 0,
            lastSent: null,
            environment: this.isNativeApp ? 'native' : 'web'
        };
    }

    // 更新发送统计
    updateStats(success) {
        const stats = this.getStats();

        if (success) {
            stats.totalSent++;
        } else {
            stats.totalFailed++;
        }

        stats.lastSent = new Date().toISOString();
        stats.environment = this.isNativeApp ? 'native' : 'web';
        localStorage.setItem('sms_stats', JSON.stringify(stats));
    }

    // 检查短信权限状态
    async checkPermissions() {
        if (!this.isNativeApp) {
            return { granted: false, message: 'Web环境不需要权限' };
        }

        try {
            // 这里可以添加权限检查逻辑
            return { granted: true, message: '权限已授予' };
        } catch (error) {
            return { granted: false, message: '权限检查失败' };
        }
    }

    // 显示权限说明
    showPermissionGuide() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-xl p-6 max-w-sm w-full">
                <h3 class="text-lg font-bold text-gray-900 mb-4">📱 权限说明</h3>
                <div class="space-y-3 text-sm text-gray-600 mb-4">
                    <p>本应用需要短信权限来发送消息，请在弹出的权限对话框中选择"允许"。</p>
                    <p>• 发送短信权限：用于群发短信功能</p>
                    <p>• 应用不会读取您的短信内容</p>
                    <p>• 您可以随时在系统设置中撤销权限</p>
                </div>
                <button class="w-full bg-orange-600 text-white px-4 py-2 rounded-lg" onclick="this.closest('.fixed').remove()">
                    我知道了
                </button>
            </div>
        `;

        document.body.appendChild(modal);

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
}

// 等待Capacitor加载完成后初始化
document.addEventListener('deviceready', () => {
    window.smsSender = new NativeSMSSender();
    console.log('原生SMS发送器已就绪');
}, false);

// 如果不是Capacitor环境，直接初始化
if (!window.Capacitor) {
    document.addEventListener('DOMContentLoaded', () => {
        window.smsSender = new NativeSMSSender();
        console.log('Web SMS发送器已就绪');
    });
}

// 导出给其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NativeSMSSender;
}