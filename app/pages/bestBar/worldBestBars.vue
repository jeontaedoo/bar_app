<template>
  <div class="page">
    <header class="page-header">
      <NuxtLink to="/" class="back-btn">← 홈으로</NuxtLink>
      <div class="page-header_text">
        <span class="page-label">🌍 World's Best Bars</span>
        <h1 class="page-title">월드 베스트 바</h1>
      </div>
    </header>

    <main class="main">
      <Bar :bars="worldBars" />
    </main>
  </div>
</template>

<script setup lang="ts">
const worldBars = [
  {
    id: 1,
    name: 'Paradiso',
    location: 'Barcelona, Spain',
    desc: '비밀스러운 입구 뒤에 숨겨진 마법같은 공간. 혁신적인 칵테일로 세계 1위에 올랐다.',
    emoji: '🇪🇸',
    color: 'linear-gradient(135deg, #1e3a5f, #0f172a)',
    stars: 5,
    score: '9.8',
    tags: ['Speakeasy', 'Creative', 'Award-winning'],
  },
  {
    id: 2,
    name: 'Sago',
    location: 'Singapore',
    desc: '동남아시아의 재료를 활용한 독창적인 칵테일이 인상적인 싱가포르의 보석.',
    emoji: '🇸🇬',
    color: 'linear-gradient(135deg, #1a3a2a, #0d2016)',
    stars: 5,
    score: '9.7',
    tags: ['Local Ingredients', 'Innovative', 'Cozy'],
  },
  {
    id: 3,
    name: 'Connaught Bar',
    location: 'London, UK',
    desc: '100년 역사를 자랑하는 마티니 트롤리로 유명한 런던의 아이코닉 바.',
    emoji: '🇬🇧',
    color: 'linear-gradient(135deg, #2d1b4e, #1a0f30)',
    stars: 5,
    score: '9.6',
    tags: ['Classic', 'Luxury', 'Historic'],
  },
  {
    id: 4,
    name: 'Double Chicken Please',
    location: 'New York, USA',
    desc: '치킨 테마의 독특한 컨셉으로 뉴욕을 사로잡은 트렌디한 칵테일 바.',
    emoji: '🇺🇸',
    color: 'linear-gradient(135deg, #7c2d12, #431407)',
    stars: 4,
    score: '9.4',
    tags: ['Quirky', 'Trendy', 'Experimental'],
  },
  {
    id: 5,
    name: 'Handshake Speakeasy',
    location: 'Mexico City, Mexico',
    desc: '멕시코시티의 비밀스러운 스피크이지 바. 독창적인 테킬라 칵테일로 유명하다.',
    emoji: '🇲🇽',
    color: 'linear-gradient(135deg, #854d0e, #422006)',
    stars: 4,
    score: '9.3',
    tags: ['Speakeasy', 'Tequila', 'Creative'],
  },
  {
    id: 6,
    name: 'Tayēr + Elementary',
    location: 'London, UK',
    desc: '혁신적인 기법과 지속 가능성을 결합한 런던의 최첨단 바.',
    emoji: '🇬🇧',
    color: 'linear-gradient(135deg, #134e4a, #042f2e)',
    stars: 4,
    score: '9.2',
    tags: ['Innovative', 'Sustainable', 'Modern'],
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
