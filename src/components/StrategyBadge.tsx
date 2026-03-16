import { Sparkles } from 'lucide-react'

interface StrategyBadgeProps {
  text: string
}

/**
 * 以明顯綠色標示「請 X 天休 Y 天」的攻略
 */
export function StrategyBadge({ text }: StrategyBadgeProps) {
  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-strategy-light text-strategy-green font-medium text-sm border border-emerald-200"
      role="status"
      aria-label={`請假攻略：${text}`}
    >
      <Sparkles className="w-4 h-4 shrink-0" aria-hidden />
      <span className="break-words hyphens-auto">{text}</span>
    </div>
  )
}
