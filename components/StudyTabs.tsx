"use client";

import { useState } from "react";
import type { StudyTab } from "@/lib/types";
import { AlgorithmList } from "./AlgorithmList";
import { BackendRoadmap } from "./BackendRoadmap";
import { ProgressDashboard } from "./ProgressDashboard";

const TABS: { key: StudyTab; label: string }[] = [
  { key: "algorithm", label: "算法" },
  { key: "backend", label: "后端" },
  { key: "stats", label: "统计" },
];

export function StudyTabs() {
  const [active, setActive] = useState<StudyTab>("algorithm");

  return (
    <div>
      <div className="border-b border-gray-200 flex">
        {TABS.map((tab) => {
          const isActive = active === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className={`flex-1 py-2 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? "text-black border-black"
                  : "text-gray-400 border-transparent"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="mt-4">
        {active === "algorithm" && <AlgorithmList />}
        {active === "backend" && <BackendRoadmap />}
        {active === "stats" && <ProgressDashboard />}
      </div>
    </div>
  );
}
