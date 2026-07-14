import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const token = req.headers.get("x-github-token");
  if (!token) {
    return NextResponse.json({ error: "未提供 token" }, { status: 401 });
  }

  const path = params.path.join("/");
  const owner = process.env.GITHUB_OWNER || "soulor8908";
  const repo = process.env.GITHUB_REPO || "million-dollar-roadmap";
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  // 透传条件请求头，支持 ETag / If-Modified-Since 缓存验证
  const ghHeaders: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
  };
  const ifNoneMatch = req.headers.get("if-none-match");
  const ifModifiedSince = req.headers.get("if-modified-since");
  if (ifNoneMatch) ghHeaders["If-None-Match"] = ifNoneMatch;
  if (ifModifiedSince) ghHeaders["If-Modified-Since"] = ifModifiedSince;

  const res = await fetch(url, { headers: ghHeaders });

  // 304 Not Modified：客户端可用本地缓存
  if (res.status === 304) {
    return new NextResponse(null, { status: 304 });
  }

  const data = await res.json();
  const response = NextResponse.json(data, { status: res.status });

  // 透传 ETag / Last-Modified 供客户端条件请求使用
  const etag = res.headers.get("etag");
  const lastModified = res.headers.get("last-modified");
  if (etag) response.headers.set("ETag", etag);
  if (lastModified) response.headers.set("Last-Modified", lastModified);

  // 浏览器缓存 60s，之后 stale-while-revalidate 300s
  // private: 不被 CDN 共享缓存（token 在 header 中，每个用户独立）
  response.headers.set(
    "Cache-Control",
    "private, max-age=60, stale-while-revalidate=300"
  );

  return response;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const token = req.headers.get("x-github-token");
  if (!token) {
    return NextResponse.json({ error: "未提供 token" }, { status: 401 });
  }

  const path = params.path.join("/");
  const owner = process.env.GITHUB_OWNER || "soulor8908";
  const repo = process.env.GITHUB_REPO || "million-dollar-roadmap";
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  const body = await req.text();

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body,
  });

  const data = await res.json();
  const response = NextResponse.json(data, { status: res.status });
  // 写操作不缓存
  response.headers.set("Cache-Control", "no-store");
  return response;
}
