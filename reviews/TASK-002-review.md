# TASK-002 稽核報告 — 假資料與 TypeScript 型別定義

- Reviewer: QA Agent
- Date: 2026-04-13
- Task: TASK-002
- Verdict: **PASS_WITH_NOTES**（建議後續任務修正，但不阻塞 TASK-003 啟動）

---

## 總覽

Agent 交付了 5 支檔案，合計 1,462 行：

| 檔案 | 行數 | 狀態 |
|---|---|---|
| `types/family.ts` | 88 | OK（與 spec 欄位命名不一致，見問題 M1） |
| `data/family.ts` | 681 | OK（在世/已故比例未達標，見 M2） |
| `data/media.ts` | 328 | OK（category enum 偏離 spec，見 M3） |
| `data/stories.ts` | 182 | OK（Story 欄位命名偏離 spec，見 M1） |
| `lib/family-helpers.ts` | 271 | OK（`getPersonById` 被更名為 `getPerson`，見 m4） |

範圍合規：agent 未碰 TASK-001 檔案（app/、package.json、tsconfig.json、tailwind.config.ts、next.config.ts、postcss.config.mjs），OK。

---

## 驗收標準對照表

| # | 標準 | 結果 | 備註 |
|---|---|---|---|
| 1 | `types/family.ts` 匯出 spec §6 所有 interface，TS strict 編譯無錯 | WARN | 所有 interface 都存在、名稱正確，strict / `noUncheckedIndexedAccess` 相容；但多處欄位命名偏離 spec §6 草稿（見 M1） |
| 2 | ≥20 Person，跨 ≥4 代，樹結構連通 | PASS | 23 Person、5 代、referential integrity 完整，無孤島 |
| 3 | `getAncestors` / `getDescendants` 對任一節點正確 | PASS | 遞迴邏輯正確；帶 `generations` 參數支援深度限制 |
| 4 | 至少 5 位在世 / 15 位已故 | **FAIL** | 實際為 13 位在世 / 10 位已故（見 M2） |
| 5 | placeholder 圖片使用一致 seed 策略可穩定重現 | PASS | `picsum.photos/seed/{lin*}/...` 一致；人物照使用 `i.pravatar.cc/300?img={n}` 也可重現 |

補充鑑別：
- helpers 函式齊全：getPerson / getFamily / getParents / getChildren / getSpouses / getSiblings / getAncestors / getDescendants / getEventsByYear / formatDateRange / getAge / isVisibleToRole / sanitizePersonForRole（全數到位）
- 代碼風格：2 spaces / single quotes / no semicolons 合規
- Import 排序符合規範

---

## Referential Integrity 檢查

以下三組都完全通過（無懸空 ID）：

### Persons ↔ Families
- 所有 `Person.parentFamilyId`（8 個非 undefined 值）都在 `families` 中存在：f-001, f-002(x3), f-003, f-004(x2), f-005, f-006, f-007, f-008(x2) ✓
- 所有 `Person.spouseFamilyIds` 項目（共 15 筆）都在 `families` 中存在 ✓
- 所有 `Family.husbandId` / `Family.wifeId` / `Family.childrenIds` 都指向存在的 Person ✓

雙向一致性抽查：
- f-001 children [p-003, p-005] ↔ p-003.parent=f-001, p-005.parent=f-001 ✓
- f-002 children [p-007, p-009, p-011] ↔ 三人 parent 都是 f-002 ✓
- f-004 children [p-015, p-017] ↔ 兩人 parent 都是 f-004 ✓
- f-008 children [p-022, p-023] ↔ 兩人 parent 都是 f-008 ✓
- f-006 妻子 p-011 ↔ p-011.spouseFamilyIds 含 f-006 ✓
- f-007 丈夫 p-013 ↔ p-013.spouseFamilyIds 含 f-007 ✓

### Media ↔ Persons
25 筆 MediaItem，合計 59 個 `relatedPersonIds` 項目，全部命中 persons。抽檢範例：
- m-007 [p-001..p-006] ✓
- m-011 [p-015, p-016, p-017, p-018, p-022, p-023] ✓
- m-025 [p-022, p-008] ✓

relatedFamilyIds 亦全數命中（11 筆媒體使用之，皆有效）。

### Stories ↔ Persons
- s-001 [p-001, p-002] ✓
- s-002 [p-003, p-004, p-007] ✓
- s-003 [p-005, p-006, p-013] ✓
- s-004 [p-017, p-007, p-008, p-015] ✓
- s-005 [p-008, p-010, p-007, p-009] ✓

Story.authorId：s-001=p-007, s-002=p-015, s-003=p-020, s-004=p-017, s-005=p-015，皆有效。

