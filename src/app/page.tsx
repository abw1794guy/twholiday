import { getAvailableYears, getHolidaysData } from '@/lib/getHolidays'
import { AdBannerTop, AdSidebar } from '@/src/components/AdSense'
import { HolidayPageContent } from '@/src/components/HolidayPageContent'
import { HeroSection } from '@/src/components/HeroSection'
import { SchemaOrgJsonLd } from '@/src/components/SchemaOrgJsonLd'

export function generateMetadata() {
  const years = getAvailableYears()
  const currentYear = String(new Date().getFullYear())
  const defaultYear = years.includes(currentYear) ? currentYear : (years[0] ?? '2026')
  const yearNum = parseInt(defaultYear, 10)
  const rocYear = yearNum - 1911
  return {
    title: `${defaultYear} 台灣最強請假攻略｜人事行政總處中華民國${rocYear}年行事曆`,
    description: `${defaultYear} 年台灣國定假日完整攻略：春節、清明、端午、中秋、國慶連假日期與請假策略，請 X 天休 Y 天、補班日整理與推薦行程。`,
    alternates: {
      canonical: `/${defaultYear}`,
    },
  }
}

export default function HomePage() {
  const data = getHolidaysData()
  const years = getAvailableYears()
  const currentYear = String(new Date().getFullYear())
  const defaultYear = years.includes(currentYear) ? currentYear : (years[0] ?? '2026')

  return (
    <>
      <SchemaOrgJsonLd data={data} />
      <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
        <AdBannerTop />

        <div className="flex justify-center gap-4 lg:gap-6 px-2 sm:px-4">
          <AdSidebar position="left" />
          <main className="max-w-4xl w-full min-w-0 px-2 sm:px-6 py-8">
            <HeroSection year={defaultYear} />
            <HolidayPageContent data={data} initialYear={defaultYear} />
          </main>
          <AdSidebar position="right" />
        </div>
      </div>
    </>
  )
}
