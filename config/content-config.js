/**
 * 内容配置文件
 * 在这里修改所有页面显示的内容
 */

const CONTENT_CONFIG = {
    // ==================== 品牌信息 ====================
    brand: {
        name: "AI-Figma转React",
        logo: "AI",
        tagline: "官方正版开发工具",
        roomNumber: "811855"
    },

    // ==================== 主标题区域 ====================
    hero: {
        title: "畅享AI智能开发体验",
        subtitle: "专为开发者设计的AI驱动Figma转React工具，提供流畅稳定的代码生成体验。支持一键转换，立即开始高效开发。",
        stats: [
            { number: 100000, label: "用户下载", suffix: "" },
            { number: 99, label: "好评率", suffix: "%" },
            { number: 24, label: "小时客服", suffix: "×7" }
        ]
    },

    // ==================== 下载区域 ====================
    download: {
        title: "立即下载",
        platforms: [
            { id: "windows", name: "Windows", icon: "🪟" },
            { id: "mac", name: "macOS", icon: "🍎" },
            { id: "linux", name: "Linux", icon: "🐧" }
        ],
        defaultPlatform: "windows",
        downloadUrls: {
            windows: "https://example.com/download/windows/latest.exe",
            mac: "https://example.com/download/mac/latest.dmg",
            linux: "https://example.com/download/linux/latest.AppImage"
        },
        qrHint: "手机扫码下载",
        qrHintText: "使用手机扫描二维码快速下载"
    },

    // ==================== 功能特性 ====================
    features: [
        {
            id: "ai",
            icon: "🤖",
            title: "AI智能转换",
            description: "基于先进的AI技术，自动识别设计元素并生成高质量代码",
            details: [
                "自动识别Figma设计中的组件结构",
                "智能分析布局和样式",
                "生成符合最佳实践的React代码",
                "支持TypeScript类型定义",
                "自动添加无障碍属性"
            ]
        },
        {
            id: "speed",
            icon: "⚡",
            title: "极速生成",
            description: "秒级转换速度，大幅提升开发效率，节省宝贵时间",
            details: [
                "简单组件：1-2秒完成转换",
                "复杂页面：5-10秒生成完整代码",
                "批量处理：支持同时转换多个组件",
                "实时预览：即时查看生成结果"
            ]
        },
        {
            id: "quality",
            icon: "✨",
            title: "代码质量",
            description: "生成的代码符合最佳实践，易于维护和扩展",
            details: [
                "清晰的组件结构",
                "完整的Props类型定义",
                "响应式设计支持",
                "语义化HTML标签",
                "优化的CSS样式"
            ]
        },
        {
            id: "support",
            icon: "🛠️",
            title: "全面支持",
            description: "支持React、Vue、Angular等多种主流框架",
            details: [
                "React - 完整的Hooks支持",
                "Vue 3 - Composition API",
                "Angular - 组件和模块",
                "Svelte - 响应式语法"
            ]
        }
    ],

    // ==================== 用户评价 ====================
    testimonials: [
        {
            stars: 5,
            text: "这个工具真的太棒了！以前需要几个小时的工作，现在几分钟就能完成。",
            author: "张工程师",
            title: "前端开发"
        },
        {
            stars: 5,
            text: "代码质量很高，生成的组件结构清晰，完全符合我们的开发规范。",
            author: "李设计师",
            title: "UI设计师"
        },
        {
            stars: 5,
            text: "团队协作效率提升明显，设计师和开发者之间的沟通成本大大降低。",
            author: "王经理",
            title: "产品经理"
        }
    ],

    // ==================== CTA区域 ====================
    cta: {
        title: "准备好提升开发效率了吗？",
        subtitle: "立即下载，加入超过10万开发者的行列",
        buttonText: "立即免费下载"
    },

    // ==================== 页脚链接 ====================
    footer: {
        links: [
            { text: "关于我们", url: "#about" },
            { text: "隐私政策", url: "#privacy" },
            { text: "使用条款", url: "#terms" },
            { text: "联系我们", url: "#contact" }
        ],
        copyright: "AI-Figma转React工具. 保留所有权利."
    },

    // ==================== 联系信息 ====================
    contact: {
        email: "contact@ai-figma-react.com",
        phone: "+86 400-123-4567",
        address: "北京市朝阳区科技园区"
    }
};

// 导出配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONTENT_CONFIG;
}