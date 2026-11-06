<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CalendarPicker from '@/components/CalendarPicker.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { useAvailability } from '@/composables/useAvailability'
import { useOptions } from '@/composables/useOptions'
import { usePlans } from '@/composables/usePlans'
import { useReservationStore } from '@/stores/reservation'
import { addDays, formatDateJa, isValidDateKey, toDateKey } from '@/utils/date'
import { optionUnitLabels } from '@/types/option'
import type { Customer, ReservationDraft } from '@/types/reservation'
import { formatCapacity, formatPrice } from '@/utils/format'
import { calculatePrice } from '@/utils/price'
import { clamp, toNumber } from '@/utils/query'
import { validateCustomer } from '@/utils/validate'

const route = useRoute()
const router = useRouter()
const { plans, isLoading: isPlansLoading } = usePlans()
const { availability, error: availabilityError } = useAvailability()
const { options } = useOptions()
const reservationStore = useReservationStore()

const today = toDateKey(new Date())

// ---- URLのクエリから、選んだプランと条件を受け取る ----
const planId = typeof route.query.plan === 'string' ? route.query.plan : ''
const queryCheckin = typeof route.query.checkin === 'string' ? route.query.checkin : ''

const form = reactive({
  // 正しい日付で、今日以降のときだけ使う
  checkin: isValidDateKey(queryCheckin) && queryCheckin >= today ? queryCheckin : '',
  nights: clamp(toNumber(route.query.nights, 1), 1, 3),
  adults: clamp(toNumber(route.query.adults, 2), 1, 6),
  children: clamp(toNumber(route.query.children, 0), 0, 3),
  options: [] as string[], // 選んだオプションのid
})

// 選んだプラン（見つからなければ undefined）
const plan = computed(() => plans.value.find((item) => item.id === planId))

// ---- 日程 ----
// 宿泊する日の一覧（2泊なら2日分）
const stayDates = computed(() =>
  form.checkin ? Array.from({ length: form.nights }, (_, i) => addDays(form.checkin, i)) : [],
)
const checkoutDate = computed(() => (form.checkin ? addDays(form.checkin, form.nights) : ''))

// ---- 料金の内訳（日程・人数・オプションが変わるたびに計算し直す） ----
const price = computed(() => {
  if (!plan.value || stayDates.value.length === 0) return null
  return calculatePrice({
    plan: plan.value,
    stayDates: stayDates.value,
    holidays: availability.value?.holidays ?? [],
    adults: form.adults,
    children: form.children,
    options: options.value.filter((option) => form.options.includes(option.id)),
  })
})

// ---- 入力チェック ----
const errors = computed(() => {
  const list: string[] = []
  if (!plan.value) return list

  if (form.adults + form.children > plan.value.capacityMax) {
    list.push(`このプランの定員は${plan.value.capacityMax}名です。人数を見直してください。`)
  }

  const fullDates = availability.value?.plans[plan.value.id]?.full ?? []
  if (stayDates.value.some((date) => fullDates.includes(date))) {
    list.push('選んだ日程に満室の日が含まれています。別の日程をお選びください。')
  }
  return list
})

// ---- お客様情報 ----
const customer = reactive<Customer>({
  name: '',
  kana: '',
  tel: '',
  arrival: '',
  email: '',
  emailConfirm: '',
  memo: '',
})

const customerErrors = computed(() => validateCustomer(customer))

// エラーを出すタイミング：その項目から離れたとき（blur）か、確認ボタンを押したあと
// 入力を始めたばかりで、いきなり赤字が出ないようにするため
const touched = reactive<Partial<Record<keyof Customer, boolean>>>({})
const submitted = ref(false)

const errorOf = (field: keyof Customer) =>
  submitted.value || touched[field] ? customerErrors.value[field] : undefined

// 項目とinputのidの対応（エラーのときに、その入力欄へ移動するため）
const fieldIds: Record<keyof Customer, string> = {
  name: 'name',
  kana: 'kana',
  tel: 'tel',
  arrival: 'arrival',
  email: 'email',
  emailConfirm: 'email-confirm',
  memo: 'memo',
}

// 日程を選んでいないときのエラー（確認ボタンを押したあとだけ出す）
const checkinError = computed(() =>
  submitted.value && !form.checkin ? 'カレンダーから、チェックイン日を選んでください。' : '',
)

// ---- 進み具合（上のステップ表示） ----
const isDialogOpen = ref(false)

