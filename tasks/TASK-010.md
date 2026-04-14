# TASK-010 — Zeabur 部署配置（Dockerfile + .dockerignore + next.config standalone）

- Priority: P1
- Agent: devops
- Status: completed
- Dependencies: TASK-001
- Created: 2026-04-14（scope_extended 後補建）
- Spec reference: 無（scope_extended 衍生任務，不在原 spec v0.1.x 範圍）
- Review: `reviews/TASK-010-review.md`

> 本任務單為事後補建（original delivery 未產生）。內容依實際交付物、reviews/TASK-010-review.md 與專案 scope_extended 需求反推撰寫。

## 背景

專案交付後（delivered, 2026-04-13），用戶要求將此 demo 部署到 Zeabur。初次嘗試時 Zeabur 使用平台自動生成的 Dockerfile，裡面有 `npm update -g npm` 指令，觸發 `Cannot find module 'promise-retry'` 錯誤並 build 失敗。

為避免此問題並取得可重現的部署結果，本任務要求撰寫一份乾淨、可控、multi-stage 的 Next.js 16 standalone Dockerfile 並提交到 repo 根目錄，讓 Zeabur 優先使用 repo 內的版本。

本任務觸發 `status_history` 的 `scope_extended` 條目（2026-04-14），並將「Zeabur 部署配置（Dockerfile）」加入 `scope.in_scope`。

## 描述

為本專案撰寫 Zeabur 可用的部署配置，確保：

1. Zeabur 使用 **repo 內的 `Dockerfile`**，而非平台自動生成版
2. Build 過程不呼叫 `npm update -g npm` 或任何 global npm 操作
3. Image 符合 Next.js 16 standalone 部署 best practice
4. `.dockerignore` 精確排除 orchestrator 元資料與 secrets
5. README 記載清楚的 Zeabur 部署步驟與常見問題排解

## 具體工作

1. **Dockerfile**（multi-stage build）
   - `deps` 階段：`node:22-alpine` + `apk add libc6-compat` + `npm ci`
   - `builder` 階段：copy node_modules + source → `npm run build`
   - `runner` 階段：
     - `ENV NODE_ENV=production`
     - `ENV NEXT_TELEMETRY_DISABLED=1`
     - `ENV HOSTNAME=0.0.0.0` ← Next.js standalone 外部訪問必備
     - `ENV PORT=3000`
     - 建立 non-root user `nextjs:nodejs` (uid/gid 1001)
     - Copy `.next/standalone`、`.next/static`、`public`
     - `USER nextjs`
     - `EXPOSE 3000`
     - `CMD ["node", "server.js"]`
   - 絕對不可出現：`npm update -g npm`、`npm install -g *`、`ADD` 遠端 URL

2. **.dockerignore**
   - 排除 `node_modules`、`.next`、`.git`
   - 排除 orchestrator 元資料：`sessions/`、`tasks/`、`reviews/`、`spec/`、`docs/`、`project.json`、`README.md`
   - 排除 `.env*.local`
   - **不可排除** `public/`（Dockerfile 會 COPY /app/public）

3. **next.config.ts**
   - 在現有 `NextConfig` 物件加入 `output: 'standalone'`
   - **不可破壞** 既有 `images.remotePatterns`（含 unsplash / pravatar / picsum）

4. **public/.gitkeep**
   - 建立空的 `public/` 資料夾並放入 `.gitkeep`
   - 原因：本 demo 未使用任何 public static 資源，但 Dockerfile 會 `COPY /app/public`，若 repo 無此目錄會 build 失敗

5. **README.md（Zeabur 部署章節）**
   - 前置條件（push 到 GitHub、Zeabur 帳號）
   - 部署步驟（**Root Directory 留空或 `/`**，絕對不能填 `projects/family-tree-demo`）
   - 綁定域名（Generated / Custom domain）
   - 常見問題：`promise-retry` 錯誤如何排解

## 絕對禁止

- 不可在 Dockerfile 中呼叫 `npm update -g npm`（這是本任務要修復的根源錯誤）
- 不可以 root 身份執行 `CMD`
- 不可 copy `.env.local` 或其他 secret 檔案到 image
- 不可破壞 `next.config.ts` 既有的 `images.remotePatterns` 設定
- 不可在 `.dockerignore` 排除 `public/`
- 不可將 README 中的 Root Directory 寫成 `projects/family-tree-demo`（本 repo 根目錄即 Next.js 根目錄）

## 驗收標準

1. `Dockerfile` 是 multi-stage（deps / builder / runner 三階段）且整份不含 `npm update -g` 或 `npm install -g`
2. `Dockerfile` 使用 `node:22-alpine` 為 base image
3. `Dockerfile` runner 階段以 non-root user `nextjs` 執行 `node server.js`
4. `Dockerfile` 含 `ENV HOSTNAME=0.0.0.0` 與 `ENV PORT=3000`
5. `.dockerignore` 排除 orchestrator 元資料與 secrets，且未排除 `public/`
6. `next.config.ts` 含 `output: 'standalone'` 且 `images.remotePatterns` 保留完整
7. `public/` 資料夾存在且至少有 `.gitkeep`
8. `README.md` 有 Zeabur 部署章節，Root Directory 指示正確，至少涵蓋 `promise-retry` 錯誤的排解
9. 本地執行 `docker build -t family-tree-demo .` 可成功完成（未要求實測，由用戶在 Zeabur 驗證）

## 預估檔案

- `Dockerfile`
- `.dockerignore`
- `next.config.ts`（僅加 `output: 'standalone'`）
- `README.md`（僅新增 Zeabur 部署章節）
- `public/.gitkeep`

## 交付狀態

- **Status**: `completed`
- **Delivered at**: 2026-04-14
- **Review**: `reviews/TASK-010-review.md` → **PASS_WITH_WARNINGS**
- **Warnings**（非阻塞，可 post-delivery polish）：
  - W1: `package.json` 無 `engines` 欄位
  - W2: Dockerfile L49 `COPY /app/public` 缺 `--chown=nextjs:nodejs`
  - W3: README 常見問題未記載 `public/` 雷區
- **後續動作**：待用戶確認 Zeabur redeploy 成功後，可派一次 devops polish 工單處理上述 3 項 warning
