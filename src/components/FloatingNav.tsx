'use client'

import { useState, useEffect } from 'react'
import { ArrowUp, CalendarDays } from 'lucide-react'

export function FloatingNav() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // 監聽滾動事件來決定是否顯示按鈕
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
        setIsMenuOpen(false) // 回到頂部時自動收起選單
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
    setIsMenuOpen(false)
  }

  const scrollToMonth = (month: number) => {
    const element = document.getElementById(`details-${month}`)
    if (element) {
      // 考慮上方導覽列或廣告的高度，給予一點 offset
      const y = element.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
    setIsMenuOpen(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* 月份選擇選單 */}
      {isMenuOpen && (
        <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-3 mb-2 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
              <button
                key={m}
                onClick={() => scrollToMonth(m)}
                className="w-10 h-10 rounded-lg bg-slate-50 hover:bg-amber-100 hover:text-amber-700 text-slate-700 font-medium text-sm transition-colors flex items-center justify-center"
                aria-label={`跳至 ${m} 月`}
              >
                {m}月
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {/* 月份切換按鈕 */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
            isMenuOpen 
              ? 'bg-amber-500 text-white hover:bg-amber-600' 
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
          aria-label="選擇月份"
        >
          <CalendarDays className="w-6 h-6" />
        </button>

        {/* 回到頂部按鈕 */}
        <button
          onClick={scrollToTop}
          className="p-3 bg-slate-800 text-white rounded-full shadow-lg hover:bg-slate-700 transition-all duration-200"
          aria-label="回到頂部"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}
