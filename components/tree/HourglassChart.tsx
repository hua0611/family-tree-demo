'use client'

import { useMemo } from 'react'
import { hierarchy, tree } from 'd3-hierarchy'
import { linkVertical } from 'd3-shape'
import type { HierarchyPointLink } from 'd3-hierarchy'
import { buildAncestorTree, buildDescendantTree, type TreeDatum, type TreePointNode } from '@/lib/tree/layout'
import { PersonNode, NODE_WIDTH, NODE_HEIGHT } from './PersonNode'
import { TreeZoomWrapper } from './TreeZoomWrapper'

export interface HourglassChartProps {
  rootId: string
  /** 向上展開的最大代數，預設 3 */
  ancestorDepth?: number
  /** 向下展開的最大代數，預設 3 */
  descendantDepth?: number
  /** SVG 容器高度，預設 800 */
  height?: number
}

const H_GAP = 200  // 水平節點間距
const V_GAP = 120  // 垂直世代間距

interface HalfTreeData {
  nodes: TreePointNode[]
  links: HierarchyPointLink<TreeDatum>[]
  width: number
  halfHeight: number
}

function layoutHalfTree(datum: TreeDatum, nodeSize: [number, number]): HalfTreeData {
  const root = hierarchy<TreeDatum>(datum)
  const layout = tree<TreeDatum>()
    .nodeSize(nodeSize)
    .separation((a, b) => (a.parent === b.parent ? 1 : 1.2))

  const positioned = layout(root)
  const allNodes = positioned.descendants() as TreePointNode[]
  const allLinks = positioned.links() as HierarchyPointLink<TreeDatum>[]

  const xs = allNodes.map((n) => n.x)
  const ys = allNodes.map((n) => n.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const maxY = Math.max(...ys)

  const width = maxX - minX + NODE_WIDTH + 40
  const halfHeight = maxY + NODE_HEIGHT + 40

  return { nodes: allNodes, links: allLinks, width, halfHeight }
}

/**
 * HourglassChart — 沙漏圖
 * 根節點置中，向上展開祖先（y 取負值），向下展開後代（y 取正值）
 * 根節點只渲染一次（在中央）
 */
export function HourglassChart({
  rootId,
  ancestorDepth = 3,
  descendantDepth = 3,
  height = 800,
}: HourglassChartProps) {
  const {
    ancestorNodes,
    ancestorLinks,
    descendantNodes,
    descendantLinks,
    svgWidth,
    svgHeight,
    centerX,
    centerY,
    hasAncestors,
    hasDescendants,
    rootPerson,
  } = useMemo(() => {
    const ancestorDatum = buildAncestorTree(rootId, ancestorDepth)
    const descendantDatum = buildDescendantTree(rootId, descendantDepth)

    if (ancestorDatum === null && descendantDatum === null) {
      return {
        ancestorNodes: [],
        ancestorLinks: [],
        descendantNodes: [],
        descendantLinks: [],
        svgWidth: 400,
        svgHeight: 400,
        centerX: 200,
        centerY: 200,
        hasAncestors: false,
        hasDescendants: false,
        rootPerson: null,
      }
    }

    const nodeSize: [number, number] = [H_GAP, V_GAP]

    // 祖先半樹（向上）
    let ancestorNodes: TreePointNode[] = []
    let ancestorLinks: HierarchyPointLink<TreeDatum>[] = []
    let ancestorWidth = NODE_WIDTH + 40
    let ancestorHalfHeight = NODE_HEIGHT + 40
    let foundAncestors = false

    if (ancestorDatum !== null) {
      const half = layoutHalfTree(ancestorDatum, nodeSize)
      ancestorNodes = half.nodes
      ancestorLinks = half.links
      ancestorWidth = half.width
      ancestorHalfHeight = half.halfHeight
      foundAncestors = ancestorNodes.some((n) => n.depth > 0)
    }

    // 後代半樹（向下）
    let descendantNodes: TreePointNode[] = []
    let descendantLinks: HierarchyPointLink<TreeDatum>[] = []
    let descendantWidth = NODE_WIDTH + 40
    let descendantHalfHeight = NODE_HEIGHT + 40
    let foundDescendants = false

    if (descendantDatum !== null) {
      const half = layoutHalfTree(descendantDatum, nodeSize)
      descendantNodes = half.nodes
      descendantLinks = half.links
      descendantWidth = half.width
      descendantHalfHeight = half.halfHeight
      foundDescendants = descendantNodes.some((n) => n.depth > 0)
    }

    const computedWidth = Math.max(ancestorWidth, descendantWidth)
    const computedHeight = ancestorHalfHeight + descendantHalfHeight + NODE_HEIGHT

    // 中心點：水平居中，垂直從 ancestorHalfHeight 開始
    const cx = computedWidth / 2
    const cy = ancestorHalfHeight

    const rp = ancestorDatum?.person ?? descendantDatum?.person ?? null

    return {
      ancestorNodes,
      ancestorLinks,
      descendantNodes,
      descendantLinks,
      svgWidth: computedWidth,
      svgHeight: computedHeight,
      centerX: cx,
      centerY: cy,
      hasAncestors: foundAncestors,
      hasDescendants: foundDescendants,
      rootPerson: rp,
    }
  }, [rootId, ancestorDepth, descendantDepth])

  // linkVertical 用於後代（向下）：source.y < target.y
  const descendantLinkGen = useMemo(
    () =>
      linkVertical<HierarchyPointLink<TreeDatum>, TreePointNode>()
        .x((d) => d.x)
        .y((d) => d.y),
    []
  )

  // 祖先連線：x 同後代，y 取負（因為渲染時翻轉）
  const ancestorLinkGen = useMemo(
    () =>
      linkVertical<HierarchyPointLink<TreeDatum>, TreePointNode>()
        .x((d) => d.x)
        .y((d) => -d.y),
    []
  )

  if (rootPerson === null) {
    return (
      <div className="flex items-center justify-center h-48 text-webtrees-muted">
        找不到人物資料
      </div>
    )
  }

  if (!hasAncestors && !hasDescendants) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-2 text-webtrees-muted">
        <span className="text-2xl">⌛</span>
        <span>祖先與後代資料不足以繪製沙漏圖</span>
        <span className="text-xs">（需要至少 1 代祖先或後代資料）</span>
      </div>
    )
  }

  return (
    <TreeZoomWrapper className="w-full overflow-hidden" style={{ height }}>
      <svg
        width={svgWidth}
        height={svgHeight}
        style={{ display: 'block' }}
      >
        {/* 以中心點為原點的主群組 */}
        <g transform={`translate(${centerX}, ${centerY})`}>

          {/* ── 祖先半部（向上） ── */}
          {hasAncestors && (
            <g>
              {/* 祖先連線層（y 取負） */}
              <g>
                {ancestorLinks.map((link, i) => (
                  <path
                    key={`al-${i}`}
                    d={ancestorLinkGen(link) ?? ''}
                    fill="none"
                    stroke="#2d5a3d99"
                    strokeWidth={2}
                  />
                ))}
              </g>

              {/* 祖先節點層（跳過根節點 depth=0，避免重複渲染） */}
              <g>
                {ancestorNodes
                  .filter((node) => node.depth > 0)
                  .map((node) => (
                    <PersonNode
                      key={`an-${node.data.person.id}`}
                      person={node.data.person}
                      x={node.x}
                      y={-node.y}
                    />
                  ))}
              </g>
            </g>
          )}

          {/* ── 後代半部（向下） ── */}
          {hasDescendants && (
            <g>
              {/* 後代連線層 */}
              <g>
                {descendantLinks.map((link, i) => (
                  <path
                    key={`dl-${i}`}
                    d={descendantLinkGen(link) ?? ''}
                    fill="none"
                    stroke="#2d5a3d99"
                    strokeWidth={2}
                  />
                ))}
              </g>

              {/* 後代節點層（跳過根節點 depth=0） */}
              <g>
                {descendantNodes
                  .filter((node) => node.depth > 0)
                  .map((node) => (
                    <PersonNode
                      key={`dn-${node.data.person.id}`}
                      person={node.data.person}
                      x={node.x}
                      y={node.y}
                    />
                  ))}
              </g>
            </g>
          )}

          {/* ── 根節點（中央，只渲染一次） ── */}
          <PersonNode
            person={rootPerson}
            x={0}
            y={0}
          />
        </g>
      </svg>
    </TreeZoomWrapper>
  )
}
