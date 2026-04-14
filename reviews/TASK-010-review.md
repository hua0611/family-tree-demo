# TASK-010 稽核報告 — Zeabur 部署配置（Dockerfile + .dockerignore + next.config standalone）

- Reviewer: QA Agent
- Date: 2026-04-14
- Task: TASK-010
- Scope Trigger: 專案 delivered 後用戶要求擴充範圍 → scope_extended（2026-04-14）
- Verdict: **PASS_WITH_WARNINGS**（可上 Zeabur 重新部署；無 blocker，但有 3 項 warning 與 1 項資料不一致問題需回補）

---

## 總覽

本次任務由 devops agent 執行，目的是避免 Zeabur 平台自動生成的 Dockerfile 觸發 `npm update -g npm` → `Cannot find module 'promise-retry'` 錯誤。交付物是一份乾淨、可控、multi-stage 的 Next.js 16 standalone Dockerfile，並配套 `.dockerignore`、`next.config.ts` 的 `output: 'standalone'` 設定及 README 部署章節。

實測檔案清單：

| 檔案 | 存在 | 狀態 |
|---|---|---|
| `Dockerfile` | ✅ | 正確的 multi-stage（deps / builder / runner） |
| `.dockerignore` | ✅ | 完整排除 orchestrator 元資料與 secrets |
| `next.config.ts` | ✅ | 已含 `output: 'standalone'`，`images.remotePatterns` 未破壞 |
| `README.md` (Zeabur 章節) | ✅ | Root Directory 指示正確；但缺少 `public/` 雷區說明 |
| `public/.gitkeep` | ✅ | 已存在（後期補修） |
| `tasks/TASK-010.md` | ❌ | 原本缺失，本次稽核已補建 |
| `reviews/TASK-010-review.md` | ✅ | 本檔 |

---

## 檢查清單逐項驗證

### A. Dockerfile 正確性 ✅

| 檢查項 | 結果 | 備註 |
|---|---|---|
| Multi-stage build（deps / builder / runner 三階段） | ✅ | L6, L19, L35 三個 `FROM node:22-alpine AS …` |
| Base image `node:22-alpine` | ✅ | 三階段一致 |
| 與 `package.json` engines 對齊 | ⚠️ | `package.json` **未宣告** `engines` 欄位 — 見 W1 |
| **無** `npm update -g npm` | ✅ | 整份 Dockerfile grep 不到 `update -g` 或 `install -g` |
| **無** `npm install -g` 任何 package | ✅ | 僅 apk add `libc6-compat` 與 `npm ci` |
| deps 階段用 `npm ci` | ✅ | L14 — 需 `package-lock.json`，實測該檔存在 |
| runner 階段 non-root user | ✅ | L45–46 建立 `nextjs:nodejs` uid/gid 1001 |
| runner 只 copy 必要檔案 | ✅ | L49 `./public`、L54 `.next/standalone`、L55 `.next/static` |
| runner **不** copy source code | ✅ | 無 `COPY . .` 或 source 目錄 |
| `ENV HOSTNAME=0.0.0.0` | ✅ | L41（standalone 必備，否則外部打不進 container） |
| `ENV PORT=3000` | ✅ | L42 |
| `CMD ["node", "server.js"]` | ✅ | L61（非 `npm start`，正確） |
| `chown` 設置 | ✅ | L54/L55 的 `--chown=nextjs:nodejs` 對 .next 產物正確 |

**注意**：L49 `COPY --from=builder /app/public ./public` **沒有** `--chown=nextjs:nodejs`。這意味著 `public/` 目錄在 runtime 下會以 root 權限存在，`nextjs` user 只有讀取權。Next.js standalone 只需讀取，**不影響運作**，但為一致性可加上 `--chown` — 見 W2。

### B. Dockerfile 安全性 ✅

| 檢查項 | 結果 | 備註 |
|---|---|---|
| 不含 secrets / env files | ✅ | `.dockerignore` 排除 `.env*.local` |
| 不含 `.git` | ✅ | `.dockerignore` 排除 `.git` |
| CMD 非 root | ✅ | L57 `USER nextjs` 在 CMD 之前 |
| 無無謂暴露 PORT | ✅ | 僅 `EXPOSE 3000` |
| 無 `ADD` 遠端 URL | ✅ | 整份只用 `COPY`，無 `ADD` |

### C. `.dockerignore` 完整性 ✅

