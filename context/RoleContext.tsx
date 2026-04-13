'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { Role } from '@/types/family'

interface RoleContextValue {
  role: Role
  setRole: (r: Role) => void
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined)

interface RoleProviderProps {
  children: React.ReactNode
}

export function RoleProvider({ children }: RoleProviderProps) {
  const [role, setRoleState] = useState<Role>('admin')

  useEffect(() => {
    const stored = localStorage.getItem('role') as Role | null
    if (stored === 'admin' || stored === 'editor' || stored === 'guest') {
      setRoleState(stored)
    }
  }, [])

  function setRole(r: Role) {
    setRoleState(r)
    localStorage.setItem('role', r)
  }

  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>
}

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext)
  if (ctx === undefined) {
    throw new Error('useRole must be used within a RoleProvider')
  }
  return ctx
}
