# devpath — AI 驱动的开发者成长 OS

告诉 AI 你想学什么，它给你拆知识树、排学习计划、生面试题、按遗忘曲线复习。

## 功能

### 核心功能
- **AI 学习教练**：输入主题 → AI 拆知识树（5-30 个节点）→ 生成面试题 + 参考答案 → 排学习计划
- **FSRS 间隔重复**：ts-fsrs 算法自动安排复习，三种难度预设（保守/标准/激进）
- **收藏夹**：整份试题集 + 单题收藏，独立快照（原计划删除后收藏不丢）
- **今日 Dashboard**：待学/待复习数量、连续打卡、状态评估、7 天热力图

### 增强功能
- **能量感知调量**：每日状态评估（精力/心情/时间）→ AI 动态调整学习量（状态差减量/只复习）
- **长期能量模式识别**：28 天能量曲线分析 → AI 发现低能量工作日 → 建议那天只复习
- **数据可视化**：学习热力图（react-activity-calendar）+ 能力雷达图（recharts，5 维度切换）
- **AI 周报**：每周自动生成三段式周报（时长统计 + 正确率 + AI 模式识别 + 下周建议）
- **公开学习主页**：可分享学习轨迹（/u/[username]），隐私控制，分享图生成
- **PWA**：离线缓存 + 可安装到主屏

## 技术栈

- Next.js 15 App Router + TypeScript
- Tailwind CSS（移动端优先）
- Vercel AI SDK（ai + @ai-sdk/openai）
- ts-fsrs（FSRS 间隔重复算法 v4）
- idb-keyval（IndexedDB 封装，本地存储）
- react-activity-calendar（热力图）
- recharts（雷达图）
- html-to-image（分享图生成）
- Cloudflare KV（公开主页数据）
- Vitest（单元测试）

## 开发

### 1. 安装依赖

```bash
cd devpath
npm install
```

### 2. 配置环境变量

复制 `.env.local.example` 为 `.env.local`，填入你的 AI API Key：

```bash
cp .env.local.example .env.local
```

支持的 Provider（均兼容 OpenAI 格式，默认 GLM 国内端点零梯子可达）：

| Provider | AI_PROVIDER | 端点 | 默认模型 | Key 环境变量 |
|----------|------------|------|---------|-------------|
| 智谱 GLM | `glm` | https://open.bigmodel.cn/api/paas/v4 | glm-4-flash | `GLM_API_KEY` |
| DeepSeek | `deepseek` | https://api.deepseek.com/v1 | deepseek-chat | `DEEPSEEK_API_KEY` |
| 小米 MiMo | `mimo` | https://api.xiaomimimo.com/v1 | mimo-v2-pro | `MIMO_API_KEY` |
| 自定义 | `custom` | `AI_API_URL` | `AI_MODEL` | `AI_API_KEY` |

> 无 AI Key 时自动降级为预设模板（5 套常见主题），不阻塞使用。

### 3. 启动开发服务器

```bash
npm run dev
```

打开 http://localhost:3000

### 4. 运行测试

```bash
npm test           # 运行一次
npm run test:watch # 监听模式
```

### 5. 构建

```bash
npm run build      # 生产构建
npm start          # 启动生产服务器
```

## 部署到 Cloudflare Pages

### 方式一：@cloudflare/next-on-pages（推荐，支持 API Routes）

```bash
npm install -D @cloudflare/next-on-pages
npx @cloudflare/next-on-pages
npx wrangler pages deploy .vercel/output/static
```

优点：API Routes 自动转换为 Pages Functions，无需迁移代码。

### 方式二：静态导出（需迁移 API Routes）

1. 将 `app/api/` 下的路由迁移到 `functions/api/`（Cloudflare Pages Functions 格式）
2. 设置环境变量 `NEXT_PUBLIC_STATIC_EXPORT=true`
3. 运行 `npm run build`，生成 `out/` 目录
4. 部署：`npx wrangler pages deploy out`

### Cloudflare KV 配置（公开主页用）

1. 创建 KV Namespace：`npx wrangler kv namespace create KV`
2. 将返回的 ID 填入 `wrangler.toml`
3. 在 Cloudflare Dashboard 配置环境变量：
   - `AI_PROVIDER` = `glm`
   - `GLM_API_KEY` = 你的 API Key
   - `API_TOKEN` = API 鉴权 token（通过 `wrangler pages secret put API_TOKEN` 设置，客户端在 profile 页面填入相同值）

## 项目结构

```
devpath/
├── app/                        # Next.js App Router
│   ├── page.tsx               # 首页 dashboard
│   ├── onboarding/            # 首次引导（3 步）
│   ├── learn/                 # AI 学习教练
│   ├── review/                # 今日复习
│   ├── favorites/             # 收藏夹
│   ├── stats/                 # 数据可视化（热力图+雷达+周报）
│   ├── profile/               # 公开主页设置
│   ├── u/[username]/          # 公开主页访客视角
│   └── api/                   # API Routes
│       ├── learn/             # 知识树拆解 + 面试题生成
│       ├── review/            # FSRS 评分
│       ├── favorite/          # 收藏操作
│       ├── status/            # 状态评估 + AI 调量
│       └── weekly/            # AI 周报生成
├── components/                 # React 组件
│   ├── Nav.tsx                # 底部导航
│   ├── Heatmap.tsx            # 学习热力图
│   ├── RadarChart.tsx         # 能力雷达图
│   ├── WeeklyReport.tsx       # AI 周报展示
│   └── ShareCardButton.tsx    # 分享图生成
├── lib/                        # 核心逻辑
│   ├── ai/                    # AI 集成
│   │   ├── provider.ts        # 多 provider 切换
│   │   ├── knowledge.ts       # 知识树拆解
│   │   ├── question.ts        # 面试题生成
│   │   ├── status-enhance.ts  # AI 增强调量
│   │   ├── energy-pattern.ts  # 长期能量模式识别
│   │   ├── weekly-report.ts   # AI 周报生成
│   │   └── templates.ts       # 降级预设模板
│   ├── storage/               # 存储层
│   │   ├── db.ts              # IndexedDB 封装
│   │   └── kv.ts              # Cloudflare KV 封装
│   ├── fsrs.ts                # FSRS 间隔重复
│   ├── schedule.ts            # 学习计划编排（拓扑排序）
│   ├── status.ts              # 状态评估规则引擎
│   ├── favorite.ts            # 收藏管理
│   ├── visualization.ts       # 公开主页数据聚合
│   ├── share-image.ts         # 分享图生成
│   ├── types.ts               # 类型定义
│   └── time.ts                # Asia/Shanghai 时区工具
├── functions/                  # Cloudflare Pages Functions
│   └── api/public/[username]  # 公开主页 API
├── public/                     # 静态资源
│   ├── manifest.json          # PWA manifest
│   └── sw.js                  # Service Worker
├── __tests__/                  # 单元测试
├── wrangler.toml              # Cloudflare Pages 配置
├── pages.config.json          # Cloudflare Pages 部署配置
└── package.json
```

## 里程碑

| 阶段 | 内容 | 状态 |
|------|------|------|
| M1 | 基础设施 + AI 学习教练 | ✅ 完成 |
| M2 | FSRS 复习 + 收藏 | ✅ 完成 |
| M3 | 能量感知 + 动态调量 | ✅ 完成 |
| M4 | 可视化（热力图+雷达+周报）| ✅ 完成 |
| M5 | 公开主页 + Cloudflare KV | ✅ 完成 |
| M6 | PWA + 部署配置 | ✅ 完成 |

## License

MIT
