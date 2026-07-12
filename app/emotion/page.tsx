import { QuickEmotion } from "@/components/QuickEmotion";
import { EmotionList } from "@/components/EmotionList";

export default function EmotionPage() {
  return (
    <main className="p-4 space-y-4 max-w-md mx-auto">
      <h1 className="text-lg font-bold">📖 情绪笔记</h1>
      <QuickEmotion />
      <div>
        <p className="text-xs text-gray-500 mb-2">晨练回看 · 最近7天</p>
        <EmotionList />
      </div>
    </main>
  );
}
