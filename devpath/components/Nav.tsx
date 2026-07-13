"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "今日", icon: "🎯" },
  { href: "/learn", label: "学习", icon: "📚" },
  { href: "/review", label: "复习", icon: "🔁" },
  { href: "/stats", label: "统计", icon: "📊" },
  { href: "/favorites", label: "我的", icon: "⭐" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2 z-50">
      {items.map((item) => {
        const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
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
