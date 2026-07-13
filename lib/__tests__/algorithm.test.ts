import { describe, it, expect } from "vitest";
import {
  parseLeetCodeChecklist,
  toggleProblem,
  getAlgorithmStats,
} from "../algorithm";
import { chinaDateNow } from "../time";
import type { LeetCodeProblem } from "../types";

const SAMPLE_MD = `## Phase 1：基础筑基（3题）

### 数组与字符串（3题）

| # | 完成 | 题号 | 标题 | 难度 | 完成日期 | 独立? | 耗时 | 备注 |
|---|------|------|------|------|---------|-------|------|------|
| 1 | [ ] | 1 | 两数之和 | 🟢 简单 | | | | 哈希入门 |
| 2 | [ ] | 49 | 字母异位词分组 | 🟢 简单 | | | | |
| 3 | [x] | 128 | 最长连续序列 | 🟡 中等 | 2026-07-13 | ✅ | 25min | 示例 |
`;

describe("algorithm", () => {
  it("parseLeetCodeChecklist 解析 Phase 1 + 数组专题 + 3 题（含 1 已完成）", () => {
    const problems = parseLeetCodeChecklist(SAMPLE_MD);
    expect(problems).toHaveLength(3);
    expect(problems[0].id).toBe(1);
    expect(problems[0].completed).toBe(false);
    expect(problems[0].phase).toBe(1);
    expect(problems[0].category).toBe("数组与字符串");
    expect(problems[0].difficulty).toBe("简单");
    expect(problems[0].note).toBe("哈希入门");
    expect(problems[2].id).toBe(3);
    expect(problems[2].completed).toBe(true);
    expect(problems[2].difficulty).toBe("中等");
    expect(problems[2].date).toBe("2026-07-13");
    expect(problems[2].independent).toBe("✅");
    expect(problems[2].cost).toBe("25min");
    expect(problems[2].note).toBe("示例");
  });

  it("parseLeetCodeChecklist 空字符串返回 []", () => {
    expect(parseLeetCodeChecklist("")).toEqual([]);
    expect(parseLeetCodeChecklist("   \n  ")).toEqual([]);
  });

  it("toggleProblem 把题 1 从 [ ] 改成 [x] 并填入日期/独立/耗时", () => {
    const result = toggleProblem(SAMPLE_MD, 1, true, {
      date: "2026-07-13",
      independent: "✅",
      cost: "10min",
    });
    const line1 = result.split("\n").find((l) => l.includes("两数之和"));
    expect(line1).toBeDefined();
    expect(line1!).toContain("[x]");
    expect(line1!).not.toContain("[ ]");
    expect(line1!).toContain("2026-07-13");
    expect(line1!).toContain("✅");
    expect(line1!).toContain("10min");
    // 其他行不受影响
    const line3 = result.split("\n").find((l) => l.includes("最长连续序列"));
    expect(line3!).toContain("[x]");
  });

  it("toggleProblem 把已完成题 3 从 [x] 改回 [ ] 并清空字段", () => {
    const result = toggleProblem(SAMPLE_MD, 3, false);
    const line3 = result.split("\n").find((l) => l.includes("最长连续序列"));
    expect(line3).toBeDefined();
    expect(line3!).toContain("[ ]");
    expect(line3!).not.toContain("[x]");
    expect(line3!).not.toContain("2026-07-13");
    expect(line3!).not.toContain("✅");
    expect(line3!).not.toContain("25min");
    expect(line3!).not.toContain("示例");
  });

  it("getAlgorithmStats 统计 5 题（2 完成、1 今天完成、1 独立）", () => {
    const today = chinaDateNow();
    const problems: LeetCodeProblem[] = [
      {
        id: 1,
        completed: true,
        number: "1",
        title: "两数之和",
        difficulty: "简单",
        date: today,
        independent: "✅",
        cost: "10min",
        note: "",
        phase: 1,
        category: "数组",
      },
      {
        id: 2,
        completed: true,
        number: "49",
        title: "字母异位词分组",
        difficulty: "简单",
        date: "2026-01-01",
        independent: "⚠️",
        cost: "20min",
        note: "",
        phase: 1,
        category: "数组",
      },
      {
        id: 3,
        completed: false,
        number: "128",
        title: "最长连续序列",
        difficulty: "中等",
        date: "",
        independent: "",
        cost: "",
        note: "",
        phase: 1,
        category: "数组",
      },
      {
        id: 4,
        completed: false,
        number: "283",
        title: "移动零",
        difficulty: "简单",
        date: "",
        independent: "",
        cost: "",
        note: "",
        phase: 1,
        category: "数组",
      },
      {
        id: 5,
        completed: false,
        number: "11",
        title: "盛最多水的容器",
        difficulty: "中等",
        date: "",
        independent: "",
        cost: "",
        note: "",
        phase: 1,
        category: "数组",
      },
    ];
    const stats = getAlgorithmStats(problems);
    expect(stats.done).toBe(2);
    expect(stats.total).toBe(5);
    expect(stats.todayCount).toBe(1);
    expect(stats.independentCount).toBe(1);
  });

  it("toggleProblem completed=true 不传 fields 时使用默认值（今日日期 + ✅）", () => {
    const result = toggleProblem(SAMPLE_MD, 1, true);
    const line1 = result.split("\n").find((l) => l.includes("两数之和"));
    expect(line1).toBeDefined();
    expect(line1!).toContain("[x]");
    expect(line1!).toContain(chinaDateNow());
    expect(line1!).toContain("✅");
  });
});
