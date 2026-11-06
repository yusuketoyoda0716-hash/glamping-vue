<script setup lang="ts"></script>

<template>
  <!-- フッター（全ページ共通） -->
  <footer class="site-footer">
    <div class="site-footer__inner">
      <nav aria-label="フッターナビゲーション">
        <ul class="site-footer__nav">
          <li><RouterLink to="/#about">施設について</RouterLink></li>
          <li><RouterLink to="/plans">プラン</RouterLink></li>
          <li><RouterLink to="/#activity">アクティビティ</RouterLink></li>
          <li><RouterLink to="/#faq">よくある質問</RouterLink></li>
          <li><RouterLink to="/#access">アクセス</RouterLink></li>
        </ul>
      </nav>
      <p class="site-footer__copyright"><small>&copy; FOREST GLAMPING</small></p>
    </div>
    <!-- 公開するので、架空のサイトであることを明記する -->
    <p class="site-footer__note">
      ※このサイトはポートフォリオ用に制作した架空の施設です。実際に予約することはできません。
    </p>
  </footer>
</template>
