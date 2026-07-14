"use client";

// app/learn/page.tsx
// 学习教练首页：
// - 顶部：AI 主题输入（任意主题 → AI 拆解）
// - 中部：4 个预设知识库（算法200题/前端/后端/AI）—— 内置数据秒级加载
//   · 点击预设 → 弹窗展示知识树脑图（可点击节点开始学习）
//   · 右上角"重新生成"按钮 → 调用 AI 重新生成整个知识树
// - 底部：历史计划列表

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { setItem, listKeys, getItem, delItem } from "@/lib/storage/db";
import { apiFetch } from "@/lib/api-client";
import { KEY_PREFIXES } from "@/lib/types";
import type { LearningPlan, KnowledgeNode, Question, ScheduleItem } from "@/lib/types";
import { PRESETS, type PresetMeta } from "@/lib/presets";
import { MindMap } from "@/components/MindMap";
import { nanoid } from "nanoid";

const EXAMPLES = [
  "前端性能优化",
  "React 源码原理",
  "TypeScript 进阶",
  "系统设计基础",
];

interface PresetPlanData {
  topic: string;
  knowledgeTree: KnowledgeNode[];
  questions: Question[];
  schedule: ScheduleItem[];
}

export default function LearnPage() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dailyMinutes, setDailyMinutes] = useState(30);
  const [maxNewPerDay, setMaxNewPerDay] = useState(1);
  const [history, setHistory] = useState<LearningPlan[]>([]);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  // 预设弹窗状态
  const [activePreset, setActivePreset] = useState<PresetMeta | null>(null);
  // 弹窗内当前展示的数据（可能是预设原数据，也可能是 AI 重新生成后的数据）
  const [presetData, setPresetData] = useState<PresetPlanData | null>(null);
  const [presetSource, setPresetSource] = useState<"preset" | "ai">("preset");
  const [regenerating, setRegenerating] = useState(false);
  const [regenError, setRegenError] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>();

  // 加载历史计划
  useEffect(() => {
    (async () => {
      const allKeys = await listKeys();
      const planKeys = allKeys.filter(
        (k): k is string => typeof k === "string" && k.startsWith(KEY_PREFIXES.PLAN)
      );
      const plans = await Promise.all(
        planKeys.map((k) => getItem<LearningPlan>(k))
      );
      const valid = plans
        .filter((p): p is LearningPlan => p !== undefined)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setHistory(valid);
    })();
  }, []);

  async function deletePlan(planId: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (confirmingDeleteId !== planId) {
      setConfirmingDeleteId(planId);
      setTimeout(() => setConfirmingDeleteId(null), 3000);
      return;
    }
    await delItem(KEY_PREFIXES.PLAN + planId);
    setHistory((h) => h.filter((p) => p.id !== planId));
    setConfirmingDeleteId(null);
  }

  // 打开预设弹窗：直接用内置数据
  function openPreset(p: PresetMeta) {
    setActivePreset(p);
    setPresetData({
      topic: p.topic,
      knowledgeTree: p.knowledgeTree,
      questions: p.questions,
      schedule: p.schedule,
    });
    setPresetSource("preset");
    setRegenError("");
    setSelectedNodeId(undefined);
  }

  function closePreset() {
    setActivePreset(null);
    setPresetData(null);
    setRegenerating(false);
    setRegenError("");
    setSelectedNodeId(undefined);
  }

  // 右上角"重新生成"按钮：调用 /api/learn 用 AI 重新生成整个知识树
  async function regenerateWithAI() {
    if (!activePreset || !presetData) return;
    setRegenerating(true);
    setRegenError("");
    try {
      const res = await apiFetch("/api/learn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: presetData.topic,
          dailyMinutes,
          maxNewPerDay,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `请求失败 (${res.status})`);
      }
      const { plan } = (await res.json()) as { plan: LearningPlan };
      setPresetData({
        topic: plan.topic,
        knowledgeTree: plan.knowledgeTree,
        questions: plan.questions,
        schedule: plan.schedule,
      });
      setPresetSource("ai");
      setSelectedNodeId(undefined);
    } catch (err) {
      setRegenError(err instanceof Error ? err.message : "未知错误");
    } finally {
      setRegenerating(false);
    }
  }

  // 基于当前 presetData 创建学习计划并跳转
  async function startLearningFromPreset(node?: KnowledgeNode) {
    if (!presetData) return;
    const now = new Date().toISOString();
    const plan: LearningPlan = {
      id: nanoid(),
      topic: presetData.topic,
      knowledgeTree: presetData.knowledgeTree,
      questions: presetData.questions,
      schedule: presetData.schedule,
      dailyMinutes,
      maxNewPerDay,
      fsrsMode: "standard",
      createdAt: now,
      updatedAt: now,
    };
    await setItem(KEY_PREFIXES.PLAN + plan.id, plan);
    // 如果点击了具体节点，通过 query 选中该节点
    const query = node ? `?node=${encodeURIComponent(node.id)}` : "";
    router.push(`/learn/${plan.id}${query}`);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await apiFetch("/api/learn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          dailyMinutes,
          maxNewPerDay,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `请求失败 (${res.status})`);
      }
      const { planId, plan } = (await res.json()) as { planId: string; plan: LearningPlan };
      await setItem(KEY_PREFIXES.PLAN + planId, plan);
      router.push(`/learn/${planId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "未知错误");
    } finally {
      setLoading(false);
    }
  }

  const loadingState = loading || regenerating;

  if (loadingState && !activePreset) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="text-5xl mb-6 animate-pulse">🤖</div>
        <p className="text-xl font-bold mb-2">
          {regenerating ? "AI 正在重新生成知识树..." : "AI 正在拆解知识树..."}
        </p>
        <p className="text-sm text-gray-500 mb-1">
          主题：{regenerating ? presetData?.topic : topic}
        </p>
        <p className="text-xs text-gray-400 mt-4">预计 30-90 秒，请稍候</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">AI 学习教练</h1>
      <p className="text-gray-500 mb-6">
        告诉 AI 你想学什么，它给你拆知识树、排学习计划、生面试题
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="你想学什么？"
          className="w-full px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />

        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setTopic(ex)}
              className="px-3 py-1 text-sm bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            >
              {ex}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <label className="flex-1">
            <span className="text-sm text-gray-600">每日学习时间（分钟）</span>
            <input
              type="number"
              value={dailyMinutes}
              onChange={(e) => setDailyMinutes(Number(e.target.value))}
              min={15}
              max={120}
              className="w-full px-3 py-2 border rounded mt-1"
            />
          </label>
          <label className="flex-1">
            <span className="text-sm text-gray-600">每日新内容数</span>
            <input
              type="number"
              value={maxNewPerDay}
              onChange={(e) => setMaxNewPerDay(Number(e.target.value))}
              min={1}
              max={5}
              className="w-full px-3 py-2 border rounded mt-1"
            />
          </label>
        </div>

        {error && (
          <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded">{error}</p>
        )}

        <button
          type="submit"
          disabled={!topic.trim() || loading}
          className="w-full py-3 bg-black text-white rounded-lg font-medium disabled:opacity-50 hover:bg-gray-800 transition-colors"
        >
          {loading ? "AI 生成中..." : "开始学习"}
        </button>
      </form>

      {/* 预设知识库 */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-gray-500">
            🎁 内置知识库（{PRESETS.length} 个方向）
          </h2>
          <span className="text-xs text-gray-400">秒级加载 · 可重新生成</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              onClick={() => openPreset(p)}
              className="text-left p-3 border rounded-lg hover:border-blue-400 hover:shadow-sm transition-all bg-white"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{p.icon}</span>
                <span className="font-bold text-sm">{p.name}</span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2 mb-2">
                {p.description}
              </p>
              <div className="flex flex-wrap gap-1 mb-1">
                {p.tags.slice(0, 3).map((t) => (
                  <span
                    key={t}
                    className="px-1.5 py-0.5 text-[10px] bg-gray-100 text-gray-600 rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-gray-400">
                {p.knowledgeTree.length} 知识点 · {p.questions.length} 题
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 历史计划 */}
      {history.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-medium text-gray-500 mb-3">
            历史计划（{history.length}）
          </h2>
          <div className="space-y-2">
            {history.map((p) => (
              <Link
                key={p.id}
                href={`/learn/${p.id}`}
                className="block border rounded-lg p-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{p.topic}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {p.knowledgeTree.length} 知识点 · {p.questions.length} 题 ·{" "}
                      {new Date(p.createdAt).toLocaleDateString("zh-CN")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <button
                      onClick={(e) => deletePlan(p.id, e)}
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        confirmingDeleteId === p.id
                          ? "bg-red-500 text-white"
                          : "text-gray-400 hover:bg-red-50 hover:text-red-500"
                      }`}
                      aria-label="删除计划"
                    >
                      {confirmingDeleteId === p.id ? "确认删除" : "✕"}
                    </button>
                    <span className="text-xs text-gray-400">查看 →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 预设脑图弹窗 */}
      {activePreset && presetData && (
        <PresetMindMapModal
          preset={activePreset}
          data={presetData}
          source={presetSource}
          regenerating={regenerating}
          regenError={regenError}
          selectedNodeId={selectedNodeId}
          onClose={closePreset}
          onRegenerate={regenerateWithAI}
          onSelectNode={(node) => {
            setSelectedNodeId(node.id);
            startLearningFromPreset(node);
          }}
          onImportAll={() => startLearningFromPreset()}
        />
      )}
    </div>
  );
}

