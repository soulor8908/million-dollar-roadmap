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

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
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
  return NextResponse.json(data, { status: res.status });
}
