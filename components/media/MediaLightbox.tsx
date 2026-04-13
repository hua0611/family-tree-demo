'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { MediaItem } from '@/types/family'

interface MediaLightboxProps {
  items: MediaItem[]
  currentIndex: number
  /** The base query string (without lightbox param) for building navigation URLs */
  baseSearchParams: string
}

function buildLightboxUrl(baseSearchParams: string, id: string): string {
  const qs = baseSearchParams ? `${baseSearchParams}&lightbox=${id}` : `lightbox=${id}`
  return `/media?${qs}`
}

function buildCloseUrl(baseSearchParams: string): string {
  return baseSearchParams ? `/media?${baseSearchParams}` : '/media'
}

export function MediaLightbox({ items, currentIndex, baseSearchParams }: MediaLightboxProps) {
  const router = useRouter()
  const item = items[currentIndex]!
  const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null
  const nextItem = currentIndex < items.length - 1 ? items[currentIndex + 1] : null

  const closeUrl = buildCloseUrl(baseSearchParams)
  const prevUrl = prevItem ? buildLightboxUrl(baseSearchParams, prevItem.id) : null
  const nextUrl = nextItem ? buildLightboxUrl(baseSearchParams, nextItem.id) : null

  const handleClose = useCallback(() => {
    router.push(closeUrl)
  }, [router, closeUrl])

  const handlePrev = useCallback(() => {
    if (prevUrl) router.push(prevUrl)
  }, [router, prevUrl])

  const handleNext = useCallback(() => {
    if (nextUrl) router.push(nextUrl)
  }, [router, nextUrl])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleClose, handlePrev, handleNext])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-webtrees-ink/80 backdrop-blur-sm"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
    >
      {/* 內容容器：阻止點擊穿透 */}
      <div
        className="relative max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 關閉按鈕 */}
        <Link
          href={closeUrl}
          className="absolute -top-10 right-0 text-white/80 hover:text-white
            text-sm font-medium transition-colors duration-150 z-10"
          aria-label="關閉"
          onClick={(e) => e.stopPropagation()}
        >
          ✕ 關閉（Esc）
        </Link>

        {/* 圖片容器 */}
        <div className="relative w-full aspect-video max-h-[70vh] bg-black rounded-t-xl overflow-hidden">
          <Image
            src={item.url}
            alt={item.title}
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 100vw, 896px"
          />

          {/* 左右導覽 */}
          {prevUrl && (
            <Link
              href={prevUrl}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full
                bg-white/20 hover:bg-white/40 flex items-center justify-center
                text-white transition-colors duration-150"
              aria-label="上一張"
              onClick={(e) => e.stopPropagation()}
            >
              ‹
            </Link>
          )}
          {nextUrl && (
            <Link
              href={nextUrl}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full
                bg-white/20 hover:bg-white/40 flex items-center justify-center
                text-white transition-colors duration-150"
              aria-label="下一張"
              onClick={(e) => e.stopPropagation()}
            >
              ›
            </Link>
          )}
        </div>

        {/* 標題與說明 */}
        <div className="bg-white rounded-b-xl px-5 py-4">
          <h2 className="text-lg font-semibold text-webtrees-ink">{item.title}</h2>
          {item.date && (
            <p className="text-sm text-webtrees-muted mt-0.5">{item.date}</p>
          )}
          {item.description && (
            <p className="text-sm text-webtrees-ink mt-2 leading-relaxed">{item.description}</p>
          )}
          <div className="mt-3">
            <Link
              href={`/media/${item.id}`}
              className="text-xs text-webtrees-accent hover:text-webtrees-primary underline"
              onClick={(e) => e.stopPropagation()}
            >
              查看詳細頁面
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
