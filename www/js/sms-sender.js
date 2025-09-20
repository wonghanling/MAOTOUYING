// 原生短信发送功能
class SMSSender {
    constructor() {
        this.isAndroid = /Android/i.test(navigator.userAgent);
        this.isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        this.init();
    }

    init() {
        console.log('SMS发送器初始化完成');
        console.log('设备类型:', this.isAndroid ? 'Android' : this.isIOS ? 'iOS' : '其他');
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

            // 尝试不同的发送方法
            const result = await this.attemptSMSSend(cleanPhone, message);

            console.log(`短信发送成功: ${cleanPhone}`);
            return {
                success: true,
                phone: cleanPhone,
                message: message,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('短信发送失败:', error);
            return {
                success: false,
                phone: phoneNumber,
                message: message,
                error: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }

    // 批量发送短信
    async sendBulkSMS(phoneNumbers, message, onProgress = null) {
        const results = [];
        const total = phoneNumbers.length;

        console.log(`开始批量发送短信，共 ${total} 个号码`);

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

            // 添加延迟避免发送过快
            if (i < phoneNumbers.length - 1) {
                await this.delay(500); // 500ms延迟
            }
        }

        const successCount = results.filter(r => r.success).length;
        console.log(`批量发送完成: ${successCount}/${total} 成功`);

        return {
            total: total,
            success: successCount,
            failed: total - successCount,
            results: results
        };
    }

    // 尝试发送短信的核心方法
    async attemptSMSSend(phoneNumber, message) {
        // 方法1: 使用 sms: 协议打开短信应用
        if (this.isAndroid || this.isIOS) {
            return this.openSMSApp(phoneNumber, message);
        }

        // 方法2: 尝试使用 Web Share API
        if (navigator.share) {
            return this.shareViaSMS(phoneNumber, message);
        }

        // 方法3: 使用 mailto 作为备选（某些设备可能支持）
        return this.fallbackMethod(phoneNumber, message);
    }

    // 打开系统短信应用
    openSMSApp(phoneNumber, message) {
        return new Promise((resolve, reject) => {
            try {
                // 构建短信URL
                const encodedMessage = encodeURIComponent(message);
                const smsUrl = `sms:${phoneNumber}?body=${encodedMessage}`;

                console.log('打开短信应用:', smsUrl);

                // 创建隐藏的链接并点击
                const link = document.createElement('a');
                link.href = smsUrl;
                link.style.display = 'none';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // 给用户一些时间操作
                setTimeout(() => {
                    resolve('SMS应用已打开');
                }, 1000);

            } catch (error) {
                reject(error);
            }
        });
    }

    // 使用Web Share API分享
    async shareViaSMS(phoneNumber, message) {
        try {
            const shareData = {
                title: '短信消息',
                text: `发送给 ${phoneNumber}: ${message}`
            };

            await navigator.share(shareData);
            return 'Share API调用成功';
        } catch (error) {
            throw new Error('Share API不可用');
        }
    }

    // 备选方法
    fallbackMethod(phoneNumber, message) {
        return new Promise((resolve, reject) => {
            try {
                // 显示操作提示
                this.showSMSInstructions(phoneNumber, message);
                resolve('已显示发送指引');
            } catch (error) {
                reject(error);
            }
        });
    }

    // 显示短信发送指引
    showSMSInstructions(phoneNumber, message) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-xl p-6 max-w-sm w-full">
                <h3 class="text-lg font-bold text-gray-900 mb-4">📱 发送短信</h3>
                <div class="space-y-3 mb-4">
                    <div>
                        <div class="text-sm font-medium text-gray-700">收件人:</div>
                        <div class="text-blue-600 font-mono">${phoneNumber}</div>
                    </div>
                    <div>
                        <div class="text-sm font-medium text-gray-700">消息内容:</div>
                        <div class="text-gray-800 p-2 bg-gray-50 rounded text-sm">${message}</div>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button id="copy-phone" class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                        复制号码
                    </button>
                    <button id="copy-message" class="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm">
                        复制消息
                    </button>
                </div>
                <button class="w-full mt-2 bg-gray-600 text-white px-4 py-2 rounded-lg text-sm" onclick="this.closest('.fixed').remove()">
                    关闭
                </button>
            </div>
        `;

        // 添加复制功能
        modal.querySelector('#copy-phone').addEventListener('click', () => {
            navigator.clipboard.writeText(phoneNumber);
            this.showToast('号码已复制');
        });

        modal.querySelector('#copy-message').addEventListener('click', () => {
            navigator.clipboard.writeText(message);
            this.showToast('消息已复制');
        });

        document.body.appendChild(modal);

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
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
            lastSent: null
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
        localStorage.setItem('sms_stats', JSON.stringify(stats));
    }
}

// 创建全局实例
window.smsSender = new SMSSender();

// 导出给其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SMSSender;
}