### isLiving vs deathDate 一致性
- 10 位 `isLiving: false` 皆有 `deathDate` ✓
- 13 位 `isLiving: true` 皆無 `deathDate`（或顯式為 undefined）✓

**結論：Referential integrity 零錯誤。**

---

## 型別安全 / noUncheckedIndexedAccess 檢查

tsconfig 啟用 `strict` 與 `noUncheckedIndexedAccess`。逐一審查：

- `getPerson` / `getFamily`：直接回傳 `Record` 存取結果，型別為 `Person | undefined` / `Family | undefined`，呼叫端各處均正確 narrow ✓
- `getParents` / `getChildren` / `getSpouses` / `getSiblings`：所有 `persons[id]` / `families[id]` 存取後都有 `=== undefined` 檢查 ✓
- `getAncestors` / `getDescendants`：遞迴呼叫都使用已 narrow 的 `parent.id` / `child.id` ✓
- `extractYear`：`match[1]` 在 `noUncheckedIndexedAccess` 下型別為 `string | undefined`，函式回傳型別亦為 `string | undefined`，相容 ✓
- `getAge`：使用 `String.prototype.slice()`（非 index access），且對 month/day 空字串有 fallback 處理 ✓
- `getEventsByYear`：對 `a.date.padEnd(10, '-01')` 的處理正確（string method）✓
- 零處 `any` / `as` 斷言 ✓

**結論：完全相容 strict + noUncheckedIndexedAccess。**

---

## 發現的問題

### Critical — 無

### Major

#### M1 — types/family.ts 欄位命名與 spec §6 草稿不一致（偏離驗收標準 1）
Spec §6 雖標註「TypeScript 草稿」，但 TASK-002 驗收標準第 1 條明文要求「匯出 spec §6 定義的 interface」。實際偏離項目：

| 欄位 | spec §6 | 實作 |
|---|---|---|
| `Gender` | `'M' \| 'F' \| 'U'` | `'male' \| 'female' \| 'unknown'` |
| `Person.displayName` | `displayName` | `fullName` |
| `Person.photo` | `photo` | `photoUrl` |
| `Person.bio` | `bio` | `biography` |
| `MediaItem.thumbnail` | `thumbnail`（必填）| `thumbnailUrl`（可選）|
| `MediaItem.personIds` | `personIds` | `relatedPersonIds` |
| `Story.coverImage` | `coverImage` | `coverUrl` |
| `Story.author` | `author: string` | `authorId?: PersonId`（語義變更）|
| `Story.summary` | `summary` | `excerpt` |
| `Story.contentMarkdown` | `contentMarkdown` | `content` |
| `Story.publishedDate` | `publishedDate` | `publishedAt` |

影響：
- 後續 TASK-003~007（樹圖、個人頁、媒體庫、Stories 頁）會按 spec 預期來讀欄位，若直接讀 `person.displayName` / `story.summary` 將 compile error。
- 可能違反驗收標準 1 的嚴格解讀。

建議處理：
- **選項 A（傾向）**：於 TASK-003 啟動前請 frontend-dev 回歸 spec §6 命名，統一專案以 spec §6 為準。
- **選項 B**：若要保留 agent 的命名風格（語義更明確），則必須同步更新 spec §6 文件，避免未來 agent 依 spec 寫 code 出錯。無論選哪一個，目前不可讓兩者共存。

#### M2 — 在世/已故比例未達驗收標準 4
- 要求：≥5 living / **≥15 dead**
- 實際：13 living / **10 dead**

差 5 位已故人物。此標準是為了「讓角色過濾測試」有足夠已故樣本，但在世樣本數充足也能測試過濾功能。

建議處理：
- 若要嚴格符合 AC4：新增 5 位已故祖輩/旁系（例如林文雄/林文成的父執輩兄弟、旁支配偶的父母等），或將部分高齡在世成員（p-008 王淑華 1952年生、p-012 鄭俊傑 1950年生、p-014 張麗雲 1957年生）改為已故（需同步調整 bio/事件）。
- 或降級：在 PM / Orchestrator 決策下 relax AC4，理由是 13 位在世樣本對 role filter 測試已綽綽有餘。建議在此情況下於 project.json 的 preference_overrides 或 spec 變更記錄中留下決策軌跡。

#### M3 — MediaItem.category enum 偏離 FR-04 的「人物 / 事件 / 年份」語義
- spec §6 草稿：`'person' | 'event' | 'year'`
- 實作：`'portrait' | 'family_event' | 'location' | 'document' | 'other'`
- FR-04 明文：「支援依『人物 / 事件 / 年份』切換分類」

目前的 `location` / `document` / `other` 類別無法對應到「年份分類」。媒體庫頁面將需要額外以 `date` 欄位來做年份分組，且 category 無法做為 filter 直接對應 UI 三個切換頁籤。

