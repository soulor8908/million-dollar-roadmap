"use client";

import { useState } from "react";
import type { EnergyLevel } from "@/lib/types";

export function EnergyMeter() {
  const [energy, setEnergy] = useState<EnergyLevel | null>(null);
  const [saved, setSaved] = useState(false);

  function record(level: EnergyLevel) {
    setEnergy(level);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">
      <p className="text-xs text-gray-500 mb-2">能量快记</p>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => record(n as EnergyLevel)}
            className={`flex-1 py-3 rounded-lg text-lg font-bold transition ${
              energy === n
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-400"
            }`}
          >
            {n}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-1 text-center">
        {saved ? "✓ 已记录" : "1=濒溃 5=巅峰"}
      </p>
    </div>
  );
}
