# TASK-005 — 人物個人頁（基本資料 + 時間軸 + 關係）

- Priority: P0
- Agent: frontend-dev
- Status: pending
- Dependencies: TASK-002
- Spec reference: `spec/current.md` §3.2, §3.3, §5

## 描述

實作 `/person/[id]` 頁面：左側人物卡（照片 + 基本資料）、右側事件時間軸 + 家庭關係區塊。需依照目前角色過濾在世人物的敏感資料。

## 具體工作

1. `app/person/[id]/page.tsx`：讀取人物 + 角色 context，組裝左右欄
2. `components/person/PersonHeader.tsx`：大頭照、姓名、性別、生卒資訊、出生地
3. `components/person/EventTimeline.tsx`：
   - 垂直時間軸列出 LifeEvent
   - 不同事件類型使用不同 icon / 顏色
4. `components/person/RelationPanel.tsx`：
   - 父母（連結到各自個人頁）
   - 配偶、子女
   - 兄弟姊妹
5. 角色過濾：在世人物於訪客角色下只顯示姓名 + 「（隱私保護）」字樣
6. 麵包屑：首頁 / 人物列表 / {姓名}

## 驗收標準

1. 任一假資料成員頁面能完整渲染（不 crash）
2. 在世人物於訪客角色下敏感資料隱藏，管理員角色可見完整資料
3. 事件時間軸至少顯示 3 筆事件，按日期排序
4. 關係區塊的所有連結皆可正確跳轉至對應個人頁
5. 頁面 RWD：手機下左右欄改為上下堆疊

## 預估檔案

- `app/person/[id]/page.tsx`
- `components/person/PersonHeader.tsx`
- `components/person/EventTimeline.tsx`
- `components/person/RelationPanel.tsx`
- `components/common/Breadcrumb.tsx`
