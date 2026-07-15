import { describe, it, expect } from "vitest";
import {
  parseLeetCodeChecklist,
  toggleProblem,
  getAlgorithmStats,
} from "../lib/algorithm";

const SAMPLE_MD = `# LeetCode 刷题清单

## Phase 1：基础筑基（64题，Hot 100 核心）

### 数组与字符串（18题）

| # | 完成 | 题号 | 标题 | 难度 | 日期 | 独立 | 耗时 | 备注 |
|---|------|------|------|------|------|------|------|------|
| 1 | [x] | 1 | 两数之和 | 🟢简单 | 2026-07-10 | ✅ | 5 | 哈希表 |
| 2 | [ ] | 128 | 最长连续序列 | 🟡中等 |  |  |  |  |

### 链表（8题）

| # | 完成 | 题号 | 标题 | 难度 | 日期 | 独立 | 耗时 | 备注 |
|---|------|------|------|------|------|------|------|------|
| 3 | [x] | 206 | 反转链表 | 🟢简单 | 2026-07-11 | ⚠️ | 10 | 需要复习 |

## Phase 2：进阶提升

### 动态规划（15题）

| # | 完成 | 题号 | 标题 | 难度 | 日期 | 独立 | 耗时 | 备注 |
|---|------|------|------|------|------|------|------|------|
| 4 | [ ] | 70 | 爬楼梯 | 🟢简单 |  |  |  |  |
`;

describe("algorithm parser", () => {
  it("parseLeetCodeChecklist 解析所有题目", () => {
    const problems = parseLeetCodeChecklist(SAMPLE_MD);
    expect(problems.length).toBe(4);
    expect(problems[0].id).toBe(1);
    expect(problems[0].completed).toBe(true);
    expect(problems[0].number).toBe("1");
    expect(problems[0].title).toBe("两数之和");
    expect(problems[0].difficulty).toBe("简单");
    expect(problems[0].date).toBe("2026-07-10");
    expect(problems[0].independent).toBe("✅");
    expect(problems[0].phase).toBe(1);
    expect(problems[0].category).toBe("数组与字符串");
  });

  it("parseLeetCodeChecklist 正确解析 Phase 和 Category", () => {
    const problems = parseLeetCodeChecklist(SAMPLE_MD);
    expect(problems[2].phase).toBe(1);
    expect(problems[2].category).toBe("链表");
    expect(problems[3].phase).toBe(2);
    expect(problems[3].category).toBe("动态规划");
  });

  it("getAlgorithmStats 统计正确", () => {
    const problems = parseLeetCodeChecklist(SAMPLE_MD);
    const stats = getAlgorithmStats(problems);
    expect(stats.total).toBe(4);
    expect(stats.done).toBe(2);
    expect(stats.independentCount).toBe(1); // 只有题 1 是 ✅
  });

  it("toggleProblem 标记完成", () => {
    const newMd = toggleProblem(SAMPLE_MD, 2, true, {
      date: "2026-07-15",
      independent: "✅",
      cost: "20",
      note: "Set 去重",
    });
    const problems = parseLeetCodeChecklist(newMd);
    expect(problems[1].completed).toBe(true);
    expect(problems[1].date).toBe("2026-07-15");
    expect(problems[1].note).toBe("Set 去重");
  });

  it("toggleProblem 取消完成", () => {
    const newMd = toggleProblem(SAMPLE_MD, 1, false);
    const problems = parseLeetCodeChecklist(newMd);
    expect(problems[0].completed).toBe(false);
    expect(problems[0].date).toBe("");
  });

  it("parseLeetCodeChecklist 空字符串返回空数组", () => {
    expect(parseLeetCodeChecklist("")).toEqual([]);
    expect(parseLeetCodeChecklist("")).toEqual([]);
  });
});
