<template>
  <div class="page">
    <header class="page-header">
      <NuxtLink :to="`/whiskey/${route.params.category}`" class="back-btn">
        ← {{ categoryName }} 목록
      </NuxtLink>
    </header>

    <!-- 로딩 -->
    <div v-if="loading" class="state state-loading">
      <div class="spinner" />
      <p>위스키 정보를 불러오는 중...</p>
    </div>

    <!-- 에러 -->
    <div v-else-if="error" class="state state-error">
      <p>{{ error }}</p>
      <button class="retry-btn" @click="fetchDetail">다시 시도</button>
    </div>

    <!-- 상세 콘텐츠 -->
    <main v-else-if="review" class="main">
      <!-- Hero -->
      <section class="hero">
        <img
          :src="getWhiskyImageUrl(review.image.url)"
          :alt="review.image.alt ?? review.name"
          class="hero_img"
        />
        <div class="hero_overlay" />
        <div class="hero_content">
          <div class="hero_badges">
            <span class="badge badge-type">{{ review.metadata.type }}</span>
            <span v-if="review.metadata.country" class="badge badge-country">
              {{ review.metadata.country }}
            </span>
            <span v-if="review.metadata.region" class="badge badge-region">
              {{ review.metadata.region }}
            </span>
            <span v-if="review.metadata.flavour" class="badge badge-flavour">
              ✨ {{ review.metadata.flavour }}
            </span>
          </div>
          <h1 class="hero_title">{{ review.name }}</h1>
          <div class="hero_meta">
            <span v-if="review.metadata.distillery" class="hero_meta-item">
              🏭 {{ review.metadata.distillery }}
            </span>
            <span v-if="review.metadata.bottler" class="hero_meta-item">
              🍾 {{ review.metadata.bottler }}
            </span>
            <span v-if="review.metadata.age && review.metadata.age > 0" class="hero_meta-item">
              📅 {{ review.metadata.age }}년
            </span>
            <span class="hero_meta-item">💧 {{ review.metadata.abv }}%</span>
          </div>
        </div>
      </section>

      <!-- 평점 -->
      <section class="section score-section">
        <div class="score-grid">
          <div
            v-for="(score, author) in authorScores"
            :key="author"
            class="score-card"
          >
            <span class="score-card_author">{{ author }}</span>
            <div class="score-card_ring" :style="{ '--pct': score }">
              <span class="score-card_val">{{ score }}</span>
            </div>
          </div>
          <div v-if="review.rating.value_for_money" class="score-card score-card-vfm">
            <span class="score-card_author">가성비</span>
            <span class="vfm-stars">
              {{ '★'.repeat(review.rating.value_for_money) }}{{ '☆'.repeat(5 - review.rating.value_for_money) }}
            </span>
          </div>
        </div>
      </section>

      <!-- 설명 -->
      <section class="section">
        <h2 class="section_title">📝 소개</h2>
        <p class="desc-text">{{ translatedDesc ?? review.description }}</p>
      </section>

      <!-- 테이스팅 노트 -->
      <section v-if="review.tasting_notes" class="section">
        <h2 class="section_title">👃 테이스팅 노트</h2>
        <div class="tasting-grid">
          <div class="tasting-card">
            <span class="tasting-card_label">Nose</span>
            <p class="tasting-card_text">{{ translatedNotes?.nose ?? review.tasting_notes.nose }}</p>
          </div>
          <div class="tasting-card">
            <span class="tasting-card_label">Palate</span>
            <p class="tasting-card_text">{{ translatedNotes?.palate ?? review.tasting_notes.palate }}</p>
          </div>
          <div class="tasting-card tasting-card-full">
            <span class="tasting-card_label">Finish</span>
            <p class="tasting-card_text">{{ translatedNotes?.finish ?? review.tasting_notes.finish }}</p>
          </div>
        </div>
      </section>

      <!-- 결론 -->
      <section v-if="hasConclusion" class="section">
        <h2 class="section_title">✍️ 리뷰어 총평</h2>
        <div class="conclusion-list">
          <div
            v-for="(text, author) in translatedConclusions ?? review.conclusion"
            :key="author"
            class="conclusion-item"
          >
            <span class="conclusion-item_author">{{ author }}</span>
            <p class="conclusion-item_text">{{ text }}</p>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section v-if="review.faq?.length" class="section">
        <h2 class="section_title">❓ FAQ</h2>
        <div class="faq-list">
          <details
            v-for="(item, i) in (translatedFaq ?? review.faq)"
            :key="i"
            class="faq-item"
          >
            <summary class="faq-item_q">{{ item.question }}</summary>
            <p class="faq-item_a">{{ item.answer }}</p>
          </details>
        </div>
      </section>

      <!-- 원문 링크 -->
      <div class="source-link-wrap">
        <a
          :href="`https://thewhiskyedition.com${review.url}`"
          target="_blank"
          rel="noopener noreferrer"
          class="source-link"
        >
          원문 보기 (WHISKY:EDITION) ↗
        </a>
      </div>
    </main>

    <!-- 404 -->
    <div v-else class="state state-empty">
      <p>위스키 리뷰를 찾을 수 없습니다.</p>
      <NuxtLink :to="`/whiskey/${route.params.category}`" class="back-link">← 목록으로</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWhiskyEditionApi, getWhiskyImageUrl, type WhiskyDetail } from '~/composables/useWhiskyEditionApi'

