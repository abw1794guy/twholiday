import { Sparkles } from 'lucide-react'

interface StrategyBadgeProps {
  text: string
}

/**
 * 以明顯綠色標示「請 X 天休 Y 天」的攻略
 */
export function StrategyBadge({ text }: StrategyBadgeProps) {
  // 判斷是否為「請 X 天休 Y 天」的格式，如果是，給予更強烈的視覺提示
  const isSuperTrick = text.includes('請') && text.includes('休') && text.includes('天')

  if (isSuperTrick) {
    return (
      <div
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-base border border-emerald-200 shadow-sm"
        role="status"
        aria-label={`請假攻略：${text}`}
      >
        <Sparkles className="w-5 h-5 shrink-0 text-emerald-500" aria-hidden />
        <span className="break-words hyphens-auto">{text}</span>
      </div>
    )
  }

  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 font-medium text-base border border-slate-200"
      role="status"
      aria-label={`請假攻略：${text}`}
    >
      <span className="break-words hyphens-auto">{text}</span>
    </div>
  )
}
