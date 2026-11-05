import { ref, onMounted } from 'vue'
import type { Availability } from '@/types/availability'

// 空き状況を取得する
export const useAvailability = () => {
  const availability = ref<Availability | null>(null)
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  onMounted(async () => {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}data/availability.json`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      availability.value = await response.json()
    } catch {
      error.value = '空き状況を読み込めませんでした。時間をおいて、もう一度お試しください。'
    } finally {
      isLoading.value = false
    }
  })

  return { availability, isLoading, error }
}
