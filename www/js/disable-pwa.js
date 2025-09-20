// 彻底禁用PWA安装提示 - 增强版
(function() {
    'use strict';

    // 阻止beforeinstallprompt事件 - 多种方式
    const blockInstallPrompt = function(e) {
        console.log('阻止PWA安装提示');
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    };

    // 多次绑定事件监听器确保阻止
    window.addEventListener('beforeinstallprompt', blockInstallPrompt, true);
    window.addEventListener('beforeinstallprompt', blockInstallPrompt, false);
    document.addEventListener('beforeinstallprompt', blockInstallPrompt, true);
    document.addEventListener('beforeinstallprompt', blockInstallPrompt, false);

    // 阻止appinstalled事件
    const blockAppInstalled = function(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return false;
    };

    window.addEventListener('appinstalled', blockAppInstalled, true);
    window.addEventListener('appinstalled', blockAppInstalled, false);
    document.addEventListener('appinstalled', blockAppInstalled, true);
    document.addEventListener('appinstalled', blockAppInstalled, false);

    // 覆盖 navigator.getInstalledRelatedApps
    if (navigator.getInstalledRelatedApps) {
        navigator.getInstalledRelatedApps = function() {
            return Promise.resolve([]);
        };
    }

    // 移除任何可能的安装横幅 - 更全面的选择器
    function removeInstallBanners() {
        const installSelectors = [
            '[data-pwa-install]',
            '[class*="install"]',
            '[id*="install"]',
            '[class*="pwa"]',
            '[id*="pwa"]',
            '.app-install-banner',
            '#installPrompt',
            '.install-prompt',
            'button[data-action="install"]',
            'button[onclick*="install"]',
            'div[class*="banner"]',
            'div[id*="banner"]',
            '.pwa-install',
            '.add-to-homescreen',
            '.a2hs',
            '#a2hs',
            '.install-app',
            '#install-app',
            // 橙色按钮特定选择器
            'button[style*="background: #f97316"]',
            'button[style*="background:#f97316"]',
            'button[style*="background-color: #f97316"]',
            'button[style*="background-color:#f97316"]',
            'button[style*="color: white"]',
            'button:contains("安装")',
            'button:contains("添加")',
            'button:contains("桌面")',
            // 固定定位的按钮
            'button[style*="position: fixed"]',
            'div[style*="position: fixed"]',
            // 高 z-index 元素
            '*[style*="z-index: 1000"]',
            '*[style*="z-index:1000"]'
        ];

        installSelectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    if (el && el.parentNode) {
                        // 检查元素内容是否包含安装相关文字
                        const text = el.textContent || el.innerText || '';
                        if (text.includes('安装') || text.includes('添加') || text.includes('桌面') ||
                            text.includes('install') || text.includes('add to home')) {
                            el.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important;';
                            setTimeout(() => {
                                try {
                                    el.remove();
                                } catch(e) {}
                            }, 100);
                        }
                    }
                });
            } catch (e) {
                // 忽略选择器错误
            }
        });

        // 额外检查所有按钮元素
        const allButtons = document.querySelectorAll('button');
        allButtons.forEach(button => {
            const text = button.textContent || button.innerText || '';
            const style = button.getAttribute('style') || '';

            if ((text.includes('安装') || text.includes('添加') || text.includes('桌面')) ||
                (style.includes('position: fixed') && style.includes('#f97316'))) {
                button.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; position: absolute !important; left: -9999px !important; top: -9999px !important;';
                setTimeout(() => {
                    try {
                        button.remove();
                    } catch(e) {}
                }, 100);
            }
        });
    }

    // 页面加载时执行
    document.addEventListener('DOMContentLoaded', removeInstallBanners);

    // 更频繁的检查
    setInterval(removeInstallBanners, 500);

    // 监听DOM变化
    if (window.MutationObserver) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            const text = node.textContent || node.innerText || '';
                            if (text.includes('安装') || text.includes('添加') || text.includes('桌面')) {
                                node.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important;';
                                setTimeout(() => {
                                    try {
                                        node.remove();
                                    } catch(e) {}
                                }, 100);
                            }
                        }
                    });
                }
            });
            removeInstallBanners();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class', 'id']
        });
    }

    // 覆盖可能的安装函数
    window.installPWA = function() {
        console.log('PWA安装已被禁用');
        return false;
    };

    window.deferredPrompt = null;

    console.log('PWA安装提示已被彻底禁用');
})();