'use client'

/**
 * 區塊導覽：連假一覽、請假攻略詳情、資料來源，方便快速跳轉
 */
export function SectionNav() {
  return (
    <nav
      className="flex flex-wrap gap-2 mb-6"
      aria-label="本頁區塊導覽"
    >
      <a
        href="#year-intro"
        className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1.5 text-base font-medium text-slate-700 hover:bg-slate-200 transition"
      >
        今年連假
      </a>
      <a
        href="#calendar"
        className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1.5 text-base font-medium text-slate-700 hover:bg-slate-200 transition"
      >
        行事曆
      </a>
      <a
        href="#details"
        className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1.5 text-base font-medium text-slate-700 hover:bg-slate-200 transition"
      >
        請假攻略詳情
      </a>
      <a
        href="#source"
        className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1.5 text-base font-medium text-slate-700 hover:bg-slate-200 transition"
      >
        資料來源
      </a>
    </nav>
  )
}
