import type { RoutineSlot, CurrentTask } from "./types";

function normalizeTime(t: string): string {
  const [h, m] = t.split(":");
  return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
}

function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function parseRoutine(markdown: string): RoutineSlot[] {
  const slots: RoutineSlot[] = [];
  const lines = markdown.split("\n");

  for (const line of lines) {
    const match = line.match(/\|\s*(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|/);
    if (!match) continue;

    const [, startRaw, endRaw, activityRaw, typeRaw] = match;
    const start = normalizeTime(startRaw);
    const end = normalizeTime(endRaw);

    const activity = activityRaw
      .replace(/\*\*/g, "")
      .replace(/[🏃🎯😴🛏️👨‍👧💪📚💼🔋]/g, "")
      .trim();

    let type: RoutineSlot["type"] = "其他";
    if (typeRaw.includes("运动")) type = "运动";
    else if (typeRaw.includes("学习")) type = "学习";
    else if (typeRaw.includes("休息")) type = "休息";
    else if (typeRaw.includes("家庭")) type = "家庭";
    else if (typeRaw.includes("睡眠")) type = "睡眠";
    else if (typeRaw.includes("工作")) type = "工作";

    slots.push({ start, end, activity, type });
  }

  return slots;
}

export function getCurrentTask(
  slots: RoutineSlot[],
  now: string
): CurrentTask {
  const nowMin = toMinutes(now);

  let current: RoutineSlot | null = null;
  let next: RoutineSlot | null = null;
  let minutesLeft = 0;

  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    const startMin = toMinutes(slot.start);
    const endMin = toMinutes(slot.end);

    if (nowMin >= startMin && nowMin < endMin) {
      current = slot;
      minutesLeft = endMin - nowMin;
      next = slots[i + 1] ?? null;
      break;
    }
    if (nowMin < startMin) {
      next = slot;
      break;
    }
  }

  return { current, next, minutesLeft };
}
