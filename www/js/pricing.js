// 价格页面专用交互逻辑
class PricingPage {
    constructor() {
        this.currentBilling = 'monthly'; // monthly | annual
        this.selectedPlan = null;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupBillingToggle();
        this.setupPlanButtons();
        this.setupFAQ();
        this.setupHeader();
        this.initPriceDisplay();
    }

    // 设置导航
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.switchTab(page);
            });
        });
    }

    // 切换标签页
    switchTab(page) {
        // 移除所有活跃状态
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            item.classList.remove('bg-primary-100', 'text-primary-600');
            item.classList.add('text-neutral-600');
        });

        // 添加新的活跃状态
        const activeItem = document.querySelector(`[data-page="${page}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
            activeItem.classList.add('bg-primary-100', 'text-primary-600');
            activeItem.classList.remove('text-neutral-600');
        }

        // 页面跳转逻辑
        this.handlePageNavigation(page);
    }

    // 处理页面导航
    handlePageNavigation(page) {
        switch(page) {
            case 'home':
                console.log('跳转到首页');
                // window.location.href = 'home.html';
                break;
            case 'features':
                console.log('跳转到功能页面');
                // window.location.href = 'features.html';
                break;
            case 'pricing':
                console.log('当前在价格页面');
                break;
            case 'about':
                console.log('跳转到关于页面');
                // window.location.href = 'about.html';
                break;
        }
    }

    // 设置计费周期切换
    setupBillingToggle() {
        const monthlyBtn = document.getElementById('monthly-btn');
        const annualBtn = document.getElementById('annual-btn');

        if (monthlyBtn) {
            monthlyBtn.addEventListener('click', () => {
                this.switchBilling('monthly');
            });
        }

        if (annualBtn) {
            annualBtn.addEventListener('click', () => {
                this.switchBilling('annual');
            });
        }
    }

    // 切换计费周期
    switchBilling(billing) {
        if (this.currentBilling === billing) return;

        this.currentBilling = billing;

        // 更新按钮状态
        const monthlyBtn = document.getElementById('monthly-btn');
        const annualBtn = document.getElementById('annual-btn');

        monthlyBtn?.classList.toggle('active', billing === 'monthly');
        annualBtn?.classList.toggle('active', billing === 'annual');

        // 更新价格显示
        this.updatePrices();

        // 更新说明文字
        this.updateBillingNotes();

        // 跟踪用户行为
        console.log(`用户切换到${billing === 'monthly' ? '月' : '年'}付`);
    }

    // 更新价格显示
    updatePrices() {
        const priceElements = document.querySelectorAll('.price');

        priceElements.forEach(priceEl => {
            const monthlyPrice = priceEl.dataset.monthly;
            const annualPrice = priceEl.dataset.annual;

            if (monthlyPrice && annualPrice) {
                const newPrice = this.currentBilling === 'monthly' ? monthlyPrice : annualPrice;

                // 添加更新动画
                priceEl.classList.add('updating');

                setTimeout(() => {
                    priceEl.textContent = `¥${newPrice}`;
                    priceEl.classList.remove('updating');
                }, 300);
            }
        });
    }

    // 更新计费说明
    updateBillingNotes() {
        const monthlyNotes = document.querySelectorAll('.monthly-note');
        const annualNotes = document.querySelectorAll('.annual-note');

        monthlyNotes.forEach(note => {
            note.classList.toggle('hidden', this.currentBilling !== 'monthly');
        });

        annualNotes.forEach(note => {
            note.classList.toggle('hidden', this.currentBilling !== 'annual');
        });
    }

    // 设置方案按钮
    setupPlanButtons() {
        const planButtons = document.querySelectorAll('.plan-btn');

        planButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const plan = button.dataset.plan;
                this.selectPlan(plan, button);
            });
        });
    }

    // 选择方案
    selectPlan(plan, button) {
        this.selectedPlan = plan;

        // 添加加载状态
        this.setButtonLoading(button, true);

        // 模拟API调用
        setTimeout(() => {
            this.setButtonLoading(button, false);
            this.handlePlanSelection(plan);
        }, 1500);
    }

    // 处理方案选择
    handlePlanSelection(plan) {
        const planNames = {
            basic: '基础版',
            professional: '专业版',
            enterprise: '企业版'
        };

        const planName = planNames[plan];
        const billing = this.currentBilling === 'monthly' ? '月付' : '年付';

        console.log(`用户选择了${planName} - ${billing}`);

        if (plan === 'enterprise') {
            this.showContactModal();
        } else {
            this.showPurchaseModal(planName, billing);
        }

        // 显示通知
        if (window.smsApp) {
            window.smsApp.showNotification(`正在处理${planName}订购...`, 'info');
        }
    }

    // 设置按钮加载状态
    setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.classList.add('loading');
            const originalText = button.innerHTML;
            button.dataset.originalText = originalText;
            button.innerHTML = '处理中...';
        } else {
            button.disabled = false;
            button.classList.remove('loading');
            button.innerHTML = button.dataset.originalText;
        }
    }

    // 设置FAQ
    setupFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            item.addEventListener('click', () => {
                this.toggleFAQ(item);
            });
        });
    }

    // 切换FAQ显示
    toggleFAQ(item) {
        const content = item.querySelector('.faq-content');
        const icon = item.querySelector('.material-symbols-outlined');
        const isActive = item.classList.contains('active');

        // 关闭其他FAQ
        document.querySelectorAll('.faq-item').forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
                const otherContent = otherItem.querySelector('.faq-content');
                const otherIcon = otherItem.querySelector('.material-symbols-outlined');
                otherContent?.classList.remove('show');
                if (otherIcon) otherIcon.style.transform = '';
            }
        });

        // 切换当前FAQ
        if (isActive) {
            item.classList.remove('active');
            content?.classList.remove('show');
            if (icon) icon.style.transform = '';
        } else {
            item.classList.add('active');
            content?.classList.add('show');
            if (icon) icon.style.transform = 'rotate(180deg)';
        }
    }

    // 设置头部
    setupHeader() {
        const backBtn = document.getElementById('back-btn');
        const helpBtn = document.getElementById('help-btn');

        if (backBtn) {
            backBtn.addEventListener('click', this.handleBack.bind(this));
        }

        if (helpBtn) {
            helpBtn.addEventListener('click', this.handleHelp.bind(this));
        }
    }

    // 处理返回
    handleBack() {
        console.log('返回上一页');
        // history.back() 或者跳转到指定页面
        if (window.smsApp) {
            window.smsApp.showNotification('返回上一页', 'info');
        }
    }

    // 处理帮助
    handleHelp() {
        console.log('显示帮助');
        this.showHelpModal();
    }

    // 显示购买模态框
    showPurchaseModal(planName, billing) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-xl p-6 max-w-sm w-full animate-bounce-in">
                <div class="text-center">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span class="material-symbols-outlined text-green-600 text-2xl">check_circle</span>
                    </div>
                    <h3 class="text-lg font-bold text-gray-900 mb-2">确认订购</h3>
                    <p class="text-gray-600 mb-4">您选择了 <strong>${planName}</strong> (${billing})</p>
                    <div class="flex gap-3">
                        <button class="flex-1 bg-[var(--brand-blue)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity" onclick="this.closest('.fixed').remove()">
                            确认订购
                        </button>
                        <button class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors" onclick="this.closest('.fixed').remove()">
                            取消
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.setupModalEvents(modal);
    }

    // 显示联系模态框
    showContactModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-xl p-6 max-w-sm w-full animate-bounce-in">
                <h3 class="text-lg font-bold text-gray-900 mb-4">联系企业销售</h3>
                <div class="space-y-3 mb-6">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-[var(--brand-blue)]">person</span>
                        <span class="text-gray-700">专属客户经理</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-[var(--brand-blue)]">phone</span>
                        <span class="text-gray-700">400-123-4567</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-[var(--brand-blue)]">email</span>
                        <span class="text-gray-700">enterprise@sms.com</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-[var(--brand-blue)]">schedule</span>
                        <span class="text-gray-700">工作日 9:00-18:00</span>
                    </div>
                </div>
                <button class="w-full bg-[var(--brand-orange)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity" onclick="this.closest('.fixed').remove()">
                    立即联系
                </button>
            </div>
        `;

        document.body.appendChild(modal);
        this.setupModalEvents(modal);
    }

    // 显示帮助模态框
    showHelpModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-xl p-6 max-w-sm w-full animate-bounce-in">
                <h3 class="text-lg font-bold text-gray-900 mb-4">需要帮助？</h3>
                <div class="space-y-3 mb-6">
                    <button class="w-full text-left p-3 rounded-lg border hover:border-[var(--brand-orange)] transition-colors">
                        <div class="flex items-center gap-3">
                            <span class="material-symbols-outlined text-[var(--brand-blue)]">chat</span>
                            <span>在线客服</span>
                        </div>
                    </button>
                    <button class="w-full text-left p-3 rounded-lg border hover:border-[var(--brand-orange)] transition-colors">
                        <div class="flex items-center gap-3">
                            <span class="material-symbols-outlined text-[var(--brand-blue)]">call</span>
                            <span>电话咨询</span>
                        </div>
                    </button>
                    <button class="w-full text-left p-3 rounded-lg border hover:border-[var(--brand-orange)] transition-colors">
                        <div class="flex items-center gap-3">
                            <span class="material-symbols-outlined text-[var(--brand-blue)]">help</span>
                            <span>帮助文档</span>
                        </div>
                    </button>
                </div>
                <button class="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors" onclick="this.closest('.fixed').remove()">
                    关闭
                </button>
            </div>
        `;

        document.body.appendChild(modal);
        this.setupModalEvents(modal);
    }

    // 设置模态框事件
    setupModalEvents(modal) {
        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // ESC键关闭
        const closeOnEsc = (e) => {
            if (e.key === 'Escape') {
                modal.remove();
                document.removeEventListener('keydown', closeOnEsc);
            }
        };
        document.addEventListener('keydown', closeOnEsc);
    }

    // 初始化价格显示
    initPriceDisplay() {
        this.updateBillingNotes();
    }

    // 获取推荐方案
    getRecommendedPlan() {
        // 根据某些条件推荐方案
        return 'professional';
    }

    // 计算节省金额
    calculateSavings(plan) {
        const prices = {
            basic: { monthly: 0.06, annual: 0.048 },
            professional: { monthly: 0.05, annual: 0.04 },
            enterprise: { monthly: 0.03, annual: 0.024 }
        };

        const planPrices = prices[plan];
        if (!planPrices) return 0;

        const monthlyTotal = planPrices.monthly * 12;
        const annualTotal = planPrices.annual * 12;
        return ((monthlyTotal - annualTotal) / monthlyTotal * 100).toFixed(0);
    }
}

// 添加动画CSS
const style = document.createElement('style');
style.textContent = `
    .animate-bounce-in {
        animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: scale(0.3) translateY(100px);
        }
        50% {
            opacity: 1;
            transform: scale(1.1) translateY(-10px);
        }
        100% {
            opacity: 1;
            transform: scale(1) translateY(0);
        }
    }
`;
document.head.appendChild(style);

// 页面加载完成后初始化价格页面
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('pricing.html') ||
        document.querySelector('.nav-item[data-page="pricing"].active')) {
        window.pricingPage = new PricingPage();
    }
});

// 导出给其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PricingPage;
}