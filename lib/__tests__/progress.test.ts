import { describe, it, expect } from "vitest";
import {
  parseAlgorithmProgress,
  currentStreak,
  parseWeekHours,
} from "../progress";

describe("progress", () => {
  it("parseAlgorithmProgress 解析 '当前: X/Y (Z%)'", () => {
    const md = `
## 总体目标
- 总量: 200题
- 当前: 12/200 (6%)
`;
    const result = parseAlgorithmProgress(md);
    expect(result.done).toBe(12);
    expect(result.total).toBe(200);
    expect(result.percent).toBe(6);
  });

  it("parseAlgorithmProgress 无匹配返回 0/200/0", () => {
    const result = parseAlgorithmProgress("nothing here");
    expect(result.done).toBe(0);
    expect(result.total).toBe(200);
    expect(result.percent).toBe(0);
  });

  it("currentStreak 从今天往回数连续天数", () => {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const dates = [yesterday, today];
    expect(currentStreak(dates)).toBe(2);
  });

  it("currentStreak 今天没记录则 0", () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    expect(currentStreak([yesterday])).toBe(0);
  });

  it("parseWeekHours 从日志内容提取本周学习时长", () => {
    const logs = [
      `### 产出\n- 有效学习时长：3 小时\n`,
      `### 产出\n- 有效学习时长：2.5 小时\n`,
    ];
    expect(parseWeekHours(logs)).toBe(5.5);
  });

  it("parseWeekHours 无匹配返回 0", () => {
    expect(parseWeekHours(["no match"])).toBe(0);
  });
});
