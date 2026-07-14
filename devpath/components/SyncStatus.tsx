"use client";

// components/SyncStatus.tsx
// 数据同步状态组件：显示同步状态 + 上次同步时间 + 手动上传 + 跨设备恢复
// 可在 profile 页面或首页使用。

import { useState, useEffect, useCallback } from "react";
import { getUserId, uploadAll, downloadAll, getLastSyncedAt } from "@/lib/sync";

type Status = "idle" | "syncing" | "success" | "error";

export function SyncStatus() {
  const [userId, setUserId] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const refresh = useCallback(async () => {
    const id = await getUserId();
    setUserId(id);
    setLastSync(await getLastSyncedAt());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleUpload() {
    setStatus("syncing");
    setMessage("");
    try {
      await uploadAll();
      setStatus("success");
      setMessage("已上传到云端");
      await refresh();
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "上传失败");
    }
  }

  async function handleDownload() {
    if (!window.confirm("从云端恢复会与本地数据合并（较新者覆盖），确认继续？")) return;
    setStatus("syncing");
    setMessage("");
    try {
      const has = await downloadAll();
      setStatus("success");
      setMessage(has ? "已从云端恢复" : "云端暂无数据");
      await refresh();
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "恢复失败");
    }
  }

  function copyUserId() {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const statusText =
    status === "syncing"
      ? "同步中…"
      : status === "success"
        ? "已同步"
        : status === "error"
          ? "同步失败"
          : "未同步";

  const statusColor =
    status === "success"
      ? "text-green-600"
      : status === "error"
        ? "text-red-600"
        : status === "syncing"
          ? "text-blue-600"
          : "text-gray-500";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className={`text-sm ${statusColor}`}>{statusText}</span>
        {lastSync && (
          <span className="text-xs text-gray-400">上次同步：{formatTime(lastSync)}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium">用户 ID</label>
        <div className="mt-1 flex gap-2">
          <input
            value={userId}
            readOnly
            className="w-full rounded border bg-gray-50 px-2 py-1 font-mono text-xs"
          />
          <button
            onClick={copyUserId}
            className="shrink-0 rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
          >
            {copied ? "已复制 ✓" : "复制"}
          </button>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          跨设备恢复时在新设备粘贴同一 userId
        </p>
      </div>

      {message && <p className={`text-sm ${status === "error" ? "text-red-600" : "text-gray-600"}`}>{message}</p>}

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleUpload}
          disabled={status === "syncing"}
          className="rounded-lg bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
        >
          上传到云端
        </button>
        <button
          onClick={handleDownload}
          disabled={status === "syncing"}
          className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
        >
          从云端恢复
        </button>
      </div>
    </div>
  );
}

function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("zh-CN", { hour12: false });
  } catch {
    return iso;
  }
}
