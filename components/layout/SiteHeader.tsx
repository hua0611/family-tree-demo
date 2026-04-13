'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { RoleSwitcher } from './RoleSwitcher'
import { MobileNav } from './MobileNav'

const NAV_ITEMS = [
  { label: '首頁', href: '/' },
  { label: '家族樹', href: '/tree/p-001' },
  { label: '成員名錄', href: '/members' },
  { label: '相簿', href: '/media' },
  { label: '故事', href: '/stories' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-30 bg-webtrees-primary shadow-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Left: Logo + site name */}
          <Link href="/" className="flex items-center gap-2 text-white">
            <span className="text-2xl leading-none" role="img" aria-label="家族樹">
              🌳
            </span>
            <span className="font-serif text-lg font-bold tracking-wide">林氏家族</span>
          </Link>

          {/* Center: Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="主導覽">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Right: Role switcher + language placeholder + hamburger */}
          <div className="flex items-center gap-2">
            {/* Language placeholder */}
            <button
              type="button"
              disabled
              className="hidden sm:flex items-center gap-1 rounded px-2 py-1.5 text-xs text-white/50 cursor-not-allowed"
              title="語言切換（尚未實作）"
            >
              <span>繁</span>
              <span className="opacity-50">|</span>
              <span className="opacity-50">EN</span>
            </button>

            <RoleSwitcher />

            {/* Hamburger — mobile only */}
            <button
              type="button"
              className="flex md:hidden items-center justify-center rounded p-1.5 text-white hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="開啟導覽選單"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <MobileNav
        items={NAV_ITEMS}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
    </>
  )
}
