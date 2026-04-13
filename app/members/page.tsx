import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { persons } from '@/data/family'
import type { Person } from '@/types/family'

export const metadata: Metadata = {
  title: '成員名錄 — 林氏家族族譜',
}

const allPersons = Object.values(persons)
const deceased = allPersons.filter((p) => !p.isLiving)
const living = allPersons.filter((p) => p.isLiving)

interface PersonCardProps {
  person: Person
}

function PersonCard({ person }: PersonCardProps) {
  const yearRange = (() => {
    const birth = person.birthDate?.slice(0, 4) ?? '?'
    if (person.isLiving) return `${birth} – 至今`
    const death = person.deathDate?.slice(0, 4) ?? '?'
    return `${birth} – ${death}`
  })()

  return (
    <Link
      href={`/person/${person.id}`}
      className="group flex items-center gap-3 rounded-lg border border-webtrees-accent/20 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full bg-webtrees-surface">
        {person.photoUrl ? (
          <Image
            src={person.photoUrl}
            alt={person.fullName}
            fill
            sizes="56px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-2xl text-webtrees-muted/30">
            {person.gender === 'female' ? '👩' : '👨'}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-serif font-semibold text-webtrees-ink group-hover:text-webtrees-accent transition-colors">
          {person.fullName}
        </p>
        <p className="text-xs text-webtrees-muted">{yearRange}</p>
        {person.tags && person.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {person.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-webtrees-primary/10 px-1.5 py-0.5 text-xs text-webtrees-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

interface GroupProps {
  title: string
  members: Person[]
}

function MemberGroup({ title, members }: GroupProps) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 font-serif text-xl font-bold text-webtrees-ink">{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((person) => (
          <PersonCard key={person.id} person={person} />
        ))}
      </div>
    </section>
  )
}

export default function MembersPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-webtrees-ink">成員名錄</h1>
        <p className="mt-2 text-webtrees-muted">
          共 {allPersons.length} 位成員 — {living.length} 位在世，{deceased.length} 位已故
        </p>
      </div>
      <MemberGroup title={`在世成員（${living.length} 位）`} members={living} />
      <MemberGroup title={`已故成員（${deceased.length} 位）`} members={deceased} />
    </main>
  )
}
