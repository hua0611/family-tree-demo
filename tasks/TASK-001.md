# TASK-001 — Next.js 16 專案腳手架與 Tailwind 設定

- Priority: P0
- Agent: frontend-dev
- Status: pending
- Dependencies: 無
- Spec reference: `spec/current.md` §2, §4, §5

## 描述

建立 Next.js 16（App Router）+ TypeScript strict + Tailwind CSS 的乾淨腳手架，作為後續所有功能的基礎。不要在此 task 中寫任何業務元件或假資料，只完成「空殼 + 主題基礎色」。

## 具體工作

1. 在 `projects/family-tree-demo/app/` 下建立 Next.js 16 App Router 結構
2. `package.json`：宣告 `next@^16`, `react@^19`, `typescript@^5`, `tailwindcss@^4`, `@types/*`
3. `tsconfig.json`：啟用 `strict: true`, `noUncheckedIndexedAccess: true`
4. `tailwind.config.ts`：預留 `theme.extend.colors.webtrees` 色盤（深綠 / 米白 / 卡片灰）
5. `app/layout.tsx`：基礎 `<html lang="zh-Hant">`、載入 Noto Sans TC、全局 container
6. `app/page.tsx`：暫時顯示 "Family Tree Demo — Scaffold OK"
7. `app/globals.css`：Tailwind 三層 directive + CSS variable 定義

## 絕對禁止

- 不執行 `npm install` / `pnpm install`（由後續 iteration 處理）
- 不引入家族樹函式庫（等 DEC-001 決策）
- 不撰寫業務元件或 mock 資料

## 驗收標準

1. `projects/family-tree-demo/` 下存在 `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.ts`, `postcss.config.mjs`
2. `app/layout.tsx` 使用 `lang="zh-Hant"` 且正確引入 `globals.css`
3. `tsconfig.json` 開啟 `strict` 與 `noUncheckedIndexedAccess`
4. `tailwind.config.ts` 內定義 `webtrees` 色盤至少 3 個色階（primary / surface / accent）
5. 檔案結構符合 Next.js 16 App Router 慣例（`app/` 而非 `pages/`）

## 預估檔案

- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `tailwind.config.ts`
- `postcss.config.mjs`
- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `.gitignore`
