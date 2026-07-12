import { describe, it, expect } from "vitest";
import { parseEmotionFile, formatEmotionEntry } from "../emotion";

const sampleMarkdown = `# 📖 2026-07-13 情绪笔记

## 情绪记录

### 14:30 | 焦虑 😰
- 触发：算法题卡住30min没思路
- 影响：想刷手机逃避
- 应对：起身喝水 + 478呼吸3轮
- 多巴胺干扰：否

### 20:00 | 疲惫 😴
- 触发：连续学习2h
- 影响：注意力下降
- 应对：切换到简单任务
- 多巴胺干扰：刷手机
`;

describe("emotion", () => {
  it("parseEmotionFile 解析多条记录", () => {
    const result = parseEmotionFile(sampleMarkdown, "2026-07-13");
    expect(result.date).toBe("2026-07-13");
    expect(result.entries).toHaveLength(2);
    expect(result.entries[0].time).toBe("14:30");
    expect(result.entries[0].tag).toBe("焦虑");
    expect(result.entries[0].emoji).toBe("😰");
    expect(result.entries[0].trigger).toBe("算法题卡住30min没思路");
    expect(result.entries[0].dopamine).toBe("无");
  });

  it("parseEmotionFile 空文件返回空数组", () => {
    const result = parseEmotionFile("# 空\n", "2026-07-13");
    expect(result.entries).toHaveLength(0);
  });

  it("formatEmotionEntry 生成 markdown 片段", () => {
    const entry = {
      time: "14:30",
      tag: "焦虑" as const,
      emoji: "😰",
      trigger: "算法卡住",
      impact: "想刷手机",
      coping: "478呼吸",
      dopamine: "无" as const,
    };
    const md = formatEmotionEntry(entry);
    expect(md).toContain("### 14:30 | 焦虑 😰");
    expect(md).toContain("- 触发：算法卡住");
    expect(md).toContain("- 多巴胺干扰：无");
  });
});
