import type { ProgressInfo } from "./types";
import { chinaDateNow, chinaDateShift } from "./time";
import { parseLeetCodeChecklist, getAlgorithmStats } from "./algorithm";
import { parseBackendRoadmap, getBackendStats } from "./backend";

export function parseAlgorithmProgress(markdown: string): {
  done: number;
  total: number;
  percent: number;
} {
  const m = markdown.match(/当前[:：]\s*(\d+)\s*\/\s*(\d+)\s*\((\d+)%\)/);
  if (!m) return { done: 0, total: 200, percent: 0 };
  return { done: +m[1], total: +m[2], percent: +m[3] };
}

export function currentStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const set = new Set(dates);
  let streak = 0;
  let current = chinaDateNow();
  for (;;) {
    if (set.has(current)) {
      streak++;
      current = chinaDateShift(current, -1);
    } else {
      break;
    }
  }
  return streak;
}

export function parseWeekHours(dailyContents: string[]): number {
  let total = 0;
  for (const content of dailyContents) {
    const m = content.match(/有效学习时长[：:]\s*([\d.]+)\s*小时/);
    if (m) total += parseFloat(m[1]);
  }
  return total;
}

export function buildProgressInfo(
  progressMd: string,
  dailyFiles: { name: string; content: string }[],
  options?: {
    algorithmChecklistMd?: string;
    backendRoadmapMd?: string;
  }
): ProgressInfo {
  const algo = parseAlgorithmProgress(progressMd);
  const dates = dailyFiles
    .map((f) => f.name.replace(".md", ""))
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));
  const streak = currentStreak(dates);
  const sortedDates = [...dates].sort();
  const latest = sortedDates.length ? sortedDates[sortedDates.length - 1] : "—";
  const recent7 = sortedDates.slice(-7);
  const recentContents = dailyFiles
    .filter((f) => recent7.includes(f.name.replace(".md", "")))
    .map((f) => f.content);
  const weekHours = parseWeekHours(recentContents);

  let algorithmDone = algo.done;
  let algorithmTotal = algo.total;
  let algorithmPercent = algo.percent;
  let algorithmTodayCount = 0;
  let algorithmIndependentCount = 0;
  let backendWeeksDone = 0;
  let backendWeeksTotal = 24;

  if (options?.algorithmChecklistMd) {
    const problems = parseLeetCodeChecklist(options.algorithmChecklistMd);
    if (problems.length > 0) {
      const stats = getAlgorithmStats(problems);
      // 用 checklist 的真实数据覆盖 progress.md 中的旧统计
      algorithmDone = stats.done;
      algorithmTotal = stats.total;
      algorithmPercent =
        stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
      algorithmTodayCount = stats.todayCount;
      algorithmIndependentCount = stats.independentCount;
    }
  }

  if (options?.backendRoadmapMd) {
    const weeks = parseBackendRoadmap(options.backendRoadmapMd);
    if (weeks.length > 0) {
      const bstats = getBackendStats(weeks);
      backendWeeksDone = bstats.done;
      backendWeeksTotal = bstats.total;
    }
  }

  return {
    algorithmDone,
    algorithmTotal,
    algorithmPercent,
    streakDays: streak,
    totalLogs: dailyFiles.length,
    latestLog: latest,
    weekHours,
    algorithmTodayCount,
    algorithmIndependentCount,
    backendWeeksDone,
    backendWeeksTotal,
  };
}
