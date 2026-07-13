import type { LeetCodeProblem } from "./types";
import { chinaDateNow } from "./time";

// 解析难度字段，去掉 emoji 前缀，只保留 "简单"/"中等"/"困难"
function parseDifficulty(raw: string): "简单" | "中等" | "困难" {
  if (raw.includes("简单")) return "简单";
  if (raw.includes("中等")) return "中等";
  return "困难";
}

// 判断是否为表格分隔行 |---|---|...
function isSeparatorRow(line: string): boolean {
  return /^\|[\s-:|]+\|?$/.test(line);
}

// 判断是否为表头行 | # | 完成 | ...
function isHeaderRow(line: string): boolean {
  return line.startsWith("|") && line.includes("| # |");
}

// 解析整个 markdown，返回所有题目
export function parseLeetCodeChecklist(markdown: string): LeetCodeProblem[] {
  if (!markdown || !markdown.trim()) return [];

  const lines = markdown.split("\n");
  let currentPhase = 0;
  let currentCategory = "";
  const problems: LeetCodeProblem[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Phase 行：## Phase 1：基础筑基（64题，Hot 100 核心）
    const phaseMatch = trimmed.match(/^##\s+Phase\s+(\d+)/);
    if (phaseMatch) {
      currentPhase = parseInt(phaseMatch[1], 10);
      continue;
    }

    // 专题行：### 数组与字符串（18题）
    const categoryMatch = trimmed.match(/^###\s+(.+?)（\d+题）/);
    if (categoryMatch) {
      currentCategory = categoryMatch[1].trim();
      continue;
    }

    // 表格行
    if (!trimmed.startsWith("|")) continue;
    if (isHeaderRow(trimmed)) continue;
    if (isSeparatorRow(trimmed)) continue;

    const cells = trimmed.split("|").map((c) => c.trim());
    // cells[0] 和 cells[length-1] 为首尾管道符外侧的空串
    // 数据列从 cells[1] 到 cells[9]
    if (cells.length < 10) continue;

    const id = parseInt(cells[1], 10);
    if (isNaN(id)) continue;

    problems.push({
      id,
      completed: cells[2] === "[x]",
      number: cells[3],
      title: cells[4],
      difficulty: parseDifficulty(cells[5]),
      date: cells[6],
      independent: cells[7] as "✅" | "⚠️" | "❌" | "",
      cost: cells[8],
      note: cells[9],
      phase: currentPhase,
      category: currentCategory,
    });
  }

  return problems;
}

// 把指定 id 的题目在 [ ] ↔ [x] 间切换
// completed=true 时填入字段；completed=false 时清空字段
export function toggleProblem(
  markdown: string,
  problemId: number,
  completed: boolean,
  fields?: {
    date?: string;
    independent?: "✅" | "⚠️" | "❌";
    cost?: string;
    note?: string;
  }
): string {
  const lines = markdown.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    if (!trimmed.startsWith("|")) continue;
    if (isHeaderRow(trimmed)) continue;
    if (isSeparatorRow(trimmed)) continue;

    const cells = trimmed.split("|").map((c) => c.trim());
    if (cells.length < 10) continue;

    const id = parseInt(cells[1], 10);
    if (isNaN(id) || id !== problemId) continue;

    // 找到目标行，重构该行
    const newCompleted = completed ? "[x]" : "[ ]";
    const newDate = completed ? (fields?.date ?? chinaDateNow()) : "";
    const newIndependent = completed ? (fields?.independent ?? "✅") : "";
    const newCost = completed ? (fields?.cost ?? "") : "";
    const newNote = completed ? (fields?.note ?? "") : "";

    // 保留行首缩进
    const indent = lines[i].match(/^\s*/)?.[0] || "";
    lines[i] = `${indent}| ${id} | ${newCompleted} | ${cells[3]} | ${cells[4]} | ${cells[5]} | ${newDate} | ${newIndependent} | ${newCost} | ${newNote} |`;
    break;
  }

  return lines.join("\n");
}

// 统计：done/total/todayCount（今天完成的）/independentCount（✅独立的）
export function getAlgorithmStats(problems: LeetCodeProblem[]): {
  done: number;
  total: number;
  todayCount: number;
  independentCount: number;
} {
  const today = chinaDateNow();
  const done = problems.filter((p) => p.completed).length;
  const todayCount = problems.filter(
    (p) => p.completed && p.date === today
  ).length;
  const independentCount = problems.filter(
    (p) => p.completed && p.independent === "✅"
  ).length;
  return {
    done,
    total: problems.length,
    todayCount,
    independentCount,
  };
}
