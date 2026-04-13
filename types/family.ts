// types/family.ts

export type PersonId = string
export type FamilyId = string
export type MediaId = string
export type StoryId = string

export type Gender = 'male' | 'female' | 'unknown'

export type Role = 'admin' | 'editor' | 'guest'

export type EventType =
  | 'birth'
  | 'death'
  | 'marriage'
  | 'divorce'
  | 'baptism'
  | 'graduation'
  | 'immigration'
  | 'education'
  | 'career'
  | 'migration'
  | 'custom'
  | 'other'

export interface LifeEvent {
  id: string
  type: EventType
  date: string // ISO-ish, accepts '1945', '1945-03', '1945-03-12'
  place?: string
  description?: string
}

export interface Person {
  id: PersonId
  givenName: string       // 名
  surname: string         // 姓
  fullName: string        // 完整顯示名（含別名等）
  gender: Gender
  birthDate?: string
  birthPlace?: string
  deathDate?: string      // 若健在則 undefined
  deathPlace?: string
  isLiving: boolean
  photoUrl?: string       // placeholder 照片
  biography?: string      // 1-3 段傳記
  events: LifeEvent[]
  parentFamilyId?: FamilyId     // 出生所屬家庭
  spouseFamilyIds: FamilyId[]   // 婚姻家庭（可多個）
  tags?: string[]               // 例如 '長子' '族長'
}

export interface Family {
  id: FamilyId
  husbandId?: PersonId
  wifeId?: PersonId
  marriageDate?: string
  marriagePlace?: string
  divorceDate?: string
  childrenIds: PersonId[]
}

export interface MediaItem {
  id: MediaId
  title: string
  url: string              // placeholder 圖片 URL
  thumbnailUrl?: string
  category: 'portrait' | 'family_event' | 'location' | 'document' | 'other'
  type: 'photo' | 'document'
  date?: string
  description?: string
  relatedPersonIds: PersonId[]
  relatedFamilyIds?: FamilyId[]
  tags: string[]
}

export interface Story {
  id: StoryId
  title: string
  excerpt: string          // 摘要 1-2 句
  content: string          // Markdown 或純文字，3-8 段
  coverUrl?: string
  publishedAt: string      // ISO date
  authorId?: PersonId      // 作者可以是家族成員
  relatedPersonIds: PersonId[]
  tags?: string[]
}
