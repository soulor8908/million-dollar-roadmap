# 学习中心 Spec（算法刷题 + 后端路线）

## Why

仓库已有 `algorithm/leetcode-checklist.md`（200 题按专题分组）和 `backend/roadmap.md`（24 周详细路线，带资料链接），但目前只能在 GitHub 网页手动编辑 markdown，摩擦大：
- 手机上改 markdown 表格极易写错列
- 看不到整体进度，不知道下一步该刷哪题、学哪周
- 完成一题需要切到 GitHub 网页 → 找行 → 改 `[ ]` → 填字段 → commit，至少 5 步

把这两个 markdown 作为数据源，在 app 内提供**查看 + 一键打钩 + 快速记录**能力，让刷题和学习推进可以在手机上 30 秒完成。

## What Changes

- **新增 `/progress` 页面的 Tab 容器**：在现有进度页面顶部增加「算法 / 后端 / 统计」三个 Tab，统计 Tab 承载原 ProgressDashboard 内容
- **新增算法题列表组件**：解析 `algorithm/leetcode-checklist.md`，按专题折叠展示，每题一行（题号 + 标题 + 难度 + 打钩按钮）
- **新增题目快速记录交互**：点击未完成题目 → 弹出底部 sheet 填完成日期/独立?/耗时 → 保存即写回 markdown
- **新增后端路线列表组件**：解析 `backend/roadmap.md`，按 Month/Week 分组展示，每周展示标题 + 产出 demo + 资料链接
- **新增周打钩交互**：点击周次卡片可标记完成，写回 markdown
- **修改 Nav 标签**：「进度」改名为「学习」，icon 保持 📊
- **扩展类型定义**：新增 LeetCodeProblem / BackendWeek / StudyTab 类型
- **进度统计增强**：算法进度卡片新增「今日完成 N 题」「独立做出 N 题」；新增「后端进度 N/24 周」卡片

## Impact

- Affected code:
  - `lib/types.ts`（新增类型）
  - `lib/algorithm.ts`（新增，解析+写回 checklist）
  - `lib/backend.ts`（新增，解析+写回 roadmap）
  - `lib/progress.ts`（扩展，支持算法/后端进度）
  - `components/AlgorithmList.tsx`（新增）
  - `components/BackendRoadmap.tsx`（新增）
  - `components/StudyTabs.tsx`（新增）
  - `components/ProgressDashboard.tsx`（整合到统计 Tab）
  - `components/Nav.tsx`（标签改名）
  - `app/progress/page.tsx`（重写为 Tab 容器）
- 数据源不变：继续用 `algorithm/leetcode-checklist.md` 和 `backend/roadmap.md` 作为单一数据源，app 读写同一份 markdown
- 不影响：今日/情绪/休息/日志/分析 5 个页面

## ADDED Requirements

### Requirement: 算法题列表展示

系统 SHALL 解析 `algorithm/leetcode-checklist.md` 中的题目表格，按专题分组展示在 `/progress` 页面的「算法」Tab 下。

#### Scenario: 正常加载
- **WHEN** 用户进入 `/progress` 页面并切换到「算法」Tab
- **THEN** 显示进度卡片（已完成/200 + 今日完成数 + 独立做出数）和按专题分组的题目列表
- **AND** 每个专题可折叠/展开，默认 Phase 1 展开
- **AND** 每题显示：题号、标题、难度（🟢🟡🔴）、完成状态（✓/○）

#### Scenario: 筛选
- **WHEN** 用户点击专题标题
- **THEN** 该专题折叠/展开
- **WHEN** 用户点击「只看未完成」开关
- **THEN** 列表只显示 `[ ]` 的题目

### Requirement: 算法题一键打钩

系统 SHALL 支持在 app 内点击未完成题目，弹出底部 sheet 快速记录并写回 markdown。

#### Scenario: 打钩流程
- **WHEN** 用户点击一道未完成题目
- **THEN** 弹出底部 sheet，包含：完成日期（默认今天中国时区）、独立?（✅/⚠️/❌ 三选一，默认 ✅）、耗时（分钟，数字输入）、备注（可选）
- **WHEN** 用户点击「保存」
- **THEN** 系统把该题 `[ ]` 改为 `[x]`，填入日期/独立/耗时/备注，通过 GitHub API 写回 `algorithm/leetcode-checklist.md`
- **AND** 列表立即更新该题状态，进度卡片数字 +1

#### Scenario: 一天多刷
- **WHEN** 用户同一天完成多道题
- **THEN** 每道题独立打钩，互不影响，今日完成数累加

#### Scenario: 取消打钩
- **WHEN** 用户点击已完成题目
- **THEN** 弹出确认「取消标记为已完成？」
- **WHEN** 用户确认
- **THEN** 该题 `[x]` 改回 `[ ]`，清空字段，写回 markdown

### Requirement: 后端学习路线展示

系统 SHALL 解析 `backend/roadmap.md`，按 Month/Week 分组展示在 `/progress` 页面的「后端」Tab 下。

#### Scenario: 正常加载
- **WHEN** 用户切换到「后端」Tab
- **THEN** 显示进度卡片（已完成周次/24）和按 Month 分组的周次列表
- **AND** 每周卡片展示：周次标题、学习要点摘要、产出 demo 路径、资料链接（可点击直达）
- **AND** 已完成周次有 ✓ 标记

#### Scenario: 展开详情
- **WHEN** 用户点击周次卡片
- **THEN** 展开/收起详细内容：学什么（Day 1-7 拆解）、学多少、资料链接列表、产出
- **AND** 资料链接在展开状态可点击跳转

### Requirement: 后端周次打钩

系统 SHALL 支持在 app 内标记周次完成，写回 markdown。

#### Scenario: 标记完成
- **WHEN** 用户点击周次卡片的「标记完成」按钮
- **THEN** 系统在该周标题前加 `[x]`（若无则添加），写回 `backend/roadmap.md`
- **AND** 进度卡片周次数 +1

#### Scenario: 取消标记
- **WHEN** 用户点击已完成周次的「取消」按钮
- **THEN** 移除 `[x]` 标记，写回 markdown

### Requirement: 学习中心 Tab 容器

系统 SHALL 在 `/progress` 页面提供三个 Tab：算法 / 后端 / 统计。

#### Scenario: Tab 切换
- **WHEN** 用户点击任一 Tab
- **THEN** 切换到对应内容，URL 不变（状态在组件内）
- **AND** 当前 Tab 高亮

#### Scenario: 统计 Tab
- **WHEN** 用户切换到「统计」Tab
- **THEN** 显示原 ProgressDashboard 内容（算法总进度、连续打卡、累计日志、本周时长）+ 新增「后端进度 N/24 周」卡片

### Requirement: 移动端友好交互

所有交互 SHALL 适配单手手机操作。

#### Scenario: 单手操作
- **WHEN** 用户在手机上使用
- **THEN** 底部 sheet 从屏幕底部滑入，可用拇指操作
- **AND** 打钩按钮在每题右侧，点击区域 ≥44px
- **AND** Tab 切换在顶部，3 个 Tab 平分宽度

#### Scenario: 离线缓存
- **WHEN** 网络断开
- **THEN** 已加载的题目/路线列表保持可见（只读），打钩操作显示「网络不可用」提示