建議處理：
- 新增 `yearBucket` / `decade` 或保留 category 但另外以 `date` 計算年份桶；
- 或直接將 category 改回 spec 定義，MediaItem 可額外用 `tags` 表達 portrait / location 等細分類。

### Minor

#### m4 — helper 函式 `getPersonById` 被更名為 `getPerson`
TASK-002 第 5 項明確列名 `getPersonById(id)`，實作為 `getPerson(id)`。雖語義相同，但呼叫方會依任務描述尋找原名函式。建議加一個 `export const getPersonById = getPerson` alias 以維持向後相容。

#### m5 — p-019 surname/fullName 表意不一致
`p-019` surname 標為 `'林'` 但 fullName 為 `'鄭俊宏（林俊宏）'`。看 biography 理解為「隨母姓改名」，敘事合理，但 surname 欄位若代表「當前姓氏」應為「鄭」、若代表「宗族姓氏」應為「林」；目前的選擇沒有錯，但會讓後續 UI（例如節點卡片顯示）的決策變得不明確。建議在 types 或 spec 備註對 surname 的定義。

#### m6 — 部分 Person 缺 biography / photoUrl
- p-009 無 `biography`
- p-012 無 `biography`
- p-014 無 `biography`
- p-019 surname 問題如上
- p-021 無 `photoUrl` 且無 `biography`
- p-022, p-023 無 `biography`

欄位皆為 optional，不影響 type 檢查，但個人頁（TASK-006）對這些人會出現資料留白。建議小幅補齊，至少給每人一張 placeholder photo。

#### m7 — `sanitizePersonForRole` 對 guest 的處理不完整
函式在 guest 分支直接回傳 `person`，註解寫「guest 會被 isVisibleToRole 先過濾」。雖然按目前流程 OK，但若呼叫端忘了先 filter，guest 將看到完整資料。建議對 guest 也進行 editor 同級的欄位隱藏（fail-safe 原則）。

---

## 優點

1. 家族樹結構設計精良：
   - 5 代縱深、兩支（台北支 + 台中支）並行、同世代有兄妹/配偶/旁系
   - 足以壓測 Pedigree / Descendants / Fan / Hourglass 四種圖表從多個根節點渲染
2. LifeEvent 事件數豐富：p-001..p-007 每人 4-6 筆事件，符合「每人 2-5 筆」甚至超出
3. Stories 品質高：markdown 內容具備篇章結構（## 標題），對 TASK-007 的 renderer 測試友善
4. helpers 設計超出任務要求：額外提供 `getSiblings` / `getEventsByYear` / `formatDateRange` / `getAge` / `sanitizePersonForRole`
5. 型別安全完全相容 `noUncheckedIndexedAccess`，零 `any` / `as`
6. 代碼風格 100% 合規

---

## 建議處理流程

**放行策略：PASS_WITH_NOTES**
- M2（在世/已故比例）雖是 AC4 明確違反，但不影響下游任務可執行性。建議由 PM 在 TASK-003 開始前做一次小型修正任務（可打包進 TASK-006 個人頁實作的「資料補強」子任務）。
- M1（欄位命名偏離 spec）對下游 compile 會有直接影響，**必須於 TASK-003 啟動前處理**。建議 Orchestrator 派一個微型任務：
  - 選項 A：請 frontend-dev 將 types/family.ts 與所有 data/*.ts 回歸 spec §6 命名
  - 選項 B：更新 spec §6 並標註 spec-as-source-of-truth 變更
- M3（MediaItem.category enum）可與 M1 一併處理。
- Minor 項目可在 TASK-006 / TASK-007 實作時順手補齊。

---

## 技能迭代建議

此為 frontend-dev agent 首次交付資料層。觀察到的模式：
1. **Spec 遵守度不足**：在「spec 標為草稿」的情況下傾向自行優化命名，未先詢問或未在摘要中明示 deviation。
   → 建議在 `.claude/skills/` 的相關 skill（若有 `spec-compliance` 或 `data-modeling`）追加條目：「即便 spec 標註『草稿』，TASK 驗收標準若引用該章節，仍須嚴格按 spec 命名；若有更好建議，應以 `##ESCALATION` 標記請求變更 spec，而非直接偏離。」
2. **AC 數值標準檢核遺漏**：AC4（5 living / 15 dead）是清晰的數值門檻，但 agent 未自檢。
   → 建議在 frontend-dev agent 的 definition（或 QA checklist skill）追加一條：「交付資料集前，必須在完成摘要中逐項列出數值 AC 的實際值 vs 目標值」。

第一次出現，本次僅在稽核報告記錄；若 TASK-003 再現類似問題，則回寫 skill references/lessons.md。
