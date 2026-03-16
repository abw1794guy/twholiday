'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface YearSwitcherProps {
  years: string[]
  selectedYear?: string
  onYearChange?: (year: string) => void
}

export function YearSwitcher({
  years,
  selectedYear,
  onYearChange,
}: YearSwitcherProps) {
  const current = selectedYear ?? years[years.length - 1]
  const index = years.indexOf(current)
  const prev = index > 0 ? years[index - 1] : null
  const next = index < years.length - 1 ? years[index + 1] : null

  return (
    <nav
      className="flex items-center justify-center gap-2 mb-8"
      aria-label="切換年份"
    >
      {prev && (
        <button
          type="button"
          onClick={() => onYearChange?.(prev)}
          className="flex items-center gap-1 px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition"
          aria-label={`切換至 ${prev} 年`}
        >
          <ChevronLeft className="w-4 h-4" />
          {prev}
        </button>
      )}
      <span
        className="px-6 py-2 rounded-lg bg-slate-900 text-white font-semibold min-w-[5rem] text-center"
        aria-current="true"
      >
        {current}
      </span>
      {next && (
        <button
          type="button"
          onClick={() => onYearChange?.(next)}
          className="flex items-center gap-1 px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition"
          aria-label={`切換至 ${next} 年`}
        >
          {next}
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </nav>
  )
}
