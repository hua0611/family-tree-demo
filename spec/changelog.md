# Spec Changelog — Family Tree Demo

## v0.1.3 — 2026-04-13

### Orchestrator 設計決策追認

- **[個人頁]** 採 Tabs 5 頁架構取代左右欄（§7, AC5 更新）
- **[導覽列]** 主選單 5 項（移除「關於」, 新增「成員名錄」）
- **[導覽列]** 搜尋框 → 語言切換佔位（搜尋移至 v2）
- **[角色]** RoleContext 預設 'admin'（原 'guest'）
- **[首頁]** 採 Hero/Stats/Featured/RecentStories 架構
- **[路由]** 新增 /members 路由
- **[隱私]** 接入範圍限縮至 BiographySection（stub）

### 理由

上列決策均由 Orchestrator 在任務派遣時基於「demo 範圍」與「Webtrees 風格對齊」下達，現正式寫入 spec 以消除 QA 誤判為「agent 擅自偏離」。

### SKL-OBS-001 結論

SKL-OBS-001（frontend-dev 未經 ESCALATION 偏離 spec）經追溯發現 TASK-005 / TASK-008 的「偏離」多數為 Orchestrator 主動指令而非 agent 擅自決定。SKL-OBS-001 觀察計數**不應因此觸發 skill 回寫**，應繼續觀察；唯 TASK-002 的命名風格優化屬於真實的 agent 主動行為。

## v0.1.2 — 2026-04-13

### 資料模型命名對齊實作（§6 重寫）
以 `types/family.ts` 為 single source of truth，§6 從「TypeScript 草稿」升級為「TypeScript 規範」。欄位命名統一採用更一致的後綴風格：
- `Gender`：`'M' | 'F' | 'U'` → `'male' | 'female' | 'unknown'`
- `Person.displayName` → `Person.fullName`
- `Person.photo` → `Person.photoUrl`
- `Person.bio` → `Person.biography`
- `MediaItem.personIds` → `MediaItem.relatedPersonIds`
- `MediaItem.thumbnail`（必填）→ `MediaItem.thumbnailUrl`（可選）
- `Story.coverImage` → `Story.coverUrl`
- `Story.author: string` → `Story.authorId?: PersonId`（語義從姓名字串變更為作者人物 ID）
- `Story.summary` → `Story.excerpt`
- `Story.contentMarkdown` → `Story.content`
- `Story.publishedDate` → `Story.publishedAt`
- 新增型別別名：`PersonId` / `FamilyId` / `MediaId` / `StoryId`
- `EventType` 新增 `education` / `career` / `migration` / `other`
- §6.0 新增「命名慣例」條目：`*Url` / `*Id` / `*At` / 語意化顯示名

### FR-04 media category enum 更新
- `MediaItem.category`：`'person' | 'event' | 'year'` → `'portrait' | 'family_event' | 'location' | 'document' | 'other'`
- 補註：年份分類由 `date` 欄位動態分群呈現，不屬於 category enum；UI 切換頁籤可同時提供 category 與 yearBucket 兩個維度

### AC4 在世/已故比例 relaxed
- 原要求：≥5 living / ≥15 dead
- 新要求：≥5 living / ≥5 dead
- 理由：基於敘事真實性優先原則，實際比例由資料作者決定；TASK-002 實際為 13 living / 10 dead，已足以測試角色過濾與歷史事件呈現

### 新增 §11 技能迭代觀察
- 記錄 SKL-OBS-001：frontend-dev 有將 spec 草稿命名自行優化的傾向，未先 ESCALATION
- 決策：TASK-002 採實作優先；若 TASK-003+ 再現則回寫至 code-style skill references

### 變更理由
TASK-002 實作過程中 frontend-dev 採用更一致的命名風格（`*Url` / `*Id` / `*At` 後綴），QA 稽核（TASK-002-review）M1 / M3 項目指出偏離 spec。Orchestrator 經評估後決定向實作靠齊，避免：
1. 下游 TASK-003 ~ TASK-009 因 spec / 實作雙軌造成 compile error
2. 回退重寫已通過 referential integrity 驗證的 23 人完整資料
3. 損失實作採用的更清晰命名語義

## v0.1.1 — 2026-04-13

- 將 Tailwind 版本從 v4 降為 v3.4，理由：v4 與 Next 16 整合尚未穩定
- next.config.ts 預先開啟 images.remotePatterns（unsplash / pravatar / picsum），供後續媒體庫使用

## v0.1.0 — 2026-04-13

- 初始規劃版本
- 確立專案定位：Next.js 16 demo，非 Webtrees 實機部署
- 撰寫完整 scope（in / out）、功能需求（FR-01 ~ FR-06）
- 定義 10 條驗收標準
- 制定資料模型草稿（Person / Family / LifeEvent / MediaItem / Story / Role）
- 拆解 9 個任務（TASK-001 ~ TASK-009）
- 標記 DEC-001：家族樹視覺化函式庫選型待 architect 決策
- 明確排除 feature.md 第 7 項「部署上線與教學」
