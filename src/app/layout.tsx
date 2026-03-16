import type { Metadata } from 'next'
import { Noto_Sans_TC } from 'next/font/google'
import './globals.css'

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  variable: '--font-noto-sans-tc',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: '2026-2027 台灣國定假日請假攻略 | taiwan.holiday.tw',
    template: '%s | taiwan.holiday.tw',
  },
  description:
    '2026、2027 台灣最強請假攻略（免補班版）。春節、清明、端午、中秋、國慶連假日期與請假策略一次看，推薦行程與補班日整理。',
  keywords: ['台灣國定假日', '請假攻略', '連假', '補班', '2026', '2027', '行政院辦公日曆'],
  openGraph: {
    title: '2026-2027 台灣最強請假攻略（免補班版）',
    description: '國定假日連假日期、請 X 天休 Y 天策略、推薦行程，補班日整理。',
    locale: 'zh_TW',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-TW">
      <body className={`${notoSansTC.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
