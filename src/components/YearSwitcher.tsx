'use client'

import Link from 'next/link'

interface YearSwitcherProps {
  years: string[]
  selectedYear: string
}

export function YearSwitcher({ years, selectedYear }: YearSwitcherProps) {
  // 最多顯示 6 個年份（以當前年份為中心）
  const getDisplayYears = () => {
    const MAX = 6
    const idx = years.indexOf(selectedYear)
    if (years.length <= MAX) return years
    // 盡量以當前為中心
    let start = Math.max(0, idx - Math.floor(MAX / 2))
    const end = Math.min(years.length, start + MAX)
    start = Math.max(0, end - MAX)
    return years.slice(start, end)
  }

  const displayYears = getDisplayYears()

  return (
    <nav className="flex flex-wrap items-center justify-center gap-2 mb-8" aria-label="切換年份">
      {displayYears.map((year) => (
        <Link
          key={year}
          href={`/${year}`}
          className={
            year === selectedYear
              ? 'px-5 py-2 rounded-lg bg-slate-900 text-white font-semibold text-sm transition'
              : 'px-5 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 font-medium text-sm transition'
          }
          aria-current={year === selectedYear ? 'page' : undefined}
        >
          {year}
        </Link>
      ))}
    </nav>
  )
}
