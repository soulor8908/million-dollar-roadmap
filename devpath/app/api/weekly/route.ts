// app/api/weekly/route.ts
// 周报生成路由：接收本周数据 → 调 AI → 返回 markdown
// 支持可选 emotions（来自情绪觉察流程的 EmotionEntry）
// ⚠️ Edge runtime 无法访问客户端 IndexedDB，报告由客户端自行存储

import { NextResponse } from "next/server";
import { generateWeeklyReport } from "@/lib/ai/weekly-report";
import { initCloudflareEnv } from "@/lib/ai/cloudflare-env";
import { requireAuth } from "@/lib/auth";
import { nanoid } from "nanoid";
import type { LearnLog, ReviewLog, DailyStatus, EmotionEntry } from "@/lib/types";

export const runtime = "edge";

interface WeeklyRequestBody {
  weekStart: string;
  learnLogs: LearnLog[];
  reviewLogs: ReviewLog[];
  statuses: DailyStatus[];
  /** 情绪觉察条目（可选） */
  emotions?: EmotionEntry[];
}

export async function POST(req: Request) {
  await initCloudflareEnv();
  const authError = requireAuth(req);
  if (authError) return authError;

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
    emotions: body.emotions,
    weekStart: body.weekStart,
  });

  const id = nanoid();

  // 返回 id + content 让客户端自行存入 IndexedDB（edge runtime 无法访问）
  return NextResponse.json({ id, content: report, weekStart: body.weekStart });
}

export async function GET() {
  return NextResponse.json({ error: "use POST" }, { status: 405 });
}
