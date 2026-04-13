'use client'

import { useMemo } from 'react'
import { hierarchy, tree } from 'd3-hierarchy'
import { linkVertical } from 'd3-shape'
import type { HierarchyPointLink } from 'd3-hierarchy'
import { buildDescendantTree, type TreeDatum, type TreePointNode } from '@/lib/tree/layout'
import { PersonNode, NODE_WIDTH, NODE_HEIGHT } from './PersonNode'
import { TreeZoomWrapper } from './TreeZoomWrapper'

export interface DescendantChartProps {
  rootId: string
  /** 向下展開的最大代數，預設 3 */
  maxDepth?: number
  /** SVG 容器高度，預設 600 */
  height?: number
}

const H_GAP = 200  // 水平節點間距（同世代兄弟）
const V_GAP = 120  // 垂直世代間距

/**
 * DescendantChart — 後代圖
 * 佈局方向：根在上，後代向下展開（標準垂直樹）
 * 使用 d3.tree() + linkVertical()
 */
export function DescendantChart({ rootId, maxDepth = 3, height = 600 }: DescendantChartProps) {
  const { nodes, links, svgWidth, svgHeight, translateX, translateY } = useMemo(() => {
    const datum = buildDescendantTree(rootId, maxDepth)
    if (datum === null) return { nodes: [], links: [], svgWidth: 400, svgHeight: 400, translateX: 0, translateY: 0 }

    const root = hierarchy<TreeDatum>(datum)

    const layout = tree<TreeDatum>()
      .nodeSize([H_GAP, V_GAP])
      .separation((a, b) => (a.parent === b.parent ? 1 : 1.2))

    const positioned = layout(root)

    // 後代圖不交換 x/y：x 是水平方向，y 是垂直方向（向下）
    const allNodes = positioned.descendants() as TreePointNode[]
    const allLinks = positioned.links() as HierarchyPointLink<TreeDatum>[]

    // 計算 bounding box
    const xs = allNodes.map((n) => n.x)
    const ys = allNodes.map((n) => n.y)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)

    const padding = 20
    const computedWidth = maxX - minX + NODE_WIDTH + padding * 2
    const computedHeight = maxY - minY + NODE_HEIGHT + padding * 2

    // translate 使根節點水平置中、上方有 padding
    const tx = -minX + NODE_WIDTH / 2 + padding
    const ty = -minY + NODE_HEIGHT / 2 + padding

    return {
      nodes: allNodes,
      links: allLinks,
      svgWidth: computedWidth,
      svgHeight: computedHeight,
      translateX: tx,
      translateY: ty,
    }
  }, [rootId, maxDepth])

  // linkVertical：source/target 使用 (x, y) — 標準垂直方向
  const pathGenerator = useMemo(
    () =>
      linkVertical<HierarchyPointLink<TreeDatum>, TreePointNode>()
        .x((d) => d.x)
        .y((d) => d.y),
    []
  )

  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-webtrees-muted">
        找不到人物資料
      </div>
    )
  }

  return (
    <TreeZoomWrapper className="w-full overflow-hidden" style={{ height: height }}>
      <svg
        width={svgWidth}
        height={svgHeight}
        style={{ display: 'block' }}
      >
        <g transform={`translate(${translateX}, ${translateY})`}>
          {/* 連線層 */}
          <g>
            {links.map((link, i) => (
              <path
                key={i}
                d={pathGenerator(link) ?? ''}
                fill="none"
                stroke="#2d5a3d99"
                strokeWidth={2}
              />
            ))}
          </g>

          {/* 節點層 */}
          <g>
            {nodes.map((node) => (
              <PersonNode
                key={node.data.person.id}
                person={node.data.person}
                x={node.x}
                y={node.y}
              />
            ))}
          </g>
        </g>
      </svg>
    </TreeZoomWrapper>
  )
}
