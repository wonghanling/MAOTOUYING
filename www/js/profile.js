// 个人中心页面专用交互逻辑
class ProfilePage {
    constructor() {
        this.currentTab = 'profile';
        this.userBalance = 1024;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupAccountActions();
        this.setupButtons();
        this.loadUserData();
        this.addPageAnimation();
        this.updateProfileDisplay(); // 初始化时更新显示
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
            case 'send':
                console.log('跳转到发短信页面');
                // window.location.href = 'send.html';
                break;
            case 'templates':
                console.log('跳转到模板页面');
                // window.location.href = 'templates.html';
                break;
            case 'profile':
                console.log('当前在个人中心');
                break;
        }
    }

    // 设置账户操作
    setupAccountActions() {
        const accountItems = document.querySelectorAll('.account-item');

        accountItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const action = item.dataset.action;
                this.handleAccountAction(action);
            });
        });
    }

    // 处理账户操作
    handleAccountAction(action) {
        switch(action) {
            case 'records':
                this.showConsumptionRecords();
                break;
            case 'templates':
                this.showMyTemplates();
                break;
            case 'contacts':
                this.showContactManagement();
                break;
            case 'help':
                this.showHelpCenter();
                break;
            case 'notifications':
                this.showNotificationSettings();
                break;
            case 'security':
                this.showSecuritySettings();
                break;
            case 'about':
                this.showAboutApp();
                break;
        }
    }

    // 设置按钮交互
    setupButtons() {
        // 刷新按钮
        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', this.handleRefresh.bind(this));
        }

        // 编辑资料按钮
        const editProfileBtn = document.getElementById('edit-profile-btn');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', this.handleEditProfile.bind(this));
        }

        // 充值按钮
        const rechargeBtn = document.getElementById('recharge-btn');
        if (rechargeBtn) {
            rechargeBtn.addEventListener('click', this.handleRecharge.bind(this));
        }

        // 退出登录按钮
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', this.handleLogout.bind(this));
        }
    }

    // 处理刷新
    handleRefresh() {
        console.log('刷新数据');

        const refreshBtn = document.getElementById('refresh-btn');
        if (refreshBtn) {
            // 添加旋转动画
            refreshBtn.style.transform = 'rotate(360deg)';
            refreshBtn.style.transition = 'transform 0.5s ease';

            setTimeout(() => {
                refreshBtn.style.transform = '';
            }, 500);
        }

        // 模拟数据刷新
        this.loadUserData();

        if (window.smsApp) {
            window.smsApp.showNotification('数据已刷新', 'success');
        }
    }

    // 处理编辑资料
    handleEditProfile() {
        console.log('编辑资料');

        // 获取主应用的用户信息
        const userInfo = window.smsApp ? window.smsApp.userInfo : {
            userType: 'personal',
            name: '未设置',
            phone: '18069413066',
            company: '未设置',
            industry: '未设置'
        };

        // 根据用户类型显示不同的编辑界面
        const isPersonal = userInfo.userType === 'personal';

        const modalContent = isPersonal ? `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                    <input type="text" id="edit-name" value="${userInfo.name || '未设置'}" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="请输入您的姓名">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
                    <input type="tel" id="edit-phone" value="${userInfo.phone || ''}" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent" placeholder="请输入手机号">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">行业</label>
                    <select id="edit-industry" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                        <option value="未设置" ${userInfo.industry === '未设置' ? 'selected' : ''}>请选择行业</option>
                        <option value="互联网" ${userInfo.industry === '互联网' ? 'selected' : ''}>互联网</option>
                        <option value="教育" ${userInfo.industry === '教育' ? 'selected' : ''}>教育</option>
                        <option value="金融" ${userInfo.industry === '金融' ? 'selected' : ''}>金融</option>
                        <option value="医疗" ${userInfo.industry === '医疗' ? 'selected' : ''}>医疗</option>
                        <option value="电商" ${userInfo.industry === '电商' ? 'selected' : ''}>电商</option>
                        <option value="其他" ${userInfo.industry === '其他' ? 'selected' : ''}>其他</option>
                    </select>
                </div>
                <div class="flex gap-3 mt-6">
                    <button id="save-profile-btn" class="flex-1 bg-[var(--brand-orange)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
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
                    <input type="text" id="edit-company" value="${userInfo.company || '上海知名的互联网公司'}" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">联系人</label>
                    <input type="text" id="edit-name" value="${userInfo.name || '王经理'}" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
                    <input type="tel" id="edit-phone" value="${userInfo.phone || '138****8888'}" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                </div>
                <div class="flex gap-3 mt-6">
                    <button id="save-profile-btn" class="flex-1 bg-[var(--brand-orange)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
                        保存
                    </button>
                    <button id="cancel-profile-btn" class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
                        取消
                    </button>
                </div>
            </div>
        `;

        const modal = this.createModal('编辑资料', modalContent);
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

    // 保存个人资料信息
    saveProfileInfo(modal, isPersonal) {
        if (isPersonal) {
            const name = modal.querySelector('#edit-name').value.trim();
            const phone = modal.querySelector('#edit-phone').value.trim();
            const industry = modal.querySelector('#edit-industry').value;

            if (!name) {
                alert('请输入姓名');
                return;
            }

            if (!phone) {
                alert('请输入手机号');
                return;
            }

            // 验证手机号格式
            const phoneRegex = /^1[3-9]\d{9}$/;
            if (!phoneRegex.test(phone)) {
                alert('请输入正确的手机号格式');
                return;
            }

            // 更新用户信息
            if (window.smsApp) {
                window.smsApp.userInfo = {
                    ...window.smsApp.userInfo,
                    name: name,
                    phone: phone,
                    industry: industry
                };
                window.smsApp.saveUserInfo();
                window.smsApp.showNotification('个人资料保存成功！', 'success');

                // 刷新页面显示
                this.updateProfileDisplay();
            }
        } else {
            const company = modal.querySelector('#edit-company').value.trim();
            const name = modal.querySelector('#edit-name').value.trim();
            const phone = modal.querySelector('#edit-phone').value.trim();

            if (!company || !name || !phone) {
                alert('请填写完整信息');
                return;
            }

            // 更新企业用户信息
            if (window.smsApp) {
                window.smsApp.userInfo = {
                    ...window.smsApp.userInfo,
                    company: company,
                    name: name,
                    phone: phone
                };
                window.smsApp.saveUserInfo();
                window.smsApp.showNotification('企业资料保存成功！', 'success');

                // 刷新页面显示
                this.updateProfileDisplay();
            }
        }

        modal.remove();
    }

    // 更新资料显示
    updateProfileDisplay() {
        const userInfo = window.smsApp ? window.smsApp.userInfo : {};

        // 更新个人信息显示区域
        const profileSection = document.querySelector('.bg-white.rounded-xl.shadow-sm.p-4');
        if (profileSection) {
            const nameElement = profileSection.querySelector('p.text-lg.font-bold');
            const paragraphs = profileSection.querySelectorAll('p.text-sm.text-\\[var\\(--neutral-text-secondary\\)\\]');

            if (nameElement) {
                nameElement.textContent = userInfo.userType === 'enterprise'
                    ? (userInfo.company || '企业用户')
                    : '个人用户';
            }

            // 更新所有信息字段
            if (paragraphs.length >= 3) {
                paragraphs[0].textContent = `联系人：${userInfo.name || '未设置'}`;
                paragraphs[1].textContent = `手机：${userInfo.phone || '未设置'}`;
                paragraphs[2].textContent = `行业：${userInfo.industry || '未设置'}`;
            }

            // 更新注册时间显示
            const timeElement = profileSection.querySelector('span.text-xs.text-green-600');
            if (timeElement && userInfo.registrationTime) {
                const regTime = new Date(userInfo.registrationTime);
                timeElement.textContent = `注册时间：${regTime.toLocaleDateString()}`;
            }
        }
    }

    // 处理充值
    handleRecharge() {
        console.log('充值');

        const modal = this.createModal('选择充值套餐', `
            <div class="space-y-3">
                <div class="border border-gray-200 rounded-lg p-3 hover:border-orange-500 cursor-pointer transition-colors">
                    <div class="flex justify-between items-center">
                        <span class="font-medium">1000条短信</span>
                        <span class="text-orange-600 font-bold">¥60</span>
                    </div>
                    <div class="text-sm text-gray-500">适合小型企业</div>
                </div>
                <div class="border border-gray-200 rounded-lg p-3 hover:border-orange-500 cursor-pointer transition-colors">
                    <div class="flex justify-between items-center">
                        <span class="font-medium">5000条短信</span>
                        <span class="text-orange-600 font-bold">¥250</span>
                    </div>
                    <div class="text-sm text-gray-500">推荐套餐，性价比高</div>
                </div>
                <div class="border border-gray-200 rounded-lg p-3 hover:border-orange-500 cursor-pointer transition-colors">
                    <div class="flex justify-between items-center">
                        <span class="font-medium">10000条短信</span>
                        <span class="text-orange-600 font-bold">¥400</span>
                    </div>
                    <div class="text-sm text-gray-500">大客户专享</div>
                </div>
                <div class="flex gap-3 mt-6">
                    <button class="flex-1 bg-[var(--brand-orange)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity" onclick="this.closest('.fixed').remove()">
                        立即支付
                    </button>
                    <button class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors" onclick="this.closest('.fixed').remove()">
                        取消
                    </button>
                </div>
            </div>
        `);

        document.body.appendChild(modal);
    }

    // 处理退出登录
    handleLogout() {
        console.log('退出登录');

        const modal = this.createModal('退出登录', `
            <div class="text-center">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span class="material-symbols-outlined text-red-600 text-2xl">logout</span>
                </div>
                <p class="text-gray-600 mb-6">确定要退出登录吗？</p>
                <div class="flex gap-3">
                    <button class="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors" onclick="this.confirmLogout()">
                        确定退出
                    </button>
                    <button class="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors" onclick="this.closest('.fixed').remove()">
                        取消
                    </button>
                </div>
            </div>
        `);

        // 添加确认退出方法到window对象，以便模态框内调用
        window.confirmLogout = () => {
            modal.remove();
            if (window.smsApp) {
                window.smsApp.showNotification('已退出登录', 'success');
            }
            // 这里实际项目中会跳转到登录页
            setTimeout(() => {
                alert('跳转到登录页面');
            }, 500);
        };

        document.body.appendChild(modal);
    }

    // 显示消费记录
    showConsumptionRecords() {
        console.log('查看消费记录');

        const modal = this.createModal('消费记录', `
            <div class="space-y-3 max-h-64 overflow-y-auto">
                <div class="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                        <div class="font-medium">营销短信发送</div>
                        <div class="text-sm text-gray-500">2024-01-15 10:30</div>
                    </div>
                    <div class="text-red-600">-156条</div>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                        <div class="font-medium">验证码发送</div>
                        <div class="text-sm text-gray-500">2024-01-14 16:20</div>
                    </div>
                    <div class="text-red-600">-23条</div>
                </div>
                <div class="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                        <div class="font-medium">账户充值</div>
                        <div class="text-sm text-gray-500">2024-01-13 09:15</div>
                    </div>
                    <div class="text-green-600">+1000条</div>
                </div>
            </div>
            <button class="w-full mt-4 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors" onclick="this.closest('.fixed').remove()">
                关闭
            </button>
        `);

        document.body.appendChild(modal);
    }

    // 显示我的模板
    showMyTemplates() {
        console.log('查看我的模板');
        if (window.smsApp) {
            window.smsApp.showNotification('跳转到模板管理', 'info');
        }
    }

    // 显示联系人管理
    showContactManagement() {
        console.log('联系人管理');
        if (window.smsApp) {
            window.smsApp.showNotification('跳转到联系人管理', 'info');
        }
    }

    // 显示帮助中心
    showHelpCenter() {
        console.log('帮助中心');
        if (window.smsApp) {
            window.smsApp.showNotification('跳转到帮助中心', 'info');
        }
    }

    // 显示通知设置
    showNotificationSettings() {
        console.log('通知设置');

        const modal = this.createModal('通知设置', `
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <span>发送成功通知</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked class="sr-only peer">
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                </div>
                <div class="flex justify-between items-center">
                    <span>发送失败通知</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked class="sr-only peer">
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                </div>
                <div class="flex justify-between items-center">
                    <span>余额不足提醒</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked class="sr-only peer">
                        <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                </div>
                <button class="w-full mt-4 bg-[var(--brand-orange)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity" onclick="this.closest('.fixed').remove()">
                    保存设置
                </button>
            </div>
        `);

        document.body.appendChild(modal);
    }

    // 显示安全设置
    showSecuritySettings() {
        console.log('安全设置');
        if (window.smsApp) {
            window.smsApp.showNotification('安全设置功能开发中', 'info');
        }
    }

    // 显示关于应用
    showAboutApp() {
        console.log('关于应用');
        // 跳转到about页面
        this.switchTab('about');
    }

    // 加载用户数据
    loadUserData() {
        // 模拟API调用
        setTimeout(() => {
            this.updateBalance(this.userBalance);
            this.updateStats();
        }, 500);
    }

    // 更新余额显示
    updateBalance(newBalance) {
        const balanceElement = document.querySelector('.text-2xl.font-bold.text-\\[var\\(--brand-blue\\)\\]');
        if (balanceElement) {
            // 添加动画效果
            balanceElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                balanceElement.textContent = newBalance.toLocaleString();
                balanceElement.style.transform = 'scale(1)';
            }, 200);
        }
    }

    // 更新统计数据
    updateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(el => {
            el.classList.add('stat-number');
        });
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
    }
}

// 页面加载完成后初始化个人中心页面
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('profile.html') ||
        document.querySelector('.nav-item[data-page="profile"].active')) {
        window.profilePage = new ProfilePage();
    }
});

// 导出给其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProfilePage;
}