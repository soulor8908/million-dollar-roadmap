// app/api/ai/route.ts
import { NextRequest, NextResponse } from "next/server";
import { analyzeWithAI } from "@/lib/ai";

export async function POST(req: NextRequest) {
  try {
    const { emotionData, dailyData } = await req.json();

    if (!emotionData && !dailyData) {
      return NextResponse.json(
        { error: "缺少数据" },
        { status: 400 }
      );
    }

    const result = await analyzeWithAI(emotionData || "", dailyData || "");
    return NextResponse.json(result);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "分析失败";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
