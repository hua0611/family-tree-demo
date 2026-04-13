import { persons, rootPersonId } from '@/data/family'
import { mediaItems } from '@/data/media'
import { stories } from '@/data/stories'
import { getChildren } from '@/lib/family-helpers'
import { HeroSection } from '@/components/home/HeroSection'
import { StatsRow } from '@/components/home/StatsRow'
import { FeaturedMembers } from '@/components/home/FeaturedMembers'
import { RecentStories } from '@/components/home/RecentStories'

// Derive stats at build time (Server Component)
const allPersons = Object.values(persons)
const memberCount = allPersons.length
const generationCount = 5
const mediaCount = mediaItems.length
const storyCount = stories.length

// Featured members: root + direct children (up to 6)
const rootPerson = persons[rootPersonId]
const rootChildren = getChildren(rootPersonId)
const featuredMembers = rootPerson
  ? [rootPerson, ...rootChildren].slice(0, 6)
  : rootChildren.slice(0, 6)

// Recent stories: latest 3 by publishedAt
const recentStories = [...stories]
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  .slice(0, 3)

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <StatsRow
        memberCount={memberCount}
        generationCount={generationCount}
        mediaCount={mediaCount}
        storyCount={storyCount}
      />
      <FeaturedMembers members={featuredMembers} />
      <RecentStories stories={recentStories} />
    </main>
  )
}
