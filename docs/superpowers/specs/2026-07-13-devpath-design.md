# devpath — AI 驱动的开发者成长 OS 设计 Spec

> 创建日期：2026-07-13
> 状态：待实现
> 关联：替代原 `projects/ai-code-review.md` 作为项目1 主线

## Why

### 问题
开发者学习面试/技能时面临三大痛点：
1. **不知道学什么**：想学前端性能优化，但不知道该拆成哪些知识点、按什么顺序学
2. **学完就忘**：没有科学的间隔重复机制，学完一周忘 70%
3. **计划赶不上变化**：状态好时硬塞太多，状态差时硬撑，最终放弃

同时，现有 AI 前端工具赛道（v0/Bolt/json-render）都在做"代码生成"，没人做"学习编排"。AI 个人成长 OS 是空白垂直赛道。

### 机会
- 已有 AI 作战辅助系统经验（Next.js + GitHub API + AI 集成）
- FSRS 间隔重复算法有成熟 TypeScript 实现（ts-fsrs）
- 目标用户（1-5 年前端）基数大，求职季流量高
- 公开学习主页自带传播属性

### 目标
- **首要**：拿 GitHub star，10 周目标 500+
- **次要**：简历亮点（AI 工程化 + FSRS 算法 + 算法可视化），面试可讲深度
- **副产品**：个人成长工具，自己用得上

## What Changes

### 新建项目 `devpath`（独立于现有 ai-companion）

| 维度 | 内容 |
|------|------|
| 产品名 | devpath |
| 一句话 | 告诉 AI 你想学什么，它给你拆知识树、排学习计划、生面试题、按遗忘曲线复习 |
| 部署 | Cloudflare Pages（国内零梯子）|
| 代码位置 | `/workspace/devpath/`（monorepo 子目录）|

### 4 大核心亮点

1. **AI 学习教练**：输入主题 → AI 拆知识树 → 生成面试题 → 排学习计划，用户可调顺序/内容/每日量
2. **FSRS 遗忘曲线**：ts-fsrs 算法自动安排复习，比 Anki 的 SM-2 准 20%
3. **能量感知调量**：每日状态评估 → AI 动态调整学习量（状态差减量/只复习）
4. **公开学习主页**：可分享学习轨迹，热力图 + 雷达图 + 打卡，社交驱动坚持

## Architecture

### 5 层架构

```
用户层（Web PWA）
  ├ /                 首页（今日 dashboard）
  ├ /learn            AI 学习教练（输入主题 → 知识树 → 计划）
  ├ /learn/[planId]   学习计划详情（可编辑知识树/计划）
  ├ /review           今日复习（FSRS 卡片流）
  ├ /stats            数据可视化（热力图+雷达+周报）
  ├ /profile          公开主页设置
  ├ /u/[username]     公开学习主页（访客视角）
  ├ /settings         设置（AI key/每日量/FSRS/隐私）
  └ /onboarding       首次引导（3步）
API 层（Next.js Route Handlers / Cloudflare Pages Functions）
  ├ /api/learn        知识树拆解 + 面试题生成
  ├ /api/review       FSRS 评分 + 重新排期
  ├ /api/status       状态评估 + AI 调量
  ├ /api/weekly       AI 周报生成
  └ /api/public       公开主页读写（Cloudflare KV）
引擎层（路径相对 /workspace/devpath/）
  ├ lib/ai/knowledge.ts    拆知识树（LLM + JSON Schema）
  ├ lib/ai/question.ts     生成面试题 + 参考答案
  ├ lib/fsrs.ts            间隔重复排期（ts-fsrs 封装）
  ├ lib/schedule.ts        学习计划编排（拓扑排序 + 每日分配）
  ├ lib/status.ts          状态评估 + AI 动态调量
  └ lib/visualization.ts   热力图 + 雷达图数据聚合
存储层
  ├ IndexedDB（默认，零门槛，via idb-keyval）
  ├ Cloudflare KV（公开主页数据）
  └ GitHub markdown（可选，跨设备同步，复用现有 github.ts）
LLM 层（多 Provider）
  ├ GLM-4-flash（默认，国内可达）
  ├ DeepSeek
  ├ 小米 MiMo
  └ 任意 OpenAI 兼容（用户自带 key）
```

