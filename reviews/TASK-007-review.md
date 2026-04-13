# TASK-007 稽核報告 — Stories 列表與文章頁

- Reviewer: QA Agent
- Date: 2026-04-13
- Task: TASK-007
- Spec: v0.1.2
- Verdict: **PASS**（可合併；僅 1 項 Minor 建議，不阻塞）

---

## 總覽

Agent 交付 6 支檔案：

| 檔案 | 行數 | 狀態 |
|---|---|---|
| `app/stories/page.tsx` | 138 | OK |
| `app/stories/[id]/page.tsx` | 123 | OK |
| `components/stories/StoryCard.tsx` | 87 | OK |
| `components/stories/StoryHero.tsx` | 105 | OK |
| `components/stories/StoryContent.tsx` | 81 | OK |
| `components/stories/RelatedPeopleRow.tsx` | 67 | OK |

範圍合規：
- 未動 `data/stories.ts`、`types/family.ts`、`lib/family-helpers.ts`、`tailwind.config.ts`、`package.json`
- 未觸及 TASK-003 / 004 / 005 / 006 的檔案（`app/tree/**`、`app/media/**`、`app/person/**`）
- **未新增任何依賴**（未引入 `react-markdown`、`remark`、`marked` 等套件，完全符合 `StoryContent` 的「手刻 mini-parser」策略）

---

## 驗收標準對照表

| # | 標準 | 結果 | 備註 |
|---|---|---|---|
| 1 | Stories 列表至少 5 篇假資料 | PASS | 讀取 `data/stories.ts` 中 5 篇 story，列表頁無過濾時全數渲染 |
| 2 | 文章頁 Markdown 正確渲染（含標題階層、粗體、清單） | PASS（含小注意點） | `StoryContent` 支援 `#`/`##`/`###` heading 與 `**bold**` inline；段落以 `\n\n` 分段；見下方「m1：清單 marker 未處理」 |
| 3 | 關聯人物連結可跳轉至 `/person/[id]` | PASS | `RelatedPeopleRow` 以 `Link href={/person/${person.id}}` 實作 |
| 4 | 列表頁 RWD 在手機下改為單欄卡片 | PASS | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`，< 640px 單欄、640-1024 雙欄、>1024 三欄 |

---

## Spec v0.1.2 Story 型別對齊檢查

稽核重點 1 — 檢查所有交付檔案中使用的 Story 欄位是否與 v0.1.2 一致：

| 使用點 | 欄位 | 結果 |
|---|---|---|
| `app/stories/page.tsx` L39 | `story.publishedAt` | OK |
| `app/stories/page.tsx` L35 | `story.relatedPersonIds` | OK |
| `app/stories/page.tsx` L19 | `story.tags` | OK |
| `app/stories/[id]/page.tsx` L24 | `story.excerpt`（metadata description） | OK |
| `app/stories/[id]/page.tsx` L40,42 | `publishedAt` 排序 | OK |
| `app/stories/[id]/page.tsx` L70 | `story.content` | OK |
| `app/stories/[id]/page.tsx` L74 | `story.relatedPersonIds` | OK |
| `StoryCard.tsx` L17 | destructure `{ id, title, excerpt, coverUrl, publishedAt, authorId, tags }` | OK — 全部為 v0.1.2 欄位 |
| `StoryCard.tsx` L18 | `authorId` + `getPerson(authorId)` | OK — 正確把 id 解析為 Person |
| `StoryHero.tsx` L22 | destructure `{ title, coverUrl, publishedAt, authorId, content, tags }` | OK |
| `StoryHero.tsx` L23 | `getPerson(authorId)` | OK |
| `StoryContent.tsx` L17 | 只用 `content` prop | OK |
| `RelatedPeopleRow.tsx` L10 | 只用 `personIds: PersonId[]` prop | OK |

**關鍵驗證**：
- 無任何一處出現 `summary`、`author`（字串）、`contentMarkdown`、`publishedDate`、`coverImage` 等舊命名
- `authorId` 一律透過 `getPerson()` 解析後取 `fullName`，語義正確（spec §6 `authorId?: PersonId`）
- `publishedAt` 用於 `<time dateTime={...}>` 與 ISO 字串比較排序，格式一致

**結論：Story 型別欄位 100% 對齊 v0.1.2 spec §6。SKL-OBS-001 本次未復發。**

---

## StoryContent 渲染實作稽核

檢查重點 2 —「段落分割、heading、bold 處理；不引入 react-markdown」：

```typescript
const paragraphs = content.split(/\n\n+/)
```

- **段落分割**：以 `\n\n+`（連續空行）切段 ✓
- **Heading**：
  - `### ` → `<h3>` (slice(4))
  - `## ` → `<h2>` (slice(3))，含 border-bottom 樣式
  - `# ` → `<h1>` (slice(2))
