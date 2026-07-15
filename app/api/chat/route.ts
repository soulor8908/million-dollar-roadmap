// app/api/chat/route.ts
// 流式聊天接口：接收 { messages, modelConfig, contextSnapshot } → 调用 streamText → 返回流式响应
// AI Native 升级：支持客户端注入"用户上下文快照"，让 LLM 知道用户当前在学什么、错了哪些题、今日能量
// 上下文快照由客户端 lib/ai/chat-context.ts 在浏览器从 IndexedDB 聚合后传入

import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { initCloudflareEnv } from "@/lib/ai/cloudflare-env";
import { requireAuth } from "@/lib/auth";
import { resolveModel, type ClientModelConfig } from "@/lib/ai/resolve-model";
import { getPrompt } from "@/lib/ai/prompts";

export const runtime = "edge";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

// 从 Prompt Registry 读取基础 system（运行时拼接 contextSnapshot）
const PROMPT_DEF = getPrompt("chat");

export async function POST(req: NextRequest) {
  await initCloudflareEnv();
  try {
    const body = await req.json();
    const { messages, modelConfig, contextSnapshot } = body as {
      messages?: ChatMessage[];
      modelConfig?: ClientModelConfig;
      contextSnapshot?: string;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages 必须是非空数组" },
        { status: 400 },
      );
    }

    const { model, useServerModel } = resolveModel(modelConfig, "chat");
    const authError = requireAuth(req, { useServerModel });
    if (authError) return authError;

    const safeContext =
      typeof contextSnapshot === "string" && contextSnapshot.length > 0
        ? contextSnapshot.slice(0, 4000)
        : "";

    const systemPrompt = safeContext
      ? `${PROMPT_DEF.system}\n\n${safeContext}`
      : PROMPT_DEF.system;

    const result = await streamText({
      model,
      messages,
      system: systemPrompt,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
