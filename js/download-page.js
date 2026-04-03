/**
 * APP下载页面交互脚本
 * 包含下载功能、平台切换、统计动画等
 */

class DownloadPage {
    constructor() {
        this.currentPlatform = 'windows';
        this.downloadUrls = {
            windows: 'https://example.com/download/windows',
            mac: 'https://example.com/download/mac',
            linux: 'https://example.com/download/linux'
        };
        this.init();
    }

    init() {
        this.setupPlatformSelector();
        this.setupDownloadButton();
        this.setupScrollAnimations();
        this.setupNumberAnimations();
        this.setupQRCode();
        this.setupSmoothScroll();
    }

    // 平台选择器
    setupPlatformSelector() {
        const platformButtons = document.querySelectorAll('.platform-btn');
        
        platformButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                platformButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentPlatform = btn.dataset.platform;
                this.updateDownloadButton();
                
                // 追踪平台切换
                if (window.analytics) {
                    analytics.trackPlatformSwitch(this.currentPlatform);
                }
                
                this.showNotification(`已切换到 ${this.getPlatformName(this.currentPlatform)} 版本`, 'info');
            });
        });
    }

    getPlatformName(platform) {
        const names = { windows: 'Windows', mac: 'macOS', linux: 'Linux' };
        return names[platform] || platform;
    }

    updateDownloadButton() {
        const downloadBtn = document.getElementById('mainDownloadBtn');
        const platformName = this.getPlatformName(this.currentPlatform);
        downloadBtn.querySelector('.download-text').textContent = `免费下载${platformName}版本`;
    }

    setupDownloadButton() {
        const downloadBtn = document.getElementById('mainDownloadBtn');
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.startDownload();
            
            // 追踪下载点击
            if (window.analytics) {
                analytics.trackDownloadClick(this.currentPlatform);
            }
        });
    }

    startDownload() {
        const modal = document.getElementById('downloadModal');
        const progressCircle = document.getElementById('progressCircle');
        const progressText = document.getElementById('progressText');
        const statusText = document.getElementById('downloadStatus');
        const messageText = document.getElementById('downloadMessage');
        
        modal.classList.add('active');
        
        let progress = 0;
        const circumference = 2 * Math.PI * 45;
        const downloadInterval = setInterval(() => {
            progress += Math.random() * 15;
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(downloadInterval);
                statusText.textContent = '下载准备完成！';
                messageText.textContent = '正在跳转到下载页面...';
                
                setTimeout(() => {
                    this.closeDownloadModal();
                    this.performActualDownload();
                }, 1000);
            }
            
            const offset = circumference - (progress / 100) * circumference;
            progressCircle.style.strokeDashoffset = offset;
            progressText.textContent = Math.round(progress) + '%';
            
            if (progress < 30) {
                statusText.textContent = '正在准备下载...';
                messageText.textContent = '请稍候，正在为您准备安装包';
            } else if (progress < 70) {
                statusText.textContent = '正在打包文件...';
                messageText.textContent = '正在生成最新版本的安装包';
            } else if (progress < 100) {
                statusText.textContent = '即将完成...';
                messageText.textContent = '正在最后的校验和优化';
            }
        }, 200);
    }

    performActualDownload() {
        const url = this.downloadUrls[this.currentPlatform];
        const link = document.createElement('a');
        link.href = url;
        link.download = `AI-Figma-React-${this.currentPlatform}.exe`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.showNotification('下载已开始！请检查您的下载文件夹。', 'success');
        this.trackDownload();
    }

    closeDownloadModal() {
        const modal = document.getElementById('downloadModal');
        modal.classList.remove('active');
        
        setTimeout(() => {
            const progressCircle = document.getElementById('progressCircle');
            const progressText = document.getElementById('progressText');
            const statusText = document.getElementById('downloadStatus');
            const messageText = document.getElementById('downloadMessage');
            
            progressCircle.style.strokeDashoffset = 283;
            progressText.textContent = '0%';
            statusText.textContent = '正在准备下载...';
            messageText.textContent = '请稍候，正在为您准备安装包';
        }, 300);
    }

    trackDownload() {
        console.log(`Download tracked: ${this.currentPlatform} at ${new Date().toISOString()}`);
    }

    setupScrollAnimations() {
        const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        document.querySelectorAll('.feature-card, .testimonial-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    setupNumberAnimations() {
        const statNumbers = document.querySelectorAll('.stat-number');
        const observerOptions = { threshold: 0.5 };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateNumber(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        statNumbers.forEach(num => observer.observe(num));
    }

    animateNumber(element) {
        const target = parseInt(element.dataset.target);
        const duration = 2000;
        const startTime = performance.now();

        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(target * easeOutQuart);
            
            if (target >= 1000) {
                element.textContent = (current / 10000).toFixed(1) + '万';
            } else {
                element.textContent = current;
            }
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                if (target >= 1000) {
                    element.textContent = (target / 10000).toFixed(0) + '万+';
                } else {
                    element.textContent = target;
                }
            }
        };

        requestAnimationFrame(updateNumber);
    }

    setupQRCode() {
        const qrCode = document.getElementById('qrCode');
        
        setTimeout(() => {
            qrCode.innerHTML = `
                <div class="qr-generated">
                    <svg viewBox="0 0 100 100" width="160" height="160">
                        <rect x="10" y="10" width="25" height="25" fill="#dc2626"/>
                        <rect x="65" y="10" width="25" height="25" fill="#dc2626"/>
                        <rect x="10" y="65" width="25" height="25" fill="#dc2626"/>
                        <rect x="40" y="40" width="20" height="20" fill="#dc2626"/>
                        <rect x="15" y="15" width="15" height="15" fill="#fff"/>
                        <rect x="70" y="15" width="15" height="15" fill="#fff"/>
                        <rect x="15" y="70" width="15" height="15" fill="#fff"/>
                        <rect x="45" y="45" width="10" height="10" fill="#fff"/>
                        <rect x="40" y="10" width="5" height="5" fill="#dc2626"/>
                        <rect x="50" y="10" width="5" height="5" fill="#dc2626"/>
                        <rect x="40" y="20" width="5" height="5" fill="#dc2626"/>
                        <rect x="55" y="25" width="5" height="5" fill="#dc2626"/>
                        <rect x="10" y="40" width="5" height="5" fill="#dc2626"/>
                        <rect x="20" y="45" width="5" height="5" fill="#dc2626"/>
                        <rect x="25" y="55" width="5" height="5" fill="#dc2626"/>
                        <rect x="65" y="40" width="5" height="5" fill="#dc2626"/>
                        <rect x="75" y="45" width="5" height="5" fill="#dc2626"/>
                        <rect x="85" y="50" width="5" height="5" fill="#dc2626"/>
                        <rect x="70" y="55" width="5" height="5" fill="#dc2626"/>
                        <rect x="80" y="65" width="5" height="5" fill="#dc2626"/>
                        <rect x="65" y="75" width="5" height="5" fill="#dc2626"/>
                        <rect x="75" y="80" width="5" height="5" fill="#dc2626"/>
                        <rect x="85" y="85" width="5" height="5" fill="#dc2626"/>
                        <rect x="40" y="65" width="5" height="5" fill="#dc2626"/>
                        <rect x="50" y="70" width="5" height="5" fill="#dc2626"/>
                        <rect x="55" y="80" width="5" height="5" fill="#dc2626"/>
                        <rect x="45" y="85" width="5" height="5" fill="#dc2626"/>
                    </svg>
                </div>
            `;
            
            const style = document.createElement('style');
            style.textContent = `
                .qr-generated {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 10px;
                    background: #fff;
                    border-radius: 8px;
                }
                .qr-generated svg { display: block; }
            `;
            document.head.appendChild(style);
        }, 1500);
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    showFeatureDetail(feature) {
        const modal = document.getElementById('featureModal');
        const modalBody = document.getElementById('modalBody');
        
        // 从配置中获取功能详情
        const featureConfig = CONTENT_CONFIG.features.find(f => f.id === feature);
        
        if (featureConfig) {
            const detailsList = featureConfig.details.map(d => `<li>${d}</li>`).join('');
            modalBody.innerHTML = `
                <h2>${featureConfig.icon} ${featureConfig.title}</h2>
                <div class="feature-detail-content">
                    <p>${featureConfig.description}</p>
                    <ul>${detailsList}</ul>
                </div>
                <button class="modal-cta-btn" onclick="closeModal()">了解更多</button>
            `;
            modal.classList.add('active');
            
            // 追踪功能卡片点击
            if (window.analytics) {
                analytics.trackFeatureClick(feature);
            }
        }
    }

    showNotification(message, type = 'info') {
        const existingNotification = document.querySelector('.notification-toast');
        if (existingNotification) existingNotification.remove();

        const notification = document.createElement('div');
        notification.className = `notification-toast notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed; top: 90px; right: 20px; padding: 16px 24px;
            background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white; border-radius: 12px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000; font-weight: 500; animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // 追踪二维码点击
    setupQRTracking() {
        const qrSection = document.querySelector('.qr-section');
        if (qrSection) {
            qrSection.addEventListener('click', () => {
                if (window.analytics) {
                    analytics.trackQRClick();
                }
            });
        }
    }

    // 追踪CTA点击
    setupCTATracking() {
        const ctaButtons = document.querySelectorAll('.cta-button');
        ctaButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (window.analytics) {
                    analytics.trackCTAClick();
                }
                this.startDownload();
            });
        });
    }
}

// 全局函数
function showFeatureDetail(feature) {
    if (window.downloadPage) window.downloadPage.showFeatureDetail(feature);
}

function closeModal() {
    const modal = document.getElementById('featureModal');
    if (modal) modal.classList.remove('active');
}

function closeDownloadModal() {
    const modal = document.getElementById('downloadModal');
    if (modal) modal.classList.remove('active');
}

function scrollToDownload() {
    const downloadSection = document.querySelector('.download-section');
    if (downloadSection) downloadSection.scrollIntoView({ behavior: 'smooth' });
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) e.target.classList.remove('active');
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => modal.classList.remove('active'));
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // 初始化内容配置
    initContentFromConfig();
    
    // 初始化下载页面
    window.downloadPage = new DownloadPage();
    
    // 设置额外追踪
    if (window.downloadPage) {
        window.downloadPage.setupQRTracking();
        window.downloadPage.setupCTATracking();
    }
});

// 从配置初始化内容
function initContentFromConfig() {
    // 品牌信息
    if (CONTENT_CONFIG.brand) {
        document.getElementById('brandName').textContent = CONTENT_CONFIG.brand.name;
        document.getElementById('brandTagline').textContent = CONTENT_CONFIG.brand.tagline;
        document.getElementById('roomNumber').textContent = CONTENT_CONFIG.brand.roomNumber;
        document.querySelector('.logo-box').textContent = CONTENT_CONFIG.brand.logo;
    }
    
    // 主标题
    if (CONTENT_CONFIG.hero) {
        document.querySelector('.main-title').innerHTML = `<span class="title-highlight">${CONTENT_CONFIG.hero.title.split('AI')[0]}</span>${CONTENT_CONFIG.hero.title.includes('AI') ? 'AI' : ''}${CONTENT_CONFIG.hero.title.split('AI')[1] || ''}`;
        document.querySelector('.intro-text').innerHTML = CONTENT_CONFIG.hero.subtitle;
    }
    
    // 更新统计数字
    if (CONTENT_CONFIG.hero && CONTENT_CONFIG.hero.stats) {
        const statNumbers = document.querySelectorAll('.stat-number');
        CONTENT_CONFIG.hero.stats.forEach((stat, index) => {
            if (statNumbers[index]) {
                statNumbers[index].dataset.target = stat.number;
                statNumbers[index].nextElementSibling && stat.suffix ? statNumbers[index].nextElementSibling.textContent = stat.suffix : null;
            }
        });
    }
    
    // 更新功能卡片
    if (CONTENT_CONFIG.features) {
        const featureCards = document.querySelectorAll('.feature-card');
        CONTENT_CONFIG.features.forEach((feature, index) => {
            if (featureCards[index]) {
                featureCards[index].querySelector('.feature-icon').textContent = feature.icon;
                featureCards[index].querySelector('h3').textContent = feature.title;
                featureCards[index].querySelector('p').textContent = feature.description;
                featureCards[index].onclick = () => showFeatureDetail(feature.id);
            }
        });
    }
    
    // 更新用户评价
    if (CONTENT_CONFIG.testimonials) {
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        CONTENT_CONFIG.testimonials.forEach((testimonial, index) => {
            if (testimonialCards[index]) {
                testimonialCards[index].querySelector('.stars').textContent = '⭐'.repeat(testimonial.stars);
                testimonialCards[index].querySelector('p').textContent = testimonial.text;
                testimonialCards[index].querySelector('.author-name').textContent = testimonial.author;
                testimonialCards[index].querySelector('.author-title').textContent = testimonial.title;
            }
        });
    }
    
    // 更新CTA
    if (CONTENT_CONFIG.cta) {
        const ctaSection = document.querySelector('.cta-section');
        if (ctaSection) {
            ctaSection.querySelector('h2').textContent = CONTENT_CONFIG.cta.title;
            ctaSection.querySelector('p').textContent = CONTENT_CONFIG.cta.subtitle;
            ctaSection.querySelector('.cta-button').textContent = CONTENT_CONFIG.cta.buttonText;
        }
    }
    
    // 更新页脚
    if (CONTENT_CONFIG.footer && CONTENT_CONFIG.footer.links) {
        const footerLinks = document.querySelector('.footer-links');
        if (footerLinks) {
            footerLinks.innerHTML = CONTENT_CONFIG.footer.links.map(link => 
                `<a href="${link.url}">${link.text}</a>`
            ).join('');
        }
    }
}