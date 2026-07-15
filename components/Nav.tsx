"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "今日", icon: "🎯" },
  { href: "/learn", label: "学习", icon: "📚" },
  { href: "/chat", label: "AI", icon: "💬" },
  { href: "/review", label: "复习", icon: "🔁" },
  { href: "/mistakes", label: "错题", icon: "❌" },
  { href: "/emotion", label: "情绪", icon: "📝" },
  { href: "/dashboard", label: "仪表盘", icon: "📈" },
  { href: "/profile", label: "我的", icon: "👤" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav aria-label="主导航" className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t dark:border-gray-800 flex justify-around py-2 z-50">
      {items.map((item) => {
        const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-label={item.label}
            aria-current={active ? "page" : undefined}
            className={`flex flex-col items-center text-xs ${
              active ? "text-black dark:text-white font-medium" : "text-gray-400"
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
