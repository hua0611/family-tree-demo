'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Person } from '@/types/family'
import { formatDateRange } from '@/lib/family-helpers'

export interface PersonNodeProps {
  person: Person
  /** SVG 節點中心 X 座標 */
  x: number
  /** SVG 節點中心 Y 座標 */
  y: number
  width?: number
  height?: number
  /** 是否顯示完整資訊（false 時隱藏隱私欄位） */
  canView?: boolean
}

export const NODE_WIDTH = 180
export const NODE_HEIGHT = 80

function getBorderColor(gender: Person['gender']): string {
  if (gender === 'male') return '#60a5fa'   // blue-400
  if (gender === 'female') return '#f472b6' // pink-400
  return '#9ca3af'                          // gray-400
}

/**
 * PersonNode — 以 <foreignObject> 在 SVG 內嵌 HTML 卡片節點
 * 以 (x, y) 為節點中心，寬 NODE_WIDTH，高 NODE_HEIGHT
 */
export function PersonNode({
  person,
  x,
  y,
  width = NODE_WIDTH,
  height = NODE_HEIGHT,
  canView = true,
}: PersonNodeProps) {
  const borderColor = getBorderColor(person.gender)
  const initials = person.surname.charAt(0) || '?'
  const dateRange = formatDateRange(person)

  return (
    <foreignObject
      x={x - width / 2}
      y={y - height / 2}
      width={width}
      height={height}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'stretch',
        }}
      >
        <Link
          href={`/person/${person.id}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            width: '100%',
            height: '100%',
            padding: '6px',
            boxSizing: 'border-box',
            background: 'white',
            border: `2px solid ${borderColor}`,
            borderRadius: '6px',
            textDecoration: 'none',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            color: 'inherit',
            overflow: 'hidden',
          }}
        >
          {/* 左側頭像 */}
          <div
            style={{
              width: 44,
              height: 44,
              minWidth: 44,
              borderRadius: '50%',
              overflow: 'hidden',
              background: '#f5f1e8',
              border: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {canView && person.photoUrl ? (
              <Image
                src={person.photoUrl}
                alt={person.fullName}
                width={44}
                height={44}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
            ) : (
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#2d5a3d',
                }}
              >
                {initials}
              </span>
            )}
          </div>

          {/* 右側文字 */}
          <div
            style={{
              minWidth: 0,
              flex: 1,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#1f2937',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.3,
              }}
            >
              {canView ? person.fullName : '（隱私）'}
            </div>
            <div
              style={{
                fontSize: 11,
                color: '#6b7280',
                lineHeight: 1.3,
                marginTop: 2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {canView ? dateRange : ''}
            </div>
            {canView && person.isLiving && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: '#22c55e',
                    display: 'inline-block',
                    flexShrink: 0,
                  }}
                />
                <span style={{ fontSize: 10, color: '#16a34a' }}>在世</span>
              </div>
            )}
          </div>
        </Link>
      </div>
    </foreignObject>
  )
}
