// app/api/chat/route.ts
// 流式聊天接口：接收 { messages, modelConfig, contextSnapshot } → 调用 streamText → 返回流式响应
// AI Native 升级：支持客户端注入"用户上下文快照"，让 LLM 知道用户当前在学什么、错了哪些题、今日能量
// 上下文快照由客户端 lib/ai/chat-context.ts 在浏览器从 IndexedDB 聚合后传入

import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { initCloudflareEnv } from "@/lib/ai/cloudflare-env";
import { requireAuth } from "@/lib/auth";
import { getModel } from "@/lib/ai/provider";
import { wrapModelWithObservability } from "@/lib/ai/observability";
import type { LanguageModel } from "ai";

export const runtime = "edge";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ClientModelConfig {
  baseURL: string;
  apiKey: string;
  model: string;
  name: string;
}

const BASE_SYSTEM_PROMPT =
  "你是 DevPath 学习助手，擅长解答编程和技术面试题。回答要简洁、结合实际案例、必要时给出代码示例。使用 Markdown 格式。";

export async function POST(req: NextRequest) {
  await initCloudflareEnv();
  try {
    const body = await req.json();
    const { messages, modelConfig, contextSnapshot } = body as {
      messages?: ChatMessage[];
      modelConfig?: ClientModelConfig;
      // 客户端构建的上下文片段（已经过 chat-context.ts 聚合，体积 < 1.5KB）
      contextSnapshot?: string;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages 必须是非空数组" },
        { status: 400 }
      );
    }

    // 判断是否使用用户自带的 modelConfig（含 apiKey）
    // 用户自带 key → 不需要服务端 API_TOKEN（用户用自己的额度）
    // 使用默认模型 → 需要 API_TOKEN 校验
    const useServerModel = !(modelConfig && modelConfig.apiKey);
    const authError = requireAuth(req, { useServerModel });
    if (authError) return authError;

    // 安全限制上下文长度，防止滥用
    const safeContext =
      typeof contextSnapshot === "string" && contextSnapshot.length > 0
        ? contextSnapshot.slice(0, 4000)
        : "";

    const systemPrompt = safeContext
      ? `${BASE_SYSTEM_PROMPT}\n\n${safeContext}`
      : BASE_SYSTEM_PROMPT;

    let model: LanguageModel;
    if (modelConfig && modelConfig.apiKey) {
      const openai = createOpenAI({
        baseURL: modelConfig.baseURL,
        apiKey: modelConfig.apiKey,
      });
      model = wrapModelWithObservability(openai(modelConfig.model), "chat:custom");
    } else {
      model = wrapModelWithObservability(getModel(), "chat:default");
    }

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
