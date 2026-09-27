<template>
  <div class="page">
    <header class="page-header">
      <NuxtLink :to="backLink">← {{ categoryName }} 목록</NuxtLink>
    </header>

    <main class="main">
      <div v-if="loading" class="state">위스키 정보를 불러오는 중...</div>
      <div v-else-if="error" class="state">
        <p>{{ error }}</p>
        <button @click="fetchDetail">다시 시도</button>
      </div>
      <template v-else-if="whisky">
        <section class="hero">
          <img v-if="whisky.imageUrl" :src="whisky.imageUrl" :alt="whisky.title" class="hero-img" />
          <div>
            <span class="eyebrow">🥃 WhiskeyProject</span>
            <h1>{{ whisky.title }}</h1>
            <p class="region">{{ whisky.region }}</p>
          </div>
        </section>

        <section v-if="whisky.rating !== null" class="section">
          <h2>평점</h2>
          <p class="rating">{{ whisky.rating }} <small>/ 100</small></p>
        </section>

        <section v-if="whisky.description" class="section">
          <h2>소개</h2>
          <p>{{ whisky.description }}</p>
        </section>

        <section v-if="whisky.tags.length" class="section">
          <h2>풍미 태그</h2>
          <div class="tags"><span v-for="tag in whisky.tags" :key="tag">{{ tag }}</span></div>
        </section>

        <a class="source" href="https://github.com/WhiskeyProject/whiskey-api" target="_blank" rel="noopener noreferrer">데이터 출처: WhiskeyProject ↗</a>
      </template>
      <div v-else class="state">위스키를 찾을 수 없습니다.</div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useWhiskeyProjectApi, type WhiskeyProjectWhisky } from '~/composables/useWhiskeyProjectApi'

const route = useRoute()
const { loading, error, getWhisky } = useWhiskeyProjectApi()
const whisky = ref<WhiskeyProjectWhisky | null>(null)

const CATEGORY_NAMES: Record<string, string> = {
  scotch: '스카치', 'single-malt': '싱글몰트', blended: '블랜디드',
  'blended-malt': '블랜디드 몰트', 'single-grain': '싱글 그레인', american: '아메리칸',
  bourbon: '버번', rye: '라이', tennessee: '테네시', irish: '아이리쉬',
  canadian: '캐나디안', japanese: '재패니스', korean: '코리안',
}
const routeCategory = computed(() => String(route.params.category))
const isCatalogResult = computed(() => routeCategory.value === 'catalog')
const categoryName = computed(() => isCatalogResult.value ? '위스키' : (CATEGORY_NAMES[routeCategory.value] ?? routeCategory.value))
const backLink = computed(() => isCatalogResult.value ? '/whiskey' : `/whiskey/${routeCategory.value}`)

async function fetchDetail() {
  whisky.value = null
  whisky.value = await getWhisky(Number(route.params.slug), isCatalogResult.value ? '' : routeCategory.value)
}

watch(() => [route.params.category, route.params.slug], fetchDetail, { immediate: true })
</script>

<style scoped>
.page { min-height: 100vh; background: #fafafa; color: #171717; }
.page-header { padding: 20px 24px; border-bottom: 1px solid #eee; background: white; }
.page-header a { color: #555; text-decoration: none; }
.main { max-width: 800px; margin: 0 auto; padding: 40px 24px 80px; }
.hero { display: flex; align-items: center; gap: 36px; min-height: 300px; }
.hero-img { max-width: 260px; max-height: 320px; object-fit: contain; }
.eyebrow { color: #f50; font-size: 13px; font-weight: 700; }
h1 { font-size: clamp(28px, 5vw, 48px); line-height: 1.15; margin: 12px 0; }
h2 { font-size: 20px; margin: 0 0 16px; }
.region { color: #666; }
.section { padding: 28px 0; border-top: 1px solid #e5e5e5; }
.section p { line-height: 1.7; }
.rating { color: #f50; font-size: 36px; font-weight: 800; }
.rating small { color: #888; font-size: 16px; }
.tags { display: flex; flex-wrap: wrap; gap: 8px; }
.tags span { padding: 8px 12px; border-radius: 999px; background: #fff0e8; color: #b94a11; }
.source { display: inline-block; margin-top: 28px; color: #f50; }
.state { padding: 80px 0; text-align: center; color: #666; }
.state button { margin-top: 12px; padding: 10px 18px; border: 0; border-radius: 6px; background: #f50; color: white; cursor: pointer; }
@media (max-width: 600px) { .hero { flex-direction: column; align-items: flex-start; } .hero-img { max-height: 240px; } }
</style>
