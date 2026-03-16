'use client'

import { useState, useMemo } from 'react'
import type { HolidaysData } from '@/src/types/holiday'
import { YearSwitcher } from './YearSwitcher'
import { SectionNav } from './SectionNav'
import { YearIntroSection } from './YearIntroSection'
import { YearCalendar } from './YearCalendar'
import { HolidayGrid } from './HolidayGrid'
import { SourceFooter } from './SourceFooter'

interface HolidayPageContentProps {
  data: HolidaysData
}

function getDefaultYear(years: string[]): string {
  const current = String(new Date().getFullYear())
  if (years.includes(current)) return current
  return years[0] ?? '2026'
}

export function HolidayPageContent({ data }: HolidayPageContentProps) {
  const years = useMemo(
    () => Object.keys(data.years).sort(),
    [data.years]
  )
  const [selectedYear, setSelectedYear] = useState(() => getDefaultYear(years))
  const holidays = data.years[selectedYear] ?? []
  const yearNum = parseInt(selectedYear, 10)

  return (
    <>
      <YearSwitcher
        years={years}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />
      <SectionNav />
      <div className="space-y-10 w-full min-w-0">
        <YearIntroSection year={selectedYear} holidays={holidays} yearMeta={data.year_meta[selectedYear]} />
        <YearCalendar year={yearNum} holidays={holidays} />
        <HolidayGrid year={yearNum} holidays={holidays} monthlyTips={data.monthly_travel_tips} />
        <SourceFooter meta={data.meta} />
      </div>
    </>
  )
}
