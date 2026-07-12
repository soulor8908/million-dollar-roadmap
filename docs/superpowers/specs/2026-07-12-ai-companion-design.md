# AI 作战辅助系统 设计文档

> 日期：2026-07-12
> 状态：待实现
> 主线优先级：P0（替换原项目1为新主线）

## 背景与目标

百万年薪作战系统当前是纯 markdown + GitHub Actions 架构。记录和查看都靠手动编辑文件，摩擦高、反馈慢。核心痛点：

1. **情绪影响学习和休息但无处记录**：焦虑/疲惫/多巴胺冲动发生时没有快速记录通道，晨练前无法回看情绪模式
2. **休息低效**：累的时候不知道用什么方法恢复，硬撑或刷手机
3. **记录摩擦大**：通勤/午休时手机编辑 markdown 不方便，导致日志空缺
4. **不知道现在该做什么**：时间表在 routine.md 里，但没有主动提醒

本项目的目标是构建一个 Next.js Web 应用，作为现有 markdown 系统的「前端」，让记录和查看变快变方便，并提供友好提醒。

## 设计决策

| 决策点 | 选择 | 理由 |
|-------|------|------|
| 形态 | Next.js Web 应用 + PWA | 覆盖手机/电脑全场景，技术栈熟悉 |
| 与项目1关系 | 替换项目1为新主线 | 这是支撑作战系统运行的基础设施，优先级高于 AI Code Review |
| 数据存储 | GitHub 仓库 markdown | 与现有 Actions/AI周报/dashboard.js 完全兼容 |
| 实现节奏 | 全功能一步到位 | 用户选择 |

## 整体架构

```
手机/电脑浏览器
    ↓ HTTPS
Vercel (Next.js 14 App Router)
    ↓ GitHub REST API (PAT认证)
GitHub仓库 (markdown文件)
    ↑ 读
现有GitHub Actions (每日检查/周报，不变)
```

### 技术栈
- Next.js 14 App Router + TypeScript
- Tailwind CSS + shadcn/ui（移动端优先设计）
- Vercel 部署（免费额度足够个人使用）
- 认证：Personal Access Token（用户输入，Web Crypto API 加密存 sessionStorage）
- 数据：GitHub 仓库 markdown，通过 GitHub REST API 读写

## 功能模块（6个）

### 1. 今日指挥中心（首页 `/`）
- **"现在该做什么"卡片**：根据当前时间解析 `schedule/routine.md` 时间表，显示当前任务 + 下一个任务（如"6:00-6:30 晨练，还剩 15min"）
- **今日打卡 checklist**：晨练/早起学习/通勤算法/午休休息/午休学习/公司学习，勾选即记录到 daily 日志
- **能量快记**：一键记录当前能量值（1-5），存入 daily 日志的能量字段
- **快捷入口**：记情绪、记日志、休息、查看进度

### 2. 情绪笔记（`/emotion`）
- **快速记录**：情绪标签（焦虑/兴奋/疲惫/烦躁/满足/冲动...）+ 触发事件 + 对学习/休息的影响 + 采取的应对
- **晨练回看视图**：默认显示最近 7 天情绪笔记，晨练前 30 秒扫一眼，顶部显示情绪统计（焦虑X次、疲惫X次）
- **多巴胺干扰标记**：特别标记"刷手机/游戏/短视频导致的冲动"，可追踪模式
- **情绪趋势**：简单折线图，关联情绪与能量、学习效率
- **写入格式**：追加到 `emotion/YYYY-MM-DD.md`，每条记录带时间戳

### 3. 高效休息（`/rest`）
- **方法库**（静态，读 `rest/methods.md`）：478呼吸法、NSDR、渐进式放松、散步、小睡、远眺
- **状态推荐**：根据当前能量值 + 时间段推荐方法（如能量2分+午休→NSDR 10min）
- **引导计时器**：478呼吸法带视觉引导（吸气4s-屏息7s-呼气8s 循环动画），其他方法带倒计时

