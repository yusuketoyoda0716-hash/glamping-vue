<script setup lang="ts">
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
</script>

<template>
  <SiteHeader />
  <main>
    <!-- URLに合わせて、ここにトップ・プラン一覧・予約のどれかが入る -->
    <RouterView />
  </main>
  <SiteFooter />
</template>
