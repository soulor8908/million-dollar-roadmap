"use client";

// app/rest/page.tsx
// 高效休息页面：呼吸引导 + 能量评分 + 休息方式推荐
// 从主项目迁移（devpath 不依赖 GitHub，方法库内置默认值）

import { useState } from "react";
import { BreathTimer } from "@/components/BreathTimer";

const REST_METHODS = `## 低能量（1-2 分）
- NSDR 非睡眠深度休息（10-20 分钟）
- 478 呼吸法（4 轮）
- 小睡 15-20 分钟（避免进入深度睡眠）

## 中等疲劳（3 分）
- 散步 10 分钟（户外更佳）
- 渐进式肌肉放松
- 远眺窗外 + 喝水

## 状态良好（4-5 分）
- 远眺放松眼睛
- 走动伸展
- 喝水 / 茶歇`;

export default function RestPage() {
  const [energy, setEnergy] = useState<number>(3);

  return (
    <main className="mx-auto max-w-md space-y-4 p-4 pb-20">
      <h1 className="text-lg font-bold">😴 高效休息</h1>

      <BreathTimer />

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <p className="text-sm font-medium mb-2">当前能量</p>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => setEnergy(n)}
              className={`flex-1 py-2 rounded-lg font-bold ${
                energy === n ? "bg-black text-white" : "bg-gray-100 text-gray-400"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-1 text-center">
          {energy <= 2 ? "推荐：NSDR / 478呼吸 / 小睡" :
           energy === 3 ? "推荐：散步 / 渐进式放松" :
           "推荐：远眺 / 走动 / 喝水"}
        </p>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <p className="text-sm font-medium mb-2">休息方法库</p>
        <pre className="text-xs text-gray-600 whitespace-pre-wrap font-sans">
          {REST_METHODS}
        </pre>
      </div>
    </main>
  );
}
