<template>
  <div class="page">
    <header class="page-header">
      <NuxtLink to="/whiskey" class="back-btn">← 위스키 목록</NuxtLink>
    </header>

    <main class="main" v-if="category">
      <!-- Hero -->
      <section class="hero">
        <span class="hero_emoji">{{ category.emoji }}</span>
        <div class="hero_info">
          <span class="hero_label">🥃 Whiskey</span>
          <h1 class="hero_title">{{ category.name }}</h1>
          <p v-if="category.region" class="hero_region">📍 {{ category.region }}</p>
          <p class="hero_desc">{{ category.desc }}</p>
        </div>
      </section>

      <!-- 특징 태그 -->
      <section class="section" v-if="category.tags?.length">
        <h2 class="section_title">✨ 특징</h2>
        <div class="tags">
          <span v-for="tag in category.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </section>

      <!-- 리뷰 목록 (API) -->
      <section class="section">
        <div class="section_header">
          <h2 class="section_title">📖 전문가 리뷰</h2>
          <span v-if="totalCount > 0" class="section_count">{{ totalCount }}개</span>
        </div>

        <!-- 로딩 -->
        <div v-if="loading" class="state state-loading">
          <div class="spinner" />
          <p>리뷰를 불러오는 중...</p>
        </div>

        <!-- 에러 -->
        <div v-else-if="error" class="state state-error">
          <p>{{ error }}</p>
          <button class="retry-btn" @click="fetchReviews">다시 시도</button>
        </div>

        <!-- 데이터 없음 -->
        <div v-else-if="reviews.length === 0" class="state state-empty-reviews">
          <p>등록된 리뷰가 없습니다.</p>
        </div>

        <!-- 리뷰 카드 목록 -->
        <ul v-else class="review-list">
          <li
            v-for="review in reviews"
            :key="review.id"
            class="review-item"
          >
            <NuxtLink
              :to="`/whiskey/${route.params.id}/${review.slug}`"
              class="review-link"
            >
              <img
                :src="`https://thewhiskyedition.com${review.image.url}`"
                :alt="review.image.alt ?? review.name"
                class="review-img"
                loading="lazy"
              />
              <div class="review-body">
                <div class="review-meta">
                  <span v-if="review.metadata.distillery" class="review-distillery">
                    {{ review.metadata.distillery }}
                  </span>
                  <span v-if="review.metadata.age && review.metadata.age > 0" class="review-age">
                    {{ review.metadata.age }}년
                  </span>
                  <span class="review-abv">{{ review.metadata.abv }}%</span>
                </div>
                <p class="review-name">{{ review.name }}</p>
                <p class="review-desc">{{ translations.get(review.id) ?? review.description }}</p>
                <div class="review-footer">
                  <div class="review-score" v-if="avgRating(review.rating) !== null">
                    <span class="score-dot" :style="{ background: ratingColor(avgRating(review.rating)!) }" />
                    <span class="score-val">{{ avgRating(review.rating) }}</span>
                    <span class="score-label">/ 100</span>
                  </div>
                  <span class="review-vfm" v-if="review.rating.value_for_money">
                    💰 {{ '★'.repeat(review.rating.value_for_money) }}{{ '☆'.repeat(5 - review.rating.value_for_money) }}
                  </span>
                </div>
              </div>
            </NuxtLink>
          </li>
        </ul>

        <!-- 더 보기 버튼 -->
        <button
          v-if="!loading && hasMore"
          class="load-more-btn"
          :disabled="loadingMore"
          @click="loadMore"
        >
          {{ loadingMore ? '불러오는 중...' : '더 보기' }}
        </button>
      </section>
    </main>

    <!-- 없음 -->
    <div v-else class="state state-empty">
      <p>해당 위스키 정보를 찾을 수 없습니다.</p>
      <NuxtLink to="/whiskey" class="back-link">← 목록으로</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWhiskyEditionApi, getAverageRating, type WhiskySummary, type WhiskyRating } from '~/composables/useWhiskyEditionApi'

// ─── 카테고리 메타데이터 ───────────────────────────────────────
interface CategoryMeta {
  id: string
  name: string
  emoji: string
  region?: string
  desc: string
  tags?: string[]
  /** API 호출 시 사용할 파라미터 */
  apiParams: { type?: string; country?: string }
}

