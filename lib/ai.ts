// lib/ai.ts
// 调用 GLM API 进行情绪模式和能量分析
import type { AIAnalysis } from "./types";

const GLM_API_URL = "https://open.bigmodel.cn/api/paas/v4/chat/completions";

export async function analyzeWithAI(
  emotionData: string,
  dailyData: string
): Promise<AIAnalysis> {
  const apiKey = process.env.GLM_API_KEY;
  if (!apiKey) {
    throw new Error("GLM_API_KEY 未配置");
  }

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
    const res = await fetch(GLM_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "glm-4-flash",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`GLM API ${res.status}: ${await res.text()}`);
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
