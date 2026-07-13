export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-2">devpath</h1>
      <p className="text-gray-500">AI 驱动的开发者成长 OS</p>
      <a href="/learn" className="mt-8 px-6 py-3 bg-black text-white rounded-lg font-medium">
        开始学习
      </a>
    </div>
  );
}
