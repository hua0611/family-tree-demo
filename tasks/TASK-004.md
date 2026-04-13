# TASK-004 — 扇形圖與沙漏圖（Fan Chart / Hourglass）

- Priority: P2
- Agent: frontend-dev
- Status: pending
- Dependencies: TASK-003
- Spec reference: `spec/current.md` §3.1
- Architecture reference: `docs/adr/ADR-001-tree-visualization.md` §5.2 (c)(d)

## 描述

在 TASK-003 基礎上擴充兩種圖表：扇形圖（Fan Chart，極座標祖先展開）與沙漏圖（Hourglass，同時向上與向下展開）。這是 Webtrees 的特色圖表，也是 UI/UX 相似度的關鍵。

## 具體工作

1. `components/tree/FanChart.tsx`：極座標圓弧佈局，向外展開祖先
2. `components/tree/HourglassChart.tsx`：根節點置中，同時向上祖先 / 向下後代
3. `app/tree/[id]/fan/page.tsx`、`app/tree/[id]/hourglass/page.tsx` 子路由
4. 從 `/tree/[id]` 的 TreeToolbar 可切換至這兩種圖表
5. 手機可縮放（pinch 或按鈕 zoom in/out）

## 驗收標準

1. 扇形圖以選定成員為圓心向外展開 3-4 代祖先
2. 沙漏圖同時向上展開祖先、向下展開後代
3. 兩種圖表節點皆可點擊跳轉至 `/person/[id]`
4. 圖表顏色與字體符合 Webtrees 風格主題（TASK-009）

## 預估檔案

- `components/tree/FanChart.tsx`
- `components/tree/HourglassChart.tsx`
- `app/tree/[id]/fan/page.tsx`
- `app/tree/[id]/hourglass/page.tsx`

## 實作指導（ADR-001）

> 依賴 TASK-003 已導入 `d3-hierarchy` + `d3-shape` + `react-zoom-pan-pinch`，本 task **不需**新增依賴。
> 共用 `lib/tree/layout.ts` 的 `buildAncestorTree()` / `buildDescendantTree()` 與 `PersonNode.tsx`。

### Fan Chart（扇形圖）— 極座標 `d3.tree()`

```ts
import { hierarchy, tree } from 'd3-hierarchy';
import { linkRadial } from 'd3-shape';

const radius = Math.min(width, height) / 2;
const root = hierarchy(buildAncestorTree(rootId, 4));
const layout = tree<TreeDatum>()
  .size([2 * Math.PI, radius])                     // [角度範圍, 半徑]
  .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

const positioned = layout(root);

// 連線用 linkRadial（d3-shape 原生支援極座標）
const radialPath = linkRadial<unknown, TreePointNode>()
  .angle(d => d.x)
  .radius(d => d.y);

// 節點座標轉換（polar → cartesian）
function polarToCartesian(node: TreePointNode) {
  const angle = node.x - Math.PI / 2;
  return { x: Math.cos(angle) * node.y, y: Math.sin(angle) * node.y };
}
```

**標籤旋轉 helper**（避免下半圓文字顛倒）：

```ts
function labelRotation(node: TreePointNode) {
  const deg = (node.x * 180) / Math.PI - 90;
  return node.x < Math.PI ? deg : deg + 180;
}
```

**注意**：Fan Chart 中的節點旋轉會使 `<foreignObject>` 內的 Tailwind 卡片變形，建議 Fan 版本：
- 使用較精簡的 `<circle r="4">` + `<text>` 直接渲染，或
- 為 Fan 特製一版更小的 `FanPersonNode.tsx`（僅顯示姓名 + 生年）

### Hourglass Chart（沙漏圖）— 雙向疊合

```ts
import { hierarchy, tree } from 'd3-hierarchy';

// 分別為祖先與後代計算兩次 tree()
const ancestorRoot = hierarchy(buildAncestorTree(rootId, 3));
const descendantRoot = hierarchy(buildDescendantTree(rootId, 3));

const layoutA = tree<TreeDatum>().nodeSize([140, 100]);
const layoutD = tree<TreeDatum>().nodeSize([140, 100]);

const ancestorPositioned = layoutA(ancestorRoot);
const descendantPositioned = layoutD(descendantRoot);
```

**渲染時：**
- 以 `<g transform="translate(centerX, centerY)">` 將根節點置中
- 祖先子樹群組 `<g>` 將所有節點 `y` 取負（上半部）
- 後代子樹群組 `<g>` 保持正 `y`（下半部）
- 根節點只渲染一次（使用祖先或後代任一個，避免重複 DOM）
- 祖先群組的父子連線方向需反轉（因為資料上祖先是「children」，但視覺上在上方）

### 縮放 / 平移

沿用 TASK-003 的 `react-zoom-pan-pinch` 包裝，API 與設定一致。

### Tab 切換

`TreeToolbar.tsx`（TASK-003 建立）需加上 Fan / Hourglass 按鈕，以 Next/Link 切換至 `/tree/[id]/fan` 與 `/tree/[id]/hourglass`。

### 完整 API 參考與對照範例

見 `docs/adr/ADR-001-tree-visualization.md` §5.2 (c)(d)。
