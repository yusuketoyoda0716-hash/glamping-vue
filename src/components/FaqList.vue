<script setup lang="ts">
import { ref } from 'vue'
import FaqItem from './FaqItem.vue'

type Faq = {
  id: number
  question: string
  answer: string
}

const faqs: Faq[] = [
  {
    id: 1,
    question: '雨の日はどうなりますか？',
    answer:
      '雨の日も営業しています。テントやコテージには屋根付きのテラスがあり、BBQもテラスで楽しめます。',
  },
  {
    id: 2,
    question: '手ぶらで行けますか？',
    answer:
      'はい。寝具・タオル・アメニティ・BBQの道具はすべて用意しています。着替えだけお持ちください。',
  },
  {
    id: 3,
    question: 'ペットは連れて行けますか？',
    answer: 'トレーラーハウスのプランのみ、小型犬・中型犬を2頭までお連れいただけます。',
  },
  {
    id: 4,
    question: 'キャンセル料はかかりますか？',
    answer:
      '7日前から20%、前日は50%、当日は100%のキャンセル料がかかります。天候による中止は無料です。',
  },
]

// 開いている質問のid（null なら全部閉じている）。最初は1つ目を開いておく
const openId = ref<number | null>(1)

const toggle = (id: number) => {
  // 開いているものをもう一度押したら閉じる。それ以外はその質問だけを開く
  openId.value = openId.value === id ? null : id
}
</script>

<template>
  <div class="faq-list">
    <FaqItem
      v-for="faq in faqs"
      :id="faq.id"
      :key="faq.id"
      :question="faq.question"
      :answer="faq.answer"
      :is-open="openId === faq.id"
      @toggle="toggle(faq.id)"
    />
  </div>
</template>
