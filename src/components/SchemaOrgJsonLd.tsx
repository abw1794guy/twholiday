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

  // Google Dataset 結構化資料：description 須約 50–5000 字元；license 建議填寫
  const datasetDescription =
    `本資料集彙整台灣各年度國定假日、政府行政機關辦公日曆表之放假起迄日期、連假天數、補班補假說明與請假攻略建議。` +
    `資料來源參考${data.meta.source}；已公告年份以官方核定為準，預估版年份僅供參考，實際放假仍以行政院人事行政總處公告為準。` +
    `適合規劃休假、旅遊與人事排程。${data.meta.updateNote ?? ''}`

  const dataset = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: '台灣國定假日與連假請假攻略（多年度）',
    description: datasetDescription,
    url: 'https://holiday.twtool.tw',
    license: 'https://creativecommons.org/licenses/by/4.0/',
    dateModified: data.meta.lastUpdated,
    creator: {
      '@type': 'Organization',
      name: 'TWTool',
      url: 'https://twtool.tw',
    },
    publisher: {
      '@type': 'Organization',
      name: 'TWTool',
      url: 'https://twtool.tw',
    },
    isBasedOn: {
      '@type': 'CreativeWork',
      name: data.meta.source,
      url: 'https://www.dgpa.gov.tw/',
    },
    distribution: {
      '@type': 'DataDownload',
      encodingFormat: 'application/json',
      contentUrl: 'https://holiday.twtool.tw/data/holidays.json',
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

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: '2026年有哪些連假？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '2026年主要連假包含：春節連假（9天）、228和平紀念日（3天）、清明連假（4天）、勞動節（3天）、端午節（3天）、中秋節（3天）、國慶日（3天）。',
        },
      },
      {
        '@type': 'Question',
        name: '2026年春節放幾天？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '2026年農曆春節連假從 2 月 14 日至 2 月 22 日，共計連休 9 天。',
        },
      },
      {
        '@type': 'Question',
        name: '人事行政總處的補班規定是什麼？',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '依據最新規定，目前僅針對「除夕前一日（小年夜）」及「兒童節與民族掃墓節（清明節）」實施彈性放假與補班。其他國定假日若落在週二或週四，將不再實施彈性放假。',
        },
      },
    ],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  )
}
