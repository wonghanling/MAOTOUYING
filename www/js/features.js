// 功能页面专用交互逻辑
class FeaturesPage {
    constructor() {
        this.currentTab = 'features';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupFeatureButtons();
        this.setupHeader();
        this.addPageTransition();
        this.trackFeatureUsage();
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
            this.currentTab = page;
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
                console.log('当前在功能页面');
                break;
            case 'pricing':
                console.log('跳转到价格页面');
                // window.location.href = 'pricing.html';
                break;
            case 'about':
                console.log('跳转到关于页面');
                // window.location.href = 'about.html';
                break;
        }
    }

    // 设置功能按钮
    setupFeatureButtons() {
        const featureButtons = document.querySelectorAll('.feature-btn');

        featureButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const action = button.dataset.action;
                this.handleFeatureAction(action, button);
            });
        });
    }

    // 处理功能操作
    handleFeatureAction(action, button) {
        // 添加加载状态
        this.setButtonLoading(button, true);

        // 根据功能类型执行不同操作
        setTimeout(() => {
            this.setButtonLoading(button, false);

            switch(action) {
                case 'contacts':
                    this.handleContactsAction();
                    break;
                case 'templates':
                    this.handleTemplatesAction();
                    break;
                case 'tasks':
                    this.handleTasksAction();
                    break;
                case 'analytics':
                    this.handleAnalyticsAction();
                    break;
                case 'settings':
                    this.handleSettingsAction();
                    break;
                default:
                    console.log(`未知功能: ${action}`);
            }
        }, 1000); // 模拟加载时间
    }

    // 号码管理功能
    handleContactsAction() {
        console.log('打开号码管理');
        this.showFeatureModal('号码管理', '上传联系人、批量导入、分组管理');

        // 这里将来跳转到联系人管理页面
        if (window.smsApp) {
            window.smsApp.showNotification('正在加载号码管理...', 'info');
        }
    }

    // 模板管理功能
    handleTemplatesAction() {
        console.log('打开模板管理');
        this.showFeatureModal('模板管理', '创建短信模板、变量替换、智能审核');

        if (window.smsApp) {
            window.smsApp.showNotification('正在加载模板管理...', 'info');
        }
    }

    // 任务创建功能
    handleTasksAction() {
        console.log('创建发送任务');
        this.showFeatureModal('创建任务', '立即发送、定时发送、分批发送');

        if (window.smsApp) {
            window.smsApp.showNotification('正在准备发送任务...', 'info');
        }
    }

    // 数据统计功能
    handleAnalyticsAction() {
        console.log('查看数据统计');
        this.showFeatureModal('报表统计', '发送记录、成功率分析、详细报表');

        if (window.smsApp) {
            window.smsApp.showNotification('正在加载统计数据...', 'info');
        }
    }

    // 账户设置功能
    handleSettingsAction() {
        console.log('打开账户设置');
        this.showFeatureModal('账户设置', '余额查询、套餐管理、个人信息');

        if (window.smsApp) {
            window.smsApp.showNotification('正在加载账户设置...', 'info');
        }
    }

    // 设置按钮加载状态
    setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.classList.add('loading');
            const originalText = button.innerHTML;
            button.dataset.originalText = originalText;
            button.innerHTML = '加载中...';
        } else {
            button.disabled = false;
            button.classList.remove('loading');
            button.innerHTML = button.dataset.originalText;
        }
    }

    // 设置头部交互
    setupHeader() {
        const menuBtn = document.getElementById('menu-btn');
        const contactBtn = document.getElementById('contact-btn');

        if (menuBtn) {
            menuBtn.addEventListener('click', this.handleMenuClick.bind(this));
        }

        if (contactBtn) {
            contactBtn.addEventListener('click', this.handleContactClick.bind(this));
        }
    }

    // 处理菜单点击
    handleMenuClick() {
        console.log('打开菜单');
        // 这里可以实现侧边菜单或下拉菜单
        if (window.smsApp) {
            window.smsApp.showNotification('菜单功能开发中...', 'info');
        }
    }

    // 处理联系我们点击
    handleContactClick(e) {
        e.preventDefault();
        console.log('联系我们');
        this.showContactModal();
    }

    // 显示功能详情模态框
    showFeatureModal(title, description) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-xl p-6 max-w-sm w-full animate-bounce-in">
                <h3 class="text-lg font-bold text-neutral-900 mb-2">${title}</h3>
                <p class="text-neutral-600 mb-4">${description}</p>
                <div class="flex gap-2">
                    <button class="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors" onclick="this.closest('.fixed').remove()">
                        了解更多
                    </button>
                    <button class="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors" onclick="this.closest('.fixed').remove()">
                        关闭
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // 3秒后自动关闭
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 3000);
    }

    // 显示联系模态框
    showContactModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-xl p-6 max-w-sm w-full">
                <h3 class="text-lg font-bold text-neutral-900 mb-4">联系我们</h3>
                <div class="space-y-3">
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-primary-600">phone</span>
                        <span class="text-neutral-700">400-123-4567</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-primary-600">email</span>
                        <span class="text-neutral-700">service@sms.com</span>
                    </div>
                    <div class="flex items-center gap-3">
                        <span class="material-symbols-outlined text-primary-600">schedule</span>
                        <span class="text-neutral-700">工作日 9:00-18:00</span>
                    </div>
                </div>
                <button class="w-full mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors" onclick="this.closest('.fixed').remove()">
                    知道了
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

    // 添加页面过渡动画
    addPageTransition() {
        const main = document.querySelector('main');
        if (main) {
            main.classList.add('page-transition');
        }
    }

    // 跟踪功能使用情况
    trackFeatureUsage() {
        const features = document.querySelectorAll('.feature-item');

        features.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const feature = item.dataset.feature;
                console.log(`用户悬停在功能: ${feature}`);
            });
        });
    }

    // 添加快捷键支持
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        this.handleFeatureAction('contacts', document.querySelector('[data-action="contacts"]'));
                        break;
                    case '2':
                        e.preventDefault();
                        this.handleFeatureAction('templates', document.querySelector('[data-action="templates"]'));
                        break;
                    case '3':
                        e.preventDefault();
                        this.handleFeatureAction('tasks', document.querySelector('[data-action="tasks"]'));
                        break;
                    case '4':
                        e.preventDefault();
                        this.handleFeatureAction('analytics', document.querySelector('[data-action="analytics"]'));
                        break;
                }
            }
        });
    }
}

// 添加弹跳动画CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes bounce-in {
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
    .animate-bounce-in {
        animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
`;
document.head.appendChild(style);

// 页面加载完成后初始化功能页面
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('features.html') ||
        document.querySelector('.nav-item[data-page="features"].active')) {
        window.featuresPage = new FeaturesPage();
    }
});

// 导出给其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FeaturesPage;
}