'use client'

import { useRef, useState } from 'react'
import { useRole } from '@/context/RoleContext'
import type { Role } from '@/types/family'

const ROLE_LABELS: Record<Role, string> = {
  admin: '管理員',
  editor: '編輯者',
  guest: '訪客',
}

const ROLE_OPTIONS: Role[] = ['admin', 'editor', 'guest']

export function RoleSwitcher() {
  const { role, setRole } = useRole()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  function handleSelect(r: Role) {
    setRole(r)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded bg-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/20 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-xs opacity-70">角色：</span>
        <span className="font-medium">{ROLE_LABELS[role]}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`}
        >
          <path
            fillRule="evenodd"
            d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full mt-1 min-w-[120px] overflow-hidden rounded border border-gray-200 bg-white shadow-lg z-50"
        >
          {ROLE_OPTIONS.map((r) => (
            <li key={r}>
              <button
                type="button"
                role="option"
                aria-selected={r === role}
                onClick={() => handleSelect(r)}
                className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-webtrees-surface ${
                  r === role
                    ? 'bg-webtrees-primary/10 font-medium text-webtrees-primary'
                    : 'text-webtrees-ink'
                }`}
              >
                {ROLE_LABELS[r]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
