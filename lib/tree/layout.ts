// lib/tree/layout.ts
// 純函式：d3-hierarchy 佈局資料建構
// 無 DOM 依賴，可在 Server Component 直接呼叫

import type { HierarchyPointNode } from 'd3-hierarchy'
import type { Person } from '@/types/family'
import { getPerson, getParents, getChildren } from '@/lib/family-helpers'

/** d3-hierarchy 節點資料，攜帶原始 Person */
export interface TreeDatum {
  person: Person
  children?: TreeDatum[]
}

export type TreePointNode = HierarchyPointNode<TreeDatum>

/**
 * 建立「祖先向上」的 TreeDatum
 * 在 d3-hierarchy 中，父母被視為 children（樹是反向的）
 * 最終渲染時根在左/下，祖先在右/上
 */
export function buildAncestorTree(rootId: string, maxDepth = 4): TreeDatum | null {
  const person = getPerson(rootId)
  if (person === undefined) return null

  function build(personId: string, depth: number): TreeDatum {
    const p = getPerson(personId)
    if (p === undefined) {
      // 應不會發生，但 TypeScript 需要
      return { person: { id: personId } as Person }
    }

    if (depth <= 0) {
      return { person: p }
    }

    const parents = getParents(personId)
    const children: TreeDatum[] = parents.map((parent) => build(parent.id, depth - 1))

    return {
      person: p,
      children: children.length > 0 ? children : undefined,
    }
  }

  return build(rootId, maxDepth)
}

/**
 * 建立「後代向下」的 TreeDatum
 * 子女是正向的 children
 */
export function buildDescendantTree(rootId: string, maxDepth = 3): TreeDatum | null {
  const person = getPerson(rootId)
  if (person === undefined) return null

  function build(personId: string, depth: number): TreeDatum {
    const p = getPerson(personId)
    if (p === undefined) {
      return { person: { id: personId } as Person }
    }

    if (depth <= 0) {
      return { person: p }
    }

    const childPersons = getChildren(personId)
    const children: TreeDatum[] = childPersons.map((child) => build(child.id, depth - 1))

    return {
      person: p,
      children: children.length > 0 ? children : undefined,
    }
  }

  return build(rootId, maxDepth)
}
