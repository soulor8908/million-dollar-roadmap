// app/api/status/route.ts
// 接收当日状态 + 基础计划 → 规则调量 → 可选 AI 增强 → 存 IndexedDB → 返回

import { NextResponse } from "next/server";
import { adjustDailyLoad, detectEnhanceTrigger } from "@/lib/status";
import { enhanceAdjustment } from "@/lib/ai/status-enhance";
import { initCloudflareEnv } from "@/lib/ai/cloudflare-env";
import { setItem as dbSet, getItem as dbGet } from "@/lib/storage/db";
import type { DailyStatus, ScheduleItem } from "@/lib/types";

export const runtime = "edge";

interface StatusRequestBody {
  date: string;
  energy: 1 | 2 | 3 | 4 | 5;
  mood: "good" | "neutral" | "bad";
  availableMinutes: number;
  basePlan: ScheduleItem[];
}

export async function POST(req: Request) {
  await initCloudflareEnv();
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
