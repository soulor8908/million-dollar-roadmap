// lib/ai/question.ts
// 面试题生成：对每个 KnowledgeNode 并行生成面试题
// 分批 5 个一组，单节点失败不影响其他

import { generateObject } from "ai";
import { z } from "zod";
import { nanoid } from "nanoid";
import { createAIProvider } from "./provider";
import type { KnowledgeNode, Question } from "../types";

const SYSTEM_PROMPT = `你是资深技术面试官。针对给定知识点生成一道高频面试题。
要求：
1. 题目要考察对知识点的深度理解
2. 答案用三段式：结论 → 展开解释 → 代码示例（200-500 字）
3. keyPoints 3-5 个关键点
4. followUps 2-3 个追问
5. 如果适用，提供 codeSnippet`;

const questionSchema = z.object({
  question: z.string(),
  answer: z.string(),
  keyPoints: z.array(z.string()),
  followUps: z.array(z.string()),
  codeSnippet: z.string().optional(),
});

function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

async function generateOne(node: KnowledgeNode): Promise<Question> {
  try {
    const result = await generateObject({
      model: createAIProvider(),
      schema: questionSchema,
      system: SYSTEM_PROMPT,
      prompt: `知识点：${node.title}\n描述：${node.summary}\n难度：${node.difficulty}\n面试频率：${node.frequency}`,
    });
    return {
      id: nanoid(),
      nodeId: node.id,
      question: result.object.question,
      answer: result.object.answer,
      keyPoints: result.object.keyPoints,
      followUps: result.object.followUps,
      codeSnippet: result.object.codeSnippet,
      favorited: false,
    };
  } catch {
    return {
      id: nanoid(),
      nodeId: node.id,
      question: "生成失败，点击重试",
      answer: "",
      keyPoints: [],
      followUps: [],
      favorited: false,
    };
  }
}

export async function generateQuestions(nodes: KnowledgeNode[]): Promise<Question[]> {
  const batches = chunk(nodes, 5);
  const results: Question[] = [];
  for (const batch of batches) {
    const batchResults = await Promise.all(batch.map(generateOne));
    results.push(...batchResults);
  }
  return results;
}

export async function regenerateQuestion(node: KnowledgeNode): Promise<Question> {
  return generateOne(node);
}

export { chunk };
