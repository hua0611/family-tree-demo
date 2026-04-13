'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface NavItem {
  label: string
  href: string
}

interface MobileNavProps {
  items: NavItem[]
  open: boolean
  onClose: () => void
}

export function MobileNav({ items, open, onClose }: MobileNavProps) {
  const pathname = usePathname()

  useEffect(() => {
    if (!open) return

    document.body.style.overflow = 'hidden'

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <nav
        className="fixed left-0 top-0 z-50 flex h-full w-64 flex-col bg-webtrees-primary pt-16 shadow-xl"
        role="navigation"
        aria-label="手機導覽"
      >
        <ul className="flex flex-col">
          {items.map((item) => {
            const active = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`block px-6 py-3 text-base font-medium transition-colors ${
                    active
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}
