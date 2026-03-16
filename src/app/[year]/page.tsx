import { notFound } from 'next/navigation'
import { getAvailableYears, getHolidaysData } from '@/lib/getHolidays'
import { AdBannerTop, AdSidebar } from '@/src/components/AdSense'
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
    title: `${year} 台灣最強請假攻略｜人事行政總處中華民國${rocYear}年行事曆`,
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
        <AdBannerTop />

        <div className="flex justify-center gap-4 lg:gap-6 px-2 sm:px-4">
          <AdSidebar position="left" />
          <main className="max-w-4xl w-full min-w-0 px-2 sm:px-6 py-8">
            <HeroSection />
            <HolidayPageContent data={data} initialYear={year} />
          </main>
          <AdSidebar position="right" />
        </div>
      </div>
    </>
  )
}
