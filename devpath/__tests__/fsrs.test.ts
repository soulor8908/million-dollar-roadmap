import { describe, it, expect } from "vitest";
import { createCard, rateCard, getDueCards, getDueCount } from "../lib/fsrs";
import type { ReviewCard } from "../lib/types";

describe("fsrs", () => {
  it("新卡片 due=今天，评分 Good 后 due 在未来", () => {
    const card = createCard("plan1", "k1", "q1", "问题", "答案", "standard");
    const now = new Date();
    // 新卡片 due 是今天
    expect(new Date(card.due).getTime()).toBeLessThanOrEqual(now.getTime());

    // 评分 Good
    const rated = rateCard(card, 3, "standard");
    // due 应该在未来（>= 明天）
    const ratedDue = new Date(rated.due);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    expect(ratedDue.getTime()).toBeGreaterThanOrEqual(tomorrow.getTime());
    // reps 应该 +1
    expect(rated.reps).toBe(card.reps + 1);
  });

  it("评分 Again 后 stability 不大于 Good 评分", () => {
    const card1 = createCard("plan1", "k1", "q1", "问题", "答案", "standard");
    const card2 = createCard("plan1", "k1", "q1", "问题", "答案", "standard");

    const ratedAgain = rateCard(card1, 1, "standard");
    const ratedGood = rateCard(card2, 3, "standard");

    // Again 的 stability 应 <= Good 的 stability
    expect(ratedAgain.stability).toBeLessThanOrEqual(ratedGood.stability);
    // Again 的 due 应比 Good 更近（更早复习）
    expect(new Date(ratedAgain.due).getTime()).toBeLessThanOrEqual(
      new Date(ratedGood.due).getTime()
    );
  });

  it("getDueCards 过滤出今天该复习的", () => {
    const now = new Date("2026-07-13T12:00:00.000Z");
    const dueCard: ReviewCard = {
      id: "c1",
      planId: "p1",
      nodeId: "k1",
      questionId: "q1",
      front: "问题",
      back: "答案",
      due: "2026-07-13T00:00:00.000Z", // 今天到期
      stability: 1,
      difficulty: 5,
      elapsedDays: 1,
      scheduledDays: 1,
      reps: 1,
      lapses: 0,
      state: 2,
      lastReview: "2026-07-12T00:00:00.000Z",
    };
    const futureCard: ReviewCard = {
      ...dueCard,
      id: "c2",
      due: "2026-07-15T00:00:00.000Z", // 未来到期
    };

    const due = getDueCards([dueCard, futureCard], now);
    expect(due).toHaveLength(1);
    expect(due[0].id).toBe("c1");
  });

  it("getDueCount 返回正确数量", () => {
    const now = new Date("2026-07-13T12:00:00.000Z");
    const cards: ReviewCard[] = [
      { id: "c1", due: "2026-07-13T00:00:00.000Z" } as ReviewCard,
      { id: "c2", due: "2026-07-14T00:00:00.000Z" } as ReviewCard,
      { id: "c3", due: "2026-07-12T00:00:00.000Z" } as ReviewCard,
    ];
    expect(getDueCount(cards, now)).toBe(2); // c1 和 c3
  });

  it("conservative 模式比 aggressive 更频繁复习", () => {
    const card1 = createCard("p1", "k1", "q1", "问题", "答案", "conservative");
    const card2 = createCard("p1", "k1", "q1", "问题", "答案", "aggressive");

    const rated1 = rateCard(card1, 3, "conservative");
    const rated2 = rateCard(card2, 3, "aggressive");

    // conservative (retention=0.95) 应该比 aggressive (retention=0.8) 更早复习
    expect(new Date(rated1.due).getTime()).toBeLessThanOrEqual(
      new Date(rated2.due).getTime()
    );
  });
});
