<script setup lang="ts">
// 親（FaqList）から受け取る値
defineProps<{
  id: number
  question: string
  answer: string
  isOpen: boolean
}>()

// 親に「押されました」と知らせるイベント
const emit = defineEmits<{
  toggle: []
}>()
</script>

<template>
  <div class="faq-item" :class="{ 'is-open': isOpen }">
    <h3 class="faq-item__heading">
      <button
        :id="`faq-question-${id}`"
        type="button"
        class="faq-item__question"
        :aria-expanded="isOpen"
        :aria-controls="`faq-answer-${id}`"
        @click="emit('toggle')"
      >
        {{ question }}
      </button>
    </h3>
    <Transition name="faq">
      <p
        v-show="isOpen"
        :id="`faq-answer-${id}`"
        class="faq-item__answer"
        role="region"
        :aria-labelledby="`faq-question-${id}`"
      >
        {{ answer }}
      </p>
    </Transition>
  </div>
</template>
