# TASK-003 稽核報告 — 家族樹視覺化核心元件

- Reviewer: QA Agent
- Date: 2026-04-13
- Task: TASK-003
- Verdict: **PASS_WITH_NOTES**

---

## 總覽

frontend-dev 交付 6 支檔案：

| 檔案 | 行數 | 狀態 |
|---|---|---|
| `lib/tree/layout.ts` | 78 | OK |
| `components/tree/PersonNode.tsx` | 170 | OK（有 Minor：未使用 Tailwind class） |
| `components/tree/TreeZoomWrapper.tsx` | 37 | OK |
| `components/tree/PedigreeChart.tsx` | 125 | OK |
| `components/tree/DescendantChart.tsx` | 124 | OK |
| `app/tree/[id]/page.tsx` | 154 | OK |

**範圍合規**：未修改 TASK-001/002 的檔案（`types/`、`data/`、`lib/family-helpers.ts`、`tailwind.config.ts`、`tsconfig.json`、`package.json` 的 mtime 均早於 TASK-003 的產出）。唯一的例外是 `package.json` 已含 `d3-hierarchy`/`d3-shape`/`react-zoom-pan-pinch` 依賴，這是 TASK-001 腳手架階段就加入的，本次未再動。OK。

**未交付但不阻塞**：TASK-003 預估檔案包含 `components/tree/TreeToolbar.tsx`，agent 未建立獨立 Toolbar 元件，改以 `app/tree/[id]/page.tsx` 內嵌 Tab Link 實作。功能面等價，但檔案結構與預估有落差。見 Minor m1。

---

## 驗收標準對照

| # | 驗收標準 | 結果 | 備註 |
|---|---|---|---|
| 1 | 從任一成員為根，祖先/後代圖皆能渲染至少 3 層 | PASS | Pedigree 預設 maxDepth=4，Descendant 預設 maxDepth=3，佈局建構遞迴呼叫 `getParents` / `getChildren`，邏輯正確 |
| 2 | 節點顯示照片、姓名、生卒年、性別色邊框 | PASS | PersonNode 正確顯示 `photoUrl`、`fullName`、`formatDateRange(person)`、性別 → 邊框色 |
| 3 | 點擊節點跳轉 `/person/[id]` | PASS | 節點以 `<Link href={'/person/' + person.id}>` 包整張卡片 |
| 4 | 桌機不溢出、手機可水平捲動 | PASS | 外層 `TreeZoomWrapper` 使用 `react-zoom-pan-pinch` + `overflow-hidden`；pinch/wheel zoom 皆支援；SVG 動態計算 bounding box |
| 5 | Tab 切換無畫面閃爍 | PASS_WITH_NOTES | 以 searchParam `?view=pedigree\|descendants` + `<Link>` 實作。Next.js 16 RSC 會 stream 新畫面，實務上無 full-page flicker，但樹會重新 re-mount（`react-zoom-pan-pinch` 會 reset scale / pan 位置）。demo 可接受 |

---

## 稽核重點逐項檢查

### 1. TypeScript strict / d3 泛型正確性 — PASS

- `lib/tree/layout.ts`
  - `HierarchyPointNode<TreeDatum>` 泛型化正確，無 `any` 洩漏
  - `TreeDatum` 介面簡潔，`children?: TreeDatum[]` 對齊 d3-hierarchy 預期
  - `buildAncestorTree` / `buildDescendantTree` 回傳 `TreeDatum | null`，null 分支在 chart 內被正確處理
- `PedigreeChart.tsx`
  - `hierarchy<TreeDatum>(datum)`（datum 已 null-narrow 過）✅
  - `tree<TreeDatum>().nodeSize([V_GAP, H_GAP]).separation(() => 1)`：d3 回傳 `TreeLayout<TreeDatum>`，型別完整
  - `linkHorizontal<HierarchyPointLink<TreeDatum>, TreePointNode>()` 使用雙泛型 (LinkDatum, NodeDatum) 形式，對應 `@types/d3-shape@3.x` 的 `linkHorizontal<LinkDatum, NodeDatum>()` 簽名；`.x(d => d.y)` 的 `d` 被推斷為 `TreePointNode`，`.y` 為 `number`，正確
  - `positioned.descendants() as TreePointNode[]` / `positioned.links() as HierarchyPointLink<TreeDatum>[]` — cast 技術上多餘（d3-hierarchy 已正確推斷），但不影響型別安全
