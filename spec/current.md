# Spec — Family Tree Demo

- Version: v0.1.3
- Date: 2026-04-13
- Status: planning_complete
- Format: OpenSpec

## 1. 專案概述

本專案為「家族族譜網站」的 **前端 Demo 版本**，採用 Next.js 16 + TypeScript + Tailwind CSS 3.4（v4 穩定後升級）實作。參考網站 [wt-malkins](https://wt-malkins.alineofmalkins.com/tree/wtmalkins) 為 Webtrees 的實際部署案例，Demo 將模仿其 UI/UX 風格與資訊架構，但 **不實際部署 Webtrees**，全站資料皆由靜態假資料提供。

原始需求（`feature.md`）選定 Webtrees 2.x（PHP + MySQL）作為部署方案，本次調整為 Next.js demo 以快速呈現體驗。

## 2. 範圍（Scope）

### 2.1 In Scope

- 互動式家族樹視覺化（祖先圖 Pedigree、後代圖 Descendants、扇形圖 Fan、沙漏圖 Hourglass）
- 人物個人頁（姓名、生卒日、地點、照片、事件時間軸、家庭關係）
- 媒體庫（依人物 / 事件分類的相簿網格）
- 家族 Stories（圖文故事列表與文章頁）
- Webtrees 風格深綠主題（深綠 Header + 淺色內容）
- RWD 響應式（桌機 / 平板 / 手機）
- 繁體中文（zh-Hant）為主要語系
- 前端角色切換器（管理員 / 編輯者 / 訪客）— 僅模擬 UI 差異，不做真實認證
- 約 20 位家族成員、4 代以上親屬關係的假資料

### 2.2 Out of Scope

- 真實登入 / OAuth / JWT / Session
- 真實檔案上傳、後端儲存、資料庫
- 後端 API 與 SSR 資料串接
- 正式部署、DNS、SSL 憑證（`feature.md` 第 7 項）
- 完整多語系實作（預留 i18n 結構即可）
- GEDCOM 檔案匯入 / 匯出

## 3. 功能需求（對應 feature.md 六大覆蓋需求）

### 3.1 FR-01 互動式家族樹
- 支援從任一人物切換為根節點
- 提供四種圖表：Pedigree（祖先圖）、Descendants（後代圖）、Fan（扇形圖）、Hourglass（沙漏圖）
- 節點可點擊 → 跳轉至人物個人頁
- 圖表於手機可縮放（pinch / wheel zoom）

### 3.2 FR-02 人物照片與基本資料
- 個人頁顯示：姓名、性別、生卒日期、出生地、卒地、頭像
- 事件時間軸（出生、婚姻、子女、死亡、其他自訂事件）
- 家庭關係區塊：父母、配偶、子女、兄弟姊妹

### 3.3 FR-03 用戶角色（前端模擬）
- 頂部工具列提供角色切換下拉選單
- 管理員：可見所有資料（包含在世人物）
- 編輯者：可見大部分資料但隱藏部分隱私欄位
- 訪客：僅可見已故人物的公開資訊
- 切換後頁面即時反映可見範圍差異
- 無密碼、無 session，純 context state
- **預設角色**：`'admin'`（自 v0.1.3 起）。理由：demo 第一次進站應看到完整資料，若預設 `'guest'` 會隱藏敏感欄位造成第一印象差。訪客角色仍可透過 `RoleSwitcher` 手動切換以測試隱私邏輯。
- **demo 階段隱私邏輯接入範圍（v0.1.3）**：`sanitizePersonForRole` 已實作於 helpers 層，但個人頁僅在 `BiographySection` 等敏感區塊接入 role gate（stub：單一 client-side gate by `useRole`），其餘欄位（姓名、生卒日期、地點、家庭關係、事件等）保留全可見。完整欄位級遮蔽保留 TODO 供未來擴充。

### 3.4 FR-04 家族相簿
- `/media` 相簿網格頁
- `MediaItem.category` 採用實作 enum：`'portrait' | 'family_event' | 'location' | 'document' | 'other'`
- 點擊圖片開啟 Lightbox 檢視

> 註：年份分類由 `date` 欄位動態分群呈現，不屬於 category enum。UI 切換頁籤可同時提供 category（人物/事件/地點/文件）與 yearBucket（依 `date` 計算的年代分桶）兩個維度。

### 3.5 FR-05 家族 Stories
- `/stories` 列表頁（卡片 + 封面）
- `/stories/[id]` 文章頁（Markdown 渲染 / 或預先寫好的 JSX 內容）
- 每篇 story 可關聯一位家族成員

### 3.6 FR-06 RWD
- 導覽列於手機折疊為 hamburger
- 家族樹圖表在 <768px 支援水平拖曳瀏覽
- 媒體庫網格自動由 4 欄調整為 2 欄 / 1 欄

## 4. 非功能需求

- **型別安全**：TypeScript strict 模式，所有資料均有明確 interface
- **效能**：首頁首次載入 < 3s（本機開發模式），靜態生成（SSG）家族成員頁
- **可維護性**：元件切分清楚，資料層與 UI 層分離（`/data` vs `/components`）
- **無障礙**：使用語意化 HTML、alt 文字、鍵盤可操作

## 5. 資訊架構（頁面路由）

| 路由 | 說明 | 角色可見性 |
|------|------|-----------|
| `/` | 首頁（Hero / Stats / Featured / RecentStories） | All |
| `/tree/[id]` | 家族樹（預設祖先圖） | All |
| `/tree/[id]/fan` | 扇形圖 | All |
| `/tree/[id]/hourglass` | 沙漏圖 | All |
| `/members` | 成員名錄（分「在世」/「已故」兩組） | 依角色過濾在世人物 |
| `/person/[id]` | 人物個人頁（Tabs: Overview/Events/Family/Media/Stories） | 依角色過濾敏感區塊 |
| `/media` | 媒體庫列表 | All |
| `/media/[id]` | 單筆媒體詳細 | All |
| `/stories` | Stories 列表 | All |
| `/stories/[id]` | Story 文章頁 | All |

> 註（v0.1.3）：原 `/about` 路由已自路由表移除，demo 範圍不含 about 頁面。`/members` 為 v0.1.3 新增之合法路由，作為主導覽列「成員名錄」項目的對應頁。

## 6. 資料模型（TypeScript 規範）

> 本章節以 `types/family.ts` 為 **single source of truth**。自 v0.1.2 起採用實作優先原則：欄位命名與型別皆以 `types/family.ts` 為準。未來任何 data/ UI/ helpers 變更必須對齊本章節，若需調整命名必須以 `##ESCALATION` 請求更新此 spec 後再動工。

```typescript
// types/family.ts

export type PersonId = string
export type FamilyId = string
export type MediaId = string
export type StoryId = string

export type Gender = 'male' | 'female' | 'unknown'

export type Role = 'admin' | 'editor' | 'guest'

export type EventType =
  | 'birth'
  | 'death'
  | 'marriage'
  | 'divorce'
  | 'baptism'
  | 'graduation'
  | 'immigration'
  | 'education'
  | 'career'
  | 'migration'
  | 'custom'
  | 'other'

export interface LifeEvent {
  id: string
  type: EventType
  date: string // ISO-ish, accepts '1945', '1945-03', '1945-03-12'
  place?: string
  description?: string
}

export interface Person {
  id: PersonId
  givenName: string       // 名
  surname: string         // 姓
  fullName: string        // 完整顯示名（含別名等）
  gender: Gender
  birthDate?: string
  birthPlace?: string
  deathDate?: string      // 若健在則 undefined
  deathPlace?: string
  isLiving: boolean
  photoUrl?: string       // placeholder 照片
  biography?: string      // 1-3 段傳記
  events: LifeEvent[]
  parentFamilyId?: FamilyId     // 出生所屬家庭
  spouseFamilyIds: FamilyId[]   // 婚姻家庭（可多個）
  tags?: string[]               // 例如 '長子' '族長'
}

export interface Family {
  id: FamilyId
  husbandId?: PersonId
  wifeId?: PersonId
  marriageDate?: string
  marriagePlace?: string
  divorceDate?: string
  childrenIds: PersonId[]
}

export interface MediaItem {
  id: MediaId
  title: string
  url: string              // placeholder 圖片 URL
  thumbnailUrl?: string
  category: 'portrait' | 'family_event' | 'location' | 'document' | 'other'
  type: 'photo' | 'document'
  date?: string
  description?: string
  relatedPersonIds: PersonId[]
  relatedFamilyIds?: FamilyId[]
  tags: string[]
}

export interface Story {
  id: StoryId
  title: string
  excerpt: string          // 摘要 1-2 句
  content: string          // Markdown 或純文字，3-8 段
  coverUrl?: string
  publishedAt: string      // ISO date
  authorId?: PersonId      // 作者可以是家族成員
  relatedPersonIds: PersonId[]
  tags?: string[]
}
```

### 6.0 命名慣例

- URL 類欄位一律使用 `*Url` 後綴：`photoUrl`、`thumbnailUrl`、`coverUrl`
- ID 類欄位一律使用 `*Id` / `*Ids` 後綴：`authorId`、`relatedPersonIds`
- 時間戳欄位使用 `*At` 後綴（ISO date）：`publishedAt`
- 純顯示欄位使用語意化名：`fullName`（取代 `displayName`）、`biography`（取代 `bio`）、`excerpt`（取代 `summary`）、`content`（取代 `contentMarkdown`）

### 6.1 假資料規模

- **人物**：~20 人，跨 4 代以上（曾祖父母 → 祖父母 → 父母 → 本代 → 子女）
- **家庭**：~8 個（配偶關係）
- **媒體**：~25 筆 placeholder 圖片
- **Stories**：~5 篇
- 資料必須足以讓 Pedigree / Descendants / Fan / Hourglass 四種圖表從不同成員為根節點時都能正確渲染

## 7. UI/UX 參考（Webtrees 風格）

參考 [wt-malkins.alineofmalkins.com](https://wt-malkins.alineofmalkins.com/tree/wtmalkins)：

- **色系**：深綠 (#2d5016 ~ #4a7c2e) 作為 Header / 導覽列主色，搭配米白 / 淺灰內容區
- **字體**：中文使用 Noto Sans TC，英文使用 sans-serif
- **Header**：水平導覽列含 Logo + 主選單 5 項（**首頁 / 家族樹 / 成員名錄 / 相簿 / 故事**）。右側為語言切換佔位按鈕（disabled `繁|EN`）+ 角色切換下拉。
  - 註（v0.1.3）：原規劃的 6 項（首頁/家族樹/人物/媒體/Stories/關於）已縮減為 5 項，移除「關於」、改以更貼近 demo 語境的 label（人物→成員名錄、媒體→相簿、Stories→故事）。
  - 註（v0.1.3）：原規劃的「全站搜尋框」改為 disabled 的語言切換按鈕佔位；搜尋功能需 index 建構，不在 demo 範圍，標記為 **v2 功能**。
- **家族樹節點**：圓角矩形卡片，男性藍色邊、女性粉色邊、未知灰色邊；顯示照片 + 姓名 + 生卒年
- **首頁**：自 v0.1.3 起採 4 區塊結構：
  1. **HeroSection**：家族名稱、slogan、主要 CTA（進入家族樹）
  2. **StatsRow**（4 卡）：成員數、世代數、媒體數、故事數
  3. **FeaturedMembers**：精選家族成員照片格
  4. **RecentStories**：最近發布的 3 篇 stories 預覽
  - 理由：更接近 Webtrees 官方首頁與現代家族樹網站風格；`SiteHeader` 已包含主要路由入口，首頁不需重複「快速入口卡片」。
- **個人頁**：自 v0.1.3 起採 **Tabs 架構**（而非原左右欄設計）：
  - 5 個頁籤：**Overview / Events / Family / Media / Stories**
  - 以 URL `searchParams`（如 `?tab=events`）控制當前頁籤，支援深連結與瀏覽器返回
  - Tabs 在手機上天然堆疊，不需要額外 RWD 處理
  - 理由：Webtrees 個人頁本來就是 tabs（Facts/Family/Sources/Notes/Media）；Tabs 更容易容納 5 種內容分類
- **媒體庫**：網格縮圖 + hover 顯示標題
- **麵包屑**：所有子頁面右上角顯示麵包屑
- **頁尾**：簡單版權字與「此為 Demo 網站」浮水印

### 7.1 個人頁資訊架構（Tabs 5 頁）

| Tab | URL | 內容 |
|-----|-----|------|
| Overview | `?tab=overview`（預設） | 姓名、性別、生卒日期/地點、頭像、`BiographySection`（接 role gate） |
| Events | `?tab=events` | `LifeEvent[]` 時間軸（出生、婚姻、子女、死亡、其他） |
| Family | `?tab=family` | 父母、配偶、子女、兄弟姊妹關係卡片 |
| Media | `?tab=media` | 以 `relatedPersonIds` 過濾的媒體縮圖格 |
| Stories | `?tab=stories` | 以 `relatedPersonIds` 過濾的故事列表 |

## 8. 技術決策

### DEC-001 家族樹視覺化函式庫（Resolved 2026-04-13）
- **狀態**：Accepted
- **選定方案**：`d3-hierarchy` + `d3-shape` + `d3-zoom` + 純 SVG React 元件（手刻）
- **輔助套件**：`react-zoom-pan-pinch`（縮放 / 平移層）
- **決策文件**：[`docs/adr/ADR-001-tree-visualization.md`](../docs/adr/ADR-001-tree-visualization.md)
- **選擇理由摘要**：
  - 單一 `d3.tree()` 心智模型即可撐起 Pedigree / Descendants / Fan / Hourglass 四種佈局
  - TypeScript 型別透過 `HierarchyPointNode<TreeDatum>` 完整泛型化
  - Bundle size 最小（d3 子模組 tree-shakable，合計約 25-35 KB gzip）
  - 節點為 React JSX `<g>` / `<foreignObject>`，可直接套用 Tailwind + Next/Image
  - 佈局計算為純函數，Next.js 16 RSC 友善
- **影響任務**：TASK-003（祖先圖 + 後代圖）、TASK-004（扇形圖 + 沙漏圖）
- **被排除的方案**：
  - `react-d3-tree`：不支援 Fan / Hourglass，會被迫混搭兩套函式庫
  - `dagre-d3`：DAG 導向，不符合對稱美學
  - `vis-network`：Canvas 渲染，無法使用 React JSX 節點；bundle 過重

## 9. 驗收標準

1. 首頁可見家族簡介、主要成員照片、快速入口（家族樹 / 媒體 / Stories）
2. 家族樹頁面至少支援祖先圖與後代圖，可從任意成員為根切換
3. 從節點點擊可進入對應人物個人頁
4. 人物個人頁顯示基本資料、照片、至少 3 筆事件、父母與子女關係；假資料至少包含 5 位在世（用以測試隱私過濾）、至少 5 位已故（用以測試歷史事件呈現）——基於敘事真實性優先原則，實際比例由資料作者決定
5. 媒體庫網格至少 20 筆，可切換分類並可開啟 Lightbox
6. Stories 列表至少 3 篇，文章頁可正常渲染內容
7. 角色切換下拉選單可切換 3 種角色，切換後在世人物可見性有變化
8. 手機瀏覽器（< 768px）下導覽列摺疊、家族樹可縮放、媒體網格為 2 欄
9. 所有頁面無 TypeScript 編譯錯誤、無 Tailwind 樣式遺漏
10. 視覺風格與 wt-malkins 參考站相似度 > 70%（深綠 Header、卡片式節點、米白內容區）

## 10. 與 feature.md 的對應關係

| feature.md 工作項目 | 本 Demo 對應處理 |
|---------------------|------------------|
| 1. 環境建置與安裝 | 改為 Next.js 專案腳手架（TASK-001） |
| 2. 語系與在地化 | 介面預設繁中，預留 i18n（TASK-001 / 008） |
| 3. 外觀客製化 | Webtrees 風格 CSS 主題（TASK-009） |
| 4. 模組啟用與設定 | 對應各功能元件與頁面（TASK-003~007） |
| 5. 初始資料建檔 | 假資料與型別（TASK-002） |
| 6. 測試與修正 | 由 QA agent 在各 task 完成後稽核 |
| 7. 部署上線與教學 | **不在 demo 範圍內** |

## 11. 技能迭代觀察（Skill Iteration Notes）

> 本章節記錄 QA 在稽核過程中觀察到的 agent 行為模式，供後續決定是否回寫 skill references。

### SKL-OBS-001（TASK-002 → v0.1.2）
- **觀察**：frontend-dev 在資料層實作時，有將 spec 草稿命名自行優化的傾向（採用 `*Url` / `*Id` / `*At` 後綴、`fullName`、`excerpt` 等更一致的風格），但未先以 `##ESCALATION` 請求修改 spec。
- **決策**：TASK-002 採取實作優先原則，spec v0.1.2 改向實作靠齊（見 changelog）。此次不懲罰，僅記錄。
- **後續條件**：若 TASK-003 以後再現類似「未經 ESCALATION 就偏離 spec」的模式，則回寫至 `.claude/skills/code-style/references/lessons.md`，並在 frontend-dev agent definition 追加條目：「即便 spec 標為草稿，若驗收標準引用該章節，仍須按 spec 命名或先行 ESCALATION 請求變更。」
- **相關項目**：QA TASK-002-review M1 / M3

### SKL-OBS-001 追溯與結論（v0.1.3）
- **背景**：QA 於 TASK-008-review 中指出四項「frontend-dev 未經 ESCALATION 偏離 spec」的證據（主選單 6→5 項、搜尋框 → 語言切換、首頁快速入口卡片 → StatsRow+FeaturedMembers、新增 `/members` 路由），並建議觸發 SKL-OBS-001 後續回寫條件。
- **追溯**：Orchestrator 經核對任務派遣紀錄後確認，上述四項偏離**均為 Orchestrator 在任務派遣時主動下達的指令**，而非 frontend-dev 擅自決定。理由如 v0.1.3 changelog 所述（demo 範圍對齊、Webtrees 風格對齊、SiteHeader 已含主要入口等）。TASK-005 的個人頁 Tabs 架構同屬此類。
- **結論**：SKL-OBS-001 觀察計數**不因 TASK-005 / TASK-008 觸發 skill 回寫**，應繼續觀察。唯一真實命中的仍為 TASK-002 的命名風格優化（屬 agent 主動行為），計數維持 1。
- **制度反省**：本次 QA 誤判凸顯一個流程缺陷——Orchestrator 在任務派遣時下達的「微調指令」未即時寫入 spec，導致 QA 僅能以 spec 為基準判讀，誤認為 agent 擅自偏離。v0.1.3 起，凡 Orchestrator 下達超出 spec 範圍的設計指令，應在派遣同時或 task 完成後立即回寫 spec（即本次 v0.1.3 的動作）。
