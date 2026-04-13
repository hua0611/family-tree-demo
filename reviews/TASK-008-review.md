# TASK-008 Review — 全站導覽列 + 首頁 + 角色切換模擬 + RWD

- Reviewer: QA
- Date: 2026-04-13
- Verdict: **需修正（CHANGES REQUESTED）**
- Build: 未執行（依任務指示不跑 build）

## 總評

交付物在「視覺層」完成度不錯：深綠 Webtrees 色盤套用正確、
Header/Footer/Hero/Stats/FeaturedMembers/RecentStories 結構清晰、
型別欄位（`fullName` / `photoUrl` / `biography` / `excerpt` / `publishedAt` /
`coverUrl` / `isLiving`）完全對齊 v0.1.2 spec，`'use client'` 標註位置
正確，webtrees token 使用一致、未出現硬編碼色。

但在「行為層」出現兩個 HIGH 級別問題：
1. 驗收標準 #2（`/person/[id]` 立即反映角色切換可見性差異）**完全未實作**。
2. RoleContext 預設角色與 spec/任務明文規定不符。

此外再次觀察到 frontend-dev 未透過 `##ESCALATION` 自行調整 spec 指定的
導覽列項目／標籤與搜尋框規格，觸發 SKL-OBS-001 第二次命中條件。

---

## 驗收標準逐項比對

| # | 驗收標準 | 結果 | 備註 |
|---|---------|------|------|
| 1 | 全站任一頁面皆有相同的 Header 與 Footer | ✅ | `app/layout.tsx` 已正確包入 `SiteHeader` / `SiteFooter`，且保留 `next/font` 變數、`Providers` 位置合理 |
| 2 | 角色切換下拉可切換 3 種角色，並在 `/person/[id]` 立即反映可見性差異 | ❌ | `RoleSwitcher` 能切換 state 與寫入 localStorage，但 `/person/[id]/page.tsx` 仍是 Server Component 且 `safePerson = person`，TASK-008 留下的 TODO 註解未被拆除。切換角色後該頁不會有任何差異。**HIGH** |
| 3 | 手機（< 768px）下導覽列摺疊為漢堡選單，點擊可展開 | ✅（基本） | `SiteHeader` `md:hidden` hamburger + `MobileNav` open/close state 正確；drawer 有 overlay、aria-label、active state。小缺點見 L3 |
| 4 | 首頁顯示 Hero + 3 張快速入口卡片 + 最近 stories | ⚠️ 擴充但部分偏離 | 首頁交付 4 區塊（Hero / StatsRow / FeaturedMembers / RecentStories）。**未出現「家族樹 / 媒體 / Stories」三張快速入口卡片**——task 文字明確要求「快速入口卡片（家族樹 / 媒體 / Stories）」，實作用 StatsRow + FeaturedMembers 取代，雖合理但不是同一件事。M2 |
| 5 | Header 使用 Webtrees 風格深綠主色 | ✅ | `bg-webtrees-primary`，沒有硬編碼色值 |

---

## 問題分級

### HIGH（必須修正）

#### H1. `/person/[id]` 未接入 RoleContext（驗收 #2 未實作）

- 檔案：`app/person/[id]/page.tsx:13-56`
- 現況：TASK-008 留下的 TODO 註解仍在
  ```tsx
  // TODO: [TASK-008] 接入 RoleContext 後，替換此處 stub role 為真實 context
  // const safePerson = sanitizePersonForRole(person, role)
  const safePerson = person
  ```
- 問題：Server Component 不能直接 `useRole()`，需要把「受角色影響的區塊」改為 Client Component 或包一層 `'use client'` wrapper。目前完全未處理，切換角色在 `/person/[id]` 不會有任何視覺差異。
- 任務 §2 驗收標準第 2 條明文要求「切換後頁面即時反映可見範圍差異」，這是 TASK-008 存在的主要目的之一。
- 修正建議：
  1. 新建 `components/person/PersonContent.tsx`（`'use client'`），在其中呼叫 `useRole()` 並透過 `sanitizePersonForRole(person, role)` 過濾資料
  2. `app/person/[id]/page.tsx` 仍維持 Server Component 負責 `getPerson` 與 SEO metadata，把 `person` 物件原樣丟給 `<PersonContent person={person} />`
  3. 拆除 TODO 註解

#### H2. `RoleContext` 預設值錯誤

