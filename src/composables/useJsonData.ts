import { ref, onMounted, type Ref } from 'vue'

// public/data にあるJSONを取得する共通の処理
//   path：'data/plans.json' のようなパス
//   initial：読み込む前の初期値
//   errorMessage：読み込めなかったときに表示する文章
export const useJsonData = <T>(path: string, initial: T, errorMessage: string) => {
  const data = ref(initial) as Ref<T>
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  onMounted(async () => {
    try {
      const response = await fetch(`${import.meta.env.BASE_URL}${path}`)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      data.value = await response.json()
    } catch {
      error.value = errorMessage
    } finally {
      isLoading.value = false
    }
  })

  return { data, isLoading, error }
}
