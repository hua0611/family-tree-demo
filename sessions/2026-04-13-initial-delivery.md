# Session 2026-04-13 — Family Tree Demo 初始交付

## 需求來源
- `feature.md`（原為 Webtrees PHP 部署案）
- 參考網站：https://wt-malkins.alineofmalkins.com/tree/wtmalkins（Webtrees 實例）
- 用戶指示：「把 feature.md 做出來，參考該網站，全部用假資料 demo」

## 範圍調整
原 Webtrees PHP + MySQL 部署案 → **Next.js 16 前端 demo**，模擬 Webtrees 外觀與互動，使用假資料。排除真實登入、上傳、部署。

## 工作流程摘要

### 波次概覽
1. **Intake + Planning**：PM agent 產出 spec v0.1.0、9 tasks、project.json、README。
2. **波 1**：TASK-001 腳手架 + architect DEC-001（d3-hierarchy 決策）並行。
3. **TASK-001 修正迭代 + TASK-002 假資料** 並行（23 人 / 9 家庭 / 5 代）。
4. **波 2**：PM spec v0.1.2（命名對齊）+ TASK-003/005/006/007 並行實作。
5. **波 3**：4 個 QA（TASK-003/005/006/007）+ TASK-008/009 並行。
6. **波 4**：PM spec v0.1.3（追認 Orchestrator 設計決策）+ TASK-005/006 修正 + TASK-004 + TASK-008 修正 + QA TASK-004/008/009。

### 總計
- **Agent 派遣次數**：約 28 次（含並行）
- **QA 稽核次數**：9 次
- **修正迭代次數**：5 次（TASK-001、TASK-005、TASK-006、TASK-008、TASK-002 不需修正但 spec 對齊）
- **Forge Loop 使用率**：約 28/50 iterations

## 技術決策
- **DEC-001**：d3-hierarchy + d3-shape + d3-zoom + react-zoom-pan-pinch + 純 SVG React 節點（ADR-001）
- **Tailwind 版本**：v3.4（v4 與 Next 16 整合尚未穩定）
- **spec 演進**：v0.1.0 → v0.1.1（Tailwind 降版）→ v0.1.2（命名對齊實作）→ v0.1.3（Orchestrator 設計決策追認）
- **個人頁架構**：Tabs 5 頁取代左右欄（Orchestrator 決定，Webtrees 原生即為 tabs）
- **首頁架構**：Hero / Stats / FeaturedMembers / RecentStories（非快速入口卡片）
- **RoleContext 預設**：`admin`（demo 第一印象完整），guest 可手動切換測試隱私

## 最終交付
- **app/** 路由：`/`, `/tree/[id]`, `/person/[id]`, `/members`, `/media`, `/media/[id]`, `/stories`, `/stories/[id]`
- **components/**：common, home, layout, media, person, stories, tree
- **lib/tree/layout.ts**：d3 family tree helper
- **types/family.ts** + **data/{family,media,stories}.ts**：假資料
- **context/RoleContext.tsx**：角色切換
- **docs/adr/ADR-001**：視覺化選型決策
- **reviews/**：6 份 QA 報告

## SKL-OBS-001 觀察結論
原本懷疑 frontend-dev 多次未經 ESCALATION 偏離 spec，追溯後發現多數為 Orchestrator 派遣時主動下達的設計微調（TASK-005 Tabs、TASK-008 nav 結構等）。**真實的 agent 自主偏離**僅有：
1. TASK-002 欄位命名風格優化（`displayName → fullName`）— 已於 v0.1.2 追認
2. TASK-004 子路由改 query string — 與既有 tabs 一致，可接受

→ 制度改進：Orchestrator 下達偏離 spec 的指令時，應同步派 PM 更新 spec，避免後續 QA 誤判。

## 已知遺留項（不阻塞 demo）
- 首次執行需 `npm install`（Forge Loop 不跑此命令）
- Fan/Hourglass chart 在對稱性不足的資料下可能有 viewBox 偏置（M-3）
- 事件色盤部分硬編碼未納入 webtrees theme token（Minor）
- tasks/TASK-005.md 與 TASK-008.md 原 AC 文案未同步到 v0.1.3（PM 建議以 TASK-SPEC-SYNC-001 處理）

## 交付驗收
使用者可執行：
```bash
cd projects/family-tree-demo
npm install
npm run dev
```
預期在 `http://localhost:3000` 看到 Webtrees 風格的家族族譜 demo。
