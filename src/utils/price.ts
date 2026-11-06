import type { ReserveOption } from '@/types/option'
import type { Plan } from '@/types/plan'
import { isHolidayEve } from './date'

// 料金の計算に使う条件
export type PriceInput = {
  plan: Plan
  stayDates: string[] // 宿泊する日の一覧
  holidays: string[]
  adults: number
  children: number
  options: ReserveOption[] // 選んだオプション
}

export type PriceBreakdown = {
  weekday: { nights: number; perNight: number; subtotal: number }
  holidayEve: { nights: number; perNight: number; subtotal: number }
  options: { id: string; name: string; amount: number }[]
  optionTotal: number
  total: number
}

const CHILD_RATE = 0.5 // 子どもは大人の半額

// 1泊あたりの宿泊料金（大人＋子ども）
const perNightPrice = (unitPrice: number, adults: number, children: number) =>
  unitPrice * adults + Math.round(unitPrice * CHILD_RATE) * children

// オプション1件の料金
const optionAmount = (option: ReserveOption, people: number, nights: number) => {
  switch (option.unit) {
    case 'person':
      return option.price * people
    case 'group':
      return option.price
    case 'personNight':
      return option.price * people * nights
  }
}

// 料金の内訳を計算する（画面には関係しない、ただの計算）
export const calculatePrice = (input: PriceInput): PriceBreakdown => {
  const { plan, stayDates, holidays, adults, children } = input
  const people = adults + children

  const eveNights = stayDates.filter((date) => isHolidayEve(date, holidays)).length
  const weekdayNights = stayDates.length - eveNights

  const weekdayPerNight = perNightPrice(plan.priceWeekday, adults, children)
  const evePerNight = perNightPrice(plan.priceHoliday, adults, children)

  const options = input.options.map((option) => ({
    id: option.id,
    name: option.name,
    amount: optionAmount(option, people, stayDates.length),
  }))
  const optionTotal = options.reduce((sum, option) => sum + option.amount, 0)

  const weekdaySubtotal = weekdayPerNight * weekdayNights
  const eveSubtotal = evePerNight * eveNights

  return {
    weekday: { nights: weekdayNights, perNight: weekdayPerNight, subtotal: weekdaySubtotal },
    holidayEve: { nights: eveNights, perNight: evePerNight, subtotal: eveSubtotal },
    options,
    optionTotal,
    total: weekdaySubtotal + eveSubtotal + optionTotal,
  }
}
