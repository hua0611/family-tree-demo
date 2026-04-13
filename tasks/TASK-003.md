# TASK-003 — 家族樹視覺化核心元件（祖先圖 + 後代圖）

- Priority: P0
- Agent: frontend-dev
- Status: pending
- Dependencies: TASK-002, DEC-001 (Resolved — see ADR-001)
- Spec reference: `spec/current.md` §3.1, §7
- Architecture reference: `docs/adr/ADR-001-tree-visualization.md`

## 前置條件

DEC-001 已由 architect 決策完成：採用 **`d3-hierarchy` + `d3-shape` + 純 SVG React 元件手刻** 方案，縮放 / 平移使用 `react-zoom-pan-pinch`。完整設計與 API 範例見 `docs/adr/ADR-001-tree-visualization.md` §5 Implementation Notes。

## 描述

實作 `/tree/[id]` 頁面的核心功能：祖先圖（Pedigree）與後代圖（Descendants），並支援從任一成員為根切換。節點樣式需貼近 Webtrees 風格（圓角矩形卡片、照片 + 姓名 + 生卒年、性別色邊）。

## 具體工作

1. `components/tree/PersonNode.tsx`：統一節點元件（Webtrees 風卡片）
2. `components/tree/PedigreeChart.tsx`：祖先圖（根在左 / 下，向上展開 2-4 代）
3. `components/tree/DescendantChart.tsx`：後代圖（根在上，向下展開）
4. `app/tree/[id]/page.tsx`：
   - 接收 `params.id` 作為根節點
   - Tab 切換：祖先圖 / 後代圖
   - 節點點擊 → `router.push('/person/' + id)`
5. 支援基本縮放 / 平移（依選定函式庫能力）
6. 手機可橫向拖曳

## 驗收標準

1. 從假資料中任一成員為根，祖先圖與後代圖皆能正確渲染至少 3 層
2. 節點顯示照片、姓名、生卒年、性別色邊框
3. 點擊節點正確跳轉至 `/person/[id]`
4. 桌機寬度下圖表不溢出、手機寬度下可水平捲動
5. Tab 切換（Pedigree / Descendants）無畫面閃爍

## 預估檔案

- `components/tree/PersonNode.tsx`
- `components/tree/PedigreeChart.tsx`
- `components/tree/DescendantChart.tsx`
- `components/tree/TreeToolbar.tsx`
- `app/tree/[id]/page.tsx`

## 實作指導（ADR-001）

### 依賴套件（需加入 package.json）

```jsonc
{
  "dependencies": {
    "d3-hierarchy": "^3.1.2",
    "d3-shape": "^3.2.0",
    "react-zoom-pan-pinch": "^3.4.4"
  },
  "devDependencies": {
    "@types/d3-hierarchy": "^3.1.7",
    "@types/d3-shape": "^3.1.6"
  }
}
```

### 核心型別（`lib/tree/layout.ts`）

```ts
import type { HierarchyPointNode } from 'd3-hierarchy';
import type { Person } from '@/types/family';

export interface TreeDatum {
  person: Person;
  children?: TreeDatum[];
}

export type TreePointNode = HierarchyPointNode<TreeDatum>;

export function buildAncestorTree(rootId: string, maxDepth?: number): TreeDatum;
export function buildDescendantTree(rootId: string, maxDepth?: number): TreeDatum;
```

### Pedigree（祖先圖）佈局策略

```ts
import { hierarchy, tree } from 'd3-hierarchy';
import { linkHorizontal } from 'd3-shape';

const root = hierarchy(buildAncestorTree(rootId, 4));
const layout = tree<TreeDatum>().nodeSize([80, 220]);
const positioned = layout(root);

// 根在左 / 祖先向右展開：渲染時將 x、y 交換
const pathGen = linkHorizontal<unknown, TreePointNode>()
  .x(d => d.y)
  .y(d => d.x);
```

### Descendants（後代圖）佈局策略

- 改用 `buildDescendantTree()`
- **不**交換 x/y（根在上、向下展開）
- 連線使用 `linkVertical()`

### PersonNode 元件

- 使用 `<foreignObject>` 在 SVG 內嵌入 HTML/Tailwind，即可直接用 `next/image` 與 Tailwind class
- 性別色邊框：M → `border-blue-400`、F → `border-pink-400`、U → `border-gray-400`
- 節點預設尺寸 `180 × 64`
- 整個節點用 `<Link href={'/person/' + person.id}>` 包起來，取代 `router.push`
- 依 `useRole()` Context 決定在世人物是否顯示隱私遮罩

### 縮放 / 平移

使用 `react-zoom-pan-pinch` 包住整個 `<svg>`：

```tsx
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

<TransformWrapper minScale={0.4} maxScale={2.5} wheel={{ step: 0.1 }}>
  <TransformComponent wrapperClass="w-full h-full">
    <svg viewBox={...}>...</svg>
  </TransformComponent>
</TransformWrapper>
```

### Next.js 16 / RSC 提示

- `lib/tree/layout.ts` 為純函數，**不**標註 `'use client'`，可被 Server Component 引用
- `PedigreeChart.tsx`、`DescendantChart.tsx`、`PersonNode.tsx` 需標註 `'use client'`（含 zoom/pan 與事件）
- `app/tree/[id]/page.tsx` 本身可為 Server Component，將 `rootId` props 傳入 Client Component

### 完整指導

更多細節（包含 Fan / Hourglass 策略、標籤旋轉 helper、SSR 建議、QA 檢查點）參見：
`docs/adr/ADR-001-tree-visualization.md` §5 Implementation Notes