### 模块边界（8 个独立单元，每个 <200 行）

| 模块 | 职责 | 依赖 |
|------|------|------|
| `lib/ai/knowledge.ts` | 拆知识树（generateObject + JSON Schema） | AI SDK |
| `lib/ai/question.ts` | 生成面试题 + 参考答案 + 关键知识点 | AI SDK |
| `lib/fsrs.ts` | 间隔重复排期（ts-fsrs 封装） | ts-fsrs |
| `lib/schedule.ts` | 拓扑排序 + 每日量分配 + 首次排期 | knowledge + fsrs |
| `lib/status.ts` | 状态评估 + AI 动态调量 | AI SDK |
| `lib/storage/db.ts` | IndexedDB CRUD（idb-keyval 封装） | idb-keyval |
| `lib/storage/github.ts` | GitHub 同步（复用现有） | GitHubClient |
| `lib/storage/kv.ts` | Cloudflare KV 读写（公开主页） | Cloudflare KV |

## Tech Stack

| 层 | 技术 | 理由 |
|----|------|------|
| 框架 | Next.js 14 App Router | 已有经验，复用 ai-companion 代码 |
| 语言 | TypeScript | 类型安全 |
| 样式 | Tailwind CSS + shadcn/ui | 已有 Tailwind，shadcn 提升质感 |
| AI | Vercel AI SDK（`ai` + `@ai-sdk/openai`）| 统一接口，流式输出，多 provider |
| 间隔重复 | ts-fsrs | FSRS 算法 TS 实现，MIT，比 SM-2 准 20% |
| 本地存储 | idb-keyval | IndexedDB 最简封装，零配置 |
| 云端存储 | Cloudflare KV | 公开主页，免费 100k 读/天 |
| 同步存储 | GitHub API（可选） | 跨设备，数据自主 |
| 热力图 | react-activity-calendar | 轻量 SSR 友好 |
| 雷达图 | recharts | React 生态成熟 |
| 测试 | Vitest + Playwright | 单元 + E2E |
| 部署 | Cloudflare Pages | 国内边缘节点可达，免费 |

## Data Model

