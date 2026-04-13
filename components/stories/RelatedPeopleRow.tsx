import Link from 'next/link'
import Image from 'next/image'
import type { PersonId } from '@/types/family'
import { getPerson } from '@/lib/family-helpers'

interface RelatedPeopleRowProps {
  personIds: PersonId[]
}

export function RelatedPeopleRow({ personIds }: RelatedPeopleRowProps) {
  if (personIds.length === 0) return null

  const persons = personIds
    .map((id) => getPerson(id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined)

  if (persons.length === 0) return null

  return (
    <section className="mt-12 border-t border-webtrees-primary/15 pt-8">
      <h2 className="text-lg font-serif font-bold text-webtrees-ink mb-5">相關家族成員</h2>

      {/* 水平滾動列 */}
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1
        scrollbar-thin scrollbar-thumb-webtrees-primary/30 scrollbar-track-transparent">
        {persons.map((person) => (
          <Link
            key={person.id}
            href={`/person/${person.id}`}
            className="group flex-shrink-0 flex flex-col items-center gap-2 w-20
              text-center transition-opacity duration-200 hover:opacity-80"
          >
            {/* 頭像 */}
            {person.photoUrl ? (
              <div className="w-16 h-16 rounded-full overflow-hidden
                border-2 border-webtrees-primary/30 group-hover:border-webtrees-primary
                transition-colors duration-200">
                <Image
                  src={person.photoUrl}
                  alt={person.fullName}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-full border-2 border-webtrees-primary/30
                group-hover:border-webtrees-primary bg-webtrees-primary/10
                flex items-center justify-center transition-colors duration-200
                text-xl font-serif text-webtrees-primary font-bold select-none">
                {person.surname.charAt(0)}
              </div>
            )}

            {/* 姓名 */}
            <span className="text-xs text-webtrees-ink group-hover:text-webtrees-primary
              transition-colors duration-200 leading-snug font-medium">
              {person.fullName}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
