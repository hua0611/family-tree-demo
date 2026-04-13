# TASK-007 — Stories 列表與文章頁

- Priority: P1
- Agent: frontend-dev
- Status: pending
- Dependencies: TASK-002
- Spec reference: `spec/current.md` §3.5

## 描述

實作 `/stories` 列表頁與 `/stories/[id]` 文章頁，渲染家族故事的 Markdown 內容與關聯人物連結。

## 具體工作

1. `app/stories/page.tsx`：
   - Grid 或 List of `StoryCard`
   - 每張卡顯示封面 / 標題 / 作者 / 發布日期 / 摘要
2. `app/stories/[id]/page.tsx`：
   - 標題 + 封面 + 作者 + 日期
   - Markdown 內文渲染（可使用 `react-markdown` 或 Next.js 內建 MDX）
   - 底部顯示關聯家族成員連結
3. `components/stories/StoryCard.tsx`

## 驗收標準

1. Stories 列表至少顯示 5 篇假資料
2. 文章頁 Markdown 正確渲染（含標題階層、粗體、清單）
3. 關聯人物連結可跳轉至 `/person/[id]`
4. 列表頁 RWD 在手機下改為單欄卡片

## 預估檔案

- `app/stories/page.tsx`
- `app/stories/[id]/page.tsx`
- `components/stories/StoryCard.tsx`
- `lib/markdown.ts`（若使用 react-markdown 則封裝設定）
