import COCKTAIL_SHEET, { type SheetCocktailItem } from '~/sheets/cocktailSheet'
import { useDeeplApi } from '~/composables/useDeeplApi'

// ─── 정제된 칵테일 타입 ─────────────────────────────────────────
export interface CocktailIngredientItem {
  name: string
  measure: string
}

export interface Cocktail {
  id: string
  name: string
  category: string
  method: string
  instructions: string
  ingredients: CocktailIngredientItem[]
  garnish?: string
  views?: string
  url?: string
  videoUrl?: string
  video_url?: string
  thumbnail: string
  imageUrl?: string
  alcoholic: string
  glass: string
  tags: string[]
  iba?: string
  // 번역 필드
  methodKo?: string
  ingredientsKo?: CocktailIngredientItem[]
}

// ─── 영문 이름 -> Slug ID 변환 ───────────────────────────────
function nameToId(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// ─── SheetCocktailItem -> Cocktail 변환 ───────────────────────
function parseSheetCocktail(raw: SheetCocktailItem): Cocktail {
  const id = nameToId(raw.name)
  const ingredients: CocktailIngredientItem[] = (raw.ingredients ?? []).map((ing) => ({
    name: ing.name,
    measure: ing.amount ?? '',
  }))

  return {
    id,
    name: raw.name,
    category: raw.category ?? 'Unforgettable',
    method: raw.method,
    instructions: raw.method,
    ingredients,
    garnish: raw.garnish,
    views: raw.views,
    url: raw.url,
    videoUrl: raw.video_url,
    video_url: raw.video_url,
    thumbnail: raw.image_url ?? '',
    imageUrl: raw.image_url,
    alcoholic: 'Alcoholic',
    glass: 'Cocktail Glass',
    tags: [raw.category].filter(Boolean),
    iba: 'IBA Official',
  }
}

// ─── 메모리 로컬 데이터 세팅 ─────────────────────────────────
const ALL_COCKTAILS: Cocktail[] = COCKTAIL_SHEET.cocktails.map(parseSheetCocktail)

// ─── Composable ───────────────────────────────────────────────
export function useCocktailApi() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { translateBatch } = useDeeplApi()

  // 번역 캐시 (동일 ID 재번역 방지)
  const translationCache = new Map<string, { methodKo: string; ingredientsKo: CocktailIngredientItem[] }>()

  /**
   * 칵테일 재료 및 제조법 한글 번역 적용
   */
  async function attachTranslation(cocktail: Cocktail): Promise<Cocktail> {
    if (translationCache.has(cocktail.id)) {
      const cached = translationCache.get(cocktail.id)!
      return {
        ...cocktail,
        methodKo: cached.methodKo,
        ingredientsKo: cached.ingredientsKo,
      }
    }

    try {
      // 번역 대상 텍스트 수집: [method, ...ingNames, ...ingMeasures]
      const ingTexts = cocktail.ingredients.flatMap((i) => [i.name, i.measure])
      const textsToTranslate = [cocktail.method, ...ingTexts]

      const translated = await translateBatch(textsToTranslate)
      let idx = 0

      const methodKo = translated[idx++] ?? cocktail.method
      const ingredientsKo: CocktailIngredientItem[] = cocktail.ingredients.map((orig) => ({
        name: translated[idx++] ?? orig.name,
        measure: translated[idx++] ?? orig.measure,
      }))

      translationCache.set(cocktail.id, { methodKo, ingredientsKo })

      return {
        ...cocktail,
        methodKo,
        ingredientsKo,
      }
    } catch {
      return cocktail
    }
  }

  /**
   * 이름 또는 키워드로 칵테일 검색 (원문 및 번역 결합)
   */
  async function searchByName(query: string): Promise<Cocktail[]> {
    loading.value = true
    error.value = null
    try {
      const q = query.trim().toLowerCase()
      if (!q) return []

      const matched = ALL_COCKTAILS.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.id.includes(q)
      )

      return matched
    } catch (e) {
      error.value = '칵테일 검색에 실패했습니다.'
      return []
    } finally {
      loading.value = false
    }
  }

  /**
   * ID (slug 또는 index)로 칵테일 상세 조회 (자동 번역 포함)
   */
  async function getById(id: string): Promise<Cocktail | null> {
    loading.value = true
    error.value = null
    try {
      const found = ALL_COCKTAILS.find(
        (c) => c.id === id || nameToId(c.name) === id || c.name.toLowerCase() === id.toLowerCase()
      )

      if (!found) return null

      // ingredients, method 자동 한글 번역 후 리턴
      const withTranslation = await attachTranslation(found)
      return withTranslation
    } catch (e) {
      error.value = '칵테일 정보를 불러오는데 실패했습니다.'
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 랜덤 칵테일
   */
  async function getRandom(): Promise<Cocktail | null> {
    const randomIndex = Math.floor(Math.random() * ALL_COCKTAILS.length)
    const found = ALL_COCKTAILS[randomIndex]
    if (!found) return null
    return await attachTranslation(found)
  }

  /**
   * 카테고리별 필터링
   */
  async function filterByCategory(category: string): Promise<Cocktail[]> {
    const q = category.trim().toLowerCase()
    return ALL_COCKTAILS.filter((c) => c.category.toLowerCase().includes(q))
  }

  /**
   * 이미지 URL 헬퍼 (하위 호환성)
   */
  function getImageUrl(url: string): string {
    return url
  }

  /**
   * 기본 칵테일 목록 가져오기 (초기 리스트)
   */
  async function getDefaultList(limit: number = 20): Promise<Cocktail[]> {
    return ALL_COCKTAILS.slice(0, limit)
  }

  /**
   * 전체 칵테일 목록 반환
   */
  function getAllCocktails(): Cocktail[] {
    return ALL_COCKTAILS
  }

  return {
    loading,
    error,
    searchByName,
    getById,
    getRandom,
    filterByCategory,
    getImageUrl,
    getDefaultList,
    getAllCocktails,
    attachTranslation,
  }
}
