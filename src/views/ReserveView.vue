<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import CalendarPicker from '@/components/CalendarPicker.vue'
import { useAvailability } from '@/composables/useAvailability'
import { usePlans } from '@/composables/usePlans'
import { addDays, formatDateJa, isValidDateKey, toDateKey } from '@/utils/date'
import { formatCapacity } from '@/utils/format'
import { clamp, toNumber } from '@/utils/query'

const route = useRoute()
const router = useRouter()
const { plans, isLoading: isPlansLoading } = usePlans()
const { availability, error: availabilityError } = useAvailability()

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
})

// 選んだプラン（見つからなければ undefined）
const plan = computed(() => plans.value.find((item) => item.id === planId))

// ---- 日程 ----
// 宿泊する日の一覧（2泊なら2日分）
const stayDates = computed(() =>
  form.checkin ? Array.from({ length: form.nights }, (_, i) => addDays(form.checkin, i)) : [],
)
const checkoutDate = computed(() => (form.checkin ? addDays(form.checkin, form.nights) : ''))

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
        <li class="steps__item is-current" aria-current="step">1 日程・人数</li>
        <li class="steps__item">2 オプション</li>
        <li class="steps__item">3 お客様情報</li>
        <li class="steps__item">4 確認・完了</li>
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
              query: { nights: form.nights, adults: form.adults, children: form.children },
            }"
            class="reserve-plan__change"
          >
            プランを変更する
          </RouterLink>
        </div>
      </div>

      <form id="reserve-form" class="reserve-form" @submit.prevent>
        <!-- 1. 日程・人数 -->
        <section class="reserve-section" aria-labelledby="step1-title">
          <h2 id="step1-title" class="reserve-section__title">1. 日程・人数を選ぶ</h2>

          <p v-if="availabilityError" class="form-errors" role="alert">{{ availabilityError }}</p>

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

          <ul v-if="errors.length > 0" class="form-errors" role="alert">
            <li v-for="message in errors" :key="message">{{ message }}</li>
          </ul>
        </section>

        <!-- 2. オプション -->
        <fieldset class="reserve-section">
          <legend class="reserve-section__title">2. オプションを選ぶ</legend>
          <label class="option"
            ><input type="checkbox" name="options" value="bbq" /> BBQセット<span
              class="option__price"
              >＋[　]円／1名</span
            ></label
          >
          <label class="option"
            ><input type="checkbox" name="options" value="fire" /> 焚き火セット<span
              class="option__price"
              >＋[　]円／1組</span
            ></label
          >
          <label class="option"
            ><input type="checkbox" name="options" value="breakfast" /> 朝食<span
              class="option__price"
              >＋[　]円／1名</span
            ></label
          >
          <label class="option"
            ><input type="checkbox" name="options" value="late" /> レイトチェックアウト<span
              class="option__price"
              >＋[　]円／1組</span
            ></label
          >
        </fieldset>

        <!-- 3. お客様情報 -->
        <section class="reserve-section" aria-labelledby="step3-title">
          <h2 id="step3-title" class="reserve-section__title">3. お客様情報</h2>
          <div class="reserve-section__fields reserve-section__fields--2">
            <div class="form-field">
              <label for="name">お名前<span class="required">必須</span></label>
              <input
                type="text"
                id="name"
                name="name"
                autocomplete="name"
                placeholder="山田 太郎"
                required
              />
            </div>
            <div class="form-field">
              <label for="kana">フリガナ<span class="required">必須</span></label>
              <input type="text" id="kana" name="kana" placeholder="ヤマダ タロウ" required />
            </div>
            <div class="form-field">
              <label for="tel">電話番号<span class="required">必須</span></label>
              <input
                type="tel"
                id="tel"
                name="tel"
                autocomplete="tel"
                placeholder="090-1234-5678"
                required
              />
            </div>
            <div class="form-field">
              <label for="arrival">到着予定時刻<span class="required">必須</span></label>
              <select id="arrival" name="arrival" required>
                <option value="">選択してください</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
                <option value="17:00">17:00</option>
                <option value="18:00">18:00</option>
              </select>
            </div>
            <div class="form-field">
              <label for="email">メールアドレス<span class="required">必須</span></label>
              <input
                type="email"
                id="email"
                name="email"
                autocomplete="email"
                placeholder="taro@example.com"
                required
              />
            </div>
            <div class="form-field">
              <label for="email-confirm"
                >メールアドレス（確認用）<span class="required">必須</span></label
              >
              <input
                type="email"
                id="email-confirm"
                name="email_confirm"
                autocomplete="off"
                required
              />
            </div>
            <div class="form-field form-field--full">
              <label for="memo">ご要望（任意）</label>
              <textarea
                id="memo"
                name="memo"
                rows="4"
                placeholder="記念日・アレルギーなど"
              ></textarea>
            </div>
          </div>
        </section>
      </form>
    </div>

    <!-- 料金の内訳（PCでは右側に固定） -->
    <aside class="summary" aria-labelledby="summary-title">
      <h2 id="summary-title" class="summary__title">料金の内訳</h2>
      <dl class="summary__list">
        <div class="summary__row">
          <dt>宿泊（平日）</dt>
          <dd>[　]円 × [　]泊</dd>
        </div>
        <div class="summary__row">
          <dt>宿泊（休前日）</dt>
          <dd>[　]円 × [　]泊</dd>
        </div>
        <div class="summary__row">
          <dt>人数</dt>
          <dd>大人2名・子ども0名</dd>
        </div>
        <div class="summary__row">
          <dt>オプション</dt>
          <dd>[　]円</dd>
        </div>
        <div class="summary__row summary__row--total">
          <dt>合計（税込）</dt>
          <dd>[　]円</dd>
        </div>
      </dl>
      <button type="submit" form="reserve-form" class="button button--primary summary__button">
        予約内容を確認する
      </button>
    </aside>
  </div>

  <!-- スマホ用：合計と確認ボタンを画面下に固定 -->
  <div v-if="plan" class="summary-bar">
    <p class="summary-bar__total"><span>合計（税込）</span>[　]円</p>
    <button type="submit" form="reserve-form" class="button button--primary">確認する</button>
  </div>

  <!-- 予約の確認ポップアップ（JSで開く） -->
  <dialog id="confirm-dialog" class="confirm-dialog" aria-labelledby="confirm-title">
    <div class="confirm-dialog__head">
      <h2 id="confirm-title" class="confirm-dialog__title">ご予約内容の確認</h2>
      <form method="dialog">
        <button type="submit" class="confirm-dialog__close" aria-label="閉じる">×</button>
      </form>
    </div>
    <dl class="confirm-dialog__list">
      <dt>プラン</dt>
      <dd>ドームテント スタンダード</dd>
      <dt>日程</dt>
      <dd>11月14日（土）〜1泊</dd>
      <dt>人数</dt>
      <dd>大人2名・子ども0名</dd>
      <dt>オプション</dt>
      <dd>[選んだオプション]</dd>
      <dt>お名前</dt>
      <dd>[お名前]</dd>
      <dt>連絡先</dt>
      <dd>[電話番号]／[メールアドレス]</dd>
      <dt>合計（税込）</dt>
      <dd class="confirm-dialog__total">[　]円</dd>
    </dl>
    <div class="confirm-dialog__actions">
      <form method="dialog">
        <button type="submit" class="button">戻って修正する</button>
      </form>
      <button type="button" class="button button--primary">予約を確定する</button>
    </div>
  </dialog>
</template>
