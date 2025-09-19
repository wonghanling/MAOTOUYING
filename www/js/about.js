// 关于页面专用交互逻辑
class AboutPage {
    constructor() {
        this.currentTab = 'about';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupFAQ();
        this.setupContactItems();
        this.setupLegalItems();
        this.setupHeader();
        this.addPageAnimation();
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
            item.querySelector('span:last-child')?.classList.remove('font-semibold');
            item.querySelector('span:last-child')?.classList.add('font-medium');
        });

        // 添加新的活跃状态
        const activeItem = document.querySelector(`[data-page="${page}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
            const textSpan = activeItem.querySelector('span:last-child');
            if (textSpan) {
                textSpan.classList.add('font-semibold');
                textSpan.classList.remove('font-medium');
            }
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
                console.log('跳转到功能页面');
                // window.location.href = 'features.html';
                break;
            case 'pricing':
                console.log('跳转到价格页面');
                // window.location.href = 'pricing.html';
                break;
            case 'about':
                console.log('当前在关于页面');
                break;
        }
    }

    // 设置FAQ交互
    setupFAQ() {
        const faqItems = document.querySelectorAll('.accordion-item');

        faqItems.forEach(item => {
            const summary = item.querySelector('.accordion-summary');

            if (summary) {
                summary.addEventListener('click', (e) => {
                    // 让浏览器处理默认的 details 行为
                    setTimeout(() => {
                        this.trackFAQInteraction(item);
                        this.animateOpenFAQ(item);
                    }, 10);
                });
            }
        });
    }

    // 跟踪FAQ交互
    trackFAQInteraction(item) {
        const faqType = item.dataset.faq;
        const isOpen = item.hasAttribute('open');

        console.log(`FAQ ${faqType} ${isOpen ? '展开' : '收起'}`);

        if (window.smsApp) {
            window.smsApp.showNotification(
                isOpen ? `查看${this.getFAQTitle(faqType)}` : '已收起FAQ',
                'info'
            );
        }
    }

    // 获取FAQ标题
    getFAQTitle(faqType) {
        const titles = {
            start: '开始使用指南',
            failed: '发送失败解决方案',
            report: '发送报告查看',
            pricing: '套餐选择建议'
        };
        return titles[faqType] || 'FAQ详情';
    }

    // FAQ展开动画
    animateOpenFAQ(item) {
        if (item.hasAttribute('open')) {
            const content = item.querySelector('.accordion-summary + div');
            if (content) {
                content.style.maxHeight = '0';
                content.style.opacity = '0';

                setTimeout(() => {
                    content.style.maxHeight = content.scrollHeight + 'px';
                    content.style.opacity = '1';
                }, 10);
            }
        }
    }

    // 设置联系方式交互
    setupContactItems() {
        const contactItems = document.querySelectorAll('.contact-item');

        contactItems.forEach(item => {
            item.addEventListener('click', () => {
                const contactType = item.dataset.contact;
                this.handleContactAction(contactType);
            });
        });
    }

    // 处理联系方式点击
    handleContactAction(contactType) {
        switch(contactType) {
            case 'phone':
                this.showPhoneContact();
                break;
            case 'chat':
                this.showOnlineChat();
                break;
            case 'email':
                this.showEmailContact();
                break;
        }
    }

    // 显示电话联系
    showPhoneContact() {
        const modal = this.createModal('客服热线', `
            <div class="text-center">
                <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="material-symbols-outlined text-blue-600 text-2xl">phone</span>
                </div>
                <h4 class="text-lg font-bold mb-2">400-123-4567</h4>
                <p class="text-gray-600 mb-4">工作日 9:00-18:00</p>
                <div class="space-y-2">
                    <button class="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors" onclick="this.closest('.fixed').remove()">
                        立即拨打
                    </button>
                    <button class="w-full text-gray-600 hover:text-gray-800 transition-colors" onclick="this.closest('.fixed').remove()">
                        稍后联系
                    </button>
                </div>
            </div>
        `);
        document.body.appendChild(modal);
    }

    // 显示在线客服
    showOnlineChat() {
        const modal = this.createModal('在线客服', `
            <div class="text-center">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="material-symbols-outlined text-green-600 text-2xl">chat</span>
                </div>
                <h4 class="text-lg font-bold mb-2">24小时在线服务</h4>
                <p class="text-gray-600 mb-4">即时响应，快速解决问题</p>
                <div class="space-y-2">
                    <button class="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors" onclick="this.closest('.fixed').remove()">
                        开始对话
                    </button>
                    <button class="w-full text-gray-600 hover:text-gray-800 transition-colors" onclick="this.closest('.fixed').remove()">
                        关闭
                    </button>
                </div>
            </div>
        `);
        document.body.appendChild(modal);
    }

    // 显示邮件联系
    showEmailContact() {
        const modal = this.createModal('邮件支持', `
            <div class="text-center">
                <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="material-symbols-outlined text-orange-600 text-2xl">email</span>
                </div>
                <h4 class="text-lg font-bold mb-2">support@sms-messenger.com</h4>
                <p class="text-gray-600 mb-4">我们会在24小时内回复您的邮件</p>
                <div class="space-y-2">
                    <button class="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors" onclick="this.closest('.fixed').remove()">
                        发送邮件
                    </button>
                    <button class="w-full text-gray-600 hover:text-gray-800 transition-colors" onclick="this.closest('.fixed').remove()">
                        关闭
                    </button>
                </div>
            </div>
        `);
        document.body.appendChild(modal);
    }

    // 设置法律文档交互
    setupLegalItems() {
        const legalItems = document.querySelectorAll('.legal-item');

        legalItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const legalType = item.dataset.legal;
                this.handleLegalAction(legalType);
            });
        });
    }

    // 处理法律文档点击
    handleLegalAction(legalType) {
        const documents = {
            terms: {
                title: '服务条款',
                content: '这里是服务条款的详细内容...'
            },
            privacy: {
                title: '隐私政策',
                content: '这里是隐私政策的详细内容...'
            },
            unsubscribe: {
                title: '退订说明',
                content: '用户可以通过以下方式退订短信服务...'
            }
        };

        const doc = documents[legalType];
        if (doc) {
            this.showLegalDocument(doc.title, doc.content);
        }
    }

    // 显示法律文档
    showLegalDocument(title, content) {
        const modal = this.createModal(title, `
            <div class="max-h-96 overflow-y-auto">
                <p class="text-gray-600 text-sm leading-relaxed">${content}</p>
            </div>
            <div class="mt-4">
                <button class="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors" onclick="this.closest('.fixed').remove()">
                    我已了解
                </button>
            </div>
        `);
        document.body.appendChild(modal);
    }

    // 设置头部交互
    setupHeader() {
        const backBtn = document.getElementById('back-btn');
        const settingsBtn = document.getElementById('settings-btn');

        if (backBtn) {
            backBtn.addEventListener('click', this.handleBack.bind(this));
        }

        if (settingsBtn) {
            settingsBtn.addEventListener('click', this.handleSettings.bind(this));
        }
    }

    // 处理返回
    handleBack() {
        console.log('返回上一页');
        if (window.smsApp) {
            window.smsApp.showNotification('返回上一页', 'info');
        }
        // history.back();
    }

    // 处理设置
    handleSettings() {
        console.log('打开设置');
        if (window.smsApp) {
            window.smsApp.showNotification('设置功能开发中', 'info');
        }
    }

    // 创建模态框
    createModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-xl p-6 max-w-sm w-full animate-bounce-in">
                <h3 class="text-lg font-bold text-gray-900 mb-4">${title}</h3>
                ${content}
            </div>
        `;

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        return modal;
    }

    // 添加页面动画
    addPageAnimation() {
        const main = document.querySelector('main');
        if (main) {
            main.classList.add('page-enter');
        }

        // 为sections添加动画
        const sections = document.querySelectorAll('section');
        sections.forEach((section, index) => {
            section.style.animationDelay = `${index * 0.1}s`;
        });
    }

    // 搜索FAQ
    searchFAQ(query) {
        const faqItems = document.querySelectorAll('.accordion-item');
        const lowerQuery = query.toLowerCase();

        faqItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(lowerQuery)) {
                item.style.display = 'block';
                item.classList.add('highlight');
            } else {
                item.style.display = 'none';
            }
        });
    }

    // 获取应用版本信息
    getAppInfo() {
        return {
            version: 'v2.1.0',
            updateTime: '2024-01-15',
            developer: '猫头鹰邮信科技有限公司',
            license: 'ICP备案号: 京ICP备12345678号'
        };
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

    .highlight {
        border-color: var(--brand-orange) !important;
        box-shadow: 0 0 20px rgba(249, 115, 22, 0.3) !important;
    }
`;
document.head.appendChild(style);

// 页面加载完成后初始化关于页面
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('about.html') ||
        document.querySelector('.nav-item[data-page="about"].active')) {
        window.aboutPage = new AboutPage();
    }
});

// 导出给其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AboutPage;
}