<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DayStatus, PlanAvailability } from '@/types/availability'
import { addDays, fromDateKey, isHolidayEve, toDateKey } from '@/utils/date'

const props = defineProps<{
  nights: number
  today: string
  availability?: PlanAvailability
  holidays: string[]
}>()

// 選んだチェックイン日（親と v-model でつながる）
const checkin = defineModel<string>({ required: true })

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']
const MAX_MONTHS_AHEAD = 4 // 何か月先まで予約できるか

const STATUS: Record<DayStatus, { mark: string; text: string }> = {
  ok: { mark: '○', text: '空きあり' },
  few: { mark: '△', text: '残りわずか' },
  full: { mark: '×', text: '満室' },
}

type Day = {
  key: string
  date: number
  mark: string
  label: string
  isEve: boolean
  isDisabled: boolean
  isCheckin: boolean
  isStay: boolean
  isCheckout: boolean
}

// ---- 表示している月 ----
const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)

const minMonth = startOfMonth(fromDateKey(props.today))
const maxMonth = new Date(minMonth.getFullYear(), minMonth.getMonth() + MAX_MONTHS_AHEAD, 1)
const viewMonth = ref(startOfMonth(fromDateKey(checkin.value || props.today)))

const monthLabel = computed(
  () => `${viewMonth.value.getFullYear()}年${viewMonth.value.getMonth() + 1}月`,
)
const canPrev = computed(() => viewMonth.value > minMonth)
const canNext = computed(() => viewMonth.value < maxMonth)

const moveMonth = (diff: number) => {
  const current = viewMonth.value
  viewMonth.value = new Date(current.getFullYear(), current.getMonth() + diff, 1)
}

// ---- その日の空き状況 ----
const statusOf = (key: string): DayStatus => {
  if (props.availability?.full.includes(key)) return 'full'
  if (props.availability?.few.includes(key)) return 'few'
  return 'ok'
}

// ---- カレンダーのマス（1週間ずつの配列） ----
const weeks = computed(() => {
  const year = viewMonth.value.getFullYear()
  const month = viewMonth.value.getMonth()
  const lastDate = new Date(year, month + 1, 0).getDate() // 月末の日
  const checkout = checkin.value ? addDays(checkin.value, props.nights) : ''

  // 1日の曜日の数だけ、前に空のマスを入れる
  const cells: (Day | null)[] = Array(viewMonth.value.getDay()).fill(null)

  for (let date = 1; date <= lastDate; date++) {
    const key = toDateKey(new Date(year, month, date))
    const isPast = key < props.today
    const status = statusOf(key)
    const isEve = isHolidayEve(key, props.holidays)
    const weekday = WEEKDAYS[new Date(year, month, date).getDay()]

    cells.push({
      key,
      date,
      mark: isPast ? '' : STATUS[status].mark,
      label: `${month + 1}月${date}日（${weekday}） ${isPast ? '選択できません' : STATUS[status].text}${isEve ? ' 休前日料金' : ''}`,
      isEve,
      isDisabled: isPast || status === 'full',
      isCheckin: key === checkin.value,
      isStay: checkin.value !== '' && key >= checkin.value && key < checkout,
      isCheckout: key === checkout,
    })
  }

  // 最後の週の残りを空のマスで埋める
  while (cells.length % 7 !== 0) {
    cells.push(null)
  }

  const rows: (Day | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7))
  }
  return rows
})

const select = (day: Day) => {
  if (!day.isDisabled) {
    checkin.value = day.key
  }
}
</script>

<template>
  <div class="calendar">
    <div class="calendar__head">
      <button
        type="button"
        class="calendar__nav"
        aria-label="前の月"
        :disabled="!canPrev"
        @click="moveMonth(-1)"
      >
        ＜
      </button>
      <p class="calendar__month" aria-live="polite">{{ monthLabel }}</p>
      <button
        type="button"
        class="calendar__nav"
        aria-label="次の月"
        :disabled="!canNext"
        @click="moveMonth(1)"
      >
        ＞
      </button>
    </div>

    <table class="calendar__table">
      <thead>
        <tr>
          <th v-for="weekday in WEEKDAYS" :key="weekday" scope="col">{{ weekday }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, i) in weeks" :key="i">
          <td v-for="(day, j) in week" :key="day?.key ?? `empty-${i}-${j}`">
            <button
              v-if="day"
              type="button"
              class="calendar__day"
              :class="{
                'calendar__day--eve': day.isEve,
                'is-selected': day.isStay,
                'is-checkout': day.isCheckout,
              }"
              :disabled="day.isDisabled"
              :aria-label="day.label"
              :aria-pressed="day.isCheckin"
              @click="select(day)"
            >
              {{ day.date }}
              <span class="calendar__mark" aria-hidden="true">{{ day.mark }}</span>
              <span v-if="day.isEve" class="calendar__eve" aria-hidden="true">休前日</span>
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <ul class="calendar__legend">
      <li>○ 空きあり</li>
      <li>△ 残りわずか</li>
      <li>× 満室</li>
      <li>「休前日」は休前日料金</li>
      <li>濃い緑＝宿泊する日、薄い緑＝チェックアウト日</li>
    </ul>
  </div>
</template>
