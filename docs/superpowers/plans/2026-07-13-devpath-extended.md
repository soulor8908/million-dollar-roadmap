# devpath Extended Implementation Plan (M3-M6)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 MVP 基础上增加能量感知调量 + 数据可视化（热力图/雷达/周报）+ 公开学习主页 + Cloudflare Pages 部署，完成完整产品。

**Architecture:** 复用 MVP 的 8 模块边界。M3 新增 status 模块，M4 新增 visualization 模块，M5 新增 kv 存储层。所有新模块独立可测试。

**Tech Stack:** Next.js 14, TypeScript, ts-fsrs, Vercel AI SDK, idb-keyval, react-activity-calendar, recharts, html-to-image, Cloudflare KV, Cloudflare Pages

**Spec:** [docs/superpowers/specs/2026-07-13-devpath-design.md](../specs/2026-07-13-devpath-design.md)

**前置条件:** MVP（M1-M2）已完成。以下文件已存在且接口稳定：
- `devpath/lib/types.ts` — 含 `LearningPlan / KnowledgeNode / Question / ScheduleItem / ReviewCard / DailyStatus / ReviewLog / LearnLog / PublicProfile / EnergyPattern` 全部类型
- `devpath/lib/storage/db.ts` — IndexedDB 封装，导出 `get<T>(key) / set<T>(key, val) / del(key) / keys(pattern) / getMany<T>(keys)`
- `devpath/lib/ai/provider.ts` — 导出 `getModel(): LanguageModel`、`hasAIKey(): boolean`、`AI_PROVIDER` 常量
- `devpath/lib/fsrs.ts` — FSRS 封装，导出 `scheduleReview(card, rating)`、`getMastery(card): number`
- `devpath/lib/schedule.ts` — 导出 `buildSchedule(plan)` 等
- `devpath/lib/favorite.ts` — 收藏管理

**关键约束:**
1. 每个任务独立可 commit
2. 所有代码完整给出，不允许 "TODO" / "类似上面" / "TBD"
3. 测试代码完整可运行（Vitest + vi.mock）
4. id 用 `nanoid()` 生成
5. 时间用 `Asia/Shanghai` 时区（`Intl.DateTimeFormat` + `Asia/Shanghai`）
6. Cloudflare Pages Functions 放 `devpath/functions/` 目录，不放 `app/api/`
7. 静态导出（`output: "export"`）不能用 Server Actions / 动态路由 SSR；动态参数页面用 client component + `useParams()` + Cloudflare Pages SPA fallback
8. 复用 MVP 已有类型和模块，不重复定义

---

## 文件结构总览

```
devpath/
├── lib/
│   ├── status.ts                      # M3 Task 1 新建
│   ├── ai/
│   │   ├── status-enhance.ts          # M3 Task 2 新建
│   │   ├── energy-pattern.ts          # M3 Task 5 新建
│   │   └── weekly-report.ts           # M4 Task 8 新建
│   ├── storage/
│   │   └── kv.ts                      # M5 Task 10 新建
│   ├── visualization.ts               # M5 Task 11 新建
│   └── share-image.ts                 # M5 Task 15 新建
├── components/
│   ├── StatusAssessment.tsx           # M3 Task 4 新建
│   ├── Heatmap.tsx                    # M4 Task 6 新建
│   ├── RadarChart.tsx                 # M4 Task 7 新建
│   └── WeeklyReport.tsx               # M4 Task 8 新建
├── app/
│   ├── api/
│   │   ├── status/route.ts            # M3 Task 3 新建
│   │   └── weekly/route.ts            # M4 Task 8 新建
│   ├── stats/page.tsx                 # M4 Task 9 新建
│   ├── profile/page.tsx               # M5 Task 13 新建
│   ├── u/[username]/page.tsx          # M5 Task 14 新建
│   └── onboarding/page.tsx            # M6 Task 18 新建
├── functions/
│   └── api/public/[username].ts       # M5 Task 12 新建（Cloudflare Pages Function）
├── __tests__/
│   ├── status.test.ts                 # M3 Task 1
│   ├── status-enhance.test.ts         # M3 Task 2
│   ├── api-status.test.ts             # M3 Task 3
│   ├── energy-pattern.test.ts         # M3 Task 5
│   ├── weekly-report.test.ts          # M4 Task 8
│   ├── kv.test.ts                     # M5 Task 10
│   └── visualization.test.ts          # M5 Task 11
├── lib/ai/provider.ts                 # M6 Task 17 修改
├── next.config.js                     # M6 Task 16 修改
├── wrangler.toml                      # M6 Task 16 新建
├── pages.config.json                  # M6 Task 16 新建
├── public/
│   ├── manifest.json                  # M6 Task 19 新建
│   └── sw.js                          # M6 Task 19 新建
├── README.md                          # M6 Task 20 新建
└── .env.local.example                 # M6 Task 17 修改
```

---

# M3: 能量感知 + 动态调量（Week 5-6）

## Task 1: 状态评估类型 + 规则引擎（lib/status.ts）

**Files:**
- Create: `devpath/lib/status.ts`
- Create: `devpath/__tests__/status.test.ts`

- [ ] **Step 1: 写失败测试 `devpath/__tests__/status.test.ts`**

```typescript
import { describe, it, expect } from "vitest";
import { adjustDailyLoad, computeCapacity } from "../lib/status";
import type { ScheduleItem, DailyStatus } from "../lib/types";

function makeStatus(partial: Partial<DailyStatus>): DailyStatus {
  return {
    date: "2026-07-13",
    energy: 3,
    mood: "neutral",
    availableMinutes: 30,
    aiAdjustedLoad: 1,
    actualMinutes: 0,
    ...partial,
  };
}

function makePlan(): ScheduleItem[] {
  return [
    { day: 1, nodeId: "k1", type: "learn", estimatedMinutes: 20, completed: false },
    { day: 1, nodeId: "k2", type: "learn", estimatedMinutes: 20, completed: false },
    { day: 1, nodeId: "k1", type: "review", cardId: "c1", estimatedMinutes: 10, completed: false },
    { day: 1, nodeId: "k2", type: "review", cardId: "c2", estimatedMinutes: 10, completed: false },
  ];
}

describe("status", () => {
  it("computeCapacity 公式正确", () => {
    expect(computeCapacity(makeStatus({ energy: 3, mood: "neutral", availableMinutes: 30 }))).toBeCloseTo(1.0, 5);
    expect(computeCapacity(makeStatus({ energy: 5, mood: "good", availableMinutes: 60 }))).toBeCloseTo(3.333, 3);
    expect(computeCapacity(makeStatus({ energy: 1, mood: "bad", availableMinutes: 10 }))).toBeCloseTo(0.0778, 3);
  });

  it("capacity < 0.5 → 只复习不学新", () => {
    const status = makeStatus({ energy: 1, mood: "bad", availableMinutes: 10 });
    const result = adjustDailyLoad(makePlan(), status);
    expect(result.every((i) => i.type === "review")).toBe(true);
    expect(result).toHaveLength(2);
  });

  it("capacity 0.5-1.0 → 新内容减半", () => {
    const status = makeStatus({ energy: 2, mood: "neutral", availableMinutes: 30 });
    const result = adjustDailyLoad(makePlan(), status);
    const learnCount = result.filter((i) => i.type === "learn").length;
    expect(learnCount).toBe(1);
    expect(result.filter((i) => i.type === "review")).toHaveLength(2);
  });

  it("capacity 1.0-1.2 → 保持原计划", () => {
    const status = makeStatus({ energy: 3, mood: "neutral", availableMinutes: 30 });
    const result = adjustDailyLoad(makePlan(), status);
    expect(result).toHaveLength(makePlan().length);
  });

  it("capacity > 1.5 → 加学一个节点", () => {
    const status = makeStatus({ energy: 5, mood: "good", availableMinutes: 60 });
    const result = adjustDailyLoad(makePlan(), status);
    const learnCount = result.filter((i) => i.type === "learn").length;
    expect(learnCount).toBe(3);
  });

  it("capacity 1.2-1.5 → 加学一个节点", () => {
    const status = makeStatus({ energy: 4, mood: "good", availableMinutes: 45 });
    // (4/3) * 1 * (45/30) = 2.0 > 1.5 也加量，换个值: energy=4, min=33 → 1.466
    const status2 = makeStatus({ energy: 4, mood: "good", availableMinutes: 33 });
    const cap = computeCapacity(status2);
    expect(cap).toBeGreaterThan(1.2);
    expect(cap).toBeLessThanOrEqual(1.5);
    const result = adjustDailyLoad(makePlan(), status2);
    const learnCount = result.filter((i) => i.type === "learn").length;
    expect(learnCount).toBe(3);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

```bash
cd devpath && npx vitest run __tests__/status.test.ts
```

Expected: FAIL，模块不存在

- [ ] **Step 3: 实现 `devpath/lib/status.ts`**

```typescript
// lib/status.ts
// 每日状态评估 + 基于规则的动态调量引擎（无 AI 依赖，可独立测试）

import type { ScheduleItem, DailyStatus } from "./types";

/**
 * 计算当日容量系数
 * capacity = (energy/3) * (mood==="bad"?0.7:1) * (availableMinutes/30)
 * 1.0 ≈ 正常一天负载（精力 3 + 心情中性 + 30 分钟可用）
 */
export function computeCapacity(status: Pick<DailyStatus, "energy" | "mood" | "availableMinutes">): number {
  const moodFactor = status.mood === "bad" ? 0.7 : 1;
  return (status.energy / 3) * moodFactor * (status.availableMinutes / 30);
}

/**
 * 按容量系数动态调整当日学习计划
 * - capacity < 0.5: 只复习不学新
 * - capacity < 1.0: 新内容减半（向上取整）
 * - capacity > 1.5: 加学一个节点 + 返回"别透支"提醒标记（调用方读 suggestions）
 * - capacity > 1.2: 加学一个节点
 * - 其余 (1.0-1.2): 保持原计划
 */
export function adjustDailyLoad(basePlan: ScheduleItem[], status: DailyStatus): ScheduleItem[] {
  const capacity = computeCapacity(status);
  const learnItems = basePlan.filter((i) => i.type === "learn");
  const reviewItems = basePlan.filter((i) => i.type === "review");

  if (capacity < 0.5) {
    return [...reviewItems];
  }

  if (capacity < 1.0) {
    const half = Math.ceil(learnItems.length / 2);
    return [...learnItems.slice(0, half), ...reviewItems];
  }

  if (capacity > 1.2) {
    // 加学一个节点：复制最后一个 learn 项作为额外加学
    if (learnItems.length > 0) {
      const extra: ScheduleItem = { ...learnItems[learnItems.length - 1] };
      return [...basePlan, extra];
    }
    return [...basePlan];
  }

  // 1.0 <= capacity <= 1.2 保持原计划
  return [...basePlan];
}

/**
 * 判断是否需要触发 AI 增强建议
 * - 连续 3 天 energy < 3
 * - 某节点连续 3 次评分低（rating <= 2）
 */
export function detectEnhanceTrigger(
  recentStatuses: DailyStatus[],
  nodeFailCount: Record<string, number>,
): { consecutiveLowDays: number; nodeFailCount: Record<string, number> } {
  let consecutiveLowDays = 0;
  for (let i = recentStatuses.length - 1; i >= 0; i--) {
    if (recentStatuses[i].energy < 3) {
      consecutiveLowDays++;
    } else {
      break;
    }
  }
  return {
    consecutiveLowDays,
    nodeFailCount,
  };
}
```

- [ ] **Step 4: 运行测试确认通过**

```bash
cd devpath && npx vitest run __tests__/status.test.ts
```

Expected: PASS，6 个测试全过

- [ ] **Step 5: Commit**

```bash
cd devpath && git add lib/status.ts __tests__/status.test.ts && git commit -m "feat(status): 能量感知规则引擎 adjustDailyLoad + 4 分支测试 (M3 Task 1)"
```

---

## Task 2: AI 增强调量（lib/ai/status-enhance.ts）

**Files:**
- Create: `devpath/lib/ai/status-enhance.ts`
- Create: `devpath/__tests__/status-enhance.test.ts`

- [ ] **Step 1: 写失败测试 `devpath/__tests__/status-enhance.test.ts`**

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../lib/ai/provider", () => ({
  hasAIKey: () => true,
  getModel: () => ({}),
}));

import { enhanceAdjustment } from "../lib/ai/status-enhance";

describe("status-enhance", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("连续 3 天低能量 → 建议休息", async () => {
    const result = await enhanceAdjustment({ consecutiveLowDays: 3, nodeFailCount: {} });
    expect(result.length).toBeGreaterThan(0);
    expect(result.some((s) => s.includes("休息"))).toBe(true);
  });

  it("某节点连续 3 次评分低 → 建议补学", async () => {
    const result = await enhanceAdjustment({
      consecutiveLowDays: 0,
      nodeFailCount: { "React 重渲染优化": 3 },
    });
    expect(result.some((s) => s.includes("React 重渲染优化"))).toBe(true);
  });

  it("无触发条件 → 返回空数组", async () => {
    const result = await enhanceAdjustment({ consecutiveLowDays: 0, nodeFailCount: {} });
    expect(result).toEqual([]);
  });

  it("同时满足两个条件 → 返回两条建议", async () => {
    const result = await enhanceAdjustment({
      consecutiveLowDays: 3,
      nodeFailCount: { "diff 算法": 3 },
    });
    expect(result.length).toBeGreaterThanOrEqual(2);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

```bash
cd devpath && npx vitest run __tests__/status-enhance.test.ts
```

Expected: FAIL

- [ ] **Step 3: 实现 `devpath/lib/ai/status-enhance.ts`**

```typescript
// lib/ai/status-enhance.ts
// AI 增强调量：在规则引擎基础上，根据连续低能量/节点失败模式生成自然语言建议
// 无 AI key 时降级为规则模板，保证可独立测试

import { hasAIKey, getModel } from "./provider";
import { generateText } from "ai";

