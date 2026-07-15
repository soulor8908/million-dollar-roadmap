// lib/backend.ts
// 后端学习路线解析（从主站 lib/backend.ts 迁移）
// 数据源：IndexedDB（导入后的 backend/roadmap.md 内容）

import type { BackendWeek } from "@/lib/types";

// 解析整个 markdown，返回所有 week（1-24）
export function parseBackendRoadmap(markdown: string): BackendWeek[] {
  const weeks: BackendWeek[] = [];
  if (!markdown || !markdown.trim()) return weeks;

  const lines = markdown.split("\n");
  let currentMonth = 0;
  let currentWeek: BackendWeek | null = null;
  let currentSection: "resources" | "days" | "output" | null = null;

  const pushCurrentWeek = () => {
    if (currentWeek) {
      currentWeek.summary = currentWeek.title + (currentWeek.days[0] || "");
      weeks.push(currentWeek);
    }
  };

  for (const line of lines) {
    // Month header: ## Month N：...
    const monthMatch = line.match(/^##\s+Month\s+(\d+)/);
    if (monthMatch) {
      currentMonth = parseInt(monthMatch[1], 10);
      continue;
    }

    // Week header: ### [x] Week N：title  OR  ### Week N：[x] title  OR  ### Week N：title
    const weekMatch = line.match(
      /^(###\s+)(?:\[([ x])\]\s+)?Week\s+(\d+)\s*[：:]\s*(?:\[([ x])\])?\s*(.*)$/
    );
    if (weekMatch) {
      pushCurrentWeek();
      const markBefore = weekMatch[2];
      const weekIndex = parseInt(weekMatch[3], 10);
      const markAfter = weekMatch[4];
      const title = weekMatch[5].trim();
      const completed = markBefore === "x" || markAfter === "x";

      currentWeek = {
        month: currentMonth,
        weekIndex,
        title,
        completed,
        summary: "",
        resources: [],
        output: "",
        days: [],
      };
      currentSection = null;
      continue;
    }

    if (!currentWeek) continue;

    // Section headers
    if (line.startsWith("**")) {
      if (line.startsWith("**学习资料**")) {
        currentSection = "resources";
      } else if (line.startsWith("**学什么**")) {
        currentSection = "days";
      } else if (line.startsWith("**产出**")) {
        currentSection = "output";
        const outputMatch = line.match(/\*\*产出\*\*\s*[：:]\s*(.*)$/);
        if (outputMatch && outputMatch[1].trim()) {
          currentWeek.output = outputMatch[1].trim();
        }
      } else {
        currentSection = null;
      }
      continue;
    }

    // List items
    const itemMatch = line.match(/^-\s+(.*)$/);
    if (itemMatch) {
      const itemText = itemMatch[1];
      if (currentSection === "resources") {
        const resMatch = itemText.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (resMatch) {
          currentWeek.resources.push({
            label: resMatch[1],
            url: resMatch[2],
          });
        }
      } else if (currentSection === "days") {
        currentWeek.days.push(itemText.trim());
      }
    }
  }

  pushCurrentWeek();
  return weeks;
}

// 在 week 标题前加/移除 [x]
export function toggleWeek(
  markdown: string,
  weekIndex: number,
  completed: boolean
): string {
  const lines = markdown.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(
      /^(###\s+)(?:\[([ x])\]\s+)?Week\s+(\d+)\s*([：:])\s*(?:\[([ x])\])?\s*(.*)$/
    );
    if (match) {
      const prefix = match[1];
      const markBefore = match[2];
      const num = parseInt(match[3], 10);
      const colon = match[4];
      const markAfter = match[5];
      const title = match[6].trim();

      if (num !== weekIndex) continue;

      const isCompleted = markBefore === "x" || markAfter === "x";

      if (completed && !isCompleted) {
        lines[i] = `${prefix}[x] Week ${num}${colon}${title}`;
      } else if (!completed && isCompleted) {
        lines[i] = `${prefix}Week ${num}${colon}${title}`;
      }
      return lines.join("\n");
    }
  }
  return markdown;
}

// 统计
export function getBackendStats(weeks: BackendWeek[]): {
  done: number;
  total: number;
} {
  const done = weeks.filter((w) => w.completed).length;
  return { done, total: weeks.length };
}
