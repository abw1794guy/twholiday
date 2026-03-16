import type { HolidaysMeta } from '@/src/types/holiday'

interface SourceFooterProps {
  meta: HolidaysMeta
}

export function SourceFooter({ meta }: SourceFooterProps) {
  return (
    <section
      id="source"
      className="scroll-mt-6 mt-12 pt-8 border-t border-slate-200"
    >
      <h2 className="text-lg font-bold text-slate-800 mb-2">資料來源與更新</h2>
      <ul className="text-sm text-slate-600 space-y-1">
        <li><strong>來源：</strong>{meta.source}</li>
        <li><strong>最後更新：</strong>{meta.lastUpdated}</li>
        {meta.updateNote && (
          <li className="text-slate-500 mt-2">{meta.updateNote}</li>
        )}
      </ul>
    </section>
  )
}
