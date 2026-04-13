// lib/family-helpers.ts
// 純函式工具集，無 side effect
// 嚴格符合 TypeScript strict + noUncheckedIndexedAccess

import { persons, families } from '@/data/family'
import type { Person, Family, LifeEvent, PersonId, FamilyId, Role } from '@/types/family'

// ─── 基礎查詢 ─────────────────────────────────────────────────────────────────

export function getPerson(id: PersonId): Person | undefined {
  return persons[id]
}

export function getFamily(id: FamilyId): Family | undefined {
  return families[id]
}

// ─── 關係查詢 ─────────────────────────────────────────────────────────────────

/**
 * 取得指定人物的父母（最多 2 人：父 + 母）
 */
export function getParents(personId: PersonId): Person[] {
  const person = persons[personId]
  if (person === undefined) return []

  const { parentFamilyId } = person
  if (parentFamilyId === undefined) return []

  const family = families[parentFamilyId]
  if (family === undefined) return []

  const result: Person[] = []

  const { husbandId, wifeId } = family
  if (husbandId !== undefined) {
    const husband = persons[husbandId]
    if (husband !== undefined) result.push(husband)
  }
  if (wifeId !== undefined) {
    const wife = persons[wifeId]
    if (wife !== undefined) result.push(wife)
  }

  return result
}

/**
 * 取得指定人物的所有子女
 */
export function getChildren(personId: PersonId): Person[] {
  // 蒐集此人所屬的所有婚姻家庭
  const person = persons[personId]
  if (person === undefined) return []

  const result: Person[] = []

  for (const familyId of person.spouseFamilyIds) {
    const family = families[familyId]
    if (family === undefined) continue

    for (const childId of family.childrenIds) {
      const child = persons[childId]
      if (child !== undefined) result.push(child)
    }
  }

  return result
}

/**
 * 取得指定人物的所有配偶
 */
export function getSpouses(personId: PersonId): Person[] {
  const person = persons[personId]
  if (person === undefined) return []

  const result: Person[] = []

  for (const familyId of person.spouseFamilyIds) {
    const family = families[familyId]
    if (family === undefined) continue

    const { husbandId, wifeId } = family

    // 配偶是家庭中另一方
    if (husbandId !== undefined && husbandId !== personId) {
      const spouse = persons[husbandId]
      if (spouse !== undefined) result.push(spouse)
    }
    if (wifeId !== undefined && wifeId !== personId) {
      const spouse = persons[wifeId]
      if (spouse !== undefined) result.push(spouse)
    }
  }

  return result
}

/**
 * 取得指定人物的所有兄弟姊妹（同一父母家庭，但不含自身）
 */
export function getSiblings(personId: PersonId): Person[] {
  const person = persons[personId]
  if (person === undefined) return []

  const { parentFamilyId } = person
  if (parentFamilyId === undefined) return []

  const family = families[parentFamilyId]
  if (family === undefined) return []

  const result: Person[] = []

  for (const siblingId of family.childrenIds) {
    if (siblingId === personId) continue
    const sibling = persons[siblingId]
    if (sibling !== undefined) result.push(sibling)
  }

  return result
}

// ─── 遞迴樹形查詢 ─────────────────────────────────────────────────────────────

/**
 * 取得指定人物的祖先（預設向上無限代）
 * @param personId 起始人物 ID
 * @param generations 要往上追溯幾代（undefined = 無限）
 */
export function getAncestors(personId: PersonId, generations?: number): Person[] {
  if (generations !== undefined && generations <= 0) return []

  const parents = getParents(personId)
  if (parents.length === 0) return []

  const result: Person[] = [...parents]
  const nextGenerations = generations !== undefined ? generations - 1 : undefined

  for (const parent of parents) {
    const grandparents = getAncestors(parent.id, nextGenerations)
    result.push(...grandparents)
  }

  return result
}

/**
 * 取得指定人物的後代（預設向下無限代）
 * @param personId 起始人物 ID
 * @param generations 要往下追溯幾代（undefined = 無限）
 */