- `DescendantChart.tsx`：同上，`linkVertical` 泛型與 accessor 正確
- 整體無發現 `any`、無隱式 widening。**與 `noUncheckedIndexedAccess: true` 相容**（程式中沒有解構 array index 的地方；`xs[0]` 等模式都以 `Math.min(...xs)` 處理）。

### 2. RSC / Client 分離 — PASS

| 檔案 | 標註 | 合理性 |
|---|---|---|
| `lib/tree/layout.ts` | 無 `'use client'` | ✅ 純函數，可被 RSC 或 Client 引用 |
| `components/tree/PersonNode.tsx` | `'use client'` | ✅ 使用 `next/link` + `next/image`（技術上不嚴格需要 'use client'，但與其他 client 元件一致） |
| `components/tree/TreeZoomWrapper.tsx` | `'use client'` | ✅ `react-zoom-pan-pinch` 需 client |
| `components/tree/PedigreeChart.tsx` | `'use client'` | ✅ `useMemo` + zoom wrapper |
| `components/tree/DescendantChart.tsx` | `'use client'` | ✅ 同上 |
| `app/tree/[id]/page.tsx` | 無 'use client'（預設 RSC） | ✅ `await params` / `await searchParams` 是 Next.js 16 async RSC 正確用法 |

分離策略合理。

### 3. `getPerson` / `getParents` / `getChildren` 使用一致性 — PASS

`lib/tree/layout.ts` 呼叫：

```ts
import { getPerson, getParents, getChildren } from '@/lib/family-helpers'
```

- `getPerson(rootId)` → `Person | undefined` ✅
- `getParents(personId)` → `Person[]` ✅
- `getChildren(personId)` → `Person[]` ✅

呼叫型別與 `lib/family-helpers.ts` 匯出一致。

### 4. 型別欄位對齊 spec v0.1.2 — PASS（SKL-OBS-001 無觸發）

**檢查是否誤用舊命名**：

| 舊命名 | 本次出現位置 | 狀態 |
|---|---|---|
| `displayName` | 僅出現在 `docs/adr/ADR-001-tree-visualization.md` §5.3 的範例（ADR 未更新）及歷史 review 檔 | 不在本次交付物中 |
| `photo`（無 Url 後綴） | 僅出現在 ADR 範例 | 不在本次交付物中 |
| `bio`（無 graphy 後綴） | 無 | 未使用 |

**本次交付物中的欄位使用**（從程式中抓取）：

```
PersonNode.tsx:      person.fullName ✅
PersonNode.tsx:      person.photoUrl ✅
PersonNode.tsx:      person.isLiving ✅
PersonNode.tsx:      person.gender → 'male' | 'female' | 'unknown' ✅
app/tree/[id]/page.tsx: person.fullName ✅
app/tree/[id]/page.tsx: person.photoUrl ✅
app/tree/[id]/page.tsx: person.birthDate / birthPlace ✅
app/tree/[id]/page.tsx: person.deathDate / deathPlace ✅
```

全部對齊 `types/family.ts`（spec v0.1.2 single source of truth）。

**特別讚賞**：ADR-001 §5.3 的範例程式碼使用了 `person.gender === 'M'` 與 `person.displayName` / `person.photo`（ADR 於 spec 升級為 v0.1.2 前撰寫，未同步更新）。frontend-dev **正確識別並翻譯**為 spec v0.1.2 的 `'male'|'female'|'unknown'` 與 `fullName`/`photoUrl`，**未盲從 ADR 範例**。這是成熟的工程判斷。

**SKL-OBS-001 結論**：**未觀察到命名偏離**，TASK-003 未觸發升級條件。`.claude/skills/code-style/references/lessons.md` 無需追加條目。

### 5. 佈局代數限制 — PASS

- `PedigreeChart` 預設 `maxDepth = 4`，page.tsx 顯式傳入 `maxDepth={4}` ✅
- `DescendantChart` 預設 `maxDepth = 3`，page.tsx 顯式傳入 `maxDepth={3}` ✅
- `buildAncestorTree(rootId, maxDepth = 4)` 在 depth <= 0 時停止遞迴，不會無限展開
- `buildDescendantTree(rootId, maxDepth = 3)` 同上

