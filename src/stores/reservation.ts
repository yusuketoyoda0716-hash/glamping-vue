import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Reservation, ReservationDraft } from '@/types/reservation'

// 予約番号をつくる（例：GL-20261106-4821）
const createNumber = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const random = Math.floor(1000 + Math.random() * 9000)
  return `GL-${date}-${random}`
}

// 予約の情報を、ページをまたいで持っておく場所
// （React でいう Context や Redux／Zustand にあたる）
export const useReservationStore = defineStore('reservation', () => {
  // 完了した予約（完了ページで表示する）
  const completed = ref<Reservation | null>(null)

  // 予約を送信する
  // 今はAPIがないので、少し待ってから成功したことにする
  // 本番では、ここで PHP のAPIに POST する
  const submit = async (draft: ReservationDraft) => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    const reservation: Reservation = { ...draft, number: createNumber() }
    completed.value = reservation
    return reservation
  }

  return { completed, submit }
})
