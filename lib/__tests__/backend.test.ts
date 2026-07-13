import { describe, it, expect } from "vitest";
import { parseBackendRoadmap, toggleWeek, getBackendStats } from "../backend";
import type { BackendWeek } from "../types";

const sampleMarkdown = `## Month 1：Go 基础（Week 1-4，约 30h）

### Week 1：语法基础 + 工具链

**学习资料**：
- 🌐 [A Tour of Go](https://go.dev/tour/welcome/list)（官方互动教程，约 4h）
- 🌐 [Go by Example](https://gobyexample.com/)（按知识点查代码示例）

**学什么**：
- Day 1-2：变量、类型、流程控制
- Day 3：函数、多返回值、defer
- Day 4：结构体、方法

**学多少**：
- 完成 Tour of Go 全部练习
- 用 Go 重写 2 道 LeetCode 简单题

**产出**：\`backend/demos/week1-hello/\` — 包含 5 个小练习 + 2 道 LeetCode 题解

---

### [x] Week 2：集合类型 + 接口

**学习资料**：
- 📖 [《Go 语言圣经》第 4-7 章](https://gopl-zh.com/ch4)

**学什么**：
- Day 1-2：数组、切片
- Day 3：map

**学多少**：
- 写一个 CLI demo

**产出**：\`backend/demos/week2-student-cli/\`
`;

describe("backend roadmap", () => {
  it("parseBackendRoadmap 解析 2 个 week，第 1 个 week 有 2 resources/3 days/1 output", () => {
    const weeks = parseBackendRoadmap(sampleMarkdown);
    expect(weeks).toHaveLength(2);

    const w1 = weeks[0];
    expect(w1.month).toBe(1);
    expect(w1.weekIndex).toBe(1);
    expect(w1.title).toBe("语法基础 + 工具链");
    expect(w1.completed).toBe(false);
    expect(w1.resources).toHaveLength(2);
    expect(w1.resources[0].label).toBe("A Tour of Go");
    expect(w1.resources[0].url).toBe("https://go.dev/tour/welcome/list");
    expect(w1.resources[1].label).toBe("Go by Example");
    expect(w1.resources[1].url).toBe("https://gobyexample.com/");
    expect(w1.days).toHaveLength(3);
    expect(w1.days[0]).toBe("Day 1-2：变量、类型、流程控制");
    expect(w1.days[2]).toBe("Day 4：结构体、方法");
    expect(w1.output).toContain("backend/demos/week1-hello/");
    expect(w1.summary).toBe("语法基础 + 工具链Day 1-2：变量、类型、流程控制");

    const w2 = weeks[1];
    expect(w2.month).toBe(1);
    expect(w2.weekIndex).toBe(2);
    expect(w2.title).toBe("集合类型 + 接口");
    expect(w2.completed).toBe(true);
    expect(w2.resources).toHaveLength(1);
    expect(w2.resources[0].label).toBe("《Go 语言圣经》第 4-7 章");
    expect(w2.days).toHaveLength(2);
    expect(w2.output).toContain("backend/demos/week2-student-cli/");
  });

  it("parseBackendRoadmap 空字符串返回 []", () => {
    expect(parseBackendRoadmap("")).toEqual([]);
    expect(parseBackendRoadmap("   \n  ")).toEqual([]);
  });

  it("toggleWeek 给 Week 1 加上 [x]", () => {
    const result = toggleWeek(sampleMarkdown, 1, true);
    expect(result).toContain("### [x] Week 1：语法基础 + 工具链");
    // Week 2 不受影响
    expect(result).toContain("### [x] Week 2：集合类型 + 接口");
  });

  it("toggleWeek 移除 Week 2 的 [x]", () => {
    const result = toggleWeek(sampleMarkdown, 2, false);
    expect(result).toContain("### Week 2：集合类型 + 接口");
    expect(result).not.toContain("### [x] Week 2：");
    // Week 1 不受影响
    expect(result).toContain("### Week 1：语法基础 + 工具链");
    expect(result).not.toContain("### [x] Week 1：");
  });

  it("getBackendStats 统计 4 个 week（2 完成）返回 done=2 total=4", () => {
    const weeks: BackendWeek[] = [
      { month: 1, weekIndex: 1, title: "a", completed: true, summary: "", resources: [], output: "", days: [] },
      { month: 1, weekIndex: 2, title: "b", completed: false, summary: "", resources: [], output: "", days: [] },
      { month: 2, weekIndex: 3, title: "c", completed: true, summary: "", resources: [], output: "", days: [] },
      { month: 2, weekIndex: 4, title: "d", completed: false, summary: "", resources: [], output: "", days: [] },
    ];
    const stats = getBackendStats(weeks);
    expect(stats.done).toBe(2);
    expect(stats.total).toBe(4);
  });

  it("getBackendStats 从解析结果统计 sample（done=1 total=2）", () => {
    const weeks = parseBackendRoadmap(sampleMarkdown);
    const stats = getBackendStats(weeks);
    expect(stats.done).toBe(1);
    expect(stats.total).toBe(2);
  });
});
