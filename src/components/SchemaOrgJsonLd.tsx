import type { HolidaysData } from '@/src/types/holiday'

interface SchemaOrgJsonLdProps {
  data: HolidaysData
}

/**
 * Schema.org Dataset + Table 結構化資料，供 Google 等搜尋引擎抓取
 */
export function SchemaOrgJsonLd({ data }: SchemaOrgJsonLdProps) {
  const years = Object.keys(data.years).sort()
  const allRows: { name: string; dateStart: string; dateEnd: string; days: number }[] = []
  years.forEach((y) => {
    const list = data.years[y] ?? []
    list.forEach((h) => {
      allRows.push({
        name: `${h.name} (${y})`,
        dateStart: h.dateStart,
        dateEnd: h.dateEnd,
        days: h.days,
      })
    })
  })

  const dataset = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: '2026-2027 台灣國定假日請假攻略',
    description: data.meta.source + '，含連假日期與請假策略。',
    url: 'https://taiwan.holiday.tw',
    dateModified: data.meta.lastUpdated,
    creator: {
      '@type': 'Organization',
      name: data.meta.source,
    },
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: 'https://taiwan.holiday.tw/data/holidays.json',
    },
  }

  const table = {
    '@context': 'https://schema.org',
    '@type': 'Table',
    name: '台灣國定假日一覽表',
    about: '台灣政府行政機關辦公日曆表之國定假日與連假',
    columns: [
      { '@type': 'Column', name: '節日名稱' },
      { '@type': 'Column', name: '開始日期' },
      { '@type': 'Column', name: '結束日期' },
      { '@type': 'Column', name: '天數' },
    ],
    rows: allRows.map((r) => ({
      '@type': 'Row',
      row: [r.name, r.dateStart, r.dateEnd, String(r.days)],
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dataset) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(table) }}
      />
    </>
  )
}
