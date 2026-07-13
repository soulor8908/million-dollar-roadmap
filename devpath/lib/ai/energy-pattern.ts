// lib/ai/energy-pattern.ts
// 聚合 28 天能量数据，按周几算平均，可选 AI 生成洞察与建议

import { hasAIKey, getModel } from "./provider";
import { generateText } from "ai";
import type { DailyStatus, EnergyPattern } from "../types";

/**
 * 按周一..周日聚合平均能量
 * JS getDay(): 0=周日, 1=周一..6=周六
 * 输出顺序：[周一, 周二, ..., 周日]
 */
export function aggregateByWeekday(statuses: DailyStatus[]): number[] {
  const sums = [0, 0, 0, 0, 0, 0, 0];
  const counts = [0, 0, 0, 0, 0, 0, 0];
  for (const s of statuses) {
    const jsDay = new Date(s.date + "T00:00:00+08:00").getDay();
    const idx = jsDay === 0 ? 6 : jsDay - 1;
    sums[idx] += s.energy;
    counts[idx] += 1;
  }
  return sums.map((sum, i) => (counts[i] === 0 ? 0 : Number((sum / counts[i]).toFixed(2))));
}

/**
 * 分析 28 天能量模式
 * - 聚合周几平均能量
 * - 有 AI key 时调用 LLM 生成 insights + recommendations
 * - 无 AI 或失败时降级为规则模板
 */
export async function analyzeEnergyPattern(statuses: DailyStatus[]): Promise<EnergyPattern> {
  const avgEnergyByWeekday = aggregateByWeekday(statuses);
  const weekStart = statuses.length > 0 ? statuses[0].date : new Date().toISOString().slice(0, 10);

  const minIdx = avgEnergyByWeekday.indexOf(Math.min(...avgEnergyByWeekday.filter((v) => v > 0)));
  const maxIdx = avgEnergyByWeekday.indexOf(Math.max(...avgEnergyByWeekday));
  const weekdayNames = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

  const fallbackInsights: string[] = [];
  const fallbackRecs: string[] = [];

  if (avgEnergyByWeekday.some((v) => v > 0)) {
    if (minIdx >= 0) fallbackInsights.push(`${weekdayNames[minIdx]}是你的低能量日（平均 ${avgEnergyByWeekday[minIdx]} 分）`);
    if (maxIdx >= 0) fallbackInsights.push(`${weekdayNames[maxIdx]}是你的高能量日（平均 ${avgEnergyByWeekday[maxIdx]} 分）`);
    if (minIdx >= 0) fallbackRecs.push(`建议${weekdayNames[minIdx]}只做轻度复习，不学新内容`);
    if (maxIdx >= 0) fallbackRecs.push(`建议${weekdayNames[maxIdx]}安排最难的知识节点`);
  }
  if (statuses.filter((s) => s.energy < 3).length >= 7) {
    fallbackInsights.push("近 28 天有 7 天以上低能量，可能存在过度疲劳");
    fallbackRecs.push("建议安排一个零学习日恢复");
  }

  if (!hasAIKey() || statuses.length === 0) {
    return { weekStart, avgEnergyByWeekday, insights: fallbackInsights, recommendations: fallbackRecs };
  }

  try {
    const model = getModel();
    const dataStr = avgEnergyByWeekday.map((v, i) => `${weekdayNames[i]}: ${v}`).join(", ");
    const { text } = await generateText({
      model,
      system:
        "你是学习教练。分析用户 28 天能量曲线，找出低能量日和高能量日，给 3 条具体建议。" +
        "输出 JSON：{\"insights\": string[], \"recommendations\": string[]}，每项 1 句话。",
      prompt: `周几平均能量：${dataStr}`,
    });
    const parsed = JSON.parse(text) as { insights: string[]; recommendations: string[] };
    return {
      weekStart,
      avgEnergyByWeekday,
      insights: Array.isArray(parsed.insights) ? parsed.insights : fallbackInsights,
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : fallbackRecs,
    };
  } catch {
    return { weekStart, avgEnergyByWeekday, insights: fallbackInsights, recommendations: fallbackRecs };
  }
}