| 檢查項 | 結果 | 備註 |
|---|---|---|
| 排除 `node_modules` | ✅ | L2 |
| 排除 `.next` | ✅ | L5 |
| 排除 `.git` | ✅ | L8 |
| 排除 `sessions/` | ✅ | L28 |
| 排除 `tasks/` | ✅ | L29 |
| 排除 `reviews/` | ✅ | L30 |
| 排除 `spec/` | ✅ | L31 |
| 排除 `docs/` | ✅ | L32 |
| 排除 `project.json` | ✅ | L33 |
| 排除 `README.md` | ✅ | L34（不影響 build，也能縮小 context） |
| 排除 `.env*.local` | ✅ | L12–16 |
| **不** 排除 `public/` | ✅ | 未列入 — `public/.gitkeep` 可正確進入 build context |

### D. `next.config.ts` 配置 ✅

| 檢查項 | 結果 | 備註 |
|---|---|---|
| `output: 'standalone'` | ✅ | L4 |
| `images.remotePatterns` 未被破壞 | ✅ | L6–26，`unsplash / pravatar / picsum` 三個 host 完整保留 |
| 無多餘 experimental 旗標 | ✅ | 除 `reactStrictMode` 外無其他 |

### E. `public/` 資料夾存在性 ✅（但有歷史資料不一致）

| 檢查項 | 結果 | 備註 |
|---|---|---|
| `public/` 存在 | ✅ | |
| `public/.gitkeep` 存在 | ✅ | 讓 git 能追蹤空資料夾 |
| `project.json` TASK-010 `estimated_files` 含 `public/.gitkeep` | ❌ | **I1** — 初版交付只寫了 3 個檔案，後期補修未回填 |

### F. README 部署章節準確性 ⚠️

| 檢查項 | 結果 | 備註 |
|---|---|---|
| 「Root Directory 留空 / `/`」 | ✅ | L117 正確寫明「不要填 `projects/family-tree-demo`」 |
| 步驟清晰 | ✅ | 5 步驟 + 前置條件 + 綁定域名 |
| 有 `promise-retry` 錯誤排解 | ✅ | L129–133 |
| **缺**：提到 `public/` 必須存在 | ❌ | **W3** — 本次踩過的雷沒有寫進常見問題 |

### G. `project.json` 一致性 ⚠️

| 檢查項 | 結果 | 備註 |
|---|---|---|
| TASK-010 `status: "completed"` | ✅ | L194 |
| `scope.in_scope` 含「Zeabur 部署配置（Dockerfile）」 | ✅ | L35 |
| `scope.out_of_scope` 已移除「部署上線」 | ✅ | L37–43 不再列入 |
| `status_history` 有 `scope_extended` 條目 | ✅ | L11 `2026-04-14 scope_extended` |
| TASK-010 `estimated_files` 完整 | ❌ | **I1** — 缺 `README.md` 與 `public/.gitkeep`；本次稽核已補回 |
| TASK-010 無 `review_status` 欄位 | ❌ | **I2** — 本次稽核已補為 `passed_with_warnings` |

### H. 任務文件完備性 ⚠️

| 檢查項 | 結果 | 備註 |
|---|---|---|
| `tasks/TASK-010.md` 存在 | ❌ → ✅ | devops agent 未建立；**本次稽核已補建** |
| `reviews/TASK-010-review.md` 存在 | ✅ | 本檔 |

---

## 問題清單

### BLOCKER：**無**

下次部署不會因本稽核發現的問題而失敗。Dockerfile 本身乾淨可用，`.dockerignore` 未誤排 `public/`，`next.config.ts` 有 `standalone`，`package-lock.json` 存在讓 `npm ci` 能運作。

### WARNING

**W1. `package.json` 沒有 `engines` 欄位，無法與 Dockerfile `node:22-alpine` 形成雙向鎖定**

- 檔案：`package.json`
- 現況：無 `engines` 宣告
- 風險：本地開發者可能用 Node 18 / 20 跑 dev，build 行為與 container 不一致；未來若 Dockerfile 升到 Node 24 也無提示
- 建議修正（非阻塞）：在 `package.json` 加入
  ```json
  "engines": { "node": ">=22.0.0" }
  ```
- 負責修補：devops 或 frontend-dev 擇一

**W2. Dockerfile L49 `COPY --from=builder /app/public ./public` 缺 `--chown=nextjs:nodejs`**

- 檔案：`Dockerfile` L49
- 現況：`public/` 在 runner 以 root 擁有，`nextjs` user 靠 default 讀取權限
- 風險：**不影響運作**（Next.js standalone 只需讀 public），但與 L54/L55 的 chown 風格不一致；若未來需要在 runtime 寫入 public（理論上不應該），會失敗
- 建議修正（非阻塞）：改為
  ```dockerfile
  COPY --from=builder --chown=nextjs:nodejs /app/public ./public
  ```
- 負責修補：devops

**W3. README「常見問題」未記載 `public/` 雷區**

