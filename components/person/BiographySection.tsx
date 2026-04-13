import type { Person } from '@/types/family'

interface BiographySectionProps {
  person: Person
  isHidden?: boolean
}

export function BiographySection({ person, isHidden = false }: BiographySectionProps) {
  const { biography, isLiving, fullName } = person

  if (isHidden) {
    return (
      <section className="wt-card p-6">
        <h2 className="wt-section-title">個人簡介</h2>
        <p className="text-webtrees-muted italic">
          此內容僅對已登入成員可見（請切換為「編輯者」或「管理員」角色）
        </p>
      </section>
    )
  }

  if (biography === undefined || biography.trim() === '') {
    if (isLiving) {
      return (
        <div className="bg-webtrees-surface border border-webtrees-primary/15 rounded-lg p-5">
          <h2 className="text-base font-semibold text-webtrees-ink mb-2">個人簡介</h2>
          <p className="text-sm text-webtrees-muted italic">
            {fullName} 目前在世，其個人資料受到隱私保護。
          </p>
        </div>
      )
    }
    // 已故且無傳記：顯示空狀態而非 null
    return (
      <section className="wt-card p-6">
        <h2 className="wt-section-title">個人簡介</h2>
        <p className="text-webtrees-muted italic">尚無個人簡介</p>
      </section>
    )
  }

  // 依換行符切段
  const paragraphs = biography.split('\n').filter((p) => p.trim() !== '')

  return (
    <div className="bg-webtrees-surface border border-webtrees-primary/15 rounded-lg p-5">
      <h2 className="text-base font-semibold text-webtrees-ink mb-4">個人簡介</h2>
      <div className="space-y-3">
        {paragraphs.map((para, idx) => (
          <p key={idx} className="text-sm text-webtrees-ink leading-relaxed">
            {para}
          </p>
        ))}
      </div>
    </div>
  )
}