### 4. 日志记录（`/daily`）
- 每日作战日志（基于 `daily/template.md`，含能量记录字段）
- 一键填充当日模板，分段保存（计划/执行/数据/复盘）
- 历史日历视图，哪天有记录一眼可见
- 读写 `daily/YYYY-MM-DD.md`

### 5. 进度查看（`/progress`）
- **算法进度**：读 `algorithm/progress.md`，可视化进度条 + 本周题数
- **时间审计**：从 daily 日志提取本周学习时长 vs 目标 23h
- **仪表盘**：dashboard.js 的 Web 版，实时而非每周刷新（算法进度、连续打卡、累计日志）

### 6. AI 分析（`/analyze`）
- **情绪模式分析**：调用 AI 分析最近 2 周情绪笔记，识别模式（"你周二下午能量普遍低"）
- **能量-效率关联**：交叉分析能量值与学习时长、算法完成数
- **个性化建议**：基于近期数据给出具体调整建议
- 复用 `scripts/ai-review.js` 的 prompt 设计，API 密钥存 Vercel 环境变量

## 数据模型

### 新增文件

#### `emotion/YYYY-MM-DD.md`（情绪笔记）
```markdown
# 📖 2026-07-13 情绪笔记

## 情绪记录

### 14:30 | 焦虑 😰
- 触发：算法题卡住30min没思路
- 影响：想刷手机逃避
- 应对：起身喝水 + 478呼吸3轮
- 多巴胺干扰：否

### 20:00 | 疲惫 😴
- 触发：连续学习2h
- 影响：注意力下降
- 应对：切换到简单任务
- 多巴胺干扰：否
```

#### `rest/methods.md`（休息方法库，静态）
```markdown
# 高效休息方法库

## 按状态推荐

### 能量≤2 + 短时间（≤15min）
- NSDR 10min（瑜伽休息术，降低皮质醇）
- 478呼吸法 ×4轮（激活副交感神经）

### 能量≤2 + 有时间（≥30min）
- 小睡 20min（不超30min，避免深睡醒来更累）

### 能量3 + 需要重置
- 散步 10min（户外光照重置生物钟）
- 渐进式放松（从脚到头逐部位收紧-放松）

## 478呼吸法
- 吸气4秒 → 屏息7秒 → 呼气8秒
- 循环4轮，约3分钟
- 原理：延长呼气激活迷走神经，快速降心率

## NSDR（Non-Sleep Deep Rest）
- 10-20分钟
- 原理：瑜伽休息术精简版，引导身体进入深度放松但保持意识
- 适用：午休、睡前过度兴奋时
```

### 现有文件（Web 应用读写，不改格式）
- `daily/YYYY-MM-DD.md`：读写（日志记录）
- `algorithm/progress.md`：读写（进度查看，更新题数）
- `schedule/routine.md`：只读（时间表数据源）
- `README.md`：只读（仪表盘展示）

## 与现有系统集成

```
新Web应用读写                    现有自动化（不变）
─────────────                   ──────────────
emotion/YYYY-MM-DD.md   ←写←    AI周报可增强读取
daily/YYYY-MM-DD.md     ←读写→  daily-check.yml提醒
algorithm/progress.md   ←读写→  dashboard.js仪表盘
schedule/routine.md     ←读→    时间表数据源
rest/methods.md         ←读→    休息方法库
```

**核心原则**：Web 应用是现有 markdown 系统的「前端」，不是替代。GitHub Actions、AI 周报、dashboard.js 全部继续工作。Web 应用只是让用户用手机/浏览器更方便地读写这些文件。

## 技术实现细节

