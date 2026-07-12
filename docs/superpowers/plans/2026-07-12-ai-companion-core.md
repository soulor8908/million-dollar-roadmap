# AI 作战辅助系统 实施计划（核心篇）

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建 AI 作战辅助系统的核心：基础设施 + 今日指挥中心 + 情绪笔记 + 高效休息，让用户能立即用手机记录情绪、查看当前任务、使用休息工具。

**Architecture:** Next.js 14 App Router + TypeScript，部署 Vercel。通过 GitHub PAT 读写仓库 markdown 文件，与现有 Actions/dashboard.js 完全兼容。移动端优先 PWA。

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, GitHub REST API, Web Crypto API

**Spec:** [docs/superpowers/specs/2026-07-12-ai-companion-design.md](../specs/2026-07-12-ai-companion-design.md)

---

## 文件结构

```
app/
  layout.tsx                  # 根布局（PWA、字体、导航）
  page.tsx                    # 今日指挥中心
  emotion/page.tsx            # 情绪笔记
  rest/page.tsx               # 高效休息
  api/github/[...path]/route.ts  # GitHub API 代理
lib/
  github.ts                   # GitHub API 客户端
  storage.ts                  # token 加密存储
  routine.ts                  # 时间表解析
  emotion.ts                  # 情绪笔记解析
  types.ts                    # 共享类型
components/
  TokenGate.tsx               # token 输入门户
  CurrentTask.tsx             # "现在该做什么"卡片
  EnergyMeter.tsx             # 能量快记
  QuickEmotion.tsx            # 情绪快记表单
  EmotionList.tsx             # 情绪笔记列表
  BreathTimer.tsx             # 478呼吸计时器
  Nav.tsx                     # 底部导航
public/
  manifest.json               # PWA 配置
```

---

## Task 1: 更新现有项目文档（冻结项目1，确立新主线）

**Files:**
- Modify: `SYSTEM.md`
- Modify: `projects/ai-code-review.md`
- Create: `projects/ai-companion.md`
- Create: `rest/methods.md`

- [ ] **Step 1: 更新 SYSTEM.md 聚焦原则**

将 `SYSTEM.md` 中聚焦原则段落的主线从「项目1 AI Code Review」改为「AI 作战辅助系统」：

```markdown
## 聚焦原则（最高优先级元规则）

**同一时间只跑一条主线。深度复利，广度腐烂。**

- 当前唯一主线：**AI 作战辅助系统**（Next.js Web 应用，辅助本作战系统的执行）+ **算法筑基**。
- 原项目1（AI Code Review）已冻结（见 [projects/ai-code-review.md](projects/ai-code-review.md)），解冻条件：AI 作战辅助系统完成核心功能并上线。
- 项目2/3 继续冻结。
- 后端 Go 学习降级为「项目需要时再学」，不单独排期。
- 任何新想法先进 `ideas/` 暂存区，不立即开新坑。
```

- [ ] **Step 2: 冻结原项目1**

在 `projects/ai-code-review.md` 顶部加冻结横幅：

```markdown
# 🤖 项目1：AI辅助前端开发平台

> ⛄ **已冻结（2026-07-12）**：当前主线已切换为「AI 作战辅助系统」（见 [projects/ai-companion.md](ai-companion.md)）。
> 本文档保留作为 AI 作战辅助系统完成后的候选项。
> 解冻条件：AI 作战辅助系统核心功能上线并稳定运行 2 周。
```

- [ ] **Step 3: 创建新项目文档 `projects/ai-companion.md`**

```markdown
# 🎯 主线项目：AI 作战辅助系统

> 状态：🟢 进行中（2026-07-12 启动）
> 优先级：P0
> Spec：[docs/superpowers/specs/2026-07-12-ai-companion-design.md](../docs/superpowers/specs/2026-07-12-ai-companion-design.md)

## 项目定位
Next.js Web 应用，作为百万年薪作战系统的「前端」。让记录和查看变快变方便，提供情绪笔记、高效休息、智能提醒。

## 技术栈
- Next.js 14 App Router + TypeScript
- Tailwind CSS + shadcn/ui（移动端优先）
- Vercel 部署
- GitHub REST API（PAT 认证，读写 markdown）

## 里程碑

| 阶段 | 目标 | 时间 | 完成 |
|-----|------|------|------|
| M1 | 基础设施 + 今日指挥中心 + 情绪笔记 + 高效休息 | Week 1-2 | ⬜ |
| M2 | 日志记录 + 进度查看 + AI分析 | Week 3 | ⬜ |
| M3 | PWA + 部署上线 + 优化 | Week 4 | ⬜ |

## 每周投入
- 周末早起：2h × 2 = 4h（核心代码）
- 公司18:30-20:30：2h × 5 = 10h（开发）
- 周末晚上：2h × 2 = 4h（调试/优化）
- **总计：18h/周**（算法时间不动）

## 预期产出
- 可访问的 Web 应用（Vercel URL）
- 手机可装 PWA
- 情绪笔记 + 休息工具实际可用
```

- [ ] **Step 4: 创建休息方法库 `rest/methods.md`**

```markdown
# 高效休息方法库

## 按状态推荐

### 能量≤2 + 短时间（≤15min）
- NSDR 10min（瑜伽休息术，降低皮质醇）
- 478呼吸法 ×4轮（激活副交感神经）

### 能量≤2 + 有时间（≥30min）
- 小睡 20min（不超30min，避免深睡醒来更累）

### 能量3 + 需要重置
- 散步 10min（户外光照重置生物钟）
- 渐进式放松（从脚到头逐部位收紧-放松）

### 能量4-5 + 需要切换
- 远眺 5min（放松睫状肌，缓解眼疲劳）
- 喝水 + 走动（轻量切换）

## 478呼吸法
- 吸气4秒 → 屏息7秒 → 呼气8秒
- 循环4轮，约3分钟
- 原理：延长呼气激活迷走神经，快速降心率
- 适用：焦虑、紧张、睡前难以平静

## NSDR（Non-Sleep Deep Rest）
- 10-20分钟
- 原理：瑜伽休息术精简版，引导身体进入深度放松但保持意识
- 适用：午休、睡前过度兴奋时、下午能量低谷

## 渐进式放松
- 从脚趾开始，逐部位收紧5秒→放松10秒，向上到头部
- 全程约10分钟
- 适用：身体紧绷、长时间坐姿后

## 小睡
- 20分钟最佳（不进入深睡）
- 设闹钟，不超30分钟
- 醒后立即喝水、见光，加速清醒
- 适用：午休、严重疲惫时
```

