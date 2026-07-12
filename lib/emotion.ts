import type { EmotionEntry, EmotionFile, DopamineTrigger } from "./types";

const EMOTION_EMOJIS: Record<string, string> = {
  "焦虑": "😰",
  "兴奋": "🤩",
  "疲惫": "😴",
  "烦躁": "😤",
  "满足": "😊",
  "冲动": "🔥",
  "平静": "😌",
  "沮丧": "😞",
};

export function getEmoji(tag: string): string {
  return EMOTION_EMOJIS[tag] ?? "❓";
}

export function parseEmotionFile(
  markdown: string,
  date: string
): EmotionFile {
  const entries: EmotionEntry[] = [];
  const lines = markdown.split("\n");

  let current: Partial<EmotionEntry> | null = null;

  for (const line of lines) {
    const headerMatch = line.match(/^### (\d{2}:\d{2}) \| (.+?)\s+(.+)$/);
    if (headerMatch) {
      if (current && current.time) {
        entries.push(current as EmotionEntry);
      }
      current = {
        time: headerMatch[1],
        tag: headerMatch[2] as EmotionEntry["tag"],
        emoji: headerMatch[3],
      };
      continue;
    }

    if (!current) continue;

    const triggerMatch = line.match(/^- 触发：(.+)$/);
    if (triggerMatch) current.trigger = triggerMatch[1];

    const impactMatch = line.match(/^- 影响：(.+)$/);
    if (impactMatch) current.impact = impactMatch[1];

    const copingMatch = line.match(/^- 应对：(.+)$/);
    if (copingMatch) current.coping = copingMatch[1];

    const dopamineMatch = line.match(/^- 多巴胺干扰：(.+)$/);
    if (dopamineMatch) {
      const val = dopamineMatch[1].trim();
      current.dopamine = (val === "否" ? "无" : val) as DopamineTrigger;
    }
  }

  if (current && current.time) {
    entries.push(current as EmotionEntry);
  }

  return { date, entries };
}

export function formatEmotionEntry(entry: EmotionEntry): string {
  return `### ${entry.time} | ${entry.tag} ${entry.emoji}
- 触发：${entry.trigger}
- 影响：${entry.impact}
- 应对：${entry.coping}
- 多巴胺干扰：${entry.dopamine}`;
}

export function appendEntry(
  existingContent: string,
  entry: EmotionEntry
): string {
  const entryMd = formatEmotionEntry(entry);
  if (existingContent.includes("## 情绪记录")) {
    return existingContent.replace(
      /## 情绪记录\n/,
      `## 情绪记录\n\n${entryMd}\n`
    );
  }
  return `# 📖 ${new Date().toISOString().split("T")[0]} 情绪笔记\n\n## 情绪记录\n\n${entryMd}\n`;
}
