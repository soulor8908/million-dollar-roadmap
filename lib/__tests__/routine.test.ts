import { describe, it, expect } from "vitest";
import { parseRoutine, getCurrentTask } from "../routine";
import type { RoutineSlot } from "../types";

const sampleMarkdown = `
## 工作日时间表

| 时间 | 事项 | 类型 |
|-----|------|------|
| 6:00-6:30 | 🏃 **晨练**：俯卧撑/拉伸 | 💪 运动 |
| 6:30-7:00 | 🎯 **黄金30min**：算法 | 📚 学习 |
| 7:00-8:20 | 🎯 通勤算法 | 📚 学习 |
| 18:30-20:30 | 🎯 **公司学习2小时** | 📚 学习 |
| 22:00-22:45 | **陪娃洗漱陪玩** | 👨‍👧 家庭 |
`;

describe("routine", () => {
  it("parseRoutine 解析时间表行", () => {
    const slots = parseRoutine(sampleMarkdown);
    expect(slots).toHaveLength(5);
    expect(slots[0].start).toBe("06:00");
    expect(slots[0].end).toBe("06:30");
    expect(slots[0].activity).toContain("晨练");
  });

  it("getCurrentTask 返回当前时段和下一个", () => {
    const slots: RoutineSlot[] = [
      { start: "06:00", end: "06:30", activity: "晨练", type: "运动" },
      { start: "06:30", end: "07:00", activity: "算法", type: "学习" },
      { start: "07:00", end: "08:20", activity: "通勤算法", type: "学习" },
    ];
    const result = getCurrentTask(slots, "06:15");
    expect(result.current?.activity).toBe("晨练");
    expect(result.next?.activity).toBe("算法");
    expect(result.minutesLeft).toBe(15);
  });

  it("getCurrentTask 时段之外返回 null", () => {
    const slots: RoutineSlot[] = [
      { start: "06:00", end: "06:30", activity: "晨练", type: "运动" },
      { start: "06:30", end: "07:00", activity: "算法", type: "学习" },
    ];
    const result = getCurrentTask(slots, "08:00");
    expect(result.current).toBeNull();
    expect(result.next).toBeNull();
  });
});
