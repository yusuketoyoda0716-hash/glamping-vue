<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import FaqList from '@/components/FaqList.vue'

const router = useRouter()

// 空室検索の入力内容
const search = reactive({
  checkin: '',
  nights: 1,
  adults: 2,
})

// 検索したら、条件をURLのクエリに付けてプラン一覧へ移動する
const submitSearch = () => {
  router.push({
    name: 'plans',
    query: {
      checkin: search.checkin || undefined,
      nights: String(search.nights),
      adults: String(search.adults),
    },
  })
}
</script>

<template>
  <!-- メインビジュアルと空室検索 -->
  <section class="hero">
    <img
      class="hero__image"
      src="/images/hero.webp"
      alt="森の中に並ぶドームテント"
      width="1600"
      height="900"
    />
    <div class="hero__content">
      <h1 class="hero__title">[キャッチコピー]</h1>
      <p class="hero__lead">[施設の紹介文。森の中で過ごす、1日数組限定のグランピング など]</p>

      <form class="search-form" @submit.prevent="submitSearch">
        <p class="search-form__title">空室を検索</p>
        <div class="search-form__fields">
          <div class="form-field">
            <label for="search-checkin">チェックイン日</label>
            <input id="search-checkin" v-model="search.checkin" type="date" />
          </div>
          <div class="form-field">
            <label for="search-nights">泊数</label>
            <select id="search-nights" v-model.number="search.nights">
              <option v-for="n in 3" :key="n" :value="n">{{ n }}泊</option>
            </select>
          </div>
          <div class="form-field">
            <label for="search-adults">人数</label>
            <select id="search-adults" v-model.number="search.adults">
              <option v-for="n in 6" :key="n" :value="n">{{ n }}名</option>
            </select>
          </div>
          <button type="submit" class="button button--primary">検索</button>
        </div>
      </form>
    </div>
  </section>

  <!-- 施設について -->
  <section id="about" class="section about" aria-labelledby="about-title">
    <div class="section__inner about__inner">
      <img
        class="about__image"
        src="/images/concept.webp"
        alt="木々に囲まれたテントサイト"
        width="1200"
        height="800"
        loading="lazy"
      />
      <div class="about__body">
        <h2 id="about-title" class="section__title">[施設名]について</h2>
        <p>[コンセプトの説明文。どんな場所で、どんな過ごし方ができるのかを3〜4行で]</p>
        <a href="#activity" class="button">過ごし方を見る</a>
      </div>
    </div>
  </section>

  <!-- おすすめプラン -->
  <section id="recommend" class="section section--gray recommend" aria-labelledby="recommend-title">
    <div class="section__inner">
      <div class="section__head">
        <h2 id="recommend-title" class="section__title">おすすめプラン</h2>
        <RouterLink to="/plans" class="section__more">プラン一覧を見る</RouterLink>
      </div>
      <ul class="plan-list">
        <li>
          <article class="plan-card">
            <img
              class="plan-card__image"
              src="/images/plan-dome.webp"
              alt="ドームテントの外観"
              width="800"
              height="600"
              loading="lazy"
            />
            <h3 class="plan-card__name">ドームテント スタンダード</h3>
            <p class="plan-card__meta">定員 2〜4名／ドームテント</p>
            <p class="plan-card__price">1泊 [　]円〜（1名）</p>
            <RouterLink to="/reserve?plan=dome" class="button">詳しく見る</RouterLink>
          </article>
        </li>
        <li>
          <article class="plan-card">
            <img
              class="plan-card__image"
              src="/images/plan-cottage.webp"
              alt="サウナ付きコテージの外観"
              width="800"
              height="600"
              loading="lazy"
            />
            <h3 class="plan-card__name">森のコテージ（サウナ付き）</h3>
            <p class="plan-card__meta">定員 2〜4名／コテージ</p>
            <p class="plan-card__price">1泊 [　]円〜（1名）</p>
            <RouterLink to="/reserve?plan=cottage" class="button">詳しく見る</RouterLink>
          </article>
        </li>
        <li>
          <article class="plan-card">
            <img
              class="plan-card__image"
              src="/images/plan-trailer.webp"
              alt="トレーラーハウスの外観"
              width="800"
              height="600"
              loading="lazy"
            />
            <h3 class="plan-card__name">トレーラーハウス（ペット可）</h3>
            <p class="plan-card__meta">定員 2〜6名／トレーラー</p>
            <p class="plan-card__price">1泊 [　]円〜（1名）</p>
            <RouterLink to="/reserve?plan=trailer" class="button">詳しく見る</RouterLink>
          </article>
        </li>
      </ul>
    </div>
  </section>

  <!-- アクティビティ -->
  <section id="activity" class="section activity" aria-labelledby="activity-title">
    <div class="section__inner">
      <h2 id="activity-title" class="section__title">アクティビティ</h2>
      <ul class="activity-list">
        <li class="activity-item">
          <img
            src="/images/activity-bbq.webp"
            alt="炭火で焼いているBBQ"
            width="600"
            height="600"
            loading="lazy"
          />
          <h3 class="activity-item__name">BBQ</h3>
        </li>
        <li class="activity-item">
          <img
            src="/images/activity-fire.webp"
            alt="夜の焚き火"
            width="600"
            height="600"
            loading="lazy"
          />
          <h3 class="activity-item__name">焚き火</h3>
        </li>
        <li class="activity-item">
          <img
            src="/images/activity-sauna.webp"
            alt="木造のサウナ小屋"
            width="600"
            height="600"
            loading="lazy"
          />
          <h3 class="activity-item__name">サウナ</h3>
        </li>
        <li class="activity-item">
          <img
            src="/images/activity-stars.webp"
            alt="森の上に広がる星空"
            width="600"
            height="600"
            loading="lazy"
          />
          <h3 class="activity-item__name">星空観察</h3>
        </li>
      </ul>
    </div>
  </section>

  <!-- よくある質問（JSなしでも開閉できる details 要素） -->
  <section id="faq" class="section section--gray faq" aria-labelledby="faq-title">
    <div class="section__inner">
      <h2 id="faq-title" class="section__title">よくある質問</h2>
      <div class="faq-list">
        <!-- よくある質問（一度に1つだけ開く） -->
        <section id="faq" class="section section--gray faq" aria-labelledby="faq-title">
          <div class="section__inner">
            <h2 id="faq-title" class="section__title">よくある質問</h2>
            <FaqList />
          </div>
        </section>
      </div>
    </div>
  </section>

  <!-- アクセス -->
  <section id="access" class="section access" aria-labelledby="access-title">
    <div class="section__inner">
      <h2 id="access-title" class="section__title">アクセス</h2>
      <div class="access__body">
        <div class="access__map">地図（Googleマップを埋め込み）</div>
        <dl class="access__info">
          <dt>住所</dt>
          <dd>[住所]</dd>
          <dt>電話番号</dt>
          <dd><a href="tel:[電話番号]">[電話番号]</a></dd>
          <dt>チェックイン</dt>
          <dd>[15:00]〜[18:00]</dd>
          <dt>チェックアウト</dt>
          <dd>〜[10:00]</dd>
          <dt>交通</dt>
          <dd>[最寄り駅から車で〇分／送迎あり]</dd>
        </dl>
      </div>
    </div>
  </section>
</template>
