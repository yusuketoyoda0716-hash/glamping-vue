// こだわり条件の種類
export type Feature = 'pet' | 'bbq' | 'sauna' | 'breakfast'

// 画面に表示する名前
export const featureLabels: Record<Feature, string> = {
  pet: 'ペット可',
  bbq: 'BBQ付き',
  sauna: 'サウナ付き',
  breakfast: '朝食付き',
}

// プラン1件分のデータ（plans.json の形）
export type Plan = {
  id: string
  name: string
  type: string
  capacityMin: number
  capacityMax: number
  priceWeekday: number // 平日の1泊・大人1名の料金
  priceHoliday: number // 休前日の1泊・大人1名の料金
  features: Feature[]
  description: string
  image: string
  imageAlt: string
  stock: number // 残りの棟数（0なら満室）
}
