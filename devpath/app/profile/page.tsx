"use client";

// app/profile/page.tsx
// 公开主页设置：username/displayName/bio/avatar + 4 个隐私 toggle + 实时预览 + 保存
// 「生成分享图」按钮在 Task 15 加入

import { useState, useEffect } from "react";
import type { PublicProfile } from "@/lib/types";
import { getItem as dbGet, setItem as dbSet } from "@/lib/storage/db";
import { ShareCardButton } from "@/components/ShareCardButton";

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
