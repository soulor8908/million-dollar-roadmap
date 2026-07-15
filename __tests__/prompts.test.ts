import { describe, it, expect } from "vitest";
import { PROMPTS, promptFingerprint, getPrompt, type PromptId } from "../lib/ai/prompts";
import type { AIScene } from "../lib/types";

describe("prompts registry", () => {
  it("所有 prompt 都有 id / version / system / changelog / scene", () => {
    for (const [key, def] of Object.entries(PROMPTS)) {
      expect(def.id, `${key}.id`).toBe(key);
      expect(def.version, `${key}.version`).toMatch(/^v\d+$/);
      expect(typeof def.system, `${key}.system`).toBe("string");
      expect(def.system.length, `${key}.system 非空`).toBeGreaterThan(10);
      expect(typeof def.changelog, `${key}.changelog`).toBe("string");
      expect(def.scene, `${key}.scene`).toBeDefined();
    }
  });

  it("scene 与 promptId 一一对应", () => {
    for (const [key, def] of Object.entries(PROMPTS)) {
      expect(def.scene, `${key} 的 scene 应等于其 id`).toBe(key);
    }
  });

  it("promptFingerprint 返回 promptId:version:hash 格式", () => {
    const fp = promptFingerprint("knowledge_decompose", "v1");
    expect(fp).toMatch(/^knowledge_decompose:v1:[0-9a-f]+$/);
  });

  it("相同 prompt 内容产生相同指纹", () => {
    const fp1 = promptFingerprint("question_generate", "v1");
    const fp2 = promptFingerprint("question_generate", "v1");
    expect(fp1).toBe(fp2);
  });

  it("不同 prompt 产生不同指纹", () => {
    const fp1 = promptFingerprint("knowledge_decompose", "v1");
    const fp2 = promptFingerprint("question_generate", "v1");
    expect(fp1).not.toBe(fp2);
  });

  it("相同 prompt 不同版本号产生不同指纹", () => {
    const fp1 = promptFingerprint("knowledge_decompose", "v1");
    const fp2 = promptFingerprint("knowledge_decompose", "v2");
    expect(fp1).not.toBe(fp2);
  });

  it("getPrompt 返回 system / version / fingerprint / scene", () => {
    const result = getPrompt("daily_nudge");
    expect(result.system).toBe(PROMPTS.daily_nudge.system);
    expect(result.version).toBe(PROMPTS.daily_nudge.version);
    expect(result.scene).toBe("daily_nudge" as AIScene);
    expect(result.fingerprint).toBe(promptFingerprint("daily_nudge", "v1"));
  });

  it("weekly_report 包含 {emotion_section} 占位符", () => {
    expect(PROMPTS.weekly_report.system).toContain("{emotion_section}");
  });

  it("所有 promptId 都能通过 getPrompt 取到", () => {
    const ids = Object.keys(PROMPTS) as PromptId[];
    for (const id of ids) {
      const result = getPrompt(id);
      expect(result.system.length).toBeGreaterThan(0);
      expect(result.fingerprint.startsWith(`${id}:`)).toBe(true);
    }
  });
});
