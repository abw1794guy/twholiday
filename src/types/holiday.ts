/**
 * 國定假日單筆資料型別
 * 資料來源：data/holidays.json
 * 未來可透過 scripts/fetch_holidays.py 或 AI 爬蟲腳本監控行政院人事行政總處公告自動更新 JSON
 */
export interface HolidayItem {
  id: string
  name: string
  nameEn: string
  dateStart: string
  dateEnd: string
  days: number
  isSingleDay: boolean
  makeUpWorkNote?: string
  best_leave_plan: string
  travel_suggestions: string[]
}

export interface HolidaysMeta {
  source: string
  lastUpdated: string
  updateNote: string
}

export interface MonthlyTravelTip {
  season: string
  theme: string
  highlights: string
  tips: string[]
}

export interface YearMeta {
  status: 'historical' | 'official' | 'predicted'
  announcement: string
  longestHolidayName: string
  longestHolidayDays: number
  bestTrickLeaveDays: number
  note: string
}

export interface HolidaysData {
  meta: HolidaysMeta
  year_meta: Record<string, YearMeta>
  monthly_travel_tips: Record<string, MonthlyTravelTip>
  years: Record<string, HolidayItem[]>
}
