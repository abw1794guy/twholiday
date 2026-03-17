'use client'

import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

const ADS_CLIENT = 'ca-pub-9393445902203358'

/** 監聽 ins.adsbygoogle 的 data-ad-status，僅在 filled 時顯示 */
function useAdFilled(ref: React.RefObject<HTMLDivElement | null>) {
  const [filled, setFilled] = useState(false)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const ins = container.querySelector('ins.adsbygoogle')
    if (!ins) return

    const observer = new MutationObserver(() => {
      const status = ins.getAttribute('data-ad-status')
      if (status === 'filled') setFilled(true)
    })

    observer.observe(ins, {
      attributes: true,
      attributeFilter: ['data-ad-status'],
    })

    // 若已存在 filled 狀態（例如 SSR 或快速載入）
    if (ins.getAttribute('data-ad-status') === 'filled') setFilled(true)

    return () => observer.disconnect()
  }, [ref])

  return filled
}

/** 頂部橫幅廣告（可設 NEXT_PUBLIC_ADS_SLOT_BANNER 指定 slot，否則隱藏） */
export function AdBannerTop() {
  const slotId = process.env.NEXT_PUBLIC_ADS_SLOT_BANNER || ''
  const showAd = !!slotId
  const containerRef = useRef<HTMLDivElement>(null)
  const filled = useAdFilled(containerRef)

  useEffect(() => {
    if (showAd && typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch {}
    }
  }, [showAd])

  if (!showAd) return null

  return (
    <div
      ref={containerRef}
      className="ad-banner-top w-full border-b border-slate-200 flex justify-center items-center py-2 min-h-[90px]"
      style={{ display: filled ? 'flex' : 'none' }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADS_CLIENT}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  )
}

/** 原生／資訊流廣告（需在 AdSense 後台建立對應廣告單元並填入 slot ID） */
export function AdNativeTravel() {
  const slotId = process.env.NEXT_PUBLIC_ADS_SLOT_NATIVE || ''
  const showAd = !!slotId
  const containerRef = useRef<HTMLDivElement>(null)
  const filled = useAdFilled(containerRef)

  useEffect(() => {
    if (showAd && typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch {}
    }
  }, [showAd])

  if (!showAd) return null

  return (
    <div
      ref={containerRef}
      className="ad-native-travel rounded-lg overflow-hidden"
      aria-label="贊助商內容"
      style={{ display: filled ? 'block' : 'none' }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block', textAlign: 'center' }}
        data-ad-client={ADS_CLIENT}
        data-ad-slot={slotId}
        data-ad-format="fluid"
        data-ad-layout-key="-6t+ed+2i-1n-4w"
      />
    </div>
  )
}

/** 左右側邊廣告（桌面版顯示，手機版隱藏；可設 NEXT_PUBLIC_ADS_SLOT_SIDE） */
export function AdSidebar({ position }: { position: 'left' | 'right' }) {
  const slotId = process.env.NEXT_PUBLIC_ADS_SLOT_SIDE || ''
  const showAd = !!slotId
  const containerRef = useRef<HTMLDivElement>(null)
  const filled = useAdFilled(containerRef)

  useEffect(() => {
    if (showAd && typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch {}
    }
  }, [showAd])

  const baseClass = `hidden lg:block w-[160px] xl:w-[200px] shrink-0 sticky top-24`
  const posClass = position === 'left' ? 'order-first' : 'order-last'

  if (!showAd) return null

  return (
    <aside
      ref={containerRef}
      className={`${baseClass} ${posClass} flex justify-center`}
      aria-label={`${position === 'left' ? '左' : '右'}側廣告`}
      style={{ display: filled ? 'flex' : 'none' }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADS_CLIENT}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  )
}

/** 全域 AdSense Script（放在 layout） */
export function AdSenseScript() {
  return (
    <Script
      id="adsense-init"
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CLIENT}`}
      crossOrigin="anonymous"
    />
  )
}