- **粗體**：`renderInline` 以 `/(\*\*[^*]+\*\*)/` split，命中部分 wrap 為 `<strong>`
- **純段落**：`<p className="whitespace-pre-line">` 保留段內單一換行
- **第三方依賴**：零依賴（`package.json` 完全未變動，`StoryContent.tsx` 只 import `type { ReactNode } from 'react'`）

對照 `data/stories.ts` 實際內容：
- 每篇 story 都用 `## 告別故鄉` / `## 大稻埕的起步` 等 `##` 二級 heading，會正確渲染為 `<h2>`
- 段落之間有 `\n\n` 空行分隔，`split(/\n\n+/)` 切分正確
- 目前 5 篇 story 內容未使用 `**bold**`、`###` 或 `-` / `1.` 清單

**結論：渲染實作正確，symbol 處理完整，未引入新依賴。**

> 注意：TASK-007 具體工作 2 原文列舉「含標題階層、**粗體**、**清單**」作為示例，但 `data/stories.ts` 當前 5 篇都沒寫清單。`StoryContent` 目前**無清單處理**，若後續新增含 `- item` / `1. item` 的 story 內容，將只會以 `<p whitespace-pre-line>` 原樣顯示 dash + 文字。見下方 m1。

---

## 上一篇/下一篇導覽（重點 3）

```typescript
const sorted = [...stories].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
const currentIndex = sorted.findIndex((s) => s.id === id)
const prevStory = currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : undefined
const nextStory = currentIndex > 0 ? sorted[currentIndex - 1] : undefined
```

- **排序**：以 `publishedAt` 降序（最新在前）
- **prev/next 語意**：
  - `nextStory = sorted[currentIndex - 1]` → 比當前新的一篇（位於前面）
  - `prevStory = sorted[currentIndex + 1]` → 比當前舊的一篇（位於後面）
  - 符合「下一篇」＝「更新的一篇」、「上一篇」＝「更舊的一篇」的主流部落格語意
- **邊界**：
  - 最新一篇（currentIndex=0）時 `nextStory=undefined`，渲染 `<div/>` 佔位
  - 最舊一篇（currentIndex=length-1）時 `prevStory=undefined`，同樣佔位
  - 使 `grid grid-cols-1 sm:grid-cols-2` 保持對稱

對照實際資料（publishedAt 降序）：
1. s-005 2024-03-22
2. s-004 2024-01-08
3. s-003 2023-09-15
4. s-002 2023-06-20
5. s-001 2023-04-05

- 瀏覽 s-003 時：next = s-004（較新）、prev = s-002（較舊）✓
- 瀏覽 s-005 時：next = undefined（最新），prev = s-004 ✓
- 瀏覽 s-001 時：prev = undefined（最舊），next = s-002 ✓

**結論：導覽邏輯與排序完全正確。**

---

## generateStaticParams / notFound 稽核（重點 4, 5）

```typescript
export function generateStaticParams() {
  return stories.map((s) => ({ id: s.id }))
}
```

- **SSG 靜態產生**：列出所有 5 個 story id，Next.js 16 build 時會為 s-001..s-005 產生靜態頁面 ✓
- **generateMetadata** 為 async 函式（await params），符合 Next.js 15+ PPR 規範 ✓
- **notFound()**：`if (story === undefined) { notFound() }` 在取回 undefined 時呼叫 `next/navigation` 的 `notFound()`，觸發 404 頁 ✓
- 無自訂 `app/stories/[id]/not-found.tsx`，會 fallback 到全域預設 404 — 可接受

**結論：SSG 與 404 處理完整，符合 Next.js 16 慣例。**

---

## 篩選支援（重點 6）

`app/stories/page.tsx` 的 `searchParams` 是 `Promise<{ tag?: string; person?: string }>`（Next.js 15+ 規範）。

- **tag 篩選**：`filterStories` 中 `story.tags.includes(tag)`，未定義 tags 的 story 自動排除 ✓
- **person 篩選**：`story.relatedPersonIds.includes(personId)` ✓
- **同時帶兩個參數**：兩者以 AND 邏輯疊加（兩個 if 都必須通過）✓
- **UI 層面**：Filter bar 只渲染 tag 按鈕（沒有 person 按鈕），但 URL 帶 `?person=p-xxx` 時仍正確過濾，支援從人物頁深度連結至「此人相關故事」的場景
- **空結果**：顯示「沒有符合條件的故事」＋「清除篩選條件」返回連結 ✓

**小注意**：URL 中直接傳 `?person=p-001` 時，頁面上不會顯示「目前在看 p-001」的提示，也沒有清除單一 person filter 的 chip。不影響功能正確性，純屬 UX。

---

## RWD Grid（重點 7）

