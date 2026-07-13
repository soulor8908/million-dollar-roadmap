// app/api/learn/route.ts
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { decomposeKnowledge } from "@/lib/ai/knowledge";
import { generateQuestions } from "@/lib/ai/question";
import { initCloudflareEnv } from "@/lib/ai/cloudflare-env";
import { topoSort, allocateDaily } from "@/lib/schedule";
import { nowISO } from "@/lib/time";
import type { LearningPlan } from "@/lib/types";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  await initCloudflareEnv();
  try {
    const body = await req.json();
    const { topic, dailyMinutes = 30, maxNewPerDay = 1 } = body as {
      topic?: string;
      dailyMinutes?: number;
      maxNewPerDay?: number;
    };

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return NextResponse.json({ error: "topic 是必填项" }, { status: 400 });
    }

    if (dailyMinutes < 15 || dailyMinutes > 120) {
      return NextResponse.json(
        { error: "dailyMinutes 须在 15-120 之间" },
        { status: 400 }
      );
    }

    if (maxNewPerDay < 1 || maxNewPerDay > 5) {
      return NextResponse.json(
        { error: "maxNewPerDay 须在 1-5 之间" },
        { status: 400 }
      );
    }

    // 1. 拆知识树
    const nodes = await decomposeKnowledge(topic.trim());

    // 2. 生成面试题（并行分批）
    const questions = await generateQuestions(nodes);

    // 3. 编排学习计划
    const sorted = topoSort(nodes);
    const schedule = allocateDaily(sorted, dailyMinutes, maxNewPerDay);

    // 4. 构建 LearningPlan
    const now = nowISO();
    const plan: LearningPlan = {
      id: nanoid(),
      topic: topic.trim(),
      knowledgeTree: nodes,
      questions,
      schedule,
      dailyMinutes,
      maxNewPerDay,
      fsrsMode: "standard",
      createdAt: now,
      updatedAt: now,
    };

    // 返回给前端，由前端存 IndexedDB（API route 无法访问客户端 IndexedDB）
    return NextResponse.json({ planId: plan.id, plan });
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
