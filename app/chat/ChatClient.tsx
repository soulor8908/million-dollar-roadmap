"use client";

// app/chat/ChatClient.tsx
// AI 聊天界面：支持多对话管理、流式响应、历史搜索、提示词库、模型选择

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getApiToken } from "@/lib/api-client";
import {
  type ChatMessage,
  type Conversation,
  type ModelConfig,
  type LearningPlan,
  KEY_PREFIXES,
} from "@/lib/types";
import {
  listConversations,
  createConversation,
  getConversation,
  deleteConversation,
  getMessages,
  addMessage,
  togglePin,
  renameConversation,
  cleanupOldConversations,
  searchConversations,
} from "@/lib/chat-store";
import { listModelConfigs, getDefaultModelConfig } from "@/lib/model-config";
import { AnswerContent } from "@/components/CodeBlock";
import { buildChatContext, buildToolContext } from "@/lib/ai/chat-context";
import type { ClientAction } from "@/lib/ai/chat-tools";
import { createReminder, startReminderPolling } from "@/lib/reminder";
import { getItem as dbGet, setItem as dbSet } from "@/lib/storage/db";
import { scheduleAutoSync } from "@/lib/sync";
import {
  recordAICall,
  trackAIFeedback,
  startTimer,
  makeInputDigest,
  makeOutputDigest,
  generateCallId,
} from "@/lib/ai/quality-tracker";

// 内置提示词库
const BUILTIN_PROMPTS = [
  "详细解释这个概念",
  "给出代码示例",
  "对比优缺点",
  "面试中怎么回答",
  "常见误区有哪些",
];

// AI 工具快捷指令
const TOOL_PROMPTS = [
  "今天有什么安排？",
  "接下来该学什么？",
  "30分钟后提醒我学习",
  "复盘一下今天的表现",
  "未来几天有什么计划？",
];

