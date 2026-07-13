// lib/ai/provider.ts
// Vercel AI SDK Provider 配置
// 支持 GLM / DeepSeek / MiMo / 自定义（均兼容 OpenAI 格式）
// 默认 GLM 国内端点（零梯子可达）

import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

export type AIProvider = "glm" | "deepseek" | "mimo" | "custom";

export const AI_PROVIDER: AIProvider = ((process.env.AI_PROVIDER as AIProvider) || "glm");

interface ProviderConfig {
  baseURL: string;
  model: string;
  apiKey: string;
}

const PRESETS: Record<string, Omit<ProviderConfig, "apiKey">> = {
  glm: {
    baseURL: "https://open.bigmodel.cn/api/paas/v4",
    model: "glm-4-flash",
  },
  deepseek: {
    baseURL: "https://api.deepseek.com/v1",
    model: "deepseek-chat",
  },
  mimo: {
    baseURL: "https://api.xiaomimimo.com/v1",
    model: "mimo-v2-pro",
  },
};

function resolveConfig(): ProviderConfig {
  const provider = (process.env.AI_PROVIDER || "glm").toLowerCase();
  const preset = PRESETS[provider];

  // 通用配置优先级最高
  const baseURL = process.env.AI_API_URL || preset?.baseURL;
  const model = process.env.AI_MODEL || preset?.model;

  // API Key：通用 > provider 专用
  const apiKey =
    process.env.AI_API_KEY ||
    (provider === "glm" && process.env.GLM_API_KEY) ||
    (provider === "deepseek" && process.env.DEEPSEEK_API_KEY) ||
    (provider === "mimo" && process.env.MIMO_API_KEY) ||
    "";

  if (!baseURL || !model) {
    throw new Error(
      `未知的 AI_PROVIDER: ${provider}，请配置 AI_API_URL 和 AI_MODEL`
    );
  }

  return { baseURL, model, apiKey };
}

let cachedModel: LanguageModel | null = null;

/** 获取 AI 模型（带缓存） */
export function getModel(): LanguageModel {
  if (cachedModel) return cachedModel;
  const { baseURL, model, apiKey } = resolveConfig();
  if (!apiKey) {
    throw new Error(
      "AI API Key 未配置：请设置 AI_API_KEY 或对应 provider 的 key 环境变量"
    );
  }
  const openai = createOpenAI({ baseURL, apiKey });
  cachedModel = openai(model);
  return cachedModel;
}

/** 检查是否配置了 AI Key */
export function hasAIKey(): boolean {
  const provider = (process.env.AI_PROVIDER || "glm").toLowerCase();
  return Boolean(
    process.env.AI_API_KEY ||
      (provider === "glm" && process.env.GLM_API_KEY) ||
      (provider === "deepseek" && process.env.DEEPSEEK_API_KEY) ||
      (provider === "mimo" && process.env.MIMO_API_KEY)
  );
}

/** 向后兼容：原 MVP 接口 */
export function createAIProvider(): LanguageModel {
  return getModel();
}

/** 用于测试：重置缓存 */
export function _resetModelCache(): void {
  cachedModel = null;
}

export function getProviderInfo(): { provider: string; model: string; baseURL: string } {
  const provider = (process.env.AI_PROVIDER || "glm").toLowerCase();
  const preset = PRESETS[provider];
  return {
    provider,
    model: process.env.AI_MODEL || preset?.model || "unknown",
    baseURL: process.env.AI_API_URL || preset?.baseURL || "unknown",
  };
}
