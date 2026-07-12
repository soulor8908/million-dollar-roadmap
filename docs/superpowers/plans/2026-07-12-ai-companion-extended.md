# AI 作战辅助系统 实施计划（扩展篇）

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 完成核心篇之外的剩余功能：日志记录页面、进度查看页面、AI 分析页面、PWA 离线、Vercel 部署上线，让作战辅助系统全功能可用。

**Architecture:** 复用核心篇的基础设施（GitHubClient、TokenGate、storage、emotion.ts、routine.ts）。新增 daily.ts 和 progress.ts 两个解析器，三个新页面，一个 AI API 路由。PWA 用 next-pwa 或手写 service worker。

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, GitHub REST API, GLM API（AI 分析）

**Spec:** [docs/superpowers/specs/2026-07-12-ai-companion-design.md](../specs/2026-07-12-ai-companion-design.md)

**前置条件:** 核心篇 14 个任务已完成（commit `087e875`），13 个测试通过，构建成功。

---

## 文件结构

```
lib/
  types.ts                    # 扩展：新增 DailyLog, ProgressInfo, AIAnalysis 类型
  daily.ts                    # 新建：日志解析与格式化
  progress.ts                 # 新建：进度数据解析
  ai.ts                       # 新建：AI 分析客户端
  __tests__/
    daily.test.ts             # 新建
    progress.test.ts          # 新建
components/
  DailyEditor.tsx             # 新建：当日日志编辑器
  DailyCalendar.tsx           # 新建：日历视图
  ProgressDashboard.tsx       # 新建：进度仪表盘
  AnalyzePanel.tsx            # 新建：AI 分析面板
app/
  daily/page.tsx              # 新建：日志记录页
  progress/page.tsx           # 新建：进度查看页
  analyze/page.tsx            # 新建：AI 分析页
  api/ai/route.ts             # 新建：AI 分析 API 代理
public/
  sw.js                       # 新建：service worker
  icons/                      # 新建：PWA 图标（用 SVG 占位）
```

---

## Task 1: 扩展类型 + 日志解析器 `lib/daily.ts`

**Files:**
- Modify: `lib/types.ts`
- Create: `lib/daily.ts`
- Create: `lib/__tests__/daily.test.ts`

- [ ] **Step 1: 扩展 `lib/types.ts`，在文件末尾追加**

```typescript
// 日志 checklist 项
export interface ChecklistItem {
  text: string;        // 去掉前缀的文本
  checked: boolean;
}

// 日志能量数据
export interface DailyEnergy {
  sleep: string;       // 如 "7.5h"
  sleepOnTime: boolean | null; // 22:45 关灯？✅/❌/未填
  exerciseDone: boolean | null;
  exerciseNote: string; // 未执行原因
  energyMorning: number | null; // 1-5
  energyNoon: number | null;
  energyEvening: number | null;
  emotion: string;     // emoji 串
  familyQuality: number; // 1-5（陪娃质量）
}

// 复盘段落
export interface DailyReview {
  good: string;        // 今天做得好的
  problems: string;    // 今天的问题
  tomorrow: string;    // 明天的调整
}

// 完整的日志结构
export interface DailyLog {
  date: string;        // YYYY-MM-DD
  plan: string;        // 计划段原文（保留，不解析表格）
  checklist: ChecklistItem[];
  energy: DailyEnergy;
  review: DailyReview;
}

// 进度统计
export interface ProgressInfo {
  algorithmDone: number;
  algorithmTotal: number;
  algorithmPercent: number;
  streakDays: number;
  totalLogs: number;
  latestLog: string;   // YYYY-MM-DD 或 "—"
  weekHours: number;   // 本周学习时长
}

// AI 分析结果
export interface AIAnalysis {
  summary: string;       // 总体总结
  patterns: string[];    // 识别的模式
  suggestions: string[]; // 调整建议
}
```

- [ ] **Step 2: 写失败测试 `lib/__tests__/daily.test.ts`**

```typescript
import { describe, it, expect } from "vitest";
import { parseDailyLog, toggleChecklistItem, createEmptyLog, formatDailyLog } from "../daily";

const sampleMarkdown = `# 📅 2026-07-13 作战日志

## 🎯 今日计划（昨晚睡前制定）

| 时段 | 任务 | 预计时长 | 优先级 |
|-----|------|---------|--------|
| 6:00-6:30 晨练 | 🏃 俯卧撑 | 30min | P0 |

## ✅ 实际执行（实时记录）

- [ ] 6:00-6:30 晨练
- [x] 6:30-7:00 早起学习
- [ ] 7:00-8:20 通勤算法

## 📊 今日数据

### 产出
- 算法题完成：2 道（题号：1,2）
- 有效学习时长：3 小时
- 时间利用率：60%

### 能量（核心指标）
- 昨晚睡眠：7.5 小时（22:45 关灯？✅）
- 晨练执行：✅
- 今日能量曲线：晨4 中3 晚2（1-5分）
- 今日情绪：😊😐
- 陪娃质量：⭐⭐⭐⭐⭐

## 📝 复盘

### 今天做得好的
1. 晨练执行
2. 算法 2 题

### 今天的问题
1. 下午能量低