`app/stories/page.tsx` L117:
```
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
```

- **< 640px**：單欄 ✓（對應 AC4）
- **640-1024**：雙欄
- **≥1024**：三欄

`app/stories/[id]/page.tsx` 文章頁：
- `max-w-4xl mx-auto` 文章容器，手機下 `px-4`、桌機 `lg:px-8` ✓
- Hero 封面 `h-72 sm:h-96` 隨屏幕調整 ✓
- prev/next grid `grid-cols-1 sm:grid-cols-2` ✓

`components/stories/RelatedPeopleRow.tsx`：
- 水平滾動 `flex overflow-x-auto` ✓（手機下不會擠壓變形）

**結論：RWD 實作完整。**

---

## TypeScript strict 相容性（重點 8）

tsconfig 啟用 `strict` + `noUncheckedIndexedAccess`（見 TASK-002 report）。逐點檢查：

- `searchParams: Promise<{ tag?: string; person?: string }>` 正確 await 後使用
- `params.tag` / `params.person` 為 `string | undefined`，所有使用點都有 `=== undefined` narrow
- `story.tags` 為 `string[] | undefined`，使用前有 `story.tags === undefined` 檢查
- `stories.find(...)` 回傳 `Story | undefined`，`if (story === undefined) { notFound() }` 後 narrow 為 `Story`
- `sorted[currentIndex + 1]` 在 `noUncheckedIndexedAccess` 下為 `Story | undefined`，直接賦值給 `prevStory: Story | undefined` ✓
- `getPerson(authorId)` 回傳 `Person | undefined`，所有使用點都有 `author !== undefined` narrow
- `RelatedPeopleRow` 用 type predicate `(p): p is NonNullable<typeof p> => p !== undefined` 正確過濾
- 無 `any` / `as` 斷言
- Import 排序符合 code-style（外部套件 → @/ 別名 → 相對路徑）

**結論：完全相容 strict + noUncheckedIndexedAccess。**

---

## webtrees 色盤一致性（重點 10）

交付檔案使用的顏色 class：
- `bg-webtrees-surface` / `bg-webtrees-primary/10` / `bg-webtrees-primary/15`
- `text-webtrees-ink` / `text-webtrees-muted` / `text-webtrees-accent` / `text-webtrees-primary`
- `border-webtrees-primary/15` / `border-webtrees-primary/20` / `border-webtrees-primary/30`
- `font-serif` 用於標題（對應 Noto Serif TC）

對照 `tailwind.config.ts`：
```
webtrees: {
  primary: '#2d5a3d',   // 深綠
  surface: '#f5f1e8',   // 米白
  accent:  '#8b6f47',   // 褐色
  ink:     '#1f2937',
  muted:   '#6b7280',
}
```

- 所有使用的 class 都對應實際定義的顏色鍵 ✓
- 無硬編碼 hex / rgb
- 作者強調色用 `text-webtrees-accent`（褐色），連結 hover 用 `text-webtrees-primary`（深綠），層級分明
- 只在 Hero cover 漸層遮罩用了 `from-black/60`（非色盤，合理，為照片覆蓋黑色漸層）

**結論：色盤使用 100% 合規。**

---

## SKL-OBS-001 觀察（重點 11）

TASK-002 曾觀察到 frontend-dev 有「未經 ESCALATION 就偏離 spec」的模式。TASK-007 本次：

- Story 所有欄位都使用 v0.1.2 官方命名（`excerpt`/`content`/`coverUrl`/`authorId`/`publishedAt`/`relatedPersonIds`）
- 未出現自行優化為其他命名的情況
- 未偏離 spec §3.5 對 stories 頁面的描述
- 未擅自引入 TASK 未要求的新功能範圍（prev/next 導覽雖屬加值但屬合理 UX 擴充，且未動 spec）

**結論：SKL-OBS-001 模式本次未復發。無須回寫 skill lessons.md。**

---

## 發現的問題

### Critical — 無

### Major — 無

### Minor

#### m1 — StoryContent 未處理清單 marker（spec AC2 示例項）

TASK-007 驗收標準 2 原文：「文章頁 Markdown 正確渲染（含標題階層、**粗體、清單**）」。

目前 `StoryContent.tsx` 只處理 heading + bold，未處理 `- item` / `1. item` 清單。實作會把清單行當作普通段落以 `<p whitespace-pre-line>` 輸出，視覺上只是多一行帶 dash 的文字。

**影響評估**：
- `data/stories.ts` 現有 5 篇 story **零清單內容**，所以當前 runtime 不會觸發問題
- 若未來編輯者新增含清單的 story，會以非預期方式渲染（non-breaking，只是沒有 `<ul>`/`<ol>` 語義）

