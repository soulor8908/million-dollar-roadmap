"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const items = [
  { href: "/", label: "今日", icon: "🎯" },
  { href: "/emotion", label: "情绪", icon: "📖" },
  { href: "/rest", label: "休息", icon: "😴" },
  { href: "/daily", label: "日志", icon: "📝" },
  { href: "/progress", label: "学习", icon: "📊" },
  { href: "/analyze", label: "分析", icon: "🧠" },
];

export function Nav() {
  const pathname = usePathname();

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-50">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center text-xs ${
              active ? "text-black font-medium" : "text-gray-400"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
