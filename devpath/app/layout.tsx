import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Nav } from "@/components/Nav";

export const metadata: Metadata = {
  title: "devpath — AI 驱动的开发者成长 OS",
  description: "告诉 AI 你想学什么，它给你拆知识树、排学习计划、生面试题、按遗忘曲线复习",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-50 text-gray-900 min-h-screen pb-16">
        {children}
        <Nav />
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch((e) => console.warn('SW reg failed:', e));
              });
            }`,
          }}
        />
      </body>
    </html>
  );
}
