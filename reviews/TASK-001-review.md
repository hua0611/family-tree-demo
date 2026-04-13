# TASK-001 稽核報告

- Task: TASK-001 — Next.js 16 專案腳手架與 Tailwind 設定
- Reviewer: qa-reviewer
- Date: 2026-04-13
- Verdict: **PASS_WITH_NOTES**（可進入 TASK-002，但 Major 問題須在 TASK-002 啟動前或併入 TASK-002 第一步修正）

## 驗收標準對照表

| # | 驗收標準 | 結果 | 證據 |
|---|----------|------|------|
| 1 | `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`, `postcss.config.mjs` 存在 | PASS | 5 個檔案皆位於 `projects/family-tree-demo/` 根目錄 |
| 2 | `app/layout.tsx` 使用 `lang="zh-Hant"` 且正確引入 `globals.css` | PASS | `layout.tsx:31` `<html lang="zh-Hant" ...>`；`layout.tsx:3` `import '@/app/globals.css'` |
| 3 | `tsconfig.json` 開啟 `strict` 與 `noUncheckedIndexedAccess` | PASS | `tsconfig.json:7-8` 兩者皆 `true` |
| 4 | `tailwind.config.ts` 定義 `webtrees` 色盤至少 3 階（primary / surface / accent） | PASS | `tailwind.config.ts:12-19` 提供 5 階：`primary / surface / accent / ink / muted` |
| 5 | 檔案結構符合 Next.js 16 App Router 慣例 | PASS | 使用 `app/layout.tsx` + `app/page.tsx`，無 `pages/` 目錄 |

驗收 5 條全數通過。

## 發現的問題

### Major #1 — Tailwind 版本與任務單要求不符（需修正）

- **位置**：`package.json:22`、`postcss.config.mjs`、`app/globals.css`、`tailwind.config.ts:1`
- **現象**：
  - 任務單 §具體工作 第 2 點明文要求 `tailwindcss@^4`
  - 實際 `package.json` 寫 `"tailwindcss": "^3.4.17"`
  - `postcss.config.mjs` 使用 v3 plugin 寫法（`tailwindcss: {}`）而非 v4 的 `@tailwindcss/postcss`
  - `app/globals.css` 使用 v3 的 `@tailwind base/components/utilities` 三層 directive，v4 應為 `@import "tailwindcss"`
  - `tailwind.config.ts` 由 `'tailwindcss'` import `Config` 型別（v3 寫法）
- **影響**：若後續強制升級至 v4，PostCSS pipeline、CSS directive、config loader 皆會破壞。若維持 v3，則直接違反任務單規格。
- **建議修正**（擇一並保持一致）：
  - 方案 A（符合 spec）：升級至 Tailwind v4
    - `package.json`：`"tailwindcss": "^4.0.0"`、新增 `"@tailwindcss/postcss": "^4.0.0"`，移除 `autoprefixer`、`postcss`（v4 自帶）
    - `postcss.config.mjs`：改為 `plugins: { "@tailwindcss/postcss": {} }`
    - `app/globals.css`：改為 `@import "tailwindcss";`
    - `tailwind.config.ts`：v4 建議以 CSS-first config（`@theme`）取代，或保留 JS config 但改用 `defineConfig`
  - 方案 B（務實退讓）：與 PM 確認改為 Tailwind v3，並在 spec / task 同步更新為 `tailwindcss@^3.4`
- **優先級**：需在 TASK-002 開始前解決，否則 TASK-002 的假資料頁面一跑 build 就會踩到

### Major #2 — `next.config.ts` 預先寫入假資料圖床白名單（超出 scope）

- **位置**：`next.config.ts:5-20`
- **現象**：預先加入 `images.unsplash.com` 與 `i.pravatar.cc` 的 `remotePatterns`
- **違反**：TASK-001 §絕對禁止「不撰寫業務元件或 mock 資料」與「只完成空殼 + 主題基礎色」的原則
- **影響**：雖不破壞 build，但屬於假資料 / 頭像圖源配置，應由 TASK-002（假資料建立）或引入第一個使用 `<Image>` 的 task 來決定與添加。此處預先寫死可能選錯圖床，也讓 scaffold 的責任邊界模糊。
- **建議修正**：精簡 `next.config.ts` 為：
  ```typescript
  import type { NextConfig } from 'next'

  const nextConfig: NextConfig = {
    reactStrictMode: true,
  }

  export default nextConfig
  ```
