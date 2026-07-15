// lib/github-import.ts
// GitHub → IndexedDB 一次性导入工具
// 设计目标：让用户把主站 GitHub Markdown 数据导入 DevPath IndexedDB
// 不依赖主站 GitHubClient，直接用 fetch + GitHub Contents API

import { setItem } from "@/lib/storage/db";
import { KEY_PREFIXES, type EmotionEntry, type LeetCodeProblem, type BackendWeek } from "@/lib/types";
import { nanoid } from "nanoid";
import { parseEmotionFile } from "@/lib/emotion-parser";
import { parseLeetCodeChecklist } from "@/lib/algorithm";
import { parseBackendRoadmap } from "@/lib/backend";

export type ImportType = "emotion" | "daily" | "algorithm" | "backend";

export interface ImportParams {
  token: string;
  owner: string;
  repo: string;
  types: ImportType[];
  onProgress?: (msg: string) => void;
}

export interface ImportStats {
  emotion: { files: number; entries: number };
  daily: { files: number };
  algorithm: { problems: number };
  backend: { weeks: number };
}

export interface ImportResult {
  success: boolean;
  stats: ImportStats;
  errors: string[];
}

// ============ GitHub API ============

interface GitHubFile {
  name: string;
  path: string;
  type: "file" | "dir";
  content?: string;
  encoding?: string;
}

async function githubApi(
  endpoint: string,
  token: string,
  owner: string,
  repo: string
): Promise<Response> {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${endpoint}`;
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
}

async function listFiles(
  dirPath: string,
  token: string,
  owner: string,
  repo: string
): Promise<string[]> {
  const res = await githubApi(dirPath, token, owner, repo);
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
  const items = (await res.json()) as GitHubFile[];
  return items.filter((i) => i.type === "file").map((i) => i.name);
}

async function readFile(
  filePath: string,
  token: string,
  owner: string,
  repo: string
): Promise<string> {
  const res = await githubApi(filePath, token, owner, repo);
  if (!res.ok) throw new Error(`GitHub API ${res.status}`);
  const file = (await res.json()) as GitHubFile;
  if (file.encoding === "base64" && file.content) {
    return atob(file.content.replace(/\n/g, ""));
  }
  return file.content ?? "";
}

// ============ 导入逻辑 ============

export async function importFromGitHub(params: ImportParams): Promise<ImportResult> {
  const { token, owner, repo, types, onProgress } = params;
  const errors: string[] = [];
  const stats: ImportStats = {
    emotion: { files: 0, entries: 0 },
    daily: { files: 0 },
    algorithm: { problems: 0 },
    backend: { weeks: 0 },
  };

  try {
    // 1. 情绪数据
    if (types.includes("emotion")) {
      onProgress?.("读取 emotion/ 目录...");
      try {
        const files = await listFiles("emotion", token, owner, repo);
        const mdFiles = files.filter((f) => f.endsWith(".md"));
        onProgress?.(`找到 ${mdFiles.length} 个情绪文件`);
        for (const file of mdFiles) {
          try {
            const content = await readFile(`emotion/${file}`, token, owner, repo);
            const date = file.replace(".md", "");
            const parsed = parseEmotionFile(content, date);
            // 为每个 entry 补上 id 和 date，写入 IndexedDB
            for (const entry of parsed.entries) {
              const fullEntry: EmotionEntry = {
                ...entry,
                id: nanoid(),
                date,
              };
              await setItem(`${KEY_PREFIXES.EMOTION}${date}_${fullEntry.id}`, fullEntry);
            }
            stats.emotion.files++;
            stats.emotion.entries += parsed.entries.length;
            onProgress?.(`已导入 ${file} (${parsed.entries.length} 条)`);
          } catch (e) {
            errors.push(`emotion/${file}: ${e instanceof Error ? e.message : String(e)}`);
          }
        }
      } catch (e) {
        errors.push(`emotion 导入失败: ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    // 2. 日志数据（保留 Markdown 格式存 IndexedDB）
    if (types.includes("daily")) {
      onProgress?.("读取 daily/ 目录...");
      try {
        const files = await listFiles("daily", token, owner, repo);
        const mdFiles = files.filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f));
        onProgress?.(`找到 ${mdFiles.length} 个日志文件`);
        for (const file of mdFiles) {
          try {
            const content = await readFile(`daily/${file}`, token, owner, repo);
            const date = file.replace(".md", "");
            await setItem(`${KEY_PREFIXES.DAILY_LOG}${date}`, content);
            stats.daily.files++;
          } catch (e) {
            errors.push(`daily/${file}: ${e instanceof Error ? e.message : String(e)}`);
          }
        }
        onProgress?.(`已导入 ${stats.daily.files} 个日志`);
      } catch (e) {
        errors.push(`daily 导入失败: ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    // 3. 算法进度
    if (types.includes("algorithm")) {
      onProgress?.("读取 algorithm/leetcode-checklist.md...");
      try {
        const content = await readFile("algorithm/leetcode-checklist.md", token, owner, repo);
        const problems = parseLeetCodeChecklist(content);
        // 存储原始 Markdown（编辑时用）+ 解析后的题目列表
        await setItem(`${KEY_PREFIXES.ALGORITHM}leetcode_checklist_md`, content);
        await setItem(`${KEY_PREFIXES.ALGORITHM}leetcode_checklist`, problems);
        stats.algorithm.problems = problems.length;
        onProgress?.(`已导入 ${problems.length} 道算法题`);
      } catch (e) {
        errors.push(`algorithm 导入失败: ${e instanceof Error ? e.message : String(e)}`);
      }
    }

    // 4. 后端学习路线
    if (types.includes("backend")) {
      onProgress?.("读取 backend/roadmap.md...");
      try {
        const content = await readFile("backend/roadmap.md", token, owner, repo);
        const weeks = parseBackendRoadmap(content);
        await setItem(`${KEY_PREFIXES.BACKEND}roadmap_md`, content);
        await setItem(`${KEY_PREFIXES.BACKEND}roadmap`, weeks);
        stats.backend.weeks = weeks.length;
        onProgress?.(`已导入 ${weeks.length} 周后端路线`);
      } catch (e) {
        errors.push(`backend 导入失败: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  } catch (e) {
    errors.push(`导入过程出错: ${e instanceof Error ? e.message : String(e)}`);
  }

  return {
    success: errors.length === 0,
    stats,
    errors,
  };
}
