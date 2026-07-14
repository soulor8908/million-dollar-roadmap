import { HomeRoutine } from "@/components/HomeRoutine";
import { EnergyMeter } from "@/components/EnergyMeter";

export default function Home() {
  return (
    <main className="p-4 space-y-4 max-w-md mx-auto">
      <h1 className="text-lg font-bold">🎯 今日指挥中心</h1>

      <HomeRoutine />

      <EnergyMeter />

      <div className="grid grid-cols-3 gap-2">
        <a href="/emotion" className="bg-white rounded-xl p-3 shadow-sm text-center">
          <p className="text-2xl">📖</p>
          <p className="text-xs mt-1">记情绪</p>
        </a>
        <a href="/rest" className="bg-white rounded-xl p-3 shadow-sm text-center">
          <p className="text-2xl">😴</p>
          <p className="text-xs mt-1">去休息</p>
        </a>
        <a href="/daily" className="bg-white rounded-xl p-3 shadow-sm text-center">
          <p className="text-2xl">📝</p>
          <p className="text-xs mt-1">写日志</p>
        </a>
      </div>
    </main>
  );
}
