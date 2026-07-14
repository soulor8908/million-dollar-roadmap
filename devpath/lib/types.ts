// lib/types.ts
// devpath 全部数据模型（对应 spec Data Model）

// 学习计划
export interface LearningPlan {
  id: string;
  topic: string;
  knowledgeTree: KnowledgeNode[];
  questions: Question[];
  schedule: ScheduleItem[];
  dailyMinutes: number;
  maxNewPerDay: number;
  fsrsMode: "conservative" | "standard" | "aggressive";
  createdAt: string;
  updatedAt: string;
}

// 知识节点
export interface KnowledgeNode {
  id: string;
  title: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  prerequisites: string[];
  frequency: "高" | "中" | "低";
  summary: string;
  mastery: number;
  customOrder?: number;
}

// 面试题
export interface Question {
  id: string;
  nodeId: string;
  question: string;
  answer: string;
  keyPoints: string[];
  followUps: string[];
  codeSnippet?: string;
  favorited: boolean;
  favoritedAt?: string;
}

// 试题集收藏
export interface FavoriteDeck {
  id: string;
  planId: string;
  topic: string;
  questionIds: string[];
  questionCount: number;
  favoritedAt: string;
  questions: Question[];
  knowledgeTree: KnowledgeNode[];
}

// 学习计划项
export interface ScheduleItem {
  day: number;
  nodeId: string;
  type: "learn" | "review";
  cardId?: string;
  estimatedMinutes: number;
  completed: boolean;
  completedAt?: string;
}

// FSRS 复习卡片
export interface ReviewCard {
  id: string;
  planId: string;
  nodeId: string;
  questionId: string;
  front: string;
  back: string;
  due: string;
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  state: 0 | 1 | 2 | 3 | 4;
  lastReview: string;
}

// 每日状态
export interface DailyStatus {
  date: string;
  energy: 1 | 2 | 3 | 4 | 5;
  mood: "good" | "neutral" | "bad";
  availableMinutes: number;
  aiAdjustedLoad: number;
  actualMinutes: number;
  /** 多巴胺干扰来源（情绪觉察流程收集，可选——旧数据无此字段） */
  dopamineTrigger?: DopamineTrigger;
}

// 情绪标签（8 种，复用主项目设计）
export type EmotionTag =
  | "焦虑"
  | "兴奋"
  | "疲惫"
  | "烦躁"
  | "满足"
  | "冲动"
  | "平静"
  | "沮丧";

// 多巴胺干扰来源
export type DopamineTrigger = "无" | "刷手机" | "游戏" | "短视频" | "甜食" | "其他";

// 情绪觉察条目（嵌入情绪觉察流程时存入 IndexedDB，key 前缀 emotion:）
export interface EmotionEntry {
  /** id 作为 IndexedDB key 后缀，保证一天多条不冲突 */
  id: string;
  /** "YYYY-MM-DD" */
  date: string;
  /** "HH:MM" */
  time: string;
  tag: EmotionTag;
  emoji: string;
  trigger: string;
  impact: string;
  coping: string;
  dopamine: DopamineTrigger;
}

// 每日时间表时段
export interface RoutineSlot {
  start: string; // "HH:MM"
  end: string; // "HH:MM"
  activity: string;
  type: "运动" | "学习" | "休息" | "家庭" | "睡眠" | "工作" | "其他";
}

// 当前任务（首页"现在该做什么"卡片）
export interface CurrentTask {
  current: RoutineSlot | null;
  next: RoutineSlot | null;
  minutesLeft: number;
}

// 复习日志
export interface ReviewLog {
  id: string;
  cardId: string;
  date: string;
  rating: 1 | 2 | 3 | 4;
  elapsedDays: number;
  stateBefore: number;
  stateAfter: number;
}

// 学习日志
export interface LearnLog {
  id: string;
  planId: string;
  nodeId: string;
  date: string;
  duration: number;
  type: "learn" | "review";
}

// 公开主页
export interface PublicProfile {
  username: string;
  displayName: string;
  avatar?: string;
  bio: string;
  visibility: {
    radar: boolean;
    heatmap: boolean;
    currentTopic: boolean;
    notes: boolean;
  };
  followerCount: number;
  followingCount: number;
  updatedAt: string;
}

// 能量模式（扩展为情绪+能量联合分析）
export interface EnergyPattern {
  weekStart: string;
  avgEnergyByWeekday: number[];
  insights: string[];
  recommendations: string[];
  /** 各情绪标签出现次数（最近 28 天） */
  emotionCounts?: Record<EmotionTag, number>;
  /** 各多巴胺干扰来源出现次数（最近 28 天，含来自 DailyStatus 与 EmotionEntry 合并） */
  dopamineCounts?: Record<DopamineTrigger, number>;
  /** 多巴胺干扰高的日子（按日期） */
  highDopamineDates?: string[];
}

// FSRS 评分
export type Rating = 1 | 2 | 3 | 4; // Again / Hard / Good / Easy

// IndexedDB key 前缀常量
export const KEY_PREFIXES = {
  PLAN: "plan:",
  CARD: "card:",
  DECK: "favorite_deck:",
  REVIEW_LOG: "review_log:",
  LEARN_LOG: "learn_log:",
  STATUS: "status:",
  /** 周报缓存：weekly:<weekStart> */
  WEEKLY: "weekly:",
  /** 情绪觉察条目：emotion:<date>_<id> */
  EMOTION: "emotion:",
  /** 每日时间表（用户在 profile 配置）：routine:default */
  ROUTINE: "routine:",
} as const;