- 檔案：`README.md` L129–133（常見問題章節）
- 現況：只寫了 `promise-retry` → Root Directory 的排解
- 缺漏：首次部署因 `public/` 資料夾不被 git 追蹤導致 Dockerfile L49 `COPY /app/public ./public` 失敗 → 這是本次實際踩過的坑
- 建議追加（非阻塞）：
  > **部署失敗，log 出現 `"/app/public": not found` 或類似錯誤**
  >
  > 本專案 Dockerfile 會 `COPY /app/public ./public`，因此 repo 必須有 `public/` 資料夾。
  > 若你的 fork 是空的，請在 `public/` 放一個 `.gitkeep` 檔讓 git 能追蹤該目錄。
- 負責修補：devops（順手寫）或 pm

### INFO（純記錄）

**I1. `project.json` TASK-010 `estimated_files` 不完整（歷史資料漂移）**

- 初版交付時只記錄了 `Dockerfile` / `.dockerignore` / `next.config.ts` 三個檔案
- 後期補修加入 `README.md` 部署章節與 `public/.gitkeep` 時，`estimated_files` 未同步回填
- **本次稽核已補全**為：`Dockerfile`, `.dockerignore`, `next.config.ts`, `README.md`, `public/.gitkeep`
- 觀察：devops 首次在本專案執行任務就出現「資料不一致」的模式；**第一次出現，本次僅稽核報告紀錄**，不回寫 skill lessons
- 若未來 TASK-011+ 再次出現類似「交付物未回填 project.json」的情況，屆時應追加到 `skills/devops/references/lessons.md`

**I2. TASK-010 初次交付時缺 `tasks/TASK-010.md`（任務單本體）**

- devops agent 被派遣時並未產生 `tasks/TASK-010.md`，僅有口頭任務指示
- **本次稽核已補建**，格式對齊 TASK-001 ~ TASK-009 的風格
- 觀察：本專案 TASK-001~009 都是 PM 在 planning 階段預先寫好的，TASK-010 是 scope_extended 後臨時派生的任務，流程上 PM 並未補寫任務單 → 這不是 devops 的鍋，是 orchestrator 流程的小漏洞
- **不回寫 skill lessons**，但建議 orchestrator 在未來 scope_extended 派生新任務時，先確保 `tasks/TASK-xxx.md` 存在再派 agent

**I3. `.dockerignore` 排除 `README.md`**

- 這是**正確**設計：README 在 repo 裡供用戶閱讀，但不需進入 Docker build context（縮小 context 大小、加快 push）
- 僅作記錄，無須處理

**I4. Dockerfile 未使用 `.dockerignore` 的 wildcards 如 `**/*.test.ts` 排除測試檔**

- 本專案目前無測試檔（TASK-001~009 均無 `*.test.ts`），故此排除不需要
- 未來若加入測試，可考慮在 `.dockerignore` 加入 `**/*.test.*`、`**/__tests__/**` 以縮小 builder context
- 僅作記錄

---

## 最終判定

- 任務：TASK-010
- 結果：**⚠️ PASS_WITH_WARNINGS**
- Blocker：**無** — 可安全觸發 Zeabur redeploy
- Warning：3 項（W1 engines 鎖定、W2 public chown 一致性、W3 README 雷區補充）
- Info：4 項（I1 project.json estimated_files、I2 task 單缺失已補、I3/I4 純記錄）

### 需派 devops 修補嗎？

**建議在用戶驗證 Zeabur redeploy 成功後，再以一次小的「清尾巴」工單派 devops 處理**：
1. W1: 為 `package.json` 加 `engines` 欄位
2. W2: 為 `Dockerfile` L49 補 `--chown=nextjs:nodejs`
3. W3: 為 `README.md` 常見問題追加 `public/` 雷區說明

這三項**都不阻塞本次 redeploy**，可在 redeploy 成功後作為 post-delivery polish。

### 交付亮點

1. **乾淨的 multi-stage build**：deps / builder / runner 三階段分工清晰，符合 Next.js 官方 Dockerfile 範例
2. **正確處理 standalone runtime**：`ENV HOSTNAME=0.0.0.0` + `CMD ["node", "server.js"]` 這兩個常見踩雷點都做對了
3. **Non-root user + chown**：L45–55 的 user/group 建立與 chown 正確
4. **`.dockerignore` 完整且精準**：既排除 orchestrator 元資料，又沒有誤排 `public/`
5. **明確的 Zeabur Root Directory 指示**：README 明確寫出「不要填 `projects/family-tree-demo`」避開踩過的坑

### 改進空間

1. 任務交付流程不完整（缺 task 單、estimated_files 未回填）— 屬於流程而非程式碼問題
2. 常見問題應記錄**所有**本次踩過的坑，不僅是最後一個