const route = useRoute()
const { loading, error, getReviewBySlug } = useWhiskyEditionApi()
const { translateBatch } = useDeeplApi()

const review = ref<WhiskyDetail | null>(null)
const translatedDesc = ref<string | null>(null)
const translatedNotes = ref<{ nose: string; palate: string; finish: string } | null>(null)
const translatedConclusions = ref<Record<string, string> | null>(null)
const translatedFaq = ref<{ question: string; answer: string }[] | null>(null)

// ─── 카테고리명 표시 ──────────────────────────────────────────
const CATEGORY_NAMES: Record<string, string> = {
  scotch: '스카치',
  'single-malt': '싱글몰트',
  blended: '블랜디드',
  'blended-malt': '블랜디드 몰트',
  'single-grain': '싱글 그레인',
  american: '아메리칸',
  bourbon: '버번',
  rye: '라이',
  tennessee: '테네시',
  irish: '아이리쉬',
  canadian: '캐나디안',
  japanese: '재패니스',
  korean: '코리안',
}

const categoryName = computed(() => {
  const cat = route.params.category as string
  return CATEGORY_NAMES[cat] ?? cat
})

// ─── 저자별 점수 ──────────────────────────────────────────────
const authorScores = computed(() => {
  if (!review.value) return {}
  const { marcel, sascha, florian, lucas } = review.value.rating
  return Object.fromEntries(
    Object.entries({ Marcel: marcel, Sascha: sascha, Florian: florian, Lucas: lucas })
      .filter(([, v]) => v !== undefined)
  ) as Record<string, number>
})

const hasConclusion = computed(() => {
  if (!review.value?.conclusion) return false
  return Object.values(review.value.conclusion).some((v) => !!v)
})

// ─── API 호출 ─────────────────────────────────────────────────
async function fetchDetail() {
  const slug = route.params.slug as string
  review.value = null
  translatedDesc.value = null
  translatedNotes.value = null
  translatedConclusions.value = null
  translatedFaq.value = null

  const data = await getReviewBySlug(slug)
  if (!data) return
  review.value = data

  await translateContent(data)
}

async function translateContent(data: WhiskyDetail) {
  try {
    const conclusionEntries = Object.entries(data.conclusion ?? {}).filter(([, v]) => !!v)
    const faqEntries = data.faq ?? []

    const textsToTranslate = [
      data.description,
      data.tasting_notes?.nose,
      data.tasting_notes?.palate,
      data.tasting_notes?.finish,
      ...conclusionEntries.map(([, v]) => v),
      ...faqEntries.flatMap((f) => [f.question, f.answer]),
    ].filter((t): t is string => !!t?.trim())

    if (!textsToTranslate.length) return

    const translated = await translateBatch(textsToTranslate)
    let idx = 0

    if (data.description) {
      translatedDesc.value = translated[idx++] ?? data.description
    }

    if (data.tasting_notes) {
      translatedNotes.value = {
        nose: data.tasting_notes.nose ? (translated[idx++] ?? data.tasting_notes.nose) : '',
        palate: data.tasting_notes.palate ? (translated[idx++] ?? data.tasting_notes.palate) : '',
        finish: data.tasting_notes.finish ? (translated[idx++] ?? data.tasting_notes.finish) : '',
      }
    }

    if (conclusionEntries.length) {
      const conclusionMap: Record<string, string> = {}
      conclusionEntries.forEach(([author, origVal]) => {
        conclusionMap[author] = translated[idx++] ?? origVal
      })
      translatedConclusions.value = conclusionMap
    }

    if (faqEntries.length) {
      translatedFaq.value = faqEntries.map((origFaq) => ({
        question: translated[idx++] ?? origFaq.question,
        answer: translated[idx++] ?? origFaq.answer,
      }))
    }
  } catch (e) {
    console.error('Translation error:', e)
    // 번역 실패 시 원문 유지
  }
}

