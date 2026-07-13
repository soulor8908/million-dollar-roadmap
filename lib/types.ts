export type EnergyLevel = 1 | 2 | 3 | 4 | 5;

export type EmotionTag =
  | "焦虑"
  | "兴奋"
  | "疲惫"
  | "烦躁"
  | "满足"
  | "冲动"
  | "平静"
  | "沮丧";

export type DopamineTrigger = "刷手机" | "游戏" | "短视频" | "甜食" | "无";

export interface EmotionEntry {
  time: string;
  tag: EmotionTag;
  emoji: string;
  trigger: string;
  impact: string;
  coping: string;
  dopamine: DopamineTrigger;
}

export interface EmotionFile {
  date: string;
  entries: EmotionEntry[];
}

export interface RoutineSlot {
  start: string;
  end: string;
  activity: string;
  type: "运动" | "学习" | "休息" | "家庭" | "睡眠" | "工作" | "其他";
}

export interface CurrentTask {
  current: RoutineSlot | null;
  next: RoutineSlot | null;
  minutesLeft: number;
}

// 日志 checklist 项
export interface ChecklistItem {
  text: string;
  checked: boolean;
}

// 日志能量数据
export interface DailyEnergy {
  sleep: string;
  sleepOnTime: boolean | null;
  exerciseDone: boolean | null;
  exerciseNote: string;
  energyMorning: number | null;
  energyNoon: number | null;
  energyEvening: number | null;
  emotion: string;
  familyQuality: number;
}

// 复盘段落
export interface DailyReview {
  good: string;
  problems: string;
  tomorrow: string;
}

// 完整的日志结构
export interface DailyLog {
  date: string;
  plan: string;
  checklist: ChecklistItem[];
  energy: DailyEnergy;
  review: DailyReview;
}

// 进度统计
export interface ProgressInfo {
  algorithmDone: number;
  algorithmTotal: number;
  algorithmPercent: number;
  streakDays: number;
  totalLogs: number;
  latestLog: string;
  weekHours: number;
  algorithmTodayCount: number;
  algorithmIndependentCount: number;
  backendWeeksDone: number;
  backendWeeksTotal: number;
}

// AI 分析结果
export interface AIAnalysis {
  summary: string;
  patterns: string[];
  suggestions: string[];
}

// LeetCode 题目（来自 algorithm/leetcode-checklist.md）
export interface LeetCodeProblem {
  id: number;          // 序号 1-200
  completed: boolean;  // [x] 为 true
  number: string;      // LeetCode 题号（如 "1"、"128"）
  title: string;       // 题目标题
  difficulty: "简单" | "中等" | "困难";
  date: string;        // 完成日期 YYYY-MM-DD，未完成为空
  independent: "✅" | "⚠️" | "❌" | "";  // 独立程度
  cost: string;        // 耗时（分钟），未完成为空
  note: string;        // 备注
  phase: number;       // 1/2/3
  category: string;    // 专题（如 "数组与字符串"）
}

// 后端学习路线一周（来自 backend/roadmap.md）
export interface BackendWeek {
  month: number;       // 1-6
  weekIndex: number;   // 1-24
  title: string;       // 如 "语法基础 + 工具链"
  completed: boolean;
  summary: string;     // 学习要点摘要
  resources: { label: string; url: string }[];  // 资料链接
  output: string;      // 产出 demo 路径
  days: string[];      // Day 1-7 拆解内容
}

// 学习中心 Tab
export type StudyTab = "algorithm" | "backend" | "stats";