// =================== 脑图弹窗 ===================

interface PresetMindMapModalProps {
  preset: PresetMeta;
  data: PresetPlanData;
  source: "preset" | "ai";
  regenerating: boolean;
  regenError: string;
  selectedNodeId?: string;
  onClose: () => void;
  onRegenerate: () => void;
  onSelectNode: (node: KnowledgeNode) => void;
  onImportAll: () => void;
}

function PresetMindMapModal({
  preset,
  data,
  source,
  regenerating,
  regenError,
  selectedNodeId,
  onClose,
  onRegenerate,
  onSelectNode,
  onImportAll,
}: PresetMindMapModalProps) {
  // 按 frequency 统计
  const stats = useMemo(() => {
    const high = data.knowledgeTree.filter((n) => n.frequency === "高").length;
    return {
      total: data.knowledgeTree.length,
      high,
      questions: data.questions.length,
      scheduleDays: new Set(data.schedule.map((s) => s.day)).size,
    };
  }, [data]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 顶部：标题 + 右上角操作 */}
        <div className="flex items-start justify-between p-4 border-b bg-gradient-to-r from-gray-50 to-white">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{preset.icon}</span>
              <div className="min-w-0">
                <h2 className="text-lg font-bold truncate">{data.topic}</h2>
                <p className="text-xs text-gray-500">
                  {stats.total} 知识点 · {stats.questions} 题 · {stats.scheduleDays} 天计划 ·
                  高频 {stats.high} 个
                  {source === "ai" && (
                    <span className="ml-2 px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-medium">
                      AI 重生成
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 ml-2">
            <button
              onClick={onRegenerate}
              disabled={regenerating}
              className="px-3 py-1.5 text-xs bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center gap-1"
              title="调用 AI 重新生成整个知识树、面试题与学习计划"
            >
              {regenerating ? (
                <>
                  <span className="inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  生成中...
                </>
              ) : (
                <>🔄 重新生成</>
              )}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="关闭"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 重新生成错误 */}
        {regenError && (
          <div className="px-4 py-2 bg-red-50 text-red-600 text-xs border-b">
            重新生成失败：{regenError}
          </div>
        )}

        {/* 脑图 */}
        <div className="flex-1 overflow-auto p-4 bg-gray-50 min-h-[400px]">
          {regenerating ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4" />
              <p className="text-sm text-gray-600 font-medium">
                AI 正在重新生成知识树...
              </p>
              <p className="text-xs text-gray-400 mt-1">
                预计 30-90 秒，请勿关闭弹窗
              </p>
            </div>
          ) : (
            <MindMap
              nodes={data.knowledgeTree}
              topic={data.topic}
              selectedNodeId={selectedNodeId}
              onSelectNode={onSelectNode}
            />
          )}
        </div>

        {/* 底部：操作 */}
        <div className="p-3 border-t bg-white flex items-center justify-between gap-2">
          <p className="text-xs text-gray-500 flex-1">
            💡 点击任意知识点可立即开始学习该节点，或导入整个知识库
          </p>
          <button
            onClick={onImportAll}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            一键导入全部 →
          </button>
        </div>
      </div>
    </div>
  );
}
