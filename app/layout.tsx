import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "作战辅助系统",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "作战系统",
  },
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
