// lib/ai/weekly-report.ts
// 喂入本周所有学习/复习/状态日志，AI 生成三段式 markdown 周报
// 无 AI key 时降级为统计模板

import { hasAIKey, getModel } from "./provider";
import { generateText } from "ai";
import type { LearnLog, ReviewLog, DailyStatus } from "../types";

export interface WeeklyInput {
  learnLogs: LearnLog[];
  reviewLogs: ReviewLog[];
  statuses: DailyStatus[];
  weekStart: string; // YYYY-MM-DD 周一
}

/**
 * 生成三段式 markdown 周报：
 * ## 本周统计
 * ## 模式识别
 * ## 下周建议
 */
export async function generateWeeklyReport(input: WeeklyInput): Promise<string> {
  const totalMinutes = input.learnLogs.reduce((sum, l) => sum + l.duration, 0);
  const learnCount = input.learnLogs.filter((l) => l.type === "learn").length;
  const reviewCount = input.reviewLogs.length;
  const correctCount = input.reviewLogs.filter((r) => r.rating >= 3).length;
  const accuracy = reviewCount > 0 ? Math.round((correctCount / reviewCount) * 100) : 0;
  const streakDays = new Set(input.learnLogs.map((l) => l.date)).size;
  const avgEnergy =
    input.statuses.length > 0
      ? Number((input.statuses.reduce((s, x) => s + x.energy, 0) / input.statuses.length).toFixed(2))
      : 0;

  const statsSection = `## 本周统计

- 总学习时长：**${totalMinutes} 分钟**（约 ${(totalMinutes / 60).toFixed(1)} 小时）
- 新学知识节点：${learnCount} 个
- 复习卡片：${reviewCount} 张，正确率 ${accuracy}%
- 连续打卡：${streakDays} 天
- 平均能量：${avgEnergy} / 5`;

  // 无 AI key 降级
  if (!hasAIKey() || input.learnLogs.length === 0) {
    const insights: string[] = [];
    if (accuracy < 60) insights.push("复习正确率偏低，建议放慢新内容节奏，加强巩固");
    if (avgEnergy < 3) insights.push("本周能量偏低，注意休息");
    if (streakDays >= 5) insights.push("坚持打卡良好，保持节奏");
    if (insights.length === 0) insights.push("数据稳定，无明显异常模式");

    const recs: string[] = [];
    recs.push("维持当前每日学习量");
    if (accuracy < 60) recs.push("增加 1 次复习频率");
    if (avgEnergy < 3) recs.push("安排 1 天零学习日恢复");

    return `${statsSection}

## 模式识别

${insights.map((s) => `- ${s}`).join("\n")}

## 下周建议

${recs.map((s) => `- ${s}`).join("\n")}`;
  }

  try {
    const model = getModel();
    const dataSummary = JSON.stringify({
      totalMinutes,
      learnCount,
      reviewCount,
      accuracy,
      streakDays,
      avgEnergy,
      dailyMinutes: input.learnLogs.reduce((acc, l) => {
        acc[l.date] = (acc[l.date] ?? 0) + l.duration;
        return acc;
      }, {} as Record<string, number>),
    });
    const { text } = await generateText({
      model,
      system:
        "你是学习教练。生成本周学习报告，严格三段式 markdown：\n" +
        "## 本周统计\n（用列表呈现时长/数量/正确率/打卡/能量）\n\n" +
        "## 模式识别\n（基于数据发现 2-3 条规律，每条一行带 -）\n\n" +
        "## 下周建议\n（3 条具体可执行建议，每条一行带 -）",
      prompt: `本周数据：${dataSummary}`,
    });
    // 校验 AI 返回包含三段标题，缺失则补全
    let report = text;
    if (!report.includes("## 本周统计")) report = statsSection + "\n\n" + report;
    if (!report.includes("## 模式识别")) report += "\n\n## 模式识别\n\n- 数据不足以识别模式";
    if (!report.includes("## 下周建议")) report += "\n\n## 下周建议\n\n- 维持当前节奏";
    return report;
  } catch {
    // 失败降级
    return generateWeeklyReport({ ...input, learnLogs: [] }).then((r) => r);
  }
}
