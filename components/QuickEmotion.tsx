"use client";

import { useState } from "react";
import type { EmotionEntry, EmotionTag, DopamineTrigger } from "@/lib/types";
import { getEmoji, formatEmotionEntry, appendEntry } from "@/lib/emotion";
import { loadToken } from "@/lib/storage";
import { GitHubClient } from "@/lib/github";
import { GITHUB_OWNER, GITHUB_REPO } from "@/lib/githubConfig";

const TAGS: EmotionTag[] = ["焦虑", "兴奋", "疲惫", "烦躁", "满足", "冲动", "平静", "沮丧"];
const DOPAMINE: DopamineTrigger[] = ["无", "刷手机", "游戏", "短视频", "甜食"];

export function QuickEmotion() {
  const [tag, setTag] = useState<EmotionTag | null>(null);
  const [trigger, setTrigger] = useState("");
  const [impact, setImpact] = useState("");
  const [coping, setCoping] = useState("");
  const [dopamine, setDopamine] = useState<DopamineTrigger>("无");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function submit() {
    if (!tag || !trigger.trim()) return;
    setStatus("saving");
    try {
      const token = await loadToken();
      if (!token) { setStatus("error"); return; }
      const client = new GitHubClient(GITHUB_OWNER, GITHUB_REPO, token);

      const now = new Date();
      const date = now.toISOString().split("T")[0];
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

      const entry: EmotionEntry = {
        time,
        tag,
        emoji: getEmoji(tag),
        trigger: trigger.trim(),
        impact: impact.trim() || "—",
        coping: coping.trim() || "—",
        dopamine,
      };

      const path = `emotion/${date}.md`;
      const existing = await client.readFile(path);
      const newContent = appendEntry(existing?.content || "", entry);
      await client.writeFile(path, newContent, `emotion: ${date} ${time} ${tag}`, existing?.sha);

      setStatus("saved");
      setTag(null);
      setTrigger("");
      setImpact("");
      setCoping("");
      setDopamine("无");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
      <p className="text-sm font-medium">快速记录情绪</p>

      <div>
        <p className="text-xs text-gray-500 mb-1">情绪</p>
        <div className="flex flex-wrap gap-2">
          {TAGS.map((t) => (
            <button
              key={t}
              onClick={() => setTag(t)}
              className={`px-3 py-1 rounded-full text-sm ${
                tag === t ? "bg-black text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              {getEmoji(t)} {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-1">触发事件 *</p>
        <input
          value={trigger}
          onChange={(e) => setTrigger(e.target.value)}
          placeholder="什么事引发了这种情绪"
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-1">对学习/休息的影响</p>
        <input
          value={impact}
          onChange={(e) => setImpact(e.target.value)}
          placeholder="可选"
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-1">采取的应对</p>
        <input
          value={coping}
          onChange={(e) => setCoping(e.target.value)}
          placeholder="可选"
          className="w-full border rounded px-3 py-2 text-sm"
        />
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-1">多巴胺干扰</p>
        <div className="flex flex-wrap gap-2">
          {DOPAMINE.map((d) => (
            <button
              key={d}
              onClick={() => setDopamine(d)}
              className={`px-3 py-1 rounded-full text-sm ${
                dopamine === d ? "bg-black text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={submit}
        disabled={!tag || !trigger.trim() || status === "saving"}
        className="w-full bg-black text-white rounded py-2 text-sm font-medium disabled:opacity-40"
      >
        {status === "saving" ? "保存中..." : status === "saved" ? "✓ 已记录" : "记录"}
      </button>

      {status === "error" && (
        <p className="text-red-500 text-xs">保存失败，请检查网络和 token</p>
      )}
    </div>
  );
}