- [ ] **Step 5: Commit**

```bash
git add SYSTEM.md projects/ai-code-review.md projects/ai-companion.md rest/methods.md
git commit -m "feat: 切换主线为AI作战辅助系统，冻结原项目1，创建休息方法库"
```

---

## Task 2: Next.js 脚手架 + 依赖

**Files:**
- Create: `app/` (Next.js 项目结构)
- Create: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.mjs`
- Create: `app/globals.css`, `app/layout.tsx`

- [ ] **Step 1: 在仓库根目录初始化 Next.js（不覆盖现有文件）**

由于仓库已有内容，手动创建 Next.js 项目结构而非用 create-next-app（避免覆盖）：

```bash
# 在仓库根目录创建 Next.js 项目文件
# package.json
```

- [ ] **Step 2: 创建 `package.json`**

```json
{
  "name": "million-dollar-roadmap",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "typescript": "^5.4.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0",
    "vitest": "^1.6.0",
    "@testing-library/react": "^15.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "jsdom": "^24.0.0"
  }
}
```

- [ ] **Step 3: 创建配置文件 `tsconfig.json`**

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
  "exclude": ["node_modules", "scripts/"]
}
```

- [ ] **Step 4: 创建 `tailwind.config.ts` + `postcss.config.mjs`**

```typescript
// tailwind.config.ts
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

```javascript
// postcss.config.mjs
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 5: 创建 `next.config.mjs`**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub API 代理通过 route handler，无需 rewrites
};
export default nextConfig;
```

- [ ] **Step 6: 创建 `app/globals.css`**

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

- [ ] **Step 7: 创建 `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "作战辅助系统",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "作战系统",
  },
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

- [ ] **Step 8: 创建 `public/manifest.json`**

```json
{
  "name": "作战辅助系统",
  "short_name": "作战系统",
  "description": "百万年薪作战系统的记录与提醒前端",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#f9fafb",
  "theme_color": "#f9fafb",
  "icons": []
}
```

- [ ] **Step 9: 创建占位首页 `app/page.tsx`**

```tsx
export default function Home() {
  return (
    <main className="p-4">
      <h1 className="text-xl font-bold">作战辅助系统</h1>
      <p className="text-gray-500 mt-2">脚手架就绪，待实现功能模块。</p>
    </main>
  );
}
```

- [ ] **Step 10: 安装依赖并验证**

```bash
npm install
npm run build
```
Expected: build 成功，无报错

- [ ] **Step 11: 更新 `.gitignore`**

在现有 `.gitignore` 末尾追加：

```
# Next.js
.next/
next-env.d.ts
```

- [ ] **Step 12: Commit**

```bash
git add package.json tsconfig.json tailwind.config.ts postcss.config.mjs next.config.mjs app/ public/ .gitignore
git commit -m "feat: Next.js 14 脚手架 + PWA 配置"
```

---

## Task 3: 共享类型定义 `lib/types.ts`

**Files:**
- Create: `lib/types.ts`

- [ ] **Step 1: 创建类型文件**

```typescript
// lib/types.ts

// 能量值 1-5
export type EnergyLevel = 1 | 2 | 3 | 4 | 5;

// 情绪标签
export type EmotionTag =
  | "焦虑"
  | "兴奋"
  | "疲惫"
  | "烦躁"
  | "满足"
  | "冲动"
  | "平静"
  | "沮丧";

// 多巴胺干扰标记
export type DopamineTrigger = "刷手机" | "游戏" | "短视频" | "甜食" | "无";

// 情绪笔记单条记录
export interface EmotionEntry {
  time: string;        // "HH:MM"
  tag: EmotionTag;
  emoji: string;
  trigger: string;     // 触发事件
  impact: string;      // 对学习/休息的影响
  coping: string;      // 采取的应对
  dopamine: DopamineTrigger;
}

// 一天的情绪笔记文件
export interface EmotionFile {
  date: string;        // "YYYY-MM-DD"
  entries: EmotionEntry[];
}

// 时间表中的单个时段
export interface RoutineSlot {
  start: string;       // "HH:MM"
  end: string;         // "HH:MM"
  activity: string;
  type: "运动" | "学习" | "休息" | "家庭" | "睡眠" | "工作" | "其他";
}

// 当前任务（解析时间表后）
export interface CurrentTask {
  current: RoutineSlot | null;
  next: RoutineSlot | null;
  minutesLeft: number; // 当前任务剩余分钟
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/types.ts
git commit -m "feat: 共享类型定义"
```

---

## Task 4: Token 加密存储 `lib/storage.ts`

**Files:**
- Create: `lib/storage.ts`
- Create: `lib/__tests__/storage.test.ts`

- [ ] **Step 1: 写失败测试**

```typescript
// lib/__tests__/storage.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { saveToken, loadToken, clearToken } from "../storage";

describe("storage", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("saveToken 后 loadToken 能取回原文", async () => {
    await saveToken("ghp_test123");
    const loaded = await loadToken();
    expect(loaded).toBe("ghp_test123");
  });

  it("clearToken 后 loadToken 返回 null", async () => {
    await saveToken("ghp_test123");
    clearToken();
    const loaded = await loadToken();
    expect(loaded).toBeNull();
  });

  it("未存储时 loadToken 返回 null", async () => {
    const loaded = await loadToken();
    expect(loaded).toBeNull();
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

```bash
npx vitest run lib/__tests__/storage.test.ts
```
Expected: FAIL，模块不存在

- [ ] **Step 3: 实现 `lib/storage.ts`**

```typescript
// lib/storage.ts
// 使用 Web Crypto API (AES-GCM) 加密 GitHub PAT，存入 sessionStorage
// 密钥每次会话生成，关闭浏览器即失效

const STORAGE_KEY = "encrypted_token";
const KEY_ALG = "AES-GCM";

async function getKey(): Promise<CryptoKey> {
  const existing = sessionStorage.getItem("token_key");
  if (existing) {
    const raw = Uint8Array.from(atob(existing), (c) => c.charCodeAt(0));
    return crypto.subtle.importKey("raw", raw, KEY_ALG, false, [
      "encrypt",
      "decrypt",
    ]);
  }
  // 生成新密钥
  const key = await crypto.subtle.generateKey(
    { name: KEY_ALG, length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
  const raw = await crypto.subtle.exportKey("raw", key);
  const b64 = btoa(String.fromCharCode(...new Uint8Array(raw)));
  sessionStorage.setItem("token_key", b64);
  return key;
}

export async function saveToken(token: string): Promise<void> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(token);
  const encrypted = await crypto.subtle.encrypt(
    { name: KEY_ALG, iv },
    key,
    encoded
  );
  // 合并 iv + 密文，base64 存储
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encrypted), iv.length);
  sessionStorage.setItem(STORAGE_KEY, btoa(String.fromCharCode(...combined)));
}