```typescript
// 学习计划
interface LearningPlan {
  id: string;
  topic: string;                    // "前端性能优化高频面试题"
  knowledgeTree: KnowledgeNode[];
  questions: Question[];
  schedule: ScheduleItem[];
  dailyMinutes: number;             // 用户设定的每日学习量
  maxNewPerDay: number;             // 每日新内容数上限
  fsrsMode: "conservative" | "standard" | "aggressive";
  createdAt: string;
  updatedAt: string;
}

// 知识节点
interface KnowledgeNode {
  id: string;                       // "k1"
  title: string;                    // "React 重渲染优化"
  difficulty: 1 | 2 | 3 | 4 | 5;
  prerequisites: string[];          // 依赖的节点 id
  frequency: "高" | "中" | "低";   // 面试频率
  summary: string;
  mastery: number;                  // 0-100 掌握度（来自 FSRS）
  customOrder?: number;             // 用户手动调整的顺序
}

// 面试题
interface Question {
  id: string;
  nodeId: string;
  question: string;
  answer: string;                   // 200-400 字参考答案
  keyPoints: string[];
  followUps: string[];
  codeSnippet?: string;
}

// 学习计划项
interface ScheduleItem {
  day: number;                      // 第几天
  nodeId: string;
  type: "learn" | "review";
  cardId?: string;                  // review 类型关联的卡片
  estimatedMinutes: number;
  completed: boolean;
  completedAt?: string;
}

// FSRS 复习卡片
interface ReviewCard {
  id: string;
  planId: string;
  nodeId: string;
  questionId: string;
  front: string;                    // 面试题
  back: string;                     // 参考答案
  // FSRS 字段
  due: string;                      // 下次复习日期
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  state: 0 | 1 | 2 | 3 | 4;        // 新/学习/复习/巩固/重学
  lastReview: string;
}

// 每日状态
interface DailyStatus {
  date: string;                     // YYYY-MM-DD
  energy: 1 | 2 | 3 | 4 | 5;
  mood: "good" | "neutral" | "bad";
  availableMinutes: number;
  aiAdjustedLoad: number;           // AI 建议的负载系数
  actualMinutes: number;            // 实际学习时长
}

// 复习日志
interface ReviewLog {
  id: string;
  cardId: string;
  date: string;
  rating: 1 | 2 | 3 | 4;           // Again/Hard/Good/Easy
  elapsedDays: number;
  stateBefore: number;
  stateAfter: number;
}

// 学习日志（用于热力图和周报）
interface LearnLog {
  id: string;
  planId: string;
  nodeId: string;
  date: string;                     // YYYY-MM-DD
  duration: number;                 // 学习时长（分钟）
  type: "learn" | "review";
}

// 公开主页
interface PublicProfile {
  username: string;
  displayName: string;
  avatar?: string;
  bio: string;
  visibility: {
    radar: boolean;
    heatmap: boolean;
    currentTopic: boolean;
    notes: boolean;
  };
  followerCount: number;
  followingCount: number;
  updatedAt: string;
}

// 能量模式（AI 周报产出）
interface EnergyPattern {
  weekStart: string;
  avgEnergyByWeekday: number[];     // [周一..周日] 各平均能量
  insights: string[];               // AI 发现的模式
  recommendations: string[];        // AI 建议
}
```

## Core Flows

### Flow 1: 知识树拆解（30 秒）

**输入**：用户输入主题 "前端性能优化高频面试题"

**AI Prompt**（System + User + JSON Schema）：

```
[System]
你是技术学习专家。把用户给的学习主题拆解成 8-12 个知识节点。
要求：
1. 每个节点是一个可独立学习的最小知识单元
2. 标注节点间的依赖关系
3. 评估难度 1-5
4. 按面试出现频率排序
5. 输出严格 JSON

[Schema]
{
  "topic": string,
  "nodes": [{
    "id": "k1",
    "title": string,
    "difficulty": 1-5,
    "prerequisites": string[],
    "frequency": "高"|"中"|"低",
    "summary": string
  }]
}
```

**技术**：Vercel AI SDK `generateObject()` 强制 JSON Schema 输出，流式返回节点

**降级**：失败重试 2 次，最终降级为预设模板（5 套常见主题：前端性能/React 基础/TypeScript/算法基础/系统设计）

### Flow 2: 内容生成（30-60 秒，并行）

每个知识节点并行生成面试题：

```typescript
interface Question {
  question: string;        // "请解释 React 的 diff 算法，以及 key 属性的作用"
  answer: string;          // 三段式：结论 → 展开 → 代码示例
  keyPoints: string[];
  followUps: string[];
  codeSnippet?: string;
}
```

**性能**：8 节点并行（Promise.all），总耗时 = 最慢的一个（约 10-15s），进度条 "3/8 已生成"

**容错**：单个节点失败不影响其他，标记"待重试"

### Flow 3: 学习计划编排（三步算法）

**Step 3.1 拓扑排序**（Kahn 算法 BFS）：
- 按依赖关系排学习顺序
- 同层级按 difficulty 升序（先易后难）

**Step 3.2 每日分配**：
```typescript
// 节点耗时 = difficulty × 8min
// 每日容量 = dailyMinutes - 已安排复习时间
// 容量足够 → 安排新节点；不够 → 顺延到下一天
```

