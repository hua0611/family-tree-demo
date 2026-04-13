# TASK-002 — 假資料與 TypeScript 型別定義

- Priority: P0
- Agent: frontend-dev
- Status: pending
- Dependencies: TASK-001
- Spec reference: `spec/current.md` §6

## 描述

建立型別化的家族假資料，約 20 位成員、4 代以上，搭配家庭關係、事件、媒體、stories，確保後續所有視覺化頁面有資料可渲染。

## 具體工作

1. `types/family.ts`：定義 `Person`, `Family`, `LifeEvent`, `MediaItem`, `Story`, `Role` interface（參考 spec §6）
2. `data/family.ts`：
   - 至少 20 筆 `Person` 資料，橫跨 4 代
   - 至少 8 筆 `Family` 資料建立父母 / 配偶 / 子女關係
   - 每人 2-5 筆 `LifeEvent`
   - 混合在世 / 已故，用於測試角色過濾
3. `data/media.ts`：25 筆 MediaItem，使用 placeholder URL（`https://picsum.photos/seed/...`）
4. `data/stories.ts`：5 篇 story，含 markdown 內文與封面
5. `lib/family-helpers.ts`：輔助函式
   - `getPersonById(id)`, `getParents(personId)`, `getChildren(personId)`, `getSpouses(personId)`
   - `getAncestors(personId, depth)`, `getDescendants(personId, depth)`
   - `isVisibleToRole(person, role)`
6. 資料必須能讓 Pedigree / Descendants / Fan / Hourglass 四種圖表從多個成員為根時正確渲染

## 驗收標準

1. `types/family.ts` 匯出所有 spec §6 定義的 interface，且 TypeScript strict 編譯無錯
2. `data/family.ts` 至少 20 筆 Person 且家族樹結構連通（無孤島，至少 4 代）
3. `lib/family-helpers.ts` 的 `getAncestors` / `getDescendants` 對任一節點呼叫皆能回傳正確結果
4. 資料中至少 5 位在世 / 15 位已故，用於角色過濾測試
5. 所有 placeholder 圖片使用一致的 seed 策略，可穩定重現

## 預估檔案

- `types/family.ts`
- `data/family.ts`
- `data/media.ts`
- `data/stories.ts`
- `lib/family-helpers.ts`
