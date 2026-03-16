'use client'

import Script from 'next/script'
import { useEffect } from 'react'

const ADS_CLIENT = 'ca-pub-9393445902203358'

/** 頂部橫幅廣告（可設 NEXT_PUBLIC_ADS_SLOT_BANNER 指定 slot，否則顯示佔位） */
export function AdBannerTop() {
  const slotId = process.env.NEXT_PUBLIC_ADS_SLOT_BANNER || ''
  const showAd = !!slotId

  useEffect(() => {
    if (showAd && typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch {}
    }
  }, [showAd])

  if (!showAd) {
    return (
      <div className="ad-banner-top w-full border-b border-slate-200 flex justify-center items-center py-2 min-h-[90px]">
        {/* Auto Ads 會自動在此區域附近投放，或於 .env 設定 NEXT_PUBLIC_ADS_SLOT_BANNER 使用手動廣告單元 */}
      </div>
    )
  }

  return (
    <div className="ad-banner-top w-full border-b border-slate-200 flex justify-center items-center py-2 min-h-[90px]">
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

  useEffect(() => {
    if (showAd && typeof window !== 'undefined' && window.adsbygoogle) {
      try {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch {}
    }
  }, [showAd])

  if (!showAd) {
    return (
      <div
        className="ad-native-travel rounded-lg flex items-center justify-center text-slate-400 text-xs py-4"
        aria-label="贊助商內容"
      >
        贊助商內容：推薦行程
      </div>
    )
  }

  return (
    <div className="ad-native-travel rounded-lg overflow-hidden" aria-label="贊助商內容">
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
