"use client";

// components/MindMap.tsx
// 知识树脑图组件（水平树形布局，左→右展开）
// 节点可点击：点击后调用 onSelectNode，用户可基于该节点开始学习

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
}

const NODE_W = 176;
const NODE_H = 60;
const COL_GAP = 60;
const ROW_GAP = 14;
const PADDING = 24;

// 构建树：以 prerequisites 为父子关系
// 根节点 = prereq 为空，或 prereq 全部不在 nodes 列表中（孤立节点）
function buildTree(nodes: KnowledgeNode[]): TreeNode[] {
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const visited = new Set<string>();

  const childrenOf = (id: string) =>
    nodes.filter((n) => n.prerequisites.includes(id));

  const buildNode = (node: KnowledgeNode): TreeNode => {
    visited.add(node.id);
    const kids = childrenOf(node.id)
      .filter((c) => !visited.has(c.id))
      .map(buildNode);
    return { node, children: kids };
  };

  const roots = nodes.filter(
    (n) =>
      !visited.has(n.id) &&
      (n.prerequisites.length === 0 ||
        n.prerequisites.every((p) => !nodeMap.has(p)))
  );
  // 处理循环依赖或孤立节点：作为独立根
  const remaining = nodes.filter((n) => !visited.has(n.id));

  return [...roots.map(buildNode), ...remaining.map(buildNode)];
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
  let cursorY = 0;

  function place(tn: TreeNode, depth: number): { midY: number } {
    const x = depth * (NODE_W + COL_GAP);
    if (tn.children.length === 0) {
      const y = cursorY;
      positions.push({ id: tn.node.id, x, y, node: tn.node });
      cursorY += NODE_H + ROW_GAP;
      return { midY: y + NODE_H / 2 };
    }
    const childMids: number[] = [];
    for (const c of tn.children) {
      const mid = place(c, depth + 1);
      childMids.push(mid.midY);
    }
    const avgMid =
      childMids.reduce((a, b) => a + b, 0) / childMids.length;
    const y = avgMid - NODE_H / 2;
    positions.push({ id: tn.node.id, x, y, node: tn.node });
    return { midY: avgMid };
  }

  roots.forEach((r) => place(r, 0));

  // 计算边：父子节点中心连接
  const posMap = new Map(positions.map((p) => [p.id, p]));
  const edges: Edge[] = [];
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

// 难度颜色
const DIFF_COLORS = ["#dbeafe", "#bfdbfe", "#fde68a", "#fdba74", "#fca5a5"];

export function MindMap({
  nodes,
  selectedNodeId,
  onSelectNode,
}: MindMapProps) {
  const [hoverId, setHoverId] = useState<string | null>(null);

  const { positions, edges, width, height } = useMemo(() => {
    const roots = buildTree(nodes);
    const { positions, edges } = layout(roots);
    const maxX = positions.reduce((m, p) => Math.max(m, p.x + NODE_W), 0);
    const maxY = positions.reduce((m, p) => Math.max(m, p.y + NODE_H), 0);
    return {
      positions,
      edges,
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
      >
        <g transform={`translate(${PADDING}, ${PADDING})`}>
          {/* 边（贝塞尔曲线） */}
          {edges.map((e, i) => (
            <path
              key={i}
              d={`M ${e.x1} ${e.y1} C ${e.x1 + 30} ${e.y1}, ${e.x2 - 30} ${e.y2}, ${e.x2} ${e.y2}`}
              stroke="#cbd5e1"
              strokeWidth={1.5}
              fill="none"
            />
          ))}
          {/* 节点 */}
          {positions.map((p) => {
            const isSelected = selectedNodeId === p.id;
            const isHover = hoverId === p.id;
            const diff = p.node.difficulty;
            const bg = isSelected ? "#1e293b" : DIFF_COLORS[diff - 1] || "#e2e8f0";
            const fg = isSelected ? "#fff" : "#1e293b";
            const title = p.node.title;
            const truncated =
              title.length > 11 ? title.slice(0, 11) + "…" : title;
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
                  stroke={isSelected || isHover ? "#0f172a" : "#e2e8f0"}
                  strokeWidth={isSelected ? 2.5 : 1}
                />
                <text
                  x={14}
                  y={24}
                  fontSize={13}
                  fontWeight={600}
                  fill={fg}
                >
                  {truncated}
                </text>
                <text
                  x={14}
                  y={44}
                  fontSize={10}
                  fill={isSelected ? "#cbd5e1" : "#64748b"}
                >
                  {p.node.frequency} · {"★".repeat(diff)}
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