### 认证与安全
- 用户首次访问输入 GitHub Personal Access Token（需 `repo` 权限）
- Token 用 Web Crypto API（AES-GCM）加密后存 `sessionStorage`（关闭浏览器即清除，不持久化到 disk）
- 每次 API 调用从 sessionStorage 解密读取
- 服务端（Vercel）不存储 token，只做 API 代理（避免 CORS 和 token 泄露）

### GitHub API 交互
- **读单文件**：`GET /repos/{owner}/{repo}/contents/{path}` → base64 解码 → markdown 解析
- **写文件**：`PUT /repos/{owner}/{repo}/contents/{path}` → 需带原文件 sha（更新）或省略（新建）
- **批量读**：`GET /repos/{owner}/{repo}/git/trees/{tree_sha}?recursive=1` 一次拉文件列表，再并行读
- **速率限制**：GitHub PAT 5000次/小时，个人用足够；前端做简单计数防超

### Markdown 解析
- 用 `gray-matter` 解析 frontmatter（如需要）
- 用 `remark` + `remark-html` 渲染查看
- 情绪笔记的「### HH:MM | 情绪」结构用正则解析为结构化数据：`/^### (\d{2}:\d{2}) \| (.+?) (.+)$/`

### 离线与性能
- Next.js PWA（manifest + service worker），手机可装主屏
- 读取的数据缓存在内存 + IndexedDB（离线查看历史）
- 写入失败时本地暂存，恢复网络后重试

### 错误处理
- GitHub API 失败：明确提示（token过期/网络/文件冲突），提供重试按钮
- token 无效（401）：清除 sessionStorage 并引导重新输入
- 文件冲突（409，sha 不匹配）：重新拉取后提示用户合并

### 测试策略
- GitHub API 交互层用 mock 测试（不依赖真实 API）
- markdown 解析用快照测试（固定的输入 → 固定的输出）
- 关键组件测试：CurrentTask、QuickEmotion、EnergyMeter、BreathTimer
- 不做 E2E（个人项目，ROI 低）

## 项目结构

```
app/
  page.tsx                  # 今日指挥中心
  emotion/page.tsx          # 情绪笔记（记录+回看）
  rest/page.tsx             # 高效休息
  daily/page.tsx            # 日志记录
  progress/page.tsx         # 进度查看
  analyze/page.tsx          # AI 分析
  api/
    github/[...path]/route.ts  # GitHub API 代理
    ai/route.ts             # AI 分析接口
  layout.tsx                # 根布局（PWA manifest、导航）
lib/
  github.ts                 # GitHub API 客户端
  markdown.ts               # markdown 解析
  routine.ts                # 时间表解析（"现在该做什么"）
  emotion.ts                # 情绪笔记解析
  storage.ts                # token 加密存储
components/
  ui/                       # shadcn/ui 组件
  CurrentTask.tsx           # "现在该做什么"卡片
  QuickEmotion.tsx          # 情绪快记
  EnergyMeter.tsx           # 能量记录
  BreathTimer.tsx           # 478呼吸计时器
  Nav.tsx                   # 底部导航栏（移动端）
public/
  manifest.json             # PWA 配置
  icons/                    # PWA 图标
```

## 对现有项目的变更

实现阶段需同步更新：
1. `SYSTEM.md` 聚焦原则：主线改为「AI 作战辅助系统」，原项目1 冻结
2. `projects/ai-code-review.md`：加冻结横幅，解冻条件改为本项目完成
3. 新建 `projects/ai-companion.md`：本项目文档
4. `rest/methods.md`：休息方法库（首次创建内容）
5. `emotion/` 目录：随首次记录自然建立

## 非目标（YAGNI）

明确不做：
- 多用户支持（个人项目）
- 复杂权限管理（只有自己用）
- 自定义情绪标签管理（先用固定标签集）
- 数据导出（数据就在 GitHub 仓库，天然可导出）
- 推送通知（先用 PWA 通知 + 现有 GitHub Actions Issue 提醒，不接 FCM）
- 离线写入（只做离线查看，写入需在线）
