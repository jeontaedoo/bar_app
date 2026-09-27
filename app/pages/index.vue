<template>
  <div class="page">

    <!-- GNB -->
    <header class="gnb">
      <div class="gnb_inner">
        <div class="gnb_logo">
          <span class="gnb_logo-icon">🍸</span>
          <span class="gnb_logo-text">Fine Drinks</span>
        </div>
        <nav class="gnb_nav">
          <NuxtLink to="/cocktail/cocktailRecipes" class="gnb_nav-item">칵테일 레시피</NuxtLink>
          <NuxtLink to="/bestBar/worldBestBars" class="gnb_nav-item">월드 베스트 바</NuxtLink>
          <NuxtLink to="/bestBar/asiaBestBars" class="gnb_nav-item">아시아 베스트 바</NuxtLink>
        </nav>
        <div class="gnb_actions">
          <button class="gnb_btn-outline">로그인</button>
          <button class="gnb_btn-fill">시작하기</button>
        </div>
      </div>
    </header>

    <!-- Hero -->
    <section class="hero">
      <div class="hero_inner">
        <div class="hero_text">
          <p class="hero_eyebrow">🍸 Curated by Bartenders</p>
          <h1 class="hero_title">세계 최고의 바와<br /><span class="hero_title-accent">칵테일을 경험하세요</span></h1>
          <p class="hero_desc">월드 베스트 바부터 칵테일 레시피까지,<br />Fine Drinks에서 당신의 취향을 발견하세요.</p>
          <div class="hero_cta">
            <button class="btn-primary">지금 탐색하기</button>
            <button class="btn-secondary">레시피 보기</button>
          </div>
        </div>
        <div class="hero_visual">
          <div class="hero_card hero_card-1">
            <span class="hero_card-emoji">🍊</span>
            <div class="hero_card-info">
              <p class="hero_card-name">Negroni</p>
              <p class="hero_card-sub">Classic · 5분</p>
            </div>
          </div>
          <div class="hero_card hero_card-2">
            <span class="hero_card-emoji">🥃</span>
            <div class="hero_card-info">
              <p class="hero_card-name">Penicillin</p>
              <p class="hero_card-sub">Contemporary · 12분</p>
            </div>
          </div>
          <div class="hero_card hero_card-3">
            <span class="hero_card-emoji">☕</span>
            <div class="hero_card-info">
              <p class="hero_card-name">Espresso Martini</p>
              <p class="hero_card-sub">Modern Classic · 8분</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Category Tabs -->
    <div class="category-bar">
      <div class="category-bar_inner">
        <button class="category-tab category-tab-active">전체</button>
        <div v-for="(category, index) in alcohole">
          <NuxtLink :to="category.link">
            <button @click="checkAlcohol(category.name)" class="category-tab">{{ category.name }}</button>
          </NuxtLink>
        </div>
      </div>
    </div>

    <main class="main">

      <!-- Cocktail Recipes Section -->
      <section class="section">
        <div class="section_header">
          <div>
            <p class="section_eyebrow">🍹 Cocktail Recipes</p>
            <h2 class="section_title">칵테일 레시피</h2>
          </div>
          <NuxtLink to="/cocktail/cocktailRecipes" class="section_more">전체 보기 →</NuxtLink>
        </div>
        <div class="section_preview">
          <p class="section_preview-text">마가리타, 모히토, 네그로니 등 세계 각국의 클래식 칵테일 레시피를 확인하세요.</p>
          <NuxtLink to="/cocktail/cocktailRecipes" class="section_preview-btn">레시피 탐색하기 →</NuxtLink>
        </div>
      </section>

      <!-- World's Best Bars Section -->
      <section class="section">
        <div class="section_header">
          <div>
            <p class="section_eyebrow">🌍 World's Best Bars</p>
            <h2 class="section_title">월드 베스트 바</h2>
          </div>
          <NuxtLink to="/bestBar/worldBestBars" class="section_more">전체 보기 →</NuxtLink>
        </div>
        <Bar :bars="worldBarPreview" />
      </section>

      <!-- Asia's Best Bars Section -->
      <section class="section">
        <div class="section_header">
          <div>
            <p class="section_eyebrow">🌏 Asia's Best Bars</p>
            <h2 class="section_title">아시아 베스트 바</h2>
          </div>
          <NuxtLink to="/bestBar/asiaBestBars" class="section_more">전체 보기 →</NuxtLink>
        </div>
        <Bar :bars="asiaBarPreview" />
      </section>

    </main>
  </div>
</template>

