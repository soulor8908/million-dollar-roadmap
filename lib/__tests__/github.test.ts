import { describe, it, expect, vi, beforeEach } from "vitest";
import { GitHubClient } from "../github";

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("GitHubClient", () => {
  let client: GitHubClient;

  beforeEach(() => {
    client = new GitHubClient("owner", "repo", "ghp_test");
    mockFetch.mockReset();
  });

  it("readFile 返回解码后的内容", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        content: btoa("hello world"),
        sha: "abc123",
      }),
    });
    const result = await client.readFile("daily/2026-07-13.md");
    expect(result?.content).toBe("hello world");
    expect(result?.sha).toBe("abc123");
  });

  it("readFile 文件不存在时返回 null", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({ message: "Not Found" }),
    });
    const result = await client.readFile("nonexistent.md");
    expect(result).toBeNull();
  });

  it("writeFile 新文件时调用 PUT 且不带 sha", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ content: { sha: "new123" } }),
    });
    await client.writeFile("emotion/2026-07-13.md", "content", "msg");
    const call = mockFetch.mock.calls[0];
    const body = JSON.parse(call[1].body);
    expect(body.sha).toBeUndefined();
    expect(body.message).toBe("msg");
  });

  it("writeFile 更新文件时带 sha", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ content: { sha: "updated" } }),
    });
    await client.writeFile("daily/2026-07-13.md", "new", "msg", "oldsha");
    const call = mockFetch.mock.calls[0];
    const body = JSON.parse(call[1].body);
    expect(body.sha).toBe("oldsha");
  });
});
