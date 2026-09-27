<template>
  <header class="header">
    <div class="header_inner">
      <!-- 좌측: 브랜드 로고 및 뒤로가기 -->
      <div class="header_left">
        <button
          v-if="showBackBtn"
          type="button"
          class="header_back-btn"
          @click="goBack"
          title="뒤로 가기"
        >
          ←
        </button>

        <NuxtLink to="/" class="header_logo">
          🍸 위즐
        </NuxtLink>
      </div>

      <!-- 우측: 통합 검색 바 & GNB 메뉴 링크 -->
      <div class="header_right">
        <Search />
        <nav class="header_nav">
          <NuxtLink to="/whiskey" class="header_nav-link">
            🥃 위스키
          </NuxtLink>
          <NuxtLink to="/cocktailRecipes" class="header_nav-link">
            🍹 칵테일
          </NuxtLink>
          <NuxtLink to="/worldBestBars" class="header_nav-link">
            🏆 베스트 바
          </NuxtLink>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import Search from '~/components/Search.vue'

const route = useRoute()
const router = useRouter()

// 홈 페이지("/")에서는 뒤로가기 버튼 숨김
const showBackBtn = computed(() => route.path !== '/')

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
/* ─── Header Container ───────────────────── */
.header {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 500;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #f0f0f0;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
}

.header_inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

/* ─── Header Left ────────────────────────── */
.header_left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.header_back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #ffffff;
  color: #4b5563;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}

.header_back-btn:hover {
  border-color: #ff5500;
  color: #ff5500;
  background: #fff4f0;
}

.header_logo {
  font-size: 18px;
  font-weight: 800;
  color: #0d0d0d;
  text-decoration: none;
  letter-spacing: -0.02em;
  white-space: nowrap;
}

/* ─── Header Right (Search & GNB) ────────── */
.header_right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* ─── Header Nav (GNB) ───────────────────── */
.header_nav {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.header_nav-link {
  font-size: 14px;
  font-weight: 600;
  color: #4b5563;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.15s ease;
  white-space: nowrap;
}

.header_nav-link:hover,
.header_nav-link.router-link-active {
  color: #ff5500;
  background: #fff4f0;
}

/* ─── Responsive ─────────────────────────── */
@media (max-width: 768px) {
  .header_inner {
    padding: 10px 16px;
    gap: 12px;
  }

  .header_center {
    max-width: unset;
  }

  .header_nav {
    display: none; /* 모바일에서는 하단 탭 또는 햄버거로 대응 가능하도록 축소 */
  }

  .header_logo {
    font-size: 16px;
  }
}
</style>
