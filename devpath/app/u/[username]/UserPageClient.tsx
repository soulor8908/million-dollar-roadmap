"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Heatmap } from "@/components/Heatmap";
import { RadarChart } from "@/components/RadarChart";
import type { PublicProfile } from "@/lib/types";
import type { PublicStats } from "@/lib/storage/kv";
import { setItem as dbSet, getItem as dbGet } from "@/lib/storage/db";
import { nanoid } from "nanoid";

interface PublicResponse {
  profile: PublicProfile;
  stats: PublicStats | null;
  planSnapshot?: { topic: string; knowledgeTree: unknown[]; questions: unknown[] };
}

export default function UserPageClient() {
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