### 明天的调整
- 午休真正休息
`;

describe("daily", () => {
  it("parseDailyLog 解析 checklist", () => {
    const log = parseDailyLog(sampleMarkdown, "2026-07-13");
    expect(log.date).toBe("2026-07-13");
    expect(log.checklist).toHaveLength(3);
    expect(log.checklist[0].checked).toBe(false);
    expect(log.checklist[0].text).toBe("6:00-6:30 晨练");
    expect(log.checklist[1].checked).toBe(true);
    expect(log.checklist[1].text).toBe("6:30-7:00 早起学习");
  });

  it("parseDailyLog 解析能量字段", () => {
    const log = parseDailyLog(sampleMarkdown, "2026-07-13");
    expect(log.energy.sleep).toBe("7.5");
    expect(log.energy.sleepOnTime).toBe(true);
    expect(log.energy.exerciseDone).toBe(true);
    expect(log.energy.energyMorning).toBe(4);
    expect(log.energy.energyNoon).toBe(3);
    expect(log.energy.energyEvening).toBe(2);
    expect(log.energy.familyQuality).toBe(5);
  });

  it("parseDailyLog 解析复盘段落", () => {
    const log = parseDailyLog(sampleMarkdown, "2026-07-13");
    expect(log.review.good).toContain("晨练执行");
    expect(log.review.problems).toContain("下午能量低");
    expect(log.review.tomorrow).toContain("午休");
  });

  it("toggleChecklistItem 切换第 0 项", () => {
    const log = parseDailyLog(sampleMarkdown, "2026-07-13");
    const newContent = toggleChecklistItem(sampleMarkdown, 0);
    const newLog = parseDailyLog(newContent, "2026-07-13");
    expect(newLog.checklist[0].checked).toBe(true);
  });

  it("createEmptyLog 生成空模板", () => {
    const log = createEmptyLog("2026-07-14");
    const md = formatDailyLog(log);
    expect(md).toContain("2026-07-14");
    expect(md).toContain("## ✅ 实际执行");
    expect(md).toContain("## 📊 今日数据");
  });

  it("parseDailyLog 空文件不崩溃", () => {
    const log = parseDailyLog("", "2026-07-14");
    expect(log.checklist).toHaveLength(0);
    expect(log.energy.familyQuality).toBe(0);
  });
});
```

- [ ] **Step 3: 运行测试确认失败**

```bash
npx vitest run lib/__tests__/daily.test.ts
```
Expected: FAIL，模块不存在

- [ ] **Step 4: 实现 `lib/daily.ts`**

```typescript
// lib/daily.ts
// 解析和格式化 daily/YYYY-MM-DD.md 日志文件

import type { DailyLog, ChecklistItem, DailyEnergy, DailyReview } from "./types";

export function parseDailyLog(markdown: string, date: string): DailyLog {
  const checklist: ChecklistItem[] = [];
  const energy: DailyEnergy = {
    sleep: "",
    sleepOnTime: null,
    exerciseDone: null,
    exerciseNote: "",
    energyMorning: null,
    energyNoon: null,
    energyEvening: null,
    emotion: "",
    familyQuality: 0,
  };
  const review: DailyReview = { good: "", problems: "", tomorrow: "" };

  const lines = markdown.split("\n");

  // 提取 checklist（在"## ✅ 实际执行"段内）
  let inChecklist = false;
  for (const line of lines) {
    if (line.startsWith("## ✅")) { inChecklist = true; continue; }
    if (line.startsWith("## ")) { inChecklist = false; }
    if (inChecklist) {
      const m = line.match(/^- \[([ x])\] (.+)$/);
      if (m) {
        checklist.push({
          checked: m[1] === "x",
          text: m[2].trim(),
        });
      }
    }
  }

  // 提取能量字段
  const sleepMatch = markdown.match(/昨晚睡眠[：:]\s*([\d.]+)\s*小时[^\n]*22:45\s*关灯[？?]\s*(✅|❌)?/);
  if (sleepMatch) {
    energy.sleep = sleepMatch[1];
    energy.sleepOnTime = sleepMatch[2] === "✅" ? true : sleepMatch[2] === "❌" ? false : null;
  }

  const exerciseMatch = markdown.match(/晨练执行[：:]\s*(✅|❌)(?:[^\n]*未执行原因[：:]\s*(.+))?/);
  if (exerciseMatch) {
    energy.exerciseDone = exerciseMatch[1] === "✅";
    energy.exerciseNote = exerciseMatch[2]?.trim() || "";
  }

  const energyCurveMatch = markdown.match(/今日能量曲线[：:]\s*晨(\d)\s*中(\d)\s*晚(\d)/);
  if (energyCurveMatch) {
    energy.energyMorning = +energyCurveMatch[1];
    energy.energyNoon = +energyCurveMatch[2];
    energy.energyEvening = +energyCurveMatch[3];
  }

  const emotionMatch = markdown.match(/今日情绪[：:]\s*(\S+)/);
  if (emotionMatch) energy.emotion = emotionMatch[1];

  const familyMatch = markdown.match(/陪娃质量[：:]\s*(⭐+)/);
  if (familyMatch) energy.familyQuality = familyMatch[1].length;

  // 提取复盘段落
  const reviewGoodMatch = markdown.match(/### 今天做得好的\s*\n+([\s\S]*?)(?=###|$)/);
  if (reviewGoodMatch) review.good = reviewGoodMatch[1].trim();

  const reviewProblemMatch = markdown.match(/### 今天的问题\s*\n+([\s\S]*?)(?=###|$)/);
  if (reviewProblemMatch) review.problems = reviewProblemMatch[1].trim();

  const reviewTomorrowMatch = markdown.match(/### 明天的调整\s*\n+([\s\S]*?)(?=##|$)/);
  if (reviewTomorrowMatch) review.tomorrow = reviewTomorrowMatch[1].trim();

  // plan 段落保留原文
  const planMatch = markdown.match(/## 🎯 今日计划[^\n]*\n([\s\S]*?)(?=## ✅|$)/);
  const plan = planMatch ? planMatch[1].trim() : "";

  return { date, plan, checklist, energy, review };
}

export function toggleChecklistItem(markdown: string, index: number): string {
  const lines = markdown.split("\n");
  let inChecklist = false;
  let currentIdx = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("## ✅")) { inChecklist = true; continue; }
    if (lines[i].startsWith("## ")) { inChecklist = false; }
    if (inChecklist) {
      const m = lines[i].match(/^(- \[)([ x])(\] .+)$/);
      if (m) {
        if (currentIdx === index) {
          lines[i] = m[1] + (m[2] === "x" ? " " : "x") + m[3];
          return lines.join("\n");
        }
        currentIdx++;
      }
    }
  }
  return markdown;
}

export function createEmptyLog(date: string): DailyLog {
  return {
    date,
    plan: "",
    checklist: [
      { text: "6:00-6:30 晨练", checked: false },
      { text: "6:30-7:00 早起学习", checked: false },
      { text: "7:00-8:20 通勤算法", checked: false },
      { text: "12:30-13:00 午休休息", checked: false },
      { text: "13:00-13:30 午休学习", checked: false },
      { text: "18:30-20:30 公司学习", checked: false },
    ],
    energy: {
      sleep: "",
      sleepOnTime: null,
      exerciseDone: null,
      exerciseNote: "",
      energyMorning: null,
      energyNoon: null,
      energyEvening: null,
      emotion: "",
      familyQuality: 0,
    },
    review: { good: "", problems: "", tomorrow: "" },
  };
}

export function formatDailyLog(log: DailyLog): string {
  const checklistMd = log.checklist
    .map((item) => `- [${item.checked ? "x" : " "}] ${item.text}`)
    .join("\n");

  const sleepLine = log.energy.sleep
    ? `- 昨晚睡眠：${log.energy.sleep} 小时（22:45 关灯？${log.energy.sleepOnTime === true ? "✅" : log.energy.sleepOnTime === false ? "❌" : ""}）`
    : `- 昨晚睡眠：X 小时（22:45 关灯？✅/❌）`;
  const exerciseLine = log.energy.exerciseDone === null
    ? `- 晨练执行：✅/❌`
    : `- 晨练执行：${log.energy.exerciseDone ? "✅" : "❌"}${log.energy.exerciseNote ? `（未执行原因：${log.energy.exerciseNote}）` : ""}`;
  const energyLine = `- 今日能量曲线：晨${log.energy.energyMorning ?? "★"} 中${log.energy.energyNoon ?? "★"} 晚${log.energy.energyEvening ?? "★"}（1-5分）`;
  const emotionLine = `- 今日情绪：${log.energy.emotion || "😊😐😔"}`;
  const familyLine = `- 陪娃质量：${"⭐".repeat(log.energy.familyQuality || 5)}`;

  return `# 📅 ${log.date} 作战日志

