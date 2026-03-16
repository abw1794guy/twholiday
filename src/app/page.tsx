import { redirect } from 'next/navigation'
import { getAvailableYears } from '@/lib/getHolidays'

export default function HomePage() {
  const years = getAvailableYears()
  const currentYear = String(new Date().getFullYear())
  const defaultYear = years.includes(currentYear) ? currentYear : (years[0] ?? '2026')
  redirect(`/${defaultYear}`)
}
