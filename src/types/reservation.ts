// お客様情報（フォームの入力内容）
export type Customer = {
  name: string
  kana: string
  tel: string
  arrival: string
  email: string
  emailConfirm: string
  memo: string
}

// 項目ごとのエラーメッセージ（エラーがない項目は入らない）
export type CustomerErrors = Partial<Record<keyof Customer, string>>

// 予約の内容（確認画面に出すもの・送信するもの）
export type ReservationDraft = {
  planName: string
  checkin: string
  checkout: string
  nights: number
  adults: number
  children: number
  options: string[] // 選んだオプションの名前
  customer: Customer
  total: number
}

// 予約が完了したあとのデータ（予約番号がつく）
export type Reservation = ReservationDraft & {
  number: string
}
