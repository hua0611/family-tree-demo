'use client'

import { RoleProvider } from '@/context/RoleContext'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return <RoleProvider>{children}</RoleProvider>
}
