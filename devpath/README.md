# devpath — AI 驱动的开发者成长 OS

告诉 AI 你想学什么，它给你拆知识树、排学习计划、生面试题、按遗忘曲线复习。

## 功能

- **AI 学习教练**：输入主题 → AI 拆知识树 → 生成面试题 → 排学习计划
- **FSRS 间隔重复**：ts-fsrs 算法自动安排复习，三种难度预设
- **收藏夹**：整份试题集 + 单题收藏，独立快照
- **今日 Dashboard**：待学/待复习数量、连续打卡、状态评估、7 天热力图

## 技术栈

- Next.js 14 App Router + TypeScript
- Tailwind CSS（移动端优先）
- Vercel AI SDK（ai + @ai-sdk/openai）
- ts-fsrs（FSRS 间隔重复算法）
- idb-keyval（IndexedDB 封装）
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

支持的 Provider（均兼容 OpenAI 格式）：

| Provider | AI_PROVIDER | 端点 | 默认模型 | Key 环境变量 |
|----------|------------|------|---------|-------------|
| 智谱 GLM | `glm` | https://open.bigmodel.cn/api/paas/v4 | glm-4-flash | `GLM_API_KEY` |
| DeepSeek | `deepseek` | https://api.deepseek.com/v1 | deepseek-chat | `DEEPSEEK_API_KEY` |
| 小米 MiMo | `mimo` | https://api.xiaomimimo.com/v1 | mimo-v2-pro | `MIMO_API_KEY` |
| 自定义 | `custom` | `AI_API_URL` | `AI_MODEL` | `AI_API_KEY` |

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
npm run build
```

## 部署到 Cloudflare Pages

### 方式一：静态导出（M6 启用）

1. 设置环境变量 `NEXT_PUBLIC_STATIC_EXPORT=true`
2. 运行 `npm run build`，生成 `out/` 目录
3. Cloudflare Pages 构建命令：`npm run build`，输出目录：`out`
4. API routes 需迁移到 `functions/api/` 目录（Cloudflare Pages Functions）

### 方式二：@cloudflare/next-on-pages

```bash
npx @cloudflare/next-on-pages
```

### 环境变量

在 Cloudflare Pages Dashboard → Settings → Environment Variables 中配置：

- `AI_PROVIDER` = `glm`（或 `deepseek` / `mimo`）
- `GLM_API_KEY` = 你的 API Key
- `NEXT_PUBLIC_STATIC_EXPORT` = `true`（静态导出模式）

## 项目结构

```
devpath/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页 dashboard
│   ├── learn/             # AI 学习教练
│   ├── review/            # 今日复习
│   ├── favorites/         # 收藏夹
│   ├── stats/             # 统计（M4）
│   └── api/               # API Routes
├── components/             # React 组件
├── lib/                    # 核心逻辑
│   ├── ai/                # AI 集成
│   ├── storage/           # IndexedDB 封装
│   ├── fsrs.ts            # FSRS 间隔重复
│   ├── schedule.ts        # 学习计划编排
│   ├── favorite.ts        # 收藏管理
│   ├── types.ts           # 类型定义
│   └── time.ts            # Asia/Shanghai 时区工具
├── __tests__/             # 单元测试
└── package.json
```

## 里程碑

| 阶段 | 内容 | 状态 |
|------|------|------|
| M1 | 基础设施 + AI 学习教练 | ✅ MVP |
| M2 | FSRS 复习 + 收藏 | ✅ MVP |
| M3 | 能量感知 + 动态调量 | 待实现 |
| M4 | 可视化（热力图+雷达+周报）| 待实现 |
| M5 | 公开主页 + Cloudflare KV | 待实现 |
| M6 | Cloudflare Pages 部署 + 推广 | 待实现 |

## License

MIT
