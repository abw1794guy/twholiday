import type { Metadata } from 'next'
import { Noto_Sans_TC } from 'next/font/google'
import './globals.css'

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  variable: '--font-noto-sans-tc',
  display: 'swap',
})

export const metadata: Metadata = {
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  title: {
    default: '2026 台灣最強請假攻略｜人事行政總處中華民國115年行事曆',
    template: '%s',
  },
  description:
    '2026、2027 台灣國定假日完整攻略：春節、清明、端午、中秋、國慶連假日期與請假策略，請 X 天休 Y 天、補班日整理與推薦行程。',
  keywords: ['台灣國定假日', '行事曆', '請假攻略', '連假', '補班', '2026', '2027', '人事行政總處', '中華民國115年'],
  openGraph: {
    title: '2026 台灣最強請假攻略｜人事行政總處中華民國115年行事曆',
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
      <head>
        <meta name="google-adsense-account" content="ca-pub-9393445902203358" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9393445902203358"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${notoSansTC.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
