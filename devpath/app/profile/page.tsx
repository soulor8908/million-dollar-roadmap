"use client";

// app/profile/page.tsx
// 公开主页设置：username/displayName/bio/avatar + 4 个隐私 toggle + 实时预览 + 保存
// 扩展：每日时间表配置（存 IndexedDB key="routine:default"）+ PWA 通知开关

import { useState, useEffect } from "react";
import type { PublicProfile } from "@/lib/types";
import { getItem as dbGet, setItem as dbSet } from "@/lib/storage/db";
import { apiFetch, getApiToken, setApiToken } from "@/lib/api-client";
import { ShareCardButton } from "@/components/ShareCardButton";
import {
  loadRoutineMarkdown,
  saveRoutineMarkdown,
  defaultRoutineMarkdown,
  parseRoutine,
} from "@/lib/routine";

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

export default function ProfilePage() {
  const [profile, setProfile] = useState<PublicProfile>(defaultProfile);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
      <h1 className="text-2xl font-bold">个人中心</h1>

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
        <h2 className="font-semibold">每日时间表</h2>
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
          {routineSaved && <span className="text-sm text-green-600">已保存 ✓</span>}
          {routineHint && <span className="text-xs text-gray-500">{routineHint}</span>}
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
        <h2 className="font-semibold">学习提醒（PWA 通知）</h2>
        {!notifSupported ? (
          <p className="text-sm text-gray-500">当前环境不支持通知</p>
        ) : notifPermission === "granted" ? (
          <p className="text-sm text-green-600">✓ 通知已开启</p>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-500">开启后可每日定时提醒你学习（外部监督）</p>
            <button
              onClick={requestNotifPermission}
              className="rounded-lg bg-black px-3 py-1 text-sm text-white hover:bg-gray-800"
            >
              开启通知
            </button>
          </div>
        )}
      </section>

      <section className="space-y-3 rounded-lg border p-4">
        <h2 className="font-semibold">API 鉴权 Token</h2>
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
          {tokenSaved && <span className="text-sm text-green-600">已保存 ✓</span>}
        </div>
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
