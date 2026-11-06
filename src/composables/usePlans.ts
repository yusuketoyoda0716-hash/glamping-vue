import type { Plan } from '@/types/plan'
import { useJsonData } from './useJsonData'

// プランの一覧を取得する（React でいうカスタムフック）
export const usePlans = () => {
  const { data, isLoading, error } = useJsonData<Plan[]>(
    'data/plans.json',
    [],
    'プランを読み込めませんでした。時間をおいて、もう一度お試しください。',
  )
  return { plans: data, isLoading, error }
}
