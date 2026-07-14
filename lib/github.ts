export interface FileContent {
  content: string;
  sha: string;
}

export class GitHubClient {
  constructor(
    private owner: string,
    private repo: string,
    private token: string
  ) {}

  async readFile(path: string): Promise<FileContent | null> {
    // 走 /api/github/ 代理路由，避免在浏览器直接调用 GitHub API 暴露 token
    const res = await fetch(`/api/github/${path}`, {
      headers: {
        "x-github-token": this.token,
      },
    });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
    const data = await res.json();
    const content = new TextDecoder().decode(
      Uint8Array.from(atob(data.content.replace(/\n/g, "")), (c) => c.charCodeAt(0))
    );
    return { content, sha: data.sha };
  }

  async writeFile(
    path: string,
    content: string,
    message: string,
    sha?: string
  ): Promise<string> {
    const body: Record<string, string> = {
      message,
      // 用 TextEncoder 替代已废弃的 unescape(encodeURIComponent(...))
      content: btoa(String.fromCharCode(...new TextEncoder().encode(content))),
    };
    if (sha) body.sha = sha;

    // 走 /api/github/ 代理路由，避免在浏览器直接调用 GitHub API 暴露 token
    const res = await fetch(`/api/github/${path}`, {
      method: "PUT",
      headers: {
        "x-github-token": this.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data.content.sha as string;
  }

  async listFiles(dirPath: string): Promise<string[]> {
    // 走 /api/github/ 代理路由，避免在浏览器直接调用 GitHub API 暴露 token
    const res = await fetch(`/api/github/${dirPath}`, {
      headers: {
        "x-github-token": this.token,
      },
    });
    if (res.status === 404) return [];
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data
      .filter((item: { type: string }) => item.type === "file")
      .map((item: { name: string }) => item.name);
  }
}