**Step 3.3 FSRS 首次排期**：
- 每个面试题 → 创建 FSRS 卡片
- 学完节点后首次评分 → FSRS 算出下次复习时间

**输出**：N 天计划表，每天 1-2 个新节点 + 复习卡片

### Flow 4: 日常循环

```
状态评估 (10s, 3问) → AI 动态调量 → 今日学习（新内容）→ 复习卡片（FSRS）→ 更新掌握度
```

**AI 动态调量规则**：
```typescript
const capacity = (energy / 3) * (mood === "bad" ? 0.7 : 1) * (availableMinutes / 30);

if (capacity < 0.5) → 只复习，不学新内容
if (capacity < 1.0) → 新内容减半
if (capacity > 1.2) → 可加学一个节点
if (capacity > 1.5) → 建议加量 + 提醒别透支
```

**AI 增强**（可选）：
- 连续 3 天 energy < 3 → AI 建议休息一天
- 某节点连续 3 次评分低 → AI 生成补充材料

### Flow 5: 用户可调维度

| 维度 | 调整方式 | 依赖校验 |
|------|---------|---------|
| 学习顺序 | 拖拽节点重排 | AI 检测依赖冲突，自动前置依赖 |
| 学习内容 | 删/加/编辑节点 | 删除节点时联动删除关联卡片 |
| 每日学习量 | 设置页 15-120min | 重新编排后续计划 |
| 每日新内容数 | 设置页 1-5 个 | 影响每日分配 |
| 复习节奏 | FSRS 参数切换 | 保守/标准/激进三种预设 |
| 学习主题 | 叠加新主题 | 多计划并行，独立排期 |

## Visualization

### 学习热力图
- **组件**：react-activity-calendar
- **数据**：ReviewLog + LearnLog 按日期聚合
- **交互**：点击格子 → popover 显示当天详情
- **颜色**：4 档（0 / 15-29 / 30-59 / 60+ min）

### 能力雷达图
- **组件**：recharts `<RadarChart />`
- **维度**：每个知识节点一个轴（最多 8 个）
- **数值**：掌握度（FSRS stability 映射 0-100）
- **可切换**：掌握度 / 正确率 / 练习次数 / 活跃度 / 面试权重

### AI 周报（每周日自动）
- **触发**：每周日 21:00（可配）
- **内容**：时长统计 + 新学知识 + 复习正确率 + 连续打卡 + AI 模式识别 + 下周建议
- **AI Prompt**：喂入本周所有学习/复习/状态日志，输出三段式

## Public Profile

### URL
```
devpath.app/u/{username}
devpath.app/u/{username}/plan/{planId}
```

### 隐私控制
| 数据 | 默认 | 可调 |
|------|------|------|
| 用户名 + 打卡 | 公开 | 可设私密 |
| 当前主题 | 公开 | 可隐藏 |
| 雷达图 | 公开 | 可隐藏 |
| 热力图 | 公开 | 可隐藏 |
| 笔记内容 | 私密 | 可选公开 |
| 每日状态 | 私密 | 永不公开 |

### 传播机制
1. **分享图**：html-to-image 生成 PNG（热力图 + 雷达 + 打卡天数）
2. **复制计划**：访客一键复制知识树 + 面试题到自己账号
3. **学习搭子**：关注其他用户，对方打卡自己收 push

### 存储
- Cloudflare KV：`profile:{username}` + `stats:{username}`
- 免费额度：100k 读/天，1k 写/天（早期足够）

## Energy Awareness

### 每日状态评估（3 种形态）

**A 完整版**（首次/周末）：精力 1-5 + 心情 + 时间
**B 极简版**（工作日）：1 click 选择"不太好/一般/状态不错"
**C 自动推断**（无感）：连续 3 天 energy=5 自动跳过；检测晚睡提醒减量