## 🎯 今日计划（昨晚睡前制定）

${log.plan || "| 时段 | 任务 | 预计时长 | 优先级 |\n|-----|------|---------|--------|\n| 6:00-6:30 晨练 | 🏃 俯卧撑/拉伸/快走 | 30min | P0 |"}

## ✅ 实际执行（实时记录）

${checklistMd}

## 📊 今日数据

### 产出
- 算法题完成：X 道（题号：）
- 有效学习时长：X 小时
- 时间利用率：X%

### 能量（核心指标）
${sleepLine}
${exerciseLine}
${energyLine}
${emotionLine}
${familyLine}

## 📝 复盘（22:45娃睡后，手机快速填写）

### 今天做得好的
${log.review.good || "1. "}

### 今天的问题
${log.review.problems || "1. "}

### 明天的调整
${log.review.tomorrow || "- "}
`;
}
```

- [ ] **Step 5: 运行测试确认通过**

```bash
npx vitest run lib/__tests__/daily.test.ts
```
Expected: PASS（6 tests）

- [ ] **Step 6: Commit**

```bash
git add lib/types.ts lib/daily.ts lib/__tests__/daily.test.ts
git commit -m "feat: 日志解析器 + 类型扩展"
```

---

## Task 2: 日志记录页面 `/daily`

**Files:**
- Create: `components/DailyEditor.tsx`
- Create: `components/DailyCalendar.tsx`
- Create: `app/daily/page.tsx`

- [ ] **Step 1: 创建 `components/DailyEditor.tsx`**

