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
