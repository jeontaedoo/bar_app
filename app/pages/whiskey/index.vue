<template>
  <div class="page">

    <div class="page-title-wrap">
      <span class="page-label">🥃 Whiskey</span>
      <h1 class="page-title">위스키 종류</h1>
    </div>

    <main class="main">
      <ul class="category-list">
        <li
          v-for="(cat, index) in categories"
          :key="cat.id"
          class="category-item"
        >
          <!-- 메인 카테고리 행 -->
          <div
            class="category-row"
            :class="{ 'category-row-open': openId === cat.id }"
            @click="handleCategoryClick(cat)"
          >
            <div class="category-row_left">
              <span class="category-num">{{ index + 1 }}</span>
              <span class="category-emoji">{{ cat.emoji }}</span>
              <span class="category-name">{{ cat.name }}</span>
            </div>
            <div class="category-row_right">
              <!-- 서브 카테고리 있으면 드롭다운 화살표, 없으면 이동 화살표 -->
              <span
                v-if="cat.subCategories?.length"
                class="category-arrow"
                :class="{ 'category-arrow-open': openId === cat.id }"
              >▾</span>
              <span v-else class="category-arrow-link">→</span>
            </div>
          </div>

          <!-- 드롭다운 서브 카테고리 -->
          <Transition name="dropdown">
            <ul
              v-if="cat.subCategories?.length && openId === cat.id"
              class="sub-list"
            >
              <li class="sub-item" @click.stop="navigateTo(`/whiskey/${cat.id}`)">
                <span class="sub-num">{{ index + 1 }}.0</span>
                <span class="sub-name">전체 {{ cat.name }} 보기</span>
                <span class="sub-arrow">→</span>
              </li>
              <li
                v-for="(sub, subIndex) in cat.subCategories"
                :key="sub.id"
                class="sub-item"
                @click.stop="navigateTo(`/whiskey/${sub.id}`)"
              >
                <span class="sub-num">{{ index + 1 }}.{{ subIndex + 1 }}</span>
                <span class="sub-name">{{ sub.name }}</span>
                <span class="sub-arrow">→</span>
              </li>
            </ul>
          </Transition>
        </li>
      </ul>
    </main>
  </div>
</template>

<script setup lang="ts">
interface WhiskeySubCategory {
  id: string
  name: string
}

interface WhiskeyCategory {
  id: string
  name: string
  emoji: string
  subCategories?: WhiskeySubCategory[]
}

const categories: WhiskeyCategory[] = [
  {
    id: 'scotch',
    name: '스카치 위스키',
    emoji: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    subCategories: [
      { id: 'single-malt', name: '싱글몰트 위스키' },
      { id: 'blended', name: '블랜디드 위스키' },
      { id: 'blended-malt', name: '블랜디드 몰트 위스키' },
      { id: 'single-grain', name: '싱글 그레인 위스키' },
    ],
  },
  {
    id: 'american',
    name: '아메리칸 위스키',
    emoji: '🇺🇸',
    subCategories: [
      { id: 'bourbon', name: '버번 위스키' },
      { id: 'rye', name: '라이 위스키' },
      { id: 'tennessee', name: '테네시 위스키' },
    ],
  },
  { id: 'irish', name: '아이리쉬 위스키', emoji: '🇮🇪' },
  { id: 'canadian', name: '캐나디안 위스키', emoji: '🇨🇦' },
  { id: 'japanese', name: '재패니스 위스키', emoji: '🇯🇵' },
  { id: 'korean', name: '코리안 위스키', emoji: '🇰🇷' },
]

const openId = ref<string | null>(null)

function handleCategoryClick(cat: WhiskeyCategory) {
  if (cat.subCategories?.length) {
    // 서브 카테고리가 있으면 드롭다운 토글
    openId.value = openId.value === cat.id ? null : cat.id
  } else {
    // 서브 카테고리 없으면 바로 이동
    navigateTo(`/whiskey/${cat.id}`)
  }
}
</script>

<style scoped>
/* ─── Page ───────────────────────────────── */
.page {
  min-height: 100vh;
  background: #fafafa;
}

.page-title-wrap {
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 24px 0;
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

/* ─── Main ───────────────────────────────── */
.main {
  max-width: 720px;
  margin: 0 auto;
  padding: 36px 24px 80px;
}

/* ─── Search Section ─────────────────────── */
.search-section {
  margin-bottom: 24px;
}

/* ─── Category List ──────────────────────── */
.category-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.category-item {
  border-radius: 14px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #f0f0f0;
  transition: box-shadow 0.2s ease;
}

.category-item:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.07);
}

/* ─── Category Row ───────────────────────── */
.category-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  cursor: pointer;
  transition: background 0.15s;
  user-select: none;
}

.category-row:hover {
  background: #fdf9f7;
}

.category-row-open {
  background: #fff8f5;
  border-bottom: 1px solid #f0ebe8;
}

.category-row_left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.category-num {
  font-size: 12px;
  font-weight: 700;
  color: #ff5500;
  width: 20px;
  flex-shrink: 0;
}

.category-emoji {
  font-size: 24px;
  flex-shrink: 0;
}

.category-name {
  font-size: 16px;
  font-weight: 700;
  color: #0d0d0d;
  letter-spacing: -0.01em;
}

.category-row_right {
  display: flex;
  align-items: center;
}

.category-arrow {
  font-size: 18px;
  color: #bbb;
  transition: transform 0.25s ease, color 0.15s;
  display: inline-block;
}

.category-arrow-open {
  transform: rotate(180deg);
  color: #ff5500;
}

.category-arrow-link {
  font-size: 16px;
  color: #bbb;
  transition: color 0.15s, transform 0.15s;
  display: inline-block;
}

.category-row:hover .category-arrow-link {
  color: #ff5500;
  transform: translateX(3px);
}

/* ─── Sub List (Dropdown) ────────────────── */
.sub-list {
  list-style: none;
}

.sub-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 20px 14px 56px;
  cursor: pointer;
  transition: background 0.15s;
  border-top: 1px solid #f9f5f3;
}

.sub-item:hover {
  background: #fdf5f2;
}

.sub-item:hover .sub-arrow {
  color: #ff5500;
  transform: translateX(3px);
}

.sub-num {
  font-size: 11px;
  font-weight: 600;
  color: #ff5500;
  width: 28px;
  flex-shrink: 0;
}

.sub-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  flex: 1;
}

.sub-arrow {
  font-size: 14px;
  color: #ccc;
  transition: color 0.15s, transform 0.15s;
  display: inline-block;
}

/* ─── Dropdown Transition ────────────────── */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  max-height: 0;
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  max-height: 400px;
}

/* ─── Responsive ─────────────────────────── */
@media (max-width: 640px) {
  .page-header {
    padding: 80px 16px 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .page-title { font-size: 22px; }
  .main { padding: 24px 16px 60px; }
  .category-name { font-size: 15px; }
  .sub-item { padding-left: 48px; }
}
</style>
