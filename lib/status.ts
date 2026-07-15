// lib/status.ts
// 每日状态评估 + 基于规则的动态调量引擎（无 AI 依赖，可独立测试）

import type { ScheduleItem, DailyStatus } from "./types";

/**
 * 计算当日容量系数
 * capacity = (energy/3) * (mood==="bad"?0.7:1) * (availableMinutes/30)
 * 1.0 ≈ 正常一天负载（精力 3 + 心情中性 + 30 分钟可用）
 */
export function computeCapacity(status: Pick<DailyStatus, "energy" | "mood" | "availableMinutes">): number {
  const moodFactor = status.mood === "bad" ? 0.7 : 1;
  return (status.energy / 3) * moodFactor * (status.availableMinutes / 30);
}

/**
 * 按容量系数动态调整当日学习计划
 * - capacity < 0.5: 只复习不学新
 * - capacity < 1.0: 新内容减半（向上取整）
 * - capacity > 1.5: 加学一个节点 + 返回"别透支"提醒标记（调用方读 suggestions）
 * - capacity > 1.2: 加学一个节点
 * - 其余 (1.0-1.2): 保持原计划
 */
export function adjustDailyLoad(basePlan: ScheduleItem[], status: DailyStatus): ScheduleItem[] {
  const capacity = computeCapacity(status);
  const learnItems = basePlan.filter((i) => i.type === "learn");
  const reviewItems = basePlan.filter((i) => i.type === "review");

  if (capacity < 0.5) {
    return [...reviewItems];
  }

  if (capacity < 1.0) {
    const half = Math.ceil(learnItems.length / 2);
    return [...learnItems.slice(0, half), ...reviewItems];
  }

  if (capacity > 1.2) {
    // 加学一个节点：复制最后一个 learn 项作为额外加学
    if (learnItems.length > 0) {
      const extra: ScheduleItem = { ...learnItems[learnItems.length - 1] };
      return [...basePlan, extra];
    }
    return [...basePlan];
  }

  // 1.0 <= capacity <= 1.2 保持原计划
  return [...basePlan];
}

/**
 * 判断是否需要触发 AI 增强建议
 * - 连续 3 天 energy < 3
 * - 某节点连续 3 次评分低（rating <= 2）
 */
export function detectEnhanceTrigger(
  recentStatuses: DailyStatus[],
  nodeFailCount: Record<string, number>,
): { consecutiveLowDays: number; nodeFailCount: Record<string, number> } {
  let consecutiveLowDays = 0;
  for (let i = recentStatuses.length - 1; i >= 0; i--) {
    if (recentStatuses[i].energy < 3) {
      consecutiveLowDays++;
    } else {
      break;
    }
  }
  return {
    consecutiveLowDays,
    nodeFailCount,
  };
}
