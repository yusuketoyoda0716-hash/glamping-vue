// 空き状況（availability.json の形）

// 1つのプランの空き状況。どちらにも入っていない日は「空きあり」
export type PlanAvailability = {
  full: string[] // 満室の日（'2026-11-07' の形）
  few: string[] // 残りわずかの日
}

export type Availability = {
  holidays: string[] // 祝日・年末年始（この前日は休前日料金になる）
  plans: Record<string, PlanAvailability> // プランのidごとの空き状況
}

export type DayStatus = 'ok' | 'few' | 'full'
