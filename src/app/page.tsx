import { getAvailableYears, getHolidaysData } from '@/lib/getHolidays'
import { HolidayPageContent } from '@/src/components/HolidayPageContent'
import { HeroSection } from '@/src/components/HeroSection'
import { SchemaOrgJsonLd } from '@/src/components/SchemaOrgJsonLd'

export const dynamic = 'force-static'

export function generateMetadata() {
  const years = getAvailableYears().join('、')
  return {
    title: `2026-2027 台灣最強請假攻略（免補班版）`,
    description: `${years} 年台灣國定假日完整攻略：春節、清明、端午、中秋、國慶連假日期與請假策略，請 X 天休 Y 天、補班日整理與推薦行程。`,
  }
}

export default function HomePage() {
  const data = getHolidaysData()

  return (
    <>
      <SchemaOrgJsonLd data={data} />
      <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
        {/* 廣告位：頁面頂部 */}
        <div className="ad-banner-top w-full border-b border-slate-200 flex items-center justify-center text-slate-400 text-sm">
          廣告位 (ad-banner-top)
        </div>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <HeroSection />
          <HolidayPageContent data={data} />
        </main>
      </div>
    </>
  )
}
