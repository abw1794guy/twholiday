'use client'

import type { HolidayItem, YearMeta } from '@/src/types/holiday'
import { Calendar, TrendingUp, Plane } from 'lucide-react'

function formatDisplayDate(start: string, end: string, isSingleDay: boolean) {
  if (!start) return '—'
  const toShort = (s: string) => {
    const [, m, d] = s.split('-')
    return `${parseInt(m!, 10)}/${parseInt(d!, 10)}`
  }
  if (isSingleDay || start === end) return toShort(start)
  return `${toShort(start)}～${toShort(end)}`
}

interface YearIntroSectionProps {
  year: string
  holidays: HolidayItem[]
  yearMeta?: YearMeta
}

function YearIntroBanner({ year, holidays, yearMeta }: YearIntroSectionProps) {
  const multiDayCount = holidays.filter((h) => h.days >= 3).length
  const totalCount = holidays.length
  const longest = holidays.reduce(
    (max, h) => (h.days > max.days ? h : max),
    holidays[0]!
  )
  const leaveDays = yearMeta?.bestTrickLeaveDays ?? 0
  const longestName = yearMeta?.longestHolidayName ?? longest?.name ?? '春節'
  const longestDays = yearMeta?.longestHolidayDays ?? longest?.days ?? 0
  const status = yearMeta?.status ?? 'predicted'
  const isOfficial = status === 'official' || status === 'historical'

  const statusLabel = isOfficial
    ? status === 'historical'
      ? '歷史資料'
      : '官方已公布'
    : '預測資料'
  const statusColor = isOfficial
    ? status === 'historical'
      ? 'bg-slate-100 text-slate-600'
      : 'bg-emerald-100 text-emerald-700'
    : 'bg-amber-100 text-amber-700'

  const trickText =
    leaveDays > 0
      ? `善用 ${leaveDays} 天年假，搭配 ${longestName}可拿下最長 ${longestDays} 天連假`
      : `${longestName}最多可連休 ${longestDays} 天，完全不需動用年假！`

  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 border-b border-amber-100 p-5">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className={`text-xs font-semibold rounded-full px-2.5 py-1 ${statusColor}`}>
          {statusLabel}
        </span>
        {yearMeta?.announcement && (
          <span className="text-xs text-slate-500">{yearMeta.announcement}</span>
        )}
      </div>
      <h2 className="text-xl font-bold text-slate-900 leading-snug mb-2">
        {year} 年行事曆完整版｜國定假日＋連假請假攻略總整理
      </h2>
      <div className="space-y-1.5 text-base text-slate-700 leading-relaxed">
        <p className="flex items-start gap-1.5">
          <Plane className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" aria-hidden />
          <span>
            {year} 年共有 <strong className="text-amber-700">{totalCount} 個</strong>國定假日，
            其中 <strong className="text-amber-700">{multiDayCount} 次</strong>連假達 3 天以上，
            每一次都是說走就走的好機會 ✈️
          </span>
        </p>
        <p className="flex items-start gap-1.5">
          <TrendingUp className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" aria-hidden />
          <span>
            本頁重點：<strong className="text-emerald-700">{trickText}</strong>。
            各假期最佳請假時機與推薦行程，以下一次看完！
          </span>
        </p>
      </div>
    </div>
  )
}

/**
 * 今年連假 + 連假、國定假日一覽（合併為單一區塊，避免重複）
 */
export function YearIntroSection({ year, holidays, yearMeta }: YearIntroSectionProps) {
  if (!holidays.length) return null

  const singleDay = holidays.filter((h) => h.isSingleDay)

  return (
    <section id="year-intro" className="scroll-mt-6 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <YearIntroBanner year={year} holidays={holidays} yearMeta={yearMeta} />
      <div className="px-5 pt-4 pb-1">
        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800">
          <Calendar className="w-4 h-4 text-amber-600" aria-hidden />
          {year} 年連假、國定假日一覽
        </h3>
      </div>
      <div className="overflow-x-auto overflow-y-hidden -mx-px">
        <table className="w-full min-w-[480px] text-base">
          <thead>
            <tr className="border-t border-slate-200 bg-slate-50/80">
              <th className="text-left py-2.5 px-3 font-semibold text-slate-700 w-[26%]">連假名稱</th>
              <th className="text-left py-2.5 px-3 font-semibold text-slate-700 w-[20%]">日期</th>
              <th className="text-center py-2.5 px-3 font-semibold text-slate-700 w-[10%]">天數</th>
              <th className="text-left py-2.5 px-3 font-semibold text-slate-700">請假攻略</th>
            </tr>
          </thead>
          <tbody>
            {holidays.map((h) => (
              <tr key={h.id} className="border-t border-slate-100 hover:bg-slate-50/50 transition-colors">
                <td className="py-2.5 px-3">
                  <span className="font-medium text-slate-900">{h.name}</span>
                  {h.isSingleDay && (
                    <span className="ml-1.5 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-800">單日</span>
                  )}
                </td>
                <td className="py-2.5 px-3 text-slate-700 tabular-nums">
                  {formatDisplayDate(h.dateStart, h.dateEnd, h.isSingleDay)}
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className="font-medium text-slate-800">{h.days}</span>
                  <span className="text-slate-500"> 天</span>
                </td>
                <td className="py-2.5 px-3 text-slate-700 leading-snug">{h.best_leave_plan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {singleDay.length > 0 && (
        <p className="px-5 pb-4 pt-2 text-sm text-slate-500 border-t border-slate-100 mt-0">
          單日假（{singleDay.map((h) => h.name).join('、')}）未形成連假，可搭配請假攻略延長休假。
        </p>
      )}
    </section>
  )
}