### 长期模式识别
每周 AI 分析 28 天能量曲线：
- 识别低能量工作日 → 建议那天只复习
- 识别高能量时段 → 安排最难节点
- 检测连续低能量 → 建议零学习日

## Deployment（国内零梯子）

### 三层加速
```
用户（国内）→ Cloudflare 边缘节点 → AI API（国内端点）
```

| 环节 | 方案 |
|------|------|
| 静态资源 | Cloudflare Pages 边缘缓存 |
| API Route | Cloudflare Pages Functions（边缘运行时）|
| AI 调用 | 用户自带 key，默认 GLM 国内端点 |
| GitHub 同步（可选） | 用户自行配 PAT |

### 关键改动（vs ai-companion）
1. 部署：Vercel → Cloudflare Pages（`output: "export"` 或 `@cloudflare/next-on-pages`）
2. API Route → Cloudflare Pages Functions（`functions/api/`）
3. AI 端点默认国内（GLM/DeepSeek）
4. 存储默认本地（IndexedDB），GitHub 同步降为可选

## Error Handling

| 场景 | 降级 |
|------|------|
| 无 AI key | 预设 5 套主题模板 + 纯规则调量 |
| AI 拆知识树失败 | 重试 2 次后降级预设模板 |
| AI 生成面试题失败 | 单节点标记"待重试"，不影响其他 |
| AI 评分连续 3 次失败 | 关闭 AI 增强，纯规则引擎 |
| IndexedDB 满 | 提示导出 + 清理 >90 天日志 |
| Cloudflare KV 限流 | 公开主页降级静态缓存（每小时更新）|
| ts-fsrs 异常 | 降级固定间隔（1/3/7/15/30 天）|

## Testing

| 层 | 工具 | 覆盖 |
|----|------|------|
| 单元 | Vitest | FSRS 排期、拓扑排序、调量算法、知识树解析 |
| 组件 | Vitest + Testing Library | 状态评估、复习卡片交互 |
| E2E | Playwright | 输入主题 → 出计划 → 复习 → 看热力图 |
| AI Mock | vi.mock | AI 调用全 mock，测试不依赖真实 API |

## Milestones

| 阶段 | 目标 | 周 |
|-----|------|----|
| M1 | 基础设施 + 知识树拆解 + 面试题生成 | Week 1-2 |
| M2 | FSRS 复习 + 学习计划编排 | Week 3-4 |
| M3 | 能量感知 + 动态调量 | Week 5-6 |
| M4 | 可视化（热力图+雷达+周报）| Week 7 |
| M5 | 公开主页 + Cloudflare KV | Week 8 |
| M6 | Cloudflare Pages 部署 + 推广 | Week 9-10 |

每周投入 ~18h（周末 8h + 公司晚间 10h）

## Star Growth Path

- **Week 1-2**：开发期，发"AI 拆知识树" demo 视频
- **Week 3-4**：发"我用 FSRS 算法做了个智能复习系统"技术拆解
- **Week 5-6**：内测，收集反馈
- **Week 7-8**：可视化上线，发"我的开发者成长 OS 开源了"
- **Week 9-10**：公开主页上线，鼓励分享学习轨迹，发"FSRS vs SM-2 实测"

## Scope Check

本 spec 涵盖完整产品，但可拆分为 3 个独立可交付的子项目：
1. **MVP**：AI 学习教练 + FSRS 复习（M1-M2，4 周）—— 可独立使用
2. **增强**：能量感知 + 可视化（M3-M4，3 周）—— 依赖 MVP
3. **传播**：公开主页 + 部署推广（M5-M6，3 周）—— 依赖前两者

建议先实现 MVP，验证核心流程后再推进增强和传播。

## Non-Goals

- 不做代码生成（v0/Bolt 已覆盖）
- 不做通用知识库（聚焦开发者学习场景）
- 不做付费功能（开源免费，AI key 用户自带）
- 不做移动端原生 app（PWA 即可）
- 不做团队/企业功能（个人工具优先）
