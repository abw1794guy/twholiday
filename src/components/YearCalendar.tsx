'use client'

import type { HolidayItem } from '@/src/types/holiday'
import { MonthCalendar } from './MonthCalendar'

interface YearCalendarProps {
  year: number
  holidays: HolidayItem[]
}

export function YearCalendar({ year, holidays }: YearCalendarProps) {
  return (
    <section id="calendar" className="scroll-mt-6 w-full min-w-0">
      <h2 className="text-lg font-bold text-slate-800 mb-3">{year} 年行事曆</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month) => (
          <MonthCalendar key={month} year={year} month={month} holidays={holidays} size="large" />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-3 items-center text-sm text-slate-500">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-amber-100 border border-amber-300 shrink-0" aria-hidden />
          連假
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-red-50 shrink-0" aria-hidden />
          週日
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-blue-50 shrink-0" aria-hidden />
          週六
        </span>
      </div>
    </section>
  )
}