### 6. 縮放平移整合 — PASS

`TreeZoomWrapper` 以 `<TransformWrapper minScale={0.3} maxScale={2.5} wheel={{ step: 0.08 }} centerOnInit>` + `<TransformComponent>` 包裝 `<svg>`。Props 設定合理：

- `minScale 0.3 / maxScale 2.5`：涵蓋「縮小到看全樹」與「放大到看節點細節」
- `wheel.step 0.08`：比 ADR 建議的 `0.1` 略細緻
- `centerOnInit`：初始置中
- `doubleClick: { disabled: false }`：保留雙擊放大

### 7. `notFound()` / `searchParams` Tab 切換 — PASS

```ts
const person = getPerson(id)
if (person === undefined) {
  notFound()
}
```

`notFound()` 正確呼叫，後續 TS narrowing 需要 `throw`/`never` 提示但 Next.js 的 `notFound()` 已被標註為 `never`，後續 `person.fullName` 不會報錯。

`const activeView = view === 'descendants' ? 'descendants' : 'pedigree'` — defensive default 到 pedigree，任何非法值（如 `?view=xxx`）都會 fallback。✅

### 8. SKL-OBS-001 觀察 — 未觸發

見上方第 4 點。TASK-003 未再現 TASK-002 的「未經 ESCALATION 偏離 spec」模式。

### 9. Tailwind webtrees 色盤 — PASS_WITH_NOTES

`app/tree/[id]/page.tsx` 正確使用 `bg-webtrees-primary`、`text-webtrees-muted`、`text-webtrees-ink`、`bg-webtrees-surface`、`border-webtrees-primary` — 全部來自 `tailwind.config.ts` 定義。✅

但 `PersonNode.tsx` 與 `PedigreeChart.tsx` / `DescendantChart.tsx` 的 SVG 內部使用硬編碼 hex：
- `PersonNode.tsx` 行 108：`color: '#2d5a3d'`（webtrees-primary）
- `PersonNode.tsx` 行 162–162：`#22c55e` / `#16a34a`（在世點 & 文字色）
- `PersonNode.tsx` 整個 `style={{...}}`：改用 inline style 而非 Tailwind className
- `PedigreeChart.tsx` 行 103：`stroke="#2d5a3d99"`
- `DescendantChart.tsx` 行 101：`stroke="#2d5a3d99"`

功能正確且顏色與 webtrees 色盤吻合，但未走 Tailwind token。見 Minor m2。

### 10. 範圍檢查 — PASS

未動 TASK-001/002 檔案，已於「總覽」章節確認 mtime。

---

## 問題分級

### Critical — 0 項

（無）

### Major — 0 項

（無）

### Minor — 3 項

**m1. TreeToolbar.tsx 未建立，Tab 以 page.tsx 內嵌 Link 實作**

- 影響：檔案結構與 TASK-003 預估清單不一致；未來要擴充（如加「檢視角色切換」「縮放按鈕」）需另建元件
- 合理性：以 Link-based tab 實作符合 Next.js 16 RSC 模式，避免 Client Component 擴散，實務上是更好的選擇
- 建議：在 `project.json` / TASK-003 狀態更新時，將「TreeToolbar.tsx 未建立（以 page.tsx 內嵌實作）」記錄為 delivered-differently
- 是否阻塞：**否**

**m2. 部分樣式未走 Tailwind token（inline style / 硬編碼 hex）**

- 位置：`PersonNode.tsx`、`PedigreeChart.tsx` 行 103、`DescendantChart.tsx` 行 101
- 影響：主題色變更時需要同步改兩處（`tailwind.config.ts` + 這些硬編碼）；不影響視覺或功能
- 合理性：`<foreignObject>` 內使用 Tailwind class 在某些情境下有 layout quirks，使用 inline style 可避開；SVG `stroke` 屬性也無法直接接 Tailwind class（需以 `className` + 對應 `stroke-*` utility，但色盤未 gen 對應 utility）
- 建議：
  1. 將硬編碼 `#2d5a3d` / `#2d5a3d99` 抽出為 `lib/tree/constants.ts` 的 `WEBTREES_LINK_STROKE` 常數
  2. 或在 `tailwind.config.ts` 加入對應 stroke color 並使用 `className="stroke-webtrees-primary/60"`
