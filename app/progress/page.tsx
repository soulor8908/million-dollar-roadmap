import { ProgressDashboard } from "@/components/ProgressDashboard";

export default function ProgressPage() {
  return (
    <main className="p-4 space-y-4 max-w-md mx-auto">
      <h1 className="text-lg font-bold">📊 进度查看</h1>
      <ProgressDashboard />
    </main>
  );
}