- **優先級**：不阻擋 build，但違反 scope 原則，應在本 task 範圍內修正而非遺留

### Minor #1 — `next/font` 與 Tailwind / globals.css 未正確串接

- **位置**：`app/layout.tsx:5-17`、`tailwind.config.ts:21-24`、`app/globals.css:14-17`
- **現象**：
  - `layout.tsx` 用 `next/font/google` 載入 Noto Sans TC 並產生 `--font-noto-sans-tc` CSS variable
  - 但 `tailwind.config.ts.fontFamily.sans` 直接寫字面值 `'"Noto Sans TC"'`
  - `app/globals.css` 的 `html` 規則也寫 `font-family: 'Noto Sans TC', ...`
  - 結果：`next/font` 的自託管、preload、font-display 最佳化實際未生效，瀏覽器仍以系統字體 fallback
- **建議修正**：
  - `tailwind.config.ts`:
    ```typescript
    fontFamily: {
      sans: ['var(--font-noto-sans-tc)', 'system-ui', 'sans-serif'],
      serif: ['var(--font-noto-serif-tc)', 'serif'],
    }
    ```
  - `app/globals.css` `html` 規則移除 `font-family`（交給 Tailwind `font-sans` 於 body 上處理），或改為 `font-family: var(--font-noto-sans-tc), system-ui, sans-serif`
- **優先級**：非阻擋，建議併入 Major #1 修正一起處理

### Minor #2 — globals.css 的 import 路徑偏好

- **位置**：`app/layout.tsx:3`
- **現象**：使用 `import '@/app/globals.css'`
- **建議**：`layout.tsx` 與 `globals.css` 同目錄，改用相對路徑 `import './globals.css'` 更符合 Next.js 官方範例與 `code-style` skill 中「相對路徑優先用於近鄰檔案」的慣例
- **優先級**：純風格，不阻擋

### Minor #3 — `tailwind.config.ts` `content` glob 預先列出尚未存在的目錄

- **位置**：`tailwind.config.ts:4-9`
- **現象**：列出 `./components/**`, `./context/**`, `./lib/**`，但 TASK-001 僅建立 `app/`
- **評估**：屬合理預留，Tailwind 對不存在的 glob 不報錯。接受，不需修正
- **優先級**：Info only

## 代碼風格與一致性

- 縮排 2 spaces、single quotes、無分號、kebab-case 檔名 — 全數符合 `code-style` skill
- Import 順序（外部 → `@/` → 相對）— `layout.tsx` 正確
- `page.tsx` 無業務邏輯或假資料 — 符合 TASK-001 要求
- `app/page.tsx` 使用 `&mdash;` HTML entity 來呈現破折號 — 合理避免 JSX 字元問題

## Schema / Runtime / 環境相容性（Level 1.5）

| 類別 | 結果 | 備註 |
|------|------|------|
| DB schema 一致性 | N/A | 本 task 無 DB |
| 第三方服務相容性 | N/A | 本 task 無外部服務 |
| 環境變數 | N/A | 本 task 未要求 `.env` |
| 依賴版本驗證 | **FAIL** | Tailwind 宣告 v3 但 spec 要求 v4（見 Major #1） |
| Auth 流程韌性 | N/A | 無 auth |

## 結論

**Verdict: PASS_WITH_NOTES**

5 條驗收標準全數通過，scaffold 可用，但存在 2 項 Major 問題必須處理：

1. **Tailwind 版本不一致**（Major #1）— 需與 PM 決議走 v4 升級或更新 spec 至 v3，並讓 `package.json` / `postcss.config.mjs` / `globals.css` / `tailwind.config.ts` 達成一致
2. **`next.config.ts` 預先配置假資料圖床**（Major #2）— 違反 scope 原則，應移除

Minor #1（`next/font` 串接）建議併入 Major #1 的修正一起處理。其餘 Minor 為風格建議。

### 建議後續動作

由 Orchestrator 指派 `frontend-dev` 執行一次輕量修正迭代，涵蓋：
- 決策 Tailwind v3 vs v4 並同步相關檔案
- 清空 `next.config.ts` 的 `remotePatterns`
- 修正 `next/font` → Tailwind → globals.css 的字體變數串接

完成後可直接進入 TASK-002（假資料與型別）。
