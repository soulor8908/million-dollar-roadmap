"use client";

// app/profile/page.tsx
// 「我的」中心：分区清晰的用户中心页
// 6 大分区：个人信息 / 编辑 / 收藏 / 设置 / 应用信息 / 帮助
// 保留原有逻辑：保存 profile（IndexedDB my:profile + KV PUT）、routine、token、PWA 通知

import { useState, useEffect } from "react";
import Link from "next/link";
import type { PublicProfile } from "@/lib/types";
import { getItem as dbGet, setItem as dbSet } from "@/lib/storage/db";
import { apiFetch, getApiToken, setApiToken } from "@/lib/api-client";
import { ShareCardButton } from "@/components/ShareCardButton";
import { SyncStatus } from "@/components/SyncStatus";
import {
  loadRoutineMarkdown,
  saveRoutineMarkdown,
  defaultRoutineMarkdown,
  parseRoutine,
} from "@/lib/routine";
import { listFavoriteDecks, listFavoritedQuestions } from "@/lib/favorite";

const STORAGE_KEY = "my:profile";

/** VAPID 公钥转 Uint8Array（push 订阅需要） */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from(rawData, (c) => c.charCodeAt(0));
}

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

// 常见问题列表（FAQ）
const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "如何开始学习？",
    a: "在首页输入想学的主题，或点击预设知识库一键导入",
  },
  {
    q: "数据存储在哪里？",
    a: "本地 IndexedDB 优先，可在设置中开启云端同步到 Cloudflare KV",
  },
  {
    q: "如何跨设备同步？",
    a: "在「设置 → 数据同步」点击上传，新设备点击恢复即可",
  },
  {
    q: "什么是 FSRS？",
    a: "Free Spaced Repetition Scheduler，科学的间隔重复算法，根据你的遗忘曲线安排复习时间",
  },
  {
    q: "AI 接口失败怎么办？",
    a: "检查 API Token 是否正确，或稍后重试。预设知识库无需 AI 也可使用",
  },
  {
    q: "支持哪些语言？",
    a: "中文界面，代码示例支持 JS/TS/Python/Java/Go/SQL/Bash 等主流语言高亮",
  },
];

