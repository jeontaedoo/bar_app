<template>
  <div class="page">
    <header class="page-header">
      <div class="page-header_text">
        <span class="page-label">🍹 Cocktail Recipes</span>
        <h1 class="page-title">칵테일 레시피</h1>
      </div>
      <input 
        v-model="inputValue" 
        class="search-input"
        placeholder="칵테일 검색" 
        @input="searchCocktails"
      />
    </header>

    <main class="main">
      <!-- 로딩 -->
      <div v-if="loading" class="state state-loading">
        <div class="spinner"></div>
        <p>칵테일 목록을 불러오는 중...</p>
      </div>

      <!-- 에러 -->
      <div v-else-if="error" class="state state-error">
        <p>⚠️ {{ error }}</p>
        <button class="retry-btn" @click="fetchList">다시 시도</button>
      </div>

      <!-- 목록 -->
      <div v-else-if="cocktails.length" class="cards">
        <NuxtLink v-for="cocktail in cocktails" :key="cocktail.id" :to="`/cocktail/${cocktail.id}`" class="card">
          <div class="card_img-wrap">
            <img
              :src="getImageUrl(cocktail.thumbnail, 'small')"
              :alt="cocktail.name"
              class="card_img"
              loading="lazy"
            />
            <span class="card_tag">{{ cocktail.category }}</span>
            <span class="card_alcoholic">{{ cocktail.alcoholic === 'Alcoholic' ? '🍸' : '🥤' }}</span>
          </div>
          <div class="card_body">
            <h3 class="card_name">{{ cocktail.name }}</h3>
            <p class="card_glass">🥂 {{ cocktail.glass }}</p>
            <div class="card_ingredients">
              <span v-for="ing in cocktail.ingredients.slice(0, 4)" :key="ing.name" class="chip">{{ ing.name }}</span>
              <span v-if="cocktail.ingredients.length > 4" class="chip chip-more">+{{ cocktail.ingredients.length - 4 }}</span>
            </div>
            <div v-if="cocktail.tags.length" class="card_tags">
              <span v-for="tag in cocktail.tags.slice(0, 2)" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- 빈 상태 -->
      <div v-else class="state state-empty">
        <p>칵테일을 찾을 수 없습니다.</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const { getDefaultList, searchByName, getImageUrl, loading, error } = useCocktailApi()

const inputValue = ref('')
const cocktails = ref<Awaited<ReturnType<typeof getDefaultList>>>([])

// 초기 기본 목록 로드
async function fetchList() {
  cocktails.value = await getDefaultList()
}

// 검색 기능 구현
async function searchCocktails() {
  const query = inputValue.value.trim()
  if (!query) {
    await fetchList()
    return
  }
  cocktails.value = await searchByName(query)
}

onMounted(fetchList)
</script>

<style scoped>
/* ─── Page Layout ────────────────────────── */
.page {
  min-height: 100vh;
  background: #fafafa;
}

.page-header {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px 0;
  display: flex;
  align-items: center;
  gap: 20px;
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
  white-space: nowrap;
  flex-shrink: 0;
}

.back-btn:hover {
  border-color: #ff5500;
  color: #ff5500;
}

.page-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #ff5500;
  margin-bottom: 4px;
}

.page-title {
  font-size: 26px;
  font-weight: 800;
  color: #0d0d0d;
  letter-spacing: -0.02em;
}

.search-input {
  margin-left: auto;
  width: 240px;
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 999px;
  font-size: 14px;
  outline: none;
  background: #ffffff;
  transition: all 0.15s ease;
}

.search-input:focus {
  border-color: #ff5500;
  box-shadow: 0 0 0 3px rgba(255, 85, 0, 0.1);
}

@media (max-width: 640px) {
  .search-input {
    width: 100%;
    margin-left: 0;
    margin-top: 8px;
  }
}

/* ─── Main ───────────────────────────────── */
.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px 80px;
}

/* ─── Cards Grid ─────────────────────────── */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

/* ─── Card ───────────────────────────────── */
.card {
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  display: block;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}

.card_img-wrap {
  position: relative;
  height: 180px;
  overflow: hidden;
  background: #f8f8f8;
}

.card_img {
  width: auto;
  height: 100%;
  max-width: 75%;
  object-fit: contain;
  display: block;
  margin: auto;
  position: absolute;
  inset: 0;
  transition: transform 0.3s ease;
}

.card:hover .card_img {
  transform: scale(1.04);
}

.card_tag {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(201, 212, 241, 0.92);
  backdrop-filter: blur(6px);
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  color: #555;
}

.card_alcoholic {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card_body {
  padding: 14px 16px 16px;
}

.card_name {
  font-size: 15px;
  font-weight: 700;
  color: #0d0d0d;
  margin-bottom: 4px;
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card_glass {
  font-size: 11px;
  color: #aaa;
  margin-bottom: 10px;
}

.card_ingredients {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 8px;
}

.card_tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

/* ─── Chip / Tag ─────────────────────────── */
.chip {
  font-size: 10px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 999px;
  background: #fff4f0;
  border: 1px solid #ffe0d6;
  color: #ff5500;
}

.chip-more {
  background: #f5f5f5;
  border-color: #e0e0e0;
  color: #888;
}

.tag {
  font-size: 10px;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 999px;
  background: #f0f4ff;
  color: #5c6bc0;
}

/* ─── State ──────────────────────────────── */
.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 80px 0;
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
  transition: all 0.15s;
}

.retry-btn:hover {
  background: #ff5500;
  color: #fff;
}


/* ─── Responsive ─────────────────────────── */
@media (max-width: 768px) {
  .cards { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .page-header {
    padding: 24px 16px 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .page-title { font-size: 22px; }
  .main { padding: 24px 16px 60px; }
}

@media (max-width: 480px) {
  .cards { grid-template-columns: 1fr; }
}
</style>