- 是否阻塞：**否**

**m3. `buildAncestorTree` / `buildDescendantTree` 的 `getPerson` 防呆建立了不完整的 Person**

- 位置：`lib/tree/layout.ts` 行 31、63
  ```ts
  if (p === undefined) {
    return { person: { id: personId } as Person }
  }
  ```
- 影響：理論上此分支不會觸發（`getParents`/`getChildren` 已做過濾），但若發生會在 `PersonNode` 渲染時存取 `surname.charAt(0)` 等欄位崩潰
- 合理性：defensive coding，但型別 cast `as Person` 繞過 TS 檢查，與專案「strict + noUncheckedIndexedAccess」精神略有出入
- 建議：改成略過此節點（return 父層時 filter 掉 undefined）或 throw 明確錯誤
- 是否阻塞：**否**

---

## 其他正面觀察

1. **useMemo 使用正確**：`PedigreeChart` / `DescendantChart` 的佈局計算被 `useMemo` 以 `[rootId, maxDepth]` 為依賴快取，避免 re-render 時重算
2. **pathGenerator 亦被 useMemo 記憶**：linkHorizontal/linkVertical 建構也走 useMemo，小細節但正確
3. **空狀態友善**：datum === null 時回傳 `nodes: []` + 「找不到人物資料」提示，不會讓 svg 崩潰
4. **`generateMetadata` 同步實作**：提供 SEO-friendly 的 title / description，超出驗收標準的加分項
5. **`canView` prop 預設 true**：尚未有 RoleContext 的情況下保留擴充點，TASK-006 實作角色過濾時可無縫接上
6. **Pedigree 的 x/y swap 註解清楚**：行 45–46、行 91–94 都有中文註解解釋座標變換，利於後續維護
7. **ADR 盲點主動修正**：將 ADR §5.3 的 `'M'|'F'|'U'` 範例翻譯為 spec v0.1.2 的 `'male'|'female'|'unknown'`，展現對 spec single-source-of-truth 原則的理解

---

## 結論

**Verdict: PASS_WITH_NOTES**

TASK-003 交付物完整、型別安全、符合 ADR-001 決策、對齊 spec v0.1.2 命名慣例。3 項 Minor 問題皆不阻塞，可在後續 task（如 TASK-004 扇形圖 / 沙漏圖）或獨立的 polishing task 中修正。

**SKL-OBS-001 狀態**：**未觸發**。TASK-003 未再現「未經 ESCALATION 就偏離 spec」的模式；相反地，frontend-dev 主動識別了 ADR 範例中的舊命名並翻譯為 spec 命名。建議在 `project.json.preference_overrides` 記錄此次觀察結論，並考慮在 TASK-005~007 完成後若再連續兩次無偏離，將 SKL-OBS-001 標記為 Resolved。

**後續建議**：

1. 更新 `docs/adr/ADR-001-tree-visualization.md` §5.3 的範例程式碼，將 `'M'|'F'|'U'` 改為 `'male'|'female'|'unknown'`、`displayName` → `fullName`、`photo` → `photoUrl`，避免後續 agent 誤引用
2. TASK-004（Fan / Hourglass）可重用 `PersonNode` / `TreeZoomWrapper` / `lib/tree/layout.ts` 的 `buildAncestorTree`，無需再建
3. m3 的 defensive fallback 可在 TASK-004 時順手收斂
4. TASK-006 或獨立的 polishing task 建立 `components/tree/TreeToolbar.tsx` 並抽出縮放按鈕 / 檢視切換 / 重置為根等控制項

---

## 建議 orchestrator 後續動作

- [ ] 將 TASK-003 狀態設為 `done_with_notes`
- [ ] 更新 `project.json.completed_tasks`
- [ ] 在 `sessions/` 下新增本次稽核摘要
- [ ] 提示用戶 m1–m3 可延後到後續 task 處理
- [ ] 啟動 TASK-004（Fan + Hourglass）或依 P0 優先級決定下一步
