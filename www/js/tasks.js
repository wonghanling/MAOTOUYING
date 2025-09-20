// 任务管理页面交互逻辑
class TasksPage {
    constructor() {
        this.selectedContacts = [];
        this.selectedTemplate = null;
        this.currentFilter = 'all';
        this.tasks = this.loadTasks();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderTaskList();
        this.updateTaskSummary();
        console.log('任务页面初始化完成');
    }

    setupEventListeners() {
        // 返回按钮
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                window.history.back();
            });
        }

        // 选择联系人按钮
        const selectContactsBtn = document.getElementById('select-contacts-btn');
        if (selectContactsBtn) {
            selectContactsBtn.addEventListener('click', () => {
                this.showContactSelector();
            });
        }

        // 选择模板按钮
        const selectTemplateBtn = document.getElementById('select-template-btn');
        if (selectTemplateBtn) {
            selectTemplateBtn.addEventListener('click', () => {
                this.showTemplateSelector();
            });
        }

        // 创建任务按钮
        const createTaskBtn = document.getElementById('create-task-submit');
        if (createTaskBtn) {
            createTaskBtn.addEventListener('click', () => {
                this.createTask();
            });
        }

        // 任务筛选按钮
        const filterBtns = document.querySelectorAll('.task-filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.setTaskFilter(btn.dataset.status);
            });
        });
    }

    // 显示联系人选择器
    showContactSelector() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
                <h3 class="text-lg font-bold text-gray-900 mb-4">选择联系人</h3>

                <!-- 快速输入 -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">手动输入号码</label>
                    <div class="flex gap-2">
                        <input type="tel" id="phone-input" placeholder="输入手机号码"
                               class="flex-1 p-2 border border-gray-300 rounded-lg">
                        <button id="add-phone" class="bg-blue-600 text-white px-4 py-2 rounded-lg">添加</button>
                    </div>
                </div>

                <!-- 批量输入 -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">批量输入（每行一个号码）</label>
                    <textarea id="bulk-phones" placeholder="13800138000&#10;13900139000&#10;..."
                              class="w-full p-2 border border-gray-300 rounded-lg h-20 text-sm"></textarea>
                    <button id="add-bulk" class="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm">批量添加</button>
                </div>

                <!-- 已选联系人列表 -->
                <div class="flex-1 overflow-auto">
                    <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-gray-700">已选联系人 (<span id="selected-count">0</span>)</span>
                        <button id="clear-contacts" class="text-red-600 text-sm">清空</button>
                    </div>
                    <div id="selected-contacts" class="space-y-2 max-h-40 overflow-auto">
                        <!-- 已选联系人列表 -->
                    </div>
                </div>

                <div class="flex gap-2 mt-4">
                    <button id="confirm-contacts" class="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg">
                        确认选择
                    </button>
                    <button class="px-4 py-2 text-gray-600" onclick="this.closest('.fixed').remove()">
                        取消
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 初始化已选联系人
        this.updateSelectedContactsList(modal);

        // 添加单个号码
        modal.querySelector('#add-phone').addEventListener('click', () => {
            const input = modal.querySelector('#phone-input');
            const phone = input.value.trim();
            if (phone) {
                this.addContact(phone);
                input.value = '';
                this.updateSelectedContactsList(modal);
            }
        });

        // 批量添加号码
        modal.querySelector('#add-bulk').addEventListener('click', () => {
            const textarea = modal.querySelector('#bulk-phones');
            const phones = textarea.value.split('\n').map(p => p.trim()).filter(p => p);
            phones.forEach(phone => this.addContact(phone));
            textarea.value = '';
            this.updateSelectedContactsList(modal);
        });

        // 清空联系人
        modal.querySelector('#clear-contacts').addEventListener('click', () => {
            this.selectedContacts = [];
            this.updateSelectedContactsList(modal);
        });

        // 确认选择
        modal.querySelector('#confirm-contacts').addEventListener('click', () => {
            this.updateContactsDisplay();
            modal.remove();
        });

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // 添加联系人
    addContact(phone) {
        const cleanPhone = phone.replace(/[^\d+]/g, '');
        if (cleanPhone && !this.selectedContacts.includes(cleanPhone)) {
            this.selectedContacts.push(cleanPhone);
        }
    }

    // 更新已选联系人列表显示
    updateSelectedContactsList(modal) {
        const container = modal.querySelector('#selected-contacts');
        const countEl = modal.querySelector('#selected-count');

        countEl.textContent = this.selectedContacts.length;

        container.innerHTML = this.selectedContacts.map(phone => `
            <div class="flex items-center justify-between bg-gray-50 p-2 rounded">
                <span class="font-mono text-sm">${phone}</span>
                <button class="text-red-600 hover:text-red-800" onclick="this.removeContact('${phone}')">
                    <span class="material-symbols-outlined text-sm">close</span>
                </button>
            </div>
        `).join('');
    }

    // 移除联系人
    removeContact(phone) {
        this.selectedContacts = this.selectedContacts.filter(p => p !== phone);
        const modal = document.querySelector('.fixed');
        if (modal) {
            this.updateSelectedContactsList(modal);
        }
    }

    // 更新联系人显示
    updateContactsDisplay() {
        const contactsText = document.getElementById('contacts-text');
        const contactsPreview = document.getElementById('contacts-preview');

        if (this.selectedContacts.length > 0) {
            contactsText.textContent = `已选择 ${this.selectedContacts.length} 个联系人`;
            contactsText.classList.remove('text-gray-500');
            contactsText.classList.add('text-blue-600');

            contactsPreview.classList.remove('hidden');
            contactsPreview.innerHTML = `
                <div class="text-sm font-medium">联系人预览:</div>
                <div class="mt-1">${this.selectedContacts.slice(0, 3).join(', ')}${this.selectedContacts.length > 3 ? ` +${this.selectedContacts.length - 3}个` : ''}</div>
            `;
        } else {
            contactsText.textContent = '点击选择联系人或分组';
            contactsText.classList.add('text-gray-500');
            contactsText.classList.remove('text-blue-600');
            contactsPreview.classList.add('hidden');
        }

        this.updateTaskSummary();
    }

    // 显示模板选择器
    showTemplateSelector() {
        const templates = this.getTemplates();

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
                <h3 class="text-lg font-bold text-gray-900 mb-4">选择短信模板</h3>

                <!-- 自定义消息 -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">自定义消息</label>
                    <textarea id="custom-message" placeholder="输入自定义短信内容..."
                              class="w-full p-3 border border-gray-300 rounded-lg h-20"></textarea>
                    <button id="use-custom" class="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                        使用自定义消息
                    </button>
                </div>

                <!-- 预设模板 -->
                <div class="flex-1 overflow-auto">
                    <div class="text-sm font-medium text-gray-700 mb-2">预设模板</div>
                    <div class="space-y-2" id="template-list">
                        ${templates.map(template => `
                            <div class="template-item border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                                 data-template='${JSON.stringify(template)}'>
                                <div class="font-medium text-sm text-gray-900">${template.title}</div>
                                <div class="text-xs text-gray-600 mt-1">${template.content}</div>
                                <div class="text-xs text-blue-600 mt-1">点击选择</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <button class="mt-4 w-full bg-gray-600 text-white px-4 py-2 rounded-lg" onclick="this.closest('.fixed').remove()">
                    取消
                </button>
            </div>
        `;

        document.body.appendChild(modal);

        // 使用自定义消息
        modal.querySelector('#use-custom').addEventListener('click', () => {
            const message = modal.querySelector('#custom-message').value.trim();
            if (message) {
                this.selectedTemplate = {
                    title: '自定义消息',
                    content: message
                };
                this.updateTemplateDisplay();
                modal.remove();
            }
        });

        // 选择预设模板
        modal.querySelectorAll('.template-item').forEach(item => {
            item.addEventListener('click', () => {
                this.selectedTemplate = JSON.parse(item.dataset.template);
                this.updateTemplateDisplay();
                modal.remove();
            });
        });

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // 获取模板列表
    getTemplates() {
        return [
            {
                title: '活动通知',
                content: '【活动通知】亲爱的客户，我们将于明天举办特价活动，详情请关注我们的公众号。'
            },
            {
                title: '优惠促销',
                content: '【优惠促销】限时特价！全场商品5折起，机会难得，快来抢购吧！'
            },
            {
                title: '节日祝福',
                content: '【节日祝福】祝您节日快乐，身体健康，工作顺利，家庭幸福！'
            },
            {
                title: '服务提醒',
                content: '【服务提醒】您的服务即将到期，请及时续费以确保服务不中断。'
            },
            {
                title: '会议通知',
                content: '【会议通知】会议时间已确定，请准时参加。地点：公司会议室，时间：明天上午9点。'
            }
        ];
    }

    // 更新模板显示
    updateTemplateDisplay() {
        const templateText = document.getElementById('template-text');
        const templatePreview = document.getElementById('template-preview');
        const templateTitle = document.getElementById('template-title');
        const templateContent = document.getElementById('template-content');

        if (this.selectedTemplate) {
            templateText.textContent = this.selectedTemplate.title;
            templateText.classList.remove('text-gray-500');
            templateText.classList.add('text-green-600');

            templatePreview.classList.remove('hidden');
            templateTitle.textContent = this.selectedTemplate.title;
            templateContent.textContent = this.selectedTemplate.content;
        } else {
            templateText.textContent = '点击选择短信模板';
            templateText.classList.add('text-gray-500');
            templateText.classList.remove('text-green-600');
            templatePreview.classList.add('hidden');
        }

        this.updateTaskSummary();
    }

    // 更新任务摘要
    updateTaskSummary() {
        const summaryEl = document.getElementById('task-summary');
        const contactsEl = document.getElementById('summary-contacts');
        const templateEl = document.getElementById('summary-template');
        const costEl = document.getElementById('summary-cost');
        const submitBtn = document.getElementById('create-task-submit');

        if (this.selectedContacts.length > 0 && this.selectedTemplate) {
            summaryEl.classList.remove('hidden');
            contactsEl.textContent = `${this.selectedContacts.length} 个`;
            templateEl.textContent = this.selectedTemplate.title;
            costEl.textContent = `¥${(this.selectedContacts.length * 0.05).toFixed(2)}`;
            submitBtn.disabled = false;
        } else {
            summaryEl.classList.add('hidden');
            submitBtn.disabled = true;
        }
    }

    // 创建发送任务
    async createTask() {
        if (this.selectedContacts.length === 0 || !this.selectedTemplate) {
            alert('请选择联系人和模板');
            return;
        }

        const submitBtn = document.getElementById('create-task-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '发送中...';
        submitBtn.disabled = true;

        try {
            // 创建任务记录
            const task = {
                id: Date.now().toString(),
                contacts: this.selectedContacts,
                template: this.selectedTemplate,
                status: 'running',
                created: new Date().toISOString(),
                progress: 0,
                results: []
            };

            this.tasks.unshift(task);
            this.saveTasks();
            this.renderTaskList();

            // 显示发送进度对话框
            this.showSendingProgress(task);

            // 开始发送短信
            const result = await window.smsSender.sendBulkSMS(
                this.selectedContacts,
                this.selectedTemplate.content,
                (progress) => {
                    task.progress = progress.progress;
                    this.updateSendingProgress(task, progress);
                }
            );

            // 更新任务状态
            task.status = 'completed';
            task.results = result.results;
            task.completed = new Date().toISOString();
            task.summary = {
                total: result.total,
                success: result.success,
                failed: result.failed
            };

            this.saveTasks();
            this.renderTaskList();

            // 显示完成通知
            this.showTaskCompleted(task);

            // 重置表单
            this.resetForm();

        } catch (error) {
            console.error('发送失败:', error);
            alert('发送失败: ' + error.message);
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    // 显示发送进度
    showSendingProgress(task) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.id = `progress-${task.id}`;
        modal.innerHTML = `
            <div class="bg-white rounded-xl p-6 max-w-sm w-full">
                <h3 class="text-lg font-bold text-gray-900 mb-4">📱 正在发送短信</h3>
                <div class="space-y-4">
                    <div>
                        <div class="flex justify-between text-sm text-gray-600 mb-1">
                            <span>发送进度</span>
                            <span id="progress-text">0%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div id="progress-bar" class="bg-orange-600 h-2 rounded-full transition-all duration-300" style="width: 0%"></div>
                        </div>
                    </div>
                    <div class="text-sm text-gray-600">
                        <div>正在发送: <span id="current-phone">-</span></div>
                        <div>进度: <span id="current-progress">0</span> / ${task.contacts.length}</div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // 更新发送进度
    updateSendingProgress(task, progress) {
        const modal = document.getElementById(`progress-${task.id}`);
        if (!modal) return;

        const progressBar = modal.querySelector('#progress-bar');
        const progressText = modal.querySelector('#progress-text');
        const currentPhone = modal.querySelector('#current-phone');
        const currentProgress = modal.querySelector('#current-progress');

        progressBar.style.width = `${progress.progress}%`;
        progressText.textContent = `${progress.progress}%`;
        currentPhone.textContent = progress.phone;
        currentProgress.textContent = progress.current;
    }

    // 显示任务完成
    showTaskCompleted(task) {
        // 移除进度对话框
        const progressModal = document.getElementById(`progress-${task.id}`);
        if (progressModal) {
            progressModal.remove();
        }

        // 显示完成对话框
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-xl p-6 max-w-sm w-full">
                <h3 class="text-lg font-bold text-green-600 mb-4">✅ 发送完成</h3>
                <div class="space-y-2 text-sm">
                    <div class="flex justify-between">
                        <span>总数量:</span>
                        <span>${task.summary.total}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>成功:</span>
                        <span class="text-green-600">${task.summary.success}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>失败:</span>
                        <span class="text-red-600">${task.summary.failed}</span>
                    </div>
                    <div class="flex justify-between">
                        <span>成功率:</span>
                        <span>${Math.round((task.summary.success / task.summary.total) * 100)}%</span>
                    </div>
                </div>
                <button class="w-full mt-4 bg-green-600 text-white px-4 py-2 rounded-lg" onclick="this.closest('.fixed').remove()">
                    确定
                </button>
            </div>
        `;

        document.body.appendChild(modal);

        // 5秒后自动关闭
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 5000);
    }

    // 重置表单
    resetForm() {
        this.selectedContacts = [];
        this.selectedTemplate = null;
        this.updateContactsDisplay();
        this.updateTemplateDisplay();
    }

    // 设置任务筛选
    setTaskFilter(status) {
        this.currentFilter = status;

        // 更新按钮状态
        document.querySelectorAll('.task-filter-btn').forEach(btn => {
            btn.classList.remove('active', 'bg-orange-600', 'text-white');
            btn.classList.add('bg-gray-100', 'text-gray-700');
        });

        const activeBtn = document.querySelector(`[data-status="${status}"]`);
        activeBtn.classList.add('active', 'bg-orange-600', 'text-white');
        activeBtn.classList.remove('bg-gray-100', 'text-gray-700');

        this.renderTaskList();
    }

    // 渲染任务列表
    renderTaskList() {
        const taskList = document.getElementById('task-list');
        let filteredTasks = this.tasks;

        if (this.currentFilter !== 'all') {
            filteredTasks = this.tasks.filter(task => task.status === this.currentFilter);
        }

        if (filteredTasks.length === 0) {
            taskList.innerHTML = `
                <div class="text-center text-gray-500 py-8">
                    <span class="material-symbols-outlined text-4xl mb-2">task</span>
                    <p>暂无${this.getFilterName(this.currentFilter)}任务</p>
                    <p class="text-sm">点击上方按钮创建新任务</p>
                </div>
            `;
            return;
        }

        taskList.innerHTML = filteredTasks.map(task => this.renderTaskItem(task)).join('');
    }

    // 渲染单个任务项
    renderTaskItem(task) {
        const statusColors = {
            pending: 'bg-yellow-100 text-yellow-800',
            running: 'bg-blue-100 text-blue-800',
            completed: 'bg-green-100 text-green-800'
        };

        const statusTexts = {
            pending: '待发送',
            running: '发送中',
            completed: '已完成'
        };

        return `
            <div class="task-item border border-gray-200 rounded-lg p-4">
                <div class="flex items-center justify-between mb-2">
                    <span class="font-medium text-gray-900">${task.template.title}</span>
                    <span class="px-2 py-1 text-xs rounded-full ${statusColors[task.status]}">
                        ${statusTexts[task.status]}
                    </span>
                </div>
                <div class="text-sm text-gray-600 mb-2">
                    ${task.template.content}
                </div>
                <div class="flex items-center justify-between text-xs text-gray-500">
                    <span>联系人: ${task.contacts.length}个</span>
                    <span>${new Date(task.created).toLocaleString()}</span>
                </div>
                ${task.summary ? `
                    <div class="mt-2 pt-2 border-t border-gray-100">
                        <div class="flex justify-between text-xs">
                            <span>成功: ${task.summary.success}</span>
                            <span>失败: ${task.summary.failed}</span>
                            <span>成功率: ${Math.round((task.summary.success / task.summary.total) * 100)}%</span>
                        </div>
                    </div>
                ` : ''}
                ${task.status === 'running' ? `
                    <div class="mt-2">
                        <div class="w-full bg-gray-200 rounded-full h-1">
                            <div class="bg-blue-600 h-1 rounded-full transition-all duration-300" style="width: ${task.progress || 0}%"></div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // 获取筛选名称
    getFilterName(filter) {
        const names = {
            all: '全部',
            pending: '待发送',
            running: '发送中',
            completed: '已完成'
        };
        return names[filter] || '全部';
    }

    // 加载任务
    loadTasks() {
        const tasks = localStorage.getItem('sms_tasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    // 保存任务
    saveTasks() {
        localStorage.setItem('sms_tasks', JSON.stringify(this.tasks));
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('tasks.html') ||
        document.querySelector('h1')?.textContent.includes('发送任务')) {
        window.tasksPage = new TasksPage();
    }
});

// 导出给其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TasksPage;
}