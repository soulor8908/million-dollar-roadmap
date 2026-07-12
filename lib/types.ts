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
