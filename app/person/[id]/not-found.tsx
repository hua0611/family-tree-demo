import Link from 'next/link'

export default function PersonNotFound() {
  return (
    <main className="min-h-screen bg-webtrees-surface flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-6xl select-none" aria-hidden>
          🔍
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-webtrees-ink mb-2">
            找不到此人物
          </h1>
          <p className="text-webtrees-muted text-sm leading-relaxed">
            此人物 ID 不存在，或資料尚未建立。
            <br />
            請確認連結是否正確。
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg
              bg-webtrees-primary text-white text-sm font-medium
              hover:bg-webtrees-primary/90 transition-colors"
          >
            回首頁
          </Link>
          <Link
            href="/members"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg
              border border-webtrees-primary/30 text-webtrees-primary text-sm font-medium
              hover:bg-webtrees-primary/5 transition-colors"
          >
            瀏覽家族成員
          </Link>
        </div>
      </div>
    </main>
  )
}