export default function ProfilePage() {
  const [profile, setProfile] = useState<PublicProfile>(defaultProfile);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // 编辑表单是否展开（默认折叠）
  const [editOpen, setEditOpen] = useState(false);

  // 每日时间表
  const [routine, setRoutine] = useState<string>("");
  const [routineSaving, setRoutineSaving] = useState(false);
  const [routineSaved, setRoutineSaved] = useState(false);
  const [routineHint, setRoutineHint] = useState<string>("");

  // PWA 通知
  const [notifSupported, setNotifSupported] = useState(false);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | "unsupported">("unsupported");

  // API Token
  const [apiToken, setApiTokenState] = useState("");
  const [tokenSaved, setTokenSaved] = useState(false);

  // 收藏统计
  const [deckCount, setDeckCount] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);

  useEffect(() => {
    (async () => {
      const stored = await dbGet<PublicProfile>(STORAGE_KEY);
      if (stored) setProfile(stored);

      const r = await loadRoutineMarkdown();
      setRoutine(r);

      // 加载已存的 API Token
      const token = await getApiToken();
      if (token) setApiTokenState(token);

      // 检查 PWA 通知支持
      if (typeof window !== "undefined" && "Notification" in window) {
        setNotifSupported(true);
        setNotifPermission(Notification.permission);
      }

      // 加载收藏统计
      const [decks, questions] = await Promise.all([
        listFavoriteDecks(),
        listFavoritedQuestions(),
      ]);
      setDeckCount(decks.length);
      setQuestionCount(questions.length);
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

  // 保存个人信息：写入 IndexedDB + 调用 /api/public/[username] PUT
  async function save() {
    setSaving(true);
    try {
      await dbSet(STORAGE_KEY, profile);
      const res = await apiFetch(`/api/public/${encodeURIComponent(profile.username)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile }),
      });
      if (!res.ok && res.status !== 404) {
        console.warn("KV sync skipped:", res.status);
      }
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  async function saveToken() {
    await setApiToken(apiToken);
    setTokenSaved(true);
    setTimeout(() => setTokenSaved(false), 2000);
  }

  async function saveRoutine() {
    setRoutineSaving(true);
    try {
      await saveRoutineMarkdown(routine);
      // 简单校验：解析后能否得到时段
      const slots = parseRoutine(routine);
      setRoutineHint(
        slots.length > 0
          ? `已识别 ${slots.length} 个时段`
          : "已保存（未识别到任何时段，请检查格式）",
      );
      setRoutineSaved(true);
    } finally {
      setRoutineSaving(false);
    }
  }

  async function requestNotifPermission() {
    if (!notifSupported) return;
    const perm = await Notification.requestPermission();
    setNotifPermission(perm);
    if (perm === "granted") {
      // 尝试订阅 Push（需要配置 NEXT_PUBLIC_VAPID_PUBLIC_KEY）
      try {
        const reg = await navigator.serviceWorker.ready;
        let sub = await reg.pushManager.getSubscription();
        if (!sub) {
          const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
          if (vapidKey) {
            sub = await reg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(vapidKey) as BufferSource,
            });
          }
        }
        if (sub) {
          await dbSet("push:subscription", sub);
        }
      } catch (e) {
        console.warn("Push 订阅失败:", e);
      }
      // 测试通知
      new Notification("devpath 打卡提醒已开启", {
        body: "我们会在每日学习时段提醒你 📚",
        icon: "/icons/icon-192.png",
      });
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 pb-20">
      <h1 className="text-2xl font-bold">我的</h1>

      {/* 1. 我的个人信息 */}
      <Section
        icon="👤"
        title="我的个人信息"
        desc="头像与基本资料"
      >
        <div className="flex items-center gap-4">
          {profile.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar}
              alt="头像"
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl text-gray-400">
              👤
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="text-lg font-semibold">
              {profile.displayName || "(未设置显示名)"}
            </div>
            <div className="text-sm text-gray-500">
              @{profile.username || "username"}
            </div>
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
              {profile.bio || "(暂无简介)"}
            </p>
          </div>
        </div>
        <div className="mt-4 border-t pt-4">
          <SyncStatus />
        </div>
        <div className="mt-3">
          <ShareCardButton profile={profile} />
        </div>
      </Section>

      {/* 2. 个人信息编辑 */}
      <Section
        icon="✏️"
        title="个人信息编辑"
        desc="用户名 / 显示名 / 简介 / 头像"
      >
        <button
          onClick={() => setEditOpen((v) => !v)}
          className="w-full rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
        >
          {editOpen ? "▲ 收起编辑表单" : "▼ 展开编辑表单"}
        </button>

        {editOpen && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">用户名（URL 标识）</label>
              <input
                value={profile.username}
                onChange={(e) =>
                  update(
                    "username",
                    e.target.value.replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase(),
                  )
                }
                placeholder="alice"
                className="mt-1 w-full rounded border px-2 py-1"
              />
              {profile.username && (
                <p className="mt-1 text-xs text-gray-500">
                  主页地址：/u/{profile.username}
                </p>
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

            <div className="rounded bg-gray-50 p-3">
              <p className="mb-2 text-xs font-medium text-gray-500">实时预览</p>
              <div className="flex items-center gap-2">
                {profile.avatar && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatar} alt="" className="h-8 w-8 rounded-full" />
                )}
                <div>
                  <div className="font-medium">
                    {profile.displayName || "(未设置)"}
                  </div>
                  <div className="text-xs text-gray-500">
                    @{profile.username || "username"}
                  </div>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                {profile.bio || "(暂无简介)"}
              </p>
              <div className="mt-2 flex gap-2 text-xs text-gray-500">
                {profile.visibility.radar && <span>📊 雷达图</span>}
                {profile.visibility.heatmap && <span>🔥 热力图</span>}
                {profile.visibility.currentTopic && <span>📚 当前主题</span>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={save}
                disabled={saving || !profile.username}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "保存中..." : "保存"}
              </button>
              {saved && <span className="text-sm text-green-600">已保存 ✓</span>}
            </div>
          </div>
        )}
      </Section>

      {/* 3. 我的收藏 */}
      <Section icon="⭐" title="我的收藏" desc="收藏的试题集与单题">
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-6">
            <div>
              <div className="text-2xl font-bold text-blue-600">{deckCount}</div>
              <div className="text-xs text-gray-500">试题集</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{questionCount}</div>
              <div className="text-xs text-gray-500">单题</div>
            </div>
          </div>
          <Link
            href="/favorites"
            className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
          >
            查看收藏 →
          </Link>
        </div>
      </Section>

      {/* 4. 设置 */}
      <Section icon="⚙️" title="设置" desc="时间表 / 隐私 / 通知 / Token">
        {/* 每日时间表 */}
        <div className="space-y-3 border-b pb-4">
          <h3 className="font-medium">每日时间表</h3>
          <p className="text-xs text-gray-500">
            配置后首页会显示"现在该做什么"+ 剩余分钟 + 下一项，并联动 FSRS 复习 / 休息工具
          </p>
          <textarea
            value={routine}
            onChange={(e) => {
              setRoutine(e.target.value);
              setRoutineSaved(false);
              setRoutineHint("");
            }}
            rows={12}
            placeholder={defaultRoutineMarkdown()}
            className="mt-1 w-full rounded border px-2 py-1 font-mono text-xs"
          />
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={saveRoutine}
              disabled={routineSaving}
              className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {routineSaving ? "保存中..." : "保存时间表"}
            </button>
            <button
              onClick={() => {
                setRoutine(defaultRoutineMarkdown());
                setRoutineSaved(false);
              }}
              className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
            >
              使用模板
            </button>
            {routineSaved && (
              <span className="text-sm text-green-600">已保存 ✓</span>
            )}
            {routineHint && (
              <span className="text-xs text-gray-500">{routineHint}</span>
            )}
          </div>
        </div>

        {/* 隐私设置 */}
        <div className="space-y-3 border-b py-4">
          <h3 className="font-medium">隐私设置</h3>
          {(
            [
              { key: "radar" as const, label: "能力雷达图" },
              { key: "heatmap" as const, label: "学习热力图" },
              { key: "currentTopic" as const, label: "当前学习主题" },
              { key: "notes" as const, label: "笔记内容" },
            ]
          ).map((item) => (
            <label
              key={item.key}
              className="flex items-center justify-between"
            >
              <span className="text-sm">{item.label}</span>
              <input
                type="checkbox"
                checked={profile.visibility[item.key]}
                onChange={() => toggleVisibility(item.key)}
                className="h-5 w-5"
              />
            </label>
          ))}
        </div>

        {/* PWA 学习提醒 */}
        <div className="space-y-3 border-b py-4">
          <h3 className="font-medium">学习提醒（PWA 通知）</h3>
          {!notifSupported ? (
            <p className="text-sm text-gray-500">当前环境不支持通知</p>
          ) : notifPermission === "granted" ? (
            <p className="text-sm text-green-600">✓ 通知已开启</p>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                开启后可每日定时提醒你学习（外部监督）
              </p>
              <button
                onClick={requestNotifPermission}
                className="rounded-lg bg-black px-3 py-1 text-sm text-white hover:bg-gray-800"
              >
                开启通知
              </button>
            </div>
          )}
        </div>

        {/* API 鉴权 Token */}
        <div className="space-y-3 pt-4">
          <h3 className="font-medium">API 鉴权 Token</h3>
          <p className="text-xs text-gray-500">
            生产环境设置了 API_TOKEN 密钥后，需在此填入相同值才能调用 AI 接口。开发模式留空即可。
          </p>
          <input
            type="password"
            value={apiToken}
            onChange={(e) => {
              setApiTokenState(e.target.value);
              setTokenSaved(false);
            }}
            placeholder="留空=开发模式（不鉴权）"
            className="w-full rounded border px-2 py-1"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={saveToken}
              className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
            >
              保存 Token
            </button>
            {tokenSaved && (
              <span className="text-sm text-green-600">已保存 ✓</span>
            )}
          </div>
        </div>
      </Section>

      {/* 5. 应用信息 */}
      <Section icon="📦" title="应用信息" desc="版本 / 技术栈 / 仓库">
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-gray-500">应用名称</dt>
            <dd className="font-medium">devpath · AI 学习教练</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">版本号</dt>
            <dd className="font-mono">0.1.0</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="shrink-0 text-gray-500">技术栈</dt>
            <dd className="text-right text-gray-700">
              Next.js 15 · React 19 · TypeScript · Cloudflare Pages · IndexedDB · FSRS · Vercel AI SDK
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="shrink-0 text-gray-500">GitHub 仓库</dt>
            <dd>
              <a
                href="https://github.com/soulor8908/million-dollar-roadmap"
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-blue-600 hover:underline"
              >
                soulor8908/million-dollar-roadmap
              </a>
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-500">部署平台</dt>
            <dd className="text-gray-700">Cloudflare Pages（edge runtime）</dd>
          </div>
        </dl>
      </Section>

      {/* 6. 帮助 */}
      <Section icon="❓" title="帮助" desc="常见问题 / 反馈 / 快捷键">
        {/* 常见问题 */}
        <div className="space-y-2">
          <h3 className="font-medium">常见问题</h3>
          {FAQS.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-lg border px-3 py-2 text-sm [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between font-medium hover:text-blue-600">
                <span>{faq.q}</span>
                <span className="text-gray-400 transition-transform group-open:rotate-90">
                  ›
                </span>
              </summary>
              <p className="mt-2 text-gray-600">{faq.a}</p>
            </details>
          ))}
        </div>

        {/* 反馈渠道 */}
        <div className="flex items-center justify-between border-t pt-4 text-sm">
          <span className="text-gray-500">反馈渠道</span>
          <a
            href="https://github.com/soulor8908/million-dollar-roadmap/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            GitHub Issues →
          </a>
        </div>

        {/* 快捷键说明 */}
        <div className="flex items-center justify-between border-t pt-4 text-sm">
          <span className="text-gray-500">快捷键</span>
          <span className="text-gray-700">
            <kbd className="rounded border bg-gray-50 px-1.5 py-0.5 text-xs">
              Cmd/Ctrl+K
            </kbd>{" "}
            快速跳转
            <span className="ml-1 text-xs text-gray-400">（即将支持）</span>
          </span>
        </div>
      </Section>
    </div>
  );
}

/** 分区卡片：左侧 emoji + 标题，右侧描述；圆角分组卡片样式 */
function Section({
  icon,
  title,
  desc,
  children,
}: {
  icon: string;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 rounded-xl border bg-white p-4 shadow-sm">
      <header className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base font-semibold">
          <span className="text-xl" aria-hidden>
            {icon}
          </span>
          {title}
        </h2>
        <span className="text-right text-xs text-gray-400">{desc}</span>
      </header>
      <div className="space-y-3">{children}</div>
    </section>
  );
}
