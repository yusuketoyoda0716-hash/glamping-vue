import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

// ページごとのタイトルを meta に持たせるための型
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/plans',
      name: 'plans',
      component: () => import('@/views/PlansView.vue'), // 開いたときに読み込む
      meta: { title: '宿泊プラン一覧' },
    },
    {
      path: '/reserve',
      name: 'reserve',
      component: () => import('@/views/ReserveView.vue'),
      meta: { title: 'ご予約' },
    },
    {
      path: '/reserve/complete',
      name: 'complete',
      component: () => import('@/views/CompleteView.vue'),
      meta: { title: 'ご予約完了' },
    },
  ],
  // ページを移動したときのスクロール位置
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition // ブラウザの「戻る」では元の位置に戻す
    if (to.hash) return { el: to.hash, top: 80, behavior: 'smooth' } // #about などはその場所へ
    if (to.path === from.path) return false // 同じページでクエリだけ変わったときは、スクロールしない
    return { top: 0 } // それ以外はページの一番上へ
  },
})

// ページを移動するたびに、タブに表示されるタイトルを変える
router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} | FOREST GLAMPING`
    : 'FOREST GLAMPING | 森の中のグランピング'
})

export default router
