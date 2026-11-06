// オプションの料金のかかり方
//   person：1名ごと／group：1組ごと／personNight：1名1泊ごと
export type OptionUnit = 'person' | 'group' | 'personNight'

export const optionUnitLabels: Record<OptionUnit, string> = {
  person: '1名',
  group: '1組',
  personNight: '1名1泊',
}

// オプション1件分のデータ（options.json の形）
export type ReserveOption = {
  id: string
  name: string
  price: number
  unit: OptionUnit
}