export async function loadToken(): Promise<string | null> {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  try {
    const key = await getKey();
    const combined = Uint8Array.from(atob(stored), (c) => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);
    const decrypted = await crypto.subtle.decrypt(
      { name: KEY_ALG, iv },
      key,
      ciphertext
    );
    return new TextDecoder().decode(decrypted);
  } catch {
    return null;
  }
}

export function clearToken(): void {
  sessionStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem("token_key");
}
```

- [ ] **Step 4: 运行测试确认通过**

```bash
npx vitest run lib/__tests__/storage.test.ts
```
Expected: PASS（3 tests）

- [ ] **Step 5: Commit**

```bash
git add lib/storage.ts lib/__tests__/storage.test.ts
git commit -m "feat: token 加密存储（AES-GCM + sessionStorage）"
```

---

## Task 5: GitHub API 客户端 `lib/github.ts`

**Files:**
- Create: `lib/github.ts`
- Create: `lib/__tests__/github.test.ts`

- [ ] **Step 1: 写失败测试**

```typescript
// lib/__tests__/github.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { GitHubClient } from "../github";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("GitHubClient", () => {
  let client: GitHubClient;

  beforeEach(() => {
    client = new GitHubClient("owner", "repo", "ghp_test");
    mockFetch.mockReset();
  });

  it("readFile 返回解码后的内容", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        content: btoa("hello world"),
        sha: "abc123",
      }),
    });
    const result = await client.readFile("daily/2026-07-13.md");
    expect(result.content).toBe("hello world");
    expect(result.sha).toBe("abc123");
  });

  it("readFile 文件不存在时返回 null", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ message: "Not Found" }),
    });
    const result = await client.readFile("nonexistent.md");
    expect(result).toBeNull();
  });

  it("writeFile 新文件时调用 PUT 且不带 sha", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ content: { sha: "new123" } }),
    });
    await client.writeFile("emotion/2026-07-13.md", "content", "msg");
    const call = mockFetch.mock.calls[0];
    const body = JSON.parse(call[1].body);
    expect(body.sha).toBeUndefined();
    expect(body.content).toBe(btoa("content"));
    expect(body.message).toBe("msg");
  });

  it("writeFile 更新文件时带 sha", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ content: { sha: "updated" } }),
    });
    await client.writeFile("daily/2026-07-13.md", "new", "msg", "oldsha");
    const call = mockFetch.mock.calls[0];
    const body = JSON.parse(call[1].body);
    expect(body.sha).toBe("oldsha");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

```bash
npx vitest run lib/__tests__/github.test.ts
```
Expected: FAIL

- [ ] **Step 3: 实现 `lib/github.ts`**

