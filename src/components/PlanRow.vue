<script setup lang="ts">
import { computed } from 'vue'
import { featureLabels, type Plan } from '@/types/plan'
import { formatPrice } from '@/utils/format'

const props = defineProps<{
  plan: Plan
  checkin: string
  adults: number
  children: number
  nights: number
}>()

// 定員の表示：「2〜4名」、最小と最大が同じなら「2名」
const capacityText = computed(() =>
  props.plan.capacityMin === props.plan.capacityMax
    ? `${props.plan.capacityMax}名`
    : `${props.plan.capacityMin}〜${props.plan.capacityMax}名`,
)

// 合計金額（平日料金で計算。子どもは大人の半額）
const totalPrice = computed(() => {
  const adultPrice = props.plan.priceWeekday * props.adults
  const childPrice = Math.round(props.plan.priceWeekday * 0.5) * props.children
  return (adultPrice + childPrice) * props.nights
})

const isFull = computed(() => props.plan.stock === 0)

// 予約ページへのリンク（選んだ条件を引き継ぐ）
const reserveLink = computed(() => ({
  name: 'reserve',
  query: {
    plan: props.plan.id,
    checkin: props.checkin || undefined,
    nights: String(props.nights),
    adults: String(props.adults),
    children: String(props.children),
  },
}))
</script>

<template>
  <article class="plan-row" :class="{ 'plan-row--full': isFull }">
    <img
      class="plan-row__image"
      :src="plan.image"
      :alt="plan.imageAlt"
      width="800"
      height="600"
      loading="lazy"
    />
    <div class="plan-row__body">
      <h2 class="plan-row__name">{{ plan.name }}</h2>
      <ul class="tag-list">
        <li class="tag">定員 {{ capacityText }}</li>
        <li class="tag">{{ plan.type }}</li>
        <li v-for="feature in plan.features" :key="feature" class="tag">
          {{ featureLabels[feature] }}
        </li>
      </ul>
      <p class="plan-row__text">{{ plan.description }}</p>
      <p class="plan-row__stock">
        空き状況：<strong>{{ isFull ? '満室' : `残り${plan.stock}棟` }}</strong>
      </p>
    </div>
    <div class="plan-row__price">
      <p class="plan-row__price-label">
        大人{{ adults }}名<template v-if="children > 0">・子ども{{ children }}名</template>・{{
          nights
        }}泊の合計
      </p>
      <p class="plan-row__price-value">{{ formatPrice(totalPrice) }}〜</p>
      <button v-if="isFull" type="button" class="button" disabled>満室</button>
      <RouterLink v-else :to="reserveLink" class="button button--primary">
        このプランで予約
      </RouterLink>
    </div>
  </article>
</template>
