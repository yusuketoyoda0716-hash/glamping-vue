// URLのクエリ（?adults=2 など）の値を、使える形に変換する

// 0以上の整数に変換する。変換できなければ fallback を返す
export const toNumber = (value: unknown, fallback: number) => {
  const number = Number(value)
  return Number.isInteger(number) && number >= 0 ? number : fallback
}

// min〜max の範囲に収める
export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)