<script setup lang="ts">
const worldBarPreview = [
  { id: 1, name: 'Paradiso', location: 'Barcelona, Spain', desc: '비밀스러운 입구 뒤에 숨겨진 마법같은 공간. 혁신적인 칵테일로 세계 1위에 올랐다.', emoji: '🇪🇸', color: 'linear-gradient(135deg, #1e3a5f, #0f172a)', stars: 5, score: '9.8', tags: ['Speakeasy', 'Creative'] },
  { id: 2, name: 'Sago', location: 'Singapore', desc: '동남아시아의 재료를 활용한 독창적인 칵테일이 인상적인 싱가포르의 보석.', emoji: '🇸🇬', color: 'linear-gradient(135deg, #1a3a2a, #0d2016)', stars: 5, score: '9.7', tags: ['Local Ingredients', 'Innovative'] },
  { id: 3, name: 'Connaught Bar', location: 'London, UK', desc: '100년 역사를 자랑하는 마티니 트롤리로 유명한 런던의 아이코닉 바.', emoji: '🇬🇧', color: 'linear-gradient(135deg, #2d1b4e, #1a0f30)', stars: 5, score: '9.6', tags: ['Classic', 'Luxury'] },
]

const asiaBarPreview = [
  { id: 1, name: 'Coa', location: 'Hong Kong', desc: '멕시코 아가베 스피릿 전문 바. 아시아 최고의 바로 홍콩의 칵테일 씬을 이끌고 있다.', emoji: '🇭🇰', color: 'linear-gradient(135deg, #7c3aed, #4c1d95)', stars: 5, score: '9.7', tags: ['Agave', 'Mezcal'] },
  { id: 2, name: 'Zest', location: 'Tokyo, Japan', desc: '일본 고유의 재료와 감성을 담아낸 도쿄의 숨겨진 보석같은 칵테일 바.', emoji: '🇯🇵', color: 'linear-gradient(135deg, #be185d, #831843)', stars: 5, score: '9.5', tags: ['Japanese Spirits', 'Intimate'] },
  { id: 3, name: 'BKK Social Club', location: 'Bangkok, Thailand', desc: '방콕의 열대 과일과 허브를 활용한 창의적인 칵테일이 펼쳐지는 루프탑 바.', emoji: '🇹🇭', color: 'linear-gradient(135deg, #065f46, #022c22)', stars: 4, score: '9.3', tags: ['Tropical', 'Rooftop'] },
]

const alcohole = [
  {
    id:1, name : '위스키', label : 'whiskey', link : '/whiskey'
  },
  {
    id:2, name : '진', label : 'gin', link : '/gin'
  },
  {
    id:3, name : '럼', label : 'rum' , link : '/rum'
  },
  {
    id:4, name : '테킬라', label : 'tequila', link : '/tequila'
  },
  {
    id:5, name : '보드카', label : 'vodka', link : '/vodka'
  },
  {
    id:6, name : '리큐르', label : 'liqueur', link : '/liqueur'
  }
]

function checkAlcohol(data){
  console.log(data)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Pretendard:wght@300;400;500;600;700;800&display=swap');
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css');

/* ─── GNB ───────────────────────────────── */
.gnb {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  height: 64px;
}

.gnb_inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 40px;
}

.gnb_logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  flex-shrink: 0;
}

.gnb_logo-icon {
  font-size: 22px;
}

.gnb_logo-text {
  font-size: 18px;
  font-weight: 800;
  color: #0d0d0d;
  letter-spacing: -0.02em;
}

.gnb_nav {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
}

.gnb_nav-item {
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #555;
  text-decoration: none;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}

.gnb_nav-item:hover {
  background: #f5f5f5;
  color: #0d0d0d;
}

.gnb_actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.gnb_btn-outline {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: none;
  font-size: 14px;
  font-weight: 500;
  color: #555;
  cursor: pointer;
  transition: all 0.15s;
}

.gnb_btn-outline:hover {
  border-color: #ff5500;
  color: #ff5500;
}

.gnb_btn-fill {
  padding: 8px 18px;
  border: none;
  border-radius: 8px;
  background: #ff5500;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: background 0.15s;
}

.gnb_btn-fill:hover {
  background: #e04800;
}

/* ─── Hero ──────────────────────────────── */
.hero {
  margin-top: 64px;
  padding: 80px 24px 60px;
  background: linear-gradient(160deg, #fff8f5 0%, #ffffff 60%);
  overflow: hidden;
}

.hero_inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
}

.hero_text {
  flex: 1;
  max-width: 520px;
}

.hero_eyebrow {
  font-size: 13px;
  font-weight: 600;
  color: #ff5500;
  letter-spacing: 0.05em;
  margin-bottom: 16px;
}