const CATEGORY_MAP: Record<string, CategoryMeta> = {
  scotch: {
    id: 'scotch',
    name: '스카치 위스키',
    emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    region: '스코틀랜드',
    desc: '스코틀랜드에서 생산되는 위스키로, 엄격한 법적 기준에 따라 최소 3년 이상 오크통에서 숙성됩니다. 피트 향과 스모키한 특성으로 세계적으로 유명합니다.',
    tags: ['피트향', '스모키', '오크 숙성', '최소 3년'],
    apiParams: { country: 'Scotland' },
  },
  'single-malt': {
    id: 'single-malt',
    name: '싱글몰트 위스키',
    emoji: '🏔️',
    region: '스코틀랜드',
    desc: '단일 증류소에서 100% 몰트 보리만을 사용해 만든 위스키입니다. 각 증류소의 개성과 테루아를 가장 잘 표현하며, 위스키 애호가들에게 가장 사랑받는 스타일입니다.',
    tags: ['단일 증류소', '몰트 보리', '개성 강함', '다양한 지역'],
    apiParams: { type: 'Single Malt' },
  },
  blended: {
    id: 'blended',
    name: '블랜디드 위스키',
    emoji: '🔀',
    region: '스코틀랜드',
    desc: '여러 증류소의 몰트 위스키와 그레인 위스키를 혼합해 만든 위스키입니다. 일관된 풍미와 접근하기 쉬운 맛으로 전 세계 위스키 시장의 약 90%를 차지합니다.',
    tags: ['여러 증류소 혼합', '일관된 풍미', '접근하기 쉬움', '대중적'],
    apiParams: { type: 'Blended' },
  },
  'blended-malt': {
    id: 'blended-malt',
    name: '블랜디드 몰트 위스키',
    emoji: '🌾',
    region: '스코틀랜드',
    desc: '그레인 위스키 없이 여러 증류소의 싱글몰트 위스키만을 혼합한 스타일입니다. 바티드 몰트(Vatted Malt)라고도 불리며, 싱글몰트의 복잡성과 블랜디드의 접근성을 동시에 갖춥니다.',
    tags: ['몰트만 사용', '다중 증류소', '복잡한 풍미'],
    apiParams: { type: 'Blended Malt' },
  },
  'single-grain': {
    id: 'single-grain',
    name: '싱글 그레인 위스키',
    emoji: '🌽',
    region: '스코틀랜드',
    desc: '단일 증류소에서 몰트 보리 외의 곡물(밀, 옥수수 등)을 사용해 만든 위스키입니다. 가볍고 부드러운 특성을 지니며, 주로 블랜디드 위스키의 베이스로 사용됩니다.',
    tags: ['단일 증류소', '다양한 곡물', '가볍고 부드러움'],
    apiParams: { type: 'Single Grain' },
  },
  american: {
    id: 'american',
    name: '아메리칸 위스키',
    emoji: '🇺🇸',
    region: '미국',
    desc: '미국에서 생산되는 위스키의 총칭으로, 버번, 라이, 테네시 등 다양한 스타일을 포함합니다. 새 오크통 사용이 특징이며 바닐라, 카라멜의 달콤한 향이 주를 이룹니다.',
    tags: ['새 오크통', '달콤함', '바닐라', '카라멜'],
    apiParams: { country: 'USA' },
  },
  bourbon: {
    id: 'bourbon',
    name: '버번 위스키',
    emoji: '🌽',
    region: '미국 켄터키',
    desc: '51% 이상의 옥수수를 사용하고 새 아메리칸 화이트 오크 통에서 숙성한 아메리칸 위스키입니다. 법적으로 켄터키에서만 생산해야 하는 것은 아니지만, 대부분 켄터키에서 만들어집니다.',
    tags: ['옥수수 51% 이상', '새 오크통', '바닐라', '카라멜', '켄터키'],
    apiParams: { type: 'Bourbon' },
  },
  rye: {
    id: 'rye',
    name: '라이 위스키',
    emoji: '🌿',
    region: '미국',
    desc: '51% 이상의 호밀(라이)을 사용해 만든 위스키로, 버번보다 스파이시하고 드라이한 풍미가 특징입니다. 클래식 칵테일인 맨해튼, 올드 패션드에 잘 어울립니다.',
    tags: ['호밀 51% 이상', '스파이시', '드라이', '칵테일 베이스'],
    apiParams: { type: 'Rye' },
  },
  tennessee: {
    id: 'tennessee',
    name: '테네시 위스키',
    emoji: '🎸',
    region: '미국 테네시',
    desc: '버번과 유사하지만 증류 후 사탕단풍 숯으로 필터링하는 링컨 카운티 프로세스를 거칩니다. 이 과정으로 더 부드럽고 깔끔한 풍미를 갖게 됩니다.',
    tags: ['링컨 카운티 프로세스', '숯 필터링', '부드러움', '테네시'],
    apiParams: { type: 'Tennessee' },
  },
  irish: {
    id: 'irish',
    name: '아이리쉬 위스키',
    emoji: '🇮🇪',
    region: '아일랜드',
    desc: '삼중 증류로 만들어져 스카치보다 가볍고 부드러운 것이 특징입니다. 피트를 거의 사용하지 않아 과일향과 꿀향이 두드러집니다.',
    tags: ['삼중 증류', '부드러움', '과일향', '피트 없음'],
    apiParams: { country: 'Ireland' },
  },
  canadian: {
    id: 'canadian',
    name: '캐나디안 위스키',
    emoji: '🇨🇦',
    region: '캐나다',
    desc: '라이 위스키를 베이스로 한 가볍고 부드러운 스타일이 특징입니다. 최소 3년 이상 숙성하며, 다른 나라 위스키보다 법적 규제가 덜 엄격합니다.',
    tags: ['라이 베이스', '가볍고 부드러움', '최소 3년 숙성'],
    apiParams: { country: 'Canada' },
  },
  japanese: {
    id: 'japanese',
    name: '재패니스 위스키',
    emoji: '🇯🇵',
    region: '일본',
    desc: '스카치의 전통을 바탕으로 일본만의 섬세함과 정교함을 더한 위스키입니다. 미즈나라 오크통 등 독특한 숙성 기법으로 세계적인 주목을 받고 있습니다.',
    tags: ['섬세함', '정교한 균형', '미즈나라 오크', '스모키함'],
    apiParams: { country: 'Japan' },
  },
  korean: {
    id: 'korean',
    name: '코리안 위스키',
    emoji: '🇰🇷',
    region: '대한민국',
    desc: '국내에서 생산되는 위스키로, 최근 프리미엄 증류소들이 등장하며 주목받고 있습니다. 한국의 전통 재료와 현대적인 증류 기술을 결합한 새로운 시도가 이어지고 있습니다.',
    tags: ['국산', '프리미엄', '현대적', '한국 특산 재료'],
    apiParams: { country: 'South Korea' },
  },
}

