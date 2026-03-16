'use client'

import type { HolidayItem } from '@/src/types/holiday'
import { getMonthGrid, getShortHolidayLabel, WEEKDAY_LABELS, MONTH_NAMES } from '@/lib/calendar'

interface MonthCalendarProps {
  year: number
  month: number
  holidays: HolidayItem[]
  /** 請假攻略詳情內使用，放大月曆便於閱讀 */
  size?: 'default' | 'large'
}

function toHolidayRanges(holidays: HolidayItem[]): { dateStart: string; dateEnd: string; name: string; actualHolidayDate?: string }[] {
  return holidays
    .filter((h) => h.dateStart)
    .map((h) => {
      // 判斷節日實際日期（用於月曆顯示）
      let actualDate = h.dateStart
      // 特殊處理：228 的實際節日日是 2/28
      if (h.name.includes('228') || h.name.includes('和平紀念日')) {
        const [y, m, d] = h.dateStart.split('-')
        const month = parseInt(m!, 10)
        if (month === 2) {
          actualDate = `${y}-02-28`
        }
      }
      // 元旦、清明、端午、中秋、國慶、光復、行憲等節日當天
      // 可依 name 推測，或統一用 dateStart（單日假本來就是當天）
      return {
        dateStart: h.dateStart,
        dateEnd: h.dateEnd || h.dateStart,
        name: h.name,
        actualHolidayDate: actualDate,
      }
    })
}

export function MonthCalendar({ year, month, holidays, size = 'default' }: MonthCalendarProps) {
  const ranges = toHolidayRanges(holidays)
  const grid = getMonthGrid(year, month, ranges)
  const title = `${year} 年 ${MONTH_NAMES[month - 1]}`
  const isLarge = size === 'large'

  return (
    <div className={`rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm w-full min-w-0 ${isLarge ? 'max-w-md' : ''}`}>
      <div className={`bg-slate-700 text-white font-bold text-center truncate ${isLarge ? 'px-3 py-2 text-sm' : 'px-2 py-1.5 text-xs'}`}>
        {title}
      </div>
      <table
        className={`w-full table-fixed ${isLarge ? 'text-sm' : 'text-[11px]'}`}
        style={{ tableLayout: 'fixed' }}
        role="grid"
        aria-label={title}
      >
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            {WEEKDAY_LABELS.map((label, i) => (
              <th
                key={i}
                className={`text-center font-semibold w-[14.28%] ${isLarge ? 'py-2 px-0' : 'py-1 px-0'} ${
                  i === 0 ? 'text-red-600' : i === 6 ? 'text-blue-600' : 'text-slate-600'
                }`}
                scope="col"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.map((row, ri) => (
            <tr key={ri} className="border-b border-slate-100 last:border-0">
              {row.map((cell, ci) => {
                const isSun = ci === 0
                const isSat = ci === 6
                let bg = ''
                let textColor = 'text-slate-800'
                if (cell.isHoliday) {
                  bg = 'bg-amber-100 border border-amber-300'
                  textColor = 'text-amber-900 font-semibold'
                } else if (cell.isWeekend) {
                  bg = isSun ? 'bg-red-50' : 'bg-blue-50'
                  textColor = isSun ? 'text-red-700' : 'text-blue-700'
                } else if (cell.date !== null) {
                  bg = 'bg-white'
                }
                return (
                  <td
                    key={ci}
                    className={`text-center align-top ${isLarge ? 'py-2 px-0' : 'py-0.5 px-0'} ${bg} ${cell.date !== null ? textColor : ''}`}
                    title={cell.holidayName ? `連假：${cell.holidayName}` : undefined}
                  >
                    {cell.date !== null ? (
                      <span className="inline-flex flex-col items-center justify-center gap-0 leading-tight">
                        <span className="tabular-nums">{cell.date}</span>
                        {cell.holidayName && (
                          <span className={`leading-tight text-amber-800 whitespace-nowrap ${isLarge ? 'text-xs' : 'text-[9px]'}`}>
                            {getShortHolidayLabel(cell.holidayName)}
                          </span>
                        )}
                      </span>
                    ) : (
                      ''
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
