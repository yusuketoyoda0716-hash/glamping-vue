import { ref, onMounted } from 'vue'
import type { Plan } from '@/types/plan'

// プランの一覧を取得する（React でいうカスタムフック）
export const usePlans = () => {
  const plans = ref<Plan[]>([])
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  onMounted(async () => {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}data/plans.json`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      plans.value = await response.json()
    } catch {
      error.value = 'プランを読み込めませんでした。時間をおいて、もう一度お試しください。'
    } finally {
      isLoading.value = false
    }
  })

  return { plans, isLoading, error }
}
