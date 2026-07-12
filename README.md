# million-dollar-roadmap
百万年薪计划 · 个人作战系统

> 本 README 由 `scripts/dashboard.js` 自动生成，请勿手动编辑。最后更新：2026-07-12

## 📊 进度仪表盘

| 指标 | 当前 |
|-----|------|
| 算法进度 | 0/200（0%）`░░░░░░░░░░░░░░░░░░░░` |
| 连续打卡 | 0 天 |
| 累计日志 | 1 篇 |
| 最近日志 | 2026-07-13 |
| 当前主线 | 项目1 · AI Code Review（M1 环境搭建+API接入） |

## 🎯 当前聚焦

- **算法筑基**：8 题/周（深度优先，每题写思路 + 错题本）
- **项目1**：AI Code Review，每周 ≥2 次真实代码 commit
- **每周输出**：1 篇技术拆解（teach to learn），存 `blog/`
- **红线**：陪娃时间 0 侵占

## 🧭 系统原则

1. **聚焦**：同一时间只跑一条主线。项目2/3 已冻结。
2. **深度 > 广度**：200 题做透 > 350 题扫过。
3. **可控输入 > 不可控结果**：薪资是这些输入的滞后结果。
4. **陪娃时间不可交易**。

详见 [SYSTEM.md](SYSTEM.md)。

## 📁 仓库结构

```
daily/        每日作战日志（YYYY-MM-DD.md）
algorithm/    刷题进度 + 错题本
projects/     项目文档（项目1 进行中，2/3 已冻结）
backend/      后端学习路线（降级，按需学习）
interview/    面试准备
schedule/     作息安排
scripts/      dashboard.js 仪表盘 + ai-review.js 周报
.github/      Actions：每日检查 + 周度 AI 复盘
```

## ⚙️ 自动化

- **每日 22:30**（北京时间）：[`daily-check.yml`](.github/workflows/daily-check.yml) 检查当日打卡，缺卡自动建 Issue 提醒。
- **每周一 18:00**：[`weekly-review.yml`](.github/workflows/weekly-review.yml) 调用 AI 生成周度复盘，并刷新本仪表盘。
