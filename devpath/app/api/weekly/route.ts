// app/api/weekly/route.ts
// 周报生成路由：接收本周数据 → 调 AI → 存 IndexedDB → 返回 markdown

import { NextResponse } from "next/server";
import { generateWeeklyReport } from "@/lib/ai/weekly-report";
import { setItem as dbSet } from "@/lib/storage/db";
import { nanoid } from "nanoid";
import type { LearnLog, ReviewLog, DailyStatus } from "@/lib/types";

export const runtime = "edge";

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
