import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPerson, formatDateRange } from '@/lib/family-helpers'
import { PedigreeChart } from '@/components/tree/PedigreeChart'
import { DescendantChart } from '@/components/tree/DescendantChart'
import { FanChart } from '@/components/tree/FanChart'
import { HourglassChart } from '@/components/tree/HourglassChart'

interface TreePageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ view?: string }>
}

type ViewType = 'pedigree' | 'descendants' | 'fan' | 'hourglass'

const TAB_LABELS: Record<ViewType, string> = {
  pedigree: '祖先圖',
  descendants: '後代圖',
  fan: '扇形圖',
  hourglass: '沙漏圖',
}

const ALL_VIEWS: ViewType[] = ['pedigree', 'descendants', 'fan', 'hourglass']

/**
 * /tree/[id] — 家族樹頁面（Server Component）
 * 支援 ?view=pedigree（祖先圖，預設）| descendants | fan | hourglass
 */
export default async function TreePage({ params, searchParams }: TreePageProps) {
  const { id } = await params
  const { view } = await searchParams

  const person = getPerson(id)
  if (person === undefined) {
    notFound()
  }

  const activeView: ViewType =
    view === 'descendants' ? 'descendants'
    : view === 'fan' ? 'fan'
    : view === 'hourglass' ? 'hourglass'
    : 'pedigree'

  return (
    <div className="min-h-screen bg-webtrees-surface">
      {/* 頂部麵包屑 */}
      <nav className="bg-webtrees-primary text-white px-4 py-2 text-sm flex items-center gap-1">
        <Link href="/" className="hover:underline opacity-80">
          首頁
        </Link>
        <span className="opacity-50 mx-1">/</span>
        <span className="opacity-80">家族樹</span>
        <span className="opacity-50 mx-1">/</span>
        <span className="font-medium">{person.fullName}</span>
      </nav>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-40px)]">
        {/* 主體區域 */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Tab 切換（4 個 view） */}
          <div className="flex flex-wrap border-b border-gray-200 bg-white px-4 pt-3 gap-0">
            {ALL_VIEWS.map((v, i) => (
              <Link
                key={v}
                href={`/tree/${id}?view=${v}`}
                className={[
                  'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
                  i < ALL_VIEWS.length - 1 ? 'mr-1' : '',
                  activeView === v
                    ? 'border-webtrees-primary text-webtrees-primary'
                    : 'border-transparent text-webtrees-muted hover:text-webtrees-ink hover:border-gray-300',
                ].join(' ')}
              >
                {TAB_LABELS[v]}
              </Link>
            ))}
          </div>

          {/* 圖表區域 */}
          <div className="flex-1 p-2 bg-gray-50">
            {activeView === 'pedigree' && (
              <PedigreeChart rootId={id} maxDepth={4} height={580} />
            )}
            {activeView === 'descendants' && (
              <DescendantChart rootId={id} maxDepth={3} height={580} />
            )}
            {activeView === 'fan' && (
              <FanChart rootId={id} maxDepth={4} size={780} />
            )}
            {activeView === 'hourglass' && (
              <HourglassChart rootId={id} ancestorDepth={3} descendantDepth={3} height={780} />
            )}
          </div>
        </main>

        {/* 右側 Sidebar（桌機） / 底部（手機） */}
        <aside className="w-full lg:w-72 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 p-4 shrink-0">
          <h2 className="text-base font-semibold text-webtrees-ink mb-3">人物資訊</h2>

          {/* 照片 + 姓名 */}
          <div className="flex items-center gap-3 mb-4">
            {person.photoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={person.photoUrl}
                alt={person.fullName}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
            )}
            <div>
              <div className="font-semibold text-webtrees-ink">{person.fullName}</div>
              <div className="text-sm text-webtrees-muted">{formatDateRange(person)}</div>
              {person.isLiving && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  <span className="text-xs text-green-600">在世</span>
                </div>
              )}
            </div>
          </div>

          {/* 詳細資訊 */}
          <dl className="space-y-2 text-sm mb-4">
            {person.birthDate && (
              <>
                <dt className="text-webtrees-muted text-xs">出生</dt>
                <dd className="text-webtrees-ink">
                  {person.birthDate}
                  {person.birthPlace && <span className="text-webtrees-muted ml-1">· {person.birthPlace}</span>}
                </dd>
              </>
            )}
            {person.deathDate && (
              <>
                <dt className="text-webtrees-muted text-xs mt-2">辭世</dt>
                <dd className="text-webtrees-ink">
                  {person.deathDate}
                  {person.deathPlace && <span className="text-webtrees-muted ml-1">· {person.deathPlace}</span>}
                </dd>
              </>
            )}
          </dl>

          {/* 跳轉到個人頁 */}
          <Link
            href={`/person/${id}`}
            className="block w-full text-center text-sm bg-webtrees-primary text-white rounded px-4 py-2 hover:bg-webtrees-primary/90 transition-colors"
          >
            查看完整資料
          </Link>

          {/* 切換到其他成員的家族樹 */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-webtrees-muted">點擊圖表中的節點可切換至該成員的家族樹。</p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const person = getPerson(id)
  if (person === undefined) return { title: '找不到成員' }
  return {
    title: `${person.fullName} — 家族樹`,
    description: `${person.fullName} 的祖先圖、後代圖、扇形圖與沙漏圖`,
  }
}