// ─── 상태 ──────────────────────────────────────────────────────
const route = useRoute()
const { loading, error, getReviews } = useWhiskyEditionApi()
const { translateBatch } = useDeeplApi()

const reviews = ref<WhiskySummary[]>([])
const translations = ref<Map<number, string>>(new Map())
const totalCount = ref(0)
const currentPage = ref(1)
const loadingMore = ref(false)
const PER_PAGE = 8

const category = computed(() => {
  const id = route.params.id as string
  return CATEGORY_MAP[id] ?? null
})

const hasMore = computed(() => reviews.value.length < totalCount.value)

// ─── 평점 헬퍼 ────────────────────────────────────────────────
function avgRating(rating: WhiskyRating): number | null {
  return getAverageRating(rating)
}

function ratingColor(score: number): string {
  if (score >= 85) return '#22c55e'
  if (score >= 70) return '#f59e0b'
  return '#ef4444'
}

// ─── API 호출 ─────────────────────────────────────────────────
async function fetchReviews() {
  if (!category.value) return
  currentPage.value = 1
  reviews.value = []
  translations.value = new Map()

  const result = await getReviews({
    ...category.value.apiParams,
    page: 1,
    per_page: PER_PAGE,
  })
  if (result) {
    reviews.value = result.items
    totalCount.value = result.total
    await translateDescriptions(result.items)
  }
}

async function loadMore() {
  if (!category.value || loadingMore.value) return
  loadingMore.value = true
  currentPage.value++

  try {
    const result = await getReviews({
      ...category.value.apiParams,
      page: currentPage.value,
      per_page: PER_PAGE,
    })
    if (result) {
      reviews.value.push(...result.items)
      await translateDescriptions(result.items)
    }
  } finally {
    loadingMore.value = false
  }
}

// ─── description 배치 번역 ────────────────────────────────────
async function translateDescriptions(items: WhiskySummary[]) {
  if (!items.length) return
  try {
    const translated = await translateBatch(items.map((r) => r.description))
    const map = new Map(translations.value)
    items.forEach((r, i) => {
      map.set(r.id, translated[i] ?? r.description)
    })
    translations.value = map
  } catch {
    // 번역 실패 시 원문 유지 (별도 에러 표시 없음)
  }
}

// ─── 초기 로드 ────────────────────────────────────────────────
watch(
  () => route.params.id,
  () => fetchReviews(),
  { immediate: true }
)
</script>

<style scoped>
/* ─── Page ───────────────────────────────── */
.page {
  min-height: 100vh;
  background: #fafafa;
}

