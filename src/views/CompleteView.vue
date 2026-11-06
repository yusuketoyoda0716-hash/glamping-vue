<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useReservationStore } from '@/stores/reservation'
import { formatDateJa } from '@/utils/date'
import { formatPrice } from '@/utils/format'

// 予約ページで保存した、完了した予約を受け取る
const { completed } = storeToRefs(useReservationStore())
</script>

<template>
  <div class="page-header">
    <div class="page-header__inner">
      <h1 class="page-header__title">ご予約完了</h1>
      <ol class="steps">
        <li class="steps__item is-done">1 日程・人数</li>
        <li class="steps__item is-done">2 オプション</li>
        <li class="steps__item is-done">3 お客様情報</li>
        <li class="steps__item is-current" aria-current="step">4 確認・完了</li>
      </ol>
    </div>
  </div>

  <!-- ページを再読み込みすると予約の情報は消えるので、そのときの表示 -->
  <div v-if="!completed" class="plans__message">
    <p>表示できるご予約がありません。</p>
    <RouterLink :to="{ name: 'home' }" class="button">トップページへ戻る</RouterLink>
  </div>

  <section v-else class="complete">
    <h2 class="complete__title">ご予約ありがとうございます</h2>
    <p class="complete__text">
      ご予約を受け付けました。<br />
      確認メールを {{ completed.customer.email }} にお送りしました。<br />
      <small>（デモのため、実際にはメールは送信されません）</small>
    </p>
    <p class="complete__number">
      予約番号<strong>{{ completed.number }}</strong>
    </p>

    <dl class="confirm-dialog__list complete__list">
      <dt>プラン</dt>
      <dd>{{ completed.planName }}</dd>
      <dt>日程</dt>
      <dd>
        {{ formatDateJa(completed.checkin) }} 〜 {{ formatDateJa(completed.checkout) }}（{{
          completed.nights
        }}泊）
      </dd>
      <dt>人数</dt>
      <dd>大人{{ completed.adults }}名・子ども{{ completed.children }}名</dd>
      <dt>オプション</dt>
      <dd>
        {{ completed.options.length > 0 ? completed.options.join('、') : 'なし' }}
      </dd>
      <dt>合計（税込）</dt>
      <dd class="confirm-dialog__total">{{ formatPrice(completed.total) }}</dd>
    </dl>

    <RouterLink :to="{ name: 'home' }" class="button button--primary complete__button">
      トップページへ戻る
    </RouterLink>
  </section>
</template>
