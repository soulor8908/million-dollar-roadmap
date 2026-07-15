// scripts/ai-review.ts
// 周度 AI 复盘生成器：读取最近 7 天日志 + 算法进度 → 调 AI → 保存报告
// 运行：npx tsx scripts/ai-review.ts
// 技术栈：TypeScript + 原生 fetch，AI provider 配置与主项目 lib/ai.ts 统一

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// scripts 位于 archive/scripts/，ROOT 需上溯两级到仓库根
const ROOT = path.join(__dirname, "..", "..");

// AI provider 配置（与 devpath lib/ai/provider.ts 统一）
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

function getConfig(): { url: string; model: string; apiKey: string } {
  const provider = (process.env.AI_PROVIDER || "glm").toLowerCase();
  const preset = PROVIDERS[provider];
  const url = process.env.AI_API_URL || preset?.url;
  const model = process.env.AI_MODEL || preset?.model;
  const keyEnv = preset?.keyEnv;
  const apiKey = process.env.AI_API_KEY || (keyEnv ? process.env[keyEnv] : undefined);

  if (!url || !model) {
    throw new Error(`未知的 AI_PROVIDER: ${provider}，请配置 AI_API_URL 和 AI_MODEL`);
  }
  if (!apiKey) {
    throw new Error(`AI API Key 未配置：请设置 AI_API_KEY 或 ${keyEnv || "对应 provider 的 key"}`);
  }
  return { url, model, apiKey };
}

const CONFIG = {
  weekRange: 7,
  timeoutMs: 30000,
  maxRetries: 2,
};

interface DailyLogEntry {
  date: string;
  content: string;
}

function getRecentLogs(): DailyLogEntry[] {
  const dailyDir = path.join(ROOT, "archive", "daily");
  if (!fs.existsSync(dailyDir)) return [];

  const files = fs
    .readdirSync(dailyDir)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
    .sort()
    .slice(-CONFIG.weekRange);

  return files.map((file) => {
    const content = fs.readFileSync(path.join(dailyDir, file), "utf-8");
    return { date: file.replace(".md", ""), content };
  });
}

function getProgress(): string {
  const progressFile = path.join(ROOT, "archive", "algorithm", "progress.md");
  if (fs.existsSync(progressFile)) {
    return fs.readFileSync(progressFile, "utf-8");
  }
  return "暂无进度数据";
}

function generatePrompt(logs: DailyLogEntry[], progress: string): string {
  const logsText = logs.map((l) => `## ${l.date}\n${l.content}`).join("\n\n");

  return `你是一位资深的技术职业规划师和效率专家。请基于以下数据，为用户生成本周的深度复盘报告。

## 用户背景
- 前端开发工程师，当前年薪392k，目标1000k
- 有娃，工作日21:00下班，22:00到家陪娃到23:00，周末需陪娃
- 每日可用学习时间：早起1h+通勤1.3h+午休1h+公司2h，周末约8h
- 每周原始容量28.5h，计划目标≈20h（70%利用率）
- 当前阶段：算法筑基 + 项目1（AI Code Review）主线开发

## 本周日志数据
${logsText}

## 当前算法进度
${progress}

## 请输出以下格式的复盘报告（用中文）：

### 📊 本周数据概览
- 计划完成率、时间利用率、各维度投入占比
- 陪娃时间是否被侵占？（这是红线）

### ✅ 做得好的（具体事实+积极强化）
- 列出3个具体亮点，用数据支撑

### ❌ 问题诊断（第一性原理分析）
- 为什么没完成？是计划不合理？还是执行力问题？
- 是否侵占了陪娃时间？（如果是，必须调整）
- 每个问题给出根因分析

### 🔧 下周优化建议
- 具体可执行的调整
- 如果本周完成率低，建议降低目标还是增加监督？
- 如何在不减少陪娃时间的前提下提高学习效率？

### 🎯 下周计划（AI建议版）
- 基于本周表现，调整下周目标
- 给出具体的时间分配建议

### 💡 额外建议
- 学习方法、技术方向、面试策略等

要求：
1. 直接、犀利、不客套。像教练一样说话。
2. 特别关注"陪娃时间是否被侵占"，这是最高优先级红线。
3. 如果学习时间不足，建议砍掉哪些低优先级任务，而不是侵占家庭时间。
4. 给出具体的、可量化的下周目标。`;
}

async function callAI(prompt: string): Promise<string> {
  const { url, model, apiKey } = getConfig();

  let lastErr: unknown;
  for (let attempt = 0; attempt <= CONFIG.maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), CONFIG.timeoutMs);

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

      clearTimeout(timeout);

      if (!res.ok) {
        const status = res.status;
        // 4xx（除 429）不重试
        if (status >= 400 && status < 500 && status !== 429) {
          throw new Error(`AI API ${status}: ${await res.text()}`);
        }
        throw new Error(`AI API ${status}: ${await res.text()}`);
      }

      const data = await res.json();
      return data.choices[0].message.content as string;
    } catch (err) {
      lastErr = err;
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status && status >= 400 && status < 500 && status !== 429) break;
      if (attempt < CONFIG.maxRetries) {
        const backoff = 1000 * Math.pow(2, attempt);
        console.warn(`第 ${attempt + 1} 次调用失败（${status || (err as Error).code || "err"}），${backoff}ms 后重试...`);
        await new Promise((r) => setTimeout(r, backoff));
      }
    }
  }
  throw lastErr;
}

function saveReview(content: string): string {
  const reviewsDir = path.join(ROOT, "reviews", "weekly");
  fs.mkdirSync(reviewsDir, { recursive: true });

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const filename = path.join(reviewsDir, `${weekStart.toISOString().split("T")[0]}.md`);

  fs.writeFileSync(filename, content);
  console.log(`Review saved to ${path.relative(ROOT, filename)}`);
  return filename;
}

async function main(): Promise<void> {
  try {
    const logs = getRecentLogs();
    const progress = getProgress();
    const prompt = generatePrompt(logs, progress);
    const review = await callAI(prompt);
    saveReview(review);
    console.log("Weekly AI review generated successfully!");
  } catch (error) {
    console.error("Error:", (error as Error).message);
    process.exit(1);
  }
}

main();
