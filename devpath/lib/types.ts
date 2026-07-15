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
  /** 生成时使用的自定义提示词（用于重新生成时回填） */
  prompt?: string;
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
  // 大厂高频考点标记（true = 互联网大厂面试重点考察）
  bigTech?: boolean;
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
  // 大厂高频面试题标记
  bigTech?: boolean;
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
  /** 关联知识点（question_view 时可空） */
  nodeId?: string;
  /** 关联面试题（可选） */
  questionId?: string;
  date: string;
  /** 精确时间戳 ISO（可选，旧数据可能没有） */
  timestamp?: string;
  /** 学习时长（分钟，旧字段，兼容） */
  duration?: number;
  type: "learn" | "review" | "learn_complete" | "review_complete" | "question_view" | "question_favorite" | "question_regenerate";
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

// 用户数据云端备份（全量同步：IndexedDB 所有 key-value 打包）
export interface UserBackup {
  userId: string;
  updatedAt: string;
  version: number;
  data: Record<string, unknown>; // 所有 IndexedDB key-value
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
  /** 常用提示词库：prompt:<id> */
  PROMPT: "prompt:",
  /** 学习日志：log:<id> */
  LOG: "log:",
  /** 用户作息时间表：routine:default */
  ROUTINE_DATA: "routine:default",
} as const;

// 用户作息时间表（用于 AI 调整计划）
export interface Routine {
  /** 起床时间 HH:MM */
  wakeTime: string;
  /** 睡觉时间 HH:MM */
  sleepTime: string;
  /** 可用学习时段 */
  slots: {
    /** 时段标签：早晨/午间/晚上 */
    label: string;
    /** 开始 HH:MM */
    start: string;
    /** 结束 HH:MM */
    end: string;
    /** 可用分钟数 */
    minutes: number;
  }[];
  /** 每周可学习的星期（1-7，1=周一） */
  weekdays: number[];
  /** 偏好学习强度：轻松/标准/冲刺 */
  intensity: "light" | "standard" | "intensive";
}

// 学习统计（仪表盘用）
export interface LearnStats {
  /** 总学习天数 */
  totalDays: number;
  /** 总学习行为数 */
  totalActions: number;
  /** 已完成学习任务数 */
  learnedCount: number;
  /** 已完成复习任务数 */
  reviewedCount: number;
  /** 已查看面试题数 */
  viewedQuestions: number;
  /** 已收藏面试题数 */
  favoritedQuestions: number;
  /** 当前连续学习天数 */
  currentStreak: number;
  /** 最长连续学习天数 */
  longestStreak: number;
  /** 最近 30 天活动：{ date: count } */
  dailyActivity: Record<string, number>;
  /** 各知识点掌握度：{ nodeId: { completed, total, mastery } } */
  nodeProgress: Record<string, { completed: number; total: number; mastery: number }>;
  /** 薄弱知识点 ID（完成率 < 50%） */
  weakAreas: string[];
}

// 用户保存的常用提示词
export interface PromptLibraryItem {
  id: string;
  /** 提示词标题（用户给的名字） */
  title: string;
  /** 提示词内容（附加到 AI 生成请求的指令） */
  content: string;
  /** 创建时间 ISO */
  createdAt: string;
  /** 最近使用时间 ISO */
  usedAt?: string;
  /** 使用次数 */
  usedCount: number;
}
