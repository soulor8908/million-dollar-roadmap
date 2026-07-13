import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "devpath — AI 驱动的开发者成长 OS",
  description: "告诉 AI 你想学什么，它给你拆知识树、排学习计划、生面试题、按遗忘曲线复习",
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
      </body>
    </html>
  );
}
