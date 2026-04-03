/**
 * 访问统计分析系统
 * 追踪页面访问、点击行为、用户停留时间等数据
 */

class Analytics {
    constructor() {
        this.storageKey = 'ai_figma_analytics';
        this.sessionKey = 'ai_figma_session';
        this.data = this.loadData();
        this.session = this.initSession();
        this.startTime = Date.now();
        
        // 初始化追踪
        this.init();
    }

    // 加载本地存储的数据
    loadData() {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
            return JSON.parse(stored);
        }
        // 初始化新数据
        return {
            totalViews: 0,
            uniqueVisitors: 0,
            dailyStats: {},
            clicks: {
                download: {},
                platform: {},
                features: {},
                cta: 0,
                qr: 0
            },
            platformUsage: {},
            featureViews: {},
            avgSessionTime: 0,
            totalSessions: 0,
            createdAt: new Date().toISOString()
        };
    }

    // 保存数据到本地存储
    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    }

    // 初始化会话
    initSession() {
        const stored = sessionStorage.getItem(this.sessionKey);
        if (stored) {
            return JSON.parse(stored);
        }
        
        // 新会话
        const session = {
            id: this.generateSessionId(),
            startTime: Date.now(),
            pageViews: 1,
            clicks: {
                download: 0,
                platform: {},
                features: [],
                cta: 0,
                qr: 0
            }
        };
        
        sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
        
        // 更新总访问量
        this.data.totalViews++;
        this.data.totalSessions++;
        
        this.saveData();
        return session;
    }

    // 生成会话ID
    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // 初始化追踪
    init() {
        // 追踪页面离开
        this.setupBeforeUnload();
        
        // 追踪滚动深度
        this.trackScrollDepth();
        
        // 记录每日统计
        this.recordDailyStats();
        
        console.log('📊 统计分析系统已启动');
    }

    // 设置页面离开追踪
    setupBeforeUnload() {
        window.addEventListener('beforeunload', () => {
            this.endSession();
        });
        
        // 也监听 visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.endSession();
            }
        });
    }

    // 结束会话，计算停留时间
    endSession() {
        const duration = Date.now() - this.startTime;
        this.session.duration = duration;
        
        // 更新平均停留时间
        const totalTime = this.data.avgSessionTime * (this.data.totalSessions - 1) + duration;
        this.data.avgSessionTime = totalTime / this.data.totalSessions;
        
        this.saveData();
    }

    // 记录每日统计
    recordDailyStats() {
        const today = new Date().toISOString().split('T')[0];
        
        if (!this.data.dailyStats[today]) {
            this.data.dailyStats[today] = {
                views: 0,
                uniqueVisitors: 0,
                clicks: {},
                platformUsage: {}
            };
        }
        
        this.data.dailyStats[today].views++;
        this.saveData();
    }

    // 追踪滚动深度
    trackScrollDepth() {
        let maxDepth = 0;
        
        window.addEventListener('scroll', () => {
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const depth = Math.round((window.scrollY / scrollHeight) * 100);
            
            if (depth > maxDepth) {
                maxDepth = depth;
                this.session.maxScrollDepth = maxDepth;
            }
        });
    }

    // ==================== 事件追踪方法 ====================

    // 追踪下载按钮点击
    trackDownloadClick(platform) {
        this.data.clicks.download[platform] = (this.data.clicks.download[platform] || 0) + 1;
        this.session.clicks.download[platform] = (this.session.clicks.download[platform] || 0) + 1;
        
        // 记录平台使用
        this.data.platformUsage[platform] = (this.data.platformUsage[platform] || 0) + 1;
        
        // 记录每日
        const today = new Date().toISOString().split('T')[0];
        if (this.data.dailyStats[today]) {
            this.data.dailyStats[today].clicks.download = (this.data.dailyStats[today].clicks.download || 0) + 1;
            this.data.dailyStats[today].platformUsage[platform] = (this.data.dailyStats[today].platformUsage[platform] || 0) + 1;
        }
        
        this.saveData();
        this.logEvent('下载按钮点击', { platform });
    }

    // 追踪平台切换
    trackPlatformSwitch(platform) {
        this.data.clicks.platform[platform] = (this.data.clicks.platform[platform] || 0) + 1;
        this.saveData();
        this.logEvent('平台切换', { platform });
    }

    // 追踪功能卡片点击
    trackFeatureClick(featureId) {
        this.data.clicks.features[featureId] = (this.data.clicks.features[featureId] || 0) + 1;
        this.data.featureViews[featureId] = (this.data.featureViews[featureId] || 0) + 1;
        
        if (!this.session.clicks.features.includes(featureId)) {
            this.session.clicks.features.push(featureId);
        }
        
        // 记录每日
        const today = new Date().toISOString().split('T')[0];
        if (this.data.dailyStats[today]) {
            this.data.dailyStats[today].clicks.features = this.data.dailyStats[today].clicks.features || {};
            this.data.dailyStats[today].clicks.features[featureId] = (this.data.dailyStats[today].clicks.features[featureId] || 0) + 1;
        }
        
        this.saveData();
        this.logEvent('功能卡片点击', { featureId });
    }

    // 追踪CTA按钮点击
    trackCTAClick() {
        this.data.clicks.cta++;
        this.session.clicks.cta++;
        
        const today = new Date().toISOString().split('T')[0];
        if (this.data.dailyStats[today]) {
            this.data.dailyStats[today].clicks.cta = (this.data.dailyStats[today].clicks.cta || 0) + 1;
        }
        
        this.saveData();
        this.logEvent('CTA按钮点击');
    }

    // 追踪二维码扫描
    trackQRClick() {
        this.data.clicks.qr++;
        this.session.clicks.qr++;
        
        const today = new Date().toISOString().split('T')[0];
        if (this.data.dailyStats[today]) {
            this.data.dailyStats[today].clicks.qr = (this.data.dailyStats[today].clicks.qr || 0) + 1;
        }
        
        this.saveData();
        this.logEvent('二维码扫描');
    }

    // 记录控制台日志
    logEvent(eventName, details = {}) {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`📊 [${timestamp}] ${eventName}`, details);
    }

    // ==================== 数据获取方法 ====================

    // 获取所有统计数据
    getAllStats() {
        return {
            ...this.data,
            currentSession: this.session,
            sessionStartTime: this.startTime,
            last7DaysStats: this.getLast7DaysStats(),
            topFeatures: this.getTopFeatures(),
            platformDistribution: this.getPlatformDistribution(),
            todayStats: this.getTodayStats()
        };
    }

    // 获取今日统计
    getTodayStats() {
        const today = new Date().toISOString().split('T')[0];
        return this.data.dailyStats[today] || {
            views: 0,
            uniqueVisitors: 0,
            clicks: {}
        };
    }

    // 获取热门功能
    getTopFeatures(limit = 5) {
        const features = Object.entries(this.data.clicks.features)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([id, count]) => ({ id, count }));
        return features;
    }

    // 获取平台使用分布
    getPlatformDistribution() {
        const total = Object.values(this.data.platformUsage).reduce((a, b) => a + b, 0);
        const distribution = {};
        
        for (const [platform, count] of Object.entries(this.data.platformUsage)) {
            distribution[platform] = {
                count,
                percentage: total > 0 ? ((count / total) * 100).toFixed(1) : 0
            };
        }
        
        return distribution;
    }

    // 获取最近7天的数据
    getLast7DaysStats() {
        const stats = [];
        const today = new Date();
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            stats.push({
                date: dateStr,
                views: this.data.dailyStats[dateStr]?.views || 0,
                clicks: this.data.dailyStats[dateStr]?.clicks || {}
            });
        }
        
        return stats;
    }

    // 重置统计数据（慎用）
    resetStats() {
        if (confirm('确定要重置所有统计数据吗？此操作不可撤销！')) {
            localStorage.removeItem(this.storageKey);
            this.data = this.loadData();
            this.logEvent('统计数据已重置');
            return true;
        }
        return false;
    }

    // 导出统计数据为JSON
    exportStats() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.logEvent('统计数据已导出');
    }
}

// 创建全局实例
let analytics;

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    analytics = new Analytics();
    
    // 将 analytics 对象暴露到全局
    window.analytics = analytics;
});

// 快捷访问函数
window.getStats = () => analytics ? analytics.getAllStats() : null;
window.getTodayStats = () => analytics ? analytics.getTodayStats() : null;
window.exportStats = () => analytics ? analytics.exportStats() : null;
window.resetStats = () => analytics ? analytics.resetStats() : false;