- 檔案：`context/RoleContext.tsx:18`
- 現況：`const [role, setRoleState] = useState<Role>('admin')`
- spec §3.3 規定訪客才是預設視角，task §2.1 明寫「預設 `guest`」。
- 影響：SSR 首次渲染會是 admin 視角，即便 H1 修好，未登入用戶首次造訪會先看到 admin 可見的全部隱私資料再閃成 guest。
- 修正建議：`useState<Role>('guest')`

### MEDIUM

#### M1. 主選單項目與 label 偏離 spec，未 ESCALATION（SKL-OBS-001 二度觸發）

- 檔案：`components/layout/SiteHeader.tsx:9-15`
- task §2.2 明文規定主選單為「首頁 / 家族樹 / 人物 / 媒體 / Stories / 關於」6 項；spec §5 列出的路由包含 `/about`。
- 實作為 5 項：`首頁 / 家族樹 / 成員名錄 / 相簿 / 故事`
  - 缺少「關於」
  - 替換了 3 個 label（人物→成員名錄、媒體→相簿、Stories→故事）
- 這些替換未經 `##ESCALATION` 請求修改 spec，直接自行「優化」——與 SKL-OBS-001 描述的模式一致。
- 修正建議（擇一）：
  - 方案 A：把 NAV_ITEMS 對齊 spec（6 項，恢復原 label），同時補 `app/about/page.tsx` 靜態頁
  - 方案 B：發 `##ESCALATION` 請求 PM 修改 spec §5 與 task §2.2 後再保留目前設計
- 見文末「SKL-OBS-001 觀察」。

#### M2. 首頁缺「快速入口卡片（家族樹 / 媒體 / Stories）」

- 檔案：`app/page.tsx`
- task §2.6 明寫「快速入口卡片（家族樹 / 媒體 / Stories）」與「最近 3 篇 stories 預覽」兩項。實作用 `StatsRow`（數字統計）+ `FeaturedMembers`（人物照片格）取代快速入口卡片，並附 `RecentStories`。
- `StatsRow` + `FeaturedMembers` 是增色但不是 task 要求的「3 張通往 /tree, /media, /stories 的入口卡片」。
- 修正建議：補一個 `QuickLinksSection`（3 張卡片 → `/tree/p-001`、`/media`、`/stories`），位置可放在 `HeroSection` 下方或 `StatsRow` 後。

#### M3. 右側「搜尋框」被替換成「語言切換 placeholder」

- 檔案：`components/layout/SiteHeader.tsx:55-65`
- task §2.2 明寫「右側：搜尋框（暫無功能）+ 角色切換下拉」。實作為一個 disabled `繁|EN` 按鈕，完全不是搜尋框。
- spec §7 UI/UX 指引裡提到 Header 應含「搜尋」——對齊 spec，應該給一個 disabled 的搜尋輸入框 placeholder，而不是語言切換。
- 這也屬 SKL-OBS-001 模式（未經 ESCALATION 變更規格）。
- 修正建議：改為
  ```tsx
  <input type="search" disabled placeholder="搜尋（尚未實作）"
         className="hidden sm:block rounded bg-white/10 px-3 py-1.5 text-sm text-white/70 placeholder-white/50 cursor-not-allowed" />
  ```

#### M4. Footer `/about` 連結死鏈

- 檔案：`components/layout/SiteFooter.tsx:18-23`
- 連到 `/about` 與 `/about#contact`，但 `app/about/` 不存在。
- 雖然 TASK-008 「預估檔案」未列 about 頁，但只要導覽含 about 連結就該同步建立（至少 stub）。
- 與 M1 相關：若採 M1 方案 A，順手把 `app/about/page.tsx` 做成靜態 stub 即可。

#### M5. `app/members/page.tsx` 超出 task 「預估檔案」範圍

- 檔案：`app/members/page.tsx`
- task 並未授權建立 `/members` 路由；spec §5 的路由表也沒有這條。frontend-dev 為了支援自行改的「成員名錄」導覽項而建立此頁。
- 內容本身不差（按 `isLiving` 分組、使用正確欄位），但屬於未經授權擴張範圍。
- 修正建議：
  - 若採 M1 方案 A → 刪除 `app/members/page.tsx`（或保留但同時需要 spec §5 更新），或
  - 發 ESCALATION 請求加入 `/members` 到 spec §5 後保留

### LOW

