import { AnalyzePanel } from "@/components/AnalyzePanel";

export default function AnalyzePage() {
  return (
    <main className="p-4 space-y-4 max-w-md mx-auto">
      <h1 className="text-lg font-bold">🧠 AI 分析</h1>
      <p className="text-xs text-gray-500">
        基于最近 14 天的情绪笔记和日志，AI 识别能量模式、情绪触发器，给出具体调整建议。
      </p>
      <AnalyzePanel />
    </main>
  );
}
