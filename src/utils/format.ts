// 12000 → "12,000円"
export const formatPrice = (price: number) => `${price.toLocaleString()}円`

// 定員の表示：「2〜4名」、最小と最大が同じなら「2名」
export const formatCapacity = (min: number, max: number) =>
  min === max ? `${max}名` : `${min}〜${max}名`
