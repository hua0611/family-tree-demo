'use client'

import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import type { ReactNode, CSSProperties } from 'react'

export interface TreeZoomWrapperProps {
  children: ReactNode
  /** 外層容器的 className，預設 w-full h-full */
  className?: string
  style?: CSSProperties
}

/**
 * TreeZoomWrapper — 封裝 react-zoom-pan-pinch 縮放平移容器
 * 支援滑鼠滾輪縮放、拖曳平移、行動裝置 pinch-zoom
 */
export function TreeZoomWrapper({ children, className = 'w-full h-full', style }: TreeZoomWrapperProps) {
  return (
    <div className={className} style={style}>
      <TransformWrapper
        minScale={0.3}
        maxScale={2.5}
        wheel={{ step: 0.08 }}
        doubleClick={{ disabled: false }}
        centerOnInit
      >
        <TransformComponent
          wrapperStyle={{ width: '100%', height: '100%' }}
          contentStyle={{ width: '100%', height: '100%' }}
        >
          {children}
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}
