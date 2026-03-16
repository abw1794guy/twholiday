import { notFound } from 'next/navigation'
import { getAvailableYears, getHolidaysData } from '@/lib/getHolidays'
import { HolidayPageContent } from '@/src/components/HolidayPageContent'
import { HeroSection } from '@/src/components/HeroSection'
import { SchemaOrgJsonLd } from '@/src/components/SchemaOrgJsonLd'

interface YearPageProps {
  params: { year: string }
}

/** 靜態匯出時預先產生所有年份路徑 */
export function generateStaticParams() {
  const years = getAvailableYears()
  return years.map((year) => ({ year }))
}

/** 動態產生各年份頁面的 SEO metadata */
export function generateMetadata({ params }: YearPageProps) {
  const { year } = params
  const yearNum = parseInt(year, 10)
  const rocYear = yearNum - 1911
  return {
    title: `【${year}行事曆】人事行政總處中華民國${rocYear}年行事曆`,
    description: `${year} 年台灣國定假日完整攻略：春節、清明、端午、中秋、國慶連假日期與請假策略，請 X 天休 Y 天、補班日整理與推薦行程。`,
    alternates: {
      canonical: `/${year}`,
    },
  }
}

export default function YearPage({ params }: YearPageProps) {
  const { year } = params
  const data = getHolidaysData()
  const availableYears = getAvailableYears()

  if (!availableYears.includes(year)) {
    notFound()
  }

  return (
    <>
      <SchemaOrgJsonLd data={data} />
      <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
        {/* 廣告位：頁面頂部 */}
        <div className="ad-banner-top w-full border-b border-slate-200 flex items-center justify-center text-slate-400 text-sm py-2">
          廣告位 (ad-banner-top)
        </div>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <HeroSection />
          <HolidayPageContent data={data} initialYear={year} />
        </main>
      </div>
    </>
  )
}
