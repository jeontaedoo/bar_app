<template>
  <div class="page">
    <!-- 로딩 -->
    <div v-if="loading || !isInitialized" class="state state-loading">
      <div class="spinner" />
      <p>칵테일 정보를 불러오는 중...</p>
    </div>

    <!-- 에러 -->
    <div v-else-if="error" class="state state-error">
      <p>⚠️ {{ error }}</p>
      <button class="retry-btn" @click="fetchCocktail">다시 시도</button>
    </div>

    <!-- 없음 -->
    <div v-else-if="!cocktail" class="state state-empty">
      <p>칵테일 정보를 찾을 수 없습니다.</p>
      <NuxtLink to="/cocktail/cocktailRecipes" class="back-link">← 레시피 목록으로</NuxtLink>
    </div>

    <!-- 상세 -->
    <main v-else class="main">
      <!-- 상단 Hero 영역 -->
      <section class="hero">
        <div class="hero_img-wrap">
          <img
            :src="cocktail.thumbnail"
            :alt="cocktail.name"
            class="hero_img"
          />
          <div class="hero_img-overlay" />
        </div>
        <div class="hero_info">
          <div class="hero_badges">
            <span class="badge badge-category">{{ cocktail.category }}</span>
            <span class="badge badge-alcoholic">
              🍸 {{ cocktail.alcoholic }}
            </span>
            <span v-if="cocktail.iba" class="badge badge-iba">IBA Official</span>
            <span v-if="cocktail.views" class="badge badge-views">👀 {{ cocktail.views }}</span>
          </div>
          <h1 class="hero_name">{{ cocktail.name }}</h1>
          <p v-if="cocktail.garnish" class="hero_garnish">🍊 가니쉬: {{ cocktail.garnish }}</p>
        </div>
      </section>

      <!-- 재료 -->
      <section class="section">
        <h2 class="section_title">🧪 재료 (Ingredients)</h2>
        <ul class="ingredients">
          <li
            v-for="(ing, idx) in displayIngredients"
            :key="idx"
            class="ingredient"
          >
            <span class="ingredient_name">{{ ing.name }}</span>
            <span v-if="ing.measure" class="ingredient_measure">{{ ing.measure }}</span>
          </li>
        </ul>
      </section>

      <!-- 만드는 법 -->
      <section class="section">
        <h2 class="section_title">📋 만드는 법 (Instructions)</h2>
        <div class="instructions-box">
          <p class="instructions">{{ cocktail.methodKo || cocktail.method }}</p>
          <p v-if="cocktail.methodKo && cocktail.method !== cocktail.methodKo" class="instructions-orig">
            <span class="orig-label">원문:</span> {{ cocktail.method }}
          </p>
        </div>
      </section>

      <!-- 비디오 노출 영역 (video_url) -->
      <section v-if="cocktail.video_url || cocktail.videoUrl" class="section">
        <h2 class="section_title">🎬 레시피 영상</h2>
        <div class="video-container">
          <iframe
            v-if="youtubeEmbedUrl"
            :src="youtubeEmbedUrl"
            title="Cocktail Recipe Video"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="video-iframe"
          />
          <div v-else class="video-link-card">
            <a
              :href="cocktail.video_url || cocktail.videoUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="video-btn"
            >
              ▶️ 유튜브에서 동영상 시청하기 ↗
            </a>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useCocktailApi, type Cocktail } from '~/composables/useCocktailApi'

const route = useRoute()
const { getById, loading, error } = useCocktailApi()

const cocktail = ref<Cocktail | null>(null)
const isInitialized = ref(false)

// 한글 번역이 적용된 재료 목록 (없으면 원문 목록)
const displayIngredients = computed(() => {
  if (!cocktail.value) return []
  return cocktail.value.ingredientsKo ?? cocktail.value.ingredients
})

// 유튜브 Embed URL 변환
const youtubeEmbedUrl = computed(() => {
  const url = cocktail.value?.video_url || cocktail.value?.videoUrl
  if (!url) return null
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
})

async function fetchCocktail() {
  const id = route.params.id as string
  cocktail.value = await getById(id)
  isInitialized.value = true
}

onMounted(fetchCocktail)
watch(() => route.params.id, fetchCocktail)
</script>

<style scoped>
/* ─── Page ───────────────────────────────── */
.page {
  min-height: 100vh;
  background: #fafafa;
}

/* ─── Main ───────────────────────────────── */
.main {
  max-width: 760px;
  margin: 0 auto;
  padding: 32px 24px 80px;
}

/* ─── Hero ───────────────────────────────── */
.hero {
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
  position: relative;
  margin-bottom: 32px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.08);
}

.hero_img-wrap {
  position: relative;
  height: 320px;
  background: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero_img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero_img-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, transparent 100%);
}

.hero_info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24px 24px 28px;
}

.hero_badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  backdrop-filter: blur(6px);
}

.badge-category {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.3);
}

.badge-alcoholic {
  background: rgba(255, 85, 0, 0.85);
  color: #fff;
}

.badge-iba {
  background: rgba(139, 92, 246, 0.85);
  color: #fff;
}

.badge-views {
  background: rgba(0, 0, 0, 0.5);
  color: rgba(255, 255, 255, 0.9);
}

.hero_name {
  font-size: clamp(24px, 4vw, 36px);
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.02em;
  margin-bottom: 6px;
}

.hero_garnish {
  font-size: 13px;
  color: rgba(255,255,255,0.8);
}

/* ─── Section ────────────────────────────── */
.section {
  margin-bottom: 32px;
}

.section_title {
  font-size: 16px;
  font-weight: 700;
  color: #0d0d0d;
  margin-bottom: 14px;
  letter-spacing: -0.01em;
}

/* ─── Ingredients ────────────────────────── */
.ingredients {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ingredient {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  transition: border-color 0.15s;
}

.ingredient:hover {
  border-color: #ff5500;
}

.ingredient_name {
  font-size: 14px;
  font-weight: 600;
  color: #0d0d0d;
}

.ingredient_measure {
  font-size: 13px;
  color: #ff5500;
  font-weight: 700;
}

/* ─── Instructions ───────────────────────── */
.instructions-box {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.instructions {
  font-size: 15px;
  color: #222;
  line-height: 1.8;
  margin: 0;
}

.instructions-orig {
  font-size: 12px;
  color: #888;
  line-height: 1.6;
  border-top: 1px dashed #eee;
  padding-top: 10px;
  margin: 0;
}

.orig-label {
  font-weight: 700;
  color: #ff5500;
}

/* ─── Video Container ────────────────────── */
.video-container {
  position: relative;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background: #000;
}

.video-iframe {
  width: 100%;
  height: 400px;
  display: block;
  border: none;
}

.video-link-card {
  padding: 24px;
  text-align: center;
  background: #fff;
}

.video-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #ff0000;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  border-radius: 10px;
  text-decoration: none;
  transition: transform 0.15s, background 0.15s;
}

.video-btn:hover {
  background: #cc0000;
  transform: translateY(-2px);
}

/* ─── State ──────────────────────────────── */
.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  height: 60vh;
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

.retry-btn {
  padding: 8px 20px;
  border: 1px solid #ff5500;
  border-radius: 8px;
  background: none;
  color: #ff5500;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.back-link {
  font-size: 13px;
  color: #ff5500;
  text-decoration: none;
  font-weight: 600;
}

/* ─── Responsive ─────────────────────────── */
@media (max-width: 640px) {
  .hero_img-wrap { height: 240px; }
  .main { padding: 24px 16px 60px; }
  .video-iframe { height: 230px; }
}
</style>
