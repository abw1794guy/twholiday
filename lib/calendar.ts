/**
 * 月曆格線與連假／週末標記
 */

export interface DayCell {
  date: number | null
  yyyymmdd: string | null
  isWeekend: boolean
  isHoliday: boolean
  holidayName?: string
}

export interface HolidayRange {
  dateStart: string
  dateEnd: string
  name: string
  /** 節日當天（單日或區間首日），只有這天才顯示節日名稱 */
  actualHolidayDate?: string
}

function toYyyyMmDd(year: number, month: number, date: number): string {
  const m = String(month).padStart(2, '0')
  const d = String(date).padStart(2, '0')
  return `${year}-${m}-${d}`
}

function isDateInRange(yyyymmdd: string, dateStart: string, dateEnd: string): boolean {
  if (!dateStart) return false
  const end = dateEnd || dateStart
  return yyyymmdd >= dateStart && yyyymmdd <= end
}

/** 取得某日是否為連假，若有則回傳節日名稱或「放假」 */
export function getHolidayName(
  yyyymmdd: string,
  holidays: HolidayRange[]
): string | undefined {
  for (const h of holidays) {
    if (isDateInRange(yyyymmdd, h.dateStart, h.dateEnd)) {
      // 只在節日當天顯示節日名稱，其他連假日顯示「放假」
      const actualDate = h.actualHolidayDate || h.dateStart
      return yyyymmdd === actualDate ? h.name : '放假'
    }
  }
  return undefined
}

/** 取得單月月曆格線（週日為第一欄） */
export function getMonthGrid(
  year: number,
  month: number,
  holidays: HolidayRange[]
): DayCell[][] {
  const first = new Date(year, month - 1, 1)
  const last = new Date(year, month, 0)
  const firstDayOfWeek = first.getDay()
  const daysInMonth = last.getDate()
  const cells: DayCell[] = []
  const leadingBlanks = firstDayOfWeek
  for (let i = 0; i < leadingBlanks; i++) {
    cells.push({ date: null, yyyymmdd: null, isWeekend: false, isHoliday: false })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const yyyymmdd = toYyyyMmDd(year, month, d)
    const dayOfWeek = (leadingBlanks + d - 1) % 7
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const holidayName = getHolidayName(yyyymmdd, holidays)
    cells.push({
      date: d,
      yyyymmdd,
      isWeekend,
      isHoliday: !!holidayName,
      holidayName,
    })
  }
  const rows: DayCell[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    const row = cells.slice(i, i + 7)
    while (row.length < 7) row.push({ date: null, yyyymmdd: null, isWeekend: false, isHoliday: false })
    rows.push(row)
  }
  return rows
}

export const WEEKDAY_LABELS = ['日', '一', '二', '三', '四', '五', '六']

export const MONTH_NAMES = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月',
]

/** 月曆格內顯示用簡稱，避免過長中文擠在一起 */
const SHORT_HOLIDAY_LABELS: Record<string, string> = {
  '元旦': '元旦',
  '春節': '春節',
  '和平紀念日（228）': '228',
  '和平紀念日': '228',
  '兒童節／清明節': '清明',
  '清明節': '清明',
  '兒童節': '清明',
  '勞動節': '勞動',
  '端午節': '端午',
  '中秋節／教師節': '中秋',
  '中秋節': '中秋',
  '教師節': '教師',
  '國慶日': '國慶',
  '台灣光復節': '光復',
  '光復節': '光復',
  '行憲紀念日': '行憲',
  '放假': '休',
}

export function getShortHolidayLabel(fullName: string | undefined): string {
  if (!fullName) return ''
  if (SHORT_HOLIDAY_LABELS[fullName]) return SHORT_HOLIDAY_LABELS[fullName]
  if (fullName.length <= 3) return fullName
  return fullName.slice(0, 2)
}