```typescript
// lib/github.ts

export interface FileContent {
  content: string;
  sha: string;
}

export class GitHubClient {
  constructor(
    private owner: string,
    private repo: string,
    private token: string
  ) {}

  private async api(path: string, init?: RequestInit): Promise<Response> {
    const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${path}`;
    return fetch(url, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  }

  async readFile(path: string): Promise<FileContent | null> {
    const res = await this.api(path);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
    const data = await res.json();
    // base64 解码（GitHub 返回 base64 编码内容）
    const content = new TextDecoder().decode(
      Uint8Array.from(atob(data.content.replace(/\n/g, "")), (c) => c.charCodeAt(0))
    );
    return { content, sha: data.sha };
  }

  async writeFile(
    path: string,
    content: string,
    message: string,
    sha?: string
  ): Promise<string> {
    const body: Record<string, string> = {
      message,
      content: btoa(unescape(encodeURIComponent(content))),
    };
    if (sha) body.sha = sha;

    const res = await this.api(path, {
      method: "PUT",
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data.content.sha as string;
  }

  async listFiles(dirPath: string): Promise<string[]> {
    const url = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${dirPath}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.token}`,
        Accept: "application/vnd.github+json",
      },
    });
    if (res.status === 404) return [];
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data
      .filter((item: { type: string; name: string }) => item.type === "file")
      .map((item: { name: string }) => item.name);
  }
}
```

- [ ] **Step 4: 运行测试确认通过**

```bash
npx vitest run lib/__tests__/github.test.ts
```
Expected: PASS（4 tests）

- [ ] **Step 5: Commit**

```bash
git add lib/github.ts lib/__tests__/github.test.ts
git commit -m "feat: GitHub API 客户端（read/write/list）"
```

---

## Task 6: GitHub API 代理路由

**Files:**
- Create: `app/api/github/[...path]/route.ts`

- [ ] **Step 1: 创建代理路由**

```typescript
// app/api/github/[...path]/route.ts
// 代理前端请求到 GitHub API，附加 PAT，避免浏览器 CORS 和 token 暴露

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const token = req.headers.get("x-github-token");
  if (!token) {
    return NextResponse.json({ error: "未提供 token" }, { status: 401 });
  }

  const path = params.path.join("/");
  const owner = process.env.GITHUB_OWNER || "soulor8908";
  const repo = process.env.GITHUB_REPO || "million-dollar-roadmap";
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const token = req.headers.get("x-github-token");
  if (!token) {
    return NextResponse.json({ error: "未提供 token" }, { status: 401 });
  }

  const path = params.path.join("/");
  const owner = process.env.GITHUB_OWNER || "soulor8908";
  const repo = process.env.GITHUB_REPO || "million-dollar-roadmap";
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const body = await req.text();

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body,
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
```

- [ ] **Step 2: 验证编译**

```bash
npm run build
```
Expected: 编译成功

- [ ] **Step 3: Commit**

```bash
git add app/api/github/[...path]/route.ts
git commit -m "feat: GitHub API 代理路由（GET/PUT）"
```

---

## Task 7: 时间表解析 `lib/routine.ts`

**Files:**
- Create: `lib/routine.ts`
- Create: `lib/__tests__/routine.test.ts`

- [ ] **Step 1: 写失败测试**

```typescript
// lib/__tests__/routine.test.ts
import { describe, it, expect } from "vitest";
import { parseRoutine, getCurrentTask } from "../routine";
import type { RoutineSlot } from "../types";

const sampleMarkdown = `
## 工作日时间表

| 时间 | 事项 | 类型 |
|-----|------|------|
| 6:00-6:30 | 🏃 **晨练**：俯卧撑/拉伸 | 💪 运动 |
| 6:30-7:00 | 🎯 **黄金30min**：算法 | 📚 学习 |
| 7:00-8:20 | 🎯 通勤算法 | 📚 学习 |
| 18:30-20:30 | 🎯 **公司学习2小时** | 📚 学习 |
| 22:00-22:45 | **陪娃洗漱陪玩** | 👨‍👧 家庭 |
`;

describe("routine", () => {
  it("parseRoutine 解析时间表行", () => {
    const slots = parseRoutine(sampleMarkdown);
    expect(slots).toHaveLength(5);
    expect(slots[0].start).toBe("06:00");
    expect(slots[0].end).toBe("06:30");
    expect(slots[0].activity).toContain("晨练");
  });

  it("getCurrentTask 返回当前时段和下一个", () => {
    const slots: RoutineSlot[] = [
      { start: "06:00", end: "06:30", activity: "晨练", type: "运动" },
      { start: "06:30", end: "07:00", activity: "算法", type: "学习" },
      { start: "07:00", end: "08:20", activity: "通勤算法", type: "学习" },
    ];
    // 6:15 在第一个时段
    const result = getCurrentTask(slots, "06:15");
    expect(result.current?.activity).toBe("晨练");
    expect(result.next?.activity).toBe("算法");
    expect(result.minutesLeft).toBe(15);
  });

  it("getCurrentTask 时段之间返回 null current + next", () => {
    const slots: RoutineSlot[] = [
      { start: "06:00", end: "06:30", activity: "晨练", type: "运动" },
      { start: "06:30", end: "07:00", activity: "算法", type: "学习" },
    ];
    const result = getCurrentTask(slots, "08:00");
    expect(result.current).toBeNull();
    expect(result.next).toBeNull();
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

```bash
npx vitest run lib/__tests__/routine.test.ts
```
Expected: FAIL

- [ ] **Step 3: 实现 `lib/routine.ts`**

```typescript
// lib/routine.ts
// 解析 schedule/routine.md 的时间表，计算"现在该做什么"

import type { RoutineSlot, CurrentTask } from "./types";

// 把 "6:00" 规范化为 "06:00"
function normalizeTime(t: string): string {
  const [h, m] = t.split(":");
  return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
}

// "HH:MM" → 当天分钟数
function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function parseRoutine(markdown: string): RoutineSlot[] {
  const slots: RoutineSlot[] = [];
  const lines = markdown.split("\n");

  for (const line of lines) {
    // 匹配 | 6:00-6:30 | ... | 💪 运动 |
    const match = line.match(/\|\s*(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|/);
    if (!match) continue;

    const [, startRaw, endRaw, activityRaw, typeRaw] = match;
    const start = normalizeTime(startRaw);
    const end = normalizeTime(endRaw);

    // 清理 activity（去掉 markdown 强调和 emoji 前缀，保留可读文本）
    const activity = activityRaw
      .replace(/\*\*/g, "")
      .replace(/[🏃🎯😴🛏️👨‍👧💪📚💼🔋]/g, "")
      .trim();

    // 映射类型
    let type: RoutineSlot["type"] = "其他";
    if (typeRaw.includes("运动")) type = "运动";
    else if (typeRaw.includes("学习")) type = "学习";
    else if (typeRaw.includes("休息")) type = "休息";
    else if (typeRaw.includes("家庭")) type = "家庭";
    else if (typeRaw.includes("睡眠")) type = "睡眠";
    else if (typeRaw.includes("工作")) type = "工作";

    slots.push({ start, end, activity, type });
  }

  return slots;
}

export function getCurrentTask(
  slots: RoutineSlot[],
  now: string
): CurrentTask {
  const nowMin = toMinutes(now);

  let current: RoutineSlot | null = null;
  let next: RoutineSlot | null = null;
  let minutesLeft = 0;

  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    const startMin = toMinutes(slot.start);
    const endMin = toMinutes(slot.end);

    if (nowMin >= startMin && nowMin < endMin) {
      current = slot;
      minutesLeft = endMin - nowMin;
      next = slots[i + 1] ?? null;
      break;
    }
    if (nowMin < startMin) {
      next = slot;
      break;
    }
  }

  return { current, next, minutesLeft };
}
```

- [ ] **Step 4: 运行测试确认通过**

```bash
npx vitest run lib/__tests__/routine.test.ts
```
Expected: PASS（3 tests）

- [ ] **Step 5: Commit**

```bash
git add lib/routine.ts lib/__tests__/routine.test.ts
git commit -m "feat: 时间表解析 + 当前任务计算"
```

---

## Task 8: 情绪笔记解析 `lib/emotion.ts`

**Files:**
- Create: `lib/emotion.ts`
- Create: `lib/__tests__/emotion.test.ts`

- [ ] **Step 1: 写失败测试**

```typescript
// lib/__tests__/emotion.test.ts
import { describe, it, expect } from "vitest";
import { parseEmotionFile, formatEmotionEntry } from "../emotion";

const sampleMarkdown = `# 📖 2026-07-13 情绪笔记

## 情绪记录

### 14:30 | 焦虑 😰
- 触发：算法题卡住30min没思路
- 影响：想刷手机逃避
- 应对：起身喝水 + 478呼吸3轮
- 多巴胺干扰：否

### 20:00 | 疲惫 😴
- 触发：连续学习2h
- 影响：注意力下降
- 应对：切换到简单任务
- 多巴胺干扰：刷手机
`;

describe("emotion", () => {
  it("parseEmotionFile 解析多条记录", () => {
    const result = parseEmotionFile(sampleMarkdown, "2026-07-13");
    expect(result.date).toBe("2026-07-13");
    expect(result.entries).toHaveLength(2);
    expect(result.entries[0].time).toBe("14:30");
    expect(result.entries[0].tag).toBe("焦虑");
    expect(result.entries[0].emoji).toBe("😰");
    expect(result.entries[0].trigger).toBe("算法题卡住30min没思路");
    expect(result.entries[0].dopamine).toBe("无");
  });

  it("parseEmotionFile 空文件返回空数组", () => {
    const result = parseEmotionFile("# 空\n", "2026-07-13");
    expect(result.entries).toHaveLength(0);
  });

  it("formatEmotionEntry 生成 markdown 片段", () => {
    const entry = {
      time: "14:30",
      tag: "焦虑" as const,
      emoji: "😰",
      trigger: "算法卡住",
      impact: "想刷手机",
      coping: "478呼吸",
      dopamine: "无" as const,
    };
    const md = formatEmotionEntry(entry);
    expect(md).toContain("### 14:30 | 焦虑 😰");
    expect(md).toContain("- 触发：算法卡住");
    expect(md).toContain("- 多巴胺干扰：无");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

```bash
npx vitest run lib/__tests__/emotion.test.ts
```
Expected: FAIL

- [ ] **Step 3: 实现 `lib/emotion.ts`**

```typescript
// lib/emotion.ts
// 解析和格式化情绪笔记 markdown

import type { EmotionEntry, EmotionFile, DopamineTrigger } from "./types";

const EMOTION_EMOJIS: Record<string, string> = {
  "焦虑": "😰",
  "兴奋": "🤩",
  "疲惫": "😴",
  "烦躁": "😤",
  "满足": "😊",
  "冲动": "🔥",
  "平静": "😌",
  "沮丧": "😞",
};

export function getEmoji(tag: string): string {
  return EMOTION_EMOJIS[tag] ?? "❓";
}

export function parseEmotionFile(
  markdown: string,
  date: string
): EmotionFile {
  const entries: EmotionEntry[] = [];
  const lines = markdown.split("\n");

  let current: Partial<EmotionEntry> | null = null;

  for (const line of lines) {
    // ### 14:30 | 焦虑 😰
    const headerMatch = line.match(/^### (\d{2}:\d{2}) \| (.+?)\s+(.+)$/);
    if (headerMatch) {
      if (current && current.time) {
        entries.push(current as EmotionEntry);
      }
      current = {
        time: headerMatch[1],
        tag: headerMatch[2] as EmotionEntry["tag"],
        emoji: headerMatch[3],
      };
      continue;
    }

    if (!current) continue;

    const triggerMatch = line.match(/^- 触发：(.+)$/);
    if (triggerMatch) current.trigger = triggerMatch[1];

    const impactMatch = line.match(/^- 影响：(.+)$/);
    if (impactMatch) current.impact = impactMatch[1];

    const copingMatch = line.match(/^- 应对：(.+)$/);
    if (copingMatch) current.coping = copingMatch[1];

    const dopamineMatch = line.match(/^- 多巴胺干扰：(.+)$/);
    if (dopamineMatch) {
      const val = dopamineMatch[1].trim();
      current.dopamine = (val === "否" ? "无" : val) as DopamineTrigger;
    }
  }

  if (current && current.time) {
    entries.push(current as EmotionEntry);
  }

  return { date, entries };
}

export function formatEmotionEntry(entry: EmotionEntry): string {
  return `### ${entry.time} | ${entry.tag} ${entry.emoji}
- 触发：${entry.trigger}
- 影响：${entry.impact}
- 应对：${entry.coping}
- 多巴胺干扰：${entry.dopamine === "无" ? "否" : entry.dopamine}`;
}

// 把新条目追加到现有文件内容
export function appendEntry(
  existingContent: string,
  entry: EmotionEntry
): string {
  const entryMd = formatEmotionEntry(entry);
  // 如果文件已有"## 情绪记录"段，追加到其后
  if (existingContent.includes("## 情绪记录")) {
    return existingContent.replace(
      /## 情绪记录\n/,
      `## 情绪记录\n\n${entryMd}\n`
    );
  }
  // 否则创建完整文件
  return `# 📖 ${new Date().toISOString().split("T")[0]} 情绪笔记\n\n## 情绪记录\n\n${entryMd}\n`;
}
```

- [ ] **Step 4: 运行测试确认通过**

```bash
npx vitest run lib/__tests__/emotion.test.ts
```
Expected: PASS（3 tests）

- [ ] **Step 5: Commit**

```bash
git add lib/emotion.ts lib/__tests__/emotion.test.ts
git commit -m "feat: 情绪笔记解析与格式化"
```

---

## Task 9: Token 输入门户组件

**Files:**
- Create: `components/TokenGate.tsx`
- Create: `lib/githubConfig.ts`

- [ ] **Step 1: 创建配置文件 `lib/githubConfig.ts`**

```typescript
// lib/githubConfig.ts
// GitHub 仓库配置，环境变量优先，默认值兜底

export const GITHUB_OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER || "soulor8908";
export const GITHUB_REPO =
  process.env.NEXT_PUBLIC_GITHUB_REPO || "million-dollar-roadmap";
```

- [ ] **Step 2: 创建 `components/TokenGate.tsx`**

```tsx
"use client";

import { useState, useEffect, ReactNode } from "react";
import { loadToken, saveToken, clearToken } from "@/lib/storage";

export function TokenGate({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadToken()
      .then(setToken)
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    setError("");
    try {
      await saveToken(input.trim());
      setToken(input.trim());
      setInput("");
    } catch {
      setError("保存失败，请重试");
    }
  }

  function handleClear() {
    clearToken();
    setToken(null);
  }

  if (loading) {
    return (
      <div className="p-4 text-gray-500">加载中...</div>
    );
  }

  if (!token) {
    return (
      <div className="max-w-md mx-auto p-6 mt-10">
        <h1 className="text-xl font-bold mb-4">🔐 输入 GitHub Token</h1>
        <p className="text-sm text-gray-500 mb-4">
          需要带 <code className="bg-gray-100 px-1 rounded">repo</code> 权限的 Personal Access Token。
          Token 加密存在 sessionStorage，关闭浏览器即清除。
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ghp_xxxxxxxxxxxx"
            className="w-full border rounded px-3 py-2 text-sm"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-black text-white rounded py-2 text-sm font-medium"
          >
            保存
          </button>
        </form>
        <a
          href="https://github.com/settings/tokens/new?scopes=repo"
          target="_blank"
          rel="noopener noreferrer"
          className="block text-center text-blue-500 text-sm mt-3"
        >
          去 GitHub 创建 Token →
        </a>
      </div>
    );
  }

  return (
    <div>
      {children}
      <button
        onClick={handleClear}
        className="fixed bottom-2 right-2 text-xs text-gray-400"
      >
        退出
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/githubConfig.ts components/TokenGate.tsx
git commit -m "feat: token 输入门户组件"
```

---

## Task 10: 底部导航组件 + 布局集成

**Files:**
- Create: `components/Nav.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: 创建 `components/Nav.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "今日", icon: "🎯" },
  { href: "/emotion", label: "情绪", icon: "📖" },
  { href: "/rest", label: "休息", icon: "😴" },
  { href: "/daily", label: "日志", icon: "📝" },
  { href: "/progress", label: "进度", icon: "📊" },
];

export function Nav() {
  const pathname = usePathname();

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

- [ ] **Step 2: 更新 `app/layout.tsx` 集成 TokenGate 和 Nav**

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { TokenGate } from "@/components/TokenGate";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "作战辅助系统",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "作战系统",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-50 text-gray-900 min-h-screen pb-16">
        <TokenGate>
          {children}
          <Nav />
        </TokenGate>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/Nav.tsx app/layout.tsx
git commit -m "feat: 底部导航 + 布局集成 TokenGate"
```

---

## Task 11: 今日指挥中心 - "现在该做什么" + 能量快记

**Files:**
- Create: `components/CurrentTask.tsx`
- Create: `components/EnergyMeter.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: 创建 `components/CurrentTask.tsx`**

```tsx
"use client";

import { useState, useEffect } from "react";
import { parseRoutine, getCurrentTask } from "@/lib/routine";
import type { CurrentTask as CurrentTaskType } from "@/lib/types";

export function CurrentTask({ routineMarkdown }: { routineMarkdown: string }) {
  const [task, setTask] = useState<CurrentTaskType | null>(null);

  useEffect(() => {
    const slots = parseRoutine(routineMarkdown);
    const update = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      setTask(getCurrentTask(slots, `${hh}:${mm}`));
    };
    update();
    const timer = setInterval(update, 30000); // 每30秒刷新
    return () => clearInterval(timer);
  }, [routineMarkdown]);

  if (!task) return <div className="text-gray-400">加载中...</div>;

  if (!task.current) {
    return (
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <p className="text-gray-500 text-sm">当前无安排</p>
        {task.next && (
          <p className="text-sm mt-1">
            下一项：<span className="font-medium">{task.next.activity}</span>
            （{task.next.start}）
          </p>
        )}
      </div>
    );
  }

  const typeColors: Record<string, string> = {
    运动: "bg-orange-50 border-orange-200",
    学习: "bg-blue-50 border-blue-200",
    休息: "bg-green-50 border-green-200",
    家庭: "bg-pink-50 border-pink-200",
    睡眠: "bg-purple-50 border-purple-200",
    工作: "bg-gray-50 border-gray-200",
    其他: "bg-white border-gray-200",
  };

  return (
    <div className={`rounded-xl p-4 border-2 ${typeColors[task.current.type] || typeColors.其他}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs text-gray-500 mb-1">现在该做什么</p>
          <p className="text-lg font-bold">{task.current.activity}</p>
          <p className="text-sm text-gray-500">
            {task.current.start} - {task.current.end}
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{task.minutesLeft}</p>
          <p className="text-xs text-gray-500">分钟剩余</p>
        </div>
      </div>
      {task.next && (
        <p className="text-xs text-gray-400 mt-2">
          下一项：{task.next.activity}（{task.next.start}）
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 创建 `components/EnergyMeter.tsx`**

```tsx
"use client";

import { useState } from "react";
import type { EnergyLevel } from "@/lib/types";

export function EnergyMeter() {
  const [energy, setEnergy] = useState<EnergyLevel | null>(null);
  const [saved, setSaved] = useState(false);

  function record(level: EnergyLevel) {
    setEnergy(level);
    setSaved(true);
    // 实际写入 daily 日志的逻辑在 Task 11 之后接入
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <p className="text-xs text-gray-500 mb-2">能量快记</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => record(n as EnergyLevel)}
            className={`flex-1 py-3 rounded-lg text-lg font-bold transition ${
              energy === n
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-1 text-center">
        {saved ? "✓ 已记录" : "1=濒溃 5=巅峰"}
      </p>
    </div>
  );
}
```

- [ ] **Step 3: 更新 `app/page.tsx` 整合首页**

```tsx
"use client";

import { useEffect, useState } from "react";
import { CurrentTask } from "@/components/CurrentTask";
import { EnergyMeter } from "@/components/EnergyMeter";
import { loadToken } from "@/lib/storage";
import { GitHubClient } from "@/lib/github";
import { GITHUB_OWNER, GITHUB_REPO } from "@/lib/githubConfig";

export default function Home() {
  const [routine, setRoutine] = useState<string>("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const token = await loadToken();
      if (!token) return;
      const client = new GitHubClient(GITHUB_OWNER, GITHUB_REPO, token);
      try {
        const file = await client.readFile("schedule/routine.md");
        if (file) setRoutine(file.content);
      } catch (e) {
        setError(e instanceof Error ? e.message : "加载失败");
      }
    })();
  }, []);

  return (
    <main className="p-4 space-y-4 max-w-md mx-auto">
      <h1 className="text-lg font-bold">🎯 今日指挥中心</h1>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {routine ? <CurrentTask routineMarkdown={routine} /> : (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-400 text-sm">加载时间表...</p>
        </div>
      )}

      <EnergyMeter />

      <div className="grid grid-cols-3 gap-2">
        <a href="/emotion" className="bg-white rounded-xl p-3 shadow-sm text-center">
          <p className="text-2xl">📖</p>
          <p className="text-xs mt-1">记情绪</p>
        </a>
        <a href="/rest" className="bg-white rounded-xl p-3 shadow-sm text-center">
          <p className="text-2xl">😴</p>
          <p className="text-xs mt-1">去休息</p>
        </a>
        <a href="/daily" className="bg-white rounded-xl p-3 shadow-sm text-center">
          <p className="text-2xl">📝</p>
          <p className="text-xs mt-1">写日志</p>
        </a>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: 验证编译**

```bash
npm run build
```
Expected: 编译成功

- [ ] **Step 5: Commit**

```bash
git add components/CurrentTask.tsx components/EnergyMeter.tsx app/page.tsx
git commit -m "feat: 今日指挥中心（当前任务卡片 + 能量快记）"
```

---

## Task 12: 情绪笔记页面（记录 + 回看）

**Files:**
- Create: `components/QuickEmotion.tsx`
- Create: `components/EmotionList.tsx`
- Create: `app/emotion/page.tsx`

- [ ] **Step 1: 创建 `components/QuickEmotion.tsx`**

```tsx
"use client";

import { useState } from "react";
import type { EmotionEntry, EmotionTag, DopamineTrigger } from "@/lib/types";
import { getEmoji, formatEmotionEntry, appendEntry } from "@/lib/emotion";
import { loadToken } from "@/lib/storage";
import { GitHubClient } from "@/lib/github";
import { GITHUB_OWNER, GITHUB_REPO } from "@/lib/githubConfig";

const TAGS: EmotionTag[] = ["焦虑", "兴奋", "疲惫", "烦躁", "满足", "冲动", "平静", "沮丧"];
const DOPAMINE: DopamineTrigger[] = ["无", "刷手机", "游戏", "短视频", "甜食"];

export function QuickEmotion() {
  const [tag, setTag] = useState<EmotionTag | null>(null);
  const [trigger, setTrigger] = useState("");
  const [impact, setImpact] = useState("");
  const [coping, setCoping] = useState("");
  const [dopamine, setDopamine] = useState<DopamineTrigger>("无");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function submit() {
    if (!tag || !trigger.trim()) return;
    setStatus("saving");
    try {
      const token = await loadToken();
      if (!token) { setStatus("error"); return; }
      const client = new GitHubClient(GITHUB_OWNER, GITHUB_REPO, token);

      const now = new Date();
      const date = now.toISOString().split("T")[0];
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      const entry: EmotionEntry = {
        time,
        tag,
        emoji: getEmoji(tag),
        trigger: trigger.trim(),
        impact: impact.trim() || "—",
        coping: coping.trim() || "—",
        dopamine,
      };

      const path = `emotion/${date}.md`;
      const existing = await client.readFile(path);
      const newContent = appendEntry(existing?.content || "", entry);
      await client.writeFile(path, newContent, `emotion: ${date} ${time} ${tag}`, existing?.sha);

      setStatus("saved");
      setTag(null);
      setTrigger("");
      setImpact("");
      setCoping("");
      setDopamine("无");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
      <p className="text-sm font-medium">快速记录情绪</p>

      <div>
        <p className="text-xs text-gray-500 mb-1">情绪</p>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((t) => (
            <button
              key={t}
              onClick={() => setTag(t)}
              className={`px-3 py-1 rounded-full text-sm ${
                tag === t ? "bg-black text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              {getEmoji(t)} {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-1">触发事件 *</p>
        <input
          value={trigger}
          onChange={(e) => setTrigger(e.target.value)}
          placeholder="什么事引发了这种情绪"
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-1">对学习/休息的影响</p>
        <input
          value={impact}
          onChange={(e) => setImpact(e.target.value)}
          placeholder="可选"
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-1">采取的应对</p>
        <input
          value={coping}
          onChange={(e) => setCoping(e.target.value)}
          placeholder="可选"
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-1">多巴胺干扰</p>
        <div className="flex flex-wrap gap-2">
          {DOPAMINE.map((d) => (
            <button
              key={d}
              onClick={() => setDopamine(d)}
              className={`px-3 py-1 rounded-full text-sm ${
                dopamine === d ? "bg-black text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={submit}
        disabled={!tag || !trigger.trim() || status === "saving"}
        className="w-full bg-black text-white rounded py-2 text-sm font-medium disabled:opacity-40"
      >
        {status === "saving" ? "保存中..." : status === "saved" ? "✓ 已记录" : "记录"}
      </button>

      {status === "error" && (
        <p className="text-red-500 text-xs">保存失败，请检查网络和 token</p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 创建 `components/EmotionList.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { loadToken } from "@/lib/storage";
import { GitHubClient } from "@/lib/github";
import { GITHUB_OWNER, GITHUB_REPO } from "@/lib/githubConfig";
import { parseEmotionFile } from "@/lib/emotion";
import type { EmotionFile } from "@/lib/types";

export function EmotionList() {
  const [files, setFiles] = useState<EmotionFile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = await loadToken();
      if (!token) { setLoading(false); return; }
      const client = new GitHubClient(GITHUB_OWNER, GITHUB_REPO, token);
      try {
        const names = await client.listFiles("emotion");
        const recent = names
          .filter((n) => /^\d{4}-\d{2}-\d{2}\.md$/.test(n))
          .sort()
          .slice(-7);
        const loaded = await Promise.all(
          recent.map(async (name) => {
            const file = await client.readFile(`emotion/${name}`);
            return parseEmotionFile(file?.content || "", name.replace(".md", ""));
          })
        );
        setFiles(loaded.reverse()); // 最近在前
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-gray-400 text-sm">加载中...</p>;

  // 统计
  const tagCount: Record<string, number> = {};
  files.forEach((f) => f.entries.forEach((e) => {
    tagCount[e.tag] = (tagCount[e.tag] || 0) + 1;
  }));

  return (
    <div className="space-y-3">
      <div className="bg-white rounded-xl p-3 shadow-sm">
        <p className="text-xs text-gray-500 mb-2">最近7天情绪统计</p>
        {Object.keys(tagCount).length === 0 ? (
          <p className="text-sm text-gray-400">暂无记录</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {Object.entries(tagCount).map(([tag, count]) => (
              <span key={tag} className="px-2 py-1 bg-gray-100 rounded text-sm">
                {tag} ×{count}
              </span>
            ))}
          </div>
        )}
      </div>

      {files.map((file) => (
        <div key={file.date} className="bg-white rounded-xl p-3 shadow-sm">
          <p className="text-sm font-medium mb-2">{file.date}</p>
          {file.entries.length === 0 ? (
            <p className="text-xs text-gray-400">无记录</p>
          ) : (
            file.entries.map((entry, i) => (
              <div key={i} className="border-l-2 border-gray-200 pl-3 mb-2 last:mb-0">
                <p className="text-sm">
                  <span className="text-gray-400">{entry.time}</span>{" "}
                  {entry.emoji} {entry.tag}
                  {entry.dopamine !== "无" && (
                    <span className="ml-2 text-xs bg-red-50 text-red-500 px-1 rounded">
                      {entry.dopamine}
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500 mt-1">{entry.trigger}</p>
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: 创建 `app/emotion/page.tsx`**

```tsx
import { QuickEmotion } from "@/components/QuickEmotion";
import { EmotionList } from "@/components/EmotionList";

export default function EmotionPage() {
  return (
    <main className="p-4 space-y-4 max-w-md mx-auto">
      <h1 className="text-lg font-bold">📖 情绪笔记</h1>
      <QuickEmotion />
      <div>
        <p className="text-xs text-gray-500 mb-2">晨练回看 · 最近7天</p>
        <EmotionList />
      </div>
    </main>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add components/QuickEmotion.tsx components/EmotionList.tsx app/emotion/page.tsx
git commit -m "feat: 情绪笔记页面（快速记录 + 7天回看）"
```

---

## Task 13: 高效休息页面 + 478呼吸计时器

**Files:**
- Create: `components/BreathTimer.tsx`
- Create: `app/rest/page.tsx`

- [ ] **Step 1: 创建 `components/BreathTimer.tsx`**

```tsx
"use client";

import { useState, useEffect, useRef } from "react";

type Phase = "idle" | "inhale" | "hold" | "exhale" | "done";

const PHASES: { name: Phase; label: string; duration: number; color: string }[] = [
  { name: "inhale", label: "吸气", duration: 4, color: "bg-blue-100" },
  { name: "hold", label: "屏息", duration: 7, color: "bg-yellow-100" },
  { name: "exhale", label: "呼气", duration: 8, color: "bg-green-100" },
];

export function BreathTimer() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [countdown, setCountdown] = useState(0);
  const [round, setRound] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;

    let phaseIdx = 0;
    let currentPhase = PHASES[phaseIdx];
    setPhase(currentPhase.name);
    setCountdown(currentPhase.duration);
    setRound(1);

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) return prev - 1;

        // 进入下一阶段
        phaseIdx++;
        if (phaseIdx >= PHASES.length) {
          // 一轮完成
          setRound((r) => {
            if (r >= 4) {
              // 全部完成
              setRunning(false);
              setPhase("done");
              if (timerRef.current) clearInterval(timerRef.current);
              return r;
            }
            return r + 1;
          });
          phaseIdx = 0;
        }
        currentPhase = PHASES[phaseIdx];
        setPhase(currentPhase.name);
        return currentPhase.duration;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running]);

  function start() {
    setPhase("inhale");
    setRound(1);
    setRunning(true);
  }

  function stop() {
    setRunning(false);
    setPhase("idle");
    setRound(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }

  const phaseLabel =
    phase === "idle" ? "准备" :
    phase === "done" ? "完成！" :
    PHASES.find((p) => p.name === phase)?.label || "";

  const bgColor =
    phase === "idle" ? "bg-gray-100" :
    phase === "done" ? "bg-green-100" :
    PHASES.find((p) => p.name === phase)?.color || "bg-gray-100";

  return (
    <div className={`rounded-xl p-6 shadow-sm text-center transition-colors ${bgColor}`}>
      <p className="text-xs text-gray-500 mb-2">478 呼吸法</p>
      <p className="text-5xl font-bold mb-2">
        {phase === "idle" || phase === "done" ? "—" : countdown}
      </p>
      <p className="text-lg font-medium mb-1">{phaseLabel}</p>
      {running && round > 0 && (
        <p className="text-xs text-gray-500">第 {round} / 4 轮</p>
      )}
      <button
        onClick={running ? stop : start}
        className={`mt-4 px-6 py-2 rounded-full text-sm font-medium ${
          running ? "bg-red-500 text-white" : "bg-black text-white"
        }`}
      >
        {running ? "停止" : phase === "done" ? "再来" : "开始"}
      </button>
    </div>
  );
}
```

- [ ] **Step 2: 创建 `app/rest/page.tsx`**

```tsx
"use client";

import { useState, useEffect } from "react";
import { BreathTimer } from "@/components/BreathTimer";
import { loadToken } from "@/lib/storage";
import { GitHubClient } from "@/lib/github";
import { GITHUB_OWNER, GITHUB_REPO } from "@/lib/githubConfig";

export default function RestPage() {
  const [methods, setMethods] = useState<string>("");
  const [energy, setEnergy] = useState<number>(3);

  useEffect(() => {
    (async () => {
      const token = await loadToken();
      if (!token) return;
      const client = new GitHubClient(GITHUB_OWNER, GITHUB_REPO, token);
      try {
        const file = await client.readFile("rest/methods.md");
        if (file) setMethods(file.content);
      } catch {}
    })();
  }, []);

  return (
    <main className="p-4 space-y-4 max-w-md mx-auto">
      <h1 className="text-lg font-bold">😴 高效休息</h1>

      <BreathTimer />

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <p className="text-sm font-medium mb-2">当前能量</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setEnergy(n)}
              className={`flex-1 py-2 rounded-lg font-bold ${
                energy === n ? "bg-black text-white" : "bg-gray-100 text-gray-400"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-1 text-center">
          {energy <= 2 ? "推荐：NSDR / 478呼吸 / 小睡" :
           energy === 3 ? "推荐：散步 / 渐进式放松" :
           "推荐：远眺 / 走动 / 喝水"}
        </p>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <p className="text-sm font-medium mb-2">休息方法库</p>
        <pre className="text-xs text-gray-600 whitespace-pre-wrap font-sans">
          {methods || "加载中..."}
        </pre>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/BreathTimer.tsx app/rest/page.tsx
git commit -m "feat: 高效休息页面 + 478呼吸计时器"
```

---

## Task 14: 本地开发验证 + 部署配置

**Files:**
- Create: `.env.local.example`
- Create: `vercel.json`

- [ ] **Step 1: 创建环境变量示例**

```bash
# .env.local.example
# 复制为 .env.local 并填入真实值（.env.local 已被 .gitignore 忽略）

# GitHub 仓库配置（前端可见，用 NEXT_PUBLIC_ 前缀）
NEXT_PUBLIC_GITHUB_OWNER=soulor8908
NEXT_PUBLIC_GITHUB_REPO=million-dollar-roadmap

# 服务端 GitHub 配置（API 代理用，可不填，默认同上）
GITHUB_OWNER=soulor8908
GITHUB_REPO=million-dollar-roadmap
```

- [ ] **Step 2: 更新 `.gitignore` 确保 .env.local 被忽略**

确认 `.gitignore` 包含：
```
.env
.env.local
```

- [ ] **Step 3: 创建 `vercel.json`**

```json
{
  "framework": "nextjs",
  "regions": ["hkg1"]
}
```

- [ ] **Step 4: 本地启动验证**

```bash
cp .env.local.example .env.local
npm run dev
```
访问 http://localhost:3000，验证：
- 首页显示 Token 输入门户
- 输入 GitHub PAT 后显示今日指挥中心
- 情绪笔记页面可记录并回看
- 休息页面 478 呼吸计时器正常工作

- [ ] **Step 5: Commit**

```bash
git add .env.local.example vercel.json .gitignore
git commit -m "feat: 部署配置 + 环境变量示例"
```

- [ ] **Step 6: 推送到远程**

```bash
git push origin main
```

---

## 后续计划（扩展篇）

本计划覆盖核心功能（指挥中心 + 情绪笔记 + 高效休息）。以下功能在 `docs/superpowers/plans/2026-07-12-ai-companion-extended.md` 中（待写）：

- 日志记录页面（`/daily`）
- 进度查看页面（`/progress`）
- AI 分析页面（`/analyze`）
- PWA service worker + 离线缓存
- Vercel 部署上线
