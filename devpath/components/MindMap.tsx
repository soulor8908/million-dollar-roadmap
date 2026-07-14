"use client";

// components/MindMap.tsx
// 知识树脑图组件（水平树形布局，左→右展开）
// 修复要点：
// 1. 节点有多个 prereq 时，挂到"最深"的父节点下（保证节点出现在最长路径末端）
// 2. 节点垂直布局按子树叶子数分配空间，避免重叠
// 3. 同一节点只出现一次（DAG → Tree 转换）
// 4. 节点可点击：点击后调用 onSelectNode

import { useMemo, useState } from "react";
import type { KnowledgeNode } from "@/lib/types";

interface MindMapProps {
  nodes: KnowledgeNode[];
  topic?: string;
  selectedNodeId?: string;
  onSelectNode?: (node: KnowledgeNode) => void;
}

interface TreeNode {
  node: KnowledgeNode;
  children: TreeNode[];
  // 子树高度（占用多少行）
  leafCount: number;
}

const NODE_W = 180;
const NODE_H = 64;
const COL_GAP = 80;
const ROW_GAP = 12;
const PADDING = 28;

// 计算每个节点的深度（从根到此节点的最长路径长度）
function computeDepth(
  nodeId: string,
  nodeMap: Map<string, KnowledgeNode>,
  depthCache: Map<string, number>,
  visiting: Set<string>
): number {
  if (depthCache.has(nodeId)) return depthCache.get(nodeId)!;
  if (visiting.has(nodeId)) return 0; // 循环依赖，按 0 处理
  const node = nodeMap.get(nodeId);
  if (!node) return 0;
  visiting.add(nodeId);
  let maxDepth = 0;
  for (const p of node.prerequisites) {
    if (!nodeMap.has(p)) continue; // 未知 prereq，跳过
    maxDepth = Math.max(maxDepth, computeDepth(p, nodeMap, depthCache, visiting) + 1);
  }
  visiting.delete(nodeId);
  depthCache.set(nodeId, maxDepth);
  return maxDepth;
}

// 构建树：每个节点挂到最深 prereq 下（保证出现在最长路径末端）
function buildTree(nodes: KnowledgeNode[]): TreeNode[] {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const depthCache = new Map<string, number>();
  nodes.forEach((n) =>
    computeDepth(n.id, nodeMap, depthCache, new Set())
  );

  // 为每个节点分配唯一父节点 = 深度最深的那个 prereq
  const parentOf = new Map<string, string | null>();
  for (const n of nodes) {
    const validPrereqs = n.prerequisites.filter((p) => nodeMap.has(p));
    if (validPrereqs.length === 0) {
      parentOf.set(n.id, null);
    } else {
      // 按深度降序，挑最深的作为父节点
      const sorted = validPrereqs.sort(
        (a, b) => (depthCache.get(b) ?? 0) - (depthCache.get(a) ?? 0)
      );
      parentOf.set(n.id, sorted[0]);
    }
  }

  const childrenOf = (id: string) =>
    nodes
      .filter((n) => parentOf.get(n.id) === id)
      .sort((a, b) => (a.customOrder ?? 999) - (b.customOrder ?? 999));

  function build(node: KnowledgeNode): TreeNode {
    const kids = childrenOf(node.id).map(build);
    // 子树叶子数：自身若无线下叶子则占 1 行
    const leafCount = kids.length === 0 ? 1 : kids.reduce((s, k) => s + k.leafCount, 0);
    return { node, children: kids, leafCount };
  }

  return nodes
    .filter((n) => parentOf.get(n.id) === null)
    .sort((a, b) => (a.customOrder ?? 999) - (b.customOrder ?? 999))
    .map(build);
}

interface Positioned {
  id: string;
  x: number;
  y: number;
  node: KnowledgeNode;
}

interface Edge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function layout(roots: TreeNode[]): { positions: Positioned[]; edges: Edge[] } {
  const positions: Positioned[] = [];
  const edges: Edge[] = [];
  const ROW_UNIT = NODE_H + ROW_GAP;
  let cursorY = 0;

  function place(tn: TreeNode, depth: number): { topY: number; midY: number; bottomY: number } {
    const x = depth * (NODE_W + COL_GAP);
    const topY = cursorY;

    if (tn.children.length === 0) {
      const y = cursorY;
      positions.push({ id: tn.node.id, x, y, node: tn.node });
      cursorY += ROW_UNIT;
      return { topY: y, midY: y + NODE_H / 2, bottomY: y + NODE_H };
    }

    // 递归放置所有子节点
    const childMids: number[] = [];
    for (const c of tn.children) {
      const m = place(c, depth + 1);
      childMids.push(m.midY);
    }
    // 父节点 y = 子节点中点 - NODE_H/2（但确保不小于子节点顶部）
    const minMid = Math.min(...childMids);
    const maxMid = Math.max(...childMids);
    const avgMid = (minMid + maxMid) / 2;
    let y = avgMid - NODE_H / 2;
    // 防止负值
    if (y < cursorY) y = cursorY;
    positions.push({ id: tn.node.id, x, y, node: tn.node });
    return { topY, midY: y + NODE_H / 2, bottomY: y + NODE_H };
  }

