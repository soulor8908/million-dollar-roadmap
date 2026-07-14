// lib/ai/knowledge.ts
// 知识树拆解：调用 LLM 生成 KnowledgeNode[]
// 失败重试 2 次，最终降级到预设模板

import { generateObject } from "ai";
import { z } from "zod";
import { createAIProvider } from "./provider";
import { getFallbackTemplate } from "./templates";
import type { KnowledgeNode } from "../types";

const SYSTEM_PROMPT = `你是技术学习专家。把用户给的学习主题拆解成知识节点。
要求：
1. 每个节点是一个可独立学习的最小知识单元
2. 标注节点间的依赖关系
3. 评估难度 1-5
4. 按面试出现频率排序
5. 节点数量由主题复杂度自行决定，不限制数量（简单主题 5-8 个，复杂主题可达 20-30 个）
6. 标记大厂高频考点（bigTech=true 表示互联网大厂面试重点考察）
7. 输出严格 JSON`;

const nodeSchema = z.object({
  id: z.string().describe("节点 ID，格式 k1, k2, ..."),
  title: z.string().describe("知识点标题"),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  prerequisites: z.array(z.string()).describe("依赖的节点 id 列表"),
  frequency: z.union([z.literal("高"), z.literal("中"), z.literal("低")]),
  bigTech: z.boolean().describe("是否大厂高频考点"),
  summary: z.string().describe("一句话知识点摘要"),
});

const treeSchema = z.object({
  topic: z.string(),
  nodes: z.array(nodeSchema),
});

export async function decomposeKnowledge(
  topic: string,
  userPrompt?: string
): Promise<KnowledgeNode[]> {
  try {
    // 组装最终 prompt：主题 + 用户自定义提示词
    const promptParts = [`请拆解学习主题：${topic}`];
    if (userPrompt && userPrompt.trim()) {
      promptParts.push(`\n用户补充要求：\n${userPrompt.trim()}`);
    }
    const result = await withRetry(
      () =>
        generateObject({
          model: createAIProvider(),
          schema: treeSchema,
          system: SYSTEM_PROMPT,
          prompt: promptParts.join("\n"),
        }),
      2
    );
    return result.object.nodes.map((n) => ({
      ...n,
      mastery: 0,
    }));
  } catch {
    return getFallbackTemplate(topic);
  }
}

async function withRetry<T>(fn: () => Promise<T>, retries: number): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}