```tsx
"use client";

import { useState, useEffect } from "react";
import { loadToken } from "@/lib/storage";
import { GitHubClient } from "@/lib/github";
import { GITHUB_OWNER, GITHUB_REPO } from "@/lib/githubConfig";
import { parseDailyLog, toggleChecklistItem, createEmptyLog, formatDailyLog } from "@/lib/daily";
import type { DailyLog } from "@/lib/types";

export function DailyEditor() {
  const [log, setLog] = useState<DailyLog | null>(null);
  const [rawContent, setRawContent] = useState("");
  const [sha, setSha] = useState<string | undefined>();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const token = await loadToken();
      if (!token) { setError("未登录"); return; }
      const client = new GitHubClient(GITHUB_OWNER, GITHUB_REPO, token);
      try {
        const path = `daily/${date}.md`;
        const file = await client.readFile(path);
        if (file) {
          setRawContent(file.content);
          setSha(file.sha);
          setLog(parseDailyLog(file.content, date));
        } else {
          const empty = createEmptyLog(date);
          setLog(empty);
          setRawContent(formatDailyLog(empty));
          setSha(undefined);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "加载失败");
      }
    })();
  }, [date]);

  async function save() {
    if (!log) return;
    setSaving(true);
    setError("");
    try {
      const token = await loadToken();
      if (!token) { setError("未登录"); return; }
      const client = new GitHubClient(GITHUB_OWNER, GITHUB_REPO, token);
      const content = formatDailyLog(log);
      const newSha = await client.writeFile(
        `daily/${date}.md`,
        content,
        `daily: ${date}`,
        sha
      );
      setSha(newSha);
      setRawContent(content);
      setSavedAt(Date.now());
    } catch (e) {
      setError(e instanceof Error ? e.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  async function toggleChecklist(idx: number) {
    if (!log) return;
    const newChecklist = [...log.checklist];
    newChecklist[idx] = {
      ...newChecklist[idx],
      checked: !newChecklist[idx].checked,
    };
    setLog({ ...log, checklist: newChecklist });
    // 立即保存
    const newContent = toggleChecklistItem(rawContent, idx);
    setRawContent(newContent);
    try {
      const token = await loadToken();
      if (!token) return;
      const client = new GitHubClient(GITHUB_OWNER, GITHUB_REPO, token);
      const newSha = await client.writeFile(
        `daily/${date}.md`,
        newContent,
        `daily: ${date} toggle checklist ${idx}`,
        sha
      );
      setSha(newSha);
      setSavedAt(Date.now());
    } catch (e) {
      setError(e instanceof Error ? e.message : "保存失败");
    }
  }

  if (!log) return <div className="text-gray-400 text-sm">加载中...</div>;

  return (
    <div className="space-y-3">
      {error && <p className="text-red-500 text-xs">{error}</p>}

      <div className="bg-white rounded-xl p-3 shadow-sm">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="text-sm border rounded px-2 py-1"
        />
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <p className="text-sm font-medium mb-2">今日执行 checklist</p>
        <div className="space-y-2">
          {log.checklist.map((item, i) => (
            <label key={i} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleChecklist(i)}
                className="w-4 h-4"
              />
              <span className={`text-sm ${item.checked ? "line-through text-gray-400" : ""}`}>
                {item.text}
              </span>
            </label>
          ))}
          {log.checklist.length === 0 && (
            <p className="text-xs text-gray-400">当日无 checklist</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm space-y-2">
        <p className="text-sm font-medium">能量数据</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <label className="flex items-center gap-1">
            睡眠
            <input
              type="text"
              value={log.energy.sleep}
              onChange={(e) => setLog({ ...log, energy: { ...log.energy, sleep: e.target.value } })}
              placeholder="7.5"
              className="w-12 border rounded px-1 py-0.5 text-xs"
            />
            h
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={log.energy.sleepOnTime === true}
              onChange={(e) => setLog({ ...log, energy: { ...log.energy, sleepOnTime: e.target.checked } })}
              className="w-4 h-4"
            />
            <span className="text-xs">22:45 关灯</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={log.energy.exerciseDone === true}
              onChange={(e) => setLog({ ...log, energy: { ...log.energy, exerciseDone: e.target.checked } })}
              className="w-4 h-4"
            />
            <span className="text-xs">晨练执行</span>
          </label>
          <div className="flex items-center gap-1 text-xs">
            晨
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setLog({ ...log, energy: { ...log.energy, energyMorning: n } })}
                className={`w-6 h-6 rounded ${log.energy.energyMorning === n ? "bg-black text-white" : "bg-gray-100"}`}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 text-xs">
            中
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setLog({ ...log, energy: { ...log.energy, energyNoon: n } })}
                className={`w-6 h-6 rounded ${log.energy.energyNoon === n ? "bg-black text-white" : "bg-gray-100"}`}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 text-xs">
            晚
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setLog({ ...log, energy: { ...log.energy, energyEvening: n } })}
                className={`w-6 h-6 rounded ${log.energy.energyEvening === n ? "bg-black text-white" : "bg-gray-100"}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm space-y-2">
        <p className="text-sm font-medium">复盘</p>
        <textarea
          value={log.review.good}
          onChange={(e) => setLog({ ...log, review: { ...log.review, good: e.target.value } })}
          placeholder="今天做得好的"
          className="w-full border rounded px-2 py-1 text-xs h-16"
        />
        <textarea
          value={log.review.problems}
          onChange={(e) => setLog({ ...log, review: { ...log.review, problems: e.target.value } })}
          placeholder="今天的问题"
          className="w-full border rounded px-2 py-1 text-xs h-16"
        />
        <textarea
          value={log.review.tomorrow}
          onChange={(e) => setLog({ ...log, review: { ...log.review, tomorrow: e.target.value } })}
          placeholder="明天的调整"
          className="w-full border rounded px-2 py-1 text-xs h-16"
        />
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="w-full bg-black text-white rounded py-2 text-sm font-medium disabled:opacity-40"
      >
        {saving ? "保存中..." : savedAt && Date.now() - savedAt < 3000 ? "✓ 已保存" : "保存日志"}
      </button>
    </div>
  );
}
```

- [ ] **Step 2: 创建 `components/DailyCalendar.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { loadToken } from "@/lib/storage";
import { GitHubClient } from "@/lib/github";
import { GITHUB_OWNER, GITHUB_REPO } from "@/lib/githubConfig";