const currentStep = computed(() => {
  if (isDialogOpen.value) return 4
  if (!form.checkin || errors.value.length > 0) return 1
  if (!customer.name) return 2
  return 3
})

const stepLabels = ['日程・人数', 'オプション', 'お客様情報', '確認・完了']

// ---- 確認・送信 ----
// 確認画面に出す内容（日程が決まっていなければ null）
const draft = computed<ReservationDraft | null>(() => {
  if (!plan.value || !price.value) return null
  return {
    planName: plan.value.name,
    checkin: form.checkin,
    checkout: checkoutDate.value,
    nights: form.nights,
    adults: form.adults,
    children: form.children,
    options: price.value.options.map((option) => option.name),
    customer: { ...customer },
    total: price.value.total,
  }
})

const isSubmitting = ref(false)
const submitError = ref('')

// 「予約内容を確認する」を押したとき
const openConfirm = async () => {
  submitted.value = true

  // 日程・人数に問題があれば、カレンダーのところへ戻す
  if (!form.checkin || errors.value.length > 0) {
    document.getElementById('step1-title')?.scrollIntoView({ behavior: 'smooth' })
    return
  }

  // お客様情報にエラーがあれば、最初のエラーの入力欄にカーソルを移す
  const firstError = (Object.keys(fieldIds) as (keyof Customer)[]).find(
    (field) => customerErrors.value[field],
  )
  if (firstError) {
    await nextTick() // エラーメッセージが画面に出てから移動する
    document.getElementById(fieldIds[firstError])?.focus()
    return
  }

  submitError.value = ''
  isDialogOpen.value = true
}

// 「予約を確定する」を押したとき
const confirmReservation = async () => {
  if (!draft.value) return
  isSubmitting.value = true
  try {
    await reservationStore.submit(draft.value)
    isDialogOpen.value = false
    // replace にして、ブラウザの「戻る」で予約ページに戻らないようにする（二重予約を防ぐ）
    router.replace({ name: 'complete' })
  } catch {
    submitError.value = '送信できませんでした。時間をおいて、もう一度お試しください。'
  } finally {
    isSubmitting.value = false
  }
}

// ---- 条件が変わったら、URLのクエリにも反映する（更新しても残るように） ----
watch(form, () => {
  router.replace({
    query: {
      plan: planId,
      checkin: form.checkin || undefined,
      nights: String(form.nights),
      adults: String(form.adults),
      children: String(form.children),
    },
  })
})
</script>

