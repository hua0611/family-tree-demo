'use client'

import { useRole } from '@/context/RoleContext'
import { BiographySection } from './BiographySection'
import type { Person } from '@/types/family'

interface BiographySectionClientProps {
  person: Person
}

export function BiographySectionClient({ person }: BiographySectionClientProps) {
  const { role } = useRole()

  // guest 角色看不到在世人物的 biography
  const isHidden = role === 'guest' && person.isLiving

  return <BiographySection person={person} isHidden={isHidden} />
}