export function getDescendants(personId: PersonId, generations?: number): Person[] {
  if (generations !== undefined && generations <= 0) return []

  const children = getChildren(personId)
  if (children.length === 0) return []

  const result: Person[] = [...children]
  const nextGenerations = generations !== undefined ? generations - 1 : undefined

  for (const child of children) {
    const grandchildren = getDescendants(child.id, nextGenerations)
    result.push(...grandchildren)
  }

  return result
}

// ─── 時間軸工具 ───────────────────────────────────────────────────────────────

/**
 * 將人物的 LifeEvent 依日期由舊至新排序
 * 支援 '1945', '1945-03', '1945-03-12' 等格式
 */
export function getEventsByYear(person: Person): LifeEvent[] {
  return [...person.events].sort((a, b) => {
    const dateA = a.date.padEnd(10, '-01')
    const dateB = b.date.padEnd(10, '-01')
    return dateA.localeCompare(dateB)
  })
}

// ─── 日期格式化 ───────────────────────────────────────────────────────────────

/**
 * 格式化人物的生卒年區間，例如 "1920 – 1995" 或 "1920 – 至今"
 */
export function formatDateRange(person: Person): string {
  const birthYear = extractYear(person.birthDate)
  const deathYear = extractYear(person.deathDate)

  const birth = birthYear ?? '?'
  const death = person.isLiving ? '至今' : (deathYear ?? '?')

  return `${birth} – ${death}`
}

function extractYear(dateStr: string | undefined): string | undefined {
  if (dateStr === undefined) return undefined
  const match = /^(\d{4})/.exec(dateStr)
  return match !== null ? match[1] : undefined
}

// ─── 年齡計算 ─────────────────────────────────────────────────────────────────

/**
 * 計算人物年齡
 * @param person 人物
 * @param atDate 指定計算日期（ISO 格式，預設為今天）
 * @returns 年齡數字，若無出生日期則回傳 undefined
 */
export function getAge(person: Person, atDate?: string): number | undefined {
  if (person.birthDate === undefined) return undefined

  const refDateStr = atDate ?? new Date().toISOString().slice(0, 10)
  const refYear = parseInt(refDateStr.slice(0, 4), 10)
  const birthYear = parseInt(person.birthDate.slice(0, 4), 10)

  if (isNaN(refYear) || isNaN(birthYear)) return undefined

  const refMonth = parseInt(refDateStr.slice(5, 7) || '1', 10)
  const refDay = parseInt(refDateStr.slice(8, 10) || '1', 10)

  const birthMonthStr = person.birthDate.slice(5, 7)
  const birthDayStr = person.birthDate.slice(8, 10)
  const birthMonth = birthMonthStr.length > 0 ? parseInt(birthMonthStr, 10) : 1
  const birthDay = birthDayStr.length > 0 ? parseInt(birthDayStr, 10) : 1

  let age = refYear - birthYear
  if (refMonth < birthMonth || (refMonth === birthMonth && refDay < birthDay)) {
    age -= 1
  }

  return age >= 0 ? age : undefined
}

// ─── 角色可見性 ───────────────────────────────────────────────────────────────

/**
 * 根據使用者角色判斷是否可見某人物
 * - admin：全部可見
 * - editor：可見，但在世人物隱藏部分隱私欄位（呼叫端自行處理欄位過濾）
 * - guest：僅可見已故人物
 */
export function isVisibleToRole(person: Person, role: Role): boolean {
  if (role === 'admin') return true
  if (role === 'editor') return true
  // guest 只能看已故人物
  return !person.isLiving
}

/**
 * 對 editor/guest 隱藏在世人物的隱私欄位，回傳安全版本的 Person
 */
export function sanitizePersonForRole(person: Person, role: Role): Person {
  if (role === 'admin') return person
  if (!person.isLiving) return person

  // 在世人物對 editor/guest 隱藏出生日期與地點以外的詳細資訊
  if (role === 'editor') {
    return {
      ...person,
      biography: undefined,
      events: person.events.filter((e) => e.type === 'birth'),
    }
  }

  // guest 根本看不到在世人物（isVisibleToRole 會先過濾）
  return person
}
