# TASK-006 — 媒體庫相簿頁

- Priority: P1
- Agent: frontend-dev
- Status: pending
- Dependencies: TASK-002
- Spec reference: `spec/current.md` §3.4

## 描述

實作 `/media` 與 `/media/[id]` 頁面，以網格瀏覽家族相簿，並支援依人物 / 事件 / 年份切換分類。

## 具體工作

1. `app/media/page.tsx`：
   - 分類切換 Tab（依人物 / 依事件 / 依年份）
   - 網格佈局：桌機 4 欄、平板 3 欄、手機 2 欄
2. `components/media/MediaGrid.tsx`：網格容器
3. `components/media/MediaCard.tsx`：縮圖 + hover 顯示標題
4. `components/media/MediaLightbox.tsx`：點擊縮圖開啟全螢幕 Lightbox
5. `app/media/[id]/page.tsx`：單筆媒體詳細頁（大圖 + metadata + 關聯人物連結）

## 驗收標準

1. 媒體庫至少顯示 20 筆假資料
2. 分類切換後網格正確過濾
3. Lightbox 可用 Esc 或點擊背景關閉，且支援左右鍵切換
4. 每張圖片 `alt` 為媒體標題（無障礙）
5. 點擊媒體詳細頁上的關聯人物可跳至其個人頁

## 預估檔案

- `app/media/page.tsx`
- `app/media/[id]/page.tsx`
- `components/media/MediaGrid.tsx`
- `components/media/MediaCard.tsx`
- `components/media/MediaLightbox.tsx`
