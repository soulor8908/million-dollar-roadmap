import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock AI SDK
vi.mock("ai", () => ({
  generateObject: vi.fn(),
}));

// Mock provider
vi.mock("../lib/ai/provider", () => ({
  createAIProvider: vi.fn(() => ({})),
}));

import { generateObject } from "ai";
import { decomposeKnowledge } from "../lib/ai/knowledge";
import { getFallbackTemplate, listTemplateTopics } from "../lib/ai/templates";

describe("knowledge", () => {
  beforeEach(() => {
    vi.mocked(generateObject).mockReset();
  });

  it("AI 返回 3 节点时正确解析", async () => {
    vi.mocked(generateObject).mockResolvedValueOnce({
      object: {
        topic: "测试主题",
        nodes: [
          { id: "k1", title: "节点1", difficulty: 1, prerequisites: [], frequency: "高", summary: "摘要1" },
          { id: "k2", title: "节点2", difficulty: 2, prerequisites: ["k1"], frequency: "中", summary: "摘要2" },
          { id: "k3", title: "节点3", difficulty: 3, prerequisites: ["k1"], frequency: "低", summary: "摘要3" },
        ],
      },
    } as any);

    const nodes = await decomposeKnowledge("测试主题");
    expect(nodes).toHaveLength(3);
    expect(nodes[0].id).toBe("k1");
    expect(nodes[0].mastery).toBe(0);
    expect(nodes[1].prerequisites).toEqual(["k1"]);
    expect(nodes[2].difficulty).toBe(3);
  });

  it("AI 抛错时降级到模板返回 8 节点", async () => {
    vi.mocked(generateObject).mockRejectedValue(new Error("AI 调用失败"));
    const nodes = await decomposeKnowledge("前端性能");
    expect(nodes).toHaveLength(8);
    expect(nodes[0].id).toBe("k1");
    expect(nodes[0].mastery).toBe(0);
  });

  it("AI 第一次失败、第二次成功时返回正确结果", async () => {
    vi.mocked(generateObject)
      .mockRejectedValueOnce(new Error("第一次失败"))
      .mockResolvedValueOnce({
        object: {
          topic: "React",
          nodes: [
            { id: "k1", title: "JSX", difficulty: 1, prerequisites: [], frequency: "高", summary: "JSX 基础" },
          ],
        },
      } as any);

    const nodes = await decomposeKnowledge("React");
    expect(nodes).toHaveLength(1);
    expect(nodes[0].title).toBe("JSX");
  });

  it("getFallbackTemplate 匹配前端性能", () => {
    const nodes = getFallbackTemplate("前端性能优化");
    expect(nodes).toHaveLength(8);
    expect(nodes[0].title).toContain("浏览器渲染");
  });

  it("getFallbackTemplate 未匹配时返回默认模板", () => {
    const nodes = getFallbackTemplate("完全不匹配的主题");
    expect(nodes.length).toBeGreaterThan(0);
  });

  it("listTemplateTopics 返回 5 个主题", () => {
    const topics = listTemplateTopics();
    expect(topics).toHaveLength(5);
    expect(topics).toContain("前端性能");
    expect(topics).toContain("React基础");
    expect(topics).toContain("TypeScript");
    expect(topics).toContain("算法基础");
    expect(topics).toContain("系统设计");
  });
});
