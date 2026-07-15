import { describe, it, expect } from "vitest";
import {
  parseBackendRoadmap,
  toggleWeek,
  getBackendStats,
} from "../lib/backend";

const SAMPLE_MD = `# 后端学习路线

## Month 1：基础

### [x] Week 1：语法基础 + 工具链

**学习资料**
- [Rust Book](https://doc.rust-lang.org/book/)
- [Rust by Example](https://doc.rust-lang.org/rust-by-example/)

**学什么**
- Day 1: 变量与类型
- Day 2: 控制流
- Day 3: 函数

**产出**：hello-world demo

### Week 2：所有权与借用

**学什么**
- Day 1: 所有权概念
- Day 2: 借用规则

## Month 2：进阶

### Week 3：错误处理

**学什么**
- Day 1: Result 和 Option
`;

describe("backend parser", () => {
  it("parseBackendRoadmap 解析所有周", () => {
    const weeks = parseBackendRoadmap(SAMPLE_MD);
    expect(weeks.length).toBe(3);
    expect(weeks[0].weekIndex).toBe(1);
    expect(weeks[0].title).toBe("语法基础 + 工具链");
    expect(weeks[0].completed).toBe(true);
    expect(weeks[0].month).toBe(1);
  });

  it("parseBackendRoadmap 解析学习资料", () => {
    const weeks = parseBackendRoadmap(SAMPLE_MD);
    expect(weeks[0].resources.length).toBe(2);
    expect(weeks[0].resources[0].label).toBe("Rust Book");
    expect(weeks[0].resources[0].url).toContain("rust-lang.org");
  });

  it("parseBackendRoadmap 解析 Day 拆解", () => {
    const weeks = parseBackendRoadmap(SAMPLE_MD);
    expect(weeks[0].days.length).toBe(3);
    expect(weeks[0].days[0]).toContain("变量与类型");
  });

  it("parseBackendRoadmap 解析产出", () => {
    const weeks = parseBackendRoadmap(SAMPLE_MD);
    expect(weeks[0].output).toBe("hello-world demo");
  });

  it("parseBackendRoadmap 未完成周标记正确", () => {
    const weeks = parseBackendRoadmap(SAMPLE_MD);
    expect(weeks[1].completed).toBe(false);
    expect(weeks[2].completed).toBe(false);
  });

  it("getBackendStats 统计正确", () => {
    const weeks = parseBackendRoadmap(SAMPLE_MD);
    const stats = getBackendStats(weeks);
    expect(stats.done).toBe(1);
    expect(stats.total).toBe(3);
  });

  it("toggleWeek 标记完成", () => {
    const newMd = toggleWeek(SAMPLE_MD, 2, true);
    const weeks = parseBackendRoadmap(newMd);
    const week2 = weeks.find((w) => w.weekIndex === 2);
    expect(week2?.completed).toBe(true);
  });

  it("toggleWeek 取消完成", () => {
    const newMd = toggleWeek(SAMPLE_MD, 1, false);
    const weeks = parseBackendRoadmap(newMd);
    const week1 = weeks.find((w) => w.weekIndex === 1);
    expect(week1?.completed).toBe(false);
  });

  it("parseBackendRoadmap 空字符串返回空数组", () => {
    expect(parseBackendRoadmap("")).toEqual([]);
    expect(parseBackendRoadmap("")).toEqual([]);
  });
});