export interface EnhancePattern {
  consecutiveLowDays: number;
  nodeFailCount: Record<string, number>; // nodeId/title → 连续低评分次数
}

/**
 * 根据模式生成建议字符串数组
 * - consecutiveLowDays >= 3 → "建议今天休息一天，只做轻度复习"
 * - nodeFailCount[nodeTitle] >= 3 → `建议补学 ${nodeTitle} 相关材料`
 * 无触发条件返回空数组
 * 有 AI key 时调用 LLM 生成更个性化建议，失败降级为模板
 */
export async function enhanceAdjustment(pattern: EnhancePattern): Promise<string[]> {
  const suggestions: string[] = [];

  if (pattern.consecutiveLowDays >= 3) {
    suggestions.push("建议今天休息一天，只做轻度复习");
  }

  for (const [nodeTitle, failCount] of Object.entries(pattern.nodeFailCount)) {
    if (failCount >= 3) {
      suggestions.push(`建议补学 ${nodeTitle} 相关材料`);
    }
  }

  if (suggestions.length === 0) {
    return [];
  }

  if (!hasAIKey()) {
    return suggestions;
  }

  // AI 个性化润色（失败降级到模板）
  try {
    const model = getModel();
    const { text } = await generateText({
      model,
      system:
        "你是学习教练。根据用户近期学习状态，把以下基础建议改写成 1-2 句更具体、带行动项的话。每条建议一行，不要序号。保持简短。",
      prompt: `基础建议：\n${suggestions.map((s) => `- ${s}`).join("\n")}`,
    });
    const lines = text
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !/^[\d.、\-)]/.test(s));
    return lines.length > 0 ? lines : suggestions;
  } catch {
    return suggestions;
  }
}
```

- [ ] **Step 4: 运行测试确认通过**

```bash
cd devpath && npx vitest run __tests__/status-enhance.test.ts
```

Expected: PASS，4 个测试全过（无 AI key 走模板分支）

- [ ] **Step 5: Commit**

```bash
cd devpath && git add lib/ai/status-enhance.ts __tests__/status-enhance.test.ts && git commit -m "feat(ai): 状态增强建议 enhanceAdjustment + 规则降级 (M3 Task 2)"
```

---

## Task 3: /api/status 路由

**Files:**
- Create: `devpath/app/api/status/route.ts`
- Create: `devpath/__tests__/api-status.test.ts`

- [ ] **Step 1: 写失败测试 `devpath/__tests__/api-status.test.ts`**

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../lib/ai/provider", () => ({
  hasAIKey: () => false,
  getModel: () => ({}),
}));

vi.mock("../lib/storage/db", () => ({
  set: vi.fn().mockResolvedValue(undefined),
  get: vi.fn().mockResolvedValue(undefined),
}));

import { POST } from "../app/api/status/route";
import type { ScheduleItem } from "../lib/types";

function makeBasePlan(): ScheduleItem[] {
  return [
    { day: 1, nodeId: "k1", type: "learn", estimatedMinutes: 20, completed: false },
    { day: 1, nodeId: "k2", type: "learn", estimatedMinutes: 20, completed: false },
    { day: 1, nodeId: "k1", type: "review", cardId: "c1", estimatedMinutes: 10, completed: false },
  ];
}

function makeRequest(body: unknown): Request {
  return new Request("http://localhost/api/status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("/api/status", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("低能量 → learn 项数减少", async () => {
    const res = await POST(
      makeRequest({
        date: "2026-07-13",
        energy: 1,
        mood: "bad",
        availableMinutes: 10,
        basePlan: makeBasePlan(),
      }),
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.adjustedPlan.filter((i: ScheduleItem) => i.type === "learn")).toHaveLength(0);
    expect(data.suggestions).toBeDefined();
    expect(Array.isArray(data.suggestions)).toBe(true);
  });

  it("正常能量 → 保持原计划", async () => {
    const res = await POST(
      makeRequest({
        date: "2026-07-13",
        energy: 3,
        mood: "neutral",
        availableMinutes: 30,
        basePlan: makeBasePlan(),
      }),
    );
    const data = await res.json();
    expect(data.adjustedPlan).toHaveLength(makeBasePlan().length);
  });

  it("缺少字段 → 400", async () => {
    const res = await POST(makeRequest({ date: "2026-07-13" }));
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 2: 实现 `devpath/app/api/status/route.ts`**

```typescript
// app/api/status/route.ts
// 接收当日状态 + 基础计划 → 规则调量 → 可选 AI 增强 → 存 IndexedDB → 返回

import { NextResponse } from "next/server";
import { adjustDailyLoad, detectEnhanceTrigger } from "@/lib/status";
import { enhanceAdjustment } from "@/lib/ai/status-enhance";
import { set as dbSet, get as dbGet } from "@/lib/storage/db";
import type { DailyStatus, ScheduleItem } from "@/lib/types";

export const runtime = "nodejs";

interface StatusRequestBody {
  date: string;
  energy: 1 | 2 | 3 | 4 | 5;
  mood: "good" | "neutral" | "bad";
  availableMinutes: number;
  basePlan: ScheduleItem[];
}

export async function POST(req: Request) {
  let body: StatusRequestBody;
  try {
    body = (await req.json()) as StatusRequestBody;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!body.date || !body.energy || !body.mood || typeof body.availableMinutes !== "number" || !Array.isArray(body.basePlan)) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const status: DailyStatus = {
    date: body.date,
    energy: body.energy,
    mood: body.mood,
    availableMinutes: body.availableMinutes,
    aiAdjustedLoad: 0,
    actualMinutes: 0,
  };

  // 规则调量
  const adjustedPlan = adjustDailyLoad(body.basePlan, status);

  // 检查是否需 AI 增强：读最近 7 天状态
  const recentStatuses: DailyStatus[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(body.date);
    d.setDate(d.getDate() - i);
    const key = `status:${d.toISOString().slice(0, 10)}`;
    const s = await dbGet<DailyStatus>(key);
    if (s) recentStatuses.push(s);
  }
  recentStatuses.push(status);

  const trigger = detectEnhanceTrigger(recentStatuses, {});
  let suggestions: string[] = [];
  if (trigger.consecutiveLowDays >= 3 || Object.values(trigger.nodeFailCount).some((c) => c >= 3)) {
    suggestions = await enhanceAdjustment(trigger);
  }

  // 存当日状态到 IndexedDB
  status.aiAdjustedLoad = adjustedPlan.length;
  await dbSet(`status:${body.date}`, status);

  return NextResponse.json({ adjustedPlan, suggestions });
}
```

- [ ] **Step 3: 运行测试确认通过**

```bash
cd devpath && npx vitest run __tests__/api-status.test.ts
```

Expected: PASS，3 个测试全过

- [ ] **Step 4: Commit**

```bash
cd devpath && git add app/api/status/route.ts __tests__/api-status.test.ts && git commit -m "feat(api): /api/status 状态评估路由 + IndexedDB 持久化 (M3 Task 3)"
```

---

## Task 4: 状态评估组件（components/StatusAssessment.tsx）

**Files:**
- Create: `devpath/components/StatusAssessment.tsx`

- [ ] **Step 1: 实现 `devpath/components/StatusAssessment.tsx`**

```tsx
"use client";

// components/StatusAssessment.tsx
// 三种形态：完整版（3 问）/ 极简版（1 click）/ 自动推断
// 调用 /api/status 返回后通过 onAdjusted 回调更新首页今日学习列表

import { useState, useEffect } from "react";
import type { ScheduleItem, DailyStatus } from "@/lib/types";

type Form = "full" | "minimal" | "auto";

interface Props {
  date: string;
  basePlan: ScheduleItem[];
  onAdjusted: (plan: ScheduleItem[], suggestions: string[]) => void;
  /** 自动推断：传入最近 3 天 energy，若全 5 则跳过评估 */
  recentEnergies?: number[];
  /** 是否检测到晚睡（如当前时间 >= 23:30） */
  detectedLateSleep?: boolean;
}