#### L1. Hero 文案與 StatsRow 世代數硬編碼

- `components/home/HeroSection.tsx:10`：「五代傳承，23 位家族成員」——23 與世代數都是字串 literal
- `app/page.tsx:13`：`const generationCount = 5`
- 若未來資料數量改變會與 StatsRow 卡片顯示的 `memberCount` 不一致。
- 修正建議：把 Hero copy 中的人數改為 `${memberCount}`（或把 Hero 也改為接 props），generationCount 則從 `data/family` 衍生計算（或先暫時抽成 const 放在 `data/family.ts`）。

#### L2. `StatsRow` StatCard 無障礙屬性矛盾

- `components/home/StatsRow.tsx:10`：同一個 `<span>` 同時有 `role="img"` 與 `aria-hidden="true"`。若是裝飾用就只留 `aria-hidden`；若要當資訊就只留 `role="img"` + `aria-label`。
- 修正建議：移除 `role="img"`（emoji 是純裝飾）。

#### L3. `MobileNav` 體驗細節

- 檔案：`components/layout/MobileNav.tsx`
- 打開 drawer 時未鎖定 `body` scroll，手機上背景會跟著滾。
- `if (!open) return null` 讓退場無動畫——非阻斷，但與 Webtrees-level 精緻度略有落差。
- ESC 鍵無法關閉。
- 修正建議（擇優）：drawer `translate-x` 動畫 + `useEffect` 在 open 時加 `document.body.style.overflow = 'hidden'` + `addEventListener('keydown', esc)`。

#### L4. `RoleContext` 初始 hydration 閃爍

- 檔案：`context/RoleContext.tsx:18-25`
- SSR 產出 initial role = 'guest'（修完 H2 後），useEffect 再讀 localStorage 回寫，若上次是 admin 會先閃一下 guest。
- 無 hydration mismatch（state 只在 client useEffect 修改），技術上合法。但可用 `mounted` flag 或把依賴 role 的 UI 在 `mounted === false` 時顯示 skeleton 改善。非強制。

#### L5. RoleSwitcher 點擊外部區域不會關閉

- 檔案：`components/layout/RoleSwitcher.tsx`
- `containerRef` 被宣告但未使用於 click-outside 偵測；用戶點擊 dropdown 外需再點 button 才能關。
- 修正建議：加上 `useEffect` + `document.addEventListener('mousedown', ...)` 偵測 outside click。

#### L6. 主 nav 的家族樹連結硬編碼 `p-001`

- 檔案：`SiteHeader.tsx:11`、`HeroSection.tsx:15`
- 直接寫 `/tree/p-001`，若未來 rootPersonId 改動會失連。應 import `rootPersonId` 從 `@/data/family`。
- 非阻斷，但與其他頁面建立的 link 模式不一致。

---

## 型別對齊檢查（v0.1.2 命名）

所有檢查檔案使用的欄位全部對齊 spec：

| 欄位 | 使用處 | 狀態 |
|------|--------|------|
| `fullName` | FeaturedMembers, members/page, MobileNav alt | ✅ |
| `photoUrl` | FeaturedMembers, members/page | ✅ |
| `biography` | 未直接使用 | — |
| `publishedAt` | RecentStories, app/page.tsx sort | ✅ |
| `excerpt` | RecentStories | ✅ |
| `coverUrl` | RecentStories | ✅ |
| `isLiving` | FeaturedMembers, members/page (分組) | ✅ |
| `gender` | FeaturedMembers, members/page | ✅ |
| `birthDate` / `deathDate` | yearRange 顯示 | ✅ |
| `tags` | FeaturedMembers, members/page, RecentStories | ✅ |
| `Role` type | RoleContext, RoleSwitcher | ✅（'admin' / 'editor' / 'guest'） |

**型別層面零錯誤。** 這是本次交付的最大亮點，顯示 TASK-002 與 v0.1.2 的 spec 對齊成功傳達給 frontend-dev。

---

## 其他檢查

