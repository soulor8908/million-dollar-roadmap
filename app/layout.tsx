import type { Metadata } from "next";
import "./globals.css";
import { TokenGate } from "@/components/TokenGate";
import { Nav } from "@/components/Nav";

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
        <TokenGate>
          {children}
          <Nav />
        </TokenGate>
      </body>
    </html>
  );
}
