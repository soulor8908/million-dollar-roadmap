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
}

// AI 分析结果
export interface AIAnalysis {
  summary: string;
  patterns: string[];
  suggestions: string[];
}
