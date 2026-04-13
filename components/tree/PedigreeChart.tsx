'use client'

import { useMemo } from 'react'
import { hierarchy, tree } from 'd3-hierarchy'
import { linkHorizontal } from 'd3-shape'
import type { HierarchyPointLink } from 'd3-hierarchy'
import { buildAncestorTree, type TreeDatum, type TreePointNode } from '@/lib/tree/layout'
import { PersonNode, NODE_WIDTH, NODE_HEIGHT } from './PersonNode'
import { TreeZoomWrapper } from './TreeZoomWrapper'

export interface PedigreeChartProps {
  rootId: string
  /** 向上展開的最大代數，預設 4 */
  maxDepth?: number
  /** SVG 容器高度，預設 600 */
  height?: number
}

const H_GAP = 240  // 水平節點間距（世代間）
const V_GAP = 90   // 垂直節點間距（同世代兄弟）

/**
 * PedigreeChart — 祖先圖
 * 佈局方向：根在左，祖先向右展開（透過 x/y 交換實現水平佈局）
 * 使用 d3.tree() + linkHorizontal()
 */
export function PedigreeChart({ rootId, maxDepth = 4, height = 600 }: PedigreeChartProps) {
  const { nodes, links, svgWidth, svgHeight, translateX, translateY } = useMemo(() => {
    const datum = buildAncestorTree(rootId, maxDepth)
    if (datum === null) return { nodes: [], links: [], svgWidth: 400, svgHeight: 400, translateX: 0, translateY: 0 }

    const root = hierarchy<TreeDatum>(datum)

    const layout = tree<TreeDatum>()
      .nodeSize([V_GAP, H_GAP])
      .separation(() => 1)

    const positioned = layout(root)

    // x/y 交換：d3 tree 的 x 是垂直方向，y 是水平方向
    // 祖先圖：根在左 (y=0)，祖先在右 (y 增大)
    const allNodes = positioned.descendants() as TreePointNode[]
    const allLinks = positioned.links() as HierarchyPointLink<TreeDatum>[]

    // 計算 bounding box（注意：渲染時用 node.y 作 X，node.x 作 Y）
    const xs = allNodes.map((n) => n.y)
    const ys = allNodes.map((n) => n.x)
    const minX = Math.min(...xs)
    const maxX = Math.max(...xs)
    const minY = Math.min(...ys)
    const maxY = Math.max(...ys)

    const padding = 20
    const computedWidth = maxX - minX + NODE_WIDTH + padding * 2
    const computedHeight = maxY - minY + NODE_HEIGHT + padding * 2

    // translate 使根節點置中並有 padding
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

  // linkHorizontal：source/target 均使用 (y, x) 以交換方向
  const pathGenerator = useMemo(
    () =>
      linkHorizontal<HierarchyPointLink<TreeDatum>, TreePointNode>()
        .x((d) => d.y)
        .y((d) => d.x),
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
                x={node.y}
                y={node.x}
              />
            ))}
          </g>
        </g>
      </svg>
    </TreeZoomWrapper>
  )
}
