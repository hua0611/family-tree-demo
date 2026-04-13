# TASK-009 — Webtrees 風格深綠主題 CSS

- Priority: P1
- Agent: frontend-dev
- Status: pending
- Dependencies: TASK-001
- Spec reference: `spec/current.md` §7

## 描述

建立符合 Webtrees 外觀的主題色系、字體與共用樣式，確保全站視覺相似度達 70% 以上。需參考 [wt-malkins](https://wt-malkins.alineofmalkins.com/tree/wtmalkins)。

## 具體工作

1. `tailwind.config.ts` 擴充 `theme.extend.colors.webtrees`：
   - `primary`: 深綠（#2d5016）
   - `primary-hover`: 淺一階綠
   - `accent`: 金黃（#c9a227）
   - `surface`: 米白（#f7f3ec）
   - `surface-alt`: 淺灰（#e8e3d6）
   - `ink`: 深棕灰（#2b2b2b）
   - `male-border`: 淺藍（#6fa8dc）
   - `female-border`: 淺粉（#d48ea8）
   - `unknown-border`: 灰（#9b9b9b）
2. `app/globals.css`：
   - 全站 body 背景為 surface
   - 全域字體 Noto Sans TC + system-ui
   - 卡片圓角 rounded-lg + shadow-sm
3. `styles/webtrees-theme.css`：
   - 節點卡片類別 `.wt-person-node`
   - 時間軸樣式 `.wt-timeline-item`
   - Header 深綠底色類別
4. 提供 README 片段說明色盤與對應類別用法

## 驗收標準

1. `tailwind.config.ts` 中 `webtrees` 色盤至少 8 個 key
2. Header 深綠底色、白色文字、golden accent 在 active 主選單
3. 頁面背景為米白色 surface，內容卡片為白色 + 陰影
4. 家族樹節點依性別顯示不同邊框顏色
5. 字體至少指定 Noto Sans TC fallback

## 預估檔案

- `tailwind.config.ts`
- `app/globals.css`
- `styles/webtrees-theme.css`
