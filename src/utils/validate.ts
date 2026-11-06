import type { Customer, CustomerErrors } from '@/types/reservation'

// カタカナ・長音・スペースだけ
const KANA_PATTERN = /^[ァ-ヶー\s　]+$/
// 0から始まる数字（ハイフンはあってもなくてもよい）
const TEL_PATTERN = /^0[0-9-]+$/
// 「文字@文字.文字」の形
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// お客様情報の入力チェック（画面には関係しない、ただのチェック）
export const validateCustomer = (customer: Customer): CustomerErrors => {
  const errors: CustomerErrors = {}

  if (!customer.name) {
    errors.name = 'お名前を入力してください'
  } else if (customer.name.length > 50) {
    errors.name = 'お名前は50文字以内で入力してください'
  }

  if (!customer.kana) {
    errors.kana = 'フリガナを入力してください'
  } else if (!KANA_PATTERN.test(customer.kana)) {
    errors.kana = 'フリガナはカタカナで入力してください'
  }

  const telDigits = customer.tel.replace(/-/g, '').length
  if (!customer.tel) {
    errors.tel = '電話番号を入力してください'
  } else if (!TEL_PATTERN.test(customer.tel) || telDigits < 10 || telDigits > 11) {
    errors.tel = '電話番号の形式が正しくありません（例：090-1234-5678）'
  }

  if (!customer.arrival) {
    errors.arrival = '到着予定時刻を選んでください'
  }

  if (!customer.email) {
    errors.email = 'メールアドレスを入力してください'
  } else if (!EMAIL_PATTERN.test(customer.email)) {
    errors.email = 'メールアドレスの形式が正しくありません'
  }

  if (!customer.emailConfirm) {
    errors.emailConfirm = '確認用のメールアドレスを入力してください'
  } else if (customer.emailConfirm !== customer.email) {
    errors.emailConfirm = 'メールアドレスが一致しません'
  }

  if (customer.memo.length > 500) {
    errors.memo = 'ご要望は500文字以内で入力してください'
  }

  return errors
}
