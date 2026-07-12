import { describe, it, expect, beforeEach } from "vitest";
import { saveToken, loadToken, clearToken } from "../storage";

describe("storage", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("saveToken 后 loadToken 能取回原文", async () => {
    await saveToken("ghp_test123");
    const loaded = await loadToken();
    expect(loaded).toBe("ghp_test123");
  });

  it("clearToken 后 loadToken 返回 null", async () => {
    await saveToken("ghp_test123");
    clearToken();
    const loaded = await loadToken();
    expect(loaded).toBeNull();
  });

  it("未存储时 loadToken 返回 null", async () => {
    const loaded = await loadToken();
    expect(loaded).toBeNull();
  });
});
