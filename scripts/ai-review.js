const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 所有路径基于 __dirname，不依赖 cwd（修复原版相对路径 bug）
const ROOT = path.join(__dirname, '..');

const CONFIG = {
  apiKey: process.env.AI_API_KEY,
  apiUrl: process.env.AI_API_URL || 'https://api.moonshot.cn/v1/chat/completions',
  model: process.env.AI_MODEL || 'kimi-latest',
  weekRange: 7,
  timeoutMs: 30000,      // 单次请求 30s 超时，避免 CI 挂死
  maxRetries: 2,         // 失败重试次数（指数退避）
};

function getRecentLogs() {
  const dailyDir = path.join(ROOT, 'daily');
  if (!fs.existsSync(dailyDir)) return [];

  const files = fs.readdirSync(dailyDir)
    .filter(f => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
    .sort()
    .slice(-CONFIG.weekRange);

  return files.map(file => {
    const content = fs.readFileSync(path.join(dailyDir, file), 'utf-8');
    return { date: file.replace('.md', ''), content };
  });
}

function getProgress() {
  const progressFile = path.join(ROOT, 'algorithm', 'progress.md');
  if (fs.existsSync(progressFile)) {
    return fs.readFileSync(progressFile, 'utf-8');
  }
  return '暂无进度数据';
}

function generatePrompt(logs, progress) {
  const logsText = logs.map(l => `## ${l.date}\n${l.content}`).join('\n\n');

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

async function callAI(prompt) {
  if (!CONFIG.apiKey) {
    throw new Error('AI_API_KEY 未设置：请在 GitHub Secrets 或本地 .env 配置 AI_API_KEY');
  }

  let lastErr;
  for (let attempt = 0; attempt <= CONFIG.maxRetries; attempt++) {
    try {
      const response = await axios.post(CONFIG.apiUrl, {
        model: CONFIG.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }, {
        headers: { 'Authorization': `Bearer ${CONFIG.apiKey}` },
        timeout: CONFIG.timeoutMs,
      });
      return response.data.choices[0].message.content;
    } catch (err) {
      lastErr = err;
      // 4xx 错误（除 429 外）不重试，请求本身有问题
      const status = err.response && err.response.status;
      if (status && status >= 400 && status < 500 && status !== 429) break;
      if (attempt < CONFIG.maxRetries) {
        const backoff = 1000 * Math.pow(2, attempt); // 1s, 2s
        console.warn(`第 ${attempt + 1} 次调用失败（${status || err.code}），${backoff}ms 后重试...`);
        await new Promise(r => setTimeout(r, backoff));
      }
    }
  }
  throw lastErr;
}

function saveReview(content) {
  // 用绝对路径写入，修复原版依赖 cwd 的 bug
  const reviewsDir = path.join(ROOT, 'reviews', 'weekly');
  fs.mkdirSync(reviewsDir, { recursive: true });

  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - 7);
  const filename = path.join(reviewsDir, `${weekStart.toISOString().split('T')[0]}.md`);

  fs.writeFileSync(filename, content);
  console.log(`Review saved to ${path.relative(ROOT, filename)}`);
  return filename;
}

async function main() {
  try {
    const logs = getRecentLogs();
    const progress = getProgress();
    const prompt = generatePrompt(logs, progress);
    const review = await callAI(prompt);
    saveReview(review);
    console.log('Weekly AI review generated successfully!');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
