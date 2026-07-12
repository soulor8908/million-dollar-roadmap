// lib/ai.ts
// 调用 LLM API 进行情绪模式和能量分析
// 支持 GLM / DeepSeek / 小米 MiMo（均兼容 OpenAI 格式），通过环境变量切换
import type { AIAnalysis } from "./types";

// 各 provider 默认配置（均兼容 OpenAI chat/completions 格式）
const PROVIDERS: Record<string, { url: string; model: string; keyEnv: string }> = {
  glm: {
    url: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
    model: "glm-4-flash",
    keyEnv: "GLM_API_KEY",
  },
  deepseek: {
    url: "https://api.deepseek.com/v1/chat/completions",
    model: "deepseek-chat",
    keyEnv: "DEEPSEEK_API_KEY",
  },
  mimo: {
    url: "https://api.xiaomimimo.com/v1/chat/completions",
    model: "mimo-v2-pro",
    keyEnv: "MIMO_API_KEY",
  },
};

function getConfig() {
  const provider = (process.env.AI_PROVIDER || "glm").toLowerCase();
  const preset = PROVIDERS[provider];

  // 支持完全自定义：AI_API_URL / AI_MODEL / AI_API_KEY 优先
  const url = process.env.AI_API_URL || preset?.url;
  const model = process.env.AI_MODEL || preset?.model;
  const keyEnv = preset?.keyEnv;
  const apiKey = process.env.AI_API_KEY || (keyEnv ? process.env[keyEnv] : undefined);

  if (!url || !model) {
    throw new Error(`未知的 AI_PROVIDER: ${provider}，请在环境变量中配置 AI_API_URL 和 AI_MODEL`);
  }
  if (!apiKey) {
    throw new Error(`AI API Key 未配置：请设置 AI_API_KEY 或 ${keyEnv || "对应 provider 的 key 环境变量"}`);
  }
  return { url, model, apiKey };
}

export async function analyzeWithAI(
  emotionData: string,
  dailyData: string
): Promise<AIAnalysis> {
  const { url, model, apiKey } = getConfig();

  const prompt = `你是一个个人成长教练，分析以下两周内的情绪笔记和每日日志数据，识别模式并给出具体调整建议。

## 情绪笔记（最近14天）
${emotionData}

## 每日日志摘要（最近14天）
${dailyData}

请输出 JSON 格式（不要其他文字）：
{
  "summary": "总体总结（1-2句）",
  "patterns": ["识别到的模式1", "模式2", "模式3"],
  "suggestions": ["具体建议1", "建议2", "建议3"]
}

关注：
1. 情绪与时段的关系（如周二下午普遍低能量）
2. 多巴胺干扰的触发模式
3. 能量曲线与学习效率的关联
4. 睡眠/晨练与次日状态的关系
建议要具体可执行，不要泛泛而谈。`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`AI API ${res.status}: ${await res.text()}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "{}";

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return {
        summary: "AI 返回格式异常，无法解析",
        patterns: [],
        suggestions: [],
      };
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return {
      summary: parsed.summary || "",
      patterns: Array.isArray(parsed.patterns) ? parsed.patterns : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
    };
  } finally {
    clearTimeout(timeout);
  }
}
