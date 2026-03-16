/**
 * 讀取國定假日 JSON 資料
 *
 * 資料來源：data/holidays.json
 *
 * === AI 自動化更新註釋 ===
 * 未來可透過以下方式實現年年自動更新：
 * 1. 撰寫 Python 爬蟲 scripts/fetch_holidays.py，定期抓取行政院人事行政總處
 *    (https://www.dgpa.gov.tw) 之「政府行政機關辦公日曆表」公告。
 * 2. 爬蟲解析 Excel/PDF 或網頁上的連假、補班日，輸出符合本 Schema 的 JSON。
 * 3. 將輸出寫入或 PR 至 data/holidays.json，或透過 CI 定時更新。
 * 4. 欄位對應：dateStart/dateEnd → 公告之放假日區間；
 *    makeUpWorkNote → 補班日備註；best_leave_plan 可由規則或簡單 NLP 產生。
 */
import type { HolidayItem, HolidaysData } from '@/src/types/holiday'
import holidaysJson from '@/data/holidays.json'

const data = holidaysJson as HolidaysData

/**
 * 取得指定年份的國定假日列表
 */
export function getHolidaysByYear(year: string): HolidayItem[] {
  const list = data.years[year]
  return list ?? []
}

/**
 * 取得所有已支援的年份
 */
export function getAvailableYears(): string[] {
  return Object.keys(data.years).sort()
}

/**
 * 取得完整 JSON 資料（供 Schema.org 等使用）
 */
export function getHolidaysData(): HolidaysData {
  return data
}

/**
 * 取得單一假日（依 id，跨年需帶年份或 id 含年份）
 */
export function getHolidayById(year: string, id: string): HolidayItem | undefined {
  return getHolidaysByYear(year).find((h) => h.id === id)
}
