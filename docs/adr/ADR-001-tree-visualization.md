# ADR-001: 家族樹視覺化函式庫選型

- **編號**: ADR-001
- **對應決策**: DEC-001
- **日期**: 2026-04-13
- **狀態**: Accepted
- **決策者**: architect
- **影響任務**: TASK-003（祖先圖 + 後代圖）、TASK-004（扇形圖 + 沙漏圖）
- **Spec 關聯**: `spec/current.md` §3.1、§8

---

## 1. Context（背景）

Family Tree Demo 需要在 `/tree/[id]` 路由下提供 **4 種** 家族樹視覺化圖表：

| 圖表 | 佈局特性 | 代表性展示 |
|------|---------|-----------|
| Pedigree Chart（祖先圖） | 從根向**上**分支，二元樹（父系 / 母系） | 根在左，祖先往右展開 |
| Descendants Chart（後代圖） | 從根向**下**分支，多子女樹 | 根在上，後代往下展開 |
| Fan Chart（扇形圖） | 極座標（radial），以根為圓心向外扇形展開祖先 | Webtrees 招牌圖表 |
| Hourglass Chart（沙漏圖） | 根置中，同時向**上**展開祖先、向**下**展開後代 | 需要雙向對稱疊合 |

同時要求：
- Next.js 16 (App Router) + TypeScript **strict** + Tailwind CSS
- 節點必須是 React 客製元件（照片、姓名、生卒年、性別色邊、可 Tailwind 樣式、可接 Next/Image）
- 節點可點擊導航至 `/person/[id]`
- 手機支援縮放（pinch / wheel）+ 平移（pan）
- SSR 友善，bundle size 可控
- 假資料規模僅 ~20 人、4+ 代，**不需**處理海量資料效能

