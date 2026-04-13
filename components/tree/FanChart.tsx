'use client'

import { useMemo } from 'react'
import { hierarchy, tree } from 'd3-hierarchy'
import { linkRadial } from 'd3-shape'
import type { HierarchyPointLink } from 'd3-hierarchy'
import { buildAncestorTree, type TreeDatum, type TreePointNode } from '@/lib/tree/layout'
import { TreeZoomWrapper } from './TreeZoomWrapper'

export interface FanChartProps {
  rootId: string
  /** 向上展開的最大代數，預設 4 */
  maxDepth?: number
  /** SVG 寬高（正方形），預設 800 */
  size?: number
}

/** webtrees 色盤：每層用不同淡色 */
const GENERATION_COLORS: readonly string[] = [
  '#f0fdf4', // 根節點（gen 0）：極淡綠
  '#dcfce7', // gen 1：淡綠
  '#bbf7d0', // gen 2：淡綠中
  '#86efac', // gen 3：綠
  '#4ade80', // gen 4：深綠
]

const GENERATION_TEXT_COLORS: readonly string[] = [
  '#14532d',
  '#166534',
  '#15803d',
  '#16a34a',
  '#ffffff',
]

const GENERATION_STROKE: readonly string[] = [
  '#16a34a',
  '#22c55e',
  '#4ade80',
  '#86efac',
  '#bbf7d0',
]

function getGenderStroke(gender: string): string {
  if (gender === 'male') return '#60a5fa'
  if (gender === 'female') return '#f472b6'
  return '#9ca3af'
}

/**
 * 極座標轉笛卡爾（d3 tree 的 x 為角度弧度，y 為半徑）
 * d3 tree 角度 0 在頂部，但這裡用正常數學慣例：x 為角度，y 為半徑
 * d3 的 tree.size([2*PI, radius]) 讓 x 從 0 到 2*PI，y 從 0 到 radius
 */
function polarToCartesian(angle: number, radius: number): { x: number; y: number } {
  // d3 tree 的角度 0 在上方（12 o'clock），所以要 - PI/2
  const a = angle - Math.PI / 2
  return {
    x: Math.cos(a) * radius,
    y: Math.sin(a) * radius,
  }
}

/**
 * 計算文字旋轉角度，避免下半圓文字上下顛倒
 */
function labelRotation(angle: number): number {
  const deg = (angle * 180) / Math.PI - 90
  // 下半圓（angle > PI）翻轉 180 度讓文字仍可讀
  return angle > Math.PI ? deg + 180 : deg
}

/**
 * 根據深度取顏色
 */
function getGenerationColor(depth: number): string {
  return GENERATION_COLORS[Math.min(depth, GENERATION_COLORS.length - 1)] ?? '#f0fdf4'
}

function getGenerationTextColor(depth: number): string {
  return GENERATION_TEXT_COLORS[Math.min(depth, GENERATION_TEXT_COLORS.length - 1)] ?? '#14532d'
}

function getGenerationStroke(depth: number): string {
  return GENERATION_STROKE[Math.min(depth, GENERATION_STROKE.length - 1)] ?? '#16a34a'
}

/**
 * FanChart — 扇形圖（極座標）
 * 以指定 rootId 為圓心，向外展開 4 代祖先
 * 使用 d3.tree() 計算極座標 + linkRadial() 繪製弧形連線
 * 外環節點用純 SVG <text> 避免 <foreignObject> 在旋轉時變形
 */
