import type { Availability } from '@/types/availability'
import { useJsonData } from './useJsonData'

// 空き状況を取得する
export const useAvailability = () => {
  const { data, isLoading, error } = useJsonData<Availability | null>(
    'data/availability.json',
    null,
    '空き状況を読み込めませんでした。時間をおいて、もう一度お試しください。',
  )
  return { availability: data, isLoading, error }
}
