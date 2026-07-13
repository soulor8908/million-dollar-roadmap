// app/api/regenerate/route.ts
// 重新生成单道面试题：接收 { node } → 调 AI → 返回新 Question

import { NextRequest, NextResponse } from "next/server";
import { regenerateQuestion } from "@/lib/ai/question";
import { initCloudflareEnv } from "@/lib/ai/cloudflare-env";
import type { KnowledgeNode } from "@/lib/types";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  await initCloudflareEnv();
  try {
    const body = await req.json();
    const { node } = body as { node?: KnowledgeNode };

    if (!node || !node.id || !node.title) {
      return NextResponse.json({ error: "node 是必填项" }, { status: 400 });
    }

    const question = await regenerateQuestion(node);
    return NextResponse.json({ question });
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
