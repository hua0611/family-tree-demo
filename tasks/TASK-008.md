# TASK-008 — 全站導覽列 + 首頁 + 角色切換模擬 + RWD

- Priority: P0
- Agent: frontend-dev
- Status: pending
- Dependencies: TASK-001, TASK-002
- Spec reference: `spec/current.md` §3.3, §3.6, §5, §7

## 描述

實作全站共用的導覽列、首頁、頁尾，以及 React Context 形式的角色切換器，並處理 RWD 主選單折疊。

## 具體工作

1. `context/RoleContext.tsx`：提供 `{ role, setRole }`，預設 `guest`
2. `components/layout/SiteHeader.tsx`：
   - Logo + 站名
   - 主選單（首頁 / 家族樹 / 人物 / 媒體 / Stories / 關於）
   - 右側：搜尋框（暫無功能）+ 角色切換下拉
   - 手機：漢堡選單折疊
3. `components/layout/RoleSwitcher.tsx`：下拉切換 admin / editor / guest
4. `components/layout/SiteFooter.tsx`：版權資訊 + 「Demo 網站」字樣
5. `app/layout.tsx`：包入 RoleContext Provider、SiteHeader、SiteFooter
6. `app/page.tsx`（首頁）：
   - Hero 區（家族簡介 + 代表照）
   - 快速入口卡片（家族樹 / 媒體 / Stories）
   - 最近 3 篇 stories 預覽

## 驗收標準

1. 全站任一頁面皆有相同的 Header 與 Footer
2. 角色切換下拉可切換 3 種角色，並在 `/person/[id]` 立即反映可見性差異
3. 手機（< 768px）下導覽列摺疊為漢堡選單，點擊可展開
4. 首頁顯示 Hero + 3 張快速入口卡片 + 最近 stories
5. Header 使用 Webtrees 風格深綠主色

## 預估檔案

- `context/RoleContext.tsx`
- `components/layout/SiteHeader.tsx`
- `components/layout/SiteFooter.tsx`
- `components/layout/RoleSwitcher.tsx`
- `components/layout/MobileNav.tsx`
- `app/layout.tsx`（修改）
- `app/page.tsx`（修改）