> 參考站：[wt-malkins.alineofmalkins.com](https://wt-malkins.alineofmalkins.com/tree/wtmalkins)

---

## 2. Options（候選方案評估）

### Option A: `react-d3-tree`（開箱即用 React 元件）

| 維度 | 評分 | 說明 |
|------|------|------|
| 佈局支援度 | ★★☆☆☆ | 原生支援階層樹（可做 Pedigree/Descendants），**不**原生支援 Fan 極座標與 Hourglass |
| TS 型別 | ★★★★☆ | 內建 `.d.ts`，型別完整 |
| 縮放 / 平移 | ★★★★★ | 內建 `zoomable` / pan |
| Bundle size | ★★★☆☆ | ~80 KB gzip（含 d3 子集） |
| 客製 node | ★★★★☆ | 支援 `renderCustomNodeElement`（傳入 `foreignObject` 內嵌 JSX），可接 Tailwind |
| 維護活躍度 | ★★★★☆ | 週下載量 > 10 萬，活躍維護 |
| SSR 相容 | ★★★☆☆ | 須 `dynamic(..., { ssr: false })` 包裝 |

**優點**：最快上手、內建縮放、客製 node 算堪用。
**致命缺點**：Fan Chart 與 Hourglass **完全不支援**，若選它仍需另外為 TASK-004 引入 d3。結果會變成「混合兩套函式庫」，增加心智負擔與 bundle size。

---

### Option B: `d3-hierarchy` + `d3-shape` + 純 SVG React 元件（手刻）

| 維度 | 評分 | 說明 |
|------|------|------|
| 佈局支援度 | ★★★★★ | `d3.tree()` / `d3.cluster()` 提供層級座標；同一套 API 反向 / 疊合可做 4 種佈局 |
| TS 型別 | ★★★★★ | `@types/d3-hierarchy`、`@types/d3-shape` 完整；可為 `HierarchyPointNode<Person>` 泛型化 |
| 縮放 / 平移 | ★★★☆☆ | 需自行整合（`d3-zoom` 或 `react-zoom-pan-pinch`） |
| Bundle size | ★★★★★ | 只引入用到的 d3 子模組（`d3-hierarchy` ~6 KB、`d3-shape` ~10 KB gzip），**比 full d3 小一個量級** |
| 客製 node | ★★★★★ | 節點完全是 React JSX `<g>` / `<foreignObject>`，可直接用 Tailwind + Next/Image |
| 維護活躍度 | ★★★★★ | d3 是業界事實標準，長青維護 |
| SSR 相容 | ★★★★★ | 純函數計算座標，可在 Server Component 預先算好，Client 只負責互動 |

**優點**：
- 一套心智模型涵蓋 4 種佈局
- bundle size 最小
- TypeScript 型別安全（泛型 `HierarchyNode<Person>`）
- React Server Component 友善：`d3-hierarchy` 只做座標計算，無 DOM 依賴，可在 build time 預算

**缺點**：
- 需要自行實作縮放 / 平移（但有現成 `react-zoom-pan-pinch` 或 `d3-zoom`）
- 開發時間略多（但 demo 資料小、佈局不複雜，實際成本有限）

---

### Option C: `dagre-d3`（DAG 自動排版）

| 維度 | 評分 | 說明 |
|------|------|------|
| 佈局支援度 | ★★☆☆☆ | 適用於 DAG / flowchart，**不適合** family tree 對稱佈局；Fan / Hourglass 幾乎不可行 |
| TS 型別 | ★★☆☆☆ | 第三方 `@types/dagre-d3` 不完整 |
| 維護活躍度 | ★★☆☆☆ | 主倉庫活躍度低 |

**結論**：不符合 family tree 的對稱美學需求，**排除**。

---

### Option D: `vis-network`（通用網路圖）

| 維度 | 評分 | 說明 |
|------|------|------|
| 佈局支援度 | ★★★☆☆ | 有 `hierarchical` 佈局，但**力導向**為主，族譜呈現效果較差 |
| TS 型別 | ★★★☆☆ | 社群維護的型別 |
| Bundle size | ★☆☆☆☆ | > 200 KB，對 demo 過重 |
| 客製 node | ★★☆☆☆ | Canvas 渲染，**無法**用 React JSX 節點 |

**結論**：Canvas 渲染無法滿足「Webtrees 風 React 節點卡片」需求，**排除**。

---

### Option E: `@visx/hierarchy`（Airbnb visx）

| 維度 | 評分 | 說明 |
|------|------|------|
| 佈局支援度 | ★★★★☆ | 基於 `d3-hierarchy`，提供 React 包裝（Tree, Cluster, Pack, Partition） |
| TS 型別 | ★★★★★ | 原生 TypeScript |
| 客製 node | ★★★★★ | 節點完全 JSX |
| Bundle size | ★★★★☆ | 模組化，只引入 `@visx/hierarchy` + `@visx/group` + `@visx/zoom` 約 20-30 KB |
| SSR | ★★★★★ | 純 SVG + React |
| Fan / Hourglass | ★★★☆☆ | `@visx/hierarchy` 本身未提供 Fan 極座標組件，仍需自行搭配 `d3.radial` 座標變換 |

**評估**：與 Option B 非常接近，但多一層 React 包裝。優點是 `@visx/zoom` 提供現成縮放元件；缺點是為了 Fan Chart 仍需自行處理極座標。可視為 Option B 的「更 React 化」版本。

---

## 3. Decision（決策）

> **選定方案：Option B — `d3-hierarchy` + `d3-shape` + `d3-zoom` + 純 SVG React 元件（手刻）**

### 依賴套件清單

```jsonc
{
  "dependencies": {
    "d3-hierarchy": "^3.1.2",
    "d3-shape": "^3.2.0",
    "d3-zoom": "^3.0.0",
    "d3-selection": "^3.0.0"
  },
  "devDependencies": {
    "@types/d3-hierarchy": "^3.1.7",
    "@types/d3-shape": "^3.1.6",
    "@types/d3-zoom": "^3.0.8",
    "@types/d3-selection": "^3.0.11"
  }
}
```

> 總體 d3 子模組 bundle **約 25-35 KB gzip**，且透過 tree-shaking 只打包用到的符號。

### 選擇理由

1. **一套心智模型撐起 4 種佈局**：`d3.tree()` 是唯一需要掌握的核心 API，Fan 用極座標變換、Hourglass 用兩次 tree 疊合、Pedigree/Descendants 改 `nodeSize` 與方向即可。**不需要混搭第二套函式庫**（避開 Option A 的致命缺陷）。
2. **TypeScript 型別安全**：`HierarchyNode<Person>` 泛型讓整條資料管線型別化，符合 `preferences.yaml` strict 要求。
3. **Next.js 16 RSC 友善**：d3-hierarchy 僅做數學計算，可在 Server Component 預先計算 layout；Client Component 只負責 zoom/pan 與點擊事件。
4. **Bundle 最小**：`d3-hierarchy` + `d3-shape` 比 `react-d3-tree` 還小，因為不含 React 包裝。
5. **客製節點最大彈性**：節點即 React JSX `<g>`，可直接用 Tailwind class、`<Image>` from next/image、性別色邊、hover 效果。
6. **demo 規模小**：~20 人 / 4 代的資料量，手刻成本**實際很低**（每個佈局檔 < 150 行）。

---

## 4. Consequences（後果）

### 正面

- 4 個佈局共用同一套 hierarchy / node 元件，**程式碼重用率高**
- 無需為了 Fan/Hourglass 引入第二套函式庫
- Bundle size 最優（相較 react-d3-tree 可省 ~50 KB）
- 型別安全度最高
- 可在 `/tree/[id]` 路由做 **Server Component 預算 layout**，client 只 hydrate 互動邏輯

### 負面

- 初期開發成本略高於 `react-d3-tree`（約多 1-2 小時）
- 需自行實作 zoom/pan 層（d3-zoom 或 react-zoom-pan-pinch 二選一）
- 需開發者理解 `d3-hierarchy` 的 `HierarchyNode` / `HierarchyPointNode` 模型

### 風險與緩解

| 風險 | 緩解措施 |
|------|---------|
| d3-zoom 與 React state 整合需注意 ref 掛載時機 | 使用 `useRef` + `useEffect` 一次性掛載；或改用 `react-zoom-pan-pinch`（純 React，更簡單） |
| Fan Chart 極座標文字方向旋轉繁瑣 | 提供 `rotateLabel(angle)` helper 函式，姓名在 90°-270° 區間自動翻轉 |
| Hourglass 雙向疊合時祖先 / 後代的 root 重疊 | 以根節點 y=0 為中線，祖先以負 y 向上、後代以正 y 向下 |
| SSR hydration mismatch | 將互動圖表包進 Client Component（`'use client'`），但佈局計算仍在 server 完成並以 props 傳入 |

---

## 5. Implementation Notes（給 frontend-dev 的實作指導）

### 5.1 共用型別與 helper

建議 `lib/tree/layout.ts` 定義：

```ts
import type { HierarchyNode, HierarchyPointNode } from 'd3-hierarchy';
import type { Person, Family } from '@/types/family';

/** 用於 d3-hierarchy 的節點資料，攜帶原始 Person */
export interface TreeDatum {
  person: Person;
  children?: TreeDatum[];
}

export type TreePointNode = HierarchyPointNode<TreeDatum>;
```

配一組純函式：

```ts
// 從 Person 出發建立「祖先向上」的 TreeDatum（父母視為 children）
export function buildAncestorTree(rootId: string, maxDepth = 4): TreeDatum;

// 從 Person 出發建立「後代向下」的 TreeDatum（子女為 children）
export function buildDescendantTree(rootId: string, maxDepth = 4): TreeDatum;
```

### 5.2 四種佈局策略

#### (a) PedigreeChart.tsx — 祖先圖

```ts
import { hierarchy, tree } from 'd3-hierarchy';

const root = hierarchy(buildAncestorTree(rootId, 4));
const layout = tree<TreeDatum>()
  .nodeSize([80, 220])   // [垂直間距, 水平間距]
  .separation(() => 1);

const positioned = layout(root);
// 根在左、祖先向右展開 → 渲染時將 x/y 交換即可
// positioned.descendants() → node 清單
// positioned.links()      → link 清單（父子線段）
```

使用 `d3-shape` 的 `linkHorizontal()` 產生貝茲曲線：

```ts
import { linkHorizontal } from 'd3-shape';
const pathGen = linkHorizontal<unknown, TreePointNode>()
  .x(d => d.y)   // 注意交換
  .y(d => d.x);
```

#### (b) DescendantChart.tsx — 後代圖

同 (a)，但：
- 使用 `buildDescendantTree`
- 不交換 x/y（垂直向下）
- 使用 `linkVertical()`

#### (c) FanChart.tsx — 扇形圖（極座標）

```ts
import { hierarchy, tree } from 'd3-hierarchy';

const root = hierarchy(buildAncestorTree(rootId, 4));
const layout = tree<TreeDatum>()
  .size([2 * Math.PI, radius])  // 第一個維度改為弧度
  .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

const positioned = layout(root);

// 將 (angle, radius) 轉為 (x, y) 笛卡爾座標
function polarToCartesian(node: TreePointNode) {
  const angle = node.x - Math.PI / 2;
  return {
    x: Math.cos(angle) * node.y,
    y: Math.sin(angle) * node.y,
  };
}
```

連線使用 `d3-shape` 的 `linkRadial()`：

```ts
import { linkRadial } from 'd3-shape';
const radialLink = linkRadial<unknown, TreePointNode>()
  .angle(d => d.x)
  .radius(d => d.y);
```

**節點標籤旋轉**：

```ts
function labelRotation(node: TreePointNode) {
  const deg = (node.x * 180) / Math.PI - 90;
  return node.x < Math.PI ? deg : deg + 180; // 下半圓翻轉以保持易讀
}
```

#### (d) HourglassChart.tsx — 沙漏圖

```ts
// 對同一位 rootPerson 做兩次 tree()
const ancestorRoot = hierarchy(buildAncestorTree(rootId, 3));
const descendantRoot = hierarchy(buildDescendantTree(rootId, 3));

const layoutAncestor = tree<TreeDatum>().nodeSize([120, 100]);
const layoutDescendant = tree<TreeDatum>().nodeSize([120, 100]);

const ancestorPositioned = layoutAncestor(ancestorRoot);
const descendantPositioned = layoutDescendant(descendantRoot);

// 渲染時：
// - 祖先子樹的 y 座標整體取負值（上半部）
// - 後代子樹的 y 座標維持正值（下半部）
// - 兩樹共用同一個 root person 座標 (0, 0)，避免重複渲染 root
```

關鍵：渲染時以 `<g transform="translate(cx, cy)">` 置中，祖先群組 y 乘以 -1。

### 5.3 統一 PersonNode 元件

```tsx
// components/tree/PersonNode.tsx
'use client';
import Image from 'next/image';
import Link from 'next/link';
import type { Person } from '@/types/family';

interface PersonNodeProps {
  person: Person;
  width?: number;
  height?: number;
  canView?: boolean; // 依角色過濾
}

// 使用 <foreignObject> 在 SVG 裡嵌入 HTML/Tailwind
export function PersonNode({ person, width = 180, height = 64, canView = true }: PersonNodeProps) {
  const borderClass =
    person.gender === 'M' ? 'border-blue-400'
    : person.gender === 'F' ? 'border-pink-400'
    : 'border-gray-400';

  return (
    <foreignObject x={-width / 2} y={-height / 2} width={width} height={height}>
      <Link
        href={`/person/${person.id}`}
        className={`flex items-center gap-2 rounded-md border-2 ${borderClass} bg-white/95 p-1 shadow-sm hover:shadow-md`}
      >
        <Image
          src={person.photo ?? '/avatars/unknown.png'}
          alt={person.displayName}
          width={48}
          height={48}
          className="rounded-sm object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-emerald-900">
            {canView ? person.displayName : '（隱私）'}
          </div>
          <div className="text-xs text-gray-500">
            {person.birthDate?.slice(0, 4) ?? '?'}–{person.deathDate?.slice(0, 4) ?? ''}
          </div>
        </div>
      </Link>
    </foreignObject>
  );
}
```

> 注意：Fan Chart 中若用 `<foreignObject>` 旋轉會造成文字難讀，Fan 版本可退而用 `<text>` + `<circle>` 或較小節點。

### 5.4 縮放 / 平移（二選一）

**方案 A（推薦 demo 起步）：`react-zoom-pan-pinch`**
- 純 React，3 行包裝即用
- 內建 pinch / wheel / pan
- bundle ~10 KB

```tsx
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

<TransformWrapper minScale={0.4} maxScale={2.5} wheel={{ step: 0.1 }}>
  <TransformComponent>
    <svg>...</svg>
  </TransformComponent>
</TransformWrapper>
```

**方案 B：`d3-zoom`（如需更細緻控制）**
- 直接綁定 `svg` ref，透過 `transform` attribute 套用
- 需手動處理 React 生命週期

→ **預設採用方案 A**。

### 5.5 Next.js 16 / RSC 建議

- `components/tree/PedigreeChart.tsx` 等圖表元件標註 `'use client'`（因為有 zoom/pan 與事件）
- 但 **layout 計算 helper**（`lib/tree/layout.ts`）是純函數，不需 `'use client'`，可被 Server Component 直接呼叫做 SSG 預算
- `app/tree/[id]/page.tsx`（Server Component）可 `await` 假資料後將預算好的 `positioned.descendants()` 序列化傳入 Client Chart（但簡單起見，也可以直接把 `rootId` 傳進 Client Component 讓其自行計算，demo 資料量小無所謂）

### 5.6 手機體驗要點

- `<svg viewBox="...">` 搭配 `preserveAspectRatio="xMidYMid meet"`
- 外層 `<div className="w-full overflow-auto">` 於 < 768px 允許水平捲動
- 縮放使用 `react-zoom-pan-pinch` 預設即支援 pinch

### 5.7 測試對照點

frontend-dev 完成後，QA 應驗證：
- 4 種圖表都能從任一 rootId 渲染
- 節點可點擊導航
- pinch / wheel zoom 運作
- bundle analyzer：d3-hierarchy + d3-shape + react-zoom-pan-pinch 合計 < 60 KB gzip

---

## 6. 參考

- d3-hierarchy: https://github.com/d3/d3-hierarchy
- d3-shape: https://github.com/d3/d3-shape
- Observable Fan Chart example: https://observablehq.com/@d3/radial-tidy-tree
- react-zoom-pan-pinch: https://github.com/BetterTyped/react-zoom-pan-pinch
