// scripts/dashboard.ts
// README 仪表盘生成器：从 algorithm/progress.md + daily/*.md 读取数据，生成 README.md
// 运行：npx tsx scripts/dashboard.ts
// 设计原则：解析失败时用占位符降级，绝不抛异常让 CI 挂掉

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, "..");

function readSafe(filePath: string): string {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return "";
  }
}

// 解析算法进度：匹配 "当前: X/Y (Z%)"
function parseProgress(): { done: number; total: number; percent: number } {
  const content = readSafe(path.join(ROOT, "algorithm", "progress.md"));
  const m = content.match(/当前[:：]\s*(\d+)\s*\/\s*(\d+)\s*\((\d+)%\)/);
  if (!m) return { done: 0, total: 200, percent: 0 };
  return { done: +m[1], total: +m[2], percent: +m[3] };
}

// 列出所有日志文件（YYYY-MM-DD.md），排除 template.md
function listDailyLogs(): string[] {
  const dailyDir = path.join(ROOT, "daily");
  if (!fs.existsSync(dailyDir)) return [];
  return fs
    .readdirSync(dailyDir)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
    .sort();
}

// 计算从今天往回的连续打卡天数（按文件名日期）
function currentStreak(logs: string[]): number {
  if (logs.length === 0) return 0;
  const dates = logs.map((f) => f.replace(".md", ""));
  let streak = 0;
  const d = new Date();
  for (;;) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const key = `${y}-${m}-${day}`;
    if (dates.includes(key)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

// 生成进度条
function bar(done: number, total: number, width = 20): string {
  const filled = total > 0 ? Math.round((done / total) * width) : 0;
  return "█".repeat(filled) + "░".repeat(width - filled);
}

function buildReadme(): string {
  const algo = parseProgress();
  const logs = listDailyLogs();
  const streak = currentStreak(logs);
  const latest = logs.length ? logs[logs.length - 1].replace(".md", "") : "—";
  const updatedAt = new Date().toISOString().split("T")[0];

  const algoBar = bar(algo.done, algo.total);

  return `# million-dollar-roadmap
百万年薪计划 · 个人作战系统

> 本 README 由 \`scripts/dashboard.ts\` 自动生成，请勿手动编辑。最后更新：${updatedAt}

## 📊 进度仪表盘

| 指标 | 当前 |
|-----|------|
| 算法进度 | ${algo.done}/${algo.total}（${algo.percent}%）\`${algoBar}\` |
| 连续打卡 | ${streak} 天 |
| 累计日志 | ${logs.length} 篇 |
| 最近日志 | ${latest} |
| 当前主线 | 项目1 · AI Code Review（M1 环境搭建+API接入） |

## 🎯 当前聚焦

- **算法筑基**：8 题/周（深度优先，每题写思路 + 错题本）
- **项目1**：AI Code Review，每周 ≥2 次真实代码 commit
- **每周输出**：1 篇技术拆解（teach to learn），存 \`blog/\`
- **红线**：陪娃时间 0 侵占

## 🧭 系统原则

1. **聚焦**：同一时间只跑一条主线。项目2/3 已冻结。
2. **深度 > 广度**：200 题做透 > 350 题扫过。
3. **可控输入 > 不可控结果**：薪资是这些输入的滞后结果。
4. **陪娃时间不可交易**。

详见 [SYSTEM.md](SYSTEM.md)。

## 📁 仓库结构

\`\`\`
daily/        每日作战日志（YYYY-MM-DD.md）
algorithm/    刷题进度 + 错题本
projects/     项目文档（项目1 进行中，2/3 已冻结）
backend/      后端学习路线（降级，按需学习）
interview/    面试准备
schedule/     作息安排
scripts/      dashboard.ts 仪表盘 + ai-review.ts 周报
.github/      Actions：每日检查 + 周度 AI 复盘
\`\`\`

## ⚙️ 自动化

- **每日 22:30**（北京时间）：[\`daily-check.yml\`](.github/workflows/daily-check.yml) 检查当日打卡，缺卡自动建 Issue 提醒。
- **每周一 18:00**：[\`weekly-review.yml\`](.github/workflows/weekly-review.yml) 调用 AI 生成周度复盘，并刷新本仪表盘。
`;
}

function main(): void {
  const content = buildReadme();
  const readmePath = path.join(ROOT, "README.md");
  fs.writeFileSync(readmePath, content);
  console.log(`README dashboard generated at ${path.relative(ROOT, readmePath)}`);
}

main();
