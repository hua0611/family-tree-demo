# Family Tree Demo — 家族族譜 Webtrees 風格 Demo

> 以 Next.js 16 + TypeScript + Tailwind CSS 打造的家族族譜 demo 網站，模擬 Webtrees 的 UI/UX 體驗，使用假資料完整呈現家族樹、人物頁、媒體庫與家族故事。

## 專案定位

- **類型**：前端靜態 Demo（假資料驅動）
- **靈感來源**：[wt-malkins 網站](https://wt-malkins.alineofmalkins.com/tree/wtmalkins)（Webtrees 實際部署案例）
- **原始需求**：`D:/family_tree/forge-internal-master/feature.md`
- **調整後範圍**：不部署 Webtrees 本體，改以 Next.js 重現其核心視覺與互動

## 技術棧

| 類別 | 選用 |
|------|------|
| Framework | Next.js 16（App Router） |
| Language | TypeScript（strict + noUncheckedIndexedAccess） |
| Styling | Tailwind CSS 3.4 + 自訂 Webtrees 風格主題（18 色 token） |
| 視覺化 | `d3-hierarchy` + `d3-shape` + `d3-zoom` + `react-zoom-pan-pinch` + 純 SVG（ADR-001） |
| 資料 | `/data/family.ts` 型別化假資料（23 人 / 9 家庭 / 5 代 / 25 媒體 / 5 故事） |
| 狀態 | React context（角色切換：管理員 / 編輯者 / 訪客，預設 admin） |
| i18n | 預設繁體中文（zh-Hant） |

## 核心功能

1. 互動式家族樹（祖先圖 / 後代圖 / 扇形圖 / 沙漏圖）
2. 人物個人頁（基本資料、照片、事件時間軸、家庭關係）
3. 媒體庫相簿（網格瀏覽）
4. 家族 Stories 列表與文章頁
5. 全站導覽列 + 響應式設計
6. 前端模擬的角色切換（不涉及真實認證）

## 進度

| 階段 | 狀態 |
|------|------|
| 需求 Intake | ✅ 完成 |
| Spec 規劃（v0.1.0 → v0.1.3） | ✅ 完成 |
| 任務拆解 | ✅ 完成（9 個 tasks） |
| 技術選型 DEC-001 | ✅ Resolved（ADR-001） |
| Forge Loop 執行 | ✅ 完成 |

### 任務交付狀況

| Task | 內容 | QA Verdict |
|------|------|-----------|
| TASK-001 | Next.js 16 腳手架 + Tailwind + d3 依賴 | ✅ PASS（1 輪修正） |
| TASK-002 | 型別 + 假資料（23 人 / 5 代） | ✅ PASS_WITH_NOTES |
| TASK-003 | 祖先圖 + 後代圖（d3-hierarchy） | ✅ PASS_WITH_NOTES |
| TASK-004 | 扇形圖 + 沙漏圖 | ✅ PASS_WITH_NOTES |
| TASK-005 | 個人頁（Tabs 5 頁架構） | ✅ PASS（1 輪修正） |
| TASK-006 | 媒體庫 + Lightbox | ✅ PASS（1 輪修正） |
| TASK-007 | Stories 列表與文章頁 | ✅ PASS |
| TASK-008 | SiteHeader + 首頁 + RoleSwitcher | ✅ PASS（1 輪修正） |
| TASK-009 | Webtrees 風格主題 CSS | ✅ PASS |

### 頁面路由

- `/` — 首頁（Hero / Stats / Featured / RecentStories）
- `/tree/[id]?view=pedigree|descendants|fan|hourglass` — 四種家族樹視覺化
- `/person/[id]?tab=overview|events|family|media|stories` — 個人頁 Tabs
- `/members` — 成員名錄（分「在世」/「已故」）
- `/media?category=&person=&year=&lightbox=` — 媒體庫（3 維篩選 + Lightbox）
- `/media/[id]` — 媒體詳細頁
- `/stories?tag=&person=` — 家族故事列表
- `/stories/[id]` — 故事文章頁

詳細任務清單見 `project.json`，規格見 `spec/current.md`，變更歷史見 `spec/changelog.md`。

## 目錄結構

```
projects/family-tree-demo/
├── README.md              # 本檔
├── project.json           # 狀態機與任務清單
├── spec/
│   ├── current.md         # OpenSpec 規格
│   └── changelog.md       # 版本紀錄
├── tasks/                 # 個別任務單
│   ├── TASK-001.md
│   ├── TASK-002.md
│   └── ...
└── sessions/              # 對話摘要（由 Orchestrator 寫入）
```

## 不在範圍內

- 真實登入 / 認證系統（OAuth、Session、JWT）
- 真實檔案上傳 / 後端儲存
- 資料庫與 API 串接
- 正式部署、DNS、SSL 設定
- feature.md 第 7 項「部署上線與教學」

## 本地執行（交付後）

```bash
cd D:/family_tree/forge-internal-master/projects/family-tree-demo
npm install
npm run dev
```

開啟 `http://localhost:3000`。

> ⚠️ Forge Loop 不執行 `npm install`；首次執行前請手動安裝依賴。
