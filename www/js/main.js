// 猫头鹰邮信短信群发平台 - 主要交互逻辑
class SmsApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.addLoadingAnimations();
        this.initSmoothScroll();
    }

    // 设置事件监听器
    setupEventListeners() {
        // 免费试用按钮
        const freeTrialBtn = document.getElementById('free-trial-btn');
        if (freeTrialBtn) {
            freeTrialBtn.addEventListener('click', this.handleFreeTrial.bind(this));
        }

        // 查看套餐按钮
        const pricingBtn = document.getElementById('pricing-btn');
        if (pricingBtn) {
            pricingBtn.addEventListener('click', this.handlePricing.bind(this));
        }

        // 登录链接
        const loginLinks = document.querySelectorAll('a[href="#"]');
        loginLinks.forEach(link => {
            if (link.textContent.includes('登录')) {
                link.addEventListener('click', this.handleLogin.bind(this));
            }
        });
    }

    // 处理免费试用
    handleFreeTrial(e) {
        e.preventDefault();
        console.log('启动免费试用流程');

        // 添加按钮加载状态
        const btn = e.target.closest('button');
        this.setButtonLoading(btn, true);

        // 模拟API调用
        setTimeout(() => {
            this.setButtonLoading(btn, false);
            // 这里将来跳转到注册页面
            alert('跳转到免费试用注册页面');
        }, 1500);
    }

    // 处理查看套餐
    handlePricing(e) {
        e.preventDefault();
        console.log('查看套餐价格');
        // 这里将来跳转到套餐页面
        alert('跳转到套餐价格页面');
    }

    // 处理登录
    handleLogin(e) {
        e.preventDefault();
        console.log('用户登录');
        // 这里将来跳转到登录表单页面
        alert('跳转到登录表单页面');
    }

    // 设置按钮加载状态
    setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.style.opacity = '0.7';
            const originalText = button.innerHTML;
            button.dataset.originalText = originalText;
            button.innerHTML = '<span class="material-symbols-outlined animate-spin">refresh</span> 加载中...';
        } else {
            button.disabled = false;
            button.style.opacity = '1';
            button.innerHTML = button.dataset.originalText;
        }
    }

    // 添加加载动画
    addLoadingAnimations() {
        const elements = document.querySelectorAll('h1, p, button');
        elements.forEach((el, index) => {
            el.classList.add('loading');
            el.style.animationDelay = `${index * 0.2}s`;
        });
    }

    // 初始化平滑滚动
    initSmoothScroll() {
        document.documentElement.classList.add('smooth-scroll');
    }

    // 表单验证工具
    validatePhone(phone) {
        const phoneRegex = /^1[3-9]\d{9}$/;
        return phoneRegex.test(phone);
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // 显示通知消息
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg text-white max-w-sm ${
            type === 'success' ? 'bg-green-500' :
            type === 'error' ? 'bg-red-500' :
            'bg-blue-500'
        }`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // 自动移除
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.smsApp = new SmsApp();
});

// 导出给其他页面使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmsApp;
}