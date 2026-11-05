// 日付は 'YYYY-MM-DD' の文字列（例：'2026-11-07'）で扱う。
// この形なら、文字列のまま大小を比べても日付の前後と一致する。

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

// Date → '2026-11-07'
export const toDateKey = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// '2026-11-07' → Date（日本時間の0時）
export const fromDateKey = (key: string) => {
  const [year = 0, month = 1, day = 1] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

// 正しい日付の文字列かどうか（'2026-02-30' などは false）
export const isValidDateKey = (value: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(value) && toDateKey(fromDateKey(value)) === value

// n日後の日付
export const addDays = (key: string, days: number) => {
  const date = fromDateKey(key)
  date.setDate(date.getDate() + days)
  return toDateKey(date)
}

// '2026-11-07' → '11月7日（土）'
export const formatDateJa = (key: string) => {
  const date = fromDateKey(key)
  return `${date.getMonth() + 1}月${date.getDate()}日（${WEEKDAYS[date.getDay()]}）`
}

// 休前日（土曜日、または翌日が祝日・年末年始の日）かどうか
export const isHolidayEve = (key: string, holidays: string[]) =>
  fromDateKey(key).getDay() === 6 || holidays.includes(addDays(key, 1))
