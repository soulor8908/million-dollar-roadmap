// app/api/chat/route.ts
// 流式聊天接口：接收 { messages, modelConfig } → 调用 streamText → 返回流式响应

import { NextRequest, NextResponse } from "next/server";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { initCloudflareEnv } from "@/lib/ai/cloudflare-env";
import { requireAuth } from "@/lib/auth";
import { getModel } from "@/lib/ai/provider";
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

const SYSTEM_PROMPT =
  "你是 DevPath 学习助手，擅长解答编程和技术面试题。回答要简洁、结合实际案例、必要时给出代码示例。使用 Markdown 格式。";

export async function POST(req: NextRequest) {
  await initCloudflareEnv();
  const authError = requireAuth(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const { messages, modelConfig } = body as {
      messages?: ChatMessage[];
      modelConfig?: ClientModelConfig;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "messages 必须是非空数组" },
        { status: 400 }
      );
    }

    let model: LanguageModel;
    if (modelConfig && modelConfig.apiKey) {
      const openai = createOpenAI({
        baseURL: modelConfig.baseURL,
        apiKey: modelConfig.apiKey,
      });
      model = openai(modelConfig.model);
    } else {
      model = getModel();
    }

    const result = streamText({
      model,
      messages,
      system: SYSTEM_PROMPT,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
