import { describe, it, expect } from "vitest";
import { parseDailyLog, toggleChecklistItem, createEmptyLog, formatDailyLog } from "../daily";

const sampleMarkdown = `# 📅 2026-07-13 作战日志

## 🎯 今日计划（昨晚睡前制定）

| 时段 | 任务 | 预计时长 | 优先级 |
|-----|------|---------|--------|
| 6:00-6:30 晨练 | 🏃 俯卧撑 | 30min | P0 |

## ✅ 实际执行（实时记录）

- [ ] 6:00-6:30 晨练
- [x] 6:30-7:00 早起学习
- [ ] 7:00-8:20 通勤算法

## 📊 今日数据

### 产出
- 算法题完成：2 道（题号：1,2）
- 有效学习时长：3 小时
- 时间利用率：60%

### 能量（核心指标）
- 昨晚睡眠：7.5 小时（22:45 关灯？✅）
- 晨练执行：✅
- 今日能量曲线：晨4 中3 晚2（1-5分）
- 今日情绪：😊😐
- 陪娃质量：⭐⭐⭐⭐⭐

## 📝 复盘

### 今天做得好的
1. 晨练执行
2. 算法 2 题

### 今天的问题
1. 下午能量低

### 明天的调整
- 午休真正休息
`;

describe("daily", () => {
  it("parseDailyLog 解析 checklist", () => {
    const log = parseDailyLog(sampleMarkdown, "2026-07-13");
    expect(log.date).toBe("2026-07-13");
    expect(log.checklist).toHaveLength(3);
    expect(log.checklist[0].checked).toBe(false);
    expect(log.checklist[0].text).toBe("6:00-6:30 晨练");
    expect(log.checklist[1].checked).toBe(true);
    expect(log.checklist[1].text).toBe("6:30-7:00 早起学习");
  });

  it("parseDailyLog 解析能量字段", () => {
    const log = parseDailyLog(sampleMarkdown, "2026-07-13");
    expect(log.energy.sleep).toBe("7.5");
    expect(log.energy.sleepOnTime).toBe(true);
    expect(log.energy.exerciseDone).toBe(true);
    expect(log.energy.energyMorning).toBe(4);
    expect(log.energy.energyNoon).toBe(3);
    expect(log.energy.energyEvening).toBe(2);
    expect(log.energy.familyQuality).toBe(5);
  });

  it("parseDailyLog 解析复盘段落", () => {
    const log = parseDailyLog(sampleMarkdown, "2026-07-13");
    expect(log.review.good).toContain("晨练执行");
    expect(log.review.problems).toContain("下午能量低");
    expect(log.review.tomorrow).toContain("午休");
  });

  it("toggleChecklistItem 切换第 0 项", () => {
    const newContent = toggleChecklistItem(sampleMarkdown, 0);
    const newLog = parseDailyLog(newContent, "2026-07-13");
    expect(newLog.checklist[0].checked).toBe(true);
  });

  it("createEmptyLog 生成空模板", () => {
    const log = createEmptyLog("2026-07-14");
    const md = formatDailyLog(log);
    expect(md).toContain("2026-07-14");
    expect(md).toContain("## ✅ 实际执行");
    expect(md).toContain("## 📊 今日数据");
  });

  it("parseDailyLog 空文件不崩溃", () => {
    const log = parseDailyLog("", "2026-07-14");
    expect(log.checklist).toHaveLength(0);
    expect(log.energy.familyQuality).toBe(0);
  });
});
