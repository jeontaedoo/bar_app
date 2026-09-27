<template>
  <div class="search-container" ref="searchRef">
    <!-- 검색 입력 영역 (아이콘 클릭 시 펼쳐짐) -->
    <div
      class="search_input-wrap"
      :class="{
        'is-expanded': isExpanded,
        'is-active': isDropdownOpen && searchQuery.trim()
      }"
    >
      <button
        type="button"
        class="search_toggle-btn"
        @click="toggleSearch"
        :title="isExpanded ? '검색창 닫기' : '검색창 열기'"
      >
        🔍
      </button>

      <input
        ref="inputRef"
        v-model="searchQuery"
        type="text"
        class="search_input"
        placeholder="위스키, 칵테일 검색..."
        @focus="onFocus"
        @input="onInput"
        @keydown.down.prevent="navigateDown"
        @keydown.up.prevent="navigateUp"
        @keydown.enter.prevent="selectCurrent"
        @keydown.esc="closeSearch"
      />

      <button
        v-if="searchQuery"
        type="button"
        class="search_clear-btn"
        @click="clearQuery"
      >
        ✕
      </button>
    </div>

    <!-- 자동완성 드롭다운 (최대 5개) -->
    <transition name="fade">
      <div
        v-if="isExpanded && isDropdownOpen && searchQuery.trim()"
        class="search_dropdown"
      >
        <!-- 로딩 상태 -->
        <div v-if="isLoading" class="search_state state-loading">
          <span class="spinner" />
          <span>검색하는 중...</span>
        </div>

        <!-- 결과 목록 -->
        <ul v-else-if="displayResults.length > 0" class="search_list">
          <li
            v-for="(item, index) in displayResults"
            :key="`${item.type}-${item.id}`"
            class="search_item"
            :class="{ 'item-selected': selectedIndex === index }"
            @mouseenter="selectedIndex = index"
            @click="onSelect(item)"
          >
            <img
              v-if="item.thumbnail"
              :src="item.thumbnail"
              :alt="item.title"
              class="search_item-thumb"
            />
            <div v-else class="search_item-thumb-placeholder">
              {{ item.typeLabel.charAt(0) }}
            </div>

            <div class="search_item-info">
              <div class="search_item-header">
                <span class="search_item-title">{{ item.title }}</span>
                <span class="search_item-badge" :class="`badge-${item.type}`">
                  {{ item.typeLabel }}
                </span>
              </div>
              <span v-if="item.subtitle" class="search_item-sub">
                {{ item.subtitle }}
              </span>
            </div>
          </li>
        </ul>

        <!-- 결과 없음 -->
        <div v-else class="search_state state-empty">
          <span>'{{ searchQuery }}' 검색 결과가 없습니다.</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { useWhiskyEditionApi, getWhiskyImageUrl } from '~/composables/useWhiskyEditionApi'
import { useCocktailApi } from '~/composables/useCocktailApi'
import { useWhiskeyProjectApi } from '~/composables/useWhiskeyProjectApi'
import { WHISKY_ALIASES, WHISKEY_CATEGORIES } from '~/sheets/whiskySheet'

// ─── 검색 결과 타입 ───────────────────────────────────────────
export interface SearchResultItem {
  id: string | number
  title: string
  subtitle?: string
  type: 'whiskey-category' | 'whiskey-catalog' | 'whiskey-detail' | 'cocktail' | 'bar'
  typeLabel: string
  link: string
  thumbnail?: string
}

// ─── 상태 ──────────────────────────────────────────────────────
const router = useRouter()
const { getReviews } = useWhiskyEditionApi()
const { searchWhiskies } = useWhiskeyProjectApi()
const { searchByName: searchCocktails } = useCocktailApi()

const searchRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

const isExpanded = ref(false)
const isDropdownOpen = ref(false)
const isLoading = ref(false)
const searchQuery = ref('')
const searchResults = ref<SearchResultItem[]>([])
const selectedIndex = ref(-1)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

// 최대 5개 노출
const displayResults = computed(() => searchResults.value.slice(0, 5))

