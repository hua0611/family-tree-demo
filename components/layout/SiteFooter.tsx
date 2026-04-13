export function SiteFooter() {
  return (
    <footer className="bg-webtrees-primary text-white/80 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="text-xl" role="img" aria-label="家族樹">
              🌳
            </span>
            <span className="font-serif font-bold text-white">林氏家族族譜</span>
          </div>

          {/* Demo notice */}
          <p className="text-sm opacity-70">此為 Demo 展示站點</p>

          {/* Copyright */}
          <div className="text-center text-xs sm:text-right">
            <p>© 2026 林氏家族族譜（Demo）</p>
            <p className="mt-0.5 opacity-60">基於 Forge 建置</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
