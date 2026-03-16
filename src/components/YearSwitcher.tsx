'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface YearSwitcherProps {
  years: string[]
  selectedYear: string
}

export function YearSwitcher({ years, selectedYear }: YearSwitcherProps) {
  const MAX = 7
  const idx = years.indexOf(selectedYear)

  const getDisplayYears = () => {
    if (years.length <= MAX) return years
    let start = Math.max(0, idx - Math.floor(MAX / 2))
    const end = Math.min(years.length, start + MAX)
    start = Math.max(0, end - MAX)
    return years.slice(start, end)
  }

  const displayYears = getDisplayYears()
  const prevYear = idx > 0 ? years[idx - 1] : null
  const nextYear = idx < years.length - 1 ? years[idx + 1] : null

  return (
    <nav className="flex items-center justify-center gap-1.5 mb-8" aria-label="切換年份">
      {prevYear ? (
        <Link
          href={`/${prevYear}`}
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 transition"
          aria-label={`上一年 ${prevYear}`}
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      ) : (
        <span className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" />
        </span>
      )}

      <div className="flex flex-wrap items-center justify-center gap-1.5">
        {displayYears.map((year) => (
          <Link
            key={year}
            href={`/${year}`}
            className={
              year === selectedYear
                ? 'px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold text-sm transition'
                : 'px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-medium text-sm transition'
            }
            aria-current={year === selectedYear ? 'page' : undefined}
          >
            {year}
          </Link>
        ))}
      </div>

      {nextYear ? (
        <Link
          href={`/${nextYear}`}
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 transition"
          aria-label={`下一年 ${nextYear}`}
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className="flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-slate-50 text-slate-300 cursor-not-allowed">
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  )
}