export function StatusAssessment({ date, basePlan, onAdjusted, recentEnergies = [], detectedLateSleep = false }: Props) {
  const [form, setForm] = useState<Form>("minimal");
  const [energy, setEnergy] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [mood, setMood] = useState<"good" | "neutral" | "bad">("neutral");
  const [availableMinutes, setAvailableMinutes] = useState<number>(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 自动推断：连续 3 天 energy=5 跳过评估
  useEffect(() => {
    if (recentEnergies.length >= 3 && recentEnergies.slice(-3).every((e) => e === 5)) {
      setForm("auto");
    }
  }, [recentEnergies]);

  async function submit(e: Partial<{ energy: number; mood: "good" | "neutral" | "bad"; availableMinutes: number }>) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          energy: e.energy ?? energy,
          mood: e.mood ?? mood,
          availableMinutes: e.availableMinutes ?? availableMinutes,
          basePlan,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { adjustedPlan: ScheduleItem[]; suggestions: string[] };
      onAdjusted(data.adjustedPlan, data.suggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "评估失败");
    } finally {
      setLoading(false);
    }
  }

  // 自动推断：默认 energy=3，晚睡自动减量
  useEffect(() => {
    if (form === "auto") {
      const inferred = detectedLateSleep ? 2 : 5;
      const inferredMood = detectedLateSleep ? "bad" : "good";
      submit({ energy: inferred, mood: inferredMood, availableMinutes: 20 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  if (form === "auto") {
    return (
      <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800">
        {detectedLateSleep ? "😴 检测到晚睡，已自动减量" : "😎 近期状态不错，已自动按正常量排程"}
      </div>
    );
  }

  if (form === "minimal") {
    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-600">今天感觉怎么样？</p>
        <div className="flex gap-2">
          <button
            disabled={loading}
            onClick={() => submit({ energy: 1, mood: "bad", availableMinutes: 15 })}
            className="rounded-lg border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
          >
            😴 不太好
          </button>
          <button
            disabled={loading}
            onClick={() => submit({ energy: 3, mood: "neutral", availableMinutes: 30 })}
            className="rounded-lg border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
          >
            😐 一般
          </button>
          <button
            disabled={loading}
            onClick={() => submit({ energy: 5, mood: "good", availableMinutes: 60 })}
            className="rounded-lg border px-4 py-2 hover:bg-gray-50 disabled:opacity-50"
          >
            😎 不错
          </button>
        </div>
        <button onClick={() => setForm("full")} className="text-xs text-blue-600 underline">
          完整评估
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  }

  // 完整版
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">精力（1-5）</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setEnergy(n as 1 | 2 | 3 | 4 | 5)}
              className={`rounded px-3 py-1 ${energy === n ? "bg-blue-600 text-white" : "border"}`}
            >
              {"⭐".repeat(n)}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">心情</label>
        <div className="flex gap-2">
          {([
            { v: "good", e: "😊 好" },
            { v: "neutral", e: "😐 中" },
            { v: "bad", e: "😞 差" },
          ] as const).map((m) => (
            <button
              key={m.v}
              onClick={() => setMood(m.v)}
              className={`rounded border px-3 py-1 ${mood === m.v ? "bg-blue-600 text-white" : ""}`}
            >
              {m.e}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">今日可用时间（分钟）</label>
        <input
          type="number"
          min={5}
          max={240}
          value={availableMinutes}
          onChange={(e) => setAvailableMinutes(Number(e.target.value))}
          className="mt-1 w-32 rounded border px-2 py-1"
        />
      </div>
      <button
        disabled={loading}
        onClick={() => submit({})}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "评估中..." : "生成今日计划"}
      </button>
      <button onClick={() => setForm("minimal")} className="ml-2 text-xs text-blue-600 underline">
        极简版
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
```

- [ ] **Step 2: 类型检查**

```bash
cd devpath && npx tsc --noEmit
```

Expected: 无错误

- [ ] **Step 3: Commit**

```bash
cd devpath && git add components/StatusAssessment.tsx && git commit -m "feat(ui): StatusAssessment 三形态组件（完整/极简/自动）(M3 Task 4)"
```

---

## Task 5: 长期能量模式识别（lib/ai/energy-pattern.ts）

**Files:**
- Create: `devpath/lib/ai/energy-pattern.ts`
- Create: `devpath/__tests__/energy-pattern.test.ts`

- [ ] **Step 1: 写失败测试 `devpath/__tests__/energy-pattern.test.ts`**

```typescript
import { describe, it, expect, vi } from "vitest";

vi.mock("../lib/ai/provider", () => ({
  hasAIKey: () => false,
  getModel: () => ({}),
}));

import { analyzeEnergyPattern, aggregateByWeekday } from "../lib/ai/energy-pattern";
import type { DailyStatus } from "../lib/types";

function makeStatus(date: string, energy: 1 | 2 | 3 | 4 | 5): DailyStatus {
  return {
    date,
    energy,
    mood: "neutral",
    availableMinutes: 30,
    aiAdjustedLoad: 1,
    actualMinutes: 30,
  };
}

// 28 天数据，2026-06-15（周一）起
function make28Days(): DailyStatus[] {
  const out: DailyStatus[] = [];
  const start = new Date("2026-06-15T00:00:00+08:00");
  for (let i = 0; i < 28; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    out.push(makeStatus(iso, (i % 5) + 1 as 1 | 2 | 3 | 4 | 5));
  }
  return out;
}

describe("energy-pattern", () => {
  it("aggregateByWeekday 返回长度 7", () => {
    const arr = aggregateByWeekday(make28Days());
    expect(arr).toHaveLength(7);
    arr.forEach((v) => expect(typeof v).toBe("number"));
  });

  it("analyzeEnergyPattern 返回 avgEnergyByWeekday 长度 7", async () => {
    const pattern = await analyzeEnergyPattern(make28Days());
    expect(pattern.avgEnergyByWeekday).toHaveLength(7);
    expect(pattern.weekStart).toBe("2026-06-15");
    expect(Array.isArray(pattern.insights)).toBe(true);
    expect(Array.isArray(pattern.recommendations)).toBe(true);
  });

  it("空数据 → 返回全 0 数组", async () => {
    const pattern = await analyzeEnergyPattern([]);
    expect(pattern.avgEnergyByWeekday).toEqual([0, 0, 0, 0, 0, 0, 0]);
  });
});
```

- [ ] **Step 2: 实现 `devpath/lib/ai/energy-pattern.ts`**

```typescript
// lib/ai/energy-pattern.ts
// 聚合 28 天能量数据，按周几算平均，可选 AI 生成洞察与建议

import { hasAIKey, getModel } from "./provider";
import { generateText } from "ai";
import type { DailyStatus, EnergyPattern } from "../types";

/**
 * 按周一..周日聚合平均能量
 * JS getDay(): 0=周日, 1=周一..6=周六
 * 输出顺序：[周一, 周二, ..., 周日]
 */
export function aggregateByWeekday(statuses: DailyStatus[]): number[] {
  const sums = [0, 0, 0, 0, 0, 0, 0];
  const counts = [0, 0, 0, 0, 0, 0, 0];
  for (const s of statuses) {
    const jsDay = new Date(s.date + "T00:00:00+08:00").getDay();
    const idx = jsDay === 0 ? 6 : jsDay - 1;
    sums[idx] += s.energy;
    counts[idx] += 1;
  }
  return sums.map((sum, i) => (counts[i] === 0 ? 0 : Number((sum / counts[i]).toFixed(2))));
}

/**
 * 分析 28 天能量模式
 * - 聚合周几平均能量
 * - 有 AI key 时调用 LLM 生成 insights + recommendations
 * - 无 AI 或失败时降级为规则模板
 */
export async function analyzeEnergyPattern(statuses: DailyStatus[]): Promise<EnergyPattern> {
  const avgEnergyByWeekday = aggregateByWeekday(statuses);
  const weekStart = statuses.length > 0 ? statuses[0].date : new Date().toISOString().slice(0, 10);

  const minIdx = avgEnergyByWeekday.indexOf(Math.min(...avgEnergyByWeekday.filter((v) => v > 0)));
  const maxIdx = avgEnergyByWeekday.indexOf(Math.max(...avgEnergyByWeekday));
  const weekdayNames = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

  const fallbackInsights: string[] = [];
  const fallbackRecs: string[] = [];

  if (avgEnergyByWeekday.some((v) => v > 0)) {
    if (minIdx >= 0) fallbackInsights.push(`${weekdayNames[minIdx]}是你的低能量日（平均 ${avgEnergyByWeekday[minIdx]} 分）`);
    if (maxIdx >= 0) fallbackInsights.push(`${weekdayNames[maxIdx]}是你的高能量日（平均 ${avgEnergyByWeekday[maxIdx]} 分）`);
    if (minIdx >= 0) fallbackRecs.push(`建议${weekdayNames[minIdx]}只做轻度复习，不学新内容`);
    if (maxIdx >= 0) fallbackRecs.push(`建议${weekdayNames[maxIdx]}安排最难的知识节点`);
  }
  if (statuses.filter((s) => s.energy < 3).length >= 7) {
    fallbackInsights.push("近 28 天有 7 天以上低能量，可能存在过度疲劳");
    fallbackRecs.push("建议安排一个零学习日恢复");
  }

  if (!hasAIKey() || statuses.length === 0) {
    return { weekStart, avgEnergyByWeekday, insights: fallbackInsights, recommendations: fallbackRecs };
  }

  try {
    const model = getModel();
    const dataStr = avgEnergyByWeekday.map((v, i) => `${weekdayNames[i]}: ${v}`).join(", ");
    const { text } = await generateText({
      model,
      system:
        "你是学习教练。分析用户 28 天能量曲线，找出低能量日和高能量日，给 3 条具体建议。" +
        "输出 JSON：{\"insights\": string[], \"recommendations\": string[]}，每项 1 句话。",
      prompt: `周几平均能量：${dataStr}`,
    });
    const parsed = JSON.parse(text) as { insights: string[]; recommendations: string[] };
    return {
      weekStart,
      avgEnergyByWeekday,
      insights: Array.isArray(parsed.insights) ? parsed.insights : fallbackInsights,
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : fallbackRecs,
    };
  } catch {
    return { weekStart, avgEnergyByWeekday, insights: fallbackInsights, recommendations: fallbackRecs };
  }
}
```

- [ ] **Step 3: 运行测试确认通过**

```bash
cd devpath && npx vitest run __tests__/energy-pattern.test.ts
```

Expected: PASS，3 个测试全过

- [ ] **Step 4: Commit**

```bash
cd devpath && git add lib/ai/energy-pattern.ts __tests__/energy-pattern.test.ts && git commit -m "feat(ai): 28 天能量模式识别 analyzeEnergyPattern (M3 Task 5)"
```

---

# M4: 数据可视化（Week 7）

## Task 6: 学习热力图组件（components/Heatmap.tsx）

**Files:**
- Create: `devpath/components/Heatmap.tsx`

- [ ] **Step 1: 安装依赖**

```bash
cd devpath && npm install react-activity-calendar date-fns
```

- [ ] **Step 2: 实现 `devpath/components/Heatmap.tsx`**

```tsx
"use client";

// components/Heatmap.tsx
// 学习热力图：聚合 ReviewLog + LearnLog 按日期，4 档颜色
// 数据源：从 IndexedDB 读 log:* 前缀，聚合为 { date, count(分钟) }

import { useEffect, useState, useMemo } from "react";
import { ActivityCalendar } from "react-activity-calendar";
import { getMany, keys } from "@/lib/storage/db";
import type { ReviewLog, LearnLog } from "@/lib/types";

interface DayData {
  date: string; // YYYY-MM-DD
  count: number; // 当天总学习分钟
  level: 0 | 1 | 2 | 3 | 4;
}

interface Props {
  /** 外部传入数据（优先）；不传则内部从 IndexedDB 读 */
  data?: DayData[];
  weeks?: number; // 显示最近 N 周，默认 12
}

const LEVEL_THRESHOLDS = [0, 15, 30, 60];

function toLevel(minutes: number): 0 | 1 | 2 | 3 | 4 {
  if (minutes >= 60) return 4;
  if (minutes >= 30) return 3;
  if (minutes >= 15) return 2;
  if (minutes > 0) return 1;
  return 0;
}

export function Heatmap({ data, weeks = 12 }: Props) {
  const [internal, setInternal] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(!data);
  const [selected, setSelected] = useState<DayData | null>(null);

  useEffect(() => {
    if (data) {
      setInternal(data);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const allKeys = await keys("log:");
      const logs = await getMany<(ReviewLog & { duration?: number }) | LearnLog>(allKeys);
      if (cancelled) return;
      const byDate = new Map<string, number>();
      for (const log of logs) {
        const date = (log as LearnLog).date;
        const duration = (log as LearnLog).duration ?? 10;
        byDate.set(date, (byDate.get(date) ?? 0) + duration);
      }
      const arr: DayData[] = Array.from(byDate.entries()).map(([date, count]) => ({
        date,
        count,
        level: toLevel(count),
      }));
      setInternal(arr);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [data]);

  const calendarData = useMemo(() => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - weeks * 7);
    const startStr = start.toISOString().slice(0, 10);
    return internal
      .filter((d) => d.date >= startStr)
      .map((d) => ({ date: d.date, count: d.count, level: d.level }));
  }, [internal, weeks]);

  if (loading) {
    return <div className="h-32 animate-pulse rounded bg-gray-100" />;
  }

  return (
    <div className="relative">
      <ActivityCalendar
        data={calendarData.length > 0 ? calendarData : [{ date: new Date().toISOString().slice(0, 10), count: 0, level: 0 }]}
        theme={{
          level0: "#ebedf0",
          level1: "#9be9a8",
          level2: "#40c463",
          level3: "#30a14e",
          level4: "#216e39",
        }}
        labels={{
          totalCount: "{{count}} 分钟学习",
        }}
        event={{ onClick: (e) => (e.currentTarget as HTMLElement).blur() }}
        renderBlock={(block, activity) => (
          <div
            key={activity.date}
            onClick={() => {
              const d = internal.find((x) => x.date === activity.date);
              if (d) setSelected(d);
            }}
          >
            {block}
          </div>
        )}
      />
      {selected && (
        <div className="absolute right-0 top-0 z-10 rounded-lg border bg-white p-3 shadow-lg">
          <div className="text-sm font-medium">{selected.date}</div>
          <div className="text-xs text-gray-600">学习 {selected.count} 分钟</div>
          <button onClick={() => setSelected(null)} className="mt-1 text-xs text-blue-600">
            关闭
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: 类型检查**

```bash
cd devpath && npx tsc --noEmit
```

Expected: 无错误

- [ ] **Step 4: Commit**

```bash
cd devpath && git add components/Heatmap.tsx package.json package-lock.json && git commit -m "feat(ui): Heatmap 学习热力图组件 + 4 档颜色 + 点击详情 (M4 Task 6)"
```

---

## Task 7: 能力雷达图组件（components/RadarChart.tsx）

**Files:**
- Create: `devpath/components/RadarChart.tsx`

- [ ] **Step 1: 安装依赖**

```bash
cd devpath && npm install recharts
```

- [ ] **Step 2: 实现 `devpath/components/RadarChart.tsx`**

```tsx
"use client";

// components/RadarChart.tsx
// 能力雷达图：每个知识节点一个轴（最多 8 个），5 个维度可切换
// 维度：掌握度 / 正确率 / 练习次数 / 活跃度 / 面试权重

import { useState, useMemo } from "react";
import {
  Radar,
  RadarChart as RechartsRadar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import type { KnowledgeNode, ReviewLog, ReviewCard } from "@/lib/types";

type Dimension = "mastery" | "accuracy" | "practice" | "activity" | "frequency";

interface NodeStat {
  nodeId: string;
  title: string;
  mastery: number; // 0-100
  accuracy: number; // 0-100
  practice: number; // 练习次数
  activity: number; // 最近 7 天活跃度 0-100
  frequency: number; // 面试权重 高=100 中=60 低=30
}

interface Props {
  nodes: KnowledgeNode[];
  cards: ReviewCard[];
  logs: ReviewLog[];
  /** 外部传入节点统计（优先）；不传则内部计算 */
  stats?: NodeStat[];
}

const DIM_LABELS: Record<Dimension, string> = {
  mastery: "掌握度",
  accuracy: "正确率",
  practice: "练习次数",
  activity: "活跃度",
  frequency: "面试权重",
};

function frequencyToScore(f: "高" | "中" | "低"): number {
  return f === "高" ? 100 : f === "中" ? 60 : 30;
}

export function RadarChart({ nodes, cards, logs, stats }: Props) {
  const [dimension, setDimension] = useState<Dimension>("mastery");

  const computedStats: NodeStat[] = useMemo(() => {
    if (stats) return stats.slice(0, 8);
    return nodes.slice(0, 8).map((node) => {
      const nodeCards = cards.filter((c) => c.nodeId === node.id);
      const nodeLogs = logs.filter((l) => nodeCards.some((c) => c.id === l.cardId));
      const correctCount = nodeLogs.filter((l) => l.rating >= 3).length;
      const accuracy = nodeLogs.length > 0 ? Math.round((correctCount / nodeLogs.length) * 100) : 0;
      const practice = nodeLogs.length;
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentLogs = nodeLogs.filter((l) => new Date(l.date) >= sevenDaysAgo);
      const activity = Math.min(100, recentLogs.length * 20);
      return {
        nodeId: node.id,
        title: node.title,
        mastery: node.mastery,
        accuracy,
        practice: Math.min(100, practice * 10),
        activity,
        frequency: frequencyToScore(node.frequency),
      };
    });
  }, [nodes, cards, logs, stats]);

  const chartData = computedStats.map((s) => ({
    node: s.title.length > 8 ? s.title.slice(0, 8) + "…" : s.title,
    value: s[dimension],
  }));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(DIM_LABELS) as Dimension[]).map((d) => (
          <button
            key={d}
            onClick={() => setDimension(d)}
            className={`rounded-full px-3 py-1 text-sm ${
              dimension === d ? "bg-blue-600 text-white" : "border text-gray-700"
            }`}
          >
            {DIM_LABELS[d]}
          </button>
        ))}
      </div>
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsRadar data={chartData} outerRadius="75%">
            <PolarGrid />
            <PolarAngleAxis dataKey="node" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} />
            <Radar dataKey="value" stroke="#2563eb" fill="#2563eb" fillOpacity={0.4} />
          </RechartsRadar>
        </ResponsiveContainer>
      </div>
      {computedStats.length === 0 && <p className="text-center text-sm text-gray-500">暂无知识节点</p>}
    </div>
  );
}
```

- [ ] **Step 3: 类型检查**

```bash
cd devpath && npx tsc --noEmit
```

Expected: 无错误

- [ ] **Step 4: Commit**

```bash
cd devpath && git add components/RadarChart.tsx package.json package-lock.json && git commit -m "feat(ui): RadarChart 能力雷达图 + 5 维度切换 (M4 Task 7)"
```

---

## Task 8: AI 周报（lib/ai/weekly-report.ts + /api/weekly）

**Files:**
- Create: `devpath/lib/ai/weekly-report.ts`
- Create: `devpath/components/WeeklyReport.tsx`
- Create: `devpath/app/api/weekly/route.ts`
- Create: `devpath/__tests__/weekly-report.test.ts`

- [ ] **Step 1: 写失败测试 `devpath/__tests__/weekly-report.test.ts`**

```typescript
import { describe, it, expect, vi } from "vitest";

vi.mock("../lib/ai/provider", () => ({
  hasAIKey: () => false,
  getModel: () => ({}),
}));

import { generateWeeklyReport } from "../lib/ai/weekly-report";
import type { LearnLog, ReviewLog, DailyStatus } from "../lib/types";

function makeWeekData() {
  const learnLogs: LearnLog[] = [];
  const reviewLogs: ReviewLog[] = [];
  const statuses: DailyStatus[] = [];
  const start = new Date("2026-07-06T00:00:00+08:00"); // 周一
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    learnLogs.push({
      id: `l${i}`,
      planId: "p1",
      nodeId: "k1",
      date: iso,
      duration: 30 + i * 5,
      type: i % 2 === 0 ? "learn" : "review",
    });
    reviewLogs.push({
      id: `r${i}`,
      cardId: "c1",
      date: iso,
      rating: 3,
      elapsedDays: 1,
      stateBefore: 2,
      stateAfter: 2,
    });
    statuses.push({
      date: iso,
      energy: 3,
      mood: "neutral",
      availableMinutes: 30,
      aiAdjustedLoad: 1,
      actualMinutes: 30,
    });
  }
  return { learnLogs, reviewLogs, statuses };
}

describe("weekly-report", () => {
  it("generateWeeklyReport 返回包含模式识别的 markdown", async () => {
    const { learnLogs, reviewLogs, statuses } = makeWeekData();
    const report = await generateWeeklyReport({ learnLogs, reviewLogs, statuses, weekStart: "2026-07-06" });
    expect(typeof report).toBe("string");
    expect(report).toContain("模式识别");
    expect(report).toContain("统计");
    expect(report).toContain("下周建议");
  });

  it("空数据 → 返回仍包含三段式标题", async () => {
    const report = await generateWeeklyReport({
      learnLogs: [],
      reviewLogs: [],
      statuses: [],
      weekStart: "2026-07-06",
    });
    expect(report).toContain("统计");
    expect(report).toContain("模式识别");
    expect(report).toContain("下周建议");
  });
});
```

- [ ] **Step 2: 实现 `devpath/lib/ai/weekly-report.ts`**

```typescript
// lib/ai/weekly-report.ts
// 喂入本周所有学习/复习/状态日志，AI 生成三段式 markdown 周报
// 无 AI key 时降级为统计模板

import { hasAIKey, getModel } from "./provider";
import { generateText } from "ai";
import type { LearnLog, ReviewLog, DailyStatus } from "../types";

export interface WeeklyInput {
  learnLogs: LearnLog[];
  reviewLogs: ReviewLog[];
  statuses: DailyStatus[];
  weekStart: string; // YYYY-MM-DD 周一
}

/**
 * 生成三段式 markdown 周报：
 * ## 本周统计
 * ## 模式识别
 * ## 下周建议
 */
export async function generateWeeklyReport(input: WeeklyInput): Promise<string> {
  const totalMinutes = input.learnLogs.reduce((sum, l) => sum + l.duration, 0);
  const learnCount = input.learnLogs.filter((l) => l.type === "learn").length;
  const reviewCount = input.reviewLogs.length;
  const correctCount = input.reviewLogs.filter((r) => r.rating >= 3).length;
  const accuracy = reviewCount > 0 ? Math.round((correctCount / reviewCount) * 100) : 0;
  const streakDays = new Set(input.learnLogs.map((l) => l.date)).size;
  const avgEnergy =
    input.statuses.length > 0
      ? Number((input.statuses.reduce((s, x) => s + x.energy, 0) / input.statuses.length).toFixed(2))
      : 0;

  const statsSection = `## 本周统计

- 总学习时长：**${totalMinutes} 分钟**（约 ${(totalMinutes / 60).toFixed(1)} 小时）
- 新学知识节点：${learnCount} 个
- 复习卡片：${reviewCount} 张，正确率 ${accuracy}%
- 连续打卡：${streakDays} 天
- 平均能量：${avgEnergy} / 5`;

  // 无 AI key 降级
  if (!hasAIKey() || input.learnLogs.length === 0) {
    const insights: string[] = [];
    if (accuracy < 60) insights.push("复习正确率偏低，建议放慢新内容节奏，加强巩固");
    if (avgEnergy < 3) insights.push("本周能量偏低，注意休息");
    if (streakDays >= 5) insights.push("坚持打卡良好，保持节奏");
    if (insights.length === 0) insights.push("数据稳定，无明显异常模式");

    const recs: string[] = [];
    recs.push("维持当前每日学习量");
    if (accuracy < 60) recs.push("增加 1 次复习频率");
    if (avgEnergy < 3) recs.push("安排 1 天零学习日恢复");

    return `${statsSection}

## 模式识别

${insights.map((s) => `- ${s}`).join("\n")}

## 下周建议

${recs.map((s) => `- ${s}`).join("\n")}`;
  }

  try {
    const model = getModel();
    const dataSummary = JSON.stringify({
      totalMinutes,
      learnCount,
      reviewCount,
      accuracy,
      streakDays,
      avgEnergy,
      dailyMinutes: input.learnLogs.reduce((acc, l) => {
        acc[l.date] = (acc[l.date] ?? 0) + l.duration;
        return acc;
      }, {} as Record<string, number>),
    });
    const { text } = await generateText({
      model,
      system:
        "你是学习教练。生成本周学习报告，严格三段式 markdown：\n" +
        "## 本周统计\n（用列表呈现时长/数量/正确率/打卡/能量）\n\n" +
        "## 模式识别\n（基于数据发现 2-3 条规律，每条一行带 -）\n\n" +
        "## 下周建议\n（3 条具体可执行建议，每条一行带 -）",
      prompt: `本周数据：${dataSummary}`,
    });
    // 校验 AI 返回包含三段标题，缺失则补全
    let report = text;
    if (!report.includes("## 本周统计")) report = statsSection + "\n\n" + report;
    if (!report.includes("## 模式识别")) report += "\n\n## 模式识别\n\n- 数据不足以识别模式";
    if (!report.includes("## 下周建议")) report += "\n\n## 下周建议\n\n- 维持当前节奏";
    return report;
  } catch {
    // 失败降级
    return generateWeeklyReport({ ...input, learnLogs: [] }).then((r) => r);
  }
}
```

- [ ] **Step 3: 实现 `devpath/app/api/weekly/route.ts`**

```typescript
// app/api/weekly/route.ts
// 周报生成路由：接收本周数据 → 调 AI → 存 IndexedDB → 返回 markdown

import { NextResponse } from "next/server";
import { generateWeeklyReport } from "@/lib/ai/weekly-report";
import { set as dbSet } from "@/lib/storage/db";
import { nanoid } from "nanoid";
import type { LearnLog, ReviewLog, DailyStatus } from "@/lib/types";

export const runtime = "nodejs";

interface WeeklyRequestBody {
  weekStart: string;
  learnLogs: LearnLog[];
  reviewLogs: ReviewLog[];
  statuses: DailyStatus[];
}

export async function POST(req: Request) {
  let body: WeeklyRequestBody;
  try {
    body = (await req.json()) as WeeklyRequestBody;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!body.weekStart || !Array.isArray(body.learnLogs)) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }

  const report = await generateWeeklyReport({
    learnLogs: body.learnLogs,
    reviewLogs: body.reviewLogs,
    statuses: body.statuses,
    weekStart: body.weekStart,
  });

  const id = nanoid();
  await dbSet(`weekly:${id}`, {
    id,
    weekStart: body.weekStart,
    content: report,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json({ id, content: report, weekStart: body.weekStart });
}

export async function GET() {
  return NextResponse.json({ error: "use POST" }, { status: 405 });
}
```

- [ ] **Step 4: 实现 `devpath/components/WeeklyReport.tsx`**

```tsx
"use client";

// components/WeeklyReport.tsx
// 周报展示 + 生成按钮 + 历史列表

import { useState, useEffect } from "react";
import { keys, getMany } from "@/lib/storage/db";
import type { LearnLog, ReviewLog, DailyStatus } from "@/lib/types";

interface WeeklyEntry {
  id: string;
  weekStart: string;
  content: string;
  createdAt: string;
}

interface Props {
  learnLogs: LearnLog[];
  reviewLogs: ReviewLog[];
  statuses: DailyStatus[];
}

function getMondayStr(d = new Date()): string {
  const date = new Date(d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date.toISOString().slice(0, 10);
}

export function WeeklyReport({ learnLogs, reviewLogs, statuses }: Props) {
  const [history, setHistory] = useState<WeeklyEntry[]>([]);
  const [current, setCurrent] = useState<WeeklyEntry | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const ks = await keys("weekly:");
      const entries = await getMany<WeeklyEntry>(ks);
      entries.sort((a, b) => b.weekStart.localeCompare(a.weekStart));
      setHistory(entries);
    })();
  }, []);

  async function generate() {
    setLoading(true);
    try {
      const weekStart = getMondayStr();
      const res = await fetch("/api/weekly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ weekStart, learnLogs, reviewLogs, statuses }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as WeeklyEntry;
      setCurrent(data);
      setHistory((h) => [data, ...h.filter((x) => x.id !== data.id)]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <button
        onClick={generate}
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "生成中..." : "生成本周周报"}
      </button>

      {current && (
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 font-semibold">本周报告（{current.weekStart} 起）</h3>
          <pre className="whitespace-pre-wrap text-sm text-gray-700">{current.content}</pre>
        </div>
      )}

      {history.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-medium">历史周报</h4>
          <ul className="space-y-1">
            {history.map((h) => (
              <li key={h.id}>
                <button
                  onClick={() => setCurrent(h)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {h.weekStart} 起
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: 运行测试确认通过**

```bash
cd devpath && npx vitest run __tests__/weekly-report.test.ts
```

Expected: PASS，2 个测试全过

- [ ] **Step 6: Commit**

```bash
cd devpath && git add lib/ai/weekly-report.ts app/api/weekly/route.ts components/WeeklyReport.tsx __tests__/weekly-report.test.ts && git commit -m "feat(ai): AI 周报 generateWeeklyReport + /api/weekly 路由 (M4 Task 8)"
```

---

## Task 9: /stats 页面（数据可视化总览）

**Files:**
- Create: `devpath/app/stats/page.tsx`

- [ ] **Step 1: 实现 `devpath/app/stats/page.tsx`**

```tsx
"use client";

// app/stats/page.tsx
// 数据可视化总览：顶部 Tab 切换 热力图 / 雷达图 / 周报

import { useState, useEffect } from "react";
import { Heatmap } from "@/components/Heatmap";
import { RadarChart } from "@/components/RadarChart";
import { WeeklyReport } from "@/components/WeeklyReport";
import { keys, getMany, get } from "@/lib/storage/db";
import type { KnowledgeNode, ReviewCard, ReviewLog, LearnLog, DailyStatus, LearningPlan } from "@/lib/types";

type Tab = "heatmap" | "radar" | "weekly";

export default function StatsPage() {
  const [tab, setTab] = useState<Tab>("heatmap");
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [cards, setCards] = useState<ReviewCard[]>([]);
  const [reviewLogs, setReviewLogs] = useState<ReviewLog[]>([]);
  const [learnLogs, setLearnLogs] = useState<LearnLog[]>([]);
  const [statuses, setStatuses] = useState<DailyStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // 聚合所有计划的 KnowledgeNode + ReviewCard
      const planKeys = await keys("plan:");
      const plans = await getMany<LearningPlan>(planKeys);
      const allNodes: KnowledgeNode[] = plans.flatMap((p) => p.knowledgeTree ?? []);
      const allCards: ReviewCard[] = [];
      const cardKeys = await keys("card:");
      const cs = await getMany<ReviewCard>(cardKeys);
      allCards.push(...cs);

      // 聚合日志
      const learnKeys = await keys("log:");
      const learnLogsArr = await getMany<LearnLog>(learnKeys);
      const reviewLogKeys = await keys("reviewlog:");
      const reviewLogsArr = await getMany<ReviewLog>(reviewLogKeys);

      // 聚合状态
      const statusKeys = await keys("status:");
      const statusArr = await getMany<DailyStatus>(statusKeys);

      setNodes(allNodes);
      setCards(allCards);
      setReviewLogs(reviewLogsArr);
      setLearnLogs(learnLogsArr);
      setStatuses(statusArr);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <div className="p-8 text-gray-500">加载中...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <h1 className="text-2xl font-bold">学习数据</h1>

      <div className="flex gap-2 border-b">
        {([
          { id: "heatmap" as const, label: "热力图" },
          { id: "radar" as const, label: "雷达图" },
          { id: "weekly" as const, label: "周报" },
        ]).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`-mb-px border-b-2 px-4 py-2 ${
              tab === t.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "heatmap" && <Heatmap weeks={12} />}

      {tab === "radar" && <RadarChart nodes={nodes} cards={cards} logs={reviewLogs} />}

      {tab === "weekly" && <WeeklyReport learnLogs={learnLogs} reviewLogs={reviewLogs} statuses={statuses} />}
    </div>
  );
}
```

- [ ] **Step 2: 类型检查 + 构建**

```bash
cd devpath && npx tsc --noEmit && npm run build
```

Expected: 无错误，构建成功

- [ ] **Step 3: Commit**

```bash
cd devpath && git add app/stats/page.tsx && git commit -m "feat(page): /stats 数据可视化总览页（热力图/雷达/周报 Tab）(M4 Task 9)"
```

---

# M5: 公开学习主页（Week 8）

## Task 10: Cloudflare KV 封装（lib/storage/kv.ts）

**Files:**
- Create: `devpath/lib/storage/kv.ts`
- Create: `devpath/__tests__/kv.test.ts`

- [ ] **Step 1: 写失败测试 `devpath/__tests__/kv.test.ts`**

```typescript
import { describe, it, expect, vi } from "vitest";
import { createKVStore } from "../lib/storage/kv";
import type { PublicProfile } from "../lib/types";

function makeProfile(username: string): PublicProfile {
  return {
    username,
    displayName: username,
    avatar: undefined,
    bio: "",
    visibility: { radar: true, heatmap: true, currentTopic: true, notes: false },
    followerCount: 0,
    followingCount: 0,
    updatedAt: new Date().toISOString(),
  };
}

describe("kv", () => {
  it("set 后 get 返回一致", async () => {
    const kv = createKVStore(); // 无 env.KV，使用 mock 内存 Map
    await kv.setProfile(makeProfile("alice"));
    const got = await kv.getProfile("alice");
    expect(got?.username).toBe("alice");
    expect(got?.displayName).toBe("alice");
  });

  it("get 不存在的 username → null", async () => {
    const kv = createKVStore();
    const got = await kv.getProfile("nobody");
    expect(got).toBeNull();
  });

  it("updateStats 增量更新", async () => {
    const kv = createKVStore();
    await kv.updateStats("bob", { streakDays: 5, totalMinutes: 100 } as any);
    const stats = await kv.getStats("bob");
    expect(stats?.streakDays).toBe(5);
  });
});
```

- [ ] **Step 2: 实现 `devpath/lib/storage/kv.ts`**

```typescript
// lib/storage/kv.ts
// Cloudflare KV 封装（公开主页数据）
// 运行时：Cloudflare Pages Functions 通过 env.KV binding 注入
// 本地开发/测试：无 env.KV 时降级为内存 Map（mock）

import type { PublicProfile } from "../types";

export interface PublicStats {
  username: string;
  streakDays: number;
  totalMinutes: number;
  currentTopic?: string;
  radarData?: Array<{ node: string; value: number }>;
  heatmapData?: Array<{ date: string; count: number }>;
  updatedAt: string;
}

export interface KVStore {
  getProfile(username: string): Promise<PublicProfile | null>;
  setProfile(profile: PublicProfile): Promise<void>;
  getStats(username: string): Promise<PublicStats | null>;
  updateStats(username: string, stats: Partial<PublicStats>): Promise<void>;
}

interface KVLike {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

/**
 * 创建 KV 存储实例
 * @param envKV Cloudflare env.KV binding（边缘运行时注入）
 * 无传入时降级为内存 Map（仅本地开发/测试）
 */
export function createKVStore(envKV?: KVLike): KVStore {
  const kv: KVLike = envKV ?? createMockKV();

  return {
    async getProfile(username: string) {
      const raw = await kv.get(`profile:${username}`);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as PublicProfile;
      } catch {
        return null;
      }
    },
    async setProfile(profile: PublicProfile) {
      await kv.put(`profile:${profile.username}`, JSON.stringify(profile));
    },
    async getStats(username: string) {
      const raw = await kv.get(`stats:${username}`);
      if (!raw) return null;
      try {
        return JSON.parse(raw) as PublicStats;
      } catch {
        return null;
      }
    },
    async updateStats(username: string, stats: Partial<PublicStats>) {
      const existing = await this.getStats(username);
      const merged: PublicStats = {
        username,
        streakDays: stats.streakDays ?? existing?.streakDays ?? 0,
        totalMinutes: stats.totalMinutes ?? existing?.totalMinutes ?? 0,
        currentTopic: stats.currentTopic ?? existing?.currentTopic,
        radarData: stats.radarData ?? existing?.radarData,
        heatmapData: stats.heatmapData ?? existing?.heatmapData,
        updatedAt: new Date().toISOString(),
      };
      await kv.put(`stats:${username}`, JSON.stringify(merged));
    },
  };
}

function createMockKV(): KVLike {
  const map = new Map<string, string>();
  return {
    async get(key: string) {
      return map.has(key) ? map.get(key)! : null;
    },
    async put(key: string, value: string) {
      map.set(key, value);
    },
  };
}
```

- [ ] **Step 3: 运行测试确认通过**

```bash
cd devpath && npx vitest run __tests__/kv.test.ts
```

Expected: PASS，3 个测试全过

- [ ] **Step 4: Commit**

```bash
cd devpath && git add lib/storage/kv.ts __tests__/kv.test.ts && git commit -m "feat(storage): Cloudflare KV 封装 + 内存 mock 降级 (M5 Task 10)"
```

---

## Task 11: 公开主页数据聚合（lib/visualization.ts）

**Files:**
- Create: `devpath/lib/visualization.ts`
- Create: `devpath/__tests__/visualization.test.ts`

- [ ] **Step 1: 写失败测试 `devpath/__tests__/visualization.test.ts`**

```typescript
import { describe, it, expect, vi } from "vitest";

vi.mock("../lib/storage/db", () => ({
  get: vi.fn(),
  set: vi.fn(),
  del: vi.fn(),
  keys: vi.fn().mockResolvedValue([]),
  getMany: vi.fn().mockResolvedValue([]),
}));

import { buildPublicStats } from "../lib/visualization";
import type { PublicProfile, LearnLog } from "../lib/types";

const profile: PublicProfile = {
  username: "alice",
  displayName: "Alice",
  avatar: undefined,
  bio: "",
  visibility: { radar: true, heatmap: true, currentTopic: true, notes: false },
  followerCount: 10,
  followingCount: 5,
  updatedAt: new Date().toISOString(),
};

describe("visualization", () => {
  it("PublicStats 不含 followerCount（隐私字段）", async () => {
    const stats = await buildPublicStats("alice", profile, [], [], [], undefined);
    expect(stats).not.toHaveProperty("followerCount");
    expect(stats).not.toHaveProperty("followingCount");
  });

  it("visibility.heatmap=false → heatmapData 为 undefined", async () => {
    const hiddenProfile = { ...profile, visibility: { ...profile.visibility, heatmap: false } };
    const stats = await buildPublicStats("alice", hiddenProfile, [], [], [], undefined);
    expect(stats.heatmapData).toBeUndefined();
  });

  it("visibility.radar=false → radarData 为 undefined", async () => {
    const hiddenProfile = { ...profile, visibility: { ...profile.visibility, radar: false } };
    const stats = await buildPublicStats("alice", hiddenProfile, [], [], [], undefined);
    expect(stats.radarData).toBeUndefined();
  });

  it("连续打卡计算正确", async () => {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    const learnLogs: LearnLog[] = [
      { id: "1", planId: "p", nodeId: "k", date: today, duration: 30, type: "learn" },
      { id: "2", planId: "p", nodeId: "k", date: yesterday, duration: 20, type: "review" },
    ];
    const stats = await buildPublicStats("alice", profile, learnLogs, [], [], undefined);
    expect(stats.streakDays).toBe(2);
    expect(stats.totalMinutes).toBe(50);
  });
});
```

- [ ] **Step 2: 实现 `devpath/lib/visualization.ts`**

```typescript
// lib/visualization.ts
// 公开主页数据聚合：从 IndexedDB 聚合学习数据，按隐私设置过滤

import type { PublicProfile, LearnLog, ReviewLog, ReviewCard, KnowledgeNode, LearningPlan } from "./types";
import type { PublicStats } from "./storage/kv";

/**
 * 聚合公开主页统计数据
 * @param username 用户名
 * @param profile 公开主页配置（含 visibility）
 * @param learnLogs 学习日志
 * @param reviewLogs 复习日志
 * @param cards FSRS 卡片（用于雷达图）
 * @param currentTopic 当前学习主题（如公开则展示）
 *
 * 隐私：followerCount / followingCount 永不出现在 PublicStats
 */
export async function buildPublicStats(
  username: string,
  profile: PublicProfile,
  learnLogs: LearnLog[],
  reviewLogs: ReviewLog[],
  cards: ReviewCard[],
  currentTopic: string | undefined,
): Promise<PublicStats> {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  // 连续打卡：从今天往前数，连续有 learnLog 的天数
  const datesSet = new Set(learnLogs.map((l) => l.date));
  let streakDays = 0;
  const cursor = new Date(today);
  while (datesSet.has(cursor.toISOString().slice(0, 10))) {
    streakDays++;
    cursor.setDate(cursor.getDate() - 1);
  }

  const totalMinutes = learnLogs.reduce((sum, l) => sum + l.duration, 0);

  const stats: PublicStats = {
    username,
    streakDays,
    totalMinutes,
    updatedAt: new Date().toISOString(),
  };

  // 隐私过滤
  if (profile.visibility.currentTopic && currentTopic) {
    stats.currentTopic = currentTopic;
  }

  if (profile.visibility.heatmap) {
    const byDate = new Map<string, number>();
    for (const l of learnLogs) {
      byDate.set(l.date, (byDate.get(l.date) ?? 0) + l.duration);
    }
    stats.heatmapData = Array.from(byDate.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  if (profile.visibility.radar) {
    // 雷达图：按 nodeId 聚合掌握度
    const nodeMap = new Map<string, { sum: number; count: number }>();
    for (const c of cards) {
      const cur = nodeMap.get(c.nodeId) ?? { sum: 0, count: 0 };
      // 掌握度映射：stability 越大掌握度越高，stability 0-30 映射 0-100
      const mastery = Math.min(100, Math.round((c.stability / 30) * 100));
      cur.sum += mastery;
      cur.count += 1;
      nodeMap.set(c.nodeId, cur);
    }
    stats.radarData = Array.from(nodeMap.entries()).map(([node, v]) => ({
      node,
      value: v.count > 0 ? Math.round(v.sum / v.count) : 0,
    }));
  }

  return stats;
}

/**
 * 从 KnowledgeNode + ReviewCard 计算节点掌握度列表（用于雷达图）
 */
export function aggregateNodeMastery(
  nodes: KnowledgeNode[],
  cards: ReviewCard[],
): Array<{ node: string; value: number }> {
  return nodes.slice(0, 8).map((n) => {
    const nodeCards = cards.filter((c) => c.nodeId === n.id);
    if (nodeCards.length === 0) return { node: n.title, value: n.mastery };
    const avg = nodeCards.reduce((s, c) => s + Math.min(100, Math.round((c.stability / 30) * 100)), 0) / nodeCards.length;
    return { node: n.title, value: Math.round(avg) };
  });
}
```

- [ ] **Step 3: 运行测试确认通过**

```bash
cd devpath && npx vitest run __tests__/visualization.test.ts
```

Expected: PASS，4 个测试全过

- [ ] **Step 4: Commit**

```bash
cd devpath && git add lib/visualization.ts __tests__/visualization.test.ts && git commit -m "feat(viz): buildPublicStats 公开主页聚合 + 隐私过滤 (M5 Task 11)"
```

---

## Task 12: /api/public 路由（Cloudflare Pages Function）

**Files:**
- Create: `devpath/functions/api/public/[username].ts`

- [ ] **Step 1: 实现 `devpath/functions/api/public/[username].ts`**

```typescript
// functions/api/public/[username].ts
// Cloudflare Pages Function（边缘运行时）
// GET：读 KV → 返回 PublicProfile + PublicStats
// PUT：验证身份（简单 token）→ 更新 KV

import { createKVStore } from "../../../lib/storage/kv";
import type { PublicProfile, PublicStats } from "../../../lib/types";

interface PagesEnv {
  KV: KVNamespace;
  PUBLIC_AUTH_TOKEN: string;
}

interface PagesContext {
  request: Request;
  env: PagesEnv;
  params: { username: string };
}

export const onRequestGet: PagesFunction<PagesEnv> = async (context) => {
  const username = context.params.username as string;
  const kv = createKVStore(context.env.KV as unknown as { get: (k: string) => Promise<string | null>; put: (k: string, v: string) => Promise<void> });

  const profile = await kv.getProfile(username);
  if (!profile) {
    return new Response(JSON.stringify({ error: "not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const stats = await kv.getStats(username);
  return new Response(JSON.stringify({ profile, stats }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300", // 5 分钟边缘缓存
    },
  });
};

export const onRequestPut: PagesFunction<PagesEnv> = async (context) => {
  const username = context.params.username as string;
  const authHeader = context.request.headers.get("Authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");

  if (!token || token !== context.env.PUBLIC_AUTH_TOKEN) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const kv = createKVStore(context.env.KV as unknown as { get: (k: string) => Promise<string | null>; put: (k: string, v: string) => Promise<void> });

  const body = (await context.request.json()) as { profile?: Partial<PublicProfile>; stats?: Partial<PublicStats> };

  if (body.profile) {
    const existing = (await kv.getProfile(username)) ?? {
      username,
      displayName: username,
      avatar: undefined,
      bio: "",
      visibility: { radar: true, heatmap: true, currentTopic: true, notes: false },
      followerCount: 0,
      followingCount: 0,
      updatedAt: new Date().toISOString(),
    };
    const merged: PublicProfile = {
      ...existing,
      ...body.profile,
      username, // 防止篡改 username
      updatedAt: new Date().toISOString(),
    };
    await kv.setProfile(merged);
  }

  if (body.stats) {
    await kv.updateStats(username, body.stats);
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
```

- [ ] **Step 2: 创建本地测试 mock 文件 `devpath/__tests__/api-public.test.ts`**

```typescript
import { describe, it, expect } from "vitest";
import { createKVStore } from "../lib/storage/kv";
import type { PublicProfile } from "../lib/types";

// 直接测试 KV 逻辑（Pages Function 本身依赖 Cloudflare 运行时，只测 KV 行为）
describe("api-public (via KV mock)", () => {
  it("模拟 GET 流程：set profile → get 返回", async () => {
    const kv = createKVStore();
    const profile: PublicProfile = {
      username: "alice",
      displayName: "Alice",
      avatar: undefined,
      bio: "learning FE",
      visibility: { radar: true, heatmap: true, currentTopic: true, notes: false },
      followerCount: 0,
      followingCount: 0,
      updatedAt: new Date().toISOString(),
    };
    await kv.setProfile(profile);
    const got = await kv.getProfile("alice");
    expect(got?.displayName).toBe("Alice");
    expect(got?.bio).toBe("learning FE");
  });

  it("模拟 PUT 流程：updateStats 后 getStats 一致", async () => {
    const kv = createKVStore();
    await kv.updateStats("alice", { streakDays: 7, totalMinutes: 210 });
    const stats = await kv.getStats("alice");
    expect(stats?.streakDays).toBe(7);
    expect(stats?.totalMinutes).toBe(210);
  });

  it("GET 不存在用户 → getProfile 返回 null（路由层应转 404）", async () => {
    const kv = createKVStore();
    const got = await kv.getProfile("ghost");
    expect(got).toBeNull();
  });
});
```

- [ ] **Step 3: 运行测试**

```bash
cd devpath && npx vitest run __tests__/api-public.test.ts
```

Expected: PASS，3 个测试全过

- [ ] **Step 4: Commit**

```bash
cd devpath && git add functions/api/public/[username].ts __tests__/api-public.test.ts && git commit -m "feat(api): Cloudflare Pages Function /api/public/[username] GET+PUT (M5 Task 12)"
```

---

## Task 13: /profile 页面（主页设置）

**Files:**
- Create: `devpath/app/profile/page.tsx`

- [ ] **Step 1: 实现 `devpath/app/profile/page.tsx`**

```tsx
"use client";

// app/profile/page.tsx
// 公开主页设置：username/displayName/bio/avatar + 4 个隐私 toggle + 实时预览 + 保存
// 「生成分享图」按钮在 Task 15 加入

import { useState, useEffect } from "react";
import type { PublicProfile } from "@/lib/types";
import { get as dbGet, set as dbSet } from "@/lib/storage/db";
import { ShareCardButton } from "@/lib/share-image";

const STORAGE_KEY = "my:profile";

const defaultProfile: PublicProfile = {
  username: "",
  displayName: "",
  avatar: undefined,
  bio: "",
  visibility: { radar: true, heatmap: true, currentTopic: true, notes: false },
  followerCount: 0,
  followingCount: 0,
  updatedAt: new Date().toISOString(),
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<PublicProfile>(defaultProfile);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await dbGet<PublicProfile>(STORAGE_KEY);
      if (stored) setProfile(stored);
    })();
  }, []);

  function update<K extends keyof PublicProfile>(key: K, value: PublicProfile[K]) {
    setProfile((p) => ({ ...p, [key]: value }));
    setSaved(false);
  }

  function toggleVisibility(key: keyof PublicProfile["visibility"]) {
    setProfile((p) => ({
      ...p,
      visibility: { ...p.visibility, [key]: !p.visibility[key] },
    }));
    setSaved(false);
  }

  async function save() {
    setSaving(true);
    try {
      // 1. 本地存
      await dbSet(STORAGE_KEY, profile);
      // 2. 上传 KV（通过 Pages Function）
      const res = await fetch(`/api/public/${encodeURIComponent(profile.username)}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_PUBLIC_AUTH_TOKEN ?? "dev-token"}`,
        },
        body: JSON.stringify({ profile }),
      });
      if (!res.ok && res.status !== 404) {
        // 静态导出下 /api/public 是 Pages Function，本地无环境时 404 可接受
        console.warn("KV sync skipped:", res.status);
      }
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4">
      <h1 className="text-2xl font-bold">公开主页设置</h1>

      <section className="space-y-3 rounded-lg border p-4">
        <h2 className="font-semibold">基本信息</h2>
        <div>
          <label className="block text-sm font-medium">用户名（URL 标识）</label>
          <input
            value={profile.username}
            onChange={(e) => update("username", e.target.value.replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase())}
            placeholder="alice"
            className="mt-1 w-full rounded border px-2 py-1"
          />
          {profile.username && (
            <p className="mt-1 text-xs text-gray-500">主页地址：/u/{profile.username}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">显示名</label>
          <input
            value={profile.displayName}
            onChange={(e) => update("displayName", e.target.value)}
            className="mt-1 w-full rounded border px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">简介</label>
          <textarea
            value={profile.bio}
            onChange={(e) => update("bio", e.target.value)}
            rows={2}
            className="mt-1 w-full rounded border px-2 py-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">头像 URL（可选）</label>
          <input
            value={profile.avatar ?? ""}
            onChange={(e) => update("avatar", e.target.value || undefined)}
            className="mt-1 w-full rounded border px-2 py-1"
          />
        </div>
      </section>

      <section className="space-y-3 rounded-lg border p-4">
        <h2 className="font-semibold">隐私设置</h2>
        {([
          { key: "radar" as const, label: "能力雷达图" },
          { key: "heatmap" as const, label: "学习热力图" },
          { key: "currentTopic" as const, label: "当前学习主题" },
          { key: "notes" as const, label: "笔记内容" },
        ]).map((item) => (
          <label key={item.key} className="flex items-center justify-between">
            <span className="text-sm">{item.label}</span>
            <input
              type="checkbox"
              checked={profile.visibility[item.key]}
              onChange={() => toggleVisibility(item.key)}
              className="h-5 w-5"
            />
          </label>
        ))}
      </section>

      <section className="space-y-3 rounded-lg border p-4">
        <h2 className="font-semibold">实时预览</h2>
        <div className="rounded bg-gray-50 p-3">
          <div className="flex items-center gap-2">
            {profile.avatar && <img src={profile.avatar} alt="" className="h-8 w-8 rounded-full" />}
            <div>
              <div className="font-medium">{profile.displayName || "(未设置)"}</div>
              <div className="text-xs text-gray-500">@{profile.username || "username"}</div>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">{profile.bio || "(暂无简介)"}</p>
          <div className="mt-2 flex gap-2 text-xs text-gray-500">
            {profile.visibility.radar && <span>📊 雷达图</span>}
            {profile.visibility.heatmap && <span>🔥 热力图</span>}
            {profile.visibility.currentTopic && <span>📚 当前主题</span>}
          </div>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving || !profile.username}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "保存中..." : "保存"}
        </button>
        {saved && <span className="text-sm text-green-600">已保存 ✓</span>}
        {profile.username && <ShareCardButton profile={profile} />}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 类型检查**

```bash
cd devpath && npx tsc --noEmit
```

Expected: 无错误（`ShareCardButton` 在 Task 15 实现，此步如未实现可暂时注释该行；本计划顺序下 Task 15 紧随其后，建议先做 Task 15 再合并）

- [ ] **Step 3: Commit**

```bash
cd devpath && git add app/profile/page.tsx && git commit -m "feat(page): /profile 公开主页设置 + 隐私 toggle + 实时预览 (M5 Task 13)"
```

---

## Task 14: /u/[username] 页面（公开主页访客视角）

**Files:**
- Create: `devpath/app/u/[username]/page.tsx`

- [ ] **Step 1: 实现 `devpath/app/u/[username]/page.tsx`**

```tsx
"use client";

// app/u/[username]/page.tsx
// 公开学习主页（访客视角）
// 静态导出约束：用 client component + useParams 读 username
// 数据从 /api/public/[username] (Pages Function) 拉取

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Heatmap } from "@/components/Heatmap";
import { RadarChart } from "@/components/RadarChart";
import type { PublicProfile } from "@/lib/types";
import type { PublicStats } from "@/lib/storage/kv";
import { set as dbSet, get as dbGet } from "@/lib/storage/db";
import { nanoid } from "nanoid";

interface PublicResponse {
  profile: PublicProfile;
  stats: PublicStats | null;
  planSnapshot?: { topic: string; knowledgeTree: unknown[]; questions: unknown[] };
}

export default function PublicProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params?.username ?? "";
  const [data, setData] = useState<PublicResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!username) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/public/${encodeURIComponent(username)}`);
        if (res.status === 404) {
          setError("用户不存在");
          return;
        }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as PublicResponse;
        setData(json);
      } catch (e) {
        setError(e instanceof Error ? e.message : "加载失败");
      } finally {
        setLoading(false);
      }
    })();
  }, [username]);

  async function copyPlan() {
    if (!data?.planSnapshot) return;
    const newPlanId = nanoid();
    await dbSet(`plan:${newPlanId}`, {
      id: newPlanId,
      topic: data.planSnapshot.topic,
      knowledgeTree: data.planSnapshot.knowledgeTree,
      questions: data.planSnapshot.questions,
      schedule: [],
      dailyMinutes: 30,
      maxNewPerDay: 2,
      fsrsMode: "standard",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function follow() {
    // 简化版：本地记录关注列表
    const list = (await dbGet<string[]>("my:following")) ?? [];
    if (data && !list.includes(data.profile.username)) {
      list.push(data.profile.username);
      await dbSet("my:following", list);
      alert(`已关注 ${data.profile.displayName}`);
    }
  }

  if (loading) return <div className="p-8 text-gray-500">加载中...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!data) return null;

  const { profile, stats } = data;

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4">
      <header className="flex items-center gap-4">
        {profile.avatar && <img src={profile.avatar} alt="" className="h-16 w-16 rounded-full" />}
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{profile.displayName}</h1>
          <p className="text-sm text-gray-500">@{profile.username}</p>
          {profile.bio && <p className="mt-1 text-sm text-gray-700">{profile.bio}</p>}
        </div>
        <button
          onClick={follow}
          className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
        >
          🙏 关注 ta
        </button>
      </header>

      <section className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats?.streakDays ?? 0}</div>
          <div className="text-xs text-gray-500">连续打卡天</div>
        </div>
        <div className="rounded-lg border p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats?.totalMinutes ?? 0}</div>
          <div className="text-xs text-gray-500">总学习分钟</div>
        </div>
      </section>

      {profile.visibility.currentTopic && stats?.currentTopic && (
        <section className="rounded-lg border p-4">
          <h2 className="mb-1 font-semibold">当前学习主题</h2>
          <p className="text-sm text-gray-700">{stats.currentTopic}</p>
        </section>
      )}

      {profile.visibility.radar && stats?.radarData && (
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-semibold">能力雷达图</h2>
          <RadarChart nodes={[]} cards={[]} logs={[]} stats={stats.radarData.map((d) => ({
            nodeId: d.node,
            title: d.node,
            mastery: d.value,
            accuracy: d.value,
            practice: d.value,
            activity: d.value,
            frequency: d.value,
          }))} />
        </section>
      )}

      {profile.visibility.heatmap && stats?.heatmapData && (
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-semibold">学习热力图</h2>
          <Heatmap
            data={stats.heatmapData.map((d) => ({
              date: d.date,
              count: d.count,
              level: d.count >= 60 ? 4 : d.count >= 30 ? 3 : d.count >= 15 ? 2 : d.count > 0 ? 1 : 0,
            }))}
            weeks={12}
          />
        </section>
      )}

      {data.planSnapshot && (
        <section className="rounded-lg border p-4">
          <h2 className="mb-2 font-semibold">学习计划</h2>
          <p className="mb-2 text-sm text-gray-700">{data.planSnapshot.topic}</p>
          <button
            onClick={copyPlan}
            className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
          >
            {copied ? "✓ 已复制到我的计划" : "📋 复制这个计划"}
          </button>
        </section>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 添加静态导出 fallback 配置 `devpath/public/_routes.json`**

```json
{
  "version": 1,
  "include": ["/api/*"],
  "exclude": ["/u/*", "/_next/static/*"]
}
```

> 说明：Cloudflare Pages 静态导出下，`/u/*` 由静态 SPA 兜底（Pages 自动 fallback 到 200.html/index.html），动态参数由客户端 `useParams()` 解析。

- [ ] **Step 3: 类型检查**

```bash
cd devpath && npx tsc --noEmit
```

Expected: 无错误

- [ ] **Step 4: Commit**

```bash
cd devpath && git add app/u/[username]/page.tsx public/_routes.json && git commit -m "feat(page): /u/[username] 公开主页访客视角 + 复制计划 + 关注 (M5 Task 14)"
```

---

## Task 15: 分享图生成（lib/share-image.ts）

**Files:**
- Create: `devpath/lib/share-image.ts`
- Create: `devpath/components/ShareCardButton.tsx`

- [ ] **Step 1: 安装依赖**

```bash
cd devpath && npm install html-to-image
```

- [ ] **Step 2: 实现 `devpath/lib/share-image.ts`**

```typescript
// lib/share-image.ts
// 用 html-to-image 把隐藏 div 渲染成 PNG 分享图

import { toPng } from "html-to-image";
import type { PublicProfile } from "./types";

interface ShareCardData {
  username: string;
  displayName: string;
  streakDays: number;
  totalMinutes: number;
  heatmapData?: Array<{ date: string; count: number }>;
  radarData?: Array<{ node: string; value: number }>;
}

/**
 * 生成分享图 PNG Blob
 * 1. 创建隐藏 div（fixed + 屏幕外）
 * 2. 渲染用户名 + 打卡天数 + 热力图缩略 + 雷达缩略
 * 3. html-to-image 转 PNG
 * 4. 移除 div，返回 Blob
 */
export async function generateShareCard(data: ShareCardData): Promise<Blob> {
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "600px";
  container.style.padding = "32px";
  container.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  container.style.color = "white";
  container.style.fontFamily = "system-ui, -apple-system, sans-serif";
  container.style.borderRadius = "16px";

  const heatmapGrid = (data.heatmapData ?? []).slice(-49).map((d) => {
    const level = d.count >= 60 ? 4 : d.count >= 30 ? 3 : d.count >= 15 ? 2 : d.count > 0 ? 1 : 0;
    const colors = ["rgba(255,255,255,0.2)", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
    return `<div style="width:14px;height:14px;border-radius:2px;background:${colors[level]};display:inline-block;margin:1px"></div>`;
  }).join("");

  const radarBars = (data.radarData ?? []).slice(0, 5).map((r) => `
    <div style="display:flex;align-items:center;gap:6px;margin:2px 0">
      <span style="width:80px;font-size:11px;opacity:0.9;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${r.node}</span>
      <div style="flex:1;height:6px;background:rgba(255,255,255,0.2);border-radius:3px">
        <div style="width:${r.value}%;height:100%;background:#fbbf24;border-radius:3px"></div>
      </div>
    </div>
  `).join("");

  container.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
      <div style="width:48px;height:48px;border-radius:50%;background:rgba(255,255,255,0.3);display:flex;align-items:center;justify-content:center;font-size:24px">📚</div>
      <div>
        <div style="font-size:22px;font-weight:bold">${escapeHtml(data.displayName)}</div>
        <div style="font-size:13px;opacity:0.8">@${escapeHtml(data.username)}</div>
      </div>
    </div>
    <div style="display:flex;gap:24px;margin-bottom:20px">
      <div>
        <div style="font-size:32px;font-weight:bold">${data.streakDays}</div>
        <div style="font-size:12px;opacity:0.8">连续打卡天</div>
      </div>
      <div>
        <div style="font-size:32px;font-weight:bold">${data.totalMinutes}</div>
        <div style="font-size:12px;opacity:0.8">总学习分钟</div>
      </div>
    </div>
    ${heatmapGrid ? `<div style="margin-bottom:16px"><div style="font-size:12px;opacity:0.8;margin-bottom:4px">近期学习</div><div style="display:flex;flex-wrap:wrap;width:294px">${heatmapGrid}</div></div>` : ""}
    ${radarBars ? `<div><div style="font-size:12px;opacity:0.8;margin-bottom:4px">能力雷达</div>${radarBars}</div>` : ""}
    <div style="margin-top:20px;font-size:11px;opacity:0.6">devpath · AI 驱动的开发者成长 OS</div>
  `;

  document.body.appendChild(container);
  try {
    const blob = await toPng(container, { pixelRatio: 2, cacheBust: true }).then(async (dataUrl) => {
      const res = await fetch(dataUrl);
      return res.blob();
    });
    return blob;
  } finally {
    document.body.removeChild(container);
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c] ?? c));
}
```

- [ ] **Step 3: 实现 `devpath/components/ShareCardButton.tsx`**

```tsx
"use client";

// components/ShareCardButton.tsx
// 「生成分享图」按钮：聚合数据 → 调 generateShareCard → 触发下载

import { useState } from "react";
import { generateShareCard } from "@/lib/share-image";
import { get as dbGet, keys, getMany } from "@/lib/storage/db";
import type { PublicProfile, LearnLog, ReviewCard } from "@/lib/types";

interface Props {
  profile: PublicProfile;
}

export function ShareCardButton({ profile }: Props) {
  const [generating, setGenerating] = useState(false);

  async function handleClick() {
    setGenerating(true);
    try {
      // 聚合数据
      const logKeys = await keys("log:");
      const learnLogs = await getMany<LearnLog>(logKeys);
      const cardKeys = await keys("card:");
      const cards = await getMany<ReviewCard>(cardKeys);

      const datesSet = new Set(learnLogs.map((l) => l.date));
      let streakDays = 0;
      const cursor = new Date();
      while (datesSet.has(cursor.toISOString().slice(0, 10))) {
        streakDays++;
        cursor.setDate(cursor.getDate() - 1);
      }
      const totalMinutes = learnLogs.reduce((s, l) => s + l.duration, 0);

      const heatmapData = learnLogs.reduce((acc: Array<{ date: string; count: number }>, l) => {
        const existing = acc.find((x) => x.date === l.date);
        if (existing) existing.count += l.duration;
        else acc.push({ date: l.date, count: l.duration });
        return acc;
      }, []);

      const radarData = profile.visibility.radar
        ? cards.slice(0, 5).map((c) => ({
            node: c.nodeId,
            value: Math.min(100, Math.round((c.stability / 30) * 100)),
          }))
        : undefined;

      const blob = await generateShareCard({
        username: profile.username,
        displayName: profile.displayName,
        streakDays,
        totalMinutes,
        heatmapData: profile.visibility.heatmap ? heatmapData : undefined,
        radarData,
      });

      // 触发下载
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `devpath-${profile.username}-${new Date().toISOString().slice(0, 10)}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={generating}
      className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-50"
    >
      {generating ? "生成中..." : "🖼️ 生成分享图"}
    </button>
  );
}
```

- [ ] **Step 4: 类型检查**

```bash
cd devpath && npx tsc --noEmit
```

Expected: 无错误（Task 13 引用的 `ShareCardButton` 现已存在）

- [ ] **Step 5: Commit**

```bash
cd devpath && git add lib/share-image.ts components/ShareCardButton.tsx package.json package-lock.json && git commit -m "feat(share): generateShareCard PNG 分享图 + ShareCardButton (M5 Task 15)"
```

---

# M6: Cloudflare Pages 部署 + 推广准备（Week 9-10）

## Task 16: Cloudflare Pages 配置

**Files:**
- Modify: `devpath/next.config.js`
- Create: `devpath/wrangler.toml`
- Create: `devpath/pages.config.json`

- [ ] **Step 1: 修改 `devpath/next.config.js`**

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // 静态导出下，未预渲染的动态路由走 SPA fallback
  trailingSlash: true,
  // Cloudflare Pages Functions 在 functions/ 目录，需排除在 Next 构建外
  experimental: {
    // 关闭 Server Actions（静态导出不支持）
    serverActions: false,
  },
};

module.exports = nextConfig;
```

- [ ] **Step 2: 创建 `devpath/wrangler.toml`**

```toml
# wrangler.toml
# Cloudflare Pages 本地开发 + KV binding 配置
# 本地运行：npx wrangler pages dev out --kv KV

name = "devpath"
compatibility_date = "2026-07-13"
pages_build_output_dir = "out"

[[kv_namespaces]]
binding = "KV"
id = "your-kv-namespace-id"
preview_id = "your-preview-kv-namespace-id"

[vars]
PUBLIC_AUTH_TOKEN = "dev-token-change-in-prod"
```

- [ ] **Step 3: 创建 `devpath/pages.config.json`**

```json
{
  "name": "devpath",
  "buildCommand": "npm run build",
  "buildOutputDirectory": "out",
  "environmentVariables": {
    "AI_PROVIDER": "glm",
    "NEXT_PUBLIC_PUBLIC_AUTH_TOKEN": "dev-token-change-in-prod"
  },
  "kvNamespaces": [
    {
      "binding": "KV",
      "name": "devpath-kv"
    }
  ],
  "routes": [
    { "pattern": "/u/*", "handle": "static-routing" }
  ]
}
```

- [ ] **Step 4: 静态导出测试**

```bash
cd devpath && npm run build && npx serve out -l 3001
```

Expected: 构建生成 `out/` 目录，serve 启动后访问 http://localhost:3001 能打开首页

- [ ] **Step 5: Commit**

```bash
cd devpath && git add next.config.js wrangler.toml pages.config.json && git commit -m "feat(deploy): Cloudflare Pages 配置（静态导出 + KV binding）(M6 Task 16)"
```

---

## Task 17: AI API 端点默认国内

**Files:**
- Modify: `devpath/lib/ai/provider.ts`
- Modify: `devpath/.env.local.example`

- [ ] **Step 1: 修改 `devpath/lib/ai/provider.ts`（在 MVP 基础上调整默认端点）**

```typescript
// lib/ai/provider.ts
// 多 AI provider 切换，默认 GLM 国内端点（零梯子可达）
// 通过环境变量 AI_PROVIDER 切换：glm | deepseek | openai | mimo

import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

export type AIProvider = "glm" | "deepseek" | "openai" | "mimo";

export const AI_PROVIDER: AIProvider = (process.env.AI_PROVIDER as AIProvider) ?? "glm";

const ENDPOINTS: Record<AIProvider, { baseURL: string; apiKeyEnv: string; model: string }> = {
  glm: {
    baseURL: "https://open.bigmodel.cn/api/paas/v4",
    apiKeyEnv: "GLM_API_KEY",
    model: "glm-4-flash",
  },
  deepseek: {
    baseURL: "https://api.deepseek.com/v1",
    apiKeyEnv: "DEEPSEEK_API_KEY",
    model: "deepseek-chat",
  },
  openai: {
    baseURL: "https://api.openai.com/v1",
    apiKeyEnv: "OPENAI_API_KEY",
    model: "gpt-4o-mini",
  },
  mimo: {
    baseURL: "https://api.mimo.xiaomi.com/v1",
    apiKeyEnv: "MIMO_API_KEY",
    model: "mimo-v1",
  },
};

let cachedModel: LanguageModel | null = null;

export function getModel(): LanguageModel {
  if (cachedModel) return cachedModel;
  const cfg = ENDPOINTS[AI_PROVIDER];
  const apiKey = process.env[cfg.apiKeyEnv];
  if (!apiKey) {
    throw new Error(`Missing ${cfg.apiKeyEnv}. Set AI_PROVIDER and the corresponding key in .env.local`);
  }
  const openai = createOpenAI({ baseURL: cfg.baseURL, apiKey });
  cachedModel = openai(cfg.model);
  return cachedModel;
}

export function hasAIKey(): boolean {
  const cfg = ENDPOINTS[AI_PROVIDER];
  return Boolean(process.env[cfg.apiKeyEnv]);
}

/** 用于测试：重置缓存 */
export function _resetModelCache() {
  cachedModel = null;
}
```

- [ ] **Step 2: 创建/更新 `devpath/.env.local.example`**

```bash
# AI Provider 配置（默认 GLM 国内端点）
# 任选一个，把对应 key 填到 .env.local

# === GLM（默认，国内可达，免费额度） ===
AI_PROVIDER=glm
GLM_API_KEY=your-glm-api-key

# === DeepSeek（国内可达） ===
# AI_PROVIDER=deepseek
# DEEPSEEK_API_KEY=your-deepseek-api-key

# === 小米 MiMo（国内可达） ===
# AI_PROVIDER=mimo
# MIMO_API_KEY=your-mimo-api-key

# === OpenAI（需梯子） ===
# AI_PROVIDER=openai
# OPENAI_API_KEY=your-openai-api-key

# === 公开主页认证 token（访客 PUT 时需带） ===
NEXT_PUBLIC_PUBLIC_AUTH_TOKEN=dev-token-change-in-prod
PUBLIC_AUTH_TOKEN=dev-token-change-in-prod
```

- [ ] **Step 3: 验证（无 key 时降级路径正常）**

```bash
cd devpath && npx vitest run __tests__/status-enhance.test.ts __tests__/energy-pattern.test.ts __tests__/weekly-report.test.ts
```

Expected: 全部 PASS（这些测试 mock 了 hasAIKey=false，走降级分支）

- [ ] **Step 4: Commit**

```bash
cd devpath && git add lib/ai/provider.ts .env.local.example && git commit -m "feat(ai): provider 默认 GLM 国内端点 + 多 provider 切换 (M6 Task 17)"
```

---

## Task 18: 首次引导流程（/onboarding）

**Files:**
- Create: `devpath/app/onboarding/page.tsx`

- [ ] **Step 1: 实现 `devpath/app/onboarding/page.tsx`**

```tsx
"use client";

// app/onboarding/page.tsx
// 3 步引导：1.主题 → 2.每日量 → 3.AI key（可选）
// 完成后跳转 /learn 触发首个计划生成

import { useState } from "react";
import { useRouter } from "next/navigation";
import { set as dbSet } from "@/lib/storage/db";

const EXAMPLE_TOPICS = [
  "前端性能优化高频面试题",
  "React 基础与进阶",
  "TypeScript 类型系统",
  "算法基础（数组/链表/树）",
  "系统设计入门",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [topic, setTopic] = useState("");
  const [dailyMinutes, setDailyMinutes] = useState(30);
  const [maxNewPerDay, setMaxNewPerDay] = useState(2);
  const [aiKey, setAiKey] = useState("");
  const [saving, setSaving] = useState(false);

  async function finish() {
    setSaving(true);
    try {
      await dbSet("my:onboarding", {
        topic,
        dailyMinutes,
        maxNewPerDay,
        fsrsMode: "standard",
        hasAIKey: aiKey.length > 0,
        completedAt: new Date().toISOString(),
      });
      if (aiKey) {
        // 提示用户在 .env.local 配置（浏览器无法写文件系统）
        // 这里仅记入 IndexedDB，实际生效需用户在部署时配 env
        await dbSet("my:aiky-hint", aiKey ? "user-provided-key-in-settings" : "");
      }
      router.push("/learn");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-6 p-4">
      <h1 className="text-2xl font-bold">欢迎使用 devpath</h1>
      <div className="flex gap-2 text-xs text-gray-500">
        <span className={step >= 1 ? "text-blue-600" : ""}>1. 主题</span>
        <span>→</span>
        <span className={step >= 2 ? "text-blue-600" : ""}>2. 学习量</span>
        <span>→</span>
        <span className={step >= 3 ? "text-blue-600" : ""}>3. AI key（可选）</span>
      </div>

      {step === 1 && (
        <section className="space-y-3">
          <label className="block font-medium">你想学什么？</label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="如：前端性能优化高频面试题"
            className="w-full rounded border px-3 py-2"
          />
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_TOPICS.map((t) => (
              <button
                key={t}
                onClick={() => setTopic(t)}
                className="rounded-full border px-3 py-1 text-xs hover:bg-gray-50"
              >
                {t}
              </button>
            ))}
          </div>
          <button
            disabled={!topic.trim()}
            onClick={() => setStep(2)}
            className="w-full rounded-lg bg-blue-600 py-2 text-white disabled:opacity-50"
          >
            下一步
          </button>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-4">
          <div>
            <label className="block font-medium">每日学习量：{dailyMinutes} 分钟</label>
            <input
              type="range"
              min={15}
              max={120}
              step={5}
              value={dailyMinutes}
              onChange={(e) => setDailyMinutes(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>15min</span>
              <span>120min</span>
            </div>
          </div>
          <div>
            <label className="block font-medium">每日新内容数：{maxNewPerDay} 个</label>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={maxNewPerDay}
              onChange={(e) => setMaxNewPerDay(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>1 个</span>
              <span>5 个</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep(1)} className="rounded-lg border px-4 py-2">
              上一步
            </button>
            <button
              onClick={() => setStep(3)}
              className="flex-1 rounded-lg bg-blue-600 py-2 text-white"
            >
              下一步
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="space-y-3">
          <label className="block font-medium">AI API Key（可选）</label>
          <p className="text-sm text-gray-600">
            留空则使用预设模板（5 套常见主题），填入可解锁 AI 拆知识树 + 面试题生成。
            支持 GLM / DeepSeek / OpenAI。
          </p>
          <input
            value={aiKey}
            onChange={(e) => setAiKey(e.target.value)}
            placeholder="sk-..."
            type="password"
            className="w-full rounded border px-3 py-2"
          />
          <p className="text-xs text-gray-500">
            * 浏览器内不存储 key 明文，部署时请在 Cloudflare Pages 环境变量配置。
          </p>
          <div className="flex gap-2">
            <button onClick={() => setStep(2)} className="rounded-lg border px-4 py-2">
              上一步
            </button>
            <button
              onClick={finish}
              disabled={saving}
              className="flex-1 rounded-lg bg-green-600 py-2 text-white disabled:opacity-50"
            >
              {saving ? "保存中..." : "开始学习 →"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 类型检查**

```bash
cd devpath && npx tsc --noEmit
```

Expected: 无错误

- [ ] **Step 3: Commit**

```bash
cd devpath && git add app/onboarding/page.tsx && git commit -m "feat(page): /onboarding 3 步引导流程 (M6 Task 18)"
```

---

## Task 19: PWA 完善

**Files:**
- Create: `devpath/public/manifest.json`
- Create: `devpath/public/sw.js`
- Modify: `devpath/app/layout.tsx`（添加 manifest link + SW 注册，如 MVP 已有则只补 SW 注册）

- [ ] **Step 1: 创建 `devpath/public/manifest.json`**

```json
{
  "name": "devpath - AI 驱动的开发者成长 OS",
  "short_name": "devpath",
  "description": "告诉 AI 你想学什么，它给你拆知识树、排学习计划、生面试题、按遗忘曲线复习",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "shortcuts": [
    { "name": "今日学习", "url": "/", "icons": [{ "src": "/icons/icon-192.png", "sizes": "192x192" }] },
    { "name": "复习", "url": "/review", "icons": [{ "src": "/icons/icon-192.png", "sizes": "192x192" }] },
    { "name": "数据", "url": "/stats", "icons": [{ "src": "/icons/icon-192.png", "sizes": "192x192" }] }
  ]
}
```

> 说明：图标文件 `public/icons/icon-192.png` 和 `icon-512.png` 需用户提供；占位可暂用任意 192/512 PNG。

- [ ] **Step 2: 创建 `devpath/public/sw.js`**

```javascript
// public/sw.js
// Service Worker：缓存静态资源 + 离线 fallback 到首页
// 采用 stale-while-revalidate 策略

const CACHE_NAME = "devpath-v1";
const STATIC_ASSETS = ["/", "/learn", "/review", "/stats", "/manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  // 只处理 GET
  if (event.request.method !== "GET") return;
  // API 请求不缓存
  if (url.pathname.startsWith("/api/")) return;

  // 静态资源：stale-while-revalidate
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const fetchPromise = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === "basic") {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached ?? caches.match("/"));
      return cached ?? fetchPromise;
    })
  );
});
```

- [ ] **Step 3: 在 `devpath/app/layout.tsx` 中添加 manifest link + SW 注册（在 `<head>` 与 `<body>` 内补）**

在 `<head>` 内 `<meta>` 标签附近添加：

```tsx
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#2563eb" />
```

在 `<body>` 末尾（或客户端组件挂载时）添加 SW 注册脚本（用 `useEffect` 避免阻塞）：

```tsx
<script
  dangerouslySetInnerHTML={{
    __html: `if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((e) => console.warn('SW reg failed:', e));
      });
    }`,
  }}
/>
```

> 若 MVP 的 `layout.tsx` 已有结构，仅在对应位置追加以上三段即可，不重写整个文件。

- [ ] **Step 4: 离线缓存测试**

```bash
cd devpath && npm run build && npx serve out -l 3001
```

打开 http://localhost:3001 → DevTools → Application → Service Workers 确认 SW 已注册 → Network 切换 Offline → 刷新首页，应仍能打开（离线缓存命中）。

Expected: 离线下首页可加载

- [ ] **Step 5: Commit**

```bash
cd devpath && git add public/manifest.json public/sw.js app/layout.tsx && git commit -m "feat(pwa): manifest + service worker 离线缓存 (M6 Task 19)"
```

---

## Task 20: README + 推广物料

**Files:**
- Create: `devpath/README.md`

- [ ] **Step 1: 创建 `devpath/README.md`**

````markdown
# devpath — AI 驱动的开发者成长 OS

> 告诉 AI 你想学什么，它给你拆知识树、排学习计划、生面试题、按遗忘曲线复习。

[![demo screenshot](./docs/screenshot.png)](https://devpath.pages.dev)

## ✨ 核心亮点

1. **AI 学习教练**：输入主题 → AI 拆知识树（5-30 节点）→ 每节点生成面试题 + 参考答案 → 拓扑排序排学习计划
2. **FSRS 遗忘曲线**：ts-fsrs 算法自动安排复习，比 Anki 的 SM-2 准 20%
3. **能量感知调量**：每日状态评估 → AI 动态调整学习量（状态差减量/只复习）
4. **公开学习主页**：可分享学习轨迹，热力图 + 雷达图 + 打卡，社交驱动坚持

## 🚀 Quick Start（本地开发）

```bash
git clone https://github.com/yourname/devpath.git
cd devpath
npm install
cp .env.local.example .env.local  # 填入 AI key（可选，留空用预设模板）
npm run dev
```

打开 http://localhost:3000，首次访问会进入 `/onboarding` 引导。

## ☁️ 部署 Cloudflare Pages

### 1. 创建 KV Namespace

```bash
npx wrangler kv:namespace create devpath-kv
```

记下返回的 `id`，填入 `wrangler.toml`。

### 2. 构建静态导出

```bash
npm run build  # 生成 out/ 目录
```

### 3. 部署

```bash
# 方式 A: wrangler CLI
npx wrangler pages deploy out --project-name devpath

# 方式 B: Cloudflare Dashboard 连接 GitHub 仓库
# Build command: npm run build
# Build output directory: out
```

### 4. 配置环境变量

在 Cloudflare Pages 项目设置 → Environment variables 添加：

| 变量 | 值 | 说明 |
|------|-----|------|
| `AI_PROVIDER` | `glm` | 默认国内端点 |
| `GLM_API_KEY` | `your-key` | GLM API Key |
| `PUBLIC_AUTH_TOKEN` | `random-string` | 公开主页 PUT 认证 token |
| `NEXT_PUBLIC_PUBLIC_AUTH_TOKEN` | 同上 | 前端可见版本 |

### 5. 绑定 KV

Pages 项目 → Settings → Functions → KV namespace bindings → 添加 `KV` → `devpath-kv`。

## 🔧 环境变量

| 变量 | 必填 | 默认 | 说明 |
|------|------|------|------|
| `AI_PROVIDER` | 否 | `glm` | `glm` / `deepseek` / `openai` / `mimo` |
| `GLM_API_KEY` | 否* | — | GLM key（默认 provider） |
| `DEEPSEEK_API_KEY` | 否 | — | DeepSeek key |
| `OPENAI_API_KEY` | 否 | — | OpenAI key（需梯子） |
| `PUBLIC_AUTH_TOKEN` | 是 | — | 公开主页写入认证 |
| `NEXT_PUBLIC_PUBLIC_AUTH_TOKEN` | 是 | — | 前端版本同上 |

\* 不填任何 AI key 时降级为预设模板（5 套常见主题），仍可使用。

## 🛠 技术栈

| 层 | 技术 |
|----|------|
| 框架 | Next.js 14 App Router（静态导出）|
| 语言 | TypeScript |
| 样式 | Tailwind CSS + shadcn/ui |
| AI | Vercel AI SDK + GLM-4-flash（默认国内） |
| 间隔重复 | ts-fsrs |
| 本地存储 | idb-keyval（IndexedDB） |
| 云端存储 | Cloudflare KV（公开主页） |
| 可视化 | react-activity-calendar + recharts |
| 分享图 | html-to-image |
| 部署 | Cloudflare Pages（边缘节点，国内零梯子） |

## 📦 项目结构

```
devpath/
├── app/                    # Next.js App Router 页面
├── components/             # React 组件
├── lib/
│   ├── ai/                 # AI provider + 知识树/题目/周报/状态增强
│   ├── storage/            # IndexedDB + Cloudflare KV
│   ├── fsrs.ts             # FSRS 间隔重复
│   ├── schedule.ts         # 学习计划编排
│   ├── status.ts           # 能量感知调量
│   ├── visualization.ts    # 公开主页数据聚合
│   └── share-image.ts      # 分享图生成
├── functions/              # Cloudflare Pages Functions
│   └── api/public/[username].ts
├── public/                 # 静态资源 + PWA manifest + sw.js
└── __tests__/              # Vitest 单元测试
```

## 🤝 贡献

欢迎 Issue / PR。开发流程：

1. Fork → 新建分支 `feat/your-feature`
2. `npm test` 确保测试通过
3. PR 描述变更与动机

## 📄 License

MIT
````

- [ ] **Step 2: Commit**

```bash
cd devpath && git add README.md && git commit -m "docs: README + 部署文档 + 技术栈说明 (M6 Task 20)"
```

---

## 推广物料：Demo 视频脚本（5 分钟）

> 这部分作为 README 附录或单独文档，不创建文件，仅供拍摄参考。

| 时段 | 画面 | 旁白 |
|------|------|------|
| 0:00-0:30 | 打开 devpath，进入 /onboarding | "介绍 devpath：AI 拆知识树 + FSRS 复习 + 能量感知 + 公开主页" |
| 0:30-1:30 | 输入主题"前端性能优化"，AI 拆出 12 个节点 | "30 秒内 AI 拆解知识树，每个节点都有面试题和参考答案" |
| 1:30-2:30 | 进入 /learn/[planId]，展示知识树 + 拖拽排序 | "可拖拽调整学习顺序，AI 自动检测依赖冲突" |
| 2:30-3:15 | /review 复习卡片，评分后 FSRS 排期 | "ts-fsrs 算法比 Anki 的 SM-2 准 20%，自动安排下次复习" |
| 3:15-3:45 | 首页状态评估（极简版 1 click），今日计划自动减量 | "状态差时只复习不学新，避免硬撑放弃" |
| 3:45-4:30 | /stats 热力图 + 雷达图 + 周报 | "数据可视化，AI 周报分析模式 + 给建议" |
| 4:30-5:00 | /profile 生成分享图 + /u/alice 公开主页 | "一键生成分享图，公开主页自带传播属性" |

---

## 全局验证（M3-M6 完成后）

- [ ] **Step 1: 跑全部测试**

```bash
cd devpath && npx vitest run
```

Expected: 所有测试 PASS（status / status-enhance / api-status / energy-pattern / weekly-report / kv / visualization / api-public + MVP 测试）

- [ ] **Step 2: 完整构建**

```bash
cd devpath && npm run build
```

Expected: `out/` 目录生成，无错误

- [ ] **Step 3: 本地预览 + 手动 E2E 走查**

```bash
cd devpath && npx serve out -l 3000
```

走查清单：
- /onboarding 3 步引导完成 → 跳转 /learn
- /learn 输入主题 → 生成计划（无 AI key 走预设模板）
- /review 复习一张卡片 → FSRS 排期
- 首页状态评估（极简版）→ 今日计划调整
- /stats 热力图/雷达图/周报 Tab 切换正常
- /profile 设置 username + 保存（本地存）
- /u/[username] 公开主页（需 KV 数据，本地走 mock）
- /profile 生成分享图下载 PNG

- [ ] **Step 4: 部署 Cloudflare Pages 验证**

```bash
cd devpath && npx wrangler pages deploy out --project-name devpath
```

访问 https://devpath.pages.dev 走查核心流程。

---

## 任务依赖图

```
M3 Task 1 (status.ts)
  ├─→ Task 2 (status-enhance.ts)
  ├─→ Task 3 (/api/status) ← 依赖 Task 1+2
  ├─→ Task 4 (StatusAssessment 组件) ← 依赖 Task 3
  └─→ Task 5 (energy-pattern.ts) ← 独立，依赖 provider

M4 Task 6 (Heatmap) ← 独立
  Task 7 (RadarChart) ← 独立
  Task 8 (weekly-report + /api/weekly) ← 独立
  Task 9 (/stats) ← 依赖 Task 6+7+8

M5 Task 10 (kv.ts) ← 独立
  Task 11 (visualization.ts) ← 依赖 Task 10 的 PublicStats 类型
  Task 12 (Pages Function) ← 依赖 Task 10
  Task 13 (/profile) ← 依赖 Task 15 (ShareCardButton)
  Task 14 (/u/[username]) ← 依赖 Task 6+7+12
  Task 15 (share-image) ← 独立

M6 Task 16 (Cloudflare 配置) ← 独立，但建议最后做
  Task 17 (provider 默认国内) ← 独立
  Task 18 (/onboarding) ← 独立
  Task 19 (PWA) ← 独立
  Task 20 (README) ← 最后做
```

**建议执行顺序**：1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11 → 12 → 15 → 13 → 14 → 17 → 18 → 19 → 16 → 20

（Task 15 在 Task 13 前做，因为 /profile 引用了 ShareCardButton；Task 16 部署配置最后做；Task 20 README 收尾。）

---

## 里程碑验收标准

| 阶段 | 验收 |
|------|------|
| M3 完成 | 状态评估三形态可用 + 4 分支调量测试通过 + AI 增强降级正常 + 能量模式识别输出 7 维数组 |
| M4 完成 | 热力图渲染 + 雷达图 5 维度切换 + AI 周报含三段式 + /stats Tab 切换 |
| M5 完成 | KV mock 测试通过 + 公开主页 GET/PUT + 隐私过滤生效（followerCount 不外泄）+ 分享图 PNG 下载 |
| M6 完成 | `output: "export"` 构建成功 + 离线可访问 + onboarding 流程跑通 + README 完整 + Cloudflare Pages 部署可访问 |

---

**计划文档结束。** 共 20 个任务，覆盖 M3-M6 全部功能。每个任务独立可 commit，所有代码完整给出，测试可运行。

