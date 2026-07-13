# devpath MVP Implementation Plan (M1-M2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 搭建 devpath 基础设施 + 实现 AI 学习教练（知识树拆解+面试题生成）+ FSRS 间隔重复复习，形成可独立使用的 MVP。

**Architecture:** Next.js 14 App Router + TypeScript + Tailwind，部署 Cloudflare Pages。本地 IndexedDB 存储为主，AI 通过 Vercel AI SDK 调用 GLM/DeepSeek。8 模块边界清晰，TDD 开发。

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Vercel AI SDK (ai + @ai-sdk/openai), ts-fsrs, idb-keyval, Vitest, Playwright

**Spec:** [docs/superpowers/specs/2026-07-13-devpath-design.md](../specs/2026-07-13-devpath-design.md)

---

## 文件结构

```
devpath/
├── app/
│   ├── layout.tsx
│   ├── page.tsx              # 首页 dashboard
│   ├── globals.css
│   ├── learn/
│   │   ├── page.tsx          # AI 学习教练入口
│   │   └── [planId]/page.tsx # 计划详情
│   ├── review/page.tsx       # 今日复习
│   ├── favorites/page.tsx    # 收藏夹
│   ├── api/
│   │   ├── learn/route.ts
│   │   ├── review/route.ts
│   │   └── favorite/route.ts
│   └── stats/page.tsx        # 统计占位
├── components/
│   ├── Nav.tsx
│   ├── KnowledgeTree.tsx
│   ├── QuestionCard.tsx
│   ├── ReviewCardView.tsx
│   └── StatusCard.tsx
├── lib/
│   ├── types.ts
│   ├── time.ts
│   ├── ai/
│   │   ├── provider.ts
│   │   ├── knowledge.ts
│   │   ├── question.ts
│   │   └── templates.ts
│   ├── storage/
│   │   └── db.ts
│   ├── fsrs.ts
│   ├── schedule.ts
│   └── favorite.ts
├── __tests__/
│   ├── smoke.test.ts
│   ├── types.test.ts
│   ├── db.test.ts
│   ├── knowledge.test.ts
│   ├── question.test.ts
│   ├── schedule.test.ts
│   ├── fsrs.test.ts
│   └── favorite.test.ts
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── postcss.config.js
├── vitest.config.ts
├── next-env.d.ts
├── .env.local.example
├── .gitignore
└── README.md
```

---

## Task 1: 项目脚手架 + tsconfig + Tailwind

**Files:**
- Create: `devpath/package.json`
- Create: `devpath/tsconfig.json`
- Create: `devpath/next.config.js`
- Create: `devpath/tailwind.config.ts`
- Create: `devpath/postcss.config.js`
- Create: `devpath/vitest.config.ts`
- Create: `devpath/next-env.d.ts`
- Create: `devpath/.gitignore`
- Create: `devpath/.env.local.example`
- Create: `devpath/app/layout.tsx`
- Create: `devpath/app/globals.css`
- Create: `devpath/app/page.tsx`
- Create: `devpath/lib/time.ts`
- Create: `devpath/__tests__/smoke.test.ts`

### Steps

- [ ] **Step 1: 创建 `devpath/package.json`**

```json
{
  "name": "devpath",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "next": "^14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "ai": "^3.4.0",
    "@ai-sdk/openai": "^0.0.66",
    "ts-fsrs": "^4.5.0",
    "idb-keyval": "^6.2.1",
    "nanoid": "^5.0.7",
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "@types/node": "^20.14.0",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.5.0",
    "tailwindcss": "^3.4.4",
    "postcss": "^8.4.39",
    "autoprefixer": "^10.4.19",
    "vitest": "^1.6.0",
    "@vitejs/plugin-react": "^4.3.1",
    "jsdom": "^24.1.0",
    "fake-indexeddb": "^6.0.0"
  }
}
```

- [ ] **Step 2: 创建 `devpath/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "vitest.config.ts"]
}
```

- [ ] **Step 3: 创建 `devpath/next.config.js`**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages 静态导出（M6 部署时设 NEXT_PUBLIC_STATIC_EXPORT=true）
  // M1-M2 开发期保持 undefined 以支持 API routes（output: 'export' 与 API routes 不兼容）
  output: process.env.NEXT_PUBLIC_STATIC_EXPORT === "true" ? "export" : undefined,
};
module.exports = nextConfig;
```

- [ ] **Step 4: 创建 `devpath/tailwind.config.ts`**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
```

- [ ] **Step 5: 创建 `devpath/postcss.config.js`**

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 6: 创建 `devpath/vitest.config.ts`**

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

- [ ] **Step 7: 创建 `devpath/next-env.d.ts`**

```typescript
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
```

- [ ] **Step 8: 创建 `devpath/.gitignore`**

```gitignore
/node_modules
/.next
/out
/build
*.tsbuildinfo
next-env.d.ts.bak
.env.local
.env*.local
*.log
.DS_Store
```

- [ ] **Step 9: 创建 `devpath/.env.local.example`**

```bash
# AI Provider: glm | deepseek | mimo | custom
AI_PROVIDER=glm

# API Key（三选一，按 provider 填）
GLM_API_KEY=your_glm_key
DEEPSEEK_API_KEY=your_deepseek_key
MIMO_API_KEY=your_mimo_key

# 或通用配置（优先级最高）
# AI_API_URL=https://open.bigmodel.cn/api/paas/v4
# AI_MODEL=glm-4-flash
# AI_API_KEY=your_key

# Cloudflare Pages 静态导出（M6 部署用）
# NEXT_PUBLIC_STATIC_EXPORT=true
```

- [ ] **Step 10: 创建 `devpath/app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body {
  max-width: 100vw;
  overflow-x: hidden;
  -webkit-tap-highlight-color: transparent;
}
```

- [ ] **Step 11: 创建 `devpath/app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "devpath — AI 驱动的开发者成长 OS",
  description: "告诉 AI 你想学什么，它给你拆知识树、排学习计划、生面试题、按遗忘曲线复习",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-50 text-gray-900 min-h-screen pb-16">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 12: 创建 `devpath/app/page.tsx`（临时占位，Task 16 替换为 dashboard）**

```tsx
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-2">devpath</h1>
      <p className="text-gray-500">AI 驱动的开发者成长 OS</p>
      <a href="/learn" className="mt-8 px-6 py-3 bg-black text-white rounded-lg font-medium">
        开始学习
      </a>
    </div>
  );
}
```

- [ ] **Step 13: 创建 `devpath/lib/time.ts`（从根目录复制，Asia/Shanghai 时区工具）**

```typescript
// lib/time.ts
// 固定使用中国时区（Asia/Shanghai, UTC+8）
// 不受浏览器/系统/代理时区影响

const TZ = "Asia/Shanghai";

function formatParts(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date);
}

function get(parts: ReturnType<typeof formatParts>, type: string): string {
  return parts.find((p) => p.type === type)?.value || "";
}

// 中国时区当前日期 "YYYY-MM-DD"
export function chinaDateNow(): string {
  const parts = formatParts(new Date());
  return `${get(parts, "year")}-${get(parts, "month")}-${get(parts, "day")}`;
}

// 中国时区当前时间 "HH:MM"
export function chinaTimeNow(): string {
  const parts = formatParts(new Date());
  return `${get(parts, "hour")}:${get(parts, "minute")}`;
}

// 中国时区今天的年/月/日（month 0-based，便于传给 new Date）
export function chinaTodayParts(): { year: number; month: number; day: number } {
  const parts = formatParts(new Date());
  return {
    year: +get(parts, "year"),
    month: +get(parts, "month") - 1,
    day: +get(parts, "day"),
  };
}

