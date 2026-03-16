'use client'

import type { HolidayItem, MonthlyTravelTip } from '@/src/types/holiday'
import { MONTH_NAMES } from '@/lib/calendar'
import { AdNativeTravel } from './AdSense'
import { MonthCalendar } from './MonthCalendar'
import { StrategyBadge } from './StrategyBadge'

interface HolidayGridProps {
  year: number
  holidays: HolidayItem[]
  monthlyTips: Record<string, MonthlyTravelTip>
}

/** 依 dateStart 的月份分組（跨月連假歸在起始月） */
function groupHolidaysByMonth(holidays: HolidayItem[]): Map<number, HolidayItem[]> {
  const byMonth = new Map<number, HolidayItem[]>()
  for (const h of holidays) {
    if (!h.dateStart) continue
    const month = parseInt(h.dateStart.slice(5, 7), 10)
    if (!byMonth.has(month)) byMonth.set(month, [])
    byMonth.get(month)!.push(h)
  }
  return byMonth
}

function formatShortDate(start: string, end: string, isSingleDay: boolean) {
  if (!start) return '—'
  const toShort = (s: string) => {
    const [, m, d] = s.split('-')
    return `${parseInt(m!, 10)}/${parseInt(d!, 10)}`
  }
  if (isSingleDay || start === end) return toShort(start)
  return `${toShort(start)}～${toShort(end)}`
}

/** 單一假期的請假攻略區塊 */
function HolidayStrategyCard({ h }: { h: HolidayItem }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-slate-50/80 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h4 className="font-bold text-slate-900">{h.name}</h4>
        {h.isSingleDay && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
            單日假
          </span>
        )}
      </div>
      <p className="mt-0.5 text-slate-500 text-sm">{h.nameEn}</p>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex gap-2">
          <dt className="text-slate-500 w-20 shrink-0">放假</dt>
          <dd className="font-medium tabular-nums">{formatShortDate(h.dateStart, h.dateEnd, h.isSingleDay)}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-slate-500 w-20 shrink-0">天數</dt>
          <dd>{h.days} 天</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-slate-500 w-20 shrink-0 align-top pt-0.5">攻略</dt>
          <dd className="min-w-0">
            <StrategyBadge text={h.best_leave_plan} />
          </dd>
        </div>
      </dl>
      {h.makeUpWorkNote && (
        <p className="mt-2 text-xs text-slate-500 leading-relaxed">{h.makeUpWorkNote}</p>
      )}
      {h.travel_suggestions?.length > 0 && (
        <div className="mt-2">
          <span className="text-xs font-medium text-slate-500">推薦：</span>
          <span className="ml-1 text-xs text-slate-600">{h.travel_suggestions.join('、')}</span>
        </div>
      )}
    </article>
  )
}

/** 每月旅遊亮點區塊（無連假月份主要內容，有連假月份作補充） */
function MonthTravelTips({ tip, compact = false }: { tip: MonthlyTravelTip; compact?: boolean }) {
  return (
    <div className={`rounded-lg border border-sky-100 bg-sky-50/60 p-4 ${compact ? '' : ''}`}>
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <span className="text-xs font-medium text-sky-700 bg-sky-100 rounded-full px-2 py-0.5">
          {tip.season}
        </span>
        <span className="text-sm font-semibold text-sky-900">{tip.theme}</span>
      </div>
      <p className="text-xs text-slate-600 leading-relaxed mb-3">{tip.highlights}</p>
      <ul className="space-y-1.5">
        {tip.tips.map((t, i) => (
          <li key={i} className="flex gap-2 text-xs text-slate-700">
            <span className="text-sky-400 mt-0.5 shrink-0">✈</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function HolidayGrid({ year, holidays, monthlyTips }: HolidayGridProps) {
  const byMonth = groupHolidaysByMonth(holidays)
  const allMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

  return (
    <section id="details" className="scroll-mt-6">
      <h2 className="text-lg font-bold text-slate-800 mb-6">請假攻略詳情</h2>
      <p className="text-sm text-slate-600 mb-6">
        以下依月份顯示該月行事曆、請假攻略與旅遊推薦。
      </p>
      <div className="space-y-10">
        {allMonths.map((month) => {
          const monthHolidays = byMonth.get(month) ?? []
          const tip = monthlyTips[String(month)]
          return (
            <div
              key={month}
              id={`details-${month}`}
              className="scroll-mt-6 rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm"
            >
              <div className="border-b border-slate-200 bg-slate-50 px-4 py-2">
                <h3 className="text-base font-bold text-slate-800">
                  {year} 年 {MONTH_NAMES[month - 1]}
                </h3>
              </div>
              <div className="p-4 flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-96 shrink-0 flex justify-center lg:justify-start">
                  <MonthCalendar year={year} month={month} holidays={holidays} size="large" />
                </div>
                <div className="flex-1 min-w-0 space-y-4">
                  {monthHolidays.length > 0 ? (
                    <>
                      {monthHolidays.map((h) => (
                        <HolidayStrategyCard key={h.id} h={h} />
                      ))}
                      {monthHolidays.some((h) => h.days >= 3) && (
                        <AdNativeTravel />
                      )}
                      {tip && (
                        <MonthTravelTips tip={tip} compact />
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">
                        本月無國定連假
                      </p>
                      {tip && <MonthTravelTips tip={tip} />}
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
