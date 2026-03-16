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
        {year} 台灣最強請假攻略
      </h1>
      <p className="mt-2 text-lg text-amber-700 font-medium">免補班版</p>
      <p className="mt-4 text-slate-600 max-w-xl mx-auto leading-relaxed">
        連假一覽・請假攻略・推薦行程一次整理，補班日依行政院公告為準。
      </p>
    </header>
  )
}