// 把 "YYYY-MM-DD" 推移 n 天（n 可为负），返回新日期字符串
export function chinaDateShift(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  const yy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

// 当前 ISO 时间戳
export function nowISO(): string {
  return new Date().toISOString();
}
```

- [ ] **Step 14: 创建 `devpath/__tests__/smoke.test.ts`（验证 vitest 工作）**

```typescript
import { describe, it, expect } from "vitest";
import { chinaDateNow, chinaDateShift, nowISO } from "../lib/time";

describe("smoke test", () => {
  it("vitest 正常运行", () => {
    expect(1 + 1).toBe(2);
  });

  it("chinaDateNow 返回 YYYY-MM-DD 格式", () => {
    const date = chinaDateNow();
    expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("chinaDateShift 正确推移日期", () => {
    expect(chinaDateShift("2026-07-13", 1)).toBe("2026-07-14");
    expect(chinaDateShift("2026-07-13", -1)).toBe("2026-07-12");
    expect(chinaDateShift("2026-01-01", -1)).toBe("2025-12-31");
  });

  it("nowISO 返回 ISO 字符串", () => {
    expect(nowISO()).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });
});
```

- [ ] **Step 15: 安装依赖并运行测试**

```bash
cd /workspace/devpath && npm install && npx vitest run
```

- [ ] **Step 16: Commit**

```bash
cd /workspace && git add devpath/ && git commit -m "devpath: Task 1 - 项目脚手架 + tsconfig + Tailwind + vitest"
```

---

## Task 2: 类型定义（lib/types.ts）

**Files:**
- Create: `devpath/lib/types.ts`
- Create: `devpath/__tests__/types.test.ts`

### Steps

- [ ] **Step 1: 创建 `devpath/lib/types.ts`**

```typescript
// lib/types.ts
// devpath 全部数据模型（对应 spec Data Model）

// 学习计划
export interface LearningPlan {
  id: string;
  topic: string;
  knowledgeTree: KnowledgeNode[];
  questions: Question[];
  schedule: ScheduleItem[];
  dailyMinutes: number;
  maxNewPerDay: number;
  fsrsMode: "conservative" | "standard" | "aggressive";
  createdAt: string;
  updatedAt: string;
}

// 知识节点
export interface KnowledgeNode {
  id: string;
  title: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  prerequisites: string[];
  frequency: "高" | "中" | "低";
  summary: string;
  mastery: number;
  customOrder?: number;
}

// 面试题
export interface Question {
  id: string;
  nodeId: string;
  question: string;
  answer: string;
  keyPoints: string[];
  followUps: string[];
  codeSnippet?: string;
  favorited: boolean;
  favoritedAt?: string;
}

// 试题集收藏
export interface FavoriteDeck {
  id: string;
  planId: string;
  topic: string;
  questionIds: string[];
  questionCount: number;
  favoritedAt: string;
  questions: Question[];
  knowledgeTree: KnowledgeNode[];
}

// 学习计划项
export interface ScheduleItem {
  day: number;
  nodeId: string;
  type: "learn" | "review";
  cardId?: string;
  estimatedMinutes: number;
  completed: boolean;
  completedAt?: string;
}

// FSRS 复习卡片
export interface ReviewCard {
  id: string;
  planId: string;
  nodeId: string;
  questionId: string;
  front: string;
  back: string;
  due: string;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  state: 0 | 1 | 2 | 3 | 4;
  lastReview: string;
}

// 每日状态
export interface DailyStatus {
  date: string;
  energy: 1 | 2 | 3 | 4 | 5;
  mood: "good" | "neutral" | "bad";
  availableMinutes: number;
  aiAdjustedLoad: number;
  actualMinutes: number;
}

// 复习日志
export interface ReviewLog {
  id: string;
  cardId: string;
  date: string;
  rating: 1 | 2 | 3 | 4;
  elapsedDays: number;
  stateBefore: number;
  stateAfter: number;
}

// 学习日志
export interface LearnLog {
  id: string;
  planId: string;
  nodeId: string;
  date: string;
  duration: number;
  type: "learn" | "review";
}

// 公开主页
export interface PublicProfile {
  username: string;
  displayName: string;
  avatar?: string;
  bio: string;
  visibility: {
    radar: boolean;
    heatmap: boolean;
    currentTopic: boolean;
    notes: boolean;
  };
  followerCount: number;
  followingCount: number;
  updatedAt: string;
}

// 能量模式
export interface EnergyPattern {
  weekStart: string;
  avgEnergyByWeekday: number[];
  insights: string[];
  recommendations: string[];
}

// FSRS 评分
export type Rating = 1 | 2 | 3 | 4; // Again / Hard / Good / Easy

// IndexedDB key 前缀常量
export const KEY_PREFIXES = {
  PLAN: "plan:",
  CARD: "card:",
  DECK: "favorite_deck:",
  REVIEW_LOG: "review_log:",
  LEARN_LOG: "learn_log:",
  STATUS: "status:",
} as const;
```

- [ ] **Step 2: 创建 `devpath/__tests__/types.test.ts`**

```typescript
import { describe, it, expect } from "vitest";
import type { LearningPlan, KnowledgeNode, Question, ReviewCard } from "../lib/types";

describe("types", () => {
  it("LearningPlan 对象符合类型定义", () => {
    const plan: LearningPlan = {
      id: "plan-1",
      topic: "前端性能优化",
      knowledgeTree: [
        {
          id: "k1",
          title: "浏览器渲染原理",
          difficulty: 2,
          prerequisites: [],
          frequency: "高",
          summary: "DOM/CSSOM/Render Tree 流程",
          mastery: 0,
        },
      ],
      questions: [
        {
          id: "q1",
          nodeId: "k1",
          question: "请解释浏览器的关键渲染路径",
          answer: "结论：浏览器渲染分五步…",
          keyPoints: ["DOM 树构建", "CSSOM 构建", "渲染树合成"],
          followUps: ["什么是 reflow？"],
          favorited: false,
        },
      ],
      schedule: [
        { day: 1, nodeId: "k1", type: "learn", estimatedMinutes: 16, completed: false },
        { day: 2, nodeId: "k1", type: "review", estimatedMinutes: 5, completed: false },
      ],
      dailyMinutes: 30,
      maxNewPerDay: 1,
      fsrsMode: "standard",
      createdAt: "2026-07-13T00:00:00.000Z",
      updatedAt: "2026-07-13T00:00:00.000Z",
    };
    expect(plan.id).toBe("plan-1");
    expect(plan.knowledgeTree).toHaveLength(1);
    expect(plan.questions[0].keyPoints).toHaveLength(3);
    expect(plan.schedule).toHaveLength(2);
    expect(plan.fsrsMode).toBe("standard");
  });

  it("KnowledgeNode difficulty 限定 1-5", () => {
    const node: KnowledgeNode = {
      id: "k1",
      title: "test",
      difficulty: 3,
      prerequisites: [],
      frequency: "中",
      summary: "",
      mastery: 50,
    };
    expect(node.difficulty).toBeGreaterThanOrEqual(1);
    expect(node.difficulty).toBeLessThanOrEqual(5);
  });

  it("ReviewCard state 限定 0-4", () => {
    const card: ReviewCard = {
      id: "c1",
      planId: "p1",
      nodeId: "k1",
      questionId: "q1",
      front: "问题",
      back: "答案",
      due: "2026-07-13T00:00:00.000Z",
      stability: 1.0,
      difficulty: 5.0,
      elapsedDays: 0,
      scheduledDays: 1,
      reps: 1,
      lapses: 0,
      state: 2,
      lastReview: "2026-07-13T00:00:00.000Z",
    };
    expect(card.state).toBeGreaterThanOrEqual(0);
    expect(card.state).toBeLessThanOrEqual(4);
  });

  it("Question favorited 默认 false", () => {
    const q: Question = {
      id: "q1",
      nodeId: "k1",
      question: "test",
      answer: "answer",
      keyPoints: [],
      followUps: [],
      favorited: false,
    };
    expect(q.favorited).toBe(false);
    expect(q.favoritedAt).toBeUndefined();
  });
});
```

- [ ] **Step 3: 运行测试**

```bash
cd /workspace/devpath && npx vitest run __tests__/types.test.ts
```

- [ ] **Step 4: Commit**

```bash
cd /workspace && git add devpath/ && git commit -m "devpath: Task 2 - 类型定义 lib/types.ts"
```

---

## Task 3: IndexedDB 存储层（lib/storage/db.ts）

**Files:**
- Create: `devpath/lib/storage/db.ts`
- Create: `devpath/__tests__/db.test.ts`

### Steps

- [ ] **Step 1: 创建 `devpath/lib/storage/db.ts`**

```typescript
// lib/storage/db.ts
// IndexedDB 最简封装（via idb-keyval）
// 提供泛型 get/set/del/keys 方法

import { get, set, del, keys } from "idb-keyval";

export async function getItem<T>(key: string): Promise<T | undefined> {
  return get<T>(key);
}

export async function setItem<T>(key: string, value: T): Promise<void> {
  return set(key, value);
}

export async function delItem(key: string): Promise<void> {
  return del(key);
}

export async function listKeys(prefix?: string): Promise<string[]> {
  const allKeys = await keys();
  const strKeys = allKeys.filter((k): k is string => typeof k === "string");
  if (prefix) {
    return strKeys.filter((k) => k.startsWith(prefix));
  }
  return strKeys;
}

export async function listItems<T>(prefix: string): Promise<T[]> {
  const matchedKeys = await listKeys(prefix);
  const items = await Promise.all(matchedKeys.map((k) => get<T>(k)));
  return items.filter((item): item is T => item !== undefined);
}
```

- [ ] **Step 2: 创建 `devpath/__tests__/db.test.ts`**

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import "fake-indexeddb/auto";
import { getItem, setItem, delItem, listKeys, listItems } from "../lib/storage/db";
import type { LearningPlan } from "../lib/types";

describe("db", () => {
  beforeEach(async () => {
    // 清理：删除所有以 "plan:" 开头的 key
    const keys = await listKeys("plan:");
    for (const k of keys) {
      await delItem(k);
    }
  });

  it("写入 LearningPlan 后能读回，字段一致", async () => {
    const plan: LearningPlan = {
      id: "test-1",
      topic: "前端性能",
      knowledgeTree: [],
      questions: [],
      schedule: [],
      dailyMinutes: 30,
      maxNewPerDay: 1,
      fsrsMode: "standard",
      createdAt: "2026-07-13T00:00:00.000Z",
      updatedAt: "2026-07-13T00:00:00.000Z",
    };
    await setItem("plan:test-1", plan);
    const read = await getItem<LearningPlan>("plan:test-1");
    expect(read).toBeDefined();
    expect(read!.id).toBe("test-1");
    expect(read!.topic).toBe("前端性能");
    expect(read!.dailyMinutes).toBe(30);
    expect(read!.fsrsMode).toBe("standard");
  });

  it("删除后读回 undefined", async () => {
    await setItem("plan:test-2", { id: "test-2" });
    await delItem("plan:test-2");
    const read = await getItem("plan:test-2");
    expect(read).toBeUndefined();
  });

  it("listKeys 按前缀过滤", async () => {
    await setItem("plan:a", { id: "a" });
    await setItem("plan:b", { id: "b" });
    await setItem("card:c", { id: "c" });
    const planKeys = await listKeys("plan:");
    expect(planKeys).toContain("plan:a");
    expect(planKeys).toContain("plan:b");
    expect(planKeys).not.toContain("card:c");
  });

  it("listItems 返回前缀匹配的所有值", async () => {
    await setItem("plan:x", { id: "x", topic: "X" });
    await setItem("plan:y", { id: "y", topic: "Y" });
    const items = await listItems<{ id: string; topic: string }>("plan:");
    expect(items).toHaveLength(2);
    const topics = items.map((i) => i.topic);
    expect(topics).toContain("X");
    expect(topics).toContain("Y");
  });

  it("未存储的 key 返回 undefined", async () => {
    const read = await getItem("nonexistent:key");
    expect(read).toBeUndefined();
  });
});
```

- [ ] **Step 3: 运行测试**

```bash
cd /workspace/devpath && npx vitest run __tests__/db.test.ts
```

- [ ] **Step 4: Commit**

```bash
cd /workspace && git add devpath/ && git commit -m "devpath: Task 3 - IndexedDB 存储层 lib/storage/db.ts"
```

---

## Task 4: AI SDK 集成 + Provider 配置（lib/ai/provider.ts）

**Files:**
- Create: `devpath/lib/ai/provider.ts`
- Create: `devpath/__tests__/provider.test.ts`

### Steps

- [ ] **Step 1: 创建 `devpath/lib/ai/provider.ts`**

```typescript
// lib/ai/provider.ts
// Vercel AI SDK Provider 配置
// 支持 GLM / DeepSeek / MiMo / 自定义（均兼容 OpenAI 格式）

import { createOpenAI } from "@ai-sdk/openai";
import type { LanguageModel } from "ai";

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
  if (!apiKey) {
    throw new Error(
      "AI API Key 未配置：请设置 AI_API_KEY 或对应 provider 的 key 环境变量"
    );
  }

  return { baseURL, model, apiKey };
}

export function createAIProvider(): LanguageModel {
  const { baseURL, model, apiKey } = resolveConfig();
  const openai = createOpenAI({ baseURL, apiKey });
  return openai(model);
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
```

- [ ] **Step 2: 创建 `devpath/__tests__/provider.test.ts`**

```typescript
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

describe("provider", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env = { ...originalEnv };
    delete process.env.AI_PROVIDER;
    delete process.env.AI_API_KEY;
    delete process.env.AI_API_URL;
    delete process.env.AI_MODEL;
    delete process.env.GLM_API_KEY;
    delete process.env.DEEPSEEK_API_KEY;
    delete process.env.MIMO_API_KEY;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("默认使用 GLM provider", async () => {
    process.env.GLM_API_KEY = "test-glm-key";
    const { getProviderInfo } = await import("../lib/ai/provider");
    const info = getProviderInfo();
    expect(info.provider).toBe("glm");
    expect(info.model).toBe("glm-4-flash");
    expect(info.baseURL).toBe("https://open.bigmodel.cn/api/paas/v4");
  });

  it("DeepSeek provider 配置正确", async () => {
    process.env.AI_PROVIDER = "deepseek";
    process.env.DEEPSEEK_API_KEY = "test-ds-key";
    const { getProviderInfo } = await import("../lib/ai/provider");
    const info = getProviderInfo();
    expect(info.provider).toBe("deepseek");
    expect(info.model).toBe("deepseek-chat");
    expect(info.baseURL).toBe("https://api.deepseek.com/v1");
  });

  it("MiMo provider 配置正确", async () => {
    process.env.AI_PROVIDER = "mimo";
    process.env.MIMO_API_KEY = "test-mimo-key";
    const { getProviderInfo } = await import("../lib/ai/provider");
    const info = getProviderInfo();
    expect(info.provider).toBe("mimo");
    expect(info.model).toBe("mimo-v2-pro");
    expect(info.baseURL).toBe("https://api.xiaomimimo.com/v1");
  });

  it("通用 AI_API_URL/AI_MODEL 优先级最高", async () => {
    process.env.AI_PROVIDER = "glm";
    process.env.GLM_API_KEY = "test-key";
    process.env.AI_API_URL = "https://custom.api.com/v1";
    process.env.AI_MODEL = "custom-model";
    const { getProviderInfo } = await import("../lib/ai/provider");
    const info = getProviderInfo();
    expect(info.baseURL).toBe("https://custom.api.com/v1");
    expect(info.model).toBe("custom-model");
  });

  it("无 API Key 时抛错", async () => {
    process.env.AI_PROVIDER = "glm";
    const { createAIProvider } = await import("../lib/ai/provider");
    expect(() => createAIProvider()).toThrow(/AI API Key/);
  });

  it("createAIProvider 返回有 doGenerate 方法的 model 对象", async () => {
    process.env.AI_PROVIDER = "glm";
    process.env.GLM_API_KEY = "test-key";
    const { createAIProvider } = await import("../lib/ai/provider");
    const model = createAIProvider();
    expect(model).toBeDefined();
    expect(typeof model.doGenerate).toBe("function");
  });
});
```

- [ ] **Step 3: 运行测试**

```bash
cd /workspace/devpath && npx vitest run __tests__/provider.test.ts
```

- [ ] **Step 4: Commit**

```bash
cd /workspace && git add devpath/ && git commit -m "devpath: Task 4 - AI SDK Provider 配置 lib/ai/provider.ts"
```

---

## Task 5: 知识树拆解（lib/ai/knowledge.ts + templates.ts）

**Files:**
- Create: `devpath/lib/ai/templates.ts`
- Create: `devpath/lib/ai/knowledge.ts`
- Create: `devpath/__tests__/knowledge.test.ts`

### Steps

- [ ] **Step 1: 创建 `devpath/lib/ai/templates.ts`（5 套降级模板）**

```typescript
// lib/ai/templates.ts
// AI 拆解失败时的降级预设模板（5 套常见主题，每套 8 节点）

import type { KnowledgeNode } from "../types";

export const FALLBACK_TEMPLATES: Record<string, KnowledgeNode[]> = {
  前端性能: [
    { id: "k1", title: "浏览器渲染原理与关键渲染路径", difficulty: 2, prerequisites: [], frequency: "高", summary: "DOM/CSSOM/Render Tree/Layout/Paint/Composite 流程", mastery: 0 },
    { id: "k2", title: "重排(Reflow)与重绘(Repaint)优化", difficulty: 3, prerequisites: ["k1"], frequency: "高", summary: "减少 reflow/repaint，使用 transform/opacity 替代几何属性", mastery: 0 },
    { id: "k3", title: "资源加载优化（preload/prefetch/懒加载）", difficulty: 2, prerequisites: ["k1"], frequency: "高", summary: "关键资源 preload，非关键 prefetch，图片懒加载", mastery: 0 },
    { id: "k4", title: "代码分割与按需加载", difficulty: 3, prerequisites: ["k3"], frequency: "中", summary: "动态 import()、React.lazy、路由级分割", mastery: 0 },
    { id: "k5", title: "图片优化（WebP/AVIF/响应式）", difficulty: 2, prerequisites: ["k3"], frequency: "中", summary: "现代图片格式、srcset、picture 标签", mastery: 0 },
    { id: "k6", title: "JS 执行优化（防抖/节流/Web Worker）", difficulty: 3, prerequisites: ["k1"], frequency: "中", summary: "减少主线程阻塞，耗时任务移入 Worker", mastery: 0 },
    { id: "k7", title: "缓存策略（HTTP 缓存/Service Worker/CDN）", difficulty: 4, prerequisites: ["k3"], frequency: "高", summary: "强缓存/协商缓存、SW 离线缓存、CDN 边缘缓存", mastery: 0 },
    { id: "k8", title: "Core Web Vitals 与性能指标", difficulty: 3, prerequisites: ["k1", "k2"], frequency: "高", summary: "LCP/FID/CLS/INP 指标优化与测量", mastery: 0 },
  ],
  React基础: [
    { id: "k1", title: "JSX 本质与 React.createElement", difficulty: 1, prerequisites: [], frequency: "高", summary: "JSX 编译为 createElement 调用", mastery: 0 },
    { id: "k2", title: "React 组件生命周期", difficulty: 2, prerequisites: ["k1"], frequency: "高", summary: "mount/update/unmount 三阶段", mastery: 0 },
    { id: "k3", title: "Hooks 基础（useState/useEffect）", difficulty: 2, prerequisites: ["k1"], frequency: "高", summary: "状态管理与副作用处理", mastery: 0 },
    { id: "k4", title: "Hooks 进阶（useMemo/useCallback/useRef）", difficulty: 3, prerequisites: ["k3"], frequency: "中", summary: "性能优化与引用稳定性", mastery: 0 },
    { id: "k5", title: "React diff 算法与 key 属性", difficulty: 3, prerequisites: ["k1"], frequency: "高", summary: "虚拟 DOM 同层比较，key 的作用", mastery: 0 },
    { id: "k6", title: "Fiber 架构与时间切片", difficulty: 4, prerequisites: ["k5"], frequency: "中", summary: "可中断渲染、优先级调度", mastery: 0 },
    { id: "k7", title: "Context 与状态管理", difficulty: 3, prerequisites: ["k3"], frequency: "中", summary: "Context API、跨组件数据传递", mastery: 0 },
    { id: "k8", title: "React 性能优化策略", difficulty: 4, prerequisites: ["k4", "k5"], frequency: "高", summary: "memo/懒加载/虚拟列表", mastery: 0 },
  ],
  TypeScript: [
    { id: "k1", title: "基础类型与类型注解", difficulty: 1, prerequisites: [], frequency: "高", summary: "string/number/boolean/数组/元组", mastery: 0 },
    { id: "k2", title: "接口(Interface)与类型别名(Type Alias)", difficulty: 2, prerequisites: ["k1"], frequency: "高", summary: "对象形状定义，interface vs type", mastery: 0 },
    { id: "k3", title: "泛型(Generic)", difficulty: 3, prerequisites: ["k1", "k2"], frequency: "高", summary: "可复用类型组件，泛型约束", mastery: 0 },
    { id: "k4", title: "联合类型与交叉类型", difficulty: 2, prerequisites: ["k1"], frequency: "中", summary: "| 和 & 操作符", mastery: 0 },
    { id: "k5", title: "类型守卫与类型收窄", difficulty: 3, prerequisites: ["k4"], frequency: "中", summary: "typeof/instanceof/in/自定义守卫", mastery: 0 },
    { id: "k6", title: "映射类型与条件类型", difficulty: 4, prerequisites: ["k3", "k4"], frequency: "中", summary: "Partial/Required/Pick/Omit/Record", mastery: 0 },
    { id: "k7", title: "工具类型(Utility Types)", difficulty: 2, prerequisites: ["k2"], frequency: "高", summary: "内置工具类型使用", mastery: 0 },
    { id: "k8", title: "装饰器与元数据", difficulty: 4, prerequisites: ["k3"], frequency: "低", summary: "类装饰器、方法装饰器、reflect-metadata", mastery: 0 },
  ],
  算法基础: [
    { id: "k1", title: "时间复杂度与空间复杂度", difficulty: 1, prerequisites: [], frequency: "高", summary: "Big-O 表示法，常见复杂度排序", mastery: 0 },
    { id: "k2", title: "数组与双指针", difficulty: 2, prerequisites: ["k1"], frequency: "高", summary: "快慢指针、左右指针", mastery: 0 },
    { id: "k3", title: "链表操作", difficulty: 2, prerequisites: ["k1"], frequency: "高", summary: "反转、合并、环检测", mastery: 0 },
    { id: "k4", title: "栈与队列", difficulty: 2, prerequisites: ["k1"], frequency: "中", summary: "LIFO/FIFO、单调栈", mastery: 0 },
    { id: "k5", title: "二叉树遍历与递归", difficulty: 3, prerequisites: ["k1"], frequency: "高", summary: "前/中/后/层序遍历", mastery: 0 },
    { id: "k6", title: "排序算法", difficulty: 3, prerequisites: ["k2"], frequency: "高", summary: "快排/归并/堆排", mastery: 0 },
    { id: "k7", title: "二分查找", difficulty: 3, prerequisites: ["k2"], frequency: "中", summary: "有序数组查找、边界处理", mastery: 0 },
    { id: "k8", title: "动态规划入门", difficulty: 4, prerequisites: ["k5"], frequency: "中", summary: "状态转移方程、经典 DP 题", mastery: 0 },
  ],
  系统设计: [
    { id: "k1", title: "系统设计基础流程", difficulty: 2, prerequisites: [], frequency: "高", summary: "需求分析→容量估算→架构设计→详细设计", mastery: 0 },
    { id: "k2", title: "负载均衡", difficulty: 3, prerequisites: ["k1"], frequency: "高", summary: "L4/L7 LB、常见算法、Nginx/HAProxy", mastery: 0 },
    { id: "k3", title: "缓存策略", difficulty: 3, prerequisites: ["k1"], frequency: "高", summary: "Cache-aside/Write-through/Write-back", mastery: 0 },
    { id: "k4", title: "数据库分片与复制", difficulty: 4, prerequisites: ["k1"], frequency: "中", summary: "主从复制、读写分离、分库分表", mastery: 0 },
    { id: "k5", title: "消息队列", difficulty: 4, prerequisites: ["k1"], frequency: "中", summary: "Kafka/RabbitMQ、异步解耦", mastery: 0 },
    { id: "k6", title: "微服务架构", difficulty: 4, prerequisites: ["k2"], frequency: "中", summary: "服务拆分、注册发现、API 网关", mastery: 0 },
    { id: "k7", title: "CDN 与边缘缓存", difficulty: 3, prerequisites: ["k3"], frequency: "中", summary: "静态资源加速、动态加速", mastery: 0 },
    { id: "k8", title: "高可用与容灾", difficulty: 4, prerequisites: ["k2", "k4"], frequency: "高", summary: "多活/灾备/降级/熔断", mastery: 0 },
  ],
};

const TEMPLATE_KEYS = Object.keys(FALLBACK_TEMPLATES);

export function getFallbackTemplate(topic: string): KnowledgeNode[] {
  // 模糊匹配主题
  for (const key of TEMPLATE_KEYS) {
    if (topic.includes(key) || key.includes(topic)) {
      return FALLBACK_TEMPLATES[key].map((n) => ({ ...n }));
    }
  }
  // 默认返回前端性能模板
  return FALLBACK_TEMPLATES["前端性能"].map((n) => ({ ...n }));
}

export function listTemplateTopics(): string[] {
  return TEMPLATE_KEYS;
}
```

- [ ] **Step 2: 创建 `devpath/lib/ai/knowledge.ts`**

```typescript
// lib/ai/knowledge.ts
// 知识树拆解：调用 LLM 生成 KnowledgeNode[]
// 失败重试 2 次，最终降级到预设模板

import { generateObject } from "ai";
import { z } from "zod";
import { createAIProvider } from "./provider";
import { getFallbackTemplate } from "./templates";
import type { KnowledgeNode } from "../types";

const SYSTEM_PROMPT = `你是技术学习专家。把用户给的学习主题拆解成知识节点。
要求：
1. 每个节点是一个可独立学习的最小知识单元
2. 标注节点间的依赖关系
3. 评估难度 1-5
4. 按面试出现频率排序
5. 节点数量由主题复杂度自行决定，不限制数量（简单主题 5-8 个，复杂主题可达 20-30 个）
6. 输出严格 JSON`;

const nodeSchema = z.object({
  id: z.string().describe("节点 ID，格式 k1, k2, ..."),
  title: z.string().describe("知识点标题"),
  difficulty: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]),
  prerequisites: z.array(z.string()).describe("依赖的节点 id 列表"),
  frequency: z.union([z.literal("高"), z.literal("中"), z.literal("低")]),
  summary: z.string().describe("一句话知识点摘要"),
});

const treeSchema = z.object({
  topic: z.string(),
  nodes: z.array(nodeSchema),
});

export async function decomposeKnowledge(topic: string): Promise<KnowledgeNode[]> {
  try {
    const result = await withRetry(
      () =>
        generateObject({
          model: createAIProvider(),
          schema: treeSchema,
          system: SYSTEM_PROMPT,
          prompt: `请拆解学习主题：${topic}`,
        }),
      2
    );
    return result.object.nodes.map((n) => ({
      ...n,
      mastery: 0,
    }));
  } catch {
    return getFallbackTemplate(topic);
  }
}

async function withRetry<T>(fn: () => Promise<T>, retries: number): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError;
}
```

- [ ] **Step 3: 创建 `devpath/__tests__/knowledge.test.ts`**

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock AI SDK
vi.mock("ai", () => ({
  generateObject: vi.fn(),
}));

// Mock provider
vi.mock("../lib/ai/provider", () => ({
  createAIProvider: vi.fn(() => ({})),
}));

import { generateObject } from "ai";
import { decomposeKnowledge } from "../lib/ai/knowledge";
import { getFallbackTemplate, listTemplateTopics } from "../lib/ai/templates";

describe("knowledge", () => {
  beforeEach(() => {
    vi.mocked(generateObject).mockReset();
  });

  it("AI 返回 3 节点时正确解析", async () => {
    vi.mocked(generateObject).mockResolvedValueOnce({
      object: {
        topic: "测试主题",
        nodes: [
          { id: "k1", title: "节点1", difficulty: 1, prerequisites: [], frequency: "高", summary: "摘要1" },
          { id: "k2", title: "节点2", difficulty: 2, prerequisites: ["k1"], frequency: "中", summary: "摘要2" },
          { id: "k3", title: "节点3", difficulty: 3, prerequisites: ["k1"], frequency: "低", summary: "摘要3" },
        ],
      },
    } as any);

    const nodes = await decomposeKnowledge("测试主题");
    expect(nodes).toHaveLength(3);
    expect(nodes[0].id).toBe("k1");
    expect(nodes[0].mastery).toBe(0);
    expect(nodes[1].prerequisites).toEqual(["k1"]);
    expect(nodes[2].difficulty).toBe(3);
  });

  it("AI 抛错时降级到模板返回 8 节点", async () => {
    vi.mocked(generateObject).mockRejectedValue(new Error("AI 调用失败"));
    const nodes = await decomposeKnowledge("前端性能");
    expect(nodes).toHaveLength(8);
    expect(nodes[0].id).toBe("k1");
    expect(nodes[0].mastery).toBe(0);
  });

  it("AI 第一次失败、第二次成功时返回正确结果", async () => {
    vi.mocked(generateObject)
      .mockRejectedValueOnce(new Error("第一次失败"))
      .mockResolvedValueOnce({
        object: {
          topic: "React",
          nodes: [
            { id: "k1", title: "JSX", difficulty: 1, prerequisites: [], frequency: "高", summary: "JSX 基础" },
          ],
        },
      } as any);

    const nodes = await decomposeKnowledge("React");
    expect(nodes).toHaveLength(1);
    expect(nodes[0].title).toBe("JSX");
  });

  it("getFallbackTemplate 匹配前端性能", () => {
    const nodes = getFallbackTemplate("前端性能优化");
    expect(nodes).toHaveLength(8);
    expect(nodes[0].title).toContain("浏览器渲染");
  });

  it("getFallbackTemplate 未匹配时返回默认模板", () => {
    const nodes = getFallbackTemplate("完全不匹配的主题");
    expect(nodes.length).toBeGreaterThan(0);
  });

  it("listTemplateTopics 返回 5 个主题", () => {
    const topics = listTemplateTopics();
    expect(topics).toHaveLength(5);
    expect(topics).toContain("前端性能");
    expect(topics).toContain("React基础");
    expect(topics).toContain("TypeScript");
    expect(topics).toContain("算法基础");
    expect(topics).toContain("系统设计");
  });
});
```

- [ ] **Step 4: 运行测试**

```bash
cd /workspace/devpath && npx vitest run __tests__/knowledge.test.ts
```

- [ ] **Step 5: Commit**

```bash
cd /workspace && git add devpath/ && git commit -m "devpath: Task 5 - 知识树拆解 lib/ai/knowledge.ts + templates.ts"
```

---

## Task 6: 面试题生成（lib/ai/question.ts）

**Files:**
- Create: `devpath/lib/ai/question.ts`
- Create: `devpath/__tests__/question.test.ts`

### Steps

- [ ] **Step 1: 创建 `devpath/lib/ai/question.ts`**

```typescript
// lib/ai/question.ts
// 面试题生成：对每个 KnowledgeNode 并行生成面试题
// 分批 5 个一组，单节点失败不影响其他

import { generateObject } from "ai";
import { z } from "zod";
import { nanoid } from "nanoid";
import { createAIProvider } from "./provider";
import type { KnowledgeNode, Question } from "../types";

const SYSTEM_PROMPT = `你是资深技术面试官。针对给定知识点生成一道高频面试题。
要求：
1. 题目要考察对知识点的深度理解
2. 答案用三段式：结论 → 展开解释 → 代码示例（200-500 字）
3. keyPoints 3-5 个关键点
4. followUps 2-3 个追问
5. 如果适用，提供 codeSnippet`;

const questionSchema = z.object({
  question: z.string(),
  answer: z.string(),
  keyPoints: z.array(z.string()),
  followUps: z.array(z.string()),
  codeSnippet: z.string().optional(),
});

function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

async function generateOne(node: KnowledgeNode): Promise<Question> {
  try {
    const result = await generateObject({
      model: createAIProvider(),
      schema: questionSchema,
      system: SYSTEM_PROMPT,
      prompt: `知识点：${node.title}\n描述：${node.summary}\n难度：${node.difficulty}\n面试频率：${node.frequency}`,
    });
    return {
      id: nanoid(),
      nodeId: node.id,
      question: result.object.question,
      answer: result.object.answer,
      keyPoints: result.object.keyPoints,
      followUps: result.object.followUps,
      codeSnippet: result.object.codeSnippet,
      favorited: false,
    };
  } catch {
    return {
      id: nanoid(),
      nodeId: node.id,
      question: "生成失败，点击重试",
      answer: "",
      keyPoints: [],
      followUps: [],
      favorited: false,
    };
  }
}

export async function generateQuestions(nodes: KnowledgeNode[]): Promise<Question[]> {
  const batches = chunk(nodes, 5);
  const results: Question[] = [];
  for (const batch of batches) {
    const batchResults = await Promise.all(batch.map(generateOne));
    results.push(...batchResults);
  }
  return results;
}

export async function regenerateQuestion(node: KnowledgeNode): Promise<Question> {
  return generateOne(node);
}

export { chunk };
```

- [ ] **Step 2: 创建 `devpath/__tests__/question.test.ts`**

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("ai", () => ({
  generateObject: vi.fn(),
}));

vi.mock("../lib/ai/provider", () => ({
  createAIProvider: vi.fn(() => ({})),
}));

import { generateObject } from "ai";
import { generateQuestions, chunk } from "../lib/ai/question";
import type { KnowledgeNode } from "../lib/types";

function makeNode(id: string): KnowledgeNode {
  return {
    id,
    title: `知识点 ${id}`,
    difficulty: 2,
    prerequisites: [],
    frequency: "高",
    summary: "摘要",
    mastery: 0,
  };
}

describe("question", () => {
  beforeEach(() => {
    vi.mocked(generateObject).mockReset();
  });

  it("mock 返回 3 题，验证解析", async () => {
    const nodes = [makeNode("k1"), makeNode("k2"), makeNode("k3")];
    vi.mocked(generateObject).mockImplementation(async () => ({
      object: {
        question: `题 ${nodes[vi.mocked(generateObject).mock.calls.length]?.id || "k?"}`,
        answer: "三段式答案",
        keyPoints: ["要点1", "要点2"],
        followUps: ["追问1"],
        codeSnippet: "const x = 1;",
      },
    } as any));

    const questions = await generateQuestions(nodes);
    expect(questions).toHaveLength(3);
    expect(questions[0].nodeId).toBe("k1");
    expect(questions[0].favorited).toBe(false);
    expect(questions[0].keyPoints).toHaveLength(2);
    expect(questions[0].codeSnippet).toBe("const x = 1;");
  });

  it("中间一个抛错，返回 3 题但其中一个 question 是失败标记", async () => {
    const nodes = [makeNode("k1"), makeNode("k2"), makeNode("k3")];
    vi.mocked(generateObject)
      .mockResolvedValueOnce({
        object: { question: "题1", answer: "答1", keyPoints: ["p1"], followUps: ["f1"] },
      } as any)
      .mockRejectedValueOnce(new Error("AI 失败"))
      .mockResolvedValueOnce({
        object: { question: "题3", answer: "答3", keyPoints: ["p3"], followUps: ["f3"] },
      } as any);

    const questions = await generateQuestions(nodes);
    expect(questions).toHaveLength(3);
    expect(questions[0].question).toBe("题1");
    expect(questions[1].question).toBe("生成失败，点击重试");
    expect(questions[1].answer).toBe("");
    expect(questions[2].question).toBe("题3");
  });

  it("chunk 函数正确分批", () => {
    expect(chunk([1, 2, 3, 4, 5, 6, 7], 3)).toEqual([[1, 2, 3], [4, 5, 6], [7]]);
    expect(chunk([1, 2], 5)).toEqual([[1, 2]]);
    expect(chunk([], 3)).toEqual([]);
  });

  it("空节点数组返回空数组", async () => {
    const questions = await generateQuestions([]);
    expect(questions).toEqual([]);
  });
});
```

- [ ] **Step 3: 运行测试**

```bash
cd /workspace/devpath && npx vitest run __tests__/question.test.ts
```

- [ ] **Step 4: Commit**

```bash
cd /workspace && git add devpath/ && git commit -m "devpath: Task 6 - 面试题生成 lib/ai/question.ts"
```

---

## Task 7: 学习计划编排（lib/schedule.ts）

**Files:**
- Create: `devpath/lib/schedule.ts`
- Create: `devpath/__tests__/schedule.test.ts`

### Steps

- [ ] **Step 1: 创建 `devpath/lib/schedule.ts`**

```typescript
// lib/schedule.ts
// 学习计划编排：拓扑排序 + 每日分配
// Step 1: Kahn 算法 BFS，同层按 difficulty 升序
// Step 2: 每日容量 = dailyMinutes - 已安排复习时间
// Step 3: 学完当天加 1 张复习卡（明天到期）

import type { KnowledgeNode, ScheduleItem } from "./types";

// 节点耗时 = difficulty * 8min
export function nodeMinutes(node: KnowledgeNode): number {
  return node.difficulty * 8;
}

// 复习估计时间（分钟）
const REVIEW_MINUTES = 5;

// 拓扑排序（Kahn 算法 BFS，同层按 difficulty 升序）
export function topoSort(nodes: KnowledgeNode[]): KnowledgeNode[] {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const inDegree = new Map(nodes.map((n) => [n.id, 0]));
  const adjList = new Map<string, string[]>(nodes.map((n) => [n.id, []]));

  // 构建有向图
  for (const node of nodes) {
    for (const prereq of node.prerequisites) {
      if (nodeMap.has(prereq)) {
        adjList.get(prereq)!.push(node.id);
        inDegree.set(node.id, (inDegree.get(node.id) || 0) + 1);
      }
    }
  }

  const result: KnowledgeNode[] = [];
  const visited = new Set<string>();

  // 按层处理，每层内按 difficulty 升序
  while (result.length < nodes.length) {
    const layer = nodes
      .filter((n) => !visited.has(n.id) && (inDegree.get(n.id) || 0) === 0)
      .sort((a, b) => a.difficulty - b.difficulty);

    if (layer.length === 0) {
      // 环或缺失依赖，追加剩余节点
      for (const node of nodes) {
        if (!visited.has(node.id)) {
          result.push(node);
          visited.add(node.id);
        }
      }
      break;
    }

    for (const node of layer) {
      visited.add(node.id);
      result.push(node);
    }

    // 递减下一层入度
    for (const node of layer) {
      for (const depId of adjList.get(node.id) || []) {
        inDegree.set(depId, (inDegree.get(depId) || 0) - 1);
      }
    }
  }

  return result;
}

// 每日分配
export function allocateDaily(
  topoSorted: KnowledgeNode[],
  dailyMinutes: number,
  maxNewPerDay: number
): ScheduleItem[] {
  const schedule: ScheduleItem[] = [];
  const reviewMinutesByDay = new Map<number, number>();

  let day = 1;
  let dayNewMinutes = 0;
  let dayNewCount = 0;

  for (const node of topoSorted) {
    const minutes = nodeMinutes(node);
    const reviewToday = reviewMinutesByDay.get(day) || 0;
    const availableForNew = dailyMinutes - reviewToday - dayNewMinutes;
    const fitsToday =
      availableForNew >= minutes && dayNewCount < maxNewPerDay;

    if (!fitsToday && (dayNewCount > 0 || dayNewMinutes > 0)) {
      // 移到下一天
      day++;
      dayNewMinutes = 0;
      dayNewCount = 0;
    }

    // 安排 learn
    schedule.push({
      day,
      nodeId: node.id,
      type: "learn",
      estimatedMinutes: minutes,
      completed: false,
    });
    dayNewMinutes += minutes;
    dayNewCount++;

    // 安排 review（下一天）
    const reviewDay = day + 1;
    schedule.push({
      day: reviewDay,
      nodeId: node.id,
      type: "review",
      estimatedMinutes: REVIEW_MINUTES,
      completed: false,
    });
    reviewMinutesByDay.set(
      reviewDay,
      (reviewMinutesByDay.get(reviewDay) || 0) + REVIEW_MINUTES
    );
  }

  return schedule;
}

// 完整编排：拓扑排序 + 每日分配
export function buildSchedule(
  nodes: KnowledgeNode[],
  dailyMinutes: number,
  maxNewPerDay: number
): ScheduleItem[] {
  return allocateDaily(topoSort(nodes), dailyMinutes, maxNewPerDay);
}
```

- [ ] **Step 2: 创建 `devpath/__tests__/schedule.test.ts`**

```typescript
import { describe, it, expect } from "vitest";
import { topoSort, allocateDaily, nodeMinutes, buildSchedule } from "../lib/schedule";
import type { KnowledgeNode } from "../lib/types";

function makeNode(
  id: string,
  difficulty: 1 | 2 | 3 | 4 | 5 = 2,
  prerequisites: string[] = []
): KnowledgeNode {
  return {
    id,
    title: `节点 ${id}`,
    difficulty,
    prerequisites,
    frequency: "中",
    summary: "",
    mastery: 0,
  };
}

describe("topoSort", () => {
  it("8 节点无依赖，保持原顺序（同层按 difficulty 升序）", () => {
    const nodes = [
      makeNode("k1", 3),
      makeNode("k2", 1),
      makeNode("k3", 2),
      makeNode("k4", 5),
      makeNode("k5", 1),
      makeNode("k6", 4),
      makeNode("k7", 2),
      makeNode("k8", 3),
    ];
    const sorted = topoSort(nodes);
    expect(sorted).toHaveLength(8);
    // 同层按 difficulty 升序
    expect(sorted[0].difficulty).toBe(1);
    expect(sorted[1].difficulty).toBe(1);
    expect(sorted[2].difficulty).toBe(2);
  });

  it("有依赖 k2→k1, k3→k1，k1 排在前面", () => {
    const nodes = [
      makeNode("k1", 2),
      makeNode("k2", 1, ["k1"]),
      makeNode("k3", 3, ["k1"]),
    ];
    const sorted = topoSort(nodes);
    expect(sorted[0].id).toBe("k1");
    expect(sorted.slice(1).map((n) => n.id)).toContain("k2");
    expect(sorted.slice(1).map((n) => n.id)).toContain("k3");
  });

  it("多层依赖：k3→k2→k1", () => {
    const nodes = [
      makeNode("k3", 1, ["k2"]),
      makeNode("k2", 1, ["k1"]),
      makeNode("k1", 1),
    ];
    const sorted = topoSort(nodes);
    const ids = sorted.map((n) => n.id);
    expect(ids.indexOf("k1")).toBeLessThan(ids.indexOf("k2"));
    expect(ids.indexOf("k2")).toBeLessThan(ids.indexOf("k3"));
  });

  it("循环依赖不崩溃，返回所有节点", () => {
    const nodes = [
      makeNode("k1", 1, ["k2"]),
      makeNode("k2", 1, ["k1"]),
    ];
    const sorted = topoSort(nodes);
    expect(sorted).toHaveLength(2);
  });
});

describe("allocateDaily", () => {
  it("8 节点无依赖，dailyMinutes=30，maxNewPerDay=1 → 8 天每天 1 learn + 1 review", () => {
    const nodes = Array.from({ length: 8 }, (_, i) => makeNode(`k${i + 1}`, 1));
    const sorted = topoSort(nodes);
    const schedule = allocateDaily(sorted, 30, 1);
    
    // 8 天 * 2 项（learn + review）= 16 项
    expect(schedule).toHaveLength(16);
    
    // 每天有 1 个 learn
    for (let d = 1; d <= 8; d++) {
      const dayItems = schedule.filter((s) => s.day === d);
      const learnItems = dayItems.filter((s) => s.type === "learn");
      expect(learnItems).toHaveLength(1);
    }
    
    // 每个节点都有 review（在 learn 的下一天）
    const reviewItems = schedule.filter((s) => s.type === "review");
    expect(reviewItems).toHaveLength(8);
  });

  it("有依赖 k2→k1, k3→k1，k1 的 learn 排在前面", () => {
    const nodes = [
      makeNode("k1", 2),
      makeNode("k2", 1, ["k1"]),
      makeNode("k3", 3, ["k1"]),
    ];
    const schedule = buildSchedule(nodes, 30, 1);
    
    const k1Learn = schedule.find((s) => s.nodeId === "k1" && s.type === "learn")!;
    const k2Learn = schedule.find((s) => s.nodeId === "k2" && s.type === "learn")!;
    const k3Learn = schedule.find((s) => s.nodeId === "k3" && s.type === "learn")!;
    
    expect(k1Learn.day).toBeLessThanOrEqual(k2Learn.day);
    expect(k1Learn.day).toBeLessThanOrEqual(k3Learn.day);
  });

  it("dailyMinutes=15，节点 difficulty=3（24min），该节点单独占一天", () => {
    const nodes = [makeNode("k1", 3)];
    const schedule = allocateDaily(nodes, 15, 1);
    
    const learnItem = schedule.find((s) => s.type === "learn")!;
    expect(learnItem.day).toBe(1);
    expect(learnItem.estimatedMinutes).toBe(24);
  });

  it("nodeMinutes = difficulty * 8", () => {
    expect(nodeMinutes(makeNode("k1", 1))).toBe(8);
    expect(nodeMinutes(makeNode("k1", 5))).toBe(40);
    expect(nodeMinutes(makeNode("k1", 3))).toBe(24);
  });

  it("maxNewPerDay=2 时每天最多 2 个 learn", () => {
    const nodes = Array.from({ length: 4 }, (_, i) => makeNode(`k${i + 1}`, 1));
    const schedule = allocateDaily(nodes, 60, 2);
    
    const day1Learns = schedule.filter((s) => s.day === 1 && s.type === "learn");
    expect(day1Learns.length).toBeLessThanOrEqual(2);
  });
});
```

- [ ] **Step 3: 运行测试**

```bash
cd /workspace/devpath && npx vitest run __tests__/schedule.test.ts
```

- [ ] **Step 4: Commit**

```bash
cd /workspace && git add devpath/ && git commit -m "devpath: Task 7 - 学习计划编排 lib/schedule.ts"
```

---

## Task 8: /learn 页面（AI 学习教练入口）

**Files:**
- Create: `devpath/app/learn/page.tsx`

### Steps

- [ ] **Step 1: 创建 `devpath/app/learn/page.tsx`**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { set } from "idb-keyval";
import { KEY_PREFIXES } from "@/lib/types";
import type { LearningPlan } from "@/lib/types";

const EXAMPLES = [
  "前端性能优化",
  "React 源码原理",
  "TypeScript 进阶",
  "系统设计基础",
];

export default function LearnPage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dailyMinutes, setDailyMinutes] = useState(30);
  const [maxNewPerDay, setMaxNewPerDay] = useState(1);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/learn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          dailyMinutes,
          maxNewPerDay,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `请求失败 (${res.status})`);
      }
      const { planId, plan } = (await res.json()) as { planId: string; plan: LearningPlan };
      await set(KEY_PREFIXES.PLAN + planId, plan);
      router.push(`/learn/${planId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "未知错误");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-5xl mb-6 animate-pulse">🤖</div>
        <p className="text-xl font-bold mb-2">AI 正在拆解知识树...</p>
        <p className="text-sm text-gray-500 mb-1">主题：{topic}</p>
        <p className="text-xs text-gray-400 mt-4">预计 30-90 秒，请稍候</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">AI 学习教练</h1>
      <p className="text-gray-500 mb-6">
        告诉 AI 你想学什么，它给你拆知识树、排学习计划、生面试题
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="你想学什么？"
          className="w-full px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />

        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setTopic(ex)}
              className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <label className="flex-1">
            <span className="text-sm text-gray-600">每日学习时间（分钟）</span>
            <input
              type="number"
              value={dailyMinutes}
              onChange={(e) => setDailyMinutes(Number(e.target.value))}
              min={15}
              max={120}
              className="w-full px-3 py-2 border rounded mt-1"
            />
          </label>
          <label className="flex-1">
            <span className="text-sm text-gray-600">每日新内容数</span>
            <input
              type="number"
              value={maxNewPerDay}
              onChange={(e) => setMaxNewPerDay(Number(e.target.value))}
              min={1}
              max={5}
              className="w-full px-3 py-2 border rounded mt-1"
            />
          </label>
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded">{error}</p>
        )}

        <button
          type="submit"
          disabled={!topic.trim()}
          className="w-full py-3 bg-black text-white rounded-lg font-medium disabled:opacity-50 hover:bg-gray-800 transition-colors"
        >
          开始学习
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /workspace && git add devpath/ && git commit -m "devpath: Task 8 - /learn 页面 AI 学习教练入口"
```

---

## Task 9: /api/learn 路由

**Files:**
- Create: `devpath/app/api/learn/route.ts`
- Create: `devpath/__tests__/learn-api.test.ts`

### Steps

- [ ] **Step 1: 创建 `devpath/app/api/learn/route.ts`**

```typescript
// app/api/learn/route.ts
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { decomposeKnowledge } from "@/lib/ai/knowledge";
import { generateQuestions } from "@/lib/ai/question";
import { topoSort, allocateDaily } from "@/lib/schedule";
import { nowISO } from "@/lib/time";
import type { LearningPlan } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, dailyMinutes = 30, maxNewPerDay = 1 } = body as {
      topic?: string;
      dailyMinutes?: number;
      maxNewPerDay?: number;
    };

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return NextResponse.json({ error: "topic 是必填项" }, { status: 400 });
    }

    if (dailyMinutes < 15 || dailyMinutes > 120) {
      return NextResponse.json(
        { error: "dailyMinutes 须在 15-120 之间" },
        { status: 400 }
      );
    }

    if (maxNewPerDay < 1 || maxNewPerDay > 5) {
      return NextResponse.json(
        { error: "maxNewPerDay 须在 1-5 之间" },
        { status: 400 }
      );
    }

    // 1. 拆知识树
    const nodes = await decomposeKnowledge(topic.trim());

    // 2. 生成面试题（并行分批）
    const questions = await generateQuestions(nodes);

    // 3. 编排学习计划
    const sorted = topoSort(nodes);
    const schedule = allocateDaily(sorted, dailyMinutes, maxNewPerDay);

    // 4. 构建 LearningPlan
    const now = nowISO();
    const plan: LearningPlan = {
      id: nanoid(),
      topic: topic.trim(),
      knowledgeTree: nodes,
      questions,
      schedule,
      dailyMinutes,
      maxNewPerDay,
      fsrsMode: "standard",
      createdAt: now,
      updatedAt: now,
    };

    // 返回给前端，由前端存 IndexedDB（API route 无法访问客户端 IndexedDB）
    return NextResponse.json({ planId: plan.id, plan });
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

- [ ] **Step 2: 创建 `devpath/__tests__/learn-api.test.ts`**

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../lib/ai/knowledge", () => ({
  decomposeKnowledge: vi.fn(),
}));

vi.mock("../lib/ai/question", () => ({
  generateQuestions: vi.fn(),
}));

vi.mock("../lib/ai/provider", () => ({
  createAIProvider: vi.fn(() => ({})),
}));

import { decomposeKnowledge } from "../lib/ai/knowledge";
import { generateQuestions } from "../lib/ai/question";
import { POST } from "../app/api/learn/route";
import type { KnowledgeNode, Question } from "../lib/types";

function mockRequest(body: any) {
  return {
    json: async () => body,
  } as any;
}

describe("/api/learn", () => {
  beforeEach(() => {
    vi.mocked(decomposeKnowledge).mockReset();
    vi.mocked(generateQuestions).mockReset();
  });

  it("mock AI 返回，验证响应结构", async () => {
    const nodes: KnowledgeNode[] = [
      { id: "k1", title: "节点1", difficulty: 2, prerequisites: [], frequency: "高", summary: "摘要", mastery: 0 },
    ];
    const questions: Question[] = [
      { id: "q1", nodeId: "k1", question: "题1", answer: "答1", keyPoints: ["p1"], followUps: ["f1"], favorited: false },
    ];
    vi.mocked(decomposeKnowledge).mockResolvedValue(nodes);
    vi.mocked(generateQuestions).mockResolvedValue(questions);

    const req = mockRequest({ topic: "前端性能", dailyMinutes: 30, maxNewPerDay: 1 });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.planId).toBeDefined();
    expect(data.plan.topic).toBe("前端性能");
    expect(data.plan.knowledgeTree).toHaveLength(1);
    expect(data.plan.questions).toHaveLength(1);
    expect(data.plan.schedule.length).toBeGreaterThan(0);
    expect(data.plan.fsrsMode).toBe("standard");
    expect(data.plan.dailyMinutes).toBe(30);
  });

  it("缺少 topic 返回 400", async () => {
    const req = mockRequest({ dailyMinutes: 30 });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("topic");
  });

  it("dailyMinutes 超范围返回 400", async () => {
    const req = mockRequest({ topic: "测试", dailyMinutes: 5 });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 3: 运行测试**

```bash
cd /workspace/devpath && npx vitest run __tests__/learn-api.test.ts
```

- [ ] **Step 4: Commit**

```bash
cd /workspace && git add devpath/ && git commit -m "devpath: Task 9 - /api/learn 路由"
```

---

## Task 10: /learn/[planId] 页面（学习计划详情）

**Files:**
- Create: `devpath/components/KnowledgeTree.tsx`
- Create: `devpath/components/QuestionCard.tsx`
- Create: `devpath/app/learn/[planId]/page.tsx`

### Steps

- [ ] **Step 1: 创建 `devpath/components/KnowledgeTree.tsx`**

```tsx
"use client";

import { useState } from "react";
import type { KnowledgeNode } from "@/lib/types";

const DIFFICULTY_COLORS: Record<number, string> = {
  1: "bg-green-100 text-green-700",
  2: "bg-blue-100 text-blue-700",
  3: "bg-yellow-100 text-yellow-700",
  4: "bg-orange-100 text-orange-700",
  5: "bg-red-100 text-red-700",
};

const FREQ_COLORS: Record<string, string> = {
  高: "bg-red-50 text-red-600",
  中: "bg-yellow-50 text-yellow-600",
  低: "bg-gray-50 text-gray-500",
};

export function KnowledgeTree({ nodes }: { nodes: KnowledgeNode[] }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // 按 difficulty 分组
  const groups: Record<number, KnowledgeNode[]> = {};
  for (const node of nodes) {
    if (!groups[node.difficulty]) groups[node.difficulty] = [];
    groups[node.difficulty].push(node);
  }
  const sortedLevels = Object.keys(groups).map(Number).sort((a, b) => a - b);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">知识树（{nodes.length} 个节点）</h2>
      {sortedLevels.map((level) => (
        <div key={level}>
          <p className="text-xs text-gray-400 mb-1">难度 {level}</p>
          <div className="space-y-1">
            {groups[level].map((node) => (
              <div key={node.id} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggle(node.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50"
                >
                  <span className={`text-xs px-2 py-0.5 rounded ${DIFFICULTY_COLORS[node.difficulty]}`}>
                    D{node.difficulty}
                  </span>
                  <span className="flex-1 text-sm font-medium">{node.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded ${FREQ_COLORS[node.frequency]}`}>
                    {node.frequency}频
                  </span>
                  <span className="text-gray-400 text-xs">
                    {expanded.has(node.id) ? "▼" : "▶"}
                  </span>
                </button>
                {expanded.has(node.id) && (
                  <div className="px-3 py-2 bg-gray-50 text-sm text-gray-600">
                    <p>{node.summary}</p>
                    {node.prerequisites.length > 0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        依赖：{node.prerequisites.join(", ")}
                      </p>
                    )}
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{ width: `${node.mastery}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">掌握度：{node.mastery}%</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: 创建 `devpath/components/QuestionCard.tsx`**

```tsx
"use client";

import { useState } from "react";
import type { Question } from "@/lib/types";

interface Props {
  question: Question;
  onFavoriteToggle?: (questionId: string) => void;
}

export function QuestionCard({ question, onFavoriteToggle }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex items-start gap-2">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-1 text-left text-sm font-medium hover:text-blue-600"
        >
          {question.question}
        </button>
        {onFavoriteToggle && (
          <button
            onClick={() => onFavoriteToggle(question.id)}
            className={`text-lg ${question.favorited ? "text-yellow-500" : "text-gray-300"}`}
            aria-label="收藏"
          >
            {question.favorited ? "⭐" : "☆"}
          </button>
        )}
      </div>

      {expanded && question.answer && (
        <div className="mt-3 space-y-2">
          <div className="text-sm text-gray-700 whitespace-pre-wrap">
            {question.answer}
          </div>
          {question.keyPoints.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mt-2">关键点：</p>
              <ul className="text-xs text-gray-600 list-disc list-inside">
                {question.keyPoints.map((kp, i) => (
                  <li key={i}>{kp}</li>
                ))}
              </ul>
            </div>
          )}
          {question.followUps.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 mt-2">追问：</p>
              <ul className="text-xs text-gray-600 list-disc list-inside">
                {question.followUps.map((fu, i) => (
                  <li key={i}>{fu}</li>
                ))}
              </ul>
            </div>
          )}
          {question.codeSnippet && (
            <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded mt-2 overflow-x-auto">
              <code>{question.codeSnippet}</code>
            </pre>
          )}
        </div>
      )}

      {!expanded && question.answer && (
        <button
          onClick={() => setExpanded(true)}
          className="text-xs text-blue-500 mt-1"
        >
          展开答案 ▼
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 3: 创建 `devpath/app/learn/[planId]/page.tsx`**

```tsx
"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { get, set } from "idb-keyval";
import { KEY_PREFIXES } from "@/lib/types";
import type { LearningPlan } from "@/lib/types";
import { KnowledgeTree } from "@/components/KnowledgeTree";
import { QuestionCard } from "@/components/QuestionCard";
import { toggleQuestionInPlan } from "@/lib/favorite";

export default function PlanDetailPage({
  params,
}: {
  params: Promise<{ planId: string }>;
}) {
  const { planId } = use(params);
  const router = useRouter();
  const [plan, setPlan] = useState<LearningPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [deckFavorited, setDeckFavorited] = useState(false);

  useEffect(() => {
    (async () => {
      const p = await get<LearningPlan>(KEY_PREFIXES.PLAN + planId);
      if (!p) {
        router.push("/learn");
        return;
      }
      setPlan(p);
      setLoading(false);
    })();
  }, [planId, router]);

  async function handleQuestionFavorite(questionId: string) {
    if (!plan) return;
    const updated = toggleQuestionInPlan(plan, questionId);
    setPlan(updated);
    await set(KEY_PREFIXES.PLAN + plan.id, updated);
  }

  async function handleDeckFavorite() {
    if (!plan) return;
    try {
      const res = await fetch("/api/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create_deck", plan }),
      });
      if (res.ok) {
        setDeckFavorited(true);
      }
    } catch {
      // 静默失败
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">加载中...</p>
      </div>
    );
  }

  if (!plan) return null;

  // 按天分组 schedule
  const scheduleByDay: Record<number, typeof plan.schedule> = {};
  for (const item of plan.schedule) {
    if (!scheduleByDay[item.day]) scheduleByDay[item.day] = [];
    scheduleByDay[item.day].push(item);
  }
  const days = Object.keys(scheduleByDay).map(Number).sort((a, b) => a - b);

  return (
    <div className="min-h-screen p-4 max-w-3xl mx-auto pb-20">
      {/* 头部 */}
      <div className="mb-6">
        <button
          onClick={() => router.push("/learn")}
          className="text-sm text-gray-400 mb-2"
        >
          ← 返回
        </button>
        <h1 className="text-xl font-bold">{plan.topic}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {plan.knowledgeTree.length} 个知识点 · {plan.questions.length} 道题 ·{" "}
          {days.length} 天计划
        </p>
        <button
          onClick={handleDeckFavorite}
          disabled={deckFavorited}
          className="mt-3 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-200 disabled:opacity-50"
        >
          {deckFavorited ? "⭐ 已收藏" : "☆ 收藏这份试题"}
        </button>
      </div>

      {/* 知识树 */}
      <div className="mb-6">
        <KnowledgeTree nodes={plan.knowledgeTree} />
      </div>

      {/* 面试题列表 */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3">面试题（{plan.questions.length}）</h2>
        <div className="space-y-2">
          {plan.questions.map((q) => (
            <QuestionCard
              key={q.id}
              question={q}
              onFavoriteToggle={handleQuestionFavorite}
            />
          ))}
        </div>
      </div>

      {/* 学习计划表 */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3">学习计划</h2>
        <div className="space-y-2">
          {days.map((day) => (
            <div key={day} className="border rounded-lg p-3">
              <p className="text-sm font-medium mb-1">第 {day} 天</p>
              <div className="space-y-1">
                {scheduleByDay[day].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span
                      className={`px-2 py-0.5 rounded ${
                        item.type === "learn"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {item.type === "learn" ? "学" : "复"}
                    </span>
                    <span className="text-gray-600">
                      {plan.knowledgeTree.find((n) => n.id === item.nodeId)?.title || item.nodeId}
                    </span>
                    <span className="text-gray-400 ml-auto">{item.estimatedMinutes}min</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
cd /workspace && git add devpath/ && git commit -m "devpath: Task 10 - /learn/[planId] 计划详情页 + KnowledgeTree + QuestionCard"
```

---

## Task 11: FSRS 封装（lib/fsrs.ts）

**Files:**
- Create: `devpath/lib/fsrs.ts`
- Create: `devpath/__tests__/fsrs.test.ts`

### Steps

- [ ] **Step 1: 创建 `devpath/lib/fsrs.ts`**

```typescript
// lib/fsrs.ts
// ts-fsrs 封装：createCard / rateCard / getDueCards
// 三种参数预设：conservative / standard / aggressive

import {
  fsrs,
  generatorParameters,
  Rating,
  createEmptyCard,
  type Card,
  type State,
} from "ts-fsrs";
import { nanoid } from "nanoid";
import type { ReviewCard, Rating as AppRating } from "./types";

export type FSRSMode = "conservative" | "standard" | "aggressive";

const MODE_CONFIG: Record<FSRSMode, { request_retention: number; enable_fuzz: boolean }> = {
  conservative: { request_retention: 0.95, enable_fuzz: false },
  standard: { request_retention: 0.9, enable_fuzz: true },
  aggressive: { request_retention: 0.8, enable_fuzz: true },
};

function getFsrs(mode: FSRSMode) {
  return fsrs(generatorParameters(MODE_CONFIG[mode]));
}

function toISO(date: Date): string {
  return date.toISOString();
}

function fromISO(str: string): Date {
  return new Date(str);
}

function toFsrsCard(card: ReviewCard): Card {
  return {
    due: fromISO(card.due),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsed_days: card.elapsedDays,
    scheduled_days: card.scheduledDays,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state as State,
    last_review: card.lastReview ? fromISO(card.lastReview) : undefined,
  };
}

function fromFsrsCard(card: Card, original: ReviewCard): ReviewCard {
  return {
    ...original,
    due: toISO(card.due),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsedDays: card.elapsed_days,
    scheduledDays: card.scheduled_days,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state as 0 | 1 | 2 | 3 | 4,
    lastReview: card.last_review ? toISO(card.last_review) : "",
  };
}

export function createCard(
  planId: string,
  nodeId: string,
  questionId: string,
  front: string,
  back: string,
  mode: FSRSMode = "standard"
): ReviewCard {
  const f = getFsrs(mode);
  const empty = createEmptyCard(new Date());
  return {
    id: nanoid(),
    planId,
    nodeId,
    questionId,
    front,
    back,
    due: toISO(empty.due),
    stability: empty.stability,
    difficulty: empty.difficulty,
    elapsedDays: empty.elapsed_days,
    scheduledDays: empty.scheduled_days,
    reps: empty.reps,
    lapses: empty.lapses,
    state: empty.state as 0,
    lastReview: "",
  };
}

export function rateCard(
  card: ReviewCard,
  rating: AppRating,
  mode: FSRSMode = "standard"
): ReviewCard {
  const f = getFsrs(mode);
  const fsrsCard = toFsrsCard(card);
  const now = new Date();
  const result = f.repeat(fsrsCard, now);
  const { card: updatedCard } = result[rating as Rating];
  return fromFsrsCard(updatedCard, card);
}

export function getDueCards(
  cards: ReviewCard[],
  now: Date = new Date()
): ReviewCard[] {
  const nowTime = now.getTime();
  return cards.filter((c) => fromISO(c.due).getTime() <= nowTime);
}

export function getDueCount(cards: ReviewCard[], now: Date = new Date()): number {
  return getDueCards(cards, now).length;
}

// 降级固定间隔（ts-fsrs 异常时使用）
export function fallbackSchedule(reps: number): number {
  const intervals = [1, 3, 7, 15, 30];
  return intervals[Math.min(reps, intervals.length - 1)];
}
```

- [ ] **Step 2: 创建 `devpath/__tests__/fsrs.test.ts`**

```typescript
import { describe, it, expect } from "vitest";
import { createCard, rateCard, getDueCards, getDueCount } from "../lib/fsrs";
import type { ReviewCard } from "../lib/types";

describe("fsrs", () => {
  it("新卡片 due=今天，评分 Good 后 due 在未来", () => {
    const card = createCard("plan1", "k1", "q1", "问题", "答案", "standard");
    const now = new Date();
    // 新卡片 due 是今天
    expect(new Date(card.due).getTime()).toBeLessThanOrEqual(now.getTime());

    // 评分 Good
    const rated = rateCard(card, 3, "standard");
    // due 应该在未来（>= 明天）
    const ratedDue = new Date(rated.due);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    expect(ratedDue.getTime()).toBeGreaterThanOrEqual(tomorrow.getTime());
    // reps 应该 +1
    expect(rated.reps).toBe(card.reps + 1);
  });

  it("评分 Again 后 stability 不大于 Good 评分", () => {
    const card1 = createCard("plan1", "k1", "q1", "问题", "答案", "standard");
    const card2 = createCard("plan1", "k1", "q1", "问题", "答案", "standard");

    const ratedAgain = rateCard(card1, 1, "standard");
    const ratedGood = rateCard(card2, 3, "standard");

    // Again 的 stability 应 <= Good 的 stability
    expect(ratedAgain.stability).toBeLessThanOrEqual(ratedGood.stability);
    // Again 的 due 应比 Good 更近（更早复习）
    expect(new Date(ratedAgain.due).getTime()).toBeLessThanOrEqual(
      new Date(ratedGood.due).getTime()
    );
  });

  it("getDueCards 过滤出今天该复习的", () => {
    const now = new Date("2026-07-13T12:00:00.000Z");
    const dueCard: ReviewCard = {
      id: "c1",
      planId: "p1",
      nodeId: "k1",
      questionId: "q1",
      front: "问题",
      back: "答案",
      due: "2026-07-13T00:00:00.000Z", // 今天到期
      stability: 1,
      difficulty: 5,
      elapsedDays: 1,
      scheduledDays: 1,
      reps: 1,
      lapses: 0,
      state: 2,
      lastReview: "2026-07-12T00:00:00.000Z",
    };
    const futureCard: ReviewCard = {
      ...dueCard,
      id: "c2",
      due: "2026-07-15T00:00:00.000Z", // 未来到期
    };

    const due = getDueCards([dueCard, futureCard], now);
    expect(due).toHaveLength(1);
    expect(due[0].id).toBe("c1");
  });

  it("getDueCount 返回正确数量", () => {
    const now = new Date("2026-07-13T12:00:00.000Z");
    const cards: ReviewCard[] = [
      { id: "c1", due: "2026-07-13T00:00:00.000Z" } as ReviewCard,
      { id: "c2", due: "2026-07-14T00:00:00.000Z" } as ReviewCard,
      { id: "c3", due: "2026-07-12T00:00:00.000Z" } as ReviewCard,
    ];
    expect(getDueCount(cards, now)).toBe(2); // c1 和 c3
  });

  it("conservative 模式比 aggressive 更频繁复习", () => {
    const card1 = createCard("p1", "k1", "q1", "问题", "答案", "conservative");
    const card2 = createCard("p1", "k1", "q1", "问题", "答案", "aggressive");

    const rated1 = rateCard(card1, 3, "conservative");
    const rated2 = rateCard(card2, 3, "aggressive");

    // conservative (retention=0.95) 应该比 aggressive (retention=0.8) 更早复习
    expect(new Date(rated1.due).getTime()).toBeLessThanOrEqual(
      new Date(rated2.due).getTime()
    );
  });
});
```

- [ ] **Step 3: 运行测试**

```bash
cd /workspace/devpath && npx vitest run __tests__/fsrs.test.ts
```

- [ ] **Step 4: Commit**

```bash
cd /workspace && git add devpath/ && git commit -m "devpath: Task 11 - FSRS 封装 lib/fsrs.ts"
```

---

## Task 12: /api/review 路由

**Files:**
- Create: `devpath/app/api/review/route.ts`
- Create: `devpath/__tests__/review-api.test.ts`

### Steps

- [ ] **Step 1: 创建 `devpath/app/api/review/route.ts`**

```typescript
// app/api/review/route.ts
// POST /api/review: 接收 { card, rating, mode }
// 服务端用 FSRS 计算评分后的卡片，返回更新后的 card + ReviewLog
// 客户端负责将结果存入 IndexedDB

import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { rateCard } from "@/lib/fsrs";
import { nowISO } from "@/lib/time";
import type { ReviewCard, ReviewLog, Rating } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { card, rating, mode = "standard" } = body as {
      card?: ReviewCard;
      rating?: Rating;
      mode?: "conservative" | "standard" | "aggressive";
    };

    if (!card || !card.id) {
      return NextResponse.json({ error: "card 是必填项" }, { status: 400 });
    }

    if (!rating || ![1, 2, 3, 4].includes(rating)) {
      return NextResponse.json({ error: "rating 须为 1-4" }, { status: 400 });
    }

    const updatedCard = rateCard(card, rating, mode);

    const log: ReviewLog = {
      id: nanoid(),
      cardId: card.id,
      date: nowISO(),
      rating,
      elapsedDays: card.elapsedDays,
      stateBefore: card.state,
      stateAfter: updatedCard.state,
    };

    return NextResponse.json({ card: updatedCard, log });
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

- [ ] **Step 2: 创建 `devpath/__tests__/review-api.test.ts`**

```typescript
import { describe, it, expect } from "vitest";
import { POST } from "../app/api/review/route";
import type { ReviewCard } from "../lib/types";

function mockRequest(body: any) {
  return { json: async () => body } as any;
}

function makeCard(): ReviewCard {
  return {
    id: "c1",
    planId: "p1",
    nodeId: "k1",
    questionId: "q1",
    front: "问题",
    back: "答案",
    due: new Date().toISOString(),
    stability: 0,
    difficulty: 0,
    elapsedDays: 0,
    scheduledDays: 0,
    reps: 0,
    lapses: 0,
    state: 0,
    lastReview: "",
  };
}

describe("/api/review", () => {
  it("评分 Good 后返回 stability/difficulty 更新的卡片", async () => {
    const card = makeCard();
    const req = mockRequest({ card, rating: 3 });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.card).toBeDefined();
    expect(data.card.reps).toBe(1);
    expect(data.card.stability).toBeGreaterThan(0);
    expect(data.log).toBeDefined();
    expect(data.log.cardId).toBe("c1");
    expect(data.log.rating).toBe(3);
    expect(data.log.stateBefore).toBe(0);
    expect(data.log.stateAfter).toBe(data.card.state);
  });

  it("评分 Again 后 reps 不增加但 lapses 增加", async () => {
    const card = makeCard();
    const req = mockRequest({ card, rating: 1 });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.log.rating).toBe(1);
  });

  it("缺少 card 返回 400", async () => {
    const req = mockRequest({ rating: 3 });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("rating 超范围返回 400", async () => {
    const card = makeCard();
    const req = mockRequest({ card, rating: 5 });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 3: 运行测试**

```bash
cd /workspace/devpath && npx vitest run __tests__/review-api.test.ts
```

- [ ] **Step 4: Commit**

```bash
cd /workspace && git add devpath/ && git commit -m "devpath: Task 12 - /api/review 路由"
```

---

## Task 13: /review 页面（今日复习卡片流）

**Files:**
- Create: `devpath/components/ReviewCardView.tsx`
- Create: `devpath/app/review/page.tsx`

### Steps

- [ ] **Step 1: 创建 `devpath/components/ReviewCardView.tsx`**

```tsx
"use client";

import { useState } from "react";
import type { ReviewCard, Rating } from "@/lib/types";

const RATINGS: { value: Rating; label: string; emoji: string; color: string }[] = [
  { value: 1, label: "Again", emoji: "😕", color: "bg-red-500" },
  { value: 2, label: "Hard", emoji: "😐", color: "bg-orange-500" },
  { value: 3, label: "Good", emoji: "🙂", color: "bg-green-500" },
  { value: 4, label: "Easy", emoji: "😎", color: "bg-blue-500" },
];

interface Props {
  card: ReviewCard;
  onRate: (rating: Rating) => void;
}

export function ReviewCardView({ card, onRate }: Props) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="border rounded-lg p-6 bg-white shadow-sm">
      <p className="text-lg font-medium mb-4">{card.front}</p>

      {!showAnswer ? (
        <button
          onClick={() => setShowAnswer(true)}
          className="w-full py-2 bg-gray-100 rounded-lg text-sm font-medium hover:bg-gray-200"
        >
          显示答案
        </button>
      ) : (
        <>
          <div className="text-sm text-gray-700 whitespace-pre-wrap mb-4 p-3 bg-gray-50 rounded">
            {card.back}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {RATINGS.map((r) => (
              <button
                key={r.value}
                onClick={() => onRate(r.value)}
                className={`flex flex-col items-center py-2 ${r.color} text-white rounded-lg hover:opacity-90`}
              >
                <span className="text-xl">{r.emoji}</span>
                <span className="text-xs">{r.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 创建 `devpath/app/review/page.tsx`**

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { get, set } from "idb-keyval";
import { KEY_PREFIXES } from "@/lib/types";
import type { ReviewCard, ReviewLog, Rating } from "@/lib/types";
import { getDueCards } from "@/lib/fsrs";
import { ReviewCardView } from "@/components/ReviewCardView";

export default function ReviewPage() {
  const [dueCards, setDueCards] = useState<ReviewCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ again: number; hard: number; good: number; easy: number }>({
    again: 0,
    hard: 0,
    good: 0,
    easy: 0,
  });
  const [finished, setFinished] = useState(false);

  const loadCards = useCallback(async () => {
    const allKeys = await get<string[]>("all_card_keys").then((k) => k || []);
    // 从 IndexedDB 读所有卡片
    const cards: ReviewCard[] = [];
    for (const key of allKeys) {
      if (key.startsWith(KEY_PREFIXES.CARD)) {
        const card = await get<ReviewCard>(key);
        if (card) cards.push(card);
      }
    }
    const due = getDueCards(cards);
    setDueCards(due);
    setLoading(false);
    if (due.length === 0) {
      setFinished(true);
    }
  }, []);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  async function handleRate(rating: Rating) {
    const card = dueCards[currentIndex];
    if (!card) return;

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ card, rating }),
      });
      if (!res.ok) return;
      const { card: updatedCard, log } = (await res.json()) as {
        card: ReviewCard;
        log: ReviewLog;
      };

      // 存回 IndexedDB
      await set(KEY_PREFIXES.CARD + updatedCard.id, updatedCard);
      await set(KEY_PREFIXES.REVIEW_LOG + log.id, log);

      // 更新统计
      setStats((prev) => ({
        ...prev,
        again: prev.again + (rating === 1 ? 1 : 0),
        hard: prev.hard + (rating === 2 ? 1 : 0),
        good: prev.good + (rating === 3 ? 1 : 0),
        easy: prev.easy + (rating === 4 ? 1 : 0),
      }));

      // 下一张
      if (currentIndex + 1 >= dueCards.length) {
        setFinished(true);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    } catch {
      // 静默失败
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">加载复习卡片...</p>
      </div>
    );
  }

  if (finished) {
    const total = stats.again + stats.hard + stats.good + stats.easy;
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-5xl mb-4">🎉</div>
        <h1 className="text-xl font-bold mb-2">
          {total === 0 ? "今天没有需要复习的卡片" : "复习完成！"}
        </h1>
        {total > 0 && (
          <div className="mt-4 space-y-1 text-sm">
            <p>😕 Again: {stats.again}</p>
            <p>😐 Hard: {stats.hard}</p>
            <p>🙂 Good: {stats.good}</p>
            <p>😎 Easy: {stats.easy}</p>
            <p className="font-medium mt-2">总计: {total} 张</p>
          </div>
        )}
      </div>
    );
  }

  const card = dueCards[currentIndex];
  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto pb-20">
      <div className="text-center mb-4">
        <p className="text-sm text-gray-500">
          {currentIndex + 1} / {dueCards.length} 今日待复习
        </p>
        <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
          <div
            className="bg-blue-500 h-1 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / dueCards.length) * 100}%` }}
          />
        </div>
      </div>
      <ReviewCardView card={card} onRate={handleRate} />
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
cd /workspace && git add devpath/ && git commit -m "devpath: Task 13 - /review 复习页面 + ReviewCardView"
```

---

## Task 14: 收藏功能（lib/favorite.ts + /api/favorite）

**Files:**
- Create: `devpath/lib/favorite.ts`
- Create: `devpath/app/api/favorite/route.ts`
- Create: `devpath/__tests__/favorite.test.ts`

### Steps

- [ ] **Step 1: 创建 `devpath/lib/favorite.ts`**

```typescript
// lib/favorite.ts
// 收藏管理：试题集（FavoriteDeck）+ 单题收藏
// 逻辑函数（纯函数）+ 存储函数（IndexedDB）

import { get, set, del, keys } from "idb-keyval";
import { nanoid } from "nanoid";
import { nowISO } from "./time";
import { KEY_PREFIXES } from "./types";
import type { FavoriteDeck, LearningPlan, Question } from "./types";

// ===== 纯逻辑函数 =====

export function buildFavoriteDeck(plan: LearningPlan): FavoriteDeck {
  return {
    id: nanoid(),
    planId: plan.id,
    topic: plan.topic,
    questionIds: plan.questions.map((q) => q.id),
    questionCount: plan.questions.length,
    favoritedAt: nowISO(),
    questions: plan.questions.map((q) => ({ ...q })),
    knowledgeTree: plan.knowledgeTree.map((n) => ({ ...n })),
  };
}

export function toggleQuestionInPlan(
  plan: LearningPlan,
  questionId: string
): LearningPlan {
  return {
    ...plan,
    updatedAt: nowISO(),
    questions: plan.questions.map((q) => {
      if (q.id === questionId) {
        const favorited = !q.favorited;
        return {
          ...q,
          favorited,
          favoritedAt: favorited ? nowISO() : undefined,
        };
      }
      return q;
    }),
  };
}

// ===== 存储函数（IndexedDB）=====

export async function createFavoriteDeck(plan: LearningPlan): Promise<FavoriteDeck> {
  const deck = buildFavoriteDeck(plan);
  await set(KEY_PREFIXES.DECK + deck.id, deck);
  return deck;
}

export async function listFavoriteDecks(): Promise<FavoriteDeck[]> {
  const allKeys = await keys();
  const deckKeys = allKeys.filter(
    (k): k is string => typeof k === "string" && k.startsWith(KEY_PREFIXES.DECK)
  );
  const decks = await Promise.all(
    deckKeys.map((k) => get<FavoriteDeck>(k))
  );
  return decks
    .filter((d): d is FavoriteDeck => d !== undefined)
    .sort(
      (a, b) =>
        new Date(b.favoritedAt).getTime() - new Date(a.favoritedAt).getTime()
    );
}

export async function getFavoriteDeck(id: string): Promise<FavoriteDeck | undefined> {
  return get<FavoriteDeck>(KEY_PREFIXES.DECK + id);
}

export async function deleteFavoriteDeck(id: string): Promise<void> {
  await del(KEY_PREFIXES.DECK + id);
}

// 从所有 plan 聚合 favorited 单题
export async function listFavoritedQuestions(): Promise<Question[]> {
  const allKeys = await keys();
  const planKeys = allKeys.filter(
    (k): k is string => typeof k === "string" && k.startsWith(KEY_PREFIXES.PLAN)
  );
  const plans = await Promise.all(
    planKeys.map((k) => get<LearningPlan>(k))
  );
  const favorited: Question[] = [];
  for (const plan of plans) {
    if (!plan) continue;
    for (const q of plan.questions) {
      if (q.favorited) favorited.push(q);
    }
  }
  return favorited;
}
```

- [ ] **Step 2: 创建 `devpath/app/api/favorite/route.ts`**

```typescript
// app/api/favorite/route.ts
// POST /api/favorite: 接收 { action, plan?, deckId?, questionId? }
// 纯逻辑计算，返回结果给前端存储

import { NextRequest, NextResponse } from "next/server";
import { buildFavoriteDeck, toggleQuestionInPlan } from "@/lib/favorite";
import type { LearningPlan } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, plan, deckId, questionId } = body as {
      action?: string;
      plan?: LearningPlan;
      deckId?: string;
      questionId?: string;
    };

    switch (action) {
      case "create_deck": {
        if (!plan) {
          return NextResponse.json({ error: "plan 是必填项" }, { status: 400 });
        }
        const deck = buildFavoriteDeck(plan);
        return NextResponse.json({ deck });
      }
      case "delete_deck": {
        if (!deckId) {
          return NextResponse.json({ error: "deckId 是必填项" }, { status: 400 });
        }
        return NextResponse.json({ success: true, deckId });
      }
      case "toggle_question": {
        if (!plan || !questionId) {
          return NextResponse.json(
            { error: "plan 和 questionId 是必填项" },
            { status: 400 }
          );
        }
        const updatedPlan = toggleQuestionInPlan(plan, questionId);
        return NextResponse.json({ plan: updatedPlan });
      }
      default:
        return NextResponse.json({ error: `未知 action: ${action}` }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "未知错误";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

- [ ] **Step 3: 创建 `devpath/__tests__/favorite.test.ts`**

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import "fake-indexeddb/auto";
import {
  buildFavoriteDeck,
  toggleQuestionInPlan,
  createFavoriteDeck,
  listFavoriteDecks,
  deleteFavoriteDeck,
  getFavoriteDeck,
  listFavoritedQuestions,
} from "../lib/favorite";
import { set, del, keys } from "idb-keyval";
import { KEY_PREFIXES } from "../lib/types";
import type { LearningPlan } from "../lib/types";

function makePlan(): LearningPlan {
  return {
    id: "plan-1",
    topic: "前端性能",
    knowledgeTree: [
      { id: "k1", title: "渲染原理", difficulty: 2, prerequisites: [], frequency: "高", summary: "", mastery: 0 },
    ],
    questions: [
      { id: "q1", nodeId: "k1", question: "题1", answer: "答1", keyPoints: ["p1"], followUps: ["f1"], favorited: false },
      { id: "q2", nodeId: "k1", question: "题2", answer: "答2", keyPoints: ["p2"], followUps: ["f2"], favorited: false },
      { id: "q3", nodeId: "k1", question: "题3", answer: "答3", keyPoints: ["p3"], followUps: ["f3"], favorited: false },
    ],
    schedule: [],
    dailyMinutes: 30,
    maxNewPerDay: 1,
    fsrsMode: "standard",
    createdAt: "2026-07-13T00:00:00.000Z",
    updatedAt: "2026-07-13T00:00:00.000Z",
  };
}

async function clearAll() {
  const allKeys = await keys();
  for (const k of allKeys) {
    if (typeof k === "string") await del(k);
  }
}

describe("favorite (pure logic)", () => {
  it("buildFavoriteDeck 创建快照，questionCount 正确", () => {
    const plan = makePlan();
    const deck = buildFavoriteDeck(plan);
    expect(deck.planId).toBe("plan-1");
    expect(deck.topic).toBe("前端性能");
    expect(deck.questionCount).toBe(3);
    expect(deck.questionIds).toEqual(["q1", "q2", "q3"]);
    expect(deck.questions).toHaveLength(3);
    expect(deck.knowledgeTree).toHaveLength(1);
    expect(deck.id).toBeDefined();
  });

  it("toggleQuestionInPlan 切换 favorited 状态", () => {
    const plan = makePlan();
    const updated = toggleQuestionInPlan(plan, "q2");
    expect(updated.questions[0].favorited).toBe(false);
    expect(updated.questions[1].favorited).toBe(true);
    expect(updated.questions[1].favoritedAt).toBeDefined();
    // 再次切换
    const toggledBack = toggleQuestionInPlan(updated, "q2");
    expect(toggledBack.questions[1].favorited).toBe(false);
    expect(toggledBack.questions[1].favoritedAt).toBeUndefined();
  });

  it("buildFavoriteDeck 是独立快照（修改原 plan 不影响 deck）", () => {
    const plan = makePlan();
    const deck = buildFavoriteDeck(plan);
    plan.questions[0].question = "已修改";
    expect(deck.questions[0].question).toBe("题1");
  });
});

describe("favorite (IndexedDB)", () => {
  beforeEach(async () => {
    await clearAll();
  });

  it("创建 deck，listFavoriteDecks 能读回", async () => {
    const plan = makePlan();
    const deck = await createFavoriteDeck(plan);
    expect(deck.id).toBeDefined();

    const list = await listFavoriteDecks();
    expect(list).toHaveLength(1);
    expect(list[0].id).toBe(deck.id);
    expect(list[0].questionCount).toBe(3);
  });

  it("删除 deck，list 不再包含", async () => {
    const plan = makePlan();
    const deck = await createFavoriteDeck(plan);
    await deleteFavoriteDeck(deck.id);

    const list = await listFavoriteDecks();
    expect(list).toHaveLength(0);

    const got = await getFavoriteDeck(deck.id);
    expect(got).toBeUndefined();
  });

  it("多个 deck 按时间倒序排列", async () => {
    const plan = makePlan();
    const deck1 = await createFavoriteDeck(plan);
    // 等一小段时间确保时间不同
    await new Promise((r) => setTimeout(r, 10));
    const deck2 = await createFavoriteDeck(plan);

    const list = await listFavoriteDecks();
    expect(list).toHaveLength(2);
    expect(list[0].id).toBe(deck2.id);
    expect(list[1].id).toBe(deck1.id);
  });

  it("listFavoritedQuestions 聚合所有 plan 中 favorited 的题", async () => {
    const plan = makePlan();
    // 标记 q1 和 q3 为已收藏
    plan.questions[0].favorited = true;
    plan.questions[2].favorited = true;
    await set(KEY_PREFIXES.PLAN + plan.id, plan);

    const favorited = await listFavoritedQuestions();
    expect(favorited).toHaveLength(2);
    expect(favorited.map((q) => q.id)).toContain("q1");
    expect(favorited.map((q) => q.id)).toContain("q3");
  });

  it("无收藏题时返回空数组", async () => {
    const favorited = await listFavoritedQuestions();
    expect(favorited).toEqual([]);
  });
});
```

- [ ] **Step 4: 运行测试**

```bash
cd /workspace/devpath && npx vitest run __tests__/favorite.test.ts
```

- [ ] **Step 5: Commit**

```bash
cd /workspace && git add devpath/ && git commit -m "devpath: Task 14 - 收藏功能 lib/favorite.ts + /api/favorite"
```

---

## Task 15: /favorites 页面

**Files:**
- Create: `devpath/app/favorites/page.tsx`

### Steps

- [ ] **Step 1: 创建 `devpath/app/favorites/page.tsx`**

```tsx
"use client";

import { useState, useEffect } from "react";
import { listFavoriteDecks, deleteFavoriteDeck, listFavoritedQuestions } from "@/lib/favorite";
import { createCard } from "@/lib/fsrs";
import { set } from "idb-keyval";
import { KEY_PREFIXES } from "@/lib/types";
import type { FavoriteDeck, Question, ReviewCard } from "@/lib/types";

export default function FavoritesPage() {
  const [tab, setTab] = useState<"decks" | "questions">("decks");
  const [decks, setDecks] = useState<FavoriteDeck[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDeck, setExpandedDeck] = useState<string | null>(null);

  async function loadData() {
    const [d, q] = await Promise.all([listFavoriteDecks(), listFavoritedQuestions()]);
    setDecks(d);
    setQuestions(q);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleDeleteDeck(id: string) {
    await deleteFavoriteDeck(id);
    await loadData();
  }

  async function handleStartReview(deck: FavoriteDeck) {
    // 用 deck 的题创建 FSRS 卡片
    const cardKeys: string[] = [];
    for (const q of deck.questions) {
      const card = createCard(deck.id, q.nodeId, q.id, q.question, q.answer, "standard");
      await set(KEY_PREFIXES.CARD + card.id, card);
      cardKeys.push(KEY_PREFIXES.CARD + card.id);
    }
    // 存 key 列表供 /review 读取
    const existing = await get<string[]>("all_card_keys").then((k) => k || []);
    await set("all_card_keys", [...existing, ...cardKeys]);
    alert(`已创建 ${deck.questions.length} 张复习卡片，去 /review 开始复习`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">加载中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto pb-20">
      <h1 className="text-xl font-bold mb-4">收藏夹</h1>

      {/* Tab 切换 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab("decks")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium ${
            tab === "decks" ? "bg-black text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          试题集（{decks.length}）
        </button>
        <button
          onClick={() => setTab("questions")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium ${
            tab === "questions" ? "bg-black text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          单题（{questions.length}）
        </button>
      </div>

      {/* 试题集 Tab */}
      {tab === "decks" && (
        <div className="space-y-3">
          {decks.length === 0 ? (
            <p className="text-center text-gray-400 py-8">还没有收藏的试题集</p>
          ) : (
            decks.map((deck) => (
              <div key={deck.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">{deck.topic}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {deck.questionCount} 题 · {new Date(deck.favoritedAt).toLocaleDateString("zh-CN")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleStartReview(deck)}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200"
                  >
                    开始复习
                  </button>
                  <button
                    onClick={() => setExpandedDeck(expandedDeck === deck.id ? null : deck.id)}
                    className="px-3 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium hover:bg-gray-200"
                  >
                    {expandedDeck === deck.id ? "收起" : "查看题目"}
                  </button>
                  <button
                    onClick={() => handleDeleteDeck(deck.id)}
                    className="px-3 py-1 bg-red-50 text-red-600 rounded text-xs font-medium hover:bg-red-100"
                  >
                    删除
                  </button>
                </div>
                {expandedDeck === deck.id && (
                  <div className="mt-3 space-y-2">
                    {deck.questions.map((q, i) => (
                      <div key={q.id} className="text-sm border-l-2 border-gray-200 pl-2">
                        <p className="font-medium">{i + 1}. {q.question}</p>
                        <p className="text-xs text-gray-500 mt-1">{q.answer.slice(0, 80)}...</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* 单题 Tab */}
      {tab === "questions" && (
        <div className="space-y-2">
          {questions.length === 0 ? (
            <p className="text-center text-gray-400 py-8">还没有收藏的单题</p>
          ) : (
            questions.map((q) => (
              <div key={q.id} className="border rounded-lg p-3">
                <p className="text-sm font-medium">{q.question}</p>
                {q.keyPoints.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {q.keyPoints.map((kp, i) => (
                      <span key={i} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                        {kp}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /workspace && git add devpath/ && git commit -m "devpath: Task 15 - /favorites 收藏夹页面"
```

---

## Task 16: 底部导航 + 首页 dashboard

**Files:**
- Create: `devpath/components/Nav.tsx`
- Create: `devpath/components/StatusCard.tsx`
- Create: `devpath/app/stats/page.tsx`（占位）
- Modify: `devpath/app/layout.tsx`（加 Nav）
- Modify: `devpath/app/page.tsx`（替换为 dashboard）

### Steps

- [ ] **Step 1: 创建 `devpath/components/Nav.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "今日", icon: "🎯" },
  { href: "/learn", label: "学习", icon: "📚" },
  { href: "/review", label: "复习", icon: "🔁" },
  { href: "/stats", label: "统计", icon: "📊" },
  { href: "/favorites", label: "我的", icon: "⭐" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-50">
      {items.map((item) => {
        const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
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

- [ ] **Step 2: 创建 `devpath/components/StatusCard.tsx`**

```tsx
"use client";

import { useState } from "react";
import { set } from "idb-keyval";
import { KEY_PREFIXES } from "@/lib/types";
import { chinaDateNow, nowISO } from "@/lib/time";
import type { DailyStatus } from "@/lib/types";

const QUICK_OPTIONS = [
  { energy: 2 as const, mood: "bad" as const, label: "不太好", emoji: "😕" },
  { energy: 3 as const, mood: "neutral" as const, label: "一般", emoji: "😐" },
  { energy: 4 as const, mood: "good" as const, label: "状态不错", emoji: "🙂" },
];

export function StatusCard() {
  const [selected, setSelected] = useState<DailyStatus | null>(null);

  async function handleClick(energy: 2 | 3 | 4, mood: "bad" | "neutral" | "good", label: string) {
    const status: DailyStatus = {
      date: chinaDateNow(),
      energy,
      mood,
      availableMinutes: 30,
      aiAdjustedLoad: 1.0,
      actualMinutes: 0,
    };
    await set(KEY_PREFIXES.STATUS + status.date, status);
    setSelected(status);
  }

  if (selected) {
    return (
      <div className="bg-white border rounded-lg p-4">
        <p className="text-sm text-gray-500 mb-1">今日状态</p>
        <p className="text-lg font-medium">
          {selected.energy >= 4 ? "🙂" : selected.energy >= 3 ? "😐" : "😕"} 精力 {selected.energy}/5
        </p>
        <p className="text-xs text-gray-400 mt-1">
          可用时间 {selected.availableMinutes}min · 建议负载 {selected.aiAdjustedLoad.toFixed(1)}x
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border rounded-lg p-4">
      <p className="text-sm text-gray-500 mb-3">今天感觉怎么样？</p>
      <div className="flex gap-2">
        {QUICK_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            onClick={() => handleClick(opt.energy, opt.mood, opt.label)}
            className="flex-1 py-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl mb-1">{opt.emoji}</div>
            <div className="text-xs text-gray-600">{opt.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: 创建 `devpath/app/stats/page.tsx`（占位，M4 实现）**

```tsx
export default function StatsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="text-5xl mb-4">📊</div>
      <h1 className="text-xl font-bold mb-2">统计</h1>
      <p className="text-gray-400 text-sm">热力图 + 雷达图 + 周报（M4 实现）</p>
    </div>
  );
}
```

- [ ] **Step 4: 修改 `devpath/app/layout.tsx`（加 Nav）**

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "devpath — AI 驱动的开发者成长 OS",
  description: "告诉 AI 你想学什么，它给你拆知识树、排学习计划、生面试题、按遗忘曲线复习",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-50 text-gray-900 min-h-screen pb-16">
        {children}
        <Nav />
      </body>
    </html>
  );
}
```

- [ ] **Step 5: 修改 `devpath/app/page.tsx`（替换为 dashboard）**

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { get, keys } from "idb-keyval";
import { KEY_PREFIXES } from "@/lib/types";
import { chinaDateNow, chinaDateShift } from "@/lib/time";
import { getDueCards } from "@/lib/fsrs";
import { StatusCard } from "@/components/StatusCard";
import type { LearningPlan, ReviewCard, LearnLog, ScheduleItem } from "@/lib/types";

export default function Home() {
  const [dueCount, setDueCount] = useState(0);
  const [todayLearnCount, setTodayLearnCount] = useState(0);
  const [streak, setStreak] = useState(0);
  const [recentLogs, setRecentLogs] = useState<LearnLog[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<ScheduleItem[]>([]);
  const [heatmapData, setHeatmapData] = useState<{ date: string; minutes: number }[]>([]);

  useEffect(() => {
    (async () => {
      // 读所有卡片，计算今日待复习
      const allKeys = await keys();
      const cardKeys = allKeys.filter(
        (k): k is string => typeof k === "string" && k.startsWith(KEY_PREFIXES.CARD)
      );
      const cards: ReviewCard[] = [];
      for (const k of cardKeys) {
        const c = await get<ReviewCard>(k);
        if (c) cards.push(c);
      }
      const due = getDueCards(cards);
      setDueCount(due.length);

      // 读所有 plan，找今日 schedule
      const planKeys = allKeys.filter(
        (k): k is string => typeof k === "string" && k.startsWith(KEY_PREFIXES.PLAN)
      );
      let todayLearn = 0;
      const todayItems: ScheduleItem[] = [];
      for (const k of planKeys) {
        const plan = await get<LearningPlan>(k);
        if (!plan) continue;
        const today = plan.schedule.filter((s) => s.day === 1 && !s.completed);
        todayItems.push(...today);
        todayLearn += todayItems.filter((s) => s.type === "learn").length;
      }
      setTodayLearnCount(todayLearn);
      setTodaySchedule(todayItems.slice(0, 3));

      // 读学习日志，算连续打卡
      const logKeys = allKeys.filter(
        (k): k is string => typeof k === "string" && k.startsWith(KEY_PREFIXES.LEARN_LOG)
      );
      const logs: LearnLog[] = [];
      for (const k of logKeys) {
        const log = await get<LearnLog>(k);
        if (log) logs.push(log);
      }
      setRecentLogs(logs.slice(-5));

      // 连续打卡
      const logDates = new Set(logs.map((l) => l.date));
      let streakCount = 0;
      let checkDate = chinaDateNow();
      while (logDates.has(checkDate)) {
        streakCount++;
        checkDate = chinaDateShift(checkDate, -1);
      }
      setStreak(streakCount);

      // 迷你热力图（最近 7 天）
      const dayMinutes: { date: string; minutes: number }[] = [];
      for (let i = 6; i >= 0; i--) {
        const date = chinaDateShift(chinaDateNow(), -i);
        const minutes = logs
          .filter((l) => l.date === date)
          .reduce((sum, l) => sum + l.duration, 0);
        dayMinutes.push({ date, minutes });
      }
      setHeatmapData(dayMinutes);
    })();
  }, []);

  const heatColor = (minutes: number) => {
    if (minutes === 0) return "bg-gray-100";
    if (minutes < 15) return "bg-green-200";
    if (minutes < 30) return "bg-green-400";
    if (minutes < 60) return "bg-green-500";
    return "bg-green-700";
  };

  return (
    <div className="min-h-screen p-4 max-w-2xl mx-auto pb-20">
      <h1 className="text-2xl font-bold mb-4">今日</h1>

      {/* 待学/待复习 + 打卡 */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-white border rounded-lg p-3 text-center">
          <p className="text-2xl font-bold">{todayLearnCount}</p>
          <p className="text-xs text-gray-400">今日待学</p>
        </div>
        <div className="bg-white border rounded-lg p-3 text-center">
          <p className="text-2xl font-bold">{dueCount}</p>
          <p className="text-xs text-gray-400">今日待复习</p>
        </div>
        <div className="bg-white border rounded-lg p-3 text-center">
          <p className="text-2xl font-bold">{streak}</p>
          <p className="text-xs text-gray-400">连续打卡</p>
        </div>
      </div>

      {/* 今日状态 */}
      <div className="mb-4">
        <StatusCard />
      </div>

      {/* 今日学习/复习列表 */}
      {todaySchedule.length > 0 && (
        <div className="mb-4">
          <h2 className="text-sm font-medium text-gray-500 mb-2">今日安排</h2>
          <div className="space-y-1">
            {todaySchedule.map((item, i) => (
              <div key={i} className="flex items-center gap-2 bg-white border rounded-lg p-2">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  item.type === "learn" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                }`}>
                  {item.type === "learn" ? "学" : "复"}
                </span>
                <span className="text-sm flex-1">{item.nodeId}</span>
                <span className="text-xs text-gray-400">{item.estimatedMinutes}min</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 迷你热力图（最近 7 天） */}
      <div className="mb-4">
        <h2 className="text-sm font-medium text-gray-500 mb-2">最近 7 天</h2>
        <div className="flex gap-1">
          {heatmapData.map((d) => (
            <div key={d.date} className="flex-1 text-center">
              <div className={`h-12 rounded ${heatColor(d.minutes)} flex items-end justify-center pb-1`}>
                {d.minutes > 0 && (
                  <span className="text-xs text-white font-medium">{d.minutes}</span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {d.date.slice(5)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 快捷入口 */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/learn" className="bg-black text-white rounded-lg p-4 text-center font-medium">
          📚 开始学习
        </Link>
        <Link href="/review" className="bg-white border rounded-lg p-4 text-center font-medium">
          🔁 去复习
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Commit**

```bash
cd /workspace && git add devpath/ && git commit -m "devpath: Task 16 - 底部导航 Nav + 首页 dashboard + StatusCard"
```

---

## Task 17: 端到端验证 + README

**Files:**
- Create: `devpath/README.md`

### Steps

- [ ] **Step 1: 运行所有测试，确保通过**

```bash
cd /workspace/devpath && npx vitest run
```

预期输出：所有 `__tests__/*.test.ts` 全部通过（smoke, types, db, provider, knowledge, question, schedule, fsrs, learn-api, review-api, favorite）。

- [ ] **Step 2: 运行 TypeScript 类型检查**

```bash
cd /workspace/devpath && npx tsc --noEmit
```

预期：无类型错误。

- [ ] **Step 3: 运行构建**

```bash
cd /workspace/devpath && npm run build
```

> **注意：** `next.config.js` 中 `output` 默认为 `undefined`（开发模式），此时 API routes 正常构建。M6 部署到 Cloudflare Pages 时设 `NEXT_PUBLIC_STATIC_EXPORT=true` 启用静态导出，届时需将 API routes 迁移到 `functions/api/` 目录。

预期：构建成功，`.next/` 目录生成。

- [ ] **Step 4: 创建 `devpath/README.md`**

````markdown
# devpath — AI 驱动的开发者成长 OS

告诉 AI 你想学什么，它给你拆知识树、排学习计划、生面试题、按遗忘曲线复习。

## 功能

- **AI 学习教练**：输入主题 → AI 拆知识树 → 生成面试题 → 排学习计划
- **FSRS 间隔重复**：ts-fsrs 算法自动安排复习，三种难度预设
- **收藏夹**：整份试题集 + 单题收藏，独立快照
- **今日 Dashboard**：待学/待复习数量、连续打卡、状态评估、7 天热力图

## 技术栈

- Next.js 14 App Router + TypeScript
- Tailwind CSS（移动端优先）
- Vercel AI SDK（ai + @ai-sdk/openai）
- ts-fsrs（FSRS 间隔重复算法）
- idb-keyval（IndexedDB 封装）
- Vitest（单元测试）

## 开发

### 1. 安装依赖

```bash
cd devpath
npm install
```

### 2. 配置环境变量

复制 `.env.local.example` 为 `.env.local`，填入你的 AI API Key：

```bash
cp .env.local.example .env.local
```

支持的 Provider（均兼容 OpenAI 格式）：

| Provider | AI_PROVIDER | 端点 | 默认模型 | Key 环境变量 |
|----------|------------|------|---------|-------------|
| 智谱 GLM | `glm` | https://open.bigmodel.cn/api/paas/v4 | glm-4-flash | `GLM_API_KEY` |
| DeepSeek | `deepseek` | https://api.deepseek.com/v1 | deepseek-chat | `DEEPSEEK_API_KEY` |
| 小米 MiMo | `mimo` | https://api.xiaomimimo.com/v1 | mimo-v2-pro | `MIMO_API_KEY` |
| 自定义 | `custom` | `AI_API_URL` | `AI_MODEL` | `AI_API_KEY` |

### 3. 启动开发服务器

```bash
npm run dev
```

打开 http://localhost:3000

### 4. 运行测试

```bash
npm test           # 运行一次
npm run test:watch # 监听模式
```

### 5. 构建

```bash
npm run build
```

## 部署到 Cloudflare Pages

### 方式一：静态导出（M6 启用）

1. 设置环境变量 `NEXT_PUBLIC_STATIC_EXPORT=true`
2. 运行 `npm run build`，生成 `out/` 目录
3. Cloudflare Pages 构建命令：`npm run build`，输出目录：`out`
4. API routes 需迁移到 `functions/api/` 目录（Cloudflare Pages Functions）

### 方式二：@cloudflare/next-on-pages

```bash
npx @cloudflare/next-on-pages
```

### 环境变量

在 Cloudflare Pages Dashboard → Settings → Environment Variables 中配置：

- `AI_PROVIDER` = `glm`（或 `deepseek` / `mimo`）
- `GLM_API_KEY` = 你的 API Key
- `NEXT_PUBLIC_STATIC_EXPORT` = `true`（静态导出模式）

## 项目结构

```
devpath/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页 dashboard
│   ├── learn/             # AI 学习教练
│   ├── review/            # 今日复习
│   ├── favorites/         # 收藏夹
│   ├── stats/             # 统计（M4）
│   └── api/               # API Routes
├── components/             # React 组件
├── lib/                    # 核心逻辑
│   ├── ai/                # AI 集成
│   ├── storage/           # IndexedDB 封装
│   ├── fsrs.ts            # FSRS 间隔重复
│   ├── schedule.ts        # 学习计划编排
│   ├── favorite.ts        # 收藏管理
│   ├── types.ts           # 类型定义
│   └── time.ts            # Asia/Shanghai 时区工具
├── __tests__/             # 单元测试
└── package.json
```

## 里程碑

| 阶段 | 内容 | 状态 |
|------|------|------|
| M1 | 基础设施 + AI 学习教练 | ✅ MVP |
| M2 | FSRS 复习 + 收藏 | ✅ MVP |
| M3 | 能量感知 + 动态调量 | 待实现 |
| M4 | 可视化（热力图+雷达+周报）| 待实现 |
| M5 | 公开主页 + Cloudflare KV | 待实现 |
| M6 | Cloudflare Pages 部署 + 推广 | 待实现 |

## License

MIT
````

- [ ] **Step 5: Commit**

```bash
cd /workspace && git add devpath/ && git commit -m "devpath: Task 17 - 端到端验证 + README"
```

---

## 实施顺序总结

| 顺序 | Task | 产出 | 预计耗时 |
|------|------|------|---------|
| 1 | 项目脚手架 | 可运行的 Next.js 项目 + vitest | 1h |
| 2 | 类型定义 | lib/types.ts | 0.5h |
| 3 | IndexedDB 存储层 | lib/storage/db.ts | 0.5h |
| 4 | AI Provider | lib/ai/provider.ts | 0.5h |
| 5 | 知识树拆解 | lib/ai/knowledge.ts + templates.ts | 2h |
| 6 | 面试题生成 | lib/ai/question.ts | 1.5h |
| 7 | 学习计划编排 | lib/schedule.ts | 2h |
| 8 | /learn 页面 | AI 学习教练入口 | 1h |
| 9 | /api/learn 路由 | 编排接口 | 1h |
| 10 | /learn/[planId] | 计划详情页 | 2h |
| 11 | FSRS 封装 | lib/fsrs.ts | 1.5h |
| 12 | /api/review 路由 | FSRS 评分接口 | 0.5h |
| 13 | /review 页面 | 复习卡片流 | 2h |
| 14 | 收藏功能 | lib/favorite.ts + /api/favorite | 1.5h |
| 15 | /favorites 页面 | 收藏夹 | 1.5h |
| 16 | Nav + Dashboard | 底部导航 + 首页 | 2h |
| 17 | E2E + README | 全量测试 + 文档 | 1h |

**总预计：~22h（约 2 周，每周 ~11h）**

---

## 关键设计决策

### 1. output: "export" 与 API Routes 兼容性

`next.config.js` 使用条件式 `output`：
- 开发/构建默认：`output: undefined`，API routes 正常工作
- 静态导出（M6）：`NEXT_PUBLIC_STATIC_EXPORT=true`，`output: "export"`

原因：Next.js 的 `output: "export"` 与 API Routes 不兼容。M1-M2 需要 API routes 执行 AI 调用（隐藏 API key），M6 部署时再迁移到 Cloudflare Pages Functions。

### 2. API Routes 与 IndexedDB

API Routes 运行在服务端，无法访问客户端 IndexedDB。设计模式：
- `/api/learn`：服务端调用 AI，返回完整 `LearningPlan`，客户端存 IndexedDB
- `/api/review`：客户端发送完整 `ReviewCard`，服务端用 FSRS 计算，返回更新后的卡片
- `/api/favorite`：纯逻辑计算，返回结果给客户端存储

### 3. FSRS 三种预设

| 预设 | request_retention | enable_fuzz | 含义 |
|------|-------------------|-------------|------|
| conservative | 0.95 | false | 高难度：更频繁复习 |
| standard | 0.9 | true | 默认：平衡 |
| aggressive | 0.8 | true | 低难度：较少复习 |

### 4. 拓扑排序 + 每日分配算法

- **拓扑排序**：Kahn 算法 BFS，同层按 difficulty 升序（先易后难）
- **每日分配**：节点耗时 = difficulty × 8min；每日容量 = dailyMinutes - 已安排复习时间
- **边界处理**：节点耗时 > 每日容量时独占一天；循环依赖不崩溃

### 5. 收藏快照设计

`FavoriteDeck` 是独立快照，包含完整 `questions[]` 和 `knowledgeTree[]` 副本。原 `LearningPlan` 删除后收藏不丢。单题收藏通过 `Question.favorited` 标记，收藏夹显示时从所有 plan 聚合。