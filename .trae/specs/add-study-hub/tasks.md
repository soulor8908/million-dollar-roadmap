# Tasks

- [x] Task 1: 扩展类型定义
  - [ ] 在 `lib/types.ts` 新增 `LeetCodeProblem` 类型（id, completed, number, title, difficulty, date, independent, cost, note, phase, category）
  - [ ] 新增 `BackendWeek` 类型（month, weekIndex, title, completed, summary, resources[], output, days[]）
  - [ ] 新增 `StudyTab = "algorithm" | "backend" | "stats"` 类型
  - [ ] 扩展 `ProgressInfo` 增加 `algorithmTodayCount`, `algorithmIndependentCount`, `backendWeeksDone`, `backendWeeksTotal`

- [x] Task 2: 算法 markdown 解析器 + 写回
  - [ ] 创建 `lib/algorithm.ts`
  - [ ] 实现 `parseLeetCodeChecklist(markdown): LeetCodeProblem[]`，解析 `| # | 完成 | 题号 | 标题 | 难度 | 完成日期 | 独立? | 耗时 | 备注 |` 表格
  - [ ] 实现 `toggleProblem(markdown, problemId, completed): string`，把指定题目 `[ ]` ↔ `[x]` 切换并填写/清空字段
  - [ ] 实现 `getAlgorithmStats(problems): { done, total, todayCount, independentCount }`
  - [ ] 编写测试 `lib/__tests__/algorithm.test.ts`（至少 5 个用例：解析、切换、统计、今日、空数据）

- [x] Task 3: 后端路线 markdown 解析器 + 写回
  - [ ] 创建 `lib/backend.ts`
  - [ ] 实现 `parseBackendRoadmap(markdown): BackendWeek[]`，解析 `### Week N: 标题` 和 `**学习资料**` `**学什么**` `**学多少**` `**产出**` 字段
  - [ ] 实现 `toggleWeek(markdown, weekIndex, completed): string`，在标题前加/移除 `[x]`
  - [ ] 实现 `getBackendStats(weeks): { done, total }`
  - [ ] 编写测试 `lib/__tests__/backend.test.ts`（至少 4 个用例）

- [x] Task 4: 算法列表组件
  - [ ] 创建 `components/AlgorithmList.tsx`
  - [ ] 顶部显示进度卡片（已完成/200 + 今日 + 独立）
  - [ ] 「只看未完成」开关
  - [ ] 按专题（Phase > Category）折叠分组，默认 Phase 1 展开
  - [ ] 每题一行：`#编号 题号 标题 [难度] [○/✓]`，打钩按钮点击区域 ≥44px
  - [ ] 点击未完成题目弹出底部 sheet（Task 5）
  - [ ] 点击已完成题目弹出确认取消

- [x] Task 5: 题目快速记录 BottomSheet 组件
  - [ ] 创建 `components/ProblemSheet.tsx`
  - [ ] 从屏幕底部滑入，含：完成日期（默认 chinaDateNow）、独立?（✅/⚠️/❌ 三选一）、耗时（数字输入 min）、备注（可选文本框）
  - [ ] 「保存」按钮调用 `toggleProblem` 写回 markdown 并刷新列表
  - [ ] 「取消」按钮关闭 sheet
  - [ ] 移动端拇指友好，最大高度 70vh

- [x] Task 6: 后端路线列表组件
  - [ ] 创建 `components/BackendRoadmap.tsx`
  - [ ] 顶部显示进度卡片（已完成/24 周）
  - [ ] 按 Month 分组（Month 1/2/3/4-5/6），每周一张卡片
  - [ ] 卡片折叠/展开，展开显示：学什么（Day 拆解）、学多少、资料链接（可点击）、产出
  - [ ] 「标记完成」/「取消」按钮，调用 `toggleWeek` 写回
  - [ ] 资料链接 `<a target="_blank">` 新窗口打开

- [x] Task 7: Tab 容器 + 整合到 /progress 页面
  - [ ] 创建 `components/StudyTabs.tsx`，顶部三 Tab（算法/后端/统计）平分宽度，当前高亮
  - [ ] 修改 `app/progress/page.tsx`，用 StudyTabs 包裹 AlgorithmList + BackendRoadmap + ProgressDashboard
  - [ ] 修改 `ProgressDashboard.tsx`，新增「后端进度 N/24 周」卡片
  - [ ] 修改 `lib/progress.ts` 的 `buildProgressInfo`，支持从 checklist markdown 计算今日完成数和独立做出数

- [x] Task 8: Nav 标签改名 + 文案
  - [ ] 修改 `components/Nav.tsx`，把「进度」改为「学习」
  - [ ] 更新 `app/progress/page.tsx` 的 H1 标题为「📚 学习中心」

- [x] Task 9: 端到端验证
  - [ ] 运行 `npm test`，全部通过
  - [ ] 运行 `npm run build`，无错误
  - [ ] 运行 `npm run dev`，手动验证三个 Tab 切换、算法打钩、后端打钩、统计页正常

# Task Dependencies
- Task 2 depends on Task 1（需要类型）
- Task 3 depends on Task 1
- Task 4 depends on Task 2（需要解析器）
- Task 5 depends on Task 2
- Task 6 depends on Task 3
- Task 7 depends on Task 4, 5, 6
- Task 8 可与 Task 4-6 并行
- Task 9 depends on Task 7, 8