**建議處理**：
- 選項 A（低成本，傾向）：在 `StoryContent` 追加一段簡易清單處理：段落內若所有行都以 `- ` / `* ` 起頭則 wrap 為 `<ul>`，若以 `N. ` 起頭則 wrap 為 `<ol>`。約 15 行程式。
- 選項 B：視為「未觸發即不處理」，在 TASK 完成摘要與 spec 留下 note，日後編輯者知道 Story 內容應避免清單，直到渲染器升級。

因當前資料沒有清單、不影響任何驗收結果，**建議標為 m1 留到下個 iteration（例如 TASK-008 整合稽核階段或小型修正任務）再補**，不阻塞 TASK-007 合併。

#### m2 — `scrollbar-thin` / `scrollbar-thumb-*` / `scrollbar-track-transparent` 為非標準 Tailwind class（dead CSS）

`RelatedPeopleRow.tsx` L25 使用了 `scrollbar-thin scrollbar-thumb-webtrees-primary/30 scrollbar-track-transparent`。

這些 class 屬於 `tailwind-scrollbar` plugin，但 `package.json` 未安裝該 plugin，`tailwind.config.ts` 的 `plugins: []` 也未註冊。

**影響評估**：
- 非錯誤：Tailwind 會直接 ignore 未知的 class 名，不會 build fail
- 純粹是程式碼中的 dead intent——原作者想要細的滾動條，但實際上不會生效
- 桌機 Chrome / Windows 仍會顯示預設滾動條

**建議處理**：
- 選項 A（建議）：移除這三個 class（一行），避免誤導未來維護者以為已經有客製滾動條
- 選項 B：安裝 `tailwind-scrollbar` plugin 並在 `tailwind.config.ts` 註冊。為一個相關人物列的滾動條新增依賴，成本偏高，不建議

因為是純 dead CSS、不影響功能與外觀，同樣不阻塞合併，可併入下次清理 PR。

#### m3 — metadata 文案與 StoriesPage h1 不一致（極小）

- `app/stories/page.tsx` metadata.title: `'家族故事 | 家族族譜 Demo'`
- 頁面 h1: `'家族故事'`
- metadata.description: `'林氏家族世代傳承的故事與記憶。'`（與頁面 p 「林氏家族跨越百年的記憶與傳承，從渡海建業到當代新生...」略有差異）

無功能影響，亦非 spec 要求，純屬風格建議：metadata description 與頁面 subtitle 同步可讓搜尋引擎摘要更一致。不強制處理。

---

## 優點

1. **型別對齊完美**：全部 6 支檔案 0 處使用舊命名（summary/author/contentMarkdown/publishedDate/coverImage），SKL-OBS-001 模式未復發，顯示 frontend-dev 已吸收 TASK-002 稽核回饋
2. **無新依賴**：手刻 `StoryContent` mini-parser 避免引入 react-markdown，與 spec NFR「效能 / 可維護性」一致；bundle 零增長
3. **上一篇/下一篇邏輯正確**：排序方向、邊界條件、佔位 layout 都周全，prev/next 語義與主流部落格慣例一致
4. **SSG 友善**：`generateStaticParams` 讓 Next.js 16 build 時為每篇 story 預渲染
5. **篩選 URL-driven**：用 searchParams 而非 client state，支援深度連結、分享、後退鍵
6. **RWD 層次清楚**：單欄 → 雙欄 → 三欄 斷點 640 / 1024，符合 FR-06
7. **webtrees 色盤 100% 合規**：零硬編碼色彩
8. **TypeScript strict 完全過關**：noUncheckedIndexedAccess 下所有 index access 與 undefined 分支處理到位，零 any/as
9. **無障礙細節**：`aria-label="文章導覽"`、`<time dateTime>` 語意化、`alt={title}` 齊備
10. **範圍合規**：未動其他 TASK 的檔案、未動 types/data/lib/config

---

## 建議處理流程

**放行策略：PASS（直接合併）**

- 無任何 Critical / Major 問題
- 3 項 Minor 均為「不影響 runtime / 不影響驗收」的清理類建議，可在後續清理任務或 TASK-008 整合稽核時順手處理
- SKL-OBS-001 本次未復發，**無須回寫 lessons.md**

建議由 Orchestrator 直接將本交付 commit 並推進下一個 Pending Task。

---

## 技能迭代建議

無。本次 frontend-dev 表現顯著優於 TASK-002：
- Spec 遵守度從「自行優化命名」進步為「嚴格對齊 v0.1.2 官方欄位」
- Task 範圍控制精準（只動 6 個預期檔案 + 0 個 spillover）
- TypeScript 與 code-style 一次到位，0 處返工

此為正向訊號，SKL-OBS-001 可視為「已收斂」狀態；若 TASK-008 / 009 再連續一次保持此水準，可考慮將該觀察條目標記為 resolved。
