'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import type { MediaItem, Person } from '@/types/family'

interface MediaFilterBarProps {
  totalCount: number
  filteredCount: number
  personsWithMedia: Person[]
  availableYears: string[]
  currentCategory: string
  currentPersonId: string
  currentYear: string
}

const CATEGORIES: { value: string; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'portrait', label: '人物肖像' },
  { value: 'family_event', label: '家族活動' },
  { value: 'location', label: '地點' },
  { value: 'document', label: '文件' },
  { value: 'other', label: '其他' },
]

export function MediaFilterBar({
  totalCount,
  filteredCount,
  personsWithMedia,
  availableYears,
  currentCategory,
  currentPersonId,
  currentYear,
}: MediaFilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === 'all' || value === '') {
        params.delete(key)
      } else {
        params.set(key, value)
      }
      const query = params.toString()
      router.push(query ? `/media?${query}` : '/media')
    },
    [router, searchParams]
  )

  const isFiltered =
    currentCategory !== 'all' || currentPersonId !== 'all' || currentYear !== 'all'

  return (
    <div className="bg-white border border-webtrees-primary/15 rounded-xl p-4 space-y-4 shadow-sm">
      {/* 分類 Tabs */}
      <div>
        <p className="text-xs text-webtrees-muted font-medium mb-2 uppercase tracking-wide">分類</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = currentCategory === cat.value
            return (
              <button
                key={cat.value}
                onClick={() => updateParam('category', cat.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-150
                  ${
                    isActive
                      ? 'bg-webtrees-primary text-white'
                      : 'bg-webtrees-primary/10 text-webtrees-primary hover:bg-webtrees-primary/20'
                  }`}
                aria-pressed={isActive}
              >
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* 人物 + 年份 下拉 */}
      <div className="flex flex-wrap gap-4">
        {/* 人物篩選 */}
        <div className="flex-1 min-w-[180px]">
          <label
            htmlFor="filter-person"
            className="text-xs text-webtrees-muted font-medium mb-1.5 uppercase tracking-wide block"
          >
            人物
          </label>
          <select
            id="filter-person"
            value={currentPersonId === 'all' ? '' : currentPersonId}
            onChange={(e) => updateParam('person', e.target.value || 'all')}
            className="w-full border border-webtrees-primary/20 rounded-lg px-3 py-2 text-sm
              bg-white text-webtrees-ink focus:outline-none focus:ring-2
              focus:ring-webtrees-primary/40 focus:border-webtrees-primary"
          >
            <option value="">全部人物</option>
            {personsWithMedia.map((person) => (
              <option key={person.id} value={person.id}>
                {person.fullName}
              </option>
            ))}
          </select>
        </div>

        {/* 年份篩選 */}
        <div className="flex-1 min-w-[140px]">
          <label
            htmlFor="filter-year"
            className="text-xs text-webtrees-muted font-medium mb-1.5 uppercase tracking-wide block"
          >
            年份
          </label>
          <select
            id="filter-year"
            value={currentYear === 'all' ? '' : currentYear}
            onChange={(e) => updateParam('year', e.target.value || 'all')}
            className="w-full border border-webtrees-primary/20 rounded-lg px-3 py-2 text-sm
              bg-white text-webtrees-ink focus:outline-none focus:ring-2
              focus:ring-webtrees-primary/40 focus:border-webtrees-primary"
          >
            <option value="">全部年份</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 結果統計 + 清除篩選 */}
      <div className="flex items-center justify-between pt-1 border-t border-webtrees-primary/10">
        <p className="text-sm text-webtrees-muted">
          顯示{' '}
          <span className="font-semibold text-webtrees-ink">{filteredCount}</span>
          {' / '}
          <span>{totalCount}</span>
          {' 項媒體'}
        </p>
        {isFiltered && (
          <button
            onClick={() => router.push('/media')}
            className="text-xs text-webtrees-accent hover:text-webtrees-primary underline
              transition-colors duration-150"
          >
            清除篩選
          </button>
        )}
      </div>
    </div>
  )
}
