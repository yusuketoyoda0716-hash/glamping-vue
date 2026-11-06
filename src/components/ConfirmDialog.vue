<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ReservationDraft } from '@/types/reservation'
import { formatDateJa } from '@/utils/date'
import { formatPrice } from '@/utils/format'

// 開いているかどうか（親と v-model:open でつながる）
const open = defineModel<boolean>('open', { required: true })

const props = defineProps<{
  reservation: ReservationDraft
  isSubmitting: boolean
}>()

const emit = defineEmits<{
  confirm: []
}>()

const dialog = ref<HTMLDialogElement | null>(null)

// open が変わったら、<dialog> を開く・閉じる
watch(open, (value) => {
  const element = dialog.value
  if (!element) return
  if (value && !element.open) element.showModal()
  if (!value && element.open) element.close()
})

// Escキーなどで閉じられたときも、親に伝える
const handleClose = () => {
  open.value = false
}

// 送信中は Escキーで閉じられないようにする
const handleCancel = (event: Event) => {
  if (props.isSubmitting) event.preventDefault()
}
</script>

<template>
  <!-- 予約の確認ポップアップ -->
  <dialog
    ref="dialog"
    class="confirm-dialog"
    aria-labelledby="confirm-title"
    @close="handleClose"
    @cancel="handleCancel"
  >
    <div class="confirm-dialog__head">
      <h2 id="confirm-title" class="confirm-dialog__title">ご予約内容の確認</h2>
      <button
        type="button"
        class="confirm-dialog__close"
        aria-label="閉じる"
        :disabled="isSubmitting"
        @click="open = false"
      >
        ×
      </button>
    </div>
    <dl class="confirm-dialog__list">
      <dt>プラン</dt>
      <dd>{{ reservation.planName }}</dd>
      <dt>日程</dt>
      <dd>
        {{ formatDateJa(reservation.checkin) }} 〜 {{ formatDateJa(reservation.checkout) }}（{{
          reservation.nights
        }}泊）
      </dd>
      <dt>人数</dt>
      <dd>大人{{ reservation.adults }}名・子ども{{ reservation.children }}名</dd>
      <dt>オプション</dt>
      <dd>
        {{ reservation.options.length > 0 ? reservation.options.join('、') : 'なし' }}
      </dd>
      <dt>お名前</dt>
      <dd>{{ reservation.customer.name }}（{{ reservation.customer.kana }}）</dd>
      <dt>連絡先</dt>
      <dd>{{ reservation.customer.tel }}／{{ reservation.customer.email }}</dd>
      <dt>到着予定</dt>
      <dd>{{ reservation.customer.arrival }}</dd>
      <template v-if="reservation.customer.memo">
        <dt>ご要望</dt>
        <dd class="confirm-dialog__memo">{{ reservation.customer.memo }}</dd>
      </template>
      <dt>合計（税込）</dt>
      <dd class="confirm-dialog__total">
        {{ formatPrice(reservation.total) }}
      </dd>
    </dl>
    <div class="confirm-dialog__actions">
      <button type="button" class="button" :disabled="isSubmitting" @click="open = false">
        戻って修正する
      </button>
      <button
        type="button"
        class="button button--primary"
        :disabled="isSubmitting"
        @click="emit('confirm')"
      >
        {{ isSubmitting ? '送信しています…' : '予約を確定する' }}
      </button>
    </div>
  </dialog>
</template>
