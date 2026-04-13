# TASK-009 稽核報告 — Webtrees 風格深綠主題 CSS

- Reviewer: QA Agent
- Date: 2026-04-13
- Task: TASK-009
- Spec: v0.1.2 §7
- Verdict: **PASS**（可合併；2 項 Minor 建議 + 1 項 Info 記錄，不阻塞）

---

## 總覽

Agent 交付 3 支檔案（全為樣式層擴充）：

| 檔案 | 行數 | 狀態 |
|---|---|---|
| `tailwind.config.ts` | 60 | OK（擴充 colors / fontFamily） |
| `app/globals.css` | 204 | OK（@layer base + components） |
| `styles/webtrees-theme.css` | 55 | OK（僅文件註解，實際規則已整合入 globals.css） |

範圍合規：
- 未動 `app/layout.tsx`、`next.config.ts`、`package.json`、`tsconfig.json`
- 未新增任何 npm 套件（`@tailwindcss/typography`、`@tailwindcss/forms` 等皆未引入）
- 未觸及 TASK-002~008 的任何 `.tsx` 元件與 `data/**`、`types/**`、`lib/**`

---

## 檢查清單逐項驗證

### 1. 向下相容：原 5 token 值不變  ✅

對照 `reviews/TASK-007-review.md` 行 216–220 記錄的既有值：

| token | 既有值 | 本次值 | 結果 |
|---|---|---|---|
| `webtrees.primary` | `#2d5a3d` | `#2d5a3d` | 未變 |
| `webtrees.surface` | `#f5f1e8` | `#f5f1e8` | 未變 |
| `webtrees.accent` | `#8b6f47` | `#8b6f47` | 未變 |
| `webtrees.ink` | `#1f2937` | `#1f2937` | 未變 |
| `webtrees.muted` | `#6b7280` | `#6b7280` | 未變 |

TASK-003~008 所有既有元件的 `bg-webtrees-primary` / `text-webtrees-ink` / `bg-webtrees-surface` 等 class 不會被破壞。`PersonNode.tsx` / `PedigreeChart.tsx` 等硬編碼 hex（`#2d5a3d`、`#2d5a3d99`）與新值亦一致。

### 2. 新增 token 齊全  ✅

稽核重點列出的 12 個新 token 全部存在且值合理：

| token | 值 | 驗證 |
|---|---|---|
| `primary-dark` | `#1e3d28` | OK（深於 primary，作 hover） |
| `primary-light` | `#4a7a5a` | OK（淺於 primary） |
| `surface-alt` | `#ebe5d4` | OK（用於斑馬紋） |
| `card` | `#ffffff` | OK |
| `card-border` | `#d4c9b0` | OK（暖色邊，貼合米白背景） |
| `accent-light` | `#b89968` | OK（金黃 active 用） |
| `faint` | `#9ca3af` | OK（三級文字） |
| `divider` | `#e5e0ce` | OK |
| `success` | `#16a34a` | OK |
| `danger` | `#dc2626` | OK |
| `male` | `#4a90e2` | OK |
| `female` | `#e07bb0` | OK |
| `neutral` | `#9ca3af` | OK |

### 3. Utility classes 存在且可用  ✅

稽核重點提到的 4 支主要 utility 全部到位，且均用 `@apply`（符合 Tailwind best practice）：

- `.wt-card` ✅（`app/globals.css` L42–44）
- `.wt-button-primary` ✅（L46–48）
- `.wt-button-secondary` ✅（L50–52）
- `.wt-section-title` ✅（L58–60）

附加 bonus：`.wt-divider`、`.wt-person-node(+-male/-female/-neutral)`、`.wt-person-node__name`、`.wt-person-node__dates`、`.wt-timeline-item(+__label/__content/__date)`、`.wt-header(+__nav-link/-active)`、`.wt-table`、`.wt-badge(+-alive/-deceased)`。

時間軸偽元素（`::before`、`::after`）與 `tbody tr:nth-child(even)` 斑馬紋因不支援 `@apply`，改用純 CSS — **寫法正確**。

### 4. font-display 類別可用  ✅

`tailwind.config.ts` L52：`display: ['var(--font-noto-serif-tc)', 'Georgia', 'serif']` 已定義。
`globals.css` L28/L59/L85 均使用 `font-display`，可被 Tailwind 正確產生對應 utility。
`app/layout.tsx` 已注入 `--font-noto-serif-tc` CSS variable（未變動），鏈路完整。

### 5. 不引入新 npm 套件  ✅

`package.json` 與 TASK-001 交付時完全一致，無 `@tailwindcss/typography`、`@tailwindcss/forms`、`clsx`、`tailwind-merge` 等新增依賴。

### 6. 不應更動的檔案  ✅

以下檔案**未被觸及**：
- `app/layout.tsx`（`next/font` 注入、Providers 結構原封不動）
- `next.config.ts`
- `package.json`
- `tsconfig.json`

### 7. CSS variable 備援保留  ✅

