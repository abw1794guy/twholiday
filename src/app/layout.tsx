import type { Metadata } from 'next'
import { Noto_Sans_TC } from 'next/font/google'
import { GoogleAnalytics } from '@/src/components/GoogleAnalytics'
import './globals.css'

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  variable: '--font-noto-sans-tc',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://holiday.twtool.tw'),
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  title: {
    default: '2026 行事曆與連假請假攻略｜人事行政總處中華民國115年辦公日曆表',
    template: '%s | 台灣最強行事曆與請假攻略',
  },
  description:
    '最新 2026、2027 年台灣行事曆與國定假日完整攻略：春節、清明、端午、中秋、國慶連假日期與請假策略，請 X 天休 Y 天、補班日整理與出國推薦行程。',
  keywords: [
    '台灣國定假日', '行事曆', '請假攻略', '連假', '補班', '2026', '2027', 
    '人事行政總處', '中華民國115年', '春節連假', '清明連假', '端午連假', 
    '中秋連假', '國慶連假', '出國旅遊推薦'
  ],
  authors: [{ name: '台灣最強請假攻略' }],
  creator: '台灣最強請假攻略',
  publisher: '台灣最強請假攻略',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: '2026 行事曆與連假請假攻略｜人事行政總處中華民國115年辦公日曆表',
    description: '最新 2026、2027 年台灣行事曆與國定假日連假日期、請 X 天休 Y 天策略、推薦行程，補班日整理。',
    url: 'https://holiday.twtool.tw',
    siteName: '台灣最強請假攻略',
    locale: 'zh_TW',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '2026 行事曆與連假請假攻略｜人事行政總處中華民國115年辦公日曆表',
    description: '最新 2026、2027 年台灣行事曆與國定假日連假日期、請 X 天休 Y 天策略、推薦行程，補班日整理。',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  )
}