<template>
  <!-- ページタイトルと進み具合（ステップ） -->
  <div class="page-header">
    <div class="page-header__inner">
      <h1 class="page-header__title">ご予約</h1>
      <ol class="steps">
        <li
          v-for="(label, index) in stepLabels"
          :key="label"
          class="steps__item"
          :class="{
            'is-current': currentStep === index + 1,
            'is-done': currentStep > index + 1,
          }"
          :aria-current="currentStep === index + 1 ? 'step' : undefined"
        >
          {{ index + 1 }} {{ label }}
        </li>
      </ol>
    </div>
  </div>

  <p v-if="isPlansLoading" class="plans__message">プランを読み込んでいます…</p>
  <div v-else-if="!plan" class="plans__message">
    <p>プランが見つかりませんでした。</p>
    <RouterLink :to="{ name: 'plans' }" class="button">プラン一覧へ戻る</RouterLink>
  </div>

  <div v-else class="reserve">
    <div class="reserve__main">
      <!-- 選んでいるプラン -->
      <div class="reserve-plan">
        <img
          class="reserve-plan__image"
          :src="plan.image"
          :alt="plan.imageAlt"
          width="800"
          height="600"
        />
        <div class="reserve-plan__body">
          <p class="reserve-plan__name">{{ plan.name }}</p>
          <ul class="tag-list">
            <li class="tag">定員 {{ formatCapacity(plan.capacityMin, plan.capacityMax) }}</li>
            <li class="tag">{{ plan.type }}</li>
          </ul>
          <RouterLink
            :to="{
              name: 'plans',
              query: {
                nights: form.nights,
                adults: form.adults,
                children: form.children,
              },
            }"
            class="reserve-plan__change"
          >
            プランを変更する
          </RouterLink>
        </div>
      </div>

      <form id="reserve-form" class="reserve-form" novalidate @submit.prevent="openConfirm">
        <!-- 1. 日程・人数 -->
        <section class="reserve-section" aria-labelledby="step1-title">
          <h2 id="step1-title" class="reserve-section__title">1. 日程・人数を選ぶ</h2>

          <p v-if="availabilityError" class="form-errors" role="alert">
            {{ availabilityError }}
          </p>

          <CalendarPicker
            v-model="form.checkin"
            :nights="form.nights"
            :today="today"
            :availability="availability?.plans[plan.id]"
            :holidays="availability?.holidays ?? []"
          />

          <p class="reserve-section__selected" aria-live="polite">
            <template v-if="form.checkin">
              {{ formatDateJa(form.checkin) }} 〜 {{ formatDateJa(checkoutDate) }}（{{
                form.nights
              }}泊）
            </template>
            <template v-else>カレンダーから、チェックイン日を選んでください</template>
          </p>

          <div class="reserve-section__fields reserve-section__fields--3">
            <div class="form-field">
              <label for="nights">泊数</label>
              <select id="nights" v-model.number="form.nights">
                <option v-for="n in 3" :key="n" :value="n">{{ n }}泊</option>
              </select>
            </div>
            <div class="form-field">
              <label for="adults">大人</label>
              <select id="adults" v-model.number="form.adults">
                <option v-for="n in 6" :key="n" :value="n">{{ n }}名</option>
              </select>
            </div>
            <div class="form-field">
              <label for="children">子ども</label>
              <select id="children" v-model.number="form.children">
                <option v-for="n in [0, 1, 2, 3]" :key="n" :value="n">{{ n }}名</option>
              </select>
            </div>
          </div>

          <p v-if="checkinError" class="form-errors" role="alert">
            {{ checkinError }}
          </p>

          <ul v-if="errors.length > 0" class="form-errors" role="alert">
            <li v-for="message in errors" :key="message">{{ message }}</li>
          </ul>
        </section>

        <!-- 2. オプション -->
        <fieldset class="reserve-section">
          <legend class="reserve-section__title">2. オプションを選ぶ</legend>
          <label v-for="option in options" :key="option.id" class="option">
            <input v-model="form.options" type="checkbox" :value="option.id" />
            {{ option.name }}
            <span class="option__price">
              ＋{{ formatPrice(option.price) }}／{{ optionUnitLabels[option.unit] }}
            </span>
          </label>
        </fieldset>

        <!-- 3. お客様情報 -->
        <section class="reserve-section" aria-labelledby="step3-title">
          <h2 id="step3-title" class="reserve-section__title">3. お客様情報</h2>
          <div class="reserve-section__fields reserve-section__fields--2">
            <div class="form-field">
              <label for="name">お名前<span class="required">必須</span></label>
              <input
                id="name"
                type="text"
                autocomplete="name"
                placeholder="山田 太郎"
                aria-required="true"
                v-model.trim="customer.name"
                :aria-invalid="!!errorOf('name')"
                :aria-describedby="errorOf('name') ? 'name-error' : undefined"
                @blur="touched.name = true"
              />
              <p v-if="errorOf('name')" id="name-error" class="field-error">
                {{ errorOf('name') }}
              </p>
            </div>
            <div class="form-field">
              <label for="kana">フリガナ<span class="required">必須</span></label>
              <input
                id="kana"
                type="text"
                placeholder="ヤマダ タロウ"
                aria-required="true"
                v-model.trim="customer.kana"
                :aria-invalid="!!errorOf('kana')"
                :aria-describedby="errorOf('kana') ? 'kana-error' : undefined"
                @blur="touched.kana = true"
              />
              <p v-if="errorOf('kana')" id="kana-error" class="field-error">
                {{ errorOf('kana') }}
              </p>
            </div>
            <div class="form-field">
              <label for="tel">電話番号<span class="required">必須</span></label>
              <input
                id="tel"
                type="tel"
                autocomplete="tel"
                placeholder="090-1234-5678"
                aria-required="true"
                v-model.trim="customer.tel"
                :aria-invalid="!!errorOf('tel')"
                :aria-describedby="errorOf('tel') ? 'tel-error' : undefined"
                @blur="touched.tel = true"
              />
              <p v-if="errorOf('tel')" id="tel-error" class="field-error">
                {{ errorOf('tel') }}
              </p>
            </div>
            <div class="form-field">
              <label for="arrival">到着予定時刻<span class="required">必須</span></label>
              <select
                id="arrival"
                v-model="customer.arrival"
                aria-required="true"
                :aria-invalid="!!errorOf('arrival')"
                :aria-describedby="errorOf('arrival') ? 'arrival-error' : undefined"
                @blur="touched.arrival = true"
              >
                <option value="">選択してください</option>
                <option
                  v-for="time in ['15:00', '16:00', '17:00', '18:00']"
                  :key="time"
                  :value="time"
                >
                  {{ time }}
                </option>
              </select>
              <p v-if="errorOf('arrival')" id="arrival-error" class="field-error">
                {{ errorOf('arrival') }}
              </p>
            </div>
            <div class="form-field">
              <label for="email">メールアドレス<span class="required">必須</span></label>
              <input
                id="email"
                type="email"
                autocomplete="email"
                placeholder="taro@example.com"
                aria-required="true"
                v-model.trim="customer.email"
                :aria-invalid="!!errorOf('email')"
                :aria-describedby="errorOf('email') ? 'email-error' : undefined"
                @blur="touched.email = true"
              />
              <p v-if="errorOf('email')" id="email-error" class="field-error">
                {{ errorOf('email') }}
              </p>
            </div>
            <div class="form-field">
              <label for="email-confirm"
                >メールアドレス（確認用）<span class="required">必須</span></label
              >
              <input
                id="email-confirm"
                type="email"
                autocomplete="off"
                aria-required="true"
                v-model.trim="customer.emailConfirm"
                :aria-invalid="!!errorOf('emailConfirm')"
                :aria-describedby="errorOf('emailConfirm') ? 'email-confirm-error' : undefined"
                @blur="touched.emailConfirm = true"
              />
              <p v-if="errorOf('emailConfirm')" id="email-confirm-error" class="field-error">
                {{ errorOf('emailConfirm') }}
              </p>
            </div>
            <div class="form-field form-field--full">
              <label for="memo">ご要望（任意）</label>
              <textarea
                id="memo"
                rows="4"
                placeholder="記念日・アレルギーなど"
                v-model.trim="customer.memo"
                :aria-invalid="!!errorOf('memo')"
                :aria-describedby="errorOf('memo') ? 'memo-error' : undefined"
                @blur="touched.memo = true"
              ></textarea>
              <p v-if="errorOf('memo')" id="memo-error" class="field-error">
                {{ errorOf('memo') }}
              </p>
            </div>
          </div>
        </section>
      </form>
    </div>

    <!-- 料金の内訳（PCでは右側に固定） -->
    <aside class="summary" aria-labelledby="summary-title">
      <h2 id="summary-title" class="summary__title">料金の内訳</h2>
      <p v-if="!price" class="summary__empty">日程を選ぶと、料金が表示されます</p>
      <dl v-else class="summary__list">
        <div v-if="price.weekday.nights > 0" class="summary__row">
          <dt>宿泊（平日）</dt>
          <dd>{{ formatPrice(price.weekday.perNight) }} × {{ price.weekday.nights }}泊</dd>
        </div>
        <div v-if="price.holidayEve.nights > 0" class="summary__row">
          <dt>宿泊（休前日）</dt>
          <dd>{{ formatPrice(price.holidayEve.perNight) }} × {{ price.holidayEve.nights }}泊</dd>
        </div>
        <div class="summary__row summary__row--sub">
          <dt>人数</dt>
          <dd>
            大人{{ form.adults }}名<template v-if="form.children > 0"
              >・子ども{{ form.children }}名（大人の半額）</template
            >
          </dd>
        </div>
        <div v-for="option in price.options" :key="option.id" class="summary__row">
          <dt>{{ option.name }}</dt>
          <dd>{{ formatPrice(option.amount) }}</dd>
        </div>
        <div class="summary__row summary__row--total">
          <dt>合計（税込）</dt>
          <dd>{{ formatPrice(price.total) }}</dd>
        </div>
      </dl>
      <p v-if="submitError" class="form-errors" role="alert">
        {{ submitError }}
      </p>
      <button type="submit" form="reserve-form" class="button button--primary summary__button">
        予約内容を確認する
      </button>
    </aside>
  </div>

  <!-- スマホ用：合計と確認ボタンを画面下に固定 -->
  <div v-if="plan" class="summary-bar">
    <p class="summary-bar__total">
      <span>合計（税込）</span>{{ price ? formatPrice(price.total) : '日程を選んでください' }}
    </p>
    <button type="submit" form="reserve-form" class="button button--primary">確認する</button>
  </div>

  <!-- 予約の確認ポップアップ -->
  <ConfirmDialog
    v-if="draft"
    v-model:open="isDialogOpen"
    :reservation="draft"
    :is-submitting="isSubmitting"
    @confirm="confirmReservation"
  />
</template>
