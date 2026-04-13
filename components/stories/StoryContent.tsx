import type { ReactNode } from 'react'

interface StoryContentProps {
  content: string
}

/**
 * 渲染文章本文。
 * content 可能含簡易 Markdown（## 標題、**粗體**），
 * 按 \n\n 分段後逐段渲染：
 *   - ## 開頭 → <h2>
 *   - ### 開頭 → <h3>
 *   - 其餘 → <p>，內部 **text** 轉 <strong>
 * 不引入任何第三方套件。
 */
export function StoryContent({ content }: StoryContentProps) {
  const paragraphs = content.split(/\n\n+/)

  return (
    <div className="max-w-prose mx-auto space-y-5 text-webtrees-ink leading-[1.9] text-[1.0625rem]">
      {paragraphs.map((para, index) => {
        const trimmed = para.trim()

        if (trimmed.startsWith('### ')) {
          return (
            <h3
              key={index}
              className="text-xl font-serif font-bold text-webtrees-primary mt-8 mb-2"
            >
              {trimmed.slice(4)}
            </h3>
          )
        }

        if (trimmed.startsWith('## ')) {
          return (
            <h2
              key={index}
              className="text-2xl font-serif font-bold text-webtrees-primary mt-10 mb-3
                border-b border-webtrees-primary/20 pb-2"
            >
              {trimmed.slice(3)}
            </h2>
          )
        }

        if (trimmed.startsWith('# ')) {
          return (
            <h1
              key={index}
              className="text-3xl font-serif font-bold text-webtrees-ink mt-10 mb-4"
            >
              {trimmed.slice(2)}
            </h1>
          )
        }

        // 一般段落：解析 **bold**
        return (
          <p key={index} className="whitespace-pre-line">
            {renderInline(trimmed)}
          </p>
        )
      })}
    </div>
  )
}

/**
 * 將段落內的 **text** 轉換為 <strong>
 */
function renderInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-webtrees-ink">{part.slice(2, -2)}</strong>
    }
    return part
  })
}
