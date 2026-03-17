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
  
  const title = `${year} 行事曆與連假請假攻略｜人事行政總處中華民國${rocYear}年辦公日曆表`
  const description = `最新 ${year} 年台灣行事曆與國定假日完整攻略：春節、清明、端午、中秋、國慶連假日期與請假策略，請 X 天休 Y 天、補班日整理與出國推薦行程。`

  return {
    title,
    description,
    alternates: {
      canonical: `https://holiday.twtool.tw/${year}`,
    },
    openGraph: {
      title,
      description,
      url: `https://holiday.twtool.tw/${year}`,
    },
    twitter: {
      title,
      description,
    }
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
          <main className="max-w-5xl w-full min-w-0 px-2 sm:px-6 py-8">
            <HeroSection year={year} />
            <HolidayPageContent data={data} initialYear={year} />
          </main>
          <AdSidebar position="right" />
        </div>
      </div>
    </>
  )
}
