// Capacitor SMS App - 主应用文件
// 动态检查Capacitor是否可用
const Capacitor = window.Capacitor || {
    isNativePlatform: () => false,
    getPlatform: () => 'web'
};

class SMSMessengerApp {
    constructor() {
        this.currentPage = 'login';
        this.isLoggedIn = false;
        this.pages = {};

        // 全局模板数据存储
        this.templatesData = this.loadTemplatesData();

        // 全局联系人分组数据存储
        this.contactGroups = this.loadContactGroups();

        // 全局联系人数据存储
        this.contacts = this.loadContacts();

        // 全局用户信息存储
        this.userInfo = this.loadUserInfo();

        this.init();

        // 启动定期清理任务（每天执行一次）
        this.startPeriodicCleanup();
    }

    async init() {
        console.log('📱 SMS Messenger App 启动中...');

        // 等待设备就绪
        await this.waitForDeviceReady();

        // 初始化页面路由
        this.initializePages();

        // 设置导航
        this.setupNavigation();

        // 加载登录页
        this.showPage('login');

        console.log('✅ App 初始化完成');
    }

    async waitForDeviceReady() {
        return new Promise((resolve) => {
            if (Capacitor.isNativePlatform()) {
                document.addEventListener('deviceready', resolve);
            } else {
                resolve();
            }
        });
    }

