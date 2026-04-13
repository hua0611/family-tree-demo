interface StatCardProps {
  value: number | string
  label: string
  icon: string
}

function StatCard({ value, label, icon }: StatCardProps) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl border border-webtrees-accent/20 bg-white px-6 py-5 shadow-sm">
      <span className="text-3xl" role="img" aria-hidden="true">
        {icon}
      </span>
      <span className="text-2xl font-bold text-webtrees-primary">{value}</span>
      <span className="text-sm text-webtrees-muted">{label}</span>
    </div>
  )
}

interface StatsRowProps {
  memberCount: number
  generationCount: number
  mediaCount: number
  storyCount: number
}

export function StatsRow({ memberCount, generationCount, mediaCount, storyCount }: StatsRowProps) {
  return (
    <section className="py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard value={memberCount} label="家族成員" icon="👥" />
          <StatCard value={generationCount} label="世代" icon="🌿" />
          <StatCard value={mediaCount} label="相片" icon="📷" />
          <StatCard value={storyCount} label="故事" icon="📖" />
        </div>
      </div>
    </section>
  )
}