// ─── 초기 로드 ────────────────────────────────────────────────
watch(
  () => route.params.slug,
  () => fetchDetail(),
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
  padding: 72px 24px 80px;
}

/* ─── Hero ───────────────────────────────── */
.hero {
  position: relative;
  height: 300px;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 32px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.2);
}

.hero_img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero_overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%);
}

.hero_content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px 28px;
}

.hero_badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.badge {
  font-size: 10px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.badge-type {
  background: #ff5500;
  color: #fff;
}

.badge-country {
  background: rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.9);
  border: 1px solid rgba(255,255,255,0.3);
}

.badge-region {
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.7);
  border: 1px solid rgba(255,255,255,0.2);
}

.badge-flavour {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.4);
}

.hero_title {
  font-size: clamp(18px, 3.5vw, 26px);
  font-weight: 800;
  color: #fff;
  line-height: 1.25;
  margin-bottom: 10px;
  letter-spacing: -0.02em;
}

.hero_meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hero_meta-item {
  font-size: 12px;
  color: rgba(255,255,255,0.75);
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

/* ─── Score ──────────────────────────────── */
.score-section {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 16px;
  padding: 20px 24px;
}

.score-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
}

.score-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.score-card_author {
  font-size: 11px;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.score-card_ring {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: conic-gradient(#ff5500 calc(var(--pct) * 1%), #f0f0f0 0);
  display: flex;
  align-items: center;
  justify-content: center;
}

.score-card_ring::before {
  content: '';
  position: absolute;
  inset: 6px;
  border-radius: 50%;
  background: #fff;
}

.score-card_val {
  position: relative;
  font-size: 14px;
  font-weight: 800;
  color: #0d0d0d;
  z-index: 1;
}

.score-card-vfm {
  margin-left: auto;
}

.vfm-stars {
  font-size: 18px;
  color: #f59e0b;
  letter-spacing: 2px;
}

/* ─── Description ────────────────────────── */
.desc-text {
  font-size: 14px;
  color: #444;
  line-height: 1.8;
}

/* ─── Tasting Notes ──────────────────────── */
.tasting-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.tasting-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  padding: 16px;
}

.tasting-card-full {
  grid-column: 1 / -1;
}

.tasting-card_label {
  display: block;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #ff5500;
  margin-bottom: 8px;
}

.tasting-card_text {
  font-size: 13px;
  color: #555;
  line-height: 1.65;
  margin: 0;
}

/* ─── Conclusion ─────────────────────────── */
.conclusion-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.conclusion-item {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border-radius: 12px;
  padding: 16px 18px;
}

.conclusion-item_author {
  display: block;
  font-size: 11px;
  font-weight: 700;
  color: #ff7744;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 6px;
}

.conclusion-item_text {
  font-size: 13px;
  color: rgba(255,255,255,0.8);
  line-height: 1.65;
  margin: 0;
}

/* ─── FAQ ────────────────────────────────── */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.faq-item {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  transition: border-color 0.15s;
}

.faq-item[open] {
  border-color: #ff5500;
}

.faq-item_q {
  padding: 14px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #0d0d0d;
  cursor: pointer;
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.faq-item_q::after {
  content: '＋';
  font-size: 16px;
  color: #aaa;
  flex-shrink: 0;
  transition: transform 0.2s;
}

.faq-item[open] .faq-item_q::after {
  transform: rotate(45deg);
  color: #ff5500;
}

.faq-item_a {
  padding: 0 16px 14px;
  font-size: 13px;
  color: #666;
  line-height: 1.65;
  margin: 0;
}

/* ─── Source Link ────────────────────────── */
.source-link-wrap {
  text-align: center;
  padding-bottom: 16px;
}

.source-link {
  font-size: 12px;
  color: #bbb;
  text-decoration: none;
  transition: color 0.15s;
}

.source-link:hover {
  color: #ff5500;
}

/* ─── State ──────────────────────────────── */
.state-loading,
.state-error,
.state-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  height: 80vh;
  color: #aaa;
  font-size: 14px;
}

.state-error { color: #ef4444; }

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #f0f0f0;
  border-top-color: #ff5500;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
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

.back-link {
  font-size: 13px;
  color: #ff5500;
  text-decoration: none;
  font-weight: 600;
}

/* ─── Responsive ─────────────────────────── */
@media (max-width: 640px) {
  .main { padding: 64px 16px 60px; }
  .hero { height: 240px; }
  .hero_content { padding: 16px 20px; }
  .tasting-grid { grid-template-columns: 1fr; }
  .tasting-card-full { grid-column: unset; }
  .score-card-vfm { margin-left: 0; }
}
</style>