export function FanChart({ rootId, maxDepth = 4, size = 800 }: FanChartProps) {
  const { nodes, links, hasEnoughAncestors } = useMemo(() => {
    const datum = buildAncestorTree(rootId, maxDepth)
    if (datum === null) return { nodes: [], links: [], hasEnoughAncestors: false }

    const root = hierarchy<TreeDatum>(datum)

    // 檢查是否有足夠祖先（至少 2 代）
    const maxFoundDepth = Math.max(...root.descendants().map((n) => n.depth))
    if (maxFoundDepth < 1) {
      return { nodes: root.descendants() as TreePointNode[], links: [], hasEnoughAncestors: false }
    }

    const radius = size / 2 - 40 // 留邊距

    const layout = tree<TreeDatum>()
      .size([2 * Math.PI, radius])
      .separation((a, b) => (a.parent === b.parent ? 1 : 2) / Math.max(a.depth, 1))

    const positioned = layout(root)

    const allNodes = positioned.descendants() as TreePointNode[]
    const allLinks = positioned.links() as HierarchyPointLink<TreeDatum>[]

    return { nodes: allNodes, links: allLinks, hasEnoughAncestors: true }
  }, [rootId, maxDepth, size])

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-webtrees-muted">
        找不到人物資料
      </div>
    )
  }

  if (!hasEnoughAncestors) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-2 text-webtrees-muted">
        <span className="text-2xl">🌳</span>
        <span>祖先資料不足以繪製扇形圖</span>
        <span className="text-xs">（需要至少 1 代祖先資料）</span>
      </div>
    )
  }

  const cx = size / 2
  const cy = size / 2

  // linkRadial() 需要 source/target 都是 HierarchyPointNode-like 形狀
  // 直接給 angle = node.x, radius = node.y
  const radialLinkGen = linkRadial<HierarchyPointLink<TreeDatum>, TreePointNode>()
    .angle((d) => d.x)
    .radius((d) => d.y)

  return (
    <TreeZoomWrapper className="w-full overflow-hidden" style={{ height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block' }}
      >
        <g transform={`translate(${cx}, ${cy})`}>
          {/* 輔助背景環（可選，增加視覺分層感） */}
          {[1, 2, 3, 4].map((gen) => {
            const r = ((size / 2 - 40) * gen) / maxDepth
            return (
              <circle
                key={gen}
                r={r}
                fill="none"
                stroke={getGenerationStroke(gen)}
                strokeWidth={1}
                strokeDasharray="4 4"
                opacity={0.3}
              />
            )
          })}

          {/* 連線層（弧形） */}
          <g>
            {links.map((link, i) => (
              <path
                key={i}
                d={radialLinkGen(link) ?? ''}
                fill="none"
                stroke="#2d5a3d66"
                strokeWidth={1.5}
              />
            ))}
          </g>

          {/* 節點層 */}
          <g>
            {nodes.map((node) => {
              const depth = node.depth
              const person = node.data.person

              if (depth === 0) {
                // 根節點：居中大圓形 + foreignObject 卡片
                return (
                  <g key={person.id}>
                    <circle
                      r={36}
                      fill={getGenerationColor(0)}
                      stroke={getGenderStroke(person.gender)}
                      strokeWidth={3}
                    />
                    {/* 根節點文字（居中） */}
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={12}
                      fontWeight={700}
                      fill={getGenerationTextColor(0)}
                      y={-6}
                    >
                      {person.fullName.length > 6
                        ? person.fullName.slice(0, 6) + '…'
                        : person.fullName}
                    </text>
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={10}
                      fill={getGenerationTextColor(0)}
                      y={8}
                      opacity={0.8}
                    >
                      {person.birthDate?.slice(0, 4) ?? '?'}
                    </text>
                    {/* 可點擊覆蓋層 */}
                    <a href={`/person/${person.id}`}>
                      <circle r={36} fill="transparent" style={{ cursor: 'pointer' }} />
                    </a>
                  </g>
                )
              }

              // 外環節點：旋轉小圓 + 旋轉文字
              const { x: nx, y: ny } = polarToCartesian(node.x, node.y)
              const rotDeg = labelRotation(node.x)

              // 節點圓半徑（外環節點較小）
              const nodeR = depth <= 2 ? 22 : 16

              return (
                <g
                  key={person.id}
                  transform={`translate(${nx}, ${ny})`}
                >
                  {/* 節點圓形背景 */}
                  <circle
                    r={nodeR}
                    fill={getGenerationColor(depth)}
                    stroke={getGenderStroke(person.gender)}
                    strokeWidth={2}
                  />

                  {/* 旋轉文字群組 */}
                  <g transform={`rotate(${rotDeg})`}>
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={depth <= 2 ? 11 : 9}
                      fontWeight={600}
                      fill={getGenerationTextColor(depth)}
                      y={depth <= 2 ? -4 : -3}
                    >
                      {person.fullName.length > 5
                        ? person.fullName.slice(0, 5) + '…'
                        : person.fullName}
                    </text>
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={depth <= 2 ? 9 : 8}
                      fill={getGenerationTextColor(depth)}
                      y={depth <= 2 ? 7 : 6}
                      opacity={0.75}
                    >
                      {person.birthDate?.slice(0, 4) ?? '?'}
                    </text>
                  </g>

                  {/* 可點擊覆蓋層 */}
                  <a href={`/person/${person.id}`}>
                    <circle r={nodeR} fill="transparent" style={{ cursor: 'pointer' }} />
                  </a>
                </g>
              )
            })}
          </g>
        </g>
      </svg>
    </TreeZoomWrapper>
  )
}
