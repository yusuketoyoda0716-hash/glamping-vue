<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PlanRow from '@/components/PlanRow.vue'
import { usePlans } from '@/composables/usePlans'
import { featureLabels, type Feature } from '@/types/plan'
import { toNumber } from '@/utils/query'

type SortKey = 'recommend' | 'price' | 'capacity'

const route = useRoute()
const router = useRouter()
const { plans, isLoading, error } = usePlans()

// こだわり条件の種類の一覧（['pet', 'bbq', 'sauna', 'breakfast']）
const featureKeys = Object.keys(featureLabels) as Feature[]

// ---- URLのクエリ（?adults=2 など）を、使える値に変換する ----
const toFeatures = (value: unknown): Feature[] => {
  const list = Array.isArray(value) ? value : [value]
  return featureKeys.filter((key) => list.includes(key))
}

const toSort = (value: unknown): SortKey =>
  value === 'price' || value === 'capacity' ? value : 'recommend'

// ---- 検索条件（URLのクエリがあれば、それを初期値にする） ----
const conditions = reactive({
  checkin: typeof route.query.checkin === 'string' ? route.query.checkin : '',
  nights: toNumber(route.query.nights, 1),
  adults: toNumber(route.query.adults, 2),
  children: toNumber(route.query.children, 0),
  features: toFeatures(route.query.features),
  sort: toSort(route.query.sort),
})

// ---- 条件に合うプランを、並べ替えた状態で返す ----
const filteredPlans = computed(() => {
  const people = conditions.adults + conditions.children

  const result = plans.value.filter(
    (plan) =>
      people <= plan.capacityMax &&
      conditions.features.every((feature) => plan.features.includes(feature)),
  )

  // 元の配列を変えないよう、コピーしてから並べ替える
  if (conditions.sort === 'price') {
    return [...result].sort((a, b) => a.priceWeekday - b.priceWeekday)
  }
  if (conditions.sort === 'capacity') {
    return [...result].sort((a, b) => b.capacityMax - a.capacityMax)
  }
  return result
})

// ---- 条件が変わったら、URLのクエリにも反映する ----
watch(conditions, () => {
  router.replace({
    query: {
      checkin: conditions.checkin || undefined,
      nights: String(conditions.nights),
      adults: String(conditions.adults),
      children: String(conditions.children),
      features: conditions.features.length > 0 ? conditions.features : undefined,
      sort: conditions.sort === 'recommend' ? undefined : conditions.sort,
    },
  })
})
</script>

<template>
  <!-- ページタイトルとパンくずリスト -->
  <div class="page-header">
    <div class="page-header__inner">
      <nav aria-label="パンくずリスト">
        <ol class="breadcrumb">
          <li><RouterLink to="/">トップ</RouterLink></li>
          <li aria-current="page">宿泊プラン</li>
        </ol>
      </nav>
      <h1 class="page-header__title">宿泊プラン一覧</h1>
    </div>
  </div>

  <div class="plans">
    <!-- 絞り込み条件（選ぶとその場で一覧が変わる） -->
    <form class="filter" @submit.prevent>
      <fieldset class="filter__group">
        <legend class="filter__title">宿泊条件</legend>
        <div class="filter__fields">
          <div class="form-field">
            <label for="filter-checkin">チェックイン日</label>
            <input id="filter-checkin" v-model="conditions.checkin" type="date" />
          </div>
          <div class="form-field">
            <label for="filter-nights">泊数</label>
            <select id="filter-nights" v-model.number="conditions.nights">
              <option v-for="n in 3" :key="n" :value="n">{{ n }}泊</option>
            </select>
          </div>
          <div class="form-field">
            <label for="filter-adults">大人</label>
            <select id="filter-adults" v-model.number="conditions.adults">
              <option v-for="n in 6" :key="n" :value="n">{{ n }}名</option>
            </select>
          </div>
          <div class="form-field">
            <label for="filter-children">子ども（小学生以下）</label>
            <select id="filter-children" v-model.number="conditions.children">
              <option v-for="n in [0, 1, 2, 3]" :key="n" :value="n">{{ n }}名</option>
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset class="filter__group">
        <legend class="filter__title">こだわり条件</legend>
        <div class="filter__checks">
          <label v-for="key in featureKeys" :key="key">
            <input v-model="conditions.features" type="checkbox" :value="key" />
            {{ featureLabels[key] }}
          </label>
        </div>
      </fieldset>
    </form>

    <!-- 件数と並び替え -->
    <div class="result-bar">
      <p class="result-bar__count">
        <strong>{{ filteredPlans.length }}件</strong>のプランが見つかりました
      </p>
      <div class="result-bar__sort">
        <label for="sort">並び替え</label>
        <select id="sort" v-model="conditions.sort">
          <option value="recommend">おすすめ順</option>
          <option value="price">料金の安い順</option>
          <option value="capacity">定員の多い順</option>
        </select>
      </div>
    </div>

    <!-- プランの一覧 -->
    <p v-if="isLoading" class="plans__message">プランを読み込んでいます…</p>
    <p v-else-if="error" class="plans__message plans__message--error" role="alert">{{ error }}</p>
    <p v-else-if="filteredPlans.length === 0" class="plans__message">
      条件に合うプランがありません。人数やこだわり条件を変えてお試しください。
    </p>
    <ul v-else class="plan-results">
      <li v-for="plan in filteredPlans" :key="plan.id">
        <PlanRow
          :plan="plan"
          :checkin="conditions.checkin"
          :adults="conditions.adults"
          :children="conditions.children"
          :nights="conditions.nights"
        />
      </li>
    </ul>
  </div>
</template>