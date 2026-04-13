import type { Metadata } from 'next'
import { Noto_Sans_TC, Noto_Serif_TC } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  variable: '--font-noto-sans-tc',
  display: 'swap',
  weight: ['400', '500', '700'],
})

const notoSerifTC = Noto_Serif_TC({
  subsets: ['latin'],
  variable: '--font-noto-serif-tc',
  display: 'swap',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: '家族族譜 Demo',
  description:
    '以 Next.js 建立的家族族譜展示網站，模仿 Webtrees 外觀，呈現家族成員、族譜樹狀圖、媒體庫與家族故事。',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="zh-Hant" className={`${notoSansTC.variable} ${notoSerifTC.variable}`}>
      <body className="font-sans bg-webtrees-surface text-webtrees-ink min-h-screen flex flex-col">
        <Providers>
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </Providers>
      </body>
    </html>
  )
}
