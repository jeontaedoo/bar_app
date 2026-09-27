<template>
  <div class="page">
    <header class="page-header">
      <NuxtLink to="/" class="back-btn">← 홈으로</NuxtLink>
      <div class="page-header_text">
        <span class="page-label">🌏 Asia's Best Bars</span>
        <h1 class="page-title">아시아 베스트 바</h1>
      </div>
    </header>

    <main class="main">
      <Bar :bars="asiaBars" />
    </main>
  </div>
</template>

<script setup lang="ts">
const asiaBars = [
  {
    id: 1,
    name: 'Coa',
    location: 'Hong Kong',
    desc: '멕시코 아가베 스피릿 전문 바. 아시아 최고의 바로 홍콩의 칵테일 씬을 이끌고 있다.',
    emoji: '🇭🇰',
    color: 'linear-gradient(135deg, #7c3aed, #4c1d95)',
    stars: 5,
    score: '9.7',
    tags: ['Agave', 'Mezcal', 'Award-winning'],
  },
  {
    id: 2,
    name: 'Zest',
    location: 'Tokyo, Japan',
    desc: '일본 고유의 재료와 감성을 담아낸 도쿄의 숨겨진 보석같은 칵테일 바.',
    emoji: '🇯🇵',
    color: 'linear-gradient(135deg, #be185d, #831843)',
    stars: 5,
    score: '9.5',
    tags: ['Japanese Spirits', 'Omakase', 'Intimate'],
  },
  {
    id: 3,
    name: 'BKK Social Club',
    location: 'Bangkok, Thailand',
    desc: '방콕의 열대 과일과 허브를 활용한 창의적인 칵테일이 펼쳐지는 루프탑 바.',
    emoji: '🇹🇭',
    color: 'linear-gradient(135deg, #065f46, #022c22)',
    stars: 4,
    score: '9.3',
    tags: ['Tropical', 'Rooftop', 'Creative'],
  },
  {
    id: 4,
    name: 'Jigger & Pony',
    location: 'Singapore',
    desc: '싱가포르 칵테일 문화를 선도하는 아시아 최고의 클래식 바 중 하나.',
    emoji: '🇸🇬',
    color: 'linear-gradient(135deg, #1e40af, #1e3a8a)',
    stars: 4,
    score: '9.2',
    tags: ['Classic', 'Sophisticated', 'Singapore'],
  },
  {
    id: 5,
    name: 'Bar Benfiddich',
    location: 'Tokyo, Japan',
    desc: '직접 재배한 허브와 스파이스로 만드는 팜-투-글라스 칵테일의 선구자.',
    emoji: '🇯🇵',
    color: 'linear-gradient(135deg, #166534, #052e16)',
    stars: 4,
    score: '9.1',
    tags: ['Farm-to-Glass', 'Herbs', 'Artisan'],
  },
  {
    id: 6,
    name: 'The Curator',
    location: 'Manila, Philippines',
    desc: '커피와 칵테일을 결합한 독창적인 콘셉트로 마닐라 바 씬을 이끄는 바.',
    emoji: '🇵🇭',
    color: 'linear-gradient(135deg, #92400e, #451a03)',
    stars: 4,
    score: '9.0',
    tags: ['Coffee Cocktails', 'Creative', 'Award-winning'],
  },
]
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #fafafa;
}

.page-header {
  max-width: 1200px;
  margin: 0 auto;
  padding: 88px 24px 0;
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

.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px 80px;
}


@media (max-width: 640px) {
  .page-header {
    padding: 80px 16px 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .page-title { font-size: 22px; }
  .main { padding: 24px 16px 60px; }
}
</style>