// ─── 한글 키워드 변환 함수 ────────────────────────────────────
function resolveQuery(raw: string): string {
  const trimmed = raw.trim().toLowerCase()
  for (const [kr, en] of Object.entries(WHISKY_ALIASES)) {
    if (trimmed.includes(kr.toLowerCase())) {
      return en
    }
  }
  return raw.trim()
}

// ─── 검색 로직 ────────────────────────────────────────────────
async function performSearch(query: string) {
  const rawQuery = query.trim()
  if (!rawQuery) {
    searchResults.value = []
    return
  }

  isLoading.value = true
  const results: SearchResultItem[] = []

  // 한글 입력 매핑 변환 (예: 글렌피딕 -> Glenfiddich)
  const apiQuery = resolveQuery(rawQuery)

  try {
    // 1. 위스키 카테고리 매칭
    const matchedCategories = WHISKEY_CATEGORIES.filter(
      (c) =>
        c.name.toLowerCase().includes(rawQuery.toLowerCase()) ||
        c.id.toLowerCase().includes(rawQuery.toLowerCase()) ||
        c.type.toLowerCase().includes(apiQuery.toLowerCase())
    ).map((c) => ({
      id: c.id,
      title: c.name,
      subtitle: c.desc,
      type: 'whiskey-category' as const,
      typeLabel: '위스키 카테고리',
      link: `/whiskey/${c.id}`,
    }))
    results.push(...matchedCategories)

    // 2. 로컬 WhiskeyProject 위스키명 검색
    const catalogRes = await searchWhiskies(apiQuery, 5)
    if (catalogRes?.items.length) {
      const catalogItems = catalogRes.items.map((whisky) => ({
        id: whisky.id,
        title: whisky.title,
        subtitle: whisky.region || undefined,
        type: 'whiskey-catalog' as const,
        typeLabel: '위스키',
        link: `/whiskey/catalog/${whisky.id}`,
        thumbnail: whisky.imageUrl || undefined,
      }))
      results.push(...catalogItems)
    }

    // 3. 위스키 개별 상세 리뷰 API 검색
    const whiskyApiRes = await getReviews({ q: apiQuery, per_page: 5 })
    if (whiskyApiRes?.items?.length) {
      const apiWhiskyItems = whiskyApiRes.items.map((w) => {
        const catKey = w.metadata.type ? w.metadata.type.toLowerCase().replace(/\s+/g, '-') : 'scotch'
        return {
          id: w.id,
          title: w.name,
          subtitle: `${w.metadata.distillery || w.metadata.country} · ${w.metadata.abv}%`,
          type: 'whiskey-detail' as const,
          typeLabel: '위스키 리뷰',
          link: `/whiskey/${catKey}/${w.slug}`,
          thumbnail: getWhiskyImageUrl(w.image.url),
        }
      })
      results.push(...apiWhiskyItems)
    }

    // 4. 칵테일 API 검색
    const cocktails = await searchCocktails(rawQuery)
    if (cocktails?.length) {
      const cocktailItems = cocktails.map((c) => ({
        id: c.id,
        title: c.name,
        subtitle: `${c.category} · ${c.alcoholic}`,
        type: 'cocktail' as const,
        typeLabel: '칵테일',
        link: `/cocktail/${c.id}`,
        thumbnail: c.thumbnail,
      }))
      results.push(...cocktailItems)
    }

    searchResults.value = results
    selectedIndex.value = -1
  } catch (e) {
    console.error('Search error:', e)
  } finally {
    isLoading.value = false
  }
}

// ─── 토글 및 인터랙션 ──────────────────────────────────────────
function toggleSearch() {
  isExpanded.value = !isExpanded.value
  if (isExpanded.value) {
    nextTick(() => inputRef.value?.focus())
  } else {
    closeSearch()
  }
}

function onInput() {
  isDropdownOpen.value = true
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    performSearch(searchQuery.value)
  }, 250)
}

function onFocus() {
  if (searchQuery.value.trim()) {
    isDropdownOpen.value = true
  }
}

function clearQuery() {
  searchQuery.value = ''
  searchResults.value = []
  isDropdownOpen.value = false
  inputRef.value?.focus()
}