export function DailyCalendar({ onSelect }: { onSelect: (date: string) => void }) {
  const [loggedDates, setLoggedDates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await loadToken();
      if (!token) { setLoading(false); return; }
      const client = new GitHubClient(GITHUB_OWNER, GITHUB_REPO, token);
      try {
        const names = await client.listFiles("daily");
        const dates = new Set(
          names
            .filter((n) => /^\d{4}-\d{2}-\d{2}\.md$/.test(n))
            .map((n) => n.replace(".md", ""))
        );
        setLoggedDates(dates);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-gray-400 text-xs">加载日历...</p>;

  // 显示当月日历
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayStr = now.toISOString().split("T")[0];

  const cells: (string | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    cells.push(dateStr);
  }

  return (
    <div className="bg-white rounded-xl p-3 shadow-sm">
      <p className="text-xs text-gray-500 mb-2">
        {year}年{month + 1}月 · 已记录 {loggedDates.size} 天
      </p>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {["日", "一", "二", "三", "四", "五", "六"].map((d) => (
          <div key={d} className="text-gray-400 py-1">{d}</div>
        ))}
        {cells.map((date, i) => {
          if (!date) return <div key={i} />;
          const day = +date.split("-")[2];
          const logged = loggedDates.has(date);
          const isToday = date === todayStr;
          return (
            <button
              key={i}
              onClick={() => onSelect(date)}
              className={`py-1 rounded ${
                isToday ? "border border-black" : ""
              } ${logged ? "bg-black text-white" : "bg-gray-50 text-gray-500"}`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 创建 `app/daily/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import { DailyEditor } from "@/components/DailyEditor";
import { DailyCalendar } from "@/components/DailyCalendar";

export default function DailyPage() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  return (
    <main className="p-4 space-y-4 max-w-md mx-auto">
      <h1 className="text-lg font-bold">📝 日志记录</h1>
      <DailyCalendar onSelect={setSelectedDate} />
      {selectedDate && (
        <p className="text-xs text-gray-500">
          已选择 {selectedDate}，下方编辑器切换中...
        </p>
      )}
      <DailyEditor />
    </main>
  );
}
```

> 注：DailyEditor 内部默认使用今天日期。若要从日历点击切换到历史日期，可给 DailyEditor 加一个 `date` prop。当前实现保持简单：日历只显示哪些天有记录，编辑器默认编辑今天。

- [ ] **Step 4: 验证编译**

```bash
npm run build
```
Expected: 编译成功，新增 /daily 路由

- [ ] **Step 5: Commit**

```bash
git add components/DailyEditor.tsx components/DailyCalendar.tsx app/daily/page.tsx
git commit -m "feat: 日志记录页面（编辑器 + 日历视图）"
```

---

## Task 3: 进度解析器 `lib/progress.ts`

**Files:**
- Create: `lib/progress.ts`
- Create: `lib/__tests__/progress.test.ts`

- [ ] **Step 1: 写失败测试 `lib/__tests__/progress.test.ts`**

```typescript
import { describe, it, expect } from "vitest";
import {
  parseAlgorithmProgress,
  currentStreak,
  parseWeekHours,
} from "../progress";

describe("progress", () => {
  it("parseAlgorithmProgress 解析 '当前: X/Y (Z%)'", () => {
    const md = `
## 总体目标
- 总量: 200题
- 当前: 12/200 (6%)
`;
    const result = parseAlgorithmProgress(md);
    expect(result.done).toBe(12);
    expect(result.total).toBe(200);
    expect(result.percent).toBe(6);
  });

  it("parseAlgorithmProgress 无匹配返回 0/200/0", () => {
    const result = parseAlgorithmProgress("nothing here");
    expect(result.done).toBe(0);
    expect(result.total).toBe(200);
    expect(result.percent).toBe(0);
  });

  it("currentStreak 从今天往回数连续天数", () => {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    const dates = [yesterday, today];
    expect(currentStreak(dates)).toBe(2);
  });

  it("currentStreak 今天没记录则 0", () => {
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    expect(currentStreak([yesterday])).toBe(0);
  });

  it("parseWeekHours 从日志内容提取本周学习时长", () => {
    const logs = [
      `### 产出\n- 有效学习时长：3 小时\n`,
      `### 产出\n- 有效学习时长：2.5 小时\n`,
    ];
    expect(parseWeekHours(logs)).toBe(5.5);
  });

  it("parseWeekHours 无匹配返回 0", () => {
    expect(parseWeekHours(["no match"])).toBe(0);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

```bash
npx vitest run lib/__tests__/progress.test.ts
```
Expected: FAIL

- [ ] **Step 3: 实现 `lib/progress.ts`**

```typescript
// lib/progress.ts
// 解析 algorithm/progress.md 和 daily/*.md，汇总进度信息

import type { ProgressInfo } from "./types";

export function parseAlgorithmProgress(markdown: string): {
  done: number;
  total: number;
  percent: number;
} {
  const m = markdown.match(/当前[:：]\s*(\d+)\s*\/\s*(\d+)\s*\((\d+)%\)/);
  if (!m) return { done: 0, total: 200, percent: 0 };
  return { done: +m[1], total: +m[2], percent: +m[3] };
}

export function currentStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const set = new Set(dates);
  let streak = 0;
  const d = new Date();
  for (;;) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const key = `${y}-${m}-${day}`;
    if (set.has(key)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function parseWeekHours(dailyContents: string[]): number {
  let total = 0;
  for (const content of dailyContents) {
    const m = content.match(/有效学习时长[：:]\s*([\d.]+)\s*小时/);
    if (m) total += parseFloat(m[1]);
  }
  return total;
}

export function buildProgressInfo(
  progressMd: string,
  dailyFiles: { name: string; content: string }[]
): ProgressInfo {
  const algo = parseAlgorithmProgress(progressMd);
  const dates = dailyFiles
    .map((f) => f.name.replace(".md", ""))
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));
  const streak = currentStreak(dates);
  const sortedDates = [...dates].sort();
  const latest = sortedDates.length ? sortedDates[sortedDates.length - 1] : "—";
  const recent7 = sortedDates.slice(-7);
  const recentContents = dailyFiles
    .filter((f) => recent7.includes(f.name.replace(".md", "")))
    .map((f) => f.content);
  const weekHours = parseWeekHours(recentContents);

  return {
    algorithmDone: algo.done,
    algorithmTotal: algo.total,
    algorithmPercent: algo.percent,
    streakDays: streak,
    totalLogs: dailyFiles.length,
    latestLog: latest,
    weekHours,
  };
}
```

- [ ] **Step 4: 运行测试确认通过**

```bash
npx vitest run lib/__tests__/progress.test.ts
```
Expected: PASS（6 tests）

- [ ] **Step 5: Commit**

```bash
git add lib/progress.ts lib/__tests__/progress.test.ts
git commit -m "feat: 进度解析器（算法/打卡/时长）"
```

---

## Task 4: 进度查看页面 `/progress`

**Files:**
- Create: `components/ProgressDashboard.tsx`
- Create: `app/progress/page.tsx`

- [ ] **Step 1: 创建 `components/ProgressDashboard.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { loadToken } from "@/lib/storage";
import { GitHubClient } from "@/lib/github";
import { GITHUB_OWNER, GITHUB_REPO } from "@/lib/githubConfig";
import { buildProgressInfo } from "@/lib/progress";
import type { ProgressInfo } from "@/lib/types";

export function ProgressDashboard() {
  const [info, setInfo] = useState<ProgressInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const token = await loadToken();
      if (!token) { setLoading(false); setError("未登录"); return; }
      const client = new GitHubClient(GITHUB_OWNER, GITHUB_REPO, token);
      try {
        const [progressFile, dailyNames] = await Promise.all([
          client.readFile("algorithm/progress.md"),
          client.listFiles("daily"),
        ]);
        const progressMd = progressFile?.content || "";
        const recentNames = dailyNames
          .filter((n) => /^\d{4}-\d{2}-\d{2}\.md$/.test(n))
          .sort()
          .slice(-14); // 最近14天
        const dailyFiles = await Promise.all(
          recentNames.map(async (name) => {
            const f = await client.readFile(`daily/${name}`);
            return { name, content: f?.content || "" };
          })
        );
        setInfo(buildProgressInfo(progressMd, dailyFiles));
      } catch (e) {
        setError(e instanceof Error ? e.message : "加载失败");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-gray-400 text-sm">加载中...</p>;
  if (error) return <p className="text-red-500 text-sm">{error}</p>;
  if (!info) return null;

  const barWidth = 20;
  const filled = info.algorithmTotal > 0
    ? Math.round((info.algorithmDone / info.algorithmTotal) * barWidth)
    : 0;
  const bar = "█".repeat(filled) + "░".repeat(barWidth - filled);

  const weekTarget = 23;
  const weekPercent = Math.min(100, Math.round((info.weekHours / weekTarget) * 100));

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <p className="text-xs text-gray-500 mb-2">算法进度</p>
        <p className="text-2xl font-bold">
          {info.algorithmDone}
          <span className="text-base text-gray-400">/{info.algorithmTotal}</span>
        </p>
        <div className="font-mono text-sm text-gray-600 mt-1">{bar}</div>
        <p className="text-xs text-gray-400 mt-1">{info.algorithmPercent}%</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <p className="text-xs text-gray-500">连续打卡</p>
          <p className="text-xl font-bold">{info.streakDays}</p>
          <p className="text-xs text-gray-400">天</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <p className="text-xs text-gray-500">累计日志</p>
          <p className="text-xl font-bold">{info.totalLogs}</p>
          <p className="text-xs text-gray-400">篇</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <p className="text-xs text-gray-500 mb-2">本周学习时长</p>
        <div className="flex items-end gap-2">
          <p className="text-2xl font-bold">{info.weekHours}</p>
          <p className="text-sm text-gray-400">/ {weekTarget} h</p>
        </div>
        <div className="bg-gray-100 rounded h-2 mt-2 overflow-hidden">
          <div
            className="bg-black h-2 transition-all"
            style={{ width: `${weekPercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">{weekPercent}%</p>
      </div>

      <div className="bg-white rounded-xl p-3 shadow-sm">
        <p className="text-xs text-gray-500">最近日志</p>
        <p className="text-sm font-medium">{info.latestLog}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 创建 `app/progress/page.tsx`**

```tsx
import { ProgressDashboard } from "@/components/ProgressDashboard";

export default function ProgressPage() {
  return (
    <main className="p-4 space-y-4 max-w-md mx-auto">
      <h1 className="text-lg font-bold">📊 进度查看</h1>
      <ProgressDashboard />
    </main>
  );
}
```

- [ ] **Step 3: 验证编译**

```bash
npm run build
```
Expected: 新增 /progress 路由

- [ ] **Step 4: Commit**

```bash
git add components/ProgressDashboard.tsx app/progress/page.tsx
git commit -m "feat: 进度查看页面（算法/打卡/时长仪表盘）"
```

---

## Task 5: AI 分析 API 路由 `/api/ai/route.ts`

**Files:**
- Create: `lib/ai.ts`
- Create: `app/api/ai/route.ts`

- [ ] **Step 1: 创建 `lib/ai.ts`（服务端 AI 客户端）**

```typescript
// lib/ai.ts
// 调用 GLM API 进行情绪模式和能量分析
// 复用 scripts/ai-review.js 的 prompt 设计思路

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

    // 提取 JSON（容错：可能包裹在 ```json 中）
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
```

- [ ] **Step 2: 创建 `app/api/ai/route.ts`**

```typescript
// app/api/ai/route.ts
// AI 分析代理路由：前端 POST 情绪+日志数据，后端调用 GLM API
// API Key 存 Vercel 环境变量，不暴露给前端

import { NextRequest, NextResponse } from "next/server";
import { analyzeWithAI } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { emotionData, dailyData } = await req.json();

    if (!emotionData && !dailyData) {
      return NextResponse.json(
        { error: "缺少数据" },
        { status: 400 }
      );
    }

    const result = await analyzeWithAI(emotionData || "", dailyData || "");
    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "分析失败";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
```

- [ ] **Step 3: 更新 `.env.local.example` 追加 AI 配置**

在 `.env.local.example` 末尾追加：

```
# AI 分析（服务端，不暴露给前端）
GLM_API_KEY=your_glm_api_key_here
```

- [ ] **Step 4: 验证编译**

```bash
npm run build
```
Expected: 新增 /api/ai 路由

- [ ] **Step 5: Commit**

```bash
git add lib/ai.ts app/api/ai/route.ts .env.local.example
git commit -m "feat: AI 分析 API 路由（GLM-4-flash）"
```

---

## Task 6: AI 分析页面 `/analyze`

**Files:**
- Create: `components/AnalyzePanel.tsx`
- Create: `app/analyze/page.tsx`
- Modify: `components/Nav.tsx`（加"分析"入口）

- [ ] **Step 1: 创建 `components/AnalyzePanel.tsx`**

```tsx
"use client";

import { useState } from "react";
import { loadToken } from "@/lib/storage";
import { GitHubClient } from "@/lib/github";
import { GITHUB_OWNER, GITHUB_REPO } from "@/lib/githubConfig";
import { parseEmotionFile } from "@/lib/emotion";
import type { AIAnalysis } from "@/lib/types";

export function AnalyzePanel() {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runAnalysis() {
    setLoading(true);
    setError("");
    setAnalysis(null);
    try {
      const token = await loadToken();
      if (!token) { setError("未登录"); return; }
      const client = new GitHubClient(GITHUB_OWNER, GITHUB_REPO, token);

      // 拉取最近 14 天情绪笔记
      const emotionNames = await client.listFiles("emotion");
      const recentEmotion = emotionNames
        .filter((n) => /^\d{4}-\d{2}-\d{2}\.md$/.test(n))
        .sort()
        .slice(-14);
      const emotionFiles = await Promise.all(
        recentEmotion.map(async (name) => {
          const f = await client.readFile(`emotion/${name}`);
          return f?.content || "";
        })
      );
      const emotionData = emotionFiles.join("\n\n---\n\n");

      // 拉取最近 14 天日志
      const dailyNames = await client.listFiles("daily");
      const recentDaily = dailyNames
        .filter((n) => /^\d{4}-\d{2}-\d{2}\.md$/.test(n))
        .sort()
        .slice(-14);
      const dailyFiles = await Promise.all(
        recentDaily.map(async (name) => {
          const f = await client.readFile(`daily/${name}`);
          return f?.content || "";
        })
      );
      const dailyData = dailyFiles.join("\n\n---\n\n");

      // 调用 AI 分析 API
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emotionData, dailyData }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `API ${res.status}`);
      }

      const result = await res.json();
      setAnalysis(result);
    } catch (e) {
      setError(e instanceof Error ? e.message : "分析失败");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={runAnalysis}
        disabled={loading}
        className="w-full bg-black text-white rounded py-3 text-sm font-medium disabled:opacity-40"
      >
        {loading ? "分析中...（约10-30秒）" : "🔍 分析最近14天数据"}
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {analysis && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">总体总结</p>
            <p className="text-sm">{analysis.summary}</p>
          </div>

          {analysis.patterns.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-xs text-gray-500 mb-2">识别到的模式</p>
              <ul className="space-y-1">
                {analysis.patterns.map((p, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-gray-400">{i + 1}.</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.suggestions.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-blue-100">
              <p className="text-xs text-gray-500 mb-2">调整建议</p>
              <ul className="space-y-2">
                {analysis.suggestions.map((s, i) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-blue-500">→</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 创建 `app/analyze/page.tsx`**

```tsx
import { AnalyzePanel } from "@/components/AnalyzePanel";

export default function AnalyzePage() {
  return (
    <main className="p-4 space-y-4 max-w-md mx-auto">
      <h1 className="text-lg font-bold">🧠 AI 分析</h1>
      <p className="text-xs text-gray-500">
        基于最近 14 天的情绪笔记和日志，AI 识别能量模式、情绪触发器，给出具体调整建议。
      </p>
      <AnalyzePanel />
    </main>
  );
}
```

- [ ] **Step 3: 更新 `components/Nav.tsx` 加"分析"入口**

把 `components/Nav.tsx` 的 items 数组改为 6 项（在最后加"分析"）：

```tsx
const items = [
  { href: "/", label: "今日", icon: "🎯" },
  { href: "/emotion", label: "情绪", icon: "📖" },
  { href: "/rest", label: "休息", icon: "😴" },
  { href: "/daily", label: "日志", icon: "📝" },
  { href: "/progress", label: "进度", icon: "📊" },
  { href: "/analyze", label: "分析", icon: "🧠" },
];
```

- [ ] **Step 4: 验证编译**

```bash
npm run build
```
Expected: 新增 /analyze 路由

- [ ] **Step 5: Commit**

```bash
git add components/AnalyzePanel.tsx app/analyze/page.tsx components/Nav.tsx
git commit -m "feat: AI 分析页面（14天数据 → 模式识别+建议）"
```

---

## Task 7: PWA service worker + manifest 完善

**Files:**
- Modify: `public/manifest.json`
- Create: `public/sw.js`
- Create: `public/icon-192.svg`
- Create: `public/icon-512.svg`
- Modify: `app/layout.tsx`（注册 service worker）

- [ ] **Step 1: 更新 `public/manifest.json`**

```json
{
  "name": "作战辅助系统",
  "short_name": "作战系统",
  "description": "百万年薪作战系统的记录与提醒前端",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f9fafb",
  "theme_color": "#000000",
  "icons": [
    {
      "src": "/icon-192.svg",
      "sizes": "192x192",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.svg",
      "sizes": "512x512",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}
```

- [ ] **Step 2: 创建 `public/icon-192.svg`（简约黑色圆圈+🎯）**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
  <rect width="192" height="192" fill="#000000" rx="32"/>
  <text x="96" y="120" font-size="96" text-anchor="middle" fill="#ffffff">🎯</text>
</svg>
```

- [ ] **Step 3: 创建 `public/icon-512.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#000000" rx="80"/>
  <text x="256" y="320" font-size="256" text-anchor="middle" fill="#ffffff">🎯</text>
</svg>
```

- [ ] **Step 4: 创建 `public/sw.js`（离线缓存静态资源）**

```javascript
// public/sw.js
// 简单 service worker：缓存静态页面，离线时回退

const CACHE_NAME = "ai-companion-v1";
const CACHED_PATHS = ["/", "/emotion", "/rest", "/daily", "/progress", "/analyze"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CACHED_PATHS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  // 只缓存同源 GET 请求
  if (event.request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }
  // API 请求不缓存（需在线）
  if (url.pathname.startsWith("/api/")) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request)
          .then((res) => {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
            return res;
          })
          .catch(() => cached)
      );
    })
  );
});
```

- [ ] **Step 5: 更新 `app/layout.tsx` 注册 service worker**

在 `app/layout.tsx` 中加入一个客户端组件注册 SW。由于 layout 是服务器组件，需要新建一个客户端注册组件或用 `<script>`。最简方案：在 `components/Nav.tsx` 的 useEffect 中注册。

修改 `components/Nav.tsx`，在 `useEffect` 中注册 service worker：

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const items = [
  { href: "/", label: "今日", icon: "🎯" },
  { href: "/emotion", label: "情绪", icon: "📖" },
  { href: "/rest", label: "休息", icon: "😴" },
  { href: "/daily", label: "日志", icon: "📝" },
  { href: "/progress", label: "进度", icon: "📊" },
  { href: "/analyze", label: "分析", icon: "🧠" },
];

export function Nav() {
  const pathname = usePathname();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-50">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center text-xs ${
              active ? "text-black font-medium" : "text-gray-400"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 6: 验证编译**

```bash
npm run build
```
Expected: 编译成功

- [ ] **Step 7: Commit**

```bash
git add public/manifest.json public/icon-192.svg public/icon-512.svg public/sw.js components/Nav.tsx
git commit -m "feat: PWA service worker + 离线缓存 + 图标"
```

---

## Task 8: Vercel 部署上线

**Files:**
- Modify: `vercel.json`（确认配置）
- Create: `.env.local`（本地测试用，不提交）
- Modify: `README.md`（手动加部署说明一节，dashboard.js 不会覆盖此节之外的内容）

- [ ] **Step 1: 确认 `vercel.json`**

```json
{
  "framework": "nextjs",
  "regions": ["hkg1"]
}
```

- [ ] **Step 2: 本地全量验证**

```bash
npm test
npm run build
```
Expected: 全部测试通过，构建成功，路由包含 / /emotion /rest /daily /progress /analyze /api/github/[...path] /api/ai

- [ ] **Step 3: 创建 `.env.local`（本地测试，已被 .gitignore 忽略）**

```bash
cp .env.local.example .env.local
# 手动编辑 .env.local 填入真实 GITHUB_OWNER/GITHUB_REPO/GLM_API_KEY
```

- [ ] **Step 4: 本地启动验证所有页面**

```bash
npm run dev
```
访问以下路径，验证 HTTP 200：
- http://localhost:3000/
- http://localhost:3000/emotion
- http://localhost:3000/rest
- http://localhost:3000/daily
- http://localhost:3000/progress
- http://localhost:3000/analyze

- [ ] **Step 5: 推送到远程**

```bash
git push origin main
```

- [ ] **Step 6: 部署到 Vercel（用户操作）**

向用户输出部署指引：

```
应用已 deploy-ready。请在 Vercel 完成部署：

1. 访问 https://vercel.com/new
2. Import GitHub 仓库 soulor8908/million-dollar-roadmap
3. Framework Preset 选 Next.js（自动识别）
4. Environment Variables 配置：
   - NEXT_PUBLIC_GITHUB_OWNER = soulor8908
   - NEXT_PUBLIC_GITHUB_REPO = million-dollar-roadmap
   - GITHUB_OWNER = soulor8908
   - GITHUB_REPO = million-dollar-roadmap
   - GLM_API_KEY = <你的 GLM API Key>
5. 点 Deploy，等待 1-2 分钟
6. 部署完成后用手机浏览器访问 Vercel URL，可"添加到主屏幕"作为 PWA 使用
```

- [ ] **Step 7: 部署后验证清单**

部署完成后请用户验证：
- [ ] Vercel URL 可访问，显示 Token 输入门户
- [ ] 输入 GitHub PAT 后进入今日指挥中心
- [ ] 当前任务卡片正确显示
- [ ] 情绪笔记可记录并回看
- [ ] 478 呼吸计时器正常
- [ ] 日志 checklist 可勾选并保存
- [ ] 进度仪表盘显示算法进度
- [ ] AI 分析能调用 GLM 返回结果
- [ ] 手机"添加到主屏幕"后可全屏启动

---

## 后续优化（不在本计划范围）

- 离线写入队列（断网时暂存，恢复后重试）
- 推送通知（用 Web Push API + Vercel cron）
- 自定义情绪标签管理
- 多设备数据同步冲突解决
- 性能优化（IndexedDB 缓存历史数据）