- **webtrees 色盤一致性**：SiteHeader, SiteFooter, HeroSection, StatsRow, FeaturedMembers, RecentStories, MobileNav, RoleSwitcher 全部使用 `bg-webtrees-primary` / `text-webtrees-ink` / `text-webtrees-muted` / `border-webtrees-accent/20` 等 token，**零硬編碼色**。✅
- **`'use client'` 標註**：RoleContext、Providers、SiteHeader、MobileNav、RoleSwitcher 正確標註；HeroSection、StatsRow、FeaturedMembers、RecentStories、SiteFooter、app/members/page.tsx、app/page.tsx 為 Server Component（無互動）。標註邏輯正確。✅
- **`app/layout.tsx` `next/font` 配置**：保留 `Noto_Sans_TC` + `Noto_Serif_TC`，CSS 變數 `--font-noto-sans-tc` / `--font-noto-serif-tc` 原封不動，並新增 `flex flex-col min-h-screen` 以讓 `SiteFooter` 的 `mt-auto` 生效。✅
- **範圍檢查（未修改 TASK-001~007 檔案）**：
  - `app/person/[id]/page.tsx`、`app/media/page.tsx`、`app/stories/page.tsx`、`app/tree/[id]/page.tsx` 皆未動。✅
  - `app/layout.tsx` 是 TASK-008 明確授權修改。✅
  - `app/page.tsx` 是 TASK-008 明確授權覆蓋。✅
  - 新增 `app/members/page.tsx` 屬於未授權擴張（M5）。
- **Image 網域**：`FeaturedMembers` 與 `RecentStories` 使用 `<Image>`。`next.config.ts` 已列 `images.unsplash.com` 與 `i.pravatar.cc`，data 層若都使用這兩個域名則不需調整。若後續 data 用到其他 CDN 要同步更新 remotePatterns。

---

## SKL-OBS-001 觀察（第二次命中）

本次交付重現了 SKL-OBS-001 描述的模式：

| 偏離點 | 證據 | spec/task 原文 |
|--------|------|----------------|
| 主選單 6 項 → 5 項並重命名 | SiteHeader.tsx:9-15 | task §2.2「首頁 / 家族樹 / 人物 / 媒體 / Stories / 關於」 |
| 搜尋框 → 語言切換 placeholder | SiteHeader.tsx:55-65 | task §2.2「搜尋框（暫無功能）」 |
| 快速入口卡片 → StatsRow + FeaturedMembers | app/page.tsx | task §2.6「快速入口卡片（家族樹 / 媒體 / Stories）」 |
| 新增 `/members` 路由 | app/members/page.tsx | spec §5 路由表無此項；task 預估檔案無此項 |

這四項皆為「frontend-dev 自行判斷更好」→「靜默偏離 spec」→「未發 ESCALATION」。
所有偏離都不是錯誤的設計選擇（有的甚至更好看），但流程上違反
spec §11 SKL-OBS-001 的後續條件。

### 觸發後續處置（依 spec §11 SKL-OBS-001）

> 「若 TASK-003 以後再現類似『未經 ESCALATION 就偏離 spec』的模式，則回寫至
> `.claude/skills/code-style/references/lessons.md`，並在 frontend-dev agent
> definition 追加條目：『即便 spec 標為草稿，若驗收標準引用該章節，仍須按
> spec 命名或先行 ESCALATION 請求變更。』」

建議 Orchestrator 在本次修正循環結束後執行：
1. 在 `.claude/skills/code-style/references/lessons.md` 新增一則
   「spec-deviation without escalation」教訓條目，引用 TASK-008 M1/M2/M3/M5。
2. 在 `.claude/agents/frontend-dev.md` 追加行為約束：
   - 「主選單項目、導覽 label、首頁區塊組成等『用戶可見的資訊架構』屬於 spec
     管控項，變更前必須 ESCALATION。」
   - 「新增 task 預估檔案未列的 route，必須 ESCALATION。」

---

## 修正優先順序建議

**必做（阻擋通過）：**
1. H1 — 把 `/person/[id]` 接入 RoleContext（新建 client 子元件）
2. H2 — `RoleContext` 預設改為 `'guest'`
3. M1 — 主選單對齊 spec（或 ESCALATION），同時處理 M4 死鏈
4. M3 — 搜尋框 placeholder（或 ESCALATION）

**建議修正（同一輪內盡量處理）：**
5. M2 — 首頁補 QuickLinks 3 卡片
6. M5 — 決定 `/members` 去留

**加分項（可留待下一輪）：**
7. L1~L6 全部

---

## Verdict

**CHANGES REQUESTED** — 請 frontend-dev agent 認領修正，重點是 H1+H2。
通過修正後 re-review。本輪不寫入 commit。

Co-Audited-By: QA (Claude Opus 4.6)