function closeSearch() {
  isExpanded.value = false
  isDropdownOpen.value = false
  searchQuery.value = ''
  searchResults.value = []
  selectedIndex.value = -1
}

function onSelect(item: SearchResultItem) {
  closeSearch()
  router.push(item.link)
}

function navigateDown() {
  if (!isDropdownOpen.value || displayResults.value.length === 0) return
  selectedIndex.value = (selectedIndex.value + 1) % displayResults.value.length
}

function navigateUp() {
  if (!isDropdownOpen.value || displayResults.value.length === 0) return
  selectedIndex.value =
    (selectedIndex.value - 1 + displayResults.value.length) % displayResults.value.length
}

function selectCurrent() {
  if (selectedIndex.value >= 0 && selectedIndex.value < displayResults.value.length) {
    onSelect(displayResults.value[selectedIndex.value])
  }
}

// 외부 클릭 감지
function handleClickOutside(event: MouseEvent) {
  if (searchRef.value && !searchRef.value.contains(event.target as Node)) {
    closeSearch()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (debounceTimer) clearTimeout(debounceTimer)
})
</script>

<style scoped>
/* ─── Search Container ───────────────────── */
.search-container {
  position: relative;
  display: inline-flex;
  align-items: center;
}

/* ─── Search Input Wrap (Expandable) ─────── */
.search_input-wrap {
  display: flex;
  align-items: center;
  width: 38px;
  height: 38px;
  background: #ffffff;
  border: 1.5px solid #e5e7eb;
  border-radius: 999px;
  padding: 0 4px;
  overflow: hidden;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              border-color 0.2s ease,
              box-shadow 0.2s ease;
}

.search_input-wrap.is-expanded {
  width: 280px;
  border-color: #ff5500;
  box-shadow: 0 4px 16px rgba(255, 85, 0, 0.12);
  padding: 0 12px;
}

.search_toggle-btn {
  width: 30px;
  height: 30px;
  border: none;
  background: transparent;
  font-size: 15px;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  transition: background 0.15s;
}

.search_toggle-btn:hover {
  background: #f3f4f6;
  color: #ff5500;
}

.search_input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  color: #111827;
  padding: 0 6px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.search_input-wrap.is-expanded .search_input {
  opacity: 1;
}

.search_input::placeholder {
  color: #9ca3af;
}

.search_clear-btn {
  border: none;
  background: #f3f4f6;
  color: #6b7280;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  font-size: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: background 0.15s;
}

.search_clear-btn:hover {
  background: #e5e7eb;
  color: #111827;
}

/* ─── Dropdown ───────────────────────────── */
.search_dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 320px;
  background: #ffffff;
  border: 1px solid #f3f4f6;
  border-radius: 14px;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.14);
  overflow: hidden;
  z-index: 600;
}

/* ─── List & Items ───────────────────────── */
.search_list {
  list-style: none;
  margin: 0;
  padding: 6px;
}

.search_item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.search_item:hover,
.search_item.item-selected {
  background: #fff4f0;
}

.search_item-thumb {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
  background: #f3f4f6;
}

.search_item-thumb-placeholder {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #fff0eb;
  color: #ff5500;
  font-weight: 700;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.search_item-info {
  flex: 1;
  min-width: 0;
}

.search_item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.search_item-title {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search_item-badge {
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 999px;
  flex-shrink: 0;
}

.badge-whiskey-category {
  background: #fff0eb;
  color: #ff5500;
}

.badge-whiskey-detail {
  background: #f0fdf4;
  color: #16a34a;
}

.badge-whiskey-catalog {
  background: #f0fdf4;
  color: #16a34a;
}

.badge-cocktail {
  background: #eff6ff;
  color: #2563eb;
}

.badge-bar {
  background: #faf5ff;
  color: #9333ea;
}

.search_item-sub {
  display: block;
  font-size: 11px;
  color: #6b7280;
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ─── State (Loading / Empty) ────────────── */
.search_state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 18px;
  font-size: 12px;
  color: #6b7280;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #e5e7eb;
  border-top-color: #ff5500;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ─── Fade Animation ─────────────────────── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
