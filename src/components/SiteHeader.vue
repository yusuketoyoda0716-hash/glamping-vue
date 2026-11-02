<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

// メニューが開いているかどうか
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

// ページを移動したら（リンクを押したら）メニューを閉じる
const route = useRoute()

watch(
  () => route.fullPath,
  () => {
    isMenuOpen.value = false
  },
)
</script>

<template>
  <!-- ヘッダー（全ページ共通） -->
  <header class="site-header">
    <div class="site-header__inner">
      <RouterLink to="/" class="site-header__logo">
        <img src="/images/logo.webp" alt="[施設名]" width="180" height="44" />
      </RouterLink>
      <button
        type="button"
        class="site-header__menu-button"
        :aria-label="isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'"
        :aria-expanded="isMenuOpen"
        aria-controls="global-nav"
        @click="toggleMenu"
      >
        <span class="site-header__menu-icon"></span>
      </button>
      <nav
        id="global-nav"
        class="global-nav"
        :class="{ 'is-open': isMenuOpen }"
        aria-label="グローバルナビゲーション"
      >
        <ul class="global-nav__list">
          <li><RouterLink to="/#about">施設について</RouterLink></li>
          <li><RouterLink to="/plans">プラン</RouterLink></li>
          <li><RouterLink to="/#activity">アクティビティ</RouterLink></li>
          <li><RouterLink to="/#faq">よくある質問</RouterLink></li>
          <li><RouterLink to="/#access">アクセス</RouterLink></li>
        </ul>
        <RouterLink to="/plans" class="button button--primary">空室検索・予約</RouterLink>
      </nav>
    </div>
  </header>
</template>