  roots.forEach((r) => place(r, 0));

  // 计算边：父节点右中 → 子节点左中
  const posMap = new Map(positions.map((p) => [p.id, p]));
  function walkEdges(tn: TreeNode) {
    const p = posMap.get(tn.node.id);
    if (!p) return;
    tn.children.forEach((c) => {
      const cp = posMap.get(c.node.id);
      if (cp) {
        edges.push({
          x1: p.x + NODE_W,
          y1: p.y + NODE_H / 2,
          x2: cp.x,
          y2: cp.y + NODE_H / 2,
        });
      }
      walkEdges(c);
    });
  }
  roots.forEach(walkEdges);

  return { positions, edges };
}

// 难度颜色（浅 → 深）
const DIFF_BG = ["#dbeafe", "#bfdbfe", "#fde68a", "#fdba74", "#fca5a5"];
const DIFF_BORDER = ["#3b82f6", "#60a5fa", "#f59e0b", "#f97316", "#ef4444"];

export function MindMap({
  nodes,
  selectedNodeId,
  onSelectNode,
}: MindMapProps) {
  const [hoverId, setHoverId] = useState<string | null>(null);

  const { positions, edges, width, height, maxX, maxY } = useMemo(() => {
    const roots = buildTree(nodes);
    const { positions, edges } = layout(roots);
    const maxX = positions.reduce((m, p) => Math.max(m, p.x + NODE_W), 0);
    const maxY = positions.reduce((m, p) => Math.max(m, p.y + NODE_H), 0);
    return {
      positions,
      edges,
      maxX,
      maxY,
      width: maxX + PADDING * 2,
      height: maxY + PADDING * 2,
    };
  }, [nodes]);

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-gray-400">
        暂无知识点
      </div>
    );
  }

  return (
    <div className="overflow-auto bg-gray-50 rounded-lg">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="block"
        style={{ minWidth: "100%" }}
      >
        <g transform={`translate(${PADDING}, ${PADDING})`}>
          {/* 边（贝塞尔曲线） */}
          {edges.map((e, i) => {
            const ctrl = (e.x2 - e.x1) / 2;
            return (
              <path
                key={i}
                d={`M ${e.x1} ${e.y1} C ${e.x1 + ctrl} ${e.y1}, ${e.x2 - ctrl} ${e.y2}, ${e.x2} ${e.y2}`}
                stroke="#94a3b8"
                strokeWidth={1.5}
                fill="none"
              />
            );
          })}
          {/* 节点 */}
          {positions.map((p) => {
            const isSelected = selectedNodeId === p.id;
            const isHover = hoverId === p.id;
            const diff = p.node.difficulty;
            const bg = isSelected ? "#0f172a" : DIFF_BG[diff - 1] || "#e2e8f0";
            const border = isSelected
              ? "#3b82f6"
              : isHover
                ? DIFF_BORDER[diff - 1] || "#475569"
                : "#cbd5e1";
            const fg = isSelected ? "#fff" : "#1e293b";
            const title = p.node.title;
            // 标题超长截断
            const truncated =
              title.length > 12 ? title.slice(0, 12) + "…" : title;
            const qCount = `${p.node.frequency} · ${"★".repeat(diff)}`;
            return (
              <g
                key={p.id}
                transform={`translate(${p.x}, ${p.y})`}
                style={{ cursor: onSelectNode ? "pointer" : "default" }}
                onClick={() => onSelectNode?.(p.node)}
                onMouseEnter={() => setHoverId(p.id)}
                onMouseLeave={() => setHoverId(null)}
              >
                <rect
                  width={NODE_W}
                  height={NODE_H}
                  rx={10}
                  fill={bg}
                  stroke={border}
                  strokeWidth={isSelected ? 2.5 : isHover ? 2 : 1}
                />
                <text
                  x={14}
                  y={26}
                  fontSize={13}
                  fontWeight={600}
                  fill={fg}
                >
                  {truncated}
                </text>
                <text
                  x={14}
                  y={48}
                  fontSize={10}
                  fill={isSelected ? "#cbd5e1" : "#64748b"}
                >
                  {qCount}
                  {p.node.customOrder ? ` · #${p.node.customOrder}` : ""}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
