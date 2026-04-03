// 主应用程序脚本
class ProductWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupScrollEffects();
        this.setupDemoSwitcher();
        this.setupContactForm();
        this.startCountdown();
        this.loadDemoContent();
    }

    // 导航栏设置
    setupNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navbar = document.getElementById('navbar');

        // 移动端菜单切换
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
        }

        // 滚动时导航栏效果
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });

        // 平滑滚动
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // 关闭移动端菜单
                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                    }
                }
            });
        });
    }

    // 滚动效果
    setupScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // 观察所有需要动画的元素
        document.querySelectorAll('.feature-card, .benefit-item, .demo-btn').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // 演示内容切换
    setupDemoSwitcher() {
        const demoButtons = document.querySelectorAll('.demo-btn');
        const demoContent = document.getElementById('demo-content');

        demoButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 移除所有按钮的激活状态
                demoButtons.forEach(btn => btn.classList.remove('active'));
                // 添加当前按钮的激活状态
                button.classList.add('active');
                
                // 加载对应的演示内容
                this.loadDemoContent(button.dataset.demo);
            });
        });
    }

    // 加载演示内容
    loadDemoContent(demoType = 'card') {
        const demoContent = document.getElementById('demo-content');
        
        let content = '';
        
        switch(demoType) {
            case 'card':
                content = `
                    <div class="demo-card-preview">
                        <div class="demo-card">
                            <div class="demo-card-icon">📊</div>
                            <div class="demo-card-content">
                                <h3>用户统计</h3>
                                <p class="demo-card-value">1,234</p>
                                <span class="demo-card-trend">↑ 12%</span>
                            </div>
                        </div>
                        <div class="demo-code">
                            <pre><code>// 生成的React组件代码
const StatsCard = ({ title, value, trend }) => (
  <div className="stats-card">
    <div className="card-icon">📊</div>
    <div className="card-content">
      <h3>{title}</h3>
      <p className="card-value">{value}</p>
      <span className="card-trend">{trend}</span>
    </div>
  </div>
);</code></pre>
                        </div>
                    </div>
                `;
                break;
                
            case 'button':
                content = `
                    <div class="demo-button-preview">
                        <div class="demo-buttons">
                            <button class="demo-btn-primary">主要按钮</button>
                            <button class="demo-btn-secondary">次要按钮</button>
                            <button class="demo-btn-outline">轮廓按钮</button>
                        </div>
                        <div class="demo-code">
                            <pre><code>// 生成的按钮组件
const Button = ({ variant = 'primary', children, ...props }) => (
  <button 
    className={\`btn btn-\${variant}\`}
    {...props}
  >
    {children}
  </button>
);</code></pre>
                        </div>
                    </div>
                `;
                break;
                
            case 'form':
                content = `
                    <div class="demo-form-preview">
                        <form class="demo-form">
                            <div class="form-group">
                                <label>用户名</label>
                                <input type="text" placeholder="请输入用户名" />
                            </div>
                            <div class="form-group">
                                <label>邮箱</label>
                                <input type="email" placeholder="请输入邮箱" />
                            </div>
                            <div class="form-group">
                                <label>消息</label>
                                <textarea placeholder="请输入消息内容"></textarea>
                            </div>
                            <button type="submit" class="demo-submit-btn">提交</button>
                        </form>
                        <div class="demo-code">
                            <pre><code>// 生成的表单组件
const ContactForm = () => {
  const [formData, setFormData] = useState({});
  
  return (
    <form onSubmit={handleSubmit}>
      <FormField label="用户名" name="username" />
      <FormField label="邮箱" name="email" type="email" />
      <FormField label="消息" name="message" type="textarea" />
      <Button type="submit">提交</Button>
    </form>
  );
};</code></pre>
                        </div>
                    </div>
                `;
                break;
        }
        
        demoContent.innerHTML = content;
        
        // 添加演示样式
        this.addDemoStyles();
    }

    // 添加演示样式
    addDemoStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .demo-card-preview, .demo-button-preview, .demo-form-preview {
                display: flex;
                flex-direction: column;
                gap: 2rem;
                width: 100%;
            }
            
            .demo-card {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1.5rem;
                background: #f8fafc;
                border-radius: 8px;
                border-left: 4px solid #2563eb;
            }
            
            .demo-card-icon {
                font-size: 2rem;
            }
            
            .demo-card-content h3 {
                margin: 0 0 0.5rem 0;
                color: #1e293b;
            }
            
            .demo-card-value {
                font-size: 2rem;
                font-weight: 600;
                color: #2563eb;
                margin: 0;
            }
            
            .demo-card-trend {
                color: #22c55e;
                font-weight: 500;
            }
            
            .demo-buttons {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
            }
            
            .demo-btn-primary, .demo-btn-secondary, .demo-btn-outline {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .demo-btn-primary {
                background: #2563eb;
                color: white;
            }
            
            .demo-btn-secondary {
                background: #64748b;
                color: white;
            }
            
            .demo-btn-outline {
                background: transparent;
                color: #2563eb;
                border: 2px solid #2563eb;
            }
            
            .demo-form {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .form-group {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .form-group label {
                font-weight: 500;
                color: #374151;
            }
            
            .form-group input, .form-group textarea {
                padding: 0.75rem;
                border: 2px solid #e5e7eb;
                border-radius: 6px;
                font-size: 1rem;
            }
            
            .demo-submit-btn {
                background: #2563eb;
                color: white;
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 6px;
                font-weight: 500;
                cursor: pointer;
            }
            
            .demo-code {
                background: #1e293b;
                border-radius: 8px;
                overflow: hidden;
            }
            
            .demo-code pre {
                margin: 0;
                padding: 1rem;
            }
            
            .demo-code code {
                color: #e2e8f0;
                font-family: 'Fira Code', monospace;
                font-size: 0.9rem;
                line-height: 1.4;
            }
        `;
        
        // 移除之前的样式（如果有）
        const existingStyle = document.getElementById('demo-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        style.id = 'demo-styles';
        document.head.appendChild(style);
    }

    // 倒计时功能
    startCountdown() {
        const timerElement = document.getElementById('countdown-timer');
        if (!timerElement) return;

        // 设置24小时倒计时
        let timeLeft = 24 * 60 * 60; // 24小时，单位：秒

        const updateTimer = () => {
            const hours = Math.floor(timeLeft / 3600);
            const minutes = Math.floor((timeLeft % 3600) / 60);
            const seconds = timeLeft % 60;

            timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if (timeLeft > 0) {
                timeLeft--;
            } else {
                timerElement.textContent = '优惠已结束';
                timerElement.style.color = '#ef4444';
                clearInterval(timerInterval);
            }
        };

        // 立即更新一次
        updateTimer();
        
        // 每秒更新一次
        const timerInterval = setInterval(updateTimer, 1000);
    }

    // 联系表单处理
    setupContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm) return;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = {
                name: formData.get('name') || contactForm.querySelector('input[type="text"]').value,
                email: formData.get('email') || contactForm.querySelector('input[type="email"]').value,
                message: formData.get('message') || contactForm.querySelector('textarea').value
            };

            // 简单的表单验证
            if (!data.name || !data.email || !data.message) {
                this.showNotification('请填写所有必填字段', 'error');
                return;
            }

            if (!this.isValidEmail(data.email)) {
                this.showNotification('请输入有效的邮箱地址', 'error');
                return;
            }

            // 模拟表单提交
            this.showNotification('消息发送成功！我们会尽快回复您。', 'success');
            contactForm.reset();
            
            // 在实际应用中，这里应该发送到服务器
            console.log('表单数据:', data);
        });
    }

    // 邮箱验证
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // 显示通知
    showNotification(message, type = 'info') {
        // 移除现有的通知
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // 创建新通知
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // 添加样式
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;

        // 添加动画样式
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // 3秒后自动移除
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    new ProductWebsite();
});

// 添加加载动画
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});