.page-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #f0f0f0;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  color: #888;
  font-size: 13px;
  text-decoration: none;
  transition: all 0.15s;
}

.back-btn:hover {
  border-color: #ff5500;
  color: #ff5500;
}

/* ─── Main ───────────────────────────────── */
.main {
  max-width: 720px;
  margin: 0 auto;
  padding: 80px 24px 80px;
}

/* ─── Hero ───────────────────────────────── */
.hero {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 20px;
  padding: 36px 32px;
  margin-bottom: 36px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
}

.hero_emoji {
  font-size: 64px;
  flex-shrink: 0;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
}

.hero_info {
  flex: 1;
  min-width: 0;
}

.hero_label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #ff7744;
  margin-bottom: 8px;
}

.hero_title {
  font-size: clamp(22px, 4vw, 32px);
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
  margin-bottom: 6px;
  line-height: 1.2;
}

.hero_region {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 12px;
}

.hero_desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.7;
}

/* ─── Section ────────────────────────────── */
.section {
  margin-bottom: 32px;
}

.section_title {
  font-size: 15px;
  font-weight: 700;
  color: #0d0d0d;
  margin-bottom: 14px;
  letter-spacing: -0.01em;
}

/* ─── Tags ───────────────────────────────── */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  font-size: 12px;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 999px;
  background: #fff4f0;
  border: 1px solid #ffe0d6;
  color: #ff5500;
}

/* ─── Section Header ─────────────────────── */
.section_header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.section_count {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 10px;
  border-radius: 999px;
  background: #f0f0f0;
  color: #666;
}

/* ─── Review List ────────────────────────── */
.review-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.review-item {
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #f0f0f0;
  transition: box-shadow 0.18s, border-color 0.18s, transform 0.18s;
}

.review-item:hover {
  border-color: #ff5500;
  box-shadow: 0 4px 20px rgba(255, 85, 0, 0.1);
  transform: translateY(-1px);
}

.review-link {
  display: flex;
  gap: 0;
  text-decoration: none;
  color: inherit;
  background: #fff;
}

.review-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  flex-shrink: 0;
  background: #f5f5f5;
}

.review-body {
  flex: 1;
  min-width: 0;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.review-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.review-distillery {
  font-size: 11px;
  font-weight: 700;
  color: #ff5500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.review-age {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 999px;
  background: #f0f4ff;
  color: #5c6bc0;
}

.review-abv {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 999px;
  background: #f5f5f5;
  color: #888;
}

.review-name {
  font-size: 14px;
  font-weight: 700;
  color: #0d0d0d;
  line-height: 1.3;
  margin: 0;
}

.review-desc {
  font-size: 12px;
  color: #888;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.review-footer {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
}

.review-score {
  display: flex;
  align-items: center;
  gap: 5px;
}

.score-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.score-val {
  font-size: 13px;
  font-weight: 800;
  color: #0d0d0d;
}

.score-label {
  font-size: 11px;
  color: #aaa;
}

.review-vfm {
  font-size: 11px;
  color: #f59e0b;
  letter-spacing: 1px;
}

/* ─── Load More ──────────────────────────── */
.load-more-btn {
  display: block;
  width: 100%;
  margin-top: 16px;
  padding: 12px;
  border: 1.5px solid #e0e0e0;
  border-radius: 10px;
  background: #fff;
  color: #555;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.load-more-btn:hover:not(:disabled) {
  border-color: #ff5500;
  color: #ff5500;
}

.load-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ─── State (loading / error / empty) ────── */
.state-loading,
.state-error,
.state-empty-reviews {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 0;
  color: #aaa;
  font-size: 14px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f0f0f0;
  border-top-color: #ff5500;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.state-error {
  color: #ef4444;
}

.retry-btn {
  padding: 8px 18px;
  border: 1px solid #ef4444;
  border-radius: 8px;
  background: #fff;
  color: #ef4444;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.retry-btn:hover {
  background: #ef4444;
  color: #fff;
}

/* ─── State ──────────────────────────────── */
.state-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  height: 60vh;
  color: #aaa;
  font-size: 14px;
}

.back-link {
  font-size: 13px;
  color: #ff5500;
  text-decoration: none;
  font-weight: 600;
}

/* ─── Responsive ─────────────────────────── */
@media (max-width: 640px) {
  .hero {
    flex-direction: column;
    gap: 16px;
    padding: 24px 20px;
  }

  .hero_emoji { font-size: 48px; }
  .main { padding: 72px 16px 60px; }

  .review-img {
    width: 80px;
    height: 80px;
  }

  .review-body {
    padding: 10px 12px;
  }
}
</style>
