"use client";

import { useState, useEffect } from "react";
import { loadToken } from "@/lib/storage";
import { GitHubClient } from "@/lib/github";
import { GITHUB_OWNER, GITHUB_REPO } from "@/lib/githubConfig";
import { parseDailyLog, toggleChecklistItem, createEmptyLog, formatDailyLog } from "@/lib/daily";
import { chinaDateNow } from "@/lib/time";
import type { DailyLog } from "@/lib/types";

export function DailyEditor({ date: externalDate }: { date?: string }) {
  const [log, setLog] = useState<DailyLog | null>(null);
  const [rawContent, setRawContent] = useState("");
  const [sha, setSha] = useState<string | undefined>();
  const [date, setDate] = useState(externalDate || chinaDateNow());
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [error, setError] = useState("");

  // 外部传入日期变化时同步（DailyCalendar 选择日期 → Editor 跟随切换）
  useEffect(() => {
    if (externalDate) setDate(externalDate);
  }, [externalDate]);

  useEffect(() => {
    (async () => {
      const token = await loadToken();
      if (!token) { setError("未登录"); return; }
      const client = new GitHubClient(GITHUB_OWNER, GITHUB_REPO, token);
      try {
        const path = `daily/${date}.md`;
        const file = await client.readFile(path);
        if (file) {
          setRawContent(file.content);
          setSha(file.sha);
          setLog(parseDailyLog(file.content, date));
        } else {
          const empty = createEmptyLog(date);
          setLog(empty);
          setRawContent(formatDailyLog(empty));
          setSha(undefined);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "加载失败");
      }
    })();
  }, [date]);

  async function save() {
    if (!log) return;
    setSaving(true);
    setError("");
    try {
      const token = await loadToken();
      if (!token) { setError("未登录"); return; }
      const client = new GitHubClient(GITHUB_OWNER, GITHUB_REPO, token);
      const content = formatDailyLog(log);
      const newSha = await client.writeFile(
        `daily/${date}.md`,
        content,
        `daily: ${date}`,
        sha
      );
      setSha(newSha);
      setRawContent(content);
      setSavedAt(Date.now());
    } catch (e) {
      setError(e instanceof Error ? e.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  async function toggleChecklist(idx: number) {
    if (!log) return;
    const newChecklist = [...log.checklist];
    newChecklist[idx] = {
      ...newChecklist[idx],
      checked: !newChecklist[idx].checked,
    };
    setLog({ ...log, checklist: newChecklist });
    const newContent = toggleChecklistItem(rawContent, idx);
    setRawContent(newContent);
    try {
      const token = await loadToken();
      if (!token) return;
      const client = new GitHubClient(GITHUB_OWNER, GITHUB_REPO, token);
      const newSha = await client.writeFile(
        `daily/${date}.md`,
        newContent,
        `daily: ${date} toggle checklist ${idx}`,
        sha
      );
      setSha(newSha);
      setSavedAt(Date.now());
    } catch (e) {
      setError(e instanceof Error ? e.message : "保存失败");
    }
  }

  if (!log) return <div className="text-gray-400 text-sm">加载中...</div>;

  return (
    <div className="space-y-3">
      {error && <p className="text-red-500 text-xs">{error}</p>}

      <div className="bg-white rounded-xl p-3 shadow-sm">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="text-sm border rounded px-2 py-1"
        />
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <p className="text-sm font-medium mb-2">今日执行 checklist</p>
        <div className="space-y-2">
          {log.checklist.map((item, i) => (
            <label key={i} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleChecklist(i)}
                className="w-4 h-4"
              />
              <span className={`text-sm ${item.checked ? "line-through text-gray-400" : ""}`}>
                {item.text}
              </span>
            </label>
          ))}
          {log.checklist.length === 0 && (
            <p className="text-xs text-gray-400">当日无 checklist</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm space-y-2">
        <p className="text-sm font-medium">能量数据</p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <label className="flex items-center gap-1">
            睡眠
            <input
              type="text"
              value={log.energy.sleep}
              onChange={(e) => setLog({ ...log, energy: { ...log.energy, sleep: e.target.value } })}
              placeholder="7.5"
              className="w-12 border rounded px-1 py-0.5 text-xs"
            />
            h
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={log.energy.sleepOnTime === true}
              onChange={(e) => setLog({ ...log, energy: { ...log.energy, sleepOnTime: e.target.checked } })}
              className="w-4 h-4"
            />
            <span className="text-xs">22:45 关灯</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={log.energy.exerciseDone === true}
              onChange={(e) => setLog({ ...log, energy: { ...log.energy, exerciseDone: e.target.checked } })}
              className="w-4 h-4"
            />
            <span className="text-xs">晨练执行</span>
          </label>
          <div className="flex items-center gap-1 text-xs">
            晨
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setLog({ ...log, energy: { ...log.energy, energyMorning: n } })}
                className={`w-6 h-6 rounded ${log.energy.energyMorning === n ? "bg-black text-white" : "bg-gray-100"}`}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 text-xs">
            中
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setLog({ ...log, energy: { ...log.energy, energyNoon: n } })}
                className={`w-6 h-6 rounded ${log.energy.energyNoon === n ? "bg-black text-white" : "bg-gray-100"}`}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 text-xs">
            晚
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() => setLog({ ...log, energy: { ...log.energy, energyEvening: n } })}
                className={`w-6 h-6 rounded ${log.energy.energyEvening === n ? "bg-black text-white" : "bg-gray-100"}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm space-y-2">
        <p className="text-sm font-medium">复盘</p>
        <textarea
          value={log.review.good}
          onChange={(e) => setLog({ ...log, review: { ...log.review, good: e.target.value } })}
          placeholder="今天做得好的"
          className="w-full border rounded px-2 py-1 text-xs h-16"
        />
        <textarea
          value={log.review.problems}
          onChange={(e) => setLog({ ...log, review: { ...log.review, problems: e.target.value } })}
          placeholder="今天的问题"
          className="w-full border rounded px-2 py-1 text-xs h-16"
        />
        <textarea
          value={log.review.tomorrow}
          onChange={(e) => setLog({ ...log, review: { ...log.review, tomorrow: e.target.value } })}
          placeholder="明天的调整"
          className="w-full border rounded px-2 py-1 text-xs h-16"
        />
      </div>

      <button
        onClick={save}
        disabled={saving}
        className="w-full bg-black text-white rounded py-2 text-sm font-medium disabled:opacity-40"
      >
        {saving ? "保存中..." : savedAt && Date.now() - savedAt < 3000 ? "✓ 已保存" : "保存日志"}
      </button>
    </div>
  );
}