.hero_title {
  font-size: clamp(32px, 4.5vw, 52px);
  font-weight: 800;
  line-height: 1.15;
  color: #0d0d0d;
  margin-bottom: 20px;
  letter-spacing: -0.03em;
}

.hero_title-accent {
  color: #ff5500;
}

.hero_desc {
  font-size: 16px;
  color: #7b7b7b;
  line-height: 1.7;
  margin-bottom: 36px;
}

.hero_cta {
  display: flex;
  gap: 12px;
}

.btn-primary {
  padding: 14px 28px;
  border: none;
  border-radius: 10px;
  background: #ff5500;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s, transform 0.12s;
}

.btn-primary:hover {
  background: #e04800;
  transform: translateY(-1px);
}

.btn-secondary {
  padding: 14px 28px;
  border: 1.5px solid #e0e0e0;
  border-radius: 10px;
  background: #fff;
  color: #333;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-secondary:hover {
  border-color: #ff5500;
  color: #ff5500;
}

/* ─── Hero Visual ───────────────────────── */
.hero_visual {
  flex-shrink: 0;
  position: relative;
  width: 340px;
  height: 280px;
}

.hero_card {
  position: absolute;
  background: #fff;
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
  transition: transform 0.3s ease;
  animation: float 3s ease-in-out infinite;
}

.hero_card:hover {
  transform: translateY(-4px) scale(1.02);
}

.hero_card-1 {
  top: 0;
  left: 0;
  animation-delay: 0s;
}

.hero_card-2 {
  top: 100px;
  right: 0;
  animation-delay: 1s;
}

.hero_card-3 {
  bottom: 0;
  left: 30px;
  animation-delay: 2s;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.hero_card-emoji {
  font-size: 36px;
}

.hero_card-name {
  font-size: 14px;
  font-weight: 700;
  color: #0d0d0d;
  margin-bottom: 2px;
}

.hero_card-sub {
  font-size: 12px;
  color: #aaa;
}

/* ─── Category Bar ──────────────────────── */
.category-bar {
  border-bottom: 1px solid #f0f0f0;
  background: #fff;
  position: sticky;
  top: 64px;
  z-index: 50;
}

.category-bar_inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;
}

.category-bar_inner::-webkit-scrollbar {
  display: none;
}

.category-tab {
  padding: 14px 20px;
  border: none;
  border-bottom: 2px solid transparent;
  background: none;
  font-size: 14px;
  font-weight: 500;
  color: #aaa;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
  flex-shrink: 0;
}

.category-tab:hover {
  color: #0d0d0d;
}

.category-tab-active {
  color: #ff5500;
  border-bottom-color: #ff5500;
  font-weight: 700;
}

/* ─── Main ──────────────────────────────── */
.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 24px 80px;
  display: flex;
  flex-direction: column;
  gap: 72px;
}

/* ─── Section ───────────────────────────── */
.section_header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 24px;
}

.section_eyebrow {
  font-size: 12px;
  font-weight: 600;
  color: #ff5500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.section_title {
  font-size: 22px;
  font-weight: 800;
  color: #0d0d0d;
  letter-spacing: -0.02em;
}

.section_more {
  display: inline-block;
  font-size: 13px;
  font-weight: 600;
  color: #aaa;
  text-decoration: none;
  padding: 6px 0;
  transition: color 0.15s;
  white-space: nowrap;
}

.section_more:hover {
  color: #ff5500;
}

.section_preview {
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 16px;
  padding: 30px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.section_preview-text {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.section_preview-btn {
  display: inline-block;
  padding: 10px 20px;
  background: #ff5500;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 8px;
  transition: background 0.15s;
}

.section_preview-btn:hover {
  background: #e04800;
}

/* ─── Responsive ────────────────────────── */
@media (max-width: 900px) {
  .hero_inner {
    flex-direction: column;
    text-align: center;
  }

  .hero_text {
    max-width: 100%;
  }

  .hero_cta {
    justify-content: center;
  }

  .hero_visual {
    width: 100%;
    height: 200px;
  }

  .hero_card-1 { top: 0; left: 10%; }
  .hero_card-2 { top: 60px; right: 5%; }
  .hero_card-3 { bottom: 0; left: 5%; }

  .gnb_nav {
    display: none;
  }
}

@media (max-width: 640px) {
  .hero {
    padding: 60px 20px 48px;
  }

  .hero_title {
    font-size: 30px;
  }

  .hero_visual {
    display: none;
  }

  .main {
    padding: 48px 16px 60px;
    gap: 56px;
  }

  .gnb_actions {
    display: none;
  }

  .section_header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
