import type { ReserveOption } from '@/types/option'
import { useJsonData } from './useJsonData'

// オプションの一覧を取得する
export const useOptions = () => {
  const { data, isLoading, error } = useJsonData<ReserveOption[]>(
    'data/options.json',
    [],
    'オプションを読み込めませんでした。時間をおいて、もう一度お試しください。',
  )
  return { options: data, isLoading, error }
}