    initializePages() {
        this.pages = {
            login: {
                title: '登录',
                file: 'pages/login.html'
            },
            home: {
                title: '首页',
                file: 'pages/home.html'
            },
            features: {
                title: '功能',
                file: 'pages/features.html'
            },
            pricing: {
                title: '价格',
                file: 'pages/pricing.html'
            },
            about: {
                title: '我的',
                file: 'pages/about.html'
            },
            contacts: {
                title: '联系人管理',
                file: 'pages/contacts.html'
            },
            templates: {
                title: '模板管理',
                file: 'pages/templates.html'
            },
            tasks: {
                title: '任务管理',
                file: 'pages/tasks.html'
            },
            analytics: {
                title: '数据报表',
                file: 'pages/analytics.html'
            }
        };
    }

    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = btn.dataset.page;
                this.showPage(page);
            });
        });
    }

    async showPage(pageName) {
        if (!this.pages[pageName]) {
            console.error('页面不存在:', pageName);
            return;
        }

        // 显示加载动画
        this.showLoading();

        try {
            // 加载页面内容
            const response = await fetch(this.pages[pageName].file);
            const html = await response.text();

            // 提取页面主体内容
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            const mainContent = tempDiv.querySelector('main');

            if (mainContent) {
                // 更新页面容器
                const appPages = document.getElementById('app-pages');
                appPages.innerHTML = mainContent.outerHTML;

                // 更新导航状态
                this.updateNavigationState(pageName);

                // 执行页面特定的初始化
                this.initializePage(pageName);

                this.currentPage = pageName;
                console.log(`📄 已切换到页面: ${this.pages[pageName].title}`);
            }
        } catch (error) {
            console.error('加载页面失败:', error);
        } finally {
            // 隐藏加载动画
            this.hideLoading();
        }
    }

    updateNavigationState(activePage) {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            const isActive = btn.dataset.page === activePage;
            btn.classList.toggle('text-orange-600', isActive);
            btn.classList.toggle('text-gray-600', !isActive);

            // 更新字体粗细
            const textSpan = btn.querySelector('span:last-child');
            if (textSpan) {
                textSpan.classList.toggle('font-semibold', isActive);
                textSpan.classList.toggle('font-medium', !isActive);
            }
        });
    }

    initializePage(pageName) {
        // 根据页面类型执行特定初始化
        switch(pageName) {
            case 'login':
                this.initLoginPage();
                break;
            case 'home':
                this.initHomePage();
                break;
            case 'features':
                this.initFeaturesPage();
                break;
            case 'pricing':
                this.initPricingPage();
                break;
            case 'about':
                this.initAboutPage();
                break;
            case 'contacts':
                this.initContactsPage();
                break;
            case 'templates':
                this.initTemplatesPage();
                break;
            case 'tasks':
                this.initTasksPage();
                break;
            case 'analytics':
                this.initAnalyticsPage();
                break;
        }

        // 控制导航栏显示
        this.updateNavigationVisibility(pageName);
    }

    initLoginPage() {
        // 绑定营销页面按钮事件
        const showLoginBtn = document.getElementById('show-login-btn');
        const showRegisterBtn = document.getElementById('show-register-btn');
        const freeTrialBtn = document.getElementById('free-trial-btn');
        const pricingBtn = document.getElementById('pricing-btn');

        // 绑定弹窗事件
        const loginModal = document.getElementById('login-modal-bg');
        const closeModalBtn = document.getElementById('close-modal-btn');
        const closeRegisterBtn = document.getElementById('close-register-btn');

        // 登录和注册表单
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const registerLink = document.getElementById('register-link');
        const backToLogin = document.getElementById('back-to-login');
        const sendCodeBtn = document.getElementById('send-code-btn');

        // 表单容器
        const loginCard = document.getElementById('login-card');
        const registerContainer = document.getElementById('register-form-container');

        // 显示登录弹窗
        if (showLoginBtn) {
            showLoginBtn.addEventListener('click', () => {
                loginModal.classList.remove('hidden');
                loginCard.classList.remove('hidden');
                registerContainer.classList.add('hidden');
            });
        }

        // 显示注册弹窗
        if (showRegisterBtn || freeTrialBtn) {
            const showRegister = () => {
                loginModal.classList.remove('hidden');
                loginCard.classList.add('hidden');
                registerContainer.classList.remove('hidden');
            };

            if (showRegisterBtn) showRegisterBtn.addEventListener('click', showRegister);
            if (freeTrialBtn) freeTrialBtn.addEventListener('click', showRegister);
        }

        // 关闭弹窗
        const closeModal = () => {
            loginModal.classList.add('hidden');
            loginCard.classList.remove('hidden');
            registerContainer.classList.add('hidden');
        };

        if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
        if (closeRegisterBtn) closeRegisterBtn.addEventListener('click', closeModal);

        // 点击背景关闭弹窗
        if (loginModal) {
            loginModal.addEventListener('click', (e) => {
                if (e.target === loginModal) {
                    closeModal();
                }
            });
        }

        // 查看套餐按钮
        if (pricingBtn) {
            pricingBtn.addEventListener('click', () => {
                this.showPage('pricing');
            });
        }

        // 登录表单提交
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLoginSubmit.bind(this));
        }

        // 注册表单提交
        if (registerForm) {
            registerForm.addEventListener('submit', this.handleRegisterSubmit.bind(this));
        }

        // 切换到注册表单
        if (registerLink) {
            registerLink.addEventListener('click', () => {
                loginCard.classList.add('hidden');
                registerContainer.classList.remove('hidden');
            });
        }

        // 返回登录表单
        if (backToLogin) {
            backToLogin.addEventListener('click', () => {
                registerContainer.classList.add('hidden');
                loginCard.classList.remove('hidden');
            });
        }

        // 发送验证码
        if (sendCodeBtn) {
            sendCodeBtn.addEventListener('click', this.handleSendCode.bind(this));
        }
    }

    initHomePage() {
        // 首页初始化完成
        console.log('首页初始化完成');

        // 更新首页统计数据
        this.updateHomePageStats();
    }

    initFeaturesPage() {
        // 重新绑定功能页面事件
        const featureBtns = document.querySelectorAll('.feature-btn');
        featureBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const action = btn.dataset.action;
                this.handleFeatureAction(action);
            });

            // 强制设置按钮为橙色
            btn.classList.remove('bg-blue-500', 'bg-blue-600', 'hover:bg-blue-600');
            btn.classList.add('bg-orange-500', 'hover:bg-orange-600');
        });

        // 绑定头部按钮
        const menuBtn = document.getElementById('menu-btn');
        const contactBtn = document.getElementById('contact-btn');

        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                this.showNotification('菜单功能开发中...', 'info');
            });
        }

        if (contactBtn) {
            contactBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showNotification('客服电话: 400-123-4567', 'info');
            });
        }
    }

    initPricingPage() {
        // 重新绑定价格页面事件
        console.log('价格页面初始化');

        // 绑定充值按钮
        const planBtns = document.querySelectorAll('.plan-btn');
        planBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleRecharge();
            });
        });

        // 绑定返回按钮
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showPage('home');
            });
        }

        // 绑定帮助按钮
        const helpBtn = document.getElementById('help-btn');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                this.showNotification('帮助功能开发中...', 'info');
            });
        }
    }

    handleRecharge() {
        console.log('充值被点击');

        // 初始化支付SDK
        if (!this.paymentSDK) {
            this.paymentSDK = new HupijiaoPay({
                appid: 'YOUR_APPID', // 部署时需要替换为实际的虎皮椒APPID
                appSecret: 'YOUR_SECRET', // 部署时需要替换为实际的密钥
                notifyUrl: `${window.location.origin}/api/payment/notify`
            });
        }

        // 获取充值套餐
        const packages = this.paymentSDK.getRechargePackages();

        // 创建充值套餐选择对话框
        const modalContent = `
            <div class="space-y-3">
                <div class="text-center mb-4">
                    <h4 class="font-medium text-gray-800">选择充值套餐</h4>
                    <p class="text-sm text-gray-500 mt-1">统一单价3分/条，充值后即可发送短信</p>
                </div>
                ${packages.map(pkg => `
                    <div class="package-item border border-gray-200 rounded-lg p-4 hover:border-orange-500 hover:bg-orange-50 cursor-pointer transition-all"
                         data-package-id="${pkg.id}" data-amount="${pkg.amount}" data-sms-count="${pkg.smsCount}" data-title="${pkg.title}">
                        <div class="flex justify-between items-center">
                            <div>
                                <div class="font-medium text-gray-800">${pkg.title}</div>
                                <div class="text-sm text-gray-500">${pkg.description}</div>
                            </div>
                            <div class="text-right">
                                <div class="text-lg font-bold text-orange-600">¥${pkg.amount}</div>
                                <div class="text-xs text-gray-400">${pkg.unitPrice}</div>
                            </div>
                        </div>
                    </div>
                `).join('')}

                <div class="mt-6 pt-4 border-t">
                    <div class="flex gap-3">
                        <button id="cancel-recharge-btn" class="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            取消
                        </button>
                    </div>
                </div>
            </div>
        `;

        const modal = this.createModal('短信充值', modalContent);
        document.body.appendChild(modal);

        // 绑定套餐选择事件
        const packageItems = modal.querySelectorAll('.package-item');
        const cancelBtn = modal.querySelector('#cancel-recharge-btn');

        packageItems.forEach(item => {
            item.addEventListener('click', () => {
                // 移除其他选中状态
                packageItems.forEach(pkg => pkg.classList.remove('border-orange-500', 'bg-orange-50'));

                // 添加选中状态
                item.classList.add('border-orange-500', 'bg-orange-50');

                // 获取选中的套餐信息
                const packageData = {
                    id: item.dataset.packageId,
                    amount: parseFloat(item.dataset.amount),
                    smsCount: parseInt(item.dataset.smsCount),
                    title: item.dataset.title
                };

                // 发起支付
                this.initiatePayment(packageData, modal);
            });
        });

        cancelBtn.addEventListener('click', () => {
            modal.remove();
        });
    }

    async initiatePayment(packageData, modal) {
        this.showNotification('正在创建支付订单...', 'info');

        try {
            const result = await this.paymentSDK.createPayment({
                amount: packageData.amount,
                title: `充值${packageData.smsCount}条短信`,
                description: packageData.title
            });

            if (result.success) {
                modal.remove();

                // 显示支付提示
                const paymentModal = this.createModal('支付确认', `
                    <div class="text-center">
                        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span class="material-symbols-outlined text-green-600 text-2xl">payment</span>
                        </div>
                        <h4 class="font-medium mb-2">支付订单已创建</h4>
                        <p class="text-sm text-gray-600 mb-4">
                            充值套餐：${packageData.title}<br>
                            支付金额：¥${packageData.amount}<br>
                            订单号：${result.orderId}
                        </p>
                        <div class="text-xs text-gray-500 mb-6">
                            请在新打开的页面完成支付，支付成功后短信余额将自动到账
                        </div>
                        <button id="close-payment-modal" class="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                            知道了
                        </button>
                    </div>
                `);

                document.body.appendChild(paymentModal);

                paymentModal.querySelector('#close-payment-modal').addEventListener('click', () => {
                    paymentModal.remove();
                });

                // 监听支付成功回调
                this.paymentSDK.onPaymentSuccess((data) => {
                    this.handlePaymentSuccess(packageData, data);
                });

                this.showNotification('支付页面已打开，请完成支付', 'success');
            } else {
                this.showNotification('创建支付订单失败：' + result.error, 'error');
            }
        } catch (error) {
            console.error('支付失败:', error);
            this.showNotification('支付功能暂时不可用，请稍后重试', 'error');
        }
    }

    handlePaymentSuccess(packageData, paymentData) {
        // 更新用户短信余额
        if (!this.userInfo.smsBalance) {
            this.userInfo.smsBalance = 0;
        }

        this.userInfo.smsBalance += packageData.smsCount;
        this.saveUserInfo();

        // 显示充值成功通知
        this.showNotification(`充值成功！获得${packageData.smsCount}条短信`, 'success');

        // 刷新页面显示
        this.updateUserInfo();

        // 记录充值历史
        this.recordRechargeHistory({
            orderId: paymentData.orderId || 'unknown',
            packageData: packageData,
            timestamp: new Date().toISOString(),
            status: 'success'
        });
    }

    recordRechargeHistory(record) {
        let history = [];
        try {
            const stored = localStorage.getItem('sms_recharge_history');
            if (stored) {
                history = JSON.parse(stored);
            }
        } catch (error) {
            console.error('获取充值历史失败:', error);
        }

        history.unshift(record);

        // 只保留最近50条记录
        if (history.length > 50) {
            history = history.slice(0, 50);
        }

        try {
            localStorage.setItem('sms_recharge_history', JSON.stringify(history));
        } catch (error) {
            console.error('保存充值历史失败:', error);
        }
    }

    initContactsPage() {
        // 绑定返回按钮
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showPage('features');
            });
        }

        // 绑定创建分组按钮
        const createGroupBtn = document.getElementById('create-group-btn');
        if (createGroupBtn) {
            createGroupBtn.addEventListener('click', () => {
                this.showCreateGroupDialog();
            });
        }

        // 绑定添加联系人按钮
        const addContactBtn = document.getElementById('add-contact-btn');
        if (addContactBtn) {
            addContactBtn.addEventListener('click', () => {
                this.showAddContactDialog();
            });
        }

        // 绑定默认分组的导入按钮
        const defaultImportBtn = document.querySelector('.import-to-group-btn[data-group-id="default"]');
        if (defaultImportBtn) {
            defaultImportBtn.addEventListener('click', () => {
                this.showGroupImportDialog('default', '默认分组');
            });
        }

        // 绑定默认分组的编辑按钮
        const defaultEditBtn = document.querySelector('.edit-group-btn[data-group-id="default"]');
        if (defaultEditBtn) {
            defaultEditBtn.addEventListener('click', () => {
                this.showGroupContactsDialog('default', '默认分组');
            });
        }

        // 绑定默认分组的删除按钮
        const defaultDeleteBtn = document.querySelector('.delete-group-btn[data-group-id="default"]');
        if (defaultDeleteBtn) {
            defaultDeleteBtn.addEventListener('click', () => {
                this.showNotification('默认分组不能删除', 'info');
            });
        }

        // 加载并显示已保存的分组
        this.loadAndDisplayGroups();

        // 加载并显示已保存的联系人
        this.loadAndDisplayContacts();

        // 更新分组联系人数量
        this.updateGroupContactCounts();
    }

    showCreateGroupDialog() {
        // 创建分组对话框HTML
        const dialogHTML = `
            <div id="create-group-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-xl max-w-md w-full">
                    <div class="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 class="text-lg font-bold text-[var(--primary-color)]">创建分组</h3>
                        <button id="close-group-modal" class="text-gray-400 hover:text-gray-600">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <div class="p-6">
                        <form id="create-group-form" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">分组名称</label>
                                <input type="text" id="group-name" class="w-full p-3 border border-gray-300 rounded-lg focus:border-[var(--secondary-color)] focus:outline-none" placeholder="请输入分组名称" required>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">分组描述</label>
                                <textarea id="group-description" rows="3" class="w-full p-3 border border-gray-300 rounded-lg focus:border-[var(--secondary-color)] focus:outline-none resize-none" placeholder="请输入分组描述（可选）"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="p-4 border-t border-gray-200 flex gap-3">
                        <button id="cancel-group" class="flex-1 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg">
                            取消
                        </button>
                        <button id="save-group" class="flex-1 py-2 bg-[var(--secondary-color)] text-white rounded-lg hover:bg-orange-600">
                            创建分组
                        </button>
                    </div>
                </div>
            </div>
        `;

        // 添加对话框到页面
        document.body.insertAdjacentHTML('beforeend', dialogHTML);

        // 绑定事件
        const modal = document.getElementById('create-group-modal');
        const closeBtn = document.getElementById('close-group-modal');
        const cancelBtn = document.getElementById('cancel-group');
        const saveBtn = document.getElementById('save-group');

        // 关闭对话框
        const closeModal = () => {
            modal.remove();
        };

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // 保存分组
        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.createContactGroup(closeModal);
        });
    }

    createContactGroup(closeModal) {
        const nameInput = document.getElementById('group-name');
        const descriptionInput = document.getElementById('group-description');

        if (!nameInput.value.trim()) {
            this.showNotification('请输入分组名称', 'error');
            return;
        }

        // 模拟创建分组
        this.showNotification('正在创建分组...', 'info');

        setTimeout(() => {
            const group = {
                id: Date.now(),
                name: nameInput.value.trim(),
                description: descriptionInput.value.trim(),
                contactCount: 0,
                createdAt: new Date().toLocaleString()
            };

            // 保存到全局数据
            this.contactGroups.push(group);
            this.saveContactGroups();

            // 添加分组到列表
            this.addGroupToList(group);

            this.showNotification('分组创建成功！', 'success');
            closeModal();
        }, 1000);
    }

    addGroupToList(group, saveToStorage = true) {
        const groupsList = document.getElementById('groups-list');
        if (!groupsList) return;

        // 创建分组元素
        const groupItem = document.createElement('div');
        groupItem.className = 'group-item flex items-center justify-between p-3 bg-gray-50 rounded-lg';
        groupItem.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="material-symbols-outlined text-[var(--secondary-color)]">group</span>
                <div>
                    <p class="font-medium">${group.name}</p>
                    <p class="text-sm text-gray-500">${group.contactCount} 个联系人</p>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <button class="import-to-group-btn text-[var(--secondary-color)] hover:text-orange-600 transition-colors"
                        data-group-id="${group.id}" data-group-name="${group.name}"
                        title="导入联系人到此分组">
                    <span class="material-symbols-outlined">upload</span>
                </button>
                <button class="edit-group-btn text-gray-400 hover:text-[var(--secondary-color)] transition-colors" data-group-id="${group.id}">
                    <span class="material-symbols-outlined">edit</span>
                </button>
                <button class="delete-group-btn text-gray-400 hover:text-red-500 transition-colors" data-group-id="${group.id}">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        `;

        groupsList.appendChild(groupItem);

        // 绑定导入、编辑和删除按钮事件
        const importBtn = groupItem.querySelector('.import-to-group-btn');
        const editBtn = groupItem.querySelector('.edit-group-btn');
        const deleteBtn = groupItem.querySelector('.delete-group-btn');

        importBtn.addEventListener('click', () => {
            this.showGroupImportDialog(group.id, group.name);
        });

        editBtn.addEventListener('click', () => {
            this.showGroupContactsDialog(group.id, group.name);
        });

        deleteBtn.addEventListener('click', () => {
            this.deleteGroup(group.id, group.name, groupItem);
        });
    }

    deleteGroup(groupId, groupName, groupElement) {
        // 检查该分组中是否有联系人
        const contactsInGroup = this.getContactsInGroup(groupId);

        let confirmMessage = `确定要删除分组"${groupName}"吗？`;
        if (contactsInGroup > 0) {
            confirmMessage = `分组"${groupName}"中有 ${contactsInGroup} 个联系人。\n删除分组后，这些联系人将被移动到默认分组。\n\n确定要继续删除吗？`;
        }

        if (confirm(confirmMessage)) {
            // 如果分组中有联系人，将它们移动到默认分组
            if (contactsInGroup > 0) {
                this.moveContactsToDefaultGroup(groupId);
            }

            // 从全局数据中删除分组
            const groupIndex = this.contactGroups.findIndex(g => g.id === groupId);
            if (groupIndex !== -1) {
                this.contactGroups.splice(groupIndex, 1);
                this.saveContactGroups(); // 保存到localStorage
            }

            // 从页面中删除分组元素
            groupElement.remove();
            this.showNotification(`分组"${groupName}"删除成功`, 'success');
        }
    }

    getContactsInGroup(groupId) {
        // 统计指定分组中的联系人数量
        const contactItems = document.querySelectorAll('.contact-item');
        let count = 0;

        contactItems.forEach(item => {
            const groupSpan = item.querySelector('.text-xs.text-gray-400');
            if (groupSpan) {
                const groupDisplayName = groupSpan.textContent.trim();
                const expectedGroupName = this.getGroupDisplayName(groupId);
                if (groupDisplayName === expectedGroupName) {
                    count++;
                }
            }
        });

        return count;
    }

    moveContactsToDefaultGroup(groupId) {
        // 将指定分组的联系人移动到默认分组
        // 1. 更新全局数据中的联系人分组
        this.contacts.forEach(contact => {
            if (contact.group === groupId) {
                contact.group = 'default';
            }
        });

        // 2. 保存更新后的联系人数据到localStorage
        this.saveContacts();

        // 3. 更新页面显示（如果有的话）
        const contactItems = document.querySelectorAll('.contact-item');
        contactItems.forEach(item => {
            const groupSpan = item.querySelector('.text-xs.text-gray-400');
            if (groupSpan) {
                const groupDisplayName = groupSpan.textContent.trim();
                const expectedGroupName = this.getGroupDisplayName(groupId);
                if (groupDisplayName === expectedGroupName) {
                    // 更新联系人的分组显示为默认分组
                    groupSpan.textContent = '默认分组';
                }
            }
        });

        // 4. 更新分组联系人数量显示
        this.updateGroupContactCounts();
    }

    showGroupImportDialog(groupId, groupName) {
        // 创建分组导入对话框HTML
        const dialogHTML = `
            <div id="group-import-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-xl max-w-md w-full">
                    <div class="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 class="text-lg font-bold text-[var(--primary-color)]">导入到 "${groupName}"</h3>
                        <button id="close-group-import-modal" class="text-gray-400 hover:text-gray-600">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <div class="p-6">
                        <div class="space-y-4">
                            <!-- Upload Area -->
                            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[var(--secondary-color)] transition-colors cursor-pointer"
                                 id="group-upload-area">
                                <span class="material-symbols-outlined text-3xl text-gray-400 mb-2">upload_file</span>
                                <p class="text-gray-600 mb-1">点击上传或拖拽文件到此处</p>
                                <p class="text-sm text-gray-500">支持 Excel (.xlsx) 和 CSV (.csv) 格式</p>
                                <input type="file" id="group-file-input" accept=".xlsx,.csv" class="hidden">
                            </div>

                            <!-- Import Options -->
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">导入选项</label>
                                <div class="space-y-2">
                                    <label class="flex items-center">
                                        <input type="checkbox" id="group-skip-duplicates" class="mr-2" checked>
                                        <span class="text-sm">跳过重复的手机号（允许同名）</span>
                                    </label>
                                    <label class="flex items-center">
                                        <input type="checkbox" id="group-validate-phones" class="mr-2" checked>
                                        <span class="text-sm">验证手机号格式</span>
                                    </label>
                                </div>
                            </div>

                            <!-- File Format Info -->
                            <div class="bg-blue-50 p-3 rounded-lg">
                                <h4 class="text-sm font-medium text-blue-800 mb-2">文件格式要求</h4>
                                <ul class="text-xs text-blue-700 space-y-1">
                                    <li>• 第一列：姓名</li>
                                    <li>• 第二列：手机号</li>
                                    <li>• 第三列：备注（可选）</li>
                                    <li>• 第一行为标题行将被跳过</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="p-4 border-t border-gray-200 flex gap-3">
                        <button id="cancel-group-import" class="flex-1 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg">
                            取消
                        </button>
                        <button id="start-group-import" class="flex-1 py-2 bg-[var(--secondary-color)] text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-400" disabled>
                            开始导入
                        </button>
                    </div>
                </div>
            </div>
        `;

        // 添加对话框到页面
        document.body.insertAdjacentHTML('beforeend', dialogHTML);

        // 绑定事件
        const modal = document.getElementById('group-import-modal');
        const closeBtn = document.getElementById('close-group-import-modal');
        const cancelBtn = document.getElementById('cancel-group-import');
        const startBtn = document.getElementById('start-group-import');
        const uploadArea = document.getElementById('group-upload-area');
        const fileInput = document.getElementById('group-file-input');

        let selectedFile = null;

        // 关闭对话框
        const closeModal = () => {
            modal.remove();
        };

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // 文件上传处理
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('border-[var(--secondary-color)]', 'bg-orange-50');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('border-[var(--secondary-color)]', 'bg-orange-50');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('border-[var(--secondary-color)]', 'bg-orange-50');

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                handleFileSelection(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                handleFileSelection(e.target.files[0]);
            }
        });

        function handleFileSelection(file) {
            // 验证文件类型
            const allowedTypes = ['.xlsx', '.csv'];
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

            if (!allowedTypes.includes(fileExtension)) {
                alert('请选择 Excel (.xlsx) 或 CSV (.csv) 格式的文件');
                return;
            }

            selectedFile = file;
            startBtn.disabled = false;
            startBtn.textContent = `导入 ${file.name}`;

            // 更新上传区域显示
            uploadArea.innerHTML = `
                <span class="material-symbols-outlined text-3xl text-green-600 mb-2">check_circle</span>
                <p class="text-green-600 font-medium">${file.name}</p>
                <p class="text-sm text-gray-500">文件大小: ${(file.size / 1024).toFixed(1)} KB</p>
                <p class="text-xs text-gray-400 mt-2">点击重新选择文件</p>
            `;
        }

        // 开始导入
        startBtn.addEventListener('click', () => {
            if (selectedFile) {
                this.importContactsToGroup(selectedFile, groupId, closeModal);
            }
        });
    }

    async importContactsToGroup(file, groupId, closeModal) {
        const skipDuplicates = document.getElementById('group-skip-duplicates').checked;
        const validatePhones = document.getElementById('group-validate-phones').checked;

        this.showNotification('正在解析文件...', 'info');

        try {
            // 读取文件内容
            const fileContent = await this.readFileContent(file);
            const contacts = this.parseContactsFile(fileContent, file.type);

            if (contacts.length === 0) {
                this.showNotification('文件中没有找到有效的联系人数据', 'error');
                return;
            }

            // 处理联系人数据
            let importedCount = 0;
            let skippedCount = 0;

            for (let i = 0; i < contacts.length; i++) {
                const contact = contacts[i];

                // 验证手机号格式
                if (validatePhones) {
                    const phoneRegex = /^1[3-9]\d{9}$/;
                    if (!phoneRegex.test(contact.phone)) {
                        skippedCount++;
                        continue;
                    }
                }

                // 检查重复（只检查手机号）
                if (skipDuplicates && this.isPhoneExists(contact.phone)) {
                    skippedCount++;
                    continue;
                }

                // 创建联系人对象
                const newContact = {
                    id: Date.now() + i,
                    name: contact.name,
                    phone: contact.phone,
                    group: groupId,
                    remark: contact.remark || '',
                    createdAt: new Date().toLocaleString()
                };

                // 保存到全局数据
                this.contacts.push(newContact);

                // 添加到列表
                this.addContactToList(newContact, false); // false表示不重复保存
                importedCount++;

                // 显示导入进度
                if (i % 10 === 0) {
                    this.showNotification(`导入中... ${i + 1}/${contacts.length}`, 'info');
                    await this.delay(100);
                }
            }

            // 保存所有导入的联系人到localStorage
            this.saveContacts();

            // 更新分组联系人数量显示
            this.updateGroupContactCounts();

            closeModal();
            this.showNotification(`导入完成！成功导入 ${importedCount} 个联系人到指定分组，跳过 ${skippedCount} 个`, 'success');

        } catch (error) {
            this.showNotification('文件解析失败，请检查文件格式', 'error');
            console.error('File import error:', error);
        }
    }

    showAddContactDialog() {
        // 创建添加联系人对话框HTML
        const dialogHTML = `
            <div id="add-contact-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-xl max-w-md w-full">
                    <div class="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 class="text-lg font-bold text-[var(--primary-color)]">添加联系人</h3>
                        <button id="close-contact-modal" class="text-gray-400 hover:text-gray-600">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <div class="p-6">
                        <form id="add-contact-form" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                                <input type="text" id="contact-name" class="w-full p-3 border border-gray-300 rounded-lg focus:border-[var(--secondary-color)] focus:outline-none" placeholder="请输入联系人姓名" required>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">手机号</label>
                                <input type="tel" id="contact-phone" class="w-full p-3 border border-gray-300 rounded-lg focus:border-[var(--secondary-color)] focus:outline-none" placeholder="请输入手机号" required>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">所属分组</label>
                                <select id="contact-group" class="w-full p-3 border border-gray-300 rounded-lg focus:border-[var(--secondary-color)] focus:outline-none">
                                    <option value="default">默认分组</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">备注</label>
                                <textarea id="contact-remark" rows="2" class="w-full p-3 border border-gray-300 rounded-lg focus:border-[var(--secondary-color)] focus:outline-none resize-none" placeholder="请输入备注信息（可选）"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="p-4 border-t border-gray-200 flex gap-3">
                        <button id="cancel-contact" class="flex-1 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg">
                            取消
                        </button>
                        <button id="save-contact" class="flex-1 py-2 bg-[var(--secondary-color)] text-white rounded-lg hover:bg-orange-600">
                            添加联系人
                        </button>
                    </div>
                </div>
            </div>
        `;

        // 添加对话框到页面
        document.body.insertAdjacentHTML('beforeend', dialogHTML);

        // 绑定事件
        const modal = document.getElementById('add-contact-modal');
        const closeBtn = document.getElementById('close-contact-modal');
        const cancelBtn = document.getElementById('cancel-contact');
        const saveBtn = document.getElementById('save-contact');

        // 关闭对话框
        const closeModal = () => {
            modal.remove();
        };

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // 保存联系人
        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.addNewContact(closeModal);
        });
    }

    addNewContact(closeModal) {
        const nameInput = document.getElementById('contact-name');
        const phoneInput = document.getElementById('contact-phone');
        const groupSelect = document.getElementById('contact-group');
        const remarkInput = document.getElementById('contact-remark');

        // 验证输入
        if (!nameInput.value.trim()) {
            this.showNotification('请输入联系人姓名', 'error');
            return;
        }

        if (!phoneInput.value.trim()) {
            this.showNotification('请输入手机号', 'error');
            return;
        }

        // 验证手机号格式
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(phoneInput.value.trim())) {
            this.showNotification('请输入正确的手机号格式', 'error');
            return;
        }

        // 模拟添加联系人
        this.showNotification('正在添加联系人...', 'info');

        setTimeout(() => {
            const contact = {
                id: Date.now(),
                name: nameInput.value.trim(),
                phone: phoneInput.value.trim(),
                group: groupSelect.value,
                remark: remarkInput.value.trim(),
                createdAt: new Date().toLocaleString()
            };

            // 保存到全局数据
            this.contacts.push(contact);
            this.saveContacts();

            // 添加联系人到列表
            this.addContactToList(contact);

            // 更新分组联系人数量显示
            this.updateGroupContactCounts();

            this.showNotification('联系人添加成功！', 'success');
            closeModal();
        }, 1000);
    }

    addContactToList(contact, saveToStorage = true) {
        // 当添加新联系人时，重新渲染整个联系人列表以保持分组显示
        this.loadAndDisplayContacts();
    }

    getAllGroups() {
        // 获取页面上所有分组
        const groups = [{ id: 'default', name: '默认分组' }];

        const groupItems = document.querySelectorAll('.group-item');
        groupItems.forEach(item => {
            const nameElement = item.querySelector('p.font-medium');
            if (nameElement && nameElement.textContent !== '默认分组') {
                // 为动态分组生成ID（基于名称）
                const groupName = nameElement.textContent;
                groups.push({
                    id: groupName.toLowerCase().replace(/\s+/g, '-'),
                    name: groupName
                });
            }
        });

        return groups;
    }

    async readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file, 'UTF-8');
        });
    }

    parseContactsFile(content, fileType) {
        const contacts = [];
        const lines = content.split('\n');

        // 跳过标题行
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            let columns;
            if (fileType.includes('csv')) {
                // CSV格式解析
                columns = line.split(',').map(col => col.trim().replace(/^["']|["']$/g, ''));
            } else {
                // 简单的制表符或空格分隔
                columns = line.split(/[\t\s]+/).filter(col => col.trim());
            }

            if (columns.length >= 2) {
                contacts.push({
                    name: columns[0],
                    phone: columns[1],
                    remark: columns[2] || ''
                });
            }
        }

        return contacts;
    }

    isPhoneExists(phone) {
        // 检查联系人列表中是否已存在相同手机号
        const contactItems = document.querySelectorAll('.contact-item');
        for (const item of contactItems) {
            const phoneElement = item.querySelector('p.text-sm.text-gray-500');
            if (phoneElement && phoneElement.textContent === phone) {
                return true;
            }
        }
        return false;
    }

    getGroupDisplayName(groupId) {
        if (groupId === 'default') {
            return '默认分组';
        }

        // 从当前分组列表中查找分组名称
        const groupItems = document.querySelectorAll('.group-item');
        for (const item of groupItems) {
            const nameElement = item.querySelector('p.font-medium');
            if (nameElement) {
                const groupName = nameElement.textContent;
                const generatedId = groupName.toLowerCase().replace(/\s+/g, '-');
                if (generatedId === groupId) {
                    return groupName;
                }
            }
        }

        // 如果没找到，就直接返回ID（可能是之前创建的分组）
        return groupId;
    }

    initTemplatesPage() {
        // 绑定返回按钮
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showPage('features');
            });
        }

        // 绑定模板分类按钮
        const categoryBtns = document.querySelectorAll('.template-category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 移除所有活动状态
                categoryBtns.forEach(b => {
                    b.classList.remove('active', 'bg-[var(--secondary-color)]', 'text-white');
                    b.classList.add('bg-gray-100', 'text-gray-700');
                });
                // 添加当前活动状态
                btn.classList.add('active', 'bg-[var(--secondary-color)]', 'text-white');
                btn.classList.remove('bg-gray-100', 'text-gray-700');

                const category = btn.dataset.category;
                this.showNotification(`切换到 ${btn.textContent} 分类`, 'info');
            });
        });

        // 动态加载模板列表
        this.loadAndDisplayTemplates();
    }

    loadAndDisplayTemplates() {
        const templateList = document.getElementById('template-list');
        if (!templateList) return;

        // 清空现有内容
        templateList.innerHTML = '';

        // 加载保存的模板数据
        this.templatesData.forEach(template => {
            this.addTemplateToList(template);
        });
    }

    addTemplateToList(template) {
        const templateList = document.getElementById('template-list');
        if (!templateList) return;

        const templateElement = document.createElement('div');
        templateElement.className = 'template-item p-4 border border-gray-200 rounded-lg hover:border-[var(--secondary-color)] transition-colors';
        templateElement.setAttribute('data-template-id', template.id);

        templateElement.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="px-2 py-1 ${this.getTemplateTagColor(template.category)} text-xs rounded">${template.type}</span>
                        <span class="text-sm text-gray-500">已审核</span>
                    </div>
                    <h3 class="font-medium mb-2">${template.title}</h3>
                    <p class="text-sm text-gray-600 mb-3">${template.content}</p>
                    <div class="flex items-center gap-4 text-xs text-gray-500">
                        <span>创建时间: ${new Date().toLocaleDateString()}</span>
                        <span>使用次数: 0</span>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button class="edit-template-btn text-gray-400 hover:text-[var(--secondary-color)] transition-colors"
                            data-template-id="${template.id}">
                        <span class="material-symbols-outlined">edit</span>
                    </button>
                    <button class="use-template-btn bg-[var(--secondary-color)] text-white px-3 py-1 rounded text-sm hover:bg-orange-600 transition-colors"
                            data-template-id="${template.id}">
                        使用
                    </button>
                </div>
            </div>
        `;

        templateList.appendChild(templateElement);

        // 绑定事件
        const editBtn = templateElement.querySelector('.edit-template-btn');
        const useBtn = templateElement.querySelector('.use-template-btn');

        editBtn.addEventListener('click', () => {
            this.showEditTemplateDialog(template.id);
        });

        useBtn.addEventListener('click', () => {
            // 预选择这个模板
            this.preSelectedTemplate = template;
            this.showNotification(`已选择模板: ${template.title}`, 'success');

            // 跳转到任务创建页面
            setTimeout(() => {
                this.showPage('tasks');
            }, 500);
        });
    }

    showEditTemplateDialog(templateId) {
        const template = this.templatesData.find(t => t.id === templateId);
        if (!template) {
            this.showNotification('模板未找到', 'error');
            return;
        }

        // 创建编辑对话框HTML
        const dialogHTML = `
            <div id="edit-template-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                    <div class="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 class="text-lg font-bold text-[var(--primary-color)]">编辑模板</h3>
                        <button id="close-edit-modal" class="text-gray-400 hover:text-gray-600">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <div class="p-6 max-h-96 overflow-y-auto">
                        <form id="edit-template-form" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">模板名称</label>
                                <input type="text" id="template-title" class="w-full p-3 border border-gray-300 rounded-lg focus:border-[var(--secondary-color)] focus:outline-none" value="${template.title}" required>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">模板内容</label>
                                <textarea id="template-content" rows="6" class="w-full p-3 border border-gray-300 rounded-lg focus:border-[var(--secondary-color)] focus:outline-none resize-none" required>${template.content}</textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">模板类型</label>
                                <select id="template-type" class="w-full p-3 border border-gray-300 rounded-lg focus:border-[var(--secondary-color)] focus:outline-none">
                                    <option value="verification" ${template.category === 'verification' ? 'selected' : ''}>验证码</option>
                                    <option value="marketing" ${template.category === 'marketing' ? 'selected' : ''}>营销推广</option>
                                    <option value="notification" ${template.category === 'notification' ? 'selected' : ''}>通知提醒</option>
                                </select>
                            </div>
                            <div class="bg-blue-50 p-3 rounded-lg">
                                <h4 class="text-sm font-medium text-blue-800 mb-2">可用变量</h4>
                                <div class="grid grid-cols-3 gap-2 text-xs text-blue-700">
                                    <div><code>{name}</code> 姓名</div>
                                    <div><code>{phone}</code> 手机号</div>
                                    <div><code>{code}</code> 验证码</div>
                                    <div><code>{company}</code> 公司名</div>
                                    <div><code>{product}</code> 产品名</div>
                                    <div><code>{date}</code> 日期</div>
                                    <div><code>{link}</code> 链接</div>
                                    <div><code>{order_no}</code> 订单号</div>
                                    <div><code>{tracking_no}</code> 快递单号</div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div class="p-4 border-t border-gray-200 flex gap-3">
                        <button id="cancel-edit-template" class="flex-1 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg">
                            取消
                        </button>
                        <button id="save-template" class="flex-1 py-2 bg-[var(--secondary-color)] text-white rounded-lg hover:bg-orange-600">
                            保存模板
                        </button>
                    </div>
                </div>
            </div>
        `;

        // 添加对话框到页面
        document.body.insertAdjacentHTML('beforeend', dialogHTML);

        // 绑定事件
        const modal = document.getElementById('edit-template-modal');
        const closeBtn = document.getElementById('close-edit-modal');
        const cancelBtn = document.getElementById('cancel-edit-template');
        const saveBtn = document.getElementById('save-template');

        // 关闭对话框
        const closeModal = () => {
            modal.remove();
        };

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // 保存模板
        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.saveTemplateChanges(templateId, closeModal);
        });
    }

    saveTemplateChanges(templateId, closeModal) {
        const titleInput = document.getElementById('template-title');
        const contentInput = document.getElementById('template-content');
        const typeSelect = document.getElementById('template-type');

        if (!titleInput.value.trim() || !contentInput.value.trim()) {
            this.showNotification('请填写完整的模板信息', 'error');
            return;
        }

        // 模拟保存模板
        this.showNotification('正在保存模板...', 'info');

        setTimeout(() => {
            // 更新全局模板数据
            const templateIndex = this.templatesData.findIndex(t => t.id === templateId);
            if (templateIndex !== -1) {
                this.templatesData[templateIndex] = {
                    ...this.templatesData[templateIndex],
                    title: titleInput.value.trim(),
                    content: contentInput.value.trim(),
                    type: typeSelect.options[typeSelect.selectedIndex].text,
                    category: typeSelect.value
                };
            }

            // 保存模板数据到localStorage
            this.saveTemplatesData();

            // 重新加载模板列表以显示更新后的内容
            this.loadAndDisplayTemplates();

            this.showNotification('模板保存成功！', 'success');
            closeModal();
        }, 1000);
    }

    initTasksPage() {
        // 绑定返回按钮
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showPage('features');
            });
        }

        // 初始化任务状态
        this.taskData = {
            contacts: null,
            template: null,
            sendTime: 'now' // 固定为立即发送
        };

        // 检查是否有预选择的模板
        if (this.preSelectedTemplate) {
            this.onTemplateSelected(this.preSelectedTemplate);
            // 清除预选择的模板
            this.preSelectedTemplate = null;
        }

        // 绑定选择联系人按钮
        const selectContactsBtn = document.getElementById('select-contacts-btn');
        if (selectContactsBtn) {
            selectContactsBtn.addEventListener('click', () => {
                this.showNotification('模拟选择联系人...', 'info');
                setTimeout(() => {
                    this.selectContacts();
                }, 1000);
            });
        }

        // 绑定选择模板按钮
        const selectTemplateBtn = document.getElementById('select-template-btn');
        if (selectTemplateBtn) {
            selectTemplateBtn.addEventListener('click', () => {
                this.showNotification('模拟选择模板...', 'info');
                setTimeout(() => {
                    this.selectTemplate();
                }, 1000);
            });
        }

        // 绑定创建任务按钮
        const createTaskSubmit = document.getElementById('create-task-submit');
        if (createTaskSubmit) {
            createTaskSubmit.addEventListener('click', () => {
                this.createTask();
            });
        }

        // 绑定任务筛选按钮
        const taskFilterBtns = document.querySelectorAll('.task-filter-btn');
        taskFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 移除所有活动状态
                taskFilterBtns.forEach(b => {
                    b.classList.remove('active', 'bg-[var(--secondary-color)]', 'text-white');
                    b.classList.add('bg-gray-100', 'text-gray-700');
                });
                // 添加当前活动状态
                btn.classList.add('active', 'bg-[var(--secondary-color)]', 'text-white');
                btn.classList.remove('bg-gray-100', 'text-gray-700');

                const status = btn.dataset.status;
                this.showNotification(`筛选${btn.textContent}任务`, 'info');
            });
        });
    }

    selectContacts() {
        // 显示联系人分组选择对话框
        this.showContactGroupSelectionDialog();
    }

    showContactGroupSelectionDialog() {
        // 获取所有分组和联系人数据
        const groups = this.getAllGroupsWithContacts();

        // 创建分组选择对话框HTML
        const dialogHTML = `
            <div id="contact-selection-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-hidden">
                    <div class="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 class="text-lg font-bold text-[var(--primary-color)]">选择联系人分组</h3>
                        <button id="close-contact-selection-modal" class="text-gray-400 hover:text-gray-600">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <div class="p-4 max-h-96 overflow-y-auto">
                        <div class="space-y-3">
                            ${groups.map(group => `
                                <div class="group-selection-item">
                                    <label class="flex items-center p-3 border border-gray-200 rounded-lg hover:border-[var(--secondary-color)] hover:bg-orange-50 cursor-pointer transition-all">
                                        <input type="checkbox" class="group-checkbox mr-3" data-group-id="${group.id}" data-group-name="${group.name}" data-contact-count="${group.contactCount}">
                                        <div class="flex items-center gap-3 flex-1">
                                            <span class="material-symbols-outlined text-[var(--secondary-color)]">group</span>
                                            <div>
                                                <p class="font-medium">${group.name}</p>
                                                <p class="text-sm text-gray-500">${group.contactCount} 个联系人</p>
                                            </div>
                                        </div>
                                    </label>
                                </div>
                            `).join('')}
                        </div>

                        ${groups.length === 0 ? `
                            <div class="text-center text-gray-500 py-8">
                                <span class="material-symbols-outlined text-4xl mb-2">group_off</span>
                                <p>暂无联系人分组</p>
                                <p class="text-sm">请先添加联系人到分组中</p>
                            </div>
                        ` : ''}
                    </div>
                    <div class="p-4 border-t border-gray-200">
                        <div class="flex items-center justify-between mb-3">
                            <span class="text-sm text-gray-600">已选择: <span id="selected-count">0</span> 个分组</span>
                            <span class="text-sm text-gray-600">总计: <span id="total-contacts">0</span> 个联系人</span>
                        </div>
                        <div class="flex gap-3">
                            <button id="cancel-contact-selection" class="flex-1 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg">
                                取消
                            </button>
                            <button id="confirm-contact-selection" class="flex-1 py-2 bg-[var(--secondary-color)] text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-400" disabled>
                                确认选择
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 添加对话框到页面
        document.body.insertAdjacentHTML('beforeend', dialogHTML);

        // 绑定事件
        const modal = document.getElementById('contact-selection-modal');
        const closeBtn = document.getElementById('close-contact-selection-modal');
        const cancelBtn = document.getElementById('cancel-contact-selection');
        const confirmBtn = document.getElementById('confirm-contact-selection');
        const checkboxes = document.querySelectorAll('.group-checkbox');

        // 关闭对话框
        const closeModal = () => {
            modal.remove();
        };

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // 更新选择统计
        const updateSelection = () => {
            const selectedCheckboxes = document.querySelectorAll('.group-checkbox:checked');
            const selectedCount = selectedCheckboxes.length;
            let totalContacts = 0;

            selectedCheckboxes.forEach(checkbox => {
                totalContacts += parseInt(checkbox.dataset.contactCount);
            });

            document.getElementById('selected-count').textContent = selectedCount;
            document.getElementById('total-contacts').textContent = totalContacts;
            confirmBtn.disabled = selectedCount === 0;
        };

        // 绑定复选框变化事件
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateSelection);
        });

        // 确认选择
        confirmBtn.addEventListener('click', () => {
            const selectedCheckboxes = document.querySelectorAll('.group-checkbox:checked');
            this.onContactGroupsSelected(selectedCheckboxes);
            closeModal();
        });
    }

    getAllGroupsWithContacts() {
        // 获取所有分组并统计每个分组的联系人数量
        const groups = [];

        // 获取默认分组的联系人数量
        const defaultContactCount = this.getContactsInGroupFromData('default');
        if (defaultContactCount > 0) {
            groups.push({
                id: 'default',
                name: '默认分组',
                contactCount: defaultContactCount
            });
        }

        // 获取自定义分组
        this.contactGroups.forEach(group => {
            const contactCount = this.getContactsInGroupFromData(group.id);
            if (contactCount > 0) {
                groups.push({
                    id: group.id,
                    name: group.name,
                    contactCount: contactCount
                });
            }
        });

        return groups;
    }

    // 从全局数据中统计指定分组的联系人数量
    getContactsInGroupFromData(groupId) {
        return this.contacts.filter(contact => contact.group === groupId).length;
    }

    // 更新所有分组的联系人数量显示
    updateGroupContactCounts() {
        // 更新默认分组数量
        const defaultGroupElement = document.querySelector('.group-item p.text-sm.text-gray-500');
        if (defaultGroupElement) {
            const defaultCount = this.getContactsInGroupFromData('default');
            defaultGroupElement.textContent = `${defaultCount} 个联系人`;
        }

        // 更新自定义分组数量
        const groupItems = document.querySelectorAll('.group-item');
        groupItems.forEach(item => {
            const nameElement = item.querySelector('p.font-medium');
            const countElement = item.querySelector('p.text-sm.text-gray-500');
            if (nameElement && countElement && nameElement.textContent !== '默认分组') {
                const groupName = nameElement.textContent;
                // 从保存的分组中找到对应的ID
                const savedGroup = this.contactGroups.find(g => g.name === groupName);
                if (savedGroup) {
                    const contactCount = this.getContactsInGroupFromData(savedGroup.id);
                    countElement.textContent = `${contactCount} 个联系人`;
                }
            }
        });
    }

    onContactGroupsSelected(selectedCheckboxes) {
        if (selectedCheckboxes.length === 0) {
            this.showNotification('请选择至少一个分组', 'error');
            return;
        }

        // 统计选择的分组和联系人数量
        let totalContacts = 0;
        const selectedGroups = [];

        selectedCheckboxes.forEach(checkbox => {
            const groupName = checkbox.dataset.groupName;
            const contactCount = parseInt(checkbox.dataset.contactCount);
            totalContacts += contactCount;
            selectedGroups.push(`${groupName} (${contactCount}人)`);
        });

        // 更新任务数据
        this.taskData.contacts = {
            count: totalContacts,
            groups: Array.from(selectedCheckboxes).map(cb => cb.dataset.groupName),
            preview: selectedGroups.join(' + ')
        };

        // 更新UI
        const contactsText = document.getElementById('contacts-text');
        const contactsPreview = document.getElementById('contacts-preview');

        if (contactsText) {
            contactsText.textContent = `已选择 ${totalContacts} 个联系人`;
            contactsText.classList.remove('text-gray-500');
            contactsText.classList.add('text-green-600');
        }

        if (contactsPreview) {
            contactsPreview.textContent = this.taskData.contacts.preview;
            contactsPreview.classList.remove('hidden');
        }

        this.updateTaskSummary();
        this.showNotification(`已选择 ${totalContacts} 个联系人`, 'success');
    }

    selectTemplate() {
        // 创建模板选择对话框
        this.showTemplateSelectionDialog(this.templatesData);
    }

    showTemplateSelectionDialog(templates) {
        // 创建对话框HTML
        const dialogHTML = `
            <div id="template-selection-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-hidden">
                    <div class="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 class="text-lg font-bold text-[var(--primary-color)]">选择短信模板</h3>
                        <button id="close-template-modal" class="text-gray-400 hover:text-gray-600">
                            <span class="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <div class="p-4 max-h-96 overflow-y-auto">
                        <div class="space-y-3">
                            ${templates.map(template => `
                                <div class="template-option p-3 border border-gray-200 rounded-lg hover:border-[var(--secondary-color)] hover:bg-orange-50 cursor-pointer transition-all"
                                     data-template-id="${template.id}">
                                    <div class="flex items-start justify-between">
                                        <div class="flex-1">
                                            <div class="flex items-center gap-2 mb-2">
                                                <span class="px-2 py-1 ${this.getTemplateTagColor(template.category)} text-xs rounded">${template.type}</span>
                                            </div>
                                            <h4 class="font-medium mb-2">${template.title}</h4>
                                            <p class="text-sm text-gray-600">${template.content}</p>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="p-4 border-t border-gray-200">
                        <button id="cancel-template-selection" class="w-full py-2 text-gray-600 hover:text-gray-800">
                            取消
                        </button>
                    </div>
                </div>
            </div>
        `;

        // 添加对话框到页面
        document.body.insertAdjacentHTML('beforeend', dialogHTML);

        // 绑定事件
        const modal = document.getElementById('template-selection-modal');
        const closeBtn = document.getElementById('close-template-modal');
        const cancelBtn = document.getElementById('cancel-template-selection');
        const templateOptions = document.querySelectorAll('.template-option');

        // 关闭对话框
        const closeModal = () => {
            modal.remove();
        };

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // 选择模板
        templateOptions.forEach(option => {
            option.addEventListener('click', () => {
                const templateId = parseInt(option.dataset.templateId);
                const selectedTemplate = templates.find(t => t.id === templateId);
                this.onTemplateSelected(selectedTemplate);
                closeModal();
            });
        });
    }

    getTemplateTagColor(category) {
        const colors = {
            'verification': 'bg-blue-100 text-blue-600',
            'marketing': 'bg-green-100 text-green-600',
            'notification': 'bg-purple-100 text-purple-600'
        };
        return colors[category] || 'bg-gray-100 text-gray-600';
    }

    onTemplateSelected(template) {
        // 保存选择的模板
        this.taskData.template = template;

        // 更新UI
        const templateText = document.getElementById('template-text');
        const templatePreview = document.getElementById('template-preview');
        const templateTitle = document.getElementById('template-title');
        const templateContent = document.getElementById('template-content');

        if (templateText) {
            templateText.textContent = template.title;
            templateText.classList.remove('text-gray-500');
            templateText.classList.add('text-green-600');
        }

        if (templatePreview) {
            templatePreview.classList.remove('hidden');
        }

        if (templateTitle) {
            templateTitle.textContent = `${template.type} - ${template.title}`;
        }

        if (templateContent) {
            templateContent.textContent = template.content;
        }

        this.updateTaskSummary();
        this.showNotification(`已选择模板: ${template.title}`, 'success');
    }

    updateTaskSummary() {
        const taskSummary = document.getElementById('task-summary');
        const summaryContacts = document.getElementById('summary-contacts');
        const summaryTemplate = document.getElementById('summary-template');
        const summaryTime = document.getElementById('summary-time');
        const summaryCost = document.getElementById('summary-cost');

        if (!taskSummary) return;

        // 检查是否有选择项
        const hasSelections = this.taskData.contacts || this.taskData.template;

        if (hasSelections) {
            taskSummary.classList.remove('hidden');

            if (summaryContacts) {
                summaryContacts.textContent = this.taskData.contacts ?
                    `${this.taskData.contacts.count} 个联系人` : '未选择';
            }

            if (summaryTemplate) {
                summaryTemplate.textContent = this.taskData.template ?
                    this.taskData.template.title : '未选择';
            }

            if (summaryCost) {
                const contactCount = this.taskData.contacts ? this.taskData.contacts.count : 0;
                const totalBalance = this.getTotalSMSBalance();

                // 只显示条数，不显示金额
                summaryCost.innerHTML = `
                    <div>需要发送: ${contactCount}条短信</div>
                    <div class="text-xs ${totalBalance >= contactCount ? 'text-green-600' : 'text-red-600'}">
                        当前余额: ${totalBalance}条 ${totalBalance >= contactCount ? '✓' : '余额不足！'}
                    </div>
                `;
            }
        } else {
            taskSummary.classList.add('hidden');
        }
    }

    createTask() {
        if (!this.taskData.contacts) {
            this.showNotification('请先选择联系人', 'error');
            return;
        }

        if (!this.taskData.template) {
            this.showNotification('请先选择短信模板', 'error');
            return;
        }

        // 检查用户余额是否足够
        const smsCount = this.taskData.contacts.count;
        if (!this.checkSMSBalance(smsCount)) {
            const totalBalance = this.getTotalSMSBalance();
            this.showNotification(`余额不足！当前余额${totalBalance}条，需要${smsCount}条。请先充值。`, 'error');
            return;
        }

        // 创建任务
        this.showNotification('正在创建任务...', 'info');

        setTimeout(() => {
            const task = {
                id: Date.now(),
                title: this.taskData.template.title,
                contactCount: this.taskData.contacts.count,
                template: this.taskData.template.content,
                sendTime: this.taskData.sendTime,
                cost: (this.taskData.contacts.count * 0.03).toFixed(2),
                status: this.taskData.sendTime === 'now' ? 'running' : 'pending',
                createdAt: new Date().toLocaleString()
            };

            // 显示新任务
            this.addTaskToList(task);

            // 如果是立即发送，开始发送流程
            if (this.taskData.sendTime === 'now') {
                this.showNotification('任务创建成功！开始发送短信...', 'success');
                setTimeout(() => {
                    this.executeTask(task);
                }, 1000);
            } else {
                this.showNotification('任务创建成功！已安排定时发送', 'success');
            }

            // 重置表单
            this.resetTaskForm();
        }, 1500);
    }

    async executeTask(task) {
        this.showNotification('正在发送短信...', 'info');

        // 获取联系人列表（模拟）
        const contacts = this.generateContactNumbers(task.contactCount);

        // 更新任务状态为发送中
        this.updateTaskStatus(task.id, 'running', '发送中...');

        try {
            // 执行批量发送
            await this.sendBulkSMS(contacts, task.template);

            // 更新任务状态为已完成
            this.updateTaskStatus(task.id, 'completed', '发送完成');
            this.showNotification(`短信发送完成！成功发送 ${task.contactCount} 条`, 'success');
        } catch (error) {
            // 更新任务状态为失败
            this.updateTaskStatus(task.id, 'failed', '发送失败');
            this.showNotification('短信发送失败，请重试', 'error');
        }
    }

    generateContactNumbers(count) {
        // 生成模拟联系人号码
        const contacts = [];
        for (let i = 0; i < count; i++) {
            contacts.push(`138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`);
        }
        return contacts;
    }

    updateTaskStatus(taskId, status, statusText) {
        const taskItems = document.querySelectorAll('.task-item');
        taskItems.forEach(item => {
            const taskIdElement = item.querySelector('[data-task-id]');
            if (taskIdElement && parseInt(taskIdElement.dataset.taskId) === taskId) {
                const statusSpan = item.querySelector('.task-status');
                const statusDot = item.querySelector('.status-dot');

                if (statusSpan) {
                    statusSpan.textContent = statusText;
                }

                if (statusDot) {
                    // 移除所有状态类
                    statusDot.classList.remove('bg-orange-500', 'bg-blue-500', 'bg-green-500', 'bg-red-500');

                    // 添加对应状态的颜色
                    switch (status) {
                        case 'running':
                            statusDot.classList.add('bg-orange-500');
                            break;
                        case 'completed':
                            statusDot.classList.add('bg-green-500');
                            break;
                        case 'failed':
                            statusDot.classList.add('bg-red-500');
                            break;
                        default:
                            statusDot.classList.add('bg-blue-500');
                    }
                }
            }
        });
    }

    addTaskToList(task) {
        const taskList = document.getElementById('task-list');
        if (!taskList) return;

        // 移除空状态
        const emptyState = taskList.querySelector('.text-center');
        if (emptyState) {
            emptyState.remove();
        }

        // 创建任务元素
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item p-4 border border-gray-200 rounded-lg';

        const statusColor = task.status === 'running' ? 'orange' : task.status === 'completed' ? 'green' : task.status === 'failed' ? 'red' : 'blue';
        const statusText = task.status === 'running' ? '发送中' : task.status === 'completed' ? '已完成' : task.status === 'failed' ? '发送失败' : '待发送';

        taskItem.innerHTML = `
            <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                        <div class="flex items-center gap-1">
                            <span class="status-dot w-2 h-2 bg-${statusColor}-500 rounded-full"></span>
                            <span class="task-status px-2 py-1 bg-${statusColor}-100 text-${statusColor}-600 text-xs rounded">${statusText}</span>
                        </div>
                        <span class="text-sm text-gray-500">${task.createdAt}</span>
                    </div>
                    <h3 class="font-medium mb-2">${task.title}</h3>
                    <p class="text-sm text-gray-600 mb-2">${task.template}</p>
                </div>
                <button class="text-gray-400 hover:text-[var(--secondary-color)] transition-colors">
                    <span class="material-symbols-outlined">more_vert</span>
                </button>
            </div>
            <div class="flex items-center gap-4 text-sm mb-3">
                <span class="text-gray-600">目标数量: <span class="font-medium">${task.contactCount} 人</span></span>
                <span class="text-gray-600">预计费用: <span class="font-medium">¥${task.cost}</span></span>
            </div>
            <div class="hidden" data-task-id="${task.id}"></div>
        `;

        taskList.insertBefore(taskItem, taskList.firstChild);
    }

    resetTaskForm() {
        // 重置任务数据
        this.taskData = {
            contacts: null,
            template: null,
            sendTime: 'now' // 固定为立即发送
        };

        // 重置UI
        const contactsText = document.getElementById('contacts-text');
        const templateText = document.getElementById('template-text');
        const contactsPreview = document.getElementById('contacts-preview');
        const templatePreview = document.getElementById('template-preview');
        const taskSummary = document.getElementById('task-summary');

        if (contactsText) {
            contactsText.textContent = '点击选择联系人或分组';
            contactsText.classList.remove('text-green-600');
            contactsText.classList.add('text-gray-500');
        }

        if (templateText) {
            templateText.textContent = '点击选择短信模板';
            templateText.classList.remove('text-green-600');
            templateText.classList.add('text-gray-500');
        }

        if (contactsPreview) {
            contactsPreview.classList.add('hidden');
        }

        if (templatePreview) {
            templatePreview.classList.add('hidden');
        }

        if (taskSummary) {
            taskSummary.classList.add('hidden');
        }
    }

    initAnalyticsPage() {
        // 绑定返回按钮
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.showPage('features');
            });
        }

        // 绑定时间筛选按钮
        const timeFilterBtns = document.querySelectorAll('.time-filter-btn');
        const customRange = document.getElementById('custom-range');

        timeFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // 移除所有活动状态
                timeFilterBtns.forEach(b => {
                    b.classList.remove('active', 'bg-[var(--secondary-color)]', 'text-white');
                    b.classList.add('bg-gray-100', 'text-gray-700');
                });
                // 添加当前活动状态
                btn.classList.add('active', 'bg-[var(--secondary-color)]', 'text-white');
                btn.classList.remove('bg-gray-100', 'text-gray-700');

                // 显示/隐藏自定义时间范围
                if (btn.dataset.range === 'custom') {
                    customRange.classList.remove('hidden');
                } else {
                    customRange.classList.add('hidden');
                }

                // 更新统计数据
                this.updateAnalyticsData(btn.dataset.range);
            });
        });

        // 绑定导出按钮
        const exportBtns = document.querySelectorAll('.export-btn');
        exportBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.exportSMSRecords();
            });
        });

        // 初始加载今日数据
        this.updateAnalyticsData('today');
    }

    updateAnalyticsData(timeRange) {
        const stats = this.getSMSStatistics(timeRange);

        // 更新概览数据
        const totalSentElement = document.querySelector('[data-total-sent]');
        const successRateElement = document.querySelector('[data-success-rate]');
        const totalCostElement = document.querySelector('[data-total-cost]');
        const avgTimeElement = document.querySelector('[data-avg-time]');
        const sendProgressElement = document.querySelector('[data-send-progress]');
        const progressBarElement = document.querySelector('[data-progress-bar]');

        if (totalSentElement) {
            totalSentElement.textContent = stats.totalSent;
            totalSentElement.classList.remove('text-gray-400');
            totalSentElement.classList.add('text-blue-600');
        }

        if (successRateElement) {
            if (stats.totalSent > 0) {
                successRateElement.textContent = `${stats.successRate}%`;
                successRateElement.classList.remove('text-gray-400');
                successRateElement.classList.add('text-green-600');
            } else {
                successRateElement.textContent = '-';
                successRateElement.classList.add('text-gray-400');
            }
        }

        if (totalCostElement) {
            totalCostElement.textContent = `¥${stats.totalCost}`;
            totalCostElement.classList.remove('text-gray-400');
            totalCostElement.classList.add('text-orange-600');
        }

        if (avgTimeElement) {
            if (stats.totalSent > 0) {
                avgTimeElement.textContent = '2.3s'; // 固定平均时间
                avgTimeElement.classList.remove('text-gray-400');
                avgTimeElement.classList.add('text-purple-600');
            } else {
                avgTimeElement.textContent = '-';
                avgTimeElement.classList.add('text-gray-400');
            }
        }

        // 更新进度条
        if (sendProgressElement && progressBarElement) {
            sendProgressElement.textContent = `${stats.successCount}/${stats.totalSent}`;
            const progressPercent = stats.totalSent > 0 ? (stats.successCount / stats.totalSent) * 100 : 0;
            progressBarElement.style.width = `${progressPercent}%`;
        }

        // 更新发送记录列表
        this.updateRecordsList(stats.records);

        this.showNotification(`已切换到${this.getTimeRangeText(timeRange)}数据`, 'info');
    }

    updateRecordsList(records) {
        const recordsList = document.getElementById('records-list');
        if (!recordsList) return;

        if (records.length === 0) {
            recordsList.innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    <span class="material-symbols-outlined text-4xl mb-2">send</span>
                    <p>暂无发送记录</p>
                    <p class="text-sm">发送短信后记录将显示在这里</p>
                </div>
            `;
            return;
        }

        // 显示记录列表（最多显示20条）
        const displayRecords = records.slice(0, 20);
        recordsList.innerHTML = displayRecords.map(record => `
            <div class="record-item p-3 border border-gray-200 rounded-lg">
                <div class="flex items-start justify-between mb-2">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="px-2 py-1 ${record.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} text-xs rounded">
                                ${record.status === 'success' ? '成功' : '失败'}
                            </span>
                            <span class="text-sm text-gray-500">${record.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</span>
                        </div>
                        <p class="text-sm text-gray-600">${record.message.length > 30 ? record.message.substring(0, 30) + '...' : record.message}</p>
                    </div>
                    <div class="text-xs text-gray-500 text-right">
                        <div>${record.time}</div>
                        <div class="${record.status === 'success' ? '' : 'text-red-600'}">
                            ${record.status === 'success' ? `¥${record.cost.toFixed(2)}` : record.statusText}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        // 如果记录超过20条，显示"查看更多"按钮
        if (records.length > 20) {
            recordsList.innerHTML += `
                <div class="text-center pt-4">
                    <button id="load-more-btn" class="text-[var(--secondary-color)] hover:text-orange-600 transition-colors text-sm">
                        查看更多记录 (${records.length - 20}条) <span class="material-symbols-outlined text-lg">keyboard_arrow_down</span>
                    </button>
                </div>
            `;

            // 绑定查看更多按钮
            const loadMoreBtn = document.getElementById('load-more-btn');
            if (loadMoreBtn) {
                loadMoreBtn.addEventListener('click', () => {
                    this.showAllRecords(records);
                });
            }
        }
    }

    showAllRecords(records) {
        // 在模态框中显示所有记录
        const modalContent = `
            <div class="max-h-96 overflow-y-auto space-y-2">
                ${records.map(record => `
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                <span class="px-2 py-1 ${record.status === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} text-xs rounded">
                                    ${record.status === 'success' ? '成功' : '失败'}
                                </span>
                                <span class="text-sm text-gray-500">${record.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')}</span>
                            </div>
                            <div class="text-sm text-gray-600">${record.message}</div>
                        </div>
                        <div class="text-xs text-gray-500 text-right">
                            <div>${record.time}</div>
                            <div class="${record.status === 'success' ? '' : 'text-red-600'}">
                                ${record.status === 'success' ? `¥${record.cost.toFixed(2)}` : record.statusText}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="mt-4 text-center">
                <button class="w-full py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors" onclick="this.closest('.fixed').remove()">
                    关闭
                </button>
            </div>
        `;

        const modal = this.createModal(`所有发送记录 (${records.length}条)`, modalContent);
        document.body.appendChild(modal);
    }

    getTimeRangeText(range) {
        const map = {
            'today': '今日',
            'week': '近7天',
            'month': '近30天',
            'custom': '自定义时间'
        };
        return map[range] || '今日';
    }

    exportSMSRecords() {
        const currentRange = document.querySelector('.time-filter-btn.active')?.dataset.range || 'today';
        const stats = this.getSMSStatistics(currentRange);

        if (stats.records.length === 0) {
            this.showNotification('暂无数据可导出', 'warning');
            return;
        }

        const timeRangeText = this.getTimeRangeText(currentRange);

        // 创建CSV内容
        const csvHeader = '时间,手机号,短信内容,发送状态,费用\\n';
        const csvContent = stats.records.map(record =>
            `${new Date(record.timestamp).toLocaleString()},${record.phone},"${record.message.replace(/"/g, '""')}",${record.status === 'success' ? '成功' : '失败'},${record.status === 'success' ? record.cost.toFixed(2) : '0'}`
        ).join('\\n');

        const csvData = csvHeader + csvContent;

        // 创建下载
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `短信发送记录_${timeRangeText}_${new Date().toLocaleDateString().replace(/\\//g, '-')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showNotification(`${timeRangeText}发送记录导出成功`, 'success');
    }

    updateHomePageStats() {
        // 更新首页的统计数据
        const todayStats = this.getSMSStatistics('today');

        const todaySentElement = document.querySelector('[data-today-sent]');
        const successRateElement = document.querySelector('[data-success-rate]');
        const avgTimeElement = document.querySelector('[data-avg-time]');

        if (todaySentElement) {
            if (todayStats.totalSent > 0) {
                todaySentElement.textContent = todayStats.totalSent;
                todaySentElement.classList.remove('text-gray-400');
                todaySentElement.classList.add('text-[var(--secondary-color)]');
            } else {
                todaySentElement.textContent = '0';
                todaySentElement.classList.add('text-gray-400');
                todaySentElement.classList.remove('text-[var(--secondary-color)]');
            }
        }

        if (successRateElement) {
            if (todayStats.totalSent > 0) {
                successRateElement.textContent = `${todayStats.successRate}%`;
                successRateElement.classList.remove('text-gray-400');
                successRateElement.classList.add('text-[var(--secondary-color)]');
            } else {
                successRateElement.textContent = '-';
                successRateElement.classList.add('text-gray-400');
                successRateElement.classList.remove('text-[var(--secondary-color)]');
            }
        }

        if (avgTimeElement) {
            if (todayStats.totalSent > 0) {
                avgTimeElement.textContent = '2.3s';
                avgTimeElement.classList.remove('text-gray-400');
                avgTimeElement.classList.add('text-[var(--secondary-color)]');
            } else {
                avgTimeElement.textContent = '-';
                avgTimeElement.classList.add('text-gray-400');
                avgTimeElement.classList.remove('text-[var(--secondary-color)]');
            }
        }
    }

    updateAboutPageStats() {
        // 更新我的账户页面的统计数据
        const allStats = this.getSMSStatistics('all');

        const totalSentElement = document.querySelector('[data-total-sent]');
        const successRateElement = document.querySelector('[data-success-rate]');

        if (totalSentElement) {
            totalSentElement.textContent = allStats.totalSent;
            if (allStats.totalSent > 0) {
                totalSentElement.classList.remove('text-gray-400');
                totalSentElement.classList.add('text-[var(--primary-color)]');
            }
        }

        if (successRateElement) {
            if (allStats.totalSent > 0) {
                successRateElement.textContent = `${allStats.successRate}%`;
                successRateElement.classList.remove('text-gray-400');
            } else {
                successRateElement.textContent = '-';
                successRateElement.classList.add('text-gray-400');
            }
        }
    }

    initAboutPage() {
        // 重新绑定关于页面事件
        const rechargeBtn = document.getElementById('recharge-btn');
        if (rechargeBtn) {
            rechargeBtn.addEventListener('click', this.handleRecharge.bind(this));
        }

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', this.handleLogout.bind(this));
        }

        // 绑定编辑资料按钮事件
        const editProfileBtn = document.getElementById('edit-profile-btn');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', this.handleEditProfile.bind(this));
        }

        // 更新用户信息显示
        this.updateUserInfo();

        // 更新统计数据
        this.updateAboutPageStats();
    }

    handleEditProfile() {
        console.log('编辑个人资料');

        // 根据用户类型显示不同的编辑界面
        const isPersonal = this.userInfo.userType === 'personal';

        const modalContent = isPersonal ? `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                    <input type="text" id="edit-name" value="${this.userInfo.name || '未设置'}" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="请输入您的姓名">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
                    <input type="tel" id="edit-phone" value="${this.userInfo.phone || ''}" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="请输入手机号">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">行业</label>
                    <select id="edit-industry" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                        <option value="未设置" ${this.userInfo.industry === '未设置' ? 'selected' : ''}>请选择行业</option>
                        <option value="互联网" ${this.userInfo.industry === '互联网' ? 'selected' : ''}>互联网</option>
                        <option value="教育" ${this.userInfo.industry === '教育' ? 'selected' : ''}>教育</option>
                        <option value="金融" ${this.userInfo.industry === '金融' ? 'selected' : ''}>金融</option>
                        <option value="医疗" ${this.userInfo.industry === '医疗' ? 'selected' : ''}>医疗</option>
                        <option value="电商" ${this.userInfo.industry === '电商' ? 'selected' : ''}>电商</option>
                        <option value="其他" ${this.userInfo.industry === '其他' ? 'selected' : ''}>其他</option>
                    </select>
                </div>
                <div class="flex gap-3 mt-6">
                    <button id="save-profile-btn" class="flex-1 bg-[var(--secondary-color)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                        保存
                    </button>
                    <button id="cancel-profile-btn" class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                        取消
                    </button>
                </div>
            </div>
        ` : `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">企业名称</label>
                    <input type="text" id="edit-company" value="${this.userInfo.company || '企业名称'}" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">联系人</label>
                    <input type="text" id="edit-name" value="${this.userInfo.name || '联系人'}" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
                    <input type="tel" id="edit-phone" value="${this.userInfo.phone || ''}" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                </div>
                <div class="flex gap-3 mt-6">
                    <button id="save-profile-btn" class="flex-1 bg-[var(--secondary-color)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                        保存
                    </button>
                    <button id="cancel-profile-btn" class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                        取消
                    </button>
                </div>
            </div>
        `;

        // 创建模态框
        const modal = this.createModal('编辑个人资料', modalContent);
        document.body.appendChild(modal);

        // 绑定保存和取消事件
        const saveBtn = modal.querySelector('#save-profile-btn');
        const cancelBtn = modal.querySelector('#cancel-profile-btn');

        saveBtn.addEventListener('click', () => {
            this.saveProfileInfo(modal, isPersonal);
        });

        cancelBtn.addEventListener('click', () => {
            modal.remove();
        });
    }

    saveProfileInfo(modal, isPersonal) {
        if (isPersonal) {
            const name = modal.querySelector('#edit-name').value.trim();
            const phone = modal.querySelector('#edit-phone').value.trim();
            const industry = modal.querySelector('#edit-industry').value;

            if (!name) {
                this.showNotification('请输入姓名', 'error');
                return;
            }

            if (!phone) {
                this.showNotification('请输入手机号', 'error');
                return;
            }

            // 验证手机号格式
            const phoneRegex = /^1[3-9]\d{9}$/;
            if (!phoneRegex.test(phone)) {
                this.showNotification('请输入正确的手机号格式', 'error');
                return;
            }

            // 更新用户信息
            this.userInfo = {
                ...this.userInfo,
                name: name,
                phone: phone,
                industry: industry
            };
            this.saveUserInfo();
            this.showNotification('个人资料保存成功！', 'success');

            // 刷新页面显示
            this.updateUserInfo();
        } else {
            const company = modal.querySelector('#edit-company').value.trim();
            const name = modal.querySelector('#edit-name').value.trim();
            const phone = modal.querySelector('#edit-phone').value.trim();

            if (!company || !name || !phone) {
                this.showNotification('请填写完整信息', 'error');
                return;
            }

            // 更新企业用户信息
            this.userInfo = {
                ...this.userInfo,
                company: company,
                name: name,
                phone: phone
            };
            this.saveUserInfo();
            this.showNotification('企业资料保存成功！', 'success');

            // 刷新页面显示
            this.updateUserInfo();
        }

        modal.remove();
    }

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

    updateUserInfo() {
        if (!this.userInfo) return;

        // 更新手机号显示
        const phoneElements = document.querySelectorAll('[data-user-phone]');
        phoneElements.forEach(el => {
            el.textContent = this.userInfo.phone || '未设置';
        });

        // 更新企业名称
        const companyElements = document.querySelectorAll('[data-company-name]');
        companyElements.forEach(el => {
            el.textContent = this.userInfo.companyName || '个人用户';
        });

        // 更新联系人姓名
        const nameElements = document.querySelectorAll('[data-contact-name]');
        nameElements.forEach(el => {
            el.textContent = this.userInfo.contactName || '未设置';
        });

        // 更新行业信息
        const industryElements = document.querySelectorAll('[data-industry]');
        industryElements.forEach(el => {
            const industryMap = {
                'retail': '零售电商',
                'finance': '金融服务',
                'education': '教育培训',
                'healthcare': '医疗健康',
                'real-estate': '房地产',
                'logistics': '物流快递',
                'restaurant': '餐饮服务',
                'technology': '科技互联网',
                'other': '其他'
            };
            el.textContent = industryMap[this.userInfo.industry] || '未设置';
        });

        // 更新免费额度（显示总余额）
        const quotaElements = document.querySelectorAll('[data-free-quota]');
        quotaElements.forEach(el => {
            // 显示总余额（免费额度 + 充值余额）
            const totalBalance = (this.userInfo.freeSmsQuota || 0) + (this.userInfo.smsBalance || 0);
            el.textContent = totalBalance.toString();
        });

        // 更新试用天数
        const trialElements = document.querySelectorAll('[data-trial-days]');
        trialElements.forEach(el => {
            el.textContent = this.userInfo.trialDaysLeft || '0';
        });

        // 更新注册时间
        const regTimeElements = document.querySelectorAll('[data-reg-time]');
        regTimeElements.forEach(el => {
            if (this.userInfo.registrationTime) {
                const date = new Date(this.userInfo.registrationTime);
                el.textContent = date.toLocaleDateString('zh-CN');
            } else {
                el.textContent = '未知';
            }
        });
    }

    async sendBulkSMS(contacts, message) {
        console.log('🚀 开始群发短信...');

        // 动态导入SMS插件
        try {
            // 在Web环境中模拟SMS插件
            if (!Capacitor.isNativePlatform()) {
                console.log('Web环境，使用模拟SMS功能');
                // Web环境模拟
                const SMS = {
                    send: async (options) => {
                        console.log('模拟SMS发送:', options);
                        return Promise.resolve();
                    }
                };

                for (const contact of contacts) {
                    try {
                        await SMS.send({
                            numbers: [contact],
                            text: message,
                        });
                        console.log(`✅ 模拟发送成功: ${contact}`);

                        // 记录发送成功
                        this.recordSMSSend(contact, message, 'success', '发送成功', 0.03);

                        this.showNotification(`模拟发送到 ${contact}`, 'success');
                        await this.delay(500);
                    } catch (error) {
                        console.error(`❌ 发送失败 ${contact}:`, error);

                        // 记录发送失败
                        this.recordSMSSend(contact, message, 'failed', error.message || '发送失败', 0);

                        this.showNotification(`发送失败: ${contact}`, 'error');
                    }
                }
            } else {
                // 真实设备上的SMS插件
                const { SMS } = await import('@byteowls/capacitor-sms');

                for (const contact of contacts) {
                    try {
                        await SMS.send({
                            numbers: [contact],
                            text: message,
                        });
                        console.log(`✅ 发送成功: ${contact}`);

                        // 记录发送成功
                        this.recordSMSSend(contact, message, 'success', '发送成功', 0.03);

                        this.showNotification(`已发送到 ${contact}`, 'success');
                        await this.delay(500);
                    } catch (error) {
                        console.error(`❌ 发送失败 ${contact}:`, error);

                        // 记录发送失败
                        this.recordSMSSend(contact, message, 'failed', error.message || '发送失败', 0);

                        this.showNotification(`发送失败: ${contact}`, 'error');
                    }
                }
            }
        } catch (error) {
            console.error('SMS插件加载失败:', error);
            this.showNotification('SMS功能不可用', 'error');
        }
    }

    handleFeatureAction(action) {
        console.log('功能操作:', action);

        switch(action) {
            case 'contacts':
                this.showPage('contacts');
                break;
            case 'templates':
                this.showPage('templates');
                break;
            case 'tasks':
                this.showPage('tasks');
                break;
            case 'analytics':
                this.showPage('analytics');
                break;
            case 'settings':
                this.showPage('about');
                break;
            default:
                this.showNotification(`${action} 功能开发中...`, 'info');
        }
    }

    updateNavigationVisibility(pageName) {
        const footer = document.querySelector('footer');
        if (footer) {
            // 登录页面隐藏导航栏
            if (pageName === 'login') {
                footer.style.display = 'none';
            } else {
                footer.style.display = 'block';
            }
        }
    }

    handleLoginSubmit(e) {
        e.preventDefault();
        console.log('登录表单提交');

        const formData = new FormData(e.target);
        const phone = formData.get('phone');
        const smsCode = formData.get('smsCode');

        // 表单验证
        if (!this.validatePhone(phone)) {
            this.showNotification('请输入正确的手机号码', 'error');
            return;
        }

        if (!smsCode || smsCode.length !== 6) {
            this.showNotification('请输入6位验证码', 'error');
            return;
        }

        // 显示登录中状态
        const submitBtn = document.getElementById('login-submit-btn');
        this.setButtonLoading(submitBtn, true, '登录中...');

        // 模拟登录验证
        setTimeout(() => {
            // 简单验证码验证（实际开发中应该调用后端API）
            if (smsCode === '123456') {
                this.isLoggedIn = true;
                this.userInfo = {
                    phone: phone,
                    loginTime: new Date().toISOString()
                };

                this.showNotification('登录成功！', 'success');

                // 关闭登录弹窗
                const loginModal = document.getElementById('login-modal-bg');
                if (loginModal) {
                    loginModal.classList.add('hidden');
                }

                setTimeout(() => {
                    this.showPage('home');
                }, 1000);
            } else {
                this.showNotification('验证码错误，请重新输入', 'error');
            }

            this.setButtonLoading(submitBtn, false, '登录');
        }, 1500);
    }

    handleRegisterSubmit(e) {
        e.preventDefault();
        console.log('注册表单提交');

        const formData = new FormData(e.target);
        const data = {
            companyName: formData.get('companyName'),
            contactName: formData.get('contactName'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            industry: formData.get('industry')
        };

        // 表单验证
        if (!data.companyName.trim()) {
            this.showNotification('请输入企业名称', 'error');
            return;
        }

        if (!data.contactName.trim()) {
            this.showNotification('请输入联系人姓名', 'error');
            return;
        }

        if (!this.validatePhone(data.phone)) {
            this.showNotification('请输入正确的手机号码', 'error');
            return;
        }

        if (data.email && !this.validateEmail(data.email)) {
            this.showNotification('请输入正确的邮箱地址', 'error');
            return;
        }

        // 显示注册中状态
        const submitBtn = document.getElementById('register-submit-btn');
        this.setButtonLoading(submitBtn, true, '注册中...');

        // 模拟注册流程
        setTimeout(() => {
            // 保存用户信息
            this.userInfo = {
                ...data,
                registrationTime: new Date().toISOString(),
                freeSmsQuota: 100,
                trialDaysLeft: 7
            };

            this.showNotification('注册成功！正在为您登录...', 'success');

            // 关闭注册弹窗
            const loginModal = document.getElementById('login-modal-bg');
            if (loginModal) {
                loginModal.classList.add('hidden');
            }

            setTimeout(() => {
                this.isLoggedIn = true;
                this.showPage('home');
            }, 1500);

            this.setButtonLoading(submitBtn, false, '注册账户');
        }, 2000);
    }

    handleSendCode() {
        const phoneInput = document.getElementById('phone');
        const sendCodeBtn = document.getElementById('send-code-btn');
        const phone = phoneInput.value.trim();

        if (!this.validatePhone(phone)) {
            this.showNotification('请先输入正确的手机号码', 'error');
            phoneInput.focus();
            return;
        }

        // 设置按钮为发送中状态
        let countdown = 60;
        sendCodeBtn.disabled = true;
        sendCodeBtn.textContent = `发送中...`;

        // 模拟发送验证码
        setTimeout(() => {
            this.showNotification('验证码已发送，请注意查收', 'success');

            // 开始倒计时
            const timer = setInterval(() => {
                sendCodeBtn.textContent = `${countdown}秒后重发`;
                countdown--;

                if (countdown < 0) {
                    clearInterval(timer);
                    sendCodeBtn.disabled = false;
                    sendCodeBtn.textContent = '发送验证码';
                }
            }, 1000);
        }, 1000);
    }

    setButtonLoading(button, isLoading, loadingText = '加载中...') {
        if (isLoading) {
            button.disabled = true;
            button.dataset.originalText = button.innerHTML;
            button.innerHTML = `
                <span class="material-symbols-outlined animate-spin">refresh</span>
                <span>${loadingText}</span>
            `;
        } else {
            button.disabled = false;
            button.innerHTML = button.dataset.originalText || button.innerHTML;
        }
    }

    validatePhone(phone) {
        const phoneRegex = /^1[3-9]\d{9}$/;
        return phoneRegex.test(phone);
    }

    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    handleLogout() {
        console.log('退出登录');
        const confirmed = confirm('确定要退出登录吗？');
        if (confirmed) {
            this.isLoggedIn = false;
            this.showNotification('已退出登录', 'success');
            // 返回登录页
            setTimeout(() => {
                this.showPage('login');
            }, 1000);
        }
    }

    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `
            fixed top-4 left-1/2 transform -translate-x-1/2 z-50
            px-4 py-2 rounded-lg text-white text-sm font-medium
            animate-pulse max-w-xs text-center
            ${type === 'success' ? 'bg-green-500' :
              type === 'error' ? 'bg-red-500' :
              type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // 3秒后自动移除
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'block';
        }
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = 'none';
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 数据持久化方法
    loadTemplatesData() {
        try {
            const stored = localStorage.getItem('sms_templates_data');
            if (stored) {
                return JSON.parse(stored);
            } else {
                // 返回默认模板数据
                return [
                    {
                        id: 1,
                        title: '登录验证码',
                        content: '您的验证码是{code}，5分钟内有效，请勿泄露给他人。',
                        type: '验证码',
                        category: 'verification'
                    },
                    {
                        id: 2,
                        title: '限时优惠活动',
                        content: '{company}限时优惠！{product}现在下单享8折优惠，仅限今日！立即购买：{link}',
                        type: '营销推广',
                        category: 'marketing'
                    },
                    {
                        id: 3,
                        title: '订单发货通知',
                        content: '{name}您好，您的订单{order_no}已发货，快递单号：{tracking_no}，预计{date}送达。',
                        type: '通知提醒',
                        category: 'notification'
                    }
                ];
            }
        } catch (error) {
            console.error('加载模板数据失败:', error);
            return [
                {
                    id: 1,
                    title: '登录验证码',
                    content: '您的验证码是{code}，5分钟内有效，请勿泄露给他人。',
                    type: '验证码',
                    category: 'verification'
                },
                {
                    id: 2,
                    title: '限时优惠活动',
                    content: '{company}限时优惠！{product}现在下单享8折优惠，仅限今日！立即购买：{link}',
                    type: '营销推广',
                    category: 'marketing'
                },
                {
                    id: 3,
                    title: '订单发货通知',
                    content: '{name}您好，您的订单{order_no}已发货，快递单号：{tracking_no}，预计{date}送达。',
                    type: '通知提醒',
                    category: 'notification'
                }
            ];
        }
    }

    saveTemplatesData() {
        try {
            localStorage.setItem('sms_templates_data', JSON.stringify(this.templatesData));
        } catch (error) {
            console.error('保存模板数据失败:', error);
        }
    }

    loadUserInfo() {
        try {
            const stored = localStorage.getItem('sms_user_info');
            if (stored) {
                return JSON.parse(stored);
            } else {
                // 返回默认用户信息
                return {
                    userType: 'personal', // personal或enterprise
                    name: '未设置',
                    phone: '18069413066',
                    company: '未设置',
                    industry: '未设置',
                    registrationTime: new Date().toISOString(),
                    freeSmsQuota: 100, // 免费短信额度
                    smsBalance: 0, // 充值短信余额
                    trialDaysLeft: 7
                };
            }
        } catch (error) {
            console.error('加载用户信息失败:', error);
            return {
                userType: 'personal',
                name: '未设置',
                phone: '18069413066',
                company: '未设置',
                industry: '未设置',
                registrationTime: new Date().toISOString()
            };
        }
    }

    saveUserInfo() {
        try {
            localStorage.setItem('sms_user_info', JSON.stringify(this.userInfo));
        } catch (error) {
            console.error('保存用户信息失败:', error);
        }
    }

    loadContactGroups() {
        try {
            const stored = localStorage.getItem('sms_contact_groups');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('加载联系人分组失败:', error);
            return [];
        }
    }

    saveContactGroups() {
        try {
            localStorage.setItem('sms_contact_groups', JSON.stringify(this.contactGroups));
        } catch (error) {
            console.error('保存联系人分组失败:', error);
        }
    }

    loadContacts() {
        try {
            const stored = localStorage.getItem('sms_contacts');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('加载联系人失败:', error);
            return [];
        }
    }

    saveContacts() {
        try {
            localStorage.setItem('sms_contacts', JSON.stringify(this.contacts));
        } catch (error) {
            console.error('保存联系人失败:', error);
        }
    }

    // 加载并显示分组
    loadAndDisplayGroups() {
        const groupsList = document.getElementById('groups-list');
        if (!groupsList) return;

        // 渲染已保存的分组
        this.contactGroups.forEach(group => {
            this.addGroupToList(group, false); // false表示不保存到localStorage
        });
    }

    // 加载并显示联系人
    loadAndDisplayContacts() {
        const contactsList = document.getElementById('contacts-list');
        if (!contactsList) return;

        // 只显示简单提示，不显示具体联系人
        contactsList.innerHTML = `
            <div class="text-center text-gray-500 py-8">
                <span class="material-symbols-outlined text-4xl mb-2">group</span>
                <p>联系人已按分组管理</p>
                <p class="text-sm">点击分组的编辑按钮查看分组内的联系人</p>
            </div>
        `;
    }

    // 添加联系人到指定的分组容器
    addContactToGroupContainer(contact, container) {
        // 创建联系人元素
        const contactItem = document.createElement('div');
        contactItem.className = 'contact-item flex items-center justify-between p-3 border border-gray-200 rounded-lg';
        contactItem.innerHTML = `
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-[var(--secondary-color)] text-white rounded-full flex items-center justify-center font-medium">
                    ${contact.name.charAt(0)}
                </div>
                <div>
                    <p class="font-medium">${contact.name}</p>
                    <p class="text-sm text-gray-500">${contact.phone}</p>
                    ${contact.remark ? `<p class="text-xs text-gray-400">${contact.remark}</p>` : ''}
                </div>
            </div>
            <div class="flex items-center gap-2">
                <button class="edit-contact-btn text-gray-400 hover:text-[var(--secondary-color)] transition-colors" data-contact-id="${contact.id}">
                    <span class="material-symbols-outlined">edit</span>
                </button>
                <button class="delete-contact-btn text-gray-400 hover:text-red-500 transition-colors" data-contact-id="${contact.id}">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        `;

        container.appendChild(contactItem);

        // 绑定编辑和删除按钮事件
        const editBtn = contactItem.querySelector('.edit-contact-btn');
        const deleteBtn = contactItem.querySelector('.delete-contact-btn');

        editBtn.addEventListener('click', () => {
            this.showNotification('编辑联系人功能开发中...', 'info');
        });

        deleteBtn.addEventListener('click', () => {
            if (confirm('确定要删除这个联系人吗？')) {
                // 从全局数据中删除
                const contactIndex = this.contacts.findIndex(c => c.id === contact.id);
                if (contactIndex !== -1) {
                    this.contacts.splice(contactIndex, 1);
                    this.saveContacts();
                }

                // 重新渲染联系人列表
                this.loadAndDisplayContacts();

                // 更新分组数量
                this.updateGroupContactCounts();

                this.showNotification('联系人删除成功', 'success');
            }
        });
    }

    showGroupContactsDialog(groupId, groupName) {
        // 获取该分组下的所有联系人
        const groupContacts = this.contacts.filter(contact => contact.group === groupId);

        // 创建对话框HTML
        const dialogHTML = `
            <div id="group-contacts-modal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                    <div class="p-4 border-b border-gray-200 flex items-center justify-between">
                        <h3 class="text-lg font-bold text-[var(--primary-color)]">${groupName} (${groupContacts.length} 个联系人)</h3>
                        <div class="flex items-center gap-2">
                            <button id="export-group-contacts" class="text-[var(--secondary-color)] hover:bg-gray-100 p-2 rounded-lg" title="导出联系人">
                                <span class="material-symbols-outlined">download</span>
                            </button>
                            <button id="close-group-contacts-modal" class="text-gray-400 hover:text-gray-600">
                                <span class="material-symbols-outlined">close</span>
                            </button>
                        </div>
                    </div>
                    <div class="p-4 overflow-y-auto max-h-96">
                        <div id="group-contacts-list" class="space-y-2">
                            ${groupContacts.length === 0 ?
                                `<div class="text-center text-gray-500 py-8">
                                    <span class="material-symbols-outlined text-4xl mb-2">person_off</span>
                                    <p>此分组暂无联系人</p>
                                </div>` :
                                groupContacts.map(contact => `
                                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg contact-item" data-contact-id="${contact.id}">
                                        <div>
                                            <div class="font-medium">${contact.name}</div>
                                            <div class="text-sm text-gray-500">${contact.phone}</div>
                                            ${contact.remark ? `<div class="text-xs text-gray-400">${contact.remark}</div>` : ''}
                                        </div>
                                        <button class="delete-group-contact-btn text-gray-400 hover:text-red-500 transition-colors" data-contact-id="${contact.id}">
                                            <span class="material-symbols-outlined">delete</span>
                                        </button>
                                    </div>
                                `).join('')
                            }
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 添加对话框到页面
        document.body.insertAdjacentHTML('beforeend', dialogHTML);

        // 绑定关闭事件
        const modal = document.getElementById('group-contacts-modal');
        const closeBtn = document.getElementById('close-group-contacts-modal');

        const closeModal = () => {
            modal.remove();
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // 绑定导出事件
        const exportBtn = document.getElementById('export-group-contacts');
        exportBtn.addEventListener('click', () => {
            this.exportGroupContacts(groupContacts, groupName);
        });

        // 绑定删除联系人事件
        const deleteButtons = modal.querySelectorAll('.delete-group-contact-btn');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const contactId = parseInt(e.target.closest('button').dataset.contactId);
                this.deleteContactFromGroup(contactId, groupId, groupName);
            });
        });
    }

    exportGroupContacts(contacts, groupName) {
        if (contacts.length === 0) {
            this.showNotification('该分组暂无联系人可导出', 'warning');
            return;
        }

        // 创建CSV内容
        const csvHeader = '姓名,手机号,备注,添加时间\n';
        const csvContent = contacts.map(contact =>
            `${contact.name},${contact.phone},${contact.remark || ''},${contact.createdAt}`
        ).join('\n');

        const csvData = csvHeader + csvContent;

        // 创建下载链接
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${groupName}_联系人_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.showNotification(`${groupName} 联系人导出成功`, 'success');
    }

    deleteContactFromGroup(contactId, groupId, groupName) {
        if (confirm('确定要删除这个联系人吗？')) {
            // 从全局数据中删除
            const contactIndex = this.contacts.findIndex(c => c.id === contactId);
            if (contactIndex !== -1) {
                this.contacts.splice(contactIndex, 1);
                this.saveContacts();
            }

            // 更新分组数量
            this.updateGroupContactCounts();

            // 重新打开对话框以刷新显示
            document.getElementById('group-contacts-modal').remove();
            this.showGroupContactsDialog(groupId, groupName);

            this.showNotification('联系人删除成功', 'success');
        }
    }

    // 短信发送记录管理方法
    recordSMSSend(phone, message, status, statusText, cost) {
        const record = {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            phone: phone,
            message: message,
            status: status, // 'success' or 'failed'
            statusText: statusText,
            cost: cost,
            timestamp: new Date().toISOString(),
            time: new Date().toLocaleTimeString('zh-CN', { hour12: false })
        };

        // 获取现有记录
        let records = this.loadSMSRecords();

        // 添加新记录到开头
        records.unshift(record);

        // 保存记录
        this.saveSMSRecords(records);

        // 更新用户余额（如果发送成功）
        if (status === 'success') {
            this.deductUserBalance(1); // 每条成功发送的短信扣除1条
        }

        console.log('📝 短信发送记录已保存:', record);
    }

    loadSMSRecords() {
        try {
            const stored = localStorage.getItem('sms_send_records');
            if (stored) {
                const records = JSON.parse(stored);
                // 自动清理一周以前的记录
                return this.cleanOldRecords(records);
            }
            return [];
        } catch (error) {
            console.error('加载短信记录失败:', error);
            return [];
        }
    }

    saveSMSRecords(records) {
        try {
            // 清理旧记录后再保存
            const cleanRecords = this.cleanOldRecords(records);
            localStorage.setItem('sms_send_records', JSON.stringify(cleanRecords));
        } catch (error) {
            console.error('保存短信记录失败:', error);
        }
    }

    cleanOldRecords(records) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        return records.filter(record => {
            const recordDate = new Date(record.timestamp);
            return recordDate >= oneWeekAgo;
        });
    }

    deductUserBalance(smsCount = 1) {
        // 按条数扣除，先从充值余额扣除，再从免费额度扣除
        let remainingToDeduct = smsCount;

        // 先从充值余额扣除
        if (this.userInfo.smsBalance && this.userInfo.smsBalance > 0) {
            const deductFromPaid = Math.min(this.userInfo.smsBalance, remainingToDeduct);
            this.userInfo.smsBalance -= deductFromPaid;
            remainingToDeduct -= deductFromPaid;
        }

        // 如果还有需要扣除的，从免费额度扣除
        if (remainingToDeduct > 0 && this.userInfo.freeSmsQuota && this.userInfo.freeSmsQuota > 0) {
            const deductFromFree = Math.min(this.userInfo.freeSmsQuota, remainingToDeduct);
            this.userInfo.freeSmsQuota -= deductFromFree;
            remainingToDeduct -= deductFromFree;
        }

        this.saveUserInfo();
        this.updateUserInfo(); // 更新页面显示

        console.log(`📱 扣除 ${smsCount} 条短信，充值余额: ${this.userInfo.smsBalance}条，免费额度: ${this.userInfo.freeSmsQuota}条`);
    }

    // 检查用户是否有足够余额发送指定条数的短信
    checkSMSBalance(smsCount) {
        const totalBalance = (this.userInfo.smsBalance || 0) + (this.userInfo.freeSmsQuota || 0);
        return totalBalance >= smsCount;
    }

    // 获取用户总余额（充值+免费）
    getTotalSMSBalance() {
        return (this.userInfo.smsBalance || 0) + (this.userInfo.freeSmsQuota || 0);
    }

    getSMSStatistics(timeRange = 'today') {
        const records = this.loadSMSRecords();
        const now = new Date();
        let startDate;

        switch (timeRange) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(0); // 所有记录
        }

        const filteredRecords = records.filter(record => {
            const recordDate = new Date(record.timestamp);
            return recordDate >= startDate;
        });

        const totalSent = filteredRecords.length;
        const successCount = filteredRecords.filter(r => r.status === 'success').length;
        const totalCost = filteredRecords.reduce((sum, r) => sum + (r.cost || 0), 0);
        const successRate = totalSent > 0 ? Math.round((successCount / totalSent) * 100) : 0;

        return {
            totalSent,
            successCount,
            successRate,
            totalCost: totalCost.toFixed(2),
            records: filteredRecords
        };
    }

    startPeriodicCleanup() {
        // 启动时立即执行一次清理
        this.performPeriodicCleanup();

        // 设置定时器，每24小时执行一次清理
        setInterval(() => {
            this.performPeriodicCleanup();
        }, 24 * 60 * 60 * 1000); // 24小时
    }

    performPeriodicCleanup() {
        try {
            const records = this.loadSMSRecords();
            const originalCount = records.length;

            // cleanOldRecords 方法会自动过滤掉一周前的记录
            const cleanedRecords = this.cleanOldRecords(records);

            if (cleanedRecords.length < originalCount) {
                // 保存清理后的记录
                localStorage.setItem('sms_send_records', JSON.stringify(cleanedRecords));
                console.log(`🧹 清理了 ${originalCount - cleanedRecords.length} 条过期记录，剩余 ${cleanedRecords.length} 条`);
            }
        } catch (error) {
            console.error('定期清理记录失败:', error);
        }
    }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
    window.smsApp = new SMSMessengerApp();
});

// 如果是PWA环境，注册Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(error => console.log('SW registration failed'));
    });
}