// 格式化为相对时间（如"3 分钟前"、"昨天"）
function relativeTime(iso: string): string {
  const now = Date.now();
  const t = new Date(iso).getTime();
  const diff = now - t;
  if (diff < 0) return "刚刚";
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "刚刚";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} 分钟前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} 小时前`;
  const day = Math.floor(hr / 24);
  if (day === 1) return "昨天";
  if (day < 7) return `${day} 天前`;
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export default function ChatClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [streamContent, setStreamContent] = useState("");
  const [modelConfigs, setModelConfigs] = useState<ModelConfig[]>([]);
  const [selectedModelId, setSelectedModelId] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  // AI 调用记录 ID 映射：messageId → callId（用于反馈归因，仅当前会话有效）
  const aiCallIdMap = useRef<Map<string, string>>(new Map());

  // 刷新对话列表
  const refreshConversations = useCallback(async () => {
    const list = await listConversations();
    setConversations(list);
  }, []);

  // 刷新模型配置列表（从 profile 页返回时模型列表可能已变化）
  const refreshModelConfigs = useCallback(async () => {
    const configs = await listModelConfigs();
    setModelConfigs(configs);
    if (configs.length > 0) {
      // 如果当前选中的模型已不存在，回退到第一个（默认模型排第一）
      const stillExists = configs.find((c) => c.id === selectedModelId);
      if (!stillExists) {
        setSelectedModelId(configs[0].id);
      }
    }
  }, [selectedModelId]);

  // 加载某个对话的消息
  const loadConversation = useCallback(async (conv: Conversation) => {
    setActiveConv(conv);
    const msgs = await getMessages(conv.id);
    setMessages(msgs);
    // 清空当前会话的 AI 调用映射（历史消息不在当前会话生成，不展示反馈按钮）
    aiCallIdMap.current.clear();
  }, []);

  // 初始化
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await cleanupOldConversations();
        const [convs, configs, defaultCfg] = await Promise.all([
          listConversations(),
          listModelConfigs(),
          getDefaultModelConfig(),
        ]);
        if (cancelled) return;
        setConversations(convs);
        setModelConfigs(configs);
        setSelectedModelId(defaultCfg?.id ?? "");

        const convId = searchParams.get("conversationId");
        const prefill = searchParams.get("prefill");
        if (convId) {
          const conv = await getConversation(convId);
          if (cancelled) return;
          if (conv) {
            await loadConversation(conv);
            if (conv.modelConfigId) setSelectedModelId(conv.modelConfigId);
          }
        }
        if (prefill) {
          try {
            setInput(decodeURIComponent(prefill));
          } catch {
            setInput(prefill);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 实时搜索历史
  const filteredConversations = (() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) => c.title.toLowerCase().includes(q));
  })();

  // 页面重新可见时刷新模型配置（从 profile 页添加模型后返回）
  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "visible") {
        refreshModelConfigs();
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [refreshModelConfigs]);

  // 启动提醒轮询（浏览器通知）
  useEffect(() => {
    startReminderPolling();
  }, []);

  // 执行工具返回的客户端动作（写入 IndexedDB）
  const executeClientAction = useCallback(async (action: ClientAction): Promise<void> => {
    try {
      switch (action.type) {
        case "create_reminder": {
          const params = action.params as {
            title: string;
            scheduledFor: string;
            body?: string;
          };
          await createReminder(params.title, params.scheduledFor, {
            body: params.body,
          });
          break;
        }
        case "toggle_plan_freeze": {
          const params = action.params as { planId: string; freeze: boolean };
          const plan = await dbGet<LearningPlan>(KEY_PREFIXES.PLAN + params.planId);
          if (plan) {
            await dbSet(KEY_PREFIXES.PLAN + params.planId, {
              ...plan,
              frozen: params.freeze,
              updatedAt: new Date().toISOString(),
            });
            scheduleAutoSync();
          }
          break;
        }
        case "set_plan_priority": {
          const params = action.params as { planId: string; priority: number };
          const plan = await dbGet<LearningPlan>(KEY_PREFIXES.PLAN + params.planId);
          if (plan) {
            await dbSet(KEY_PREFIXES.PLAN + params.planId, {
              ...plan,
              priority: params.priority,
              updatedAt: new Date().toISOString(),
            });
            scheduleAutoSync();
          }
          break;
        }
        case "adjust_plan": {
          const params = action.params as {
            planId: string;
            action: "delay" | "skip" | "redistribute";
            targetDay?: number;
          };
          const plan = await dbGet<LearningPlan>(KEY_PREFIXES.PLAN + params.planId);
          if (plan && params.targetDay !== undefined) {
            const dayTasks = plan.schedule.filter((s) => s.day === params.targetDay);
            if (params.action === "skip") {
              // 跳过：标记为已完成（跳过）
              for (const task of dayTasks) {
                task.completed = true;
                task.completedAt = new Date().toISOString();
              }
            } else if (params.action === "delay") {
              // 延后：将该天所有任务的 day +1，后续任务也顺延
              const maxDay = Math.max(...plan.schedule.map((s) => s.day));
              for (const task of plan.schedule) {
                if (task.day >= params.targetDay) {
                  task.day += 1;
                }
              }
              void maxDay;
            } else if (params.action === "redistribute") {
              // 重新分配：将该天任务分散到未来 3 天
              const futureDays = [params.targetDay + 1, params.targetDay + 2, params.targetDay + 3];
              dayTasks.forEach((task, i) => {
                task.day = futureDays[i % futureDays.length];
              });
            }
            await dbSet(KEY_PREFIXES.PLAN + params.planId, {
              ...plan,
              updatedAt: new Date().toISOString(),
            });
            scheduleAutoSync();
          }
          break;
        }
      }
    } catch (e) {
      console.warn("[chat] 执行客户端动作失败:", e);
    }
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamContent]);

  // 切换对话
  const switchConversation = useCallback(
    async (conv: Conversation) => {
      setShowHistory(false);
      await loadConversation(conv);
      if (conv.modelConfigId) setSelectedModelId(conv.modelConfigId);
      const params = new URLSearchParams();
      params.set("conversationId", conv.id);
      router.replace(`/chat?${params.toString()}`);
    },
    [loadConversation, router]
  );

  // 新建对话
  const handleNewConversation = useCallback(() => {
    setActiveConv(null);
    setMessages([]);
    setInput("");
    setShowHistory(false);
    setError(null);
    router.replace("/chat");
    inputRef.current?.focus();
  }, [router]);

  // 删除对话
  const handleDelete = useCallback(
    async (id: string) => {
      await deleteConversation(id);
      if (activeConv?.id === id) {
        handleNewConversation();
      }
      await refreshConversations();
    },
    [activeConv, handleNewConversation, refreshConversations]
  );

  // 切换收藏
  const handleTogglePin = useCallback(
    async (id: string) => {
      await togglePin(id);
      await refreshConversations();
      if (activeConv?.id === id) {
        const updated = await getConversation(id);
        if (updated) setActiveConv(updated);
      }
    },
    [activeConv, refreshConversations]
  );

  // 重命名对话
  const handleRename = useCallback(
    async (id: string) => {
      const title = window.prompt("请输入新的对话标题", activeConv?.title ?? "");
      if (title === null) return;
      await renameConversation(id, title);
      await refreshConversations();
      if (activeConv?.id === id) {
        const updated = await getConversation(id);
        if (updated) setActiveConv(updated);
      }
    },
    [activeConv, refreshConversations]
  );

  // 应用提示词
  const applyPrompt = useCallback((prompt: string) => {
    setInput((prev) => {
      if (!prev.trim()) return prompt;
      return `${prev}\n${prompt}`;
    });
    setShowPrompts(false);
    inputRef.current?.focus();
  }, []);

  // 发送消息
  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || streaming) return;

    setError(null);
    let conv = activeConv;
    try {
      // 没有活动对话则先创建
      if (!conv) {
        conv = await createConversation({
          title: text.slice(0, 30),
          modelConfigId: selectedModelId || undefined,
        });
        setActiveConv(conv);
        const params = new URLSearchParams();
        params.set("conversationId", conv.id);
        router.replace(`/chat?${params.toString()}`);
      }

      // 保存用户消息
      const userMsg = await addMessage({
        conversationId: conv.id,
        role: "user",
        content: text,
      });
      const newMessages = [...messages, userMsg];
      setMessages(newMessages);
      setInput("");

      // 准备请求
      // 优先用选中的模型，否则用第一个（防止 selectedModelId 为空时回退到服务端默认模型）
      let modelConfig = modelConfigs.find((m) => m.id === selectedModelId);
      // 如果选中 ID 为空或未匹配到，但有配置列表，用第一个（getDefaultModelConfig 已排序）
      if (!modelConfig && modelConfigs.length > 0) {
        modelConfig = modelConfigs[0];
        setSelectedModelId(modelConfig.id);
      }
      // 如果 modelConfigs 为空（可能页面刚加载还没刷新），尝试重新加载一次
      if (!modelConfig) {
        const freshConfigs = await listModelConfigs();
        if (freshConfigs.length > 0) {
          setModelConfigs(freshConfigs);
          modelConfig = freshConfigs[0];
          setSelectedModelId(modelConfig.id);
        }
      }
      // 最终仍然没有模型配置 → 阻止发送，给出明确提示
      if (!modelConfig || !modelConfig.apiKey) {
        setError(
          '未配置 AI 模型。请前往「我的 → AI 模型配置」添加模型（需填写 API Key），或点击下方"去添加"链接。'
        );
        return;
      }
      const history = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // AI Native 升级：构建当前用户上下文快照（最新计划/错题/能量等）
      // 失败时静默降级为空字符串，不影响聊天主流程
      let contextSnapshot = "";
      try {
        contextSnapshot = await buildChatContext();
      } catch {
        contextSnapshot = "";
      }

      // AI 工具上下文：结构化数据供工具读取（计划/日志/作息/提醒等）
      // 失败时静默降级为 undefined（不启用工具）
      let toolContext = undefined;
      try {
        toolContext = await buildToolContext();
      } catch {
        toolContext = undefined;
      }

      // AI 质量追踪：生成 callId + 计时
      const callId = generateCallId();
      const stopTimer = startTimer();

      const token = await getApiToken();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          messages: history,
          modelConfig,
          contextSnapshot,
          toolContext,
        }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(
          `请求失败 (${res.status})${errText ? `: ${errText}` : ""}`
        );
      }
      if (!res.body) {
        throw new Error("响应没有流式内容");
      }

      setStreaming(true);
      setStreamContent("");

      // 读取流并解析 SSE
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";
      // 收集工具返回的客户端动作（流结束后统一执行）
      const pendingActions: ClientAction[] = [];

      // 解析 Vercel AI SDK data stream 协议的 data 行
      const parseDataLine = (line: string): string => {
        // 形如 0:"text chunk" 或 a:{toolResult}
        const idx = line.indexOf(":");
        if (idx <= 0) return "";
        const type = line.slice(0, idx);
        const payload = line.slice(idx + 1);
        // type "0" 表示文本块
        if (type === "0") {
          try {
            const parsed = JSON.parse(payload);
            if (typeof parsed === "string") return parsed;
          } catch {
            return "";
          }
        }
        // type "a" 表示工具结果，检查是否包含 clientAction
        if (type === "a") {
          try {
            const parsed = JSON.parse(payload) as {
              result?: { clientAction?: ClientAction };
            };
            if (parsed.result?.clientAction) {
              pendingActions.push(parsed.result.clientAction);
            }
          } catch {
            /* ignore */
          }
        }
        // type "2" 表示结束，type "3" 表示错误
        return "";
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // 按行处理（SSE 以 \n 分隔）
        let nlIdx: number;
        while ((nlIdx = buffer.indexOf("\n")) !== -1) {
          const rawLine = buffer.slice(0, nlIdx);
          buffer = buffer.slice(nlIdx + 1);
          const line = rawLine.trim();
          if (!line) continue;
          // 去掉 SSE 的 "data: " 前缀
          if (line.startsWith("data:")) {
            const data = line.slice(5).trim();
            if (data === "[DONE]") continue;
            const chunk = parseDataLine(data);
            if (chunk) {
              acc += chunk;
              setStreamContent(acc);
            }
          } else if (!line.startsWith(":")) {
            // 没有 data: 前缀的行也可能是 data stream 协议（部分实现直接输出）
            const chunk = parseDataLine(line);
            if (chunk) {
              acc += chunk;
              setStreamContent(acc);
            }
          }
        }
      }

      // 保存 AI 消息
      const finalContent = acc || "(无响应内容)";
      const aiMsg = await addMessage({
        conversationId: conv.id,
        role: "assistant",
        content: finalContent,
      });
      setMessages((prev) => [...prev, aiMsg]);
      setStreamContent("");
      setStreaming(false);

      // 执行工具返回的客户端动作（创建提醒/调整计划等）
      // 异步执行，不阻塞 UI
      if (pendingActions.length > 0) {
        void Promise.all(pendingActions.map((a) => executeClientAction(a))).catch(
          () => {},
        );
      }

      // AI 质量追踪：记录调用 + 关联到 AI 消息（异步，失败静默）
      const durationMs = stopTimer();
      aiCallIdMap.current.set(aiMsg.id, callId);
      void recordAICall({
        callId,
        scene: "chat",
        promptId: "chat",
        inputDigest: makeInputDigest({ conversationId: conv.id, userMessage: text }),
        outputDigest: makeOutputDigest(finalContent),
        schemaValid: true,
        durationMs,
        source: "ai",
        refId: conv.id,
      }).catch(() => {});

      await refreshConversations();
    } catch (e) {
      setStreaming(false);
      setStreamContent("");
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
    }
  }, [
    input,
    streaming,
    activeConv,
    messages,
    modelConfigs,
    selectedModelId,
    refreshConversations,
    executeClientAction,
    router,
  ]);

  // 显式反馈：用户对某条 AI 回复点 👎
  const handleThumbsDown = useCallback((messageId: string) => {
    const callId = aiCallIdMap.current.get(messageId);
    if (!callId) return;
    void trackAIFeedback({
      callRecordId: callId,
      scene: "chat",
      rating: 1,
    }).catch(() => {});
  }, []);

  // 键盘快捷键：Enter 发送，Shift+Enter 换行
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  if (loading) {
    return (
      <div className="h-dvh flex items-center justify-center">
        <p className="text-gray-400 dark:text-gray-500">加载中...</p>
      </div>
    );
  }

  return (
    <div className="h-[calc(100dvh-4rem)] flex flex-col overflow-hidden">
      {/* 顶部栏（固定不动） */}
      <header className="shrink-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 p-3 flex items-center gap-2 z-20">
        <button
          type="button"
          onClick={() => setShowHistory(true)}
          aria-label="历史对话"
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-lg"
        >
          ☰
        </button>
        <h1 className="flex-1 truncate font-medium text-sm">
          {activeConv?.title ?? "新对话"}
        </h1>
        <button
          type="button"
          onClick={() => activeConv && handleTogglePin(activeConv.id)}
          aria-label="收藏对话"
          className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-lg ${
            activeConv?.pinned ? "opacity-100" : "opacity-50"
          }`}
          disabled={!activeConv}
        >
          📌
        </button>
        <button
          type="button"
          onClick={() => activeConv && handleDelete(activeConv.id)}
          aria-label="删除对话"
          className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-lg opacity-70"
          disabled={!activeConv}
        >
          🗑️
        </button>
      </header>

      {/* 来源横幅 */}
      {activeConv?.source && (
        <div className="bg-amber-50 border-b px-3 py-2 text-xs flex items-center gap-2">
          <span>📎 来自：</span>
          {activeConv.source.planId ? (
            <Link
              href={`/learn/${activeConv.source.planId}`}
              className="text-blue-600 hover:underline truncate"
            >
              {activeConv.source.title} →
            </Link>
          ) : (
            <span className="truncate">{activeConv.source.title}</span>
          )}
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-3 py-2 text-xs text-red-600 flex items-center justify-between gap-2">
          <span className="truncate">⚠️ {error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600 shrink-0"
            aria-label="关闭错误"
          >
            ✕
          </button>
        </div>
      )}

      {/* 消息区（仅此区域滚动） */}
      <main className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && !streaming && (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-10">
            <div className="text-5xl mb-4">💬</div>
            <p className="mb-1 text-gray-600 dark:text-gray-300 font-medium">
              开始一段新对话
            </p>
            <p className="mb-6 text-sm">向 AI 提问，获取即时解答</p>
            <div className="flex flex-wrap gap-2 justify-center max-w-md mb-4">
              {BUILTIN_PROMPTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => applyPrompt(p)}
                  className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
            <p className="mb-2 text-xs text-gray-400">AI 工具能力</p>
            <div className="flex flex-wrap gap-2 justify-center max-w-md">
              {TOOL_PROMPTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => applyPrompt(p)}
                  className="px-3 py-1.5 text-xs bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-full transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) =>
          m.role === "user" ? (
            <div
              key={m.id}
              className="ml-auto max-w-[80%] bg-blue-500 text-white rounded-2xl rounded-br-sm px-3 py-2 text-sm whitespace-pre-wrap break-words"
            >
              {m.content}
            </div>
          ) : (
            <div
              key={m.id}
              className="mr-auto max-w-[80%] bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-sm px-3 py-2 text-sm group"
            >
              <AnswerContent text={m.content} />
              {/* 显式反馈：👎 仅在当前会话生成的消息上展示（历史消息无 callId，不展示） */}
              {aiCallIdMap.current.has(m.id) && (
                <button
                  type="button"
                  onClick={() => handleThumbsDown(m.id)}
                  className="mt-1 text-[11px] text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="这条回复没帮助"
                  title="这条回复没帮助"
                >
                  👎
                </button>
              )}
            </div>
          )
        )}

        {/* 流式输出中的临时气泡 */}
        {streaming && (
          <div className="mr-auto max-w-[80%] bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-sm px-3 py-2 text-sm">
            {streamContent ? (
              <AnswerContent text={streamContent} />
            ) : (
              <span className="text-gray-400 inline-flex items-center gap-1">
                <span className="animate-pulse">●</span>
                <span className="animate-pulse" style={{ animationDelay: "0.2s" }}>●</span>
                <span className="animate-pulse" style={{ animationDelay: "0.4s" }}>●</span>
              </span>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* 底部输入栏（固定在底部，不随消息滚动） */}
      <footer className="shrink-0 bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-3">
        {showPrompts && (
          <div className="mb-2 flex flex-wrap gap-2">
            {BUILTIN_PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => applyPrompt(p)}
                className="px-3 py-1 text-xs bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-full transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        )}
        <div className="flex items-end gap-2">
          <button
            type="button"
            onClick={() => setShowPrompts((v) => !v)}
            aria-label="提示词库"
            className={`p-2 rounded shrink-0 text-lg ${
              showPrompts ? "bg-amber-100 dark:bg-amber-900/50" : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            ⚡
          </button>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息... (Enter 发送，Shift+Enter 换行)"
            rows={1}
            className="flex-1 resize-none border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 max-h-32 bg-white dark:bg-gray-700 dark:text-gray-100"
            disabled={streaming}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || streaming}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            {streaming ? "..." : "发送"}
          </button>
        </div>
        {/* 模型选择器 */}
        <div className="mt-2 flex items-center gap-2 text-xs">
          <span className="text-gray-500 dark:text-gray-400">模型:</span>
          {modelConfigs.length === 0 ? (
            <span className="text-gray-400 dark:text-gray-500">
              <span className="text-red-500 font-medium">⚠ 未配置模型</span>{" "}
              ·{" "}
              <Link href="/profile" className="text-blue-500 hover:underline">
                去添加 →
              </Link>
            </span>
          ) : (
            <select
              value={selectedModelId}
              onChange={(e) => setSelectedModelId(e.target.value)}
              className="border rounded px-2 py-1 text-xs bg-white dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              {modelConfigs.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </footer>

      {/* 历史抽屉 */}
      {showHistory && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setShowHistory(false)}
            aria-hidden="true"
          />
          <aside className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform flex flex-col">
            {/* 抽屉顶部：新建按钮 */}
            <div className="p-3 border-b dark:border-gray-700">
              <button
                type="button"
                onClick={handleNewConversation}
                className="w-full px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
              >
                + 新建对话
              </button>
            </div>
            {/* 对话列表 */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredConversations.length === 0 ? (
                <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-6">
                  {searchQuery ? "无匹配对话" : "暂无历史对话"}
                </p>
              ) : (
                filteredConversations.map((c) => (
                  <div
                    key={c.id}
                    className={`group p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      activeConv?.id === c.id ? "bg-blue-50 dark:bg-blue-900/30" : ""
                    }`}
                    onClick={() => switchConversation(c)}
                  >
                    <div className="flex items-start gap-1">
                      <span className="text-sm flex-1 truncate text-gray-800 dark:text-gray-200">{c.title}</span>
                      {c.pinned && <span className="text-xs shrink-0">📌</span>}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[11px] text-gray-400 dark:text-gray-500">
                        {relativeTime(c.lastMessageAt)}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTogglePin(c.id);
                          }}
                          className="text-[11px] text-gray-400 hover:text-gray-600"
                          aria-label="收藏"
                        >
                          📌
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRename(c.id);
                          }}
                          className="text-[11px] text-gray-400 hover:text-gray-600"
                          aria-label="重命名"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm("确定删除此对话？")) {
                              handleDelete(c.id);
                            }
                          }}
                          className="text-[11px] text-gray-400 hover:text-red-500"
                          aria-label="删除"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* 抽屉底部：搜索框 */}
            <div className="p-3 border-t dark:border-gray-700">
              <input
                type="text"
                value={searchQuery}
                onChange={async (e) => {
                  setSearchQuery(e.target.value);
                  const q = e.target.value.trim();
                  if (q) {
                    const results = await searchConversations(q);
                    setConversations(results);
                  } else {
                    await refreshConversations();
                  }
                }}
                placeholder="搜索对话..."
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
              />
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
