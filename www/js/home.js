// 首页专用交互逻辑
class HomePage {
    constructor() {
        this.currentTab = 'home';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupQuickActions();
        this.setupFeatureCards();
        this.startAnimations();
    }

    // 设置底部导航
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
        });

        // 添加新的活跃状态
        const activeItem = document.querySelector(`[data-page="${page}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
            this.currentTab = page;
        }

        // 页面跳转逻辑（这里可以根据需要实现单页应用或页面跳转）
        this.handlePageNavigation(page);
    }

    // 处理页面导航
    handlePageNavigation(page) {
        switch(page) {
            case 'home':
                console.log('当前在首页');
                break;
            case 'features':
                console.log('跳转到功能页面');
                // 这里可以跳转到功能页面
                break;
            case 'pricing':
                console.log('跳转到价格页面');
                // 这里可以跳转到价格页面
                break;
            case 'about':
                console.log('跳转到关于页面');
                // 这里可以跳转到关于页面
                break;
        }
    }

    // 设置快速操作按钮
    setupQuickActions() {
        // 立即发送按钮
        const quickSendBtn = document.getElementById('quick-send-btn');
        if (quickSendBtn) {
            quickSendBtn.addEventListener('click', this.handleQuickSend.bind(this));
        }

        // 联系人按钮
        const contactsBtn = document.getElementById('contacts-btn');
        if (contactsBtn) {
            contactsBtn.addEventListener('click', this.handleContacts.bind(this));
        }
    }

    // 处理立即发送
    handleQuickSend() {
        console.log('启动快速发送');

        // 添加按钮反馈
        const btn = document.getElementById('quick-send-btn');
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);

        // 这里将来跳转到发送页面
        if (window.smsApp) {
            window.smsApp.showNotification('正在准备发送界面...', 'info');
        }

        setTimeout(() => {
            alert('跳转到短信发送页面');
        }, 500);
    }

    // 处理联系人
    handleContacts() {
        console.log('打开联系人管理');

        // 添加按钮反馈
        const btn = document.getElementById('contacts-btn');
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 150);

        // 这里将来跳转到联系人页面
        if (window.smsApp) {
            window.smsApp.showNotification('正在加载联系人...', 'info');
        }

        setTimeout(() => {
            alert('跳转到联系人管理页面');
        }, 500);
    }

    // 设置功能卡片交互
    setupFeatureCards() {
        const featureCards = document.querySelectorAll('.feature-card');

        featureCards.forEach(card => {
            card.addEventListener('click', () => {
                const feature = card.dataset.feature;
                this.handleFeatureClick(feature);
            });
        });
    }

    // 处理功能卡片点击
    handleFeatureClick(feature) {
        console.log(`点击了功能: ${feature}`);

        let message = '';
        switch(feature) {
            case 'reliable':
                message = '查看可靠到达详情';
                break;
            case 'template':
                message = '查看智能模板详情';
                break;
            case 'analytics':
                message = '查看数据统计详情';
                break;
            default:
                message = '功能详情';
        }

        if (window.smsApp) {
            window.smsApp.showNotification(message, 'info');
        }
    }

    // 启动动画
    startAnimations() {
        // 延迟加载动画
        setTimeout(() => {
            this.animateStats();
            this.animateProgressBars();
        }, 500);
    }

    // 动画统计数字
    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(el => {
            el.classList.add('stat-number');
        });
    }

    // 动画进度条
    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            bar.classList.add('progress-bar');
        });
    }

    // 模拟实时数据更新
    startRealTimeUpdates() {
        setInterval(() => {
            this.updateStats();
        }, 30000); // 每30秒更新一次
    }

    // 更新统计数据
    updateStats() {
        // 模拟数据更新
        const stats = {
            dailySent: Math.floor(Math.random() * 100000) + 1200000,
            successRate: (Math.random() * 2 + 97).toFixed(1),
            avgTime: (Math.random() * 1 + 2).toFixed(1)
        };

        // 更新DOM（如果存在相应元素）
        console.log('更新统计数据:', stats);
    }
}

// 页面加载完成后初始化首页
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('home.html') ||
        document.querySelector('.nav-item[data-page="home"]')) {
        window.homePage = new HomePage();
    }
});

// 导出给其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HomePage;
}