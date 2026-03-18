import Image from 'next/image'

interface HeroSectionProps {
  year?: string
}

export function HeroSection({ year = '2026' }: HeroSectionProps) {
  return (
    <header className="text-center mb-10">
      <div className="inline-flex items-center justify-center mb-4">
        <Image
          src="/favicon.png"
          alt="行事曆與旅遊"
          width={80}
          height={80}
          className="rounded-xl"
          priority
        />
      </div>
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
        【{year}行事曆】台灣國定假日與連假請假攻略
      </h1>
      <p className="mt-2 text-lg text-amber-700 font-medium">人事行政總處辦公日曆表・免補班版</p>
      <h2 className="mt-4 text-slate-600 max-w-xl mx-auto leading-relaxed text-base font-normal">
        完整收錄 {year} 年台灣行事曆、國定假日、春節連假、清明連假、端午節、中秋節放假日期。提供最實用的請假攻略（請 X 天休 Y 天）與出國旅遊推薦行程，補班日依行政院公告為準。
      </h2>
    </header>
  )
}
