import Link from 'next/link'

export function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-webtrees-primary to-webtrees-primary/80 py-20 text-white">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h1 className="font-serif text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          歡迎來到林氏家族族譜
        </h1>
        <p className="mt-4 text-base text-white/80 sm:text-lg">
          五代傳承，23 位家族成員——記錄每一位先人的足跡，傳遞家族的記憶與精神。
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/tree/p-001"
            className="rounded-lg bg-white px-6 py-3 text-base font-semibold text-webtrees-primary shadow-md transition-colors hover:bg-webtrees-surface"
          >
            探索家族樹
          </Link>
          <Link
            href="/stories"
            className="rounded-lg border border-white/40 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-white/10"
          >
            閱讀家族故事
          </Link>
        </div>
      </div>
    </section>
  )
}
