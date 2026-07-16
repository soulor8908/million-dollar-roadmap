// lib/status.ts
// 每日状态评估 + 基于规则的动态调量引擎（无 AI 依赖，可独立测试）

import type { ScheduleItem, DailyStatus } from "./types";
import { DEFAULT_ENERGY_CONFIG, type EnergyConfig } from "./energy-config";

/**
 * 计算当日容量系数
 * capacity = (energy/energyDivisor) * moodMultiplier * (availableMinutes/timeDivisor)
 * 1.0 ≈ 正常一天负载（精力 3 + 心情中性 + 30 分钟可用）
 *
 * 心情对应的乘数由 config 提供：good/neutral/bad 各一个
 */
export function computeCapacity(
  status: Pick<DailyStatus, "energy" | "mood" | "availableMinutes">,
  config: EnergyConfig = DEFAULT_ENERGY_CONFIG,
): number {
  const moodFactor =
    status.mood === "bad"
      ? config.moodBadMultiplier
      : status.mood === "good"
        ? config.moodGoodMultiplier
        : config.moodNeutralMultiplier;
  return (
    (status.energy / config.energyDivisor) *
    moodFactor *
    (status.availableMinutes / config.timeDivisor)
  );
}

/**
 * 按容量系数动态调整当日学习计划
 * - capacity < restOnlyThreshold: 只复习不学新
 * - capacity < reducedThreshold: 新内容减半（向上取整）
 * - capacity > boostThreshold: 加学一个节点
 * - 其余: 保持原计划
 *
 * 默认阈值：0.5 / 1.0 / 1.2（见 DEFAULT_ENERGY_CONFIG）
 */
export function adjustDailyLoad(
  basePlan: ScheduleItem[],
  status: DailyStatus,
  config: EnergyConfig = DEFAULT_ENERGY_CONFIG,
): ScheduleItem[] {
  const capacity = computeCapacity(status, config);
  const learnItems = basePlan.filter((i) => i.type === "learn");
  const reviewItems = basePlan.filter((i) => i.type === "review");

  if (capacity < config.restOnlyThreshold) {
    return [...reviewItems];
  }

  if (capacity < config.reducedThreshold) {
    const half = Math.ceil(learnItems.length / 2);
    return [...learnItems.slice(0, half), ...reviewItems];
  }

  if (capacity > config.boostThreshold) {
    // 加学一个节点：复制最后一个 learn 项作为额外加学
    if (learnItems.length > 0) {
      const extra: ScheduleItem = { ...learnItems[learnItems.length - 1] };
      return [...basePlan, extra];
    }
    return [...basePlan];
  }

  // reducedThreshold <= capacity <= boostThreshold 保持原计划
  return [...basePlan];
}

/**
 * 判断是否需要触发 AI 增强建议
 * - 连续 consecutiveLowDays 天 energy < lowEnergyThreshold
 * - 某节点连续 3 次评分低（rating <= 2）
 *
 * 返回 consecutiveLowDays 为实际连续低能量天数计数；
 * 调用方将其与 config.consecutiveLowDays 阈值比较以决定是否触发增强。
 */
export function detectEnhanceTrigger(
  recentStatuses: DailyStatus[],
  nodeFailCount: Record<string, number>,
  config: EnergyConfig = DEFAULT_ENERGY_CONFIG,
): { consecutiveLowDays: number; nodeFailCount: Record<string, number> } {
  let consecutiveLowDays = 0;
  for (let i = recentStatuses.length - 1; i >= 0; i--) {
    if (recentStatuses[i].energy < config.lowEnergyThreshold) {
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