`app/globals.css` L5–11 的 `:root` 區塊保留了 `--color-primary` / `--color-surface` / `--color-accent` / `--color-ink` / `--color-muted` 5 個 CSS variable，任何以 `var(--color-primary)` 方式引用的既有程式碼仍能正常運作。

### 8. 與 TASK-003~008 元件相容  ✅

grep 結果顯示新增的 `wt-*` class name 在 `components/**` 中無任何現有引用 — 代表：
1. 沒有和既有 class 衝突（例如 `wt-card` 並未覆蓋任何舊元件既有樣式）
2. 這是一個**純追加**（additive）的主題層，供後續任務按需採用

TASK-003~008 元件使用的 `bg-webtrees-primary`、`text-webtrees-primary-dark`、`border-webtrees-card-border` 等 class 均能由新 config 正確解析。

---

## 問題清單

### MINOR（不阻塞）

**M1. `@layer base` 對 h1/h2/h3 全域注入 `font-display` 與 `text-webtrees-primary-dark`，可能影響既有頁面視覺**

- 檔案：`app/globals.css` L27–29
- 說明：所有既有頁面（TASK-003~008 已交付的 Tree / Person / Media / Stories 頁）內的 `<h1>/<h2>/<h3>` 會自動變為 Noto Serif TC 加深綠色。部分頁面原本以 class 明確指定字體/顏色可能被 override 或與現有風格衝突（例如 `StoryHero` / `PersonHeader` 中的標題）。
- 風險等級：視覺外觀；若設計師期望的就是「統一標題字體」即為正確；若既有元件已按需微調字重/色調則可能造成 regression。
- 建議（擇一）：
  - (a) 將此規則限縮到特定上下文（如 `.prose h1, .wt-section-title h2`），或
  - (b) 保留現狀但在 TASK-010（若有）或手動驗證時逐頁目視檢查一次
- 本次不阻塞：h1~h3 全域套版為 Webtrees 主題的常見做法，且 `font-display` 本身 fallback 合理，最糟情況也只是外觀差異而非報錯。

**M2. TASK-009.md 任務單中的 primary hex 與實作不同（`#2d5016` vs `#2d5a3d`）**

- 任務單 L16 要求：`primary: 深綠（#2d5016）`
- 實作值：`#2d5a3d`（保留既有）
- 分析：本次稽核重點明確指示「原 5 個 token 必須保留且值不變」→ 實作正確地選擇了「維持既有值、保障 TASK-003~008 元件相容性」。任務單寫的 `#2d5016` 應被視為 **spec v0.1.2 §7 色盤區間描述（`#2d5016 ~ #4a7c2e`）的端值**，並非硬性指定。實作值 `#2d5a3d` 落在該區間內，符合 spec §7。
- 結論：**不算偏離**，但建議未來 PM 派發類似任務時，若要求保留既有 token，應在任務單中明確標註「忽略 hex 更新、只新增 token」。

### INFO（純記錄，無須處理）

**I1. TASK-009 任務單 §1 的 token 命名與實作命名存在差異**

- 任務單要求：`primary-hover` / `male-border` / `female-border` / `unknown-border`
- 實作提供：`primary-dark` + `primary-light` / `male` / `female` / `neutral`
- 稽核重點亦以 `male` / `female` / `neutral` 為準 → 實作與稽核重點一致。
- 語義上 `primary-dark` 比 `primary-hover` 更通用（hover 只是用途之一，還可用於 active / pressed），`male/female/neutral` 亦較 `*-border` 彈性（可作 bg、text、border 任意用途）。
- 此為正向偏離，無須修正。
- **觀察**：frontend-dev 第二次出現「偏離任務單字面命名但提供語義等價或更佳的命名」的模式（第一次見於 SKL-OBS-001 / TASK-002）。但本次稽核重點已預先採用新命名，顯示 PM 與 agent 之間已有默契。**暫不回寫 skill lessons**，繼續觀察 TASK-010+。

---

## 稽核結果

- 任務：TASK-009
- 結果：**✅ PASS（可合併）**
- 阻塞問題：**無**
- 建議處理：M1 建議在後續 UI 整合時目視驗證一次 h1/h2/h3 外觀；M2 為 spec 文件修辭問題，不影響程式碼
- 技能迭代建議：暫不回寫，見 I1 觀察

### 交付亮點

1. **保守擴充**：原 5 token 零變動，完全保障 TASK-003~008 相容
2. **語義命名**：`primary-dark` / `accent-light` / `male` 等命名比任務單字面更通用
3. **純 CSS fallback 正確**：偽元素與 `:nth-child` 用原生 CSS 而非強套 `@apply`
4. **文件化完整**：`styles/webtrees-theme.css` 註解包含色盤對照表與 class 清單，後續 agent 可直接查表套用
5. **無依賴膨脹**：未引入任何 Tailwind plugin
6. **CSS variable 雙軌並存**：`:root` 的 5 個 var 保留，最大相容性
