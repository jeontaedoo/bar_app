const WHISKY_API_BASE = '/api/whisky/reviews'

// ─── Raw API 타입 ─────────────────────────────────────────────
export interface WhiskyMetadata {
  type: string
  country: string
  region?: string
  distillery: string
  bottler?: string
  age?: number
  abv: number
  price_per_liter?: number
  flavour?: string
}

export interface WhiskyRating {
  marcel?: number
  sascha?: number
  florian?: number
  lucas?: number
  value_for_money: number
}

export interface WhiskyTastingNotes {
  nose: string
  palate: string
  finish: string
}

export interface WhiskyConclusion {
  marcel?: string
  sascha?: string
  florian?: string
  lucas?: string
}

export interface WhiskyFaq {
  question: string
  answer: string
}

// ─── 정제된 타입 ──────────────────────────────────────────────
export interface WhiskySummary {
  id: number
  slug: string
  lang: string
  name: string
  description: string
  image: { url: string; alt?: string }
  authors: string[]
  published_at?: string | null
  metadata: WhiskyMetadata
  rating: WhiskyRating
  url: string
  pdf?: string
}

export interface WhiskyDetail extends WhiskySummary {
  tasting_notes: WhiskyTastingNotes
  conclusion: WhiskyConclusion
  faq?: WhiskyFaq[]
}

export interface WhiskyListResponse {
  ok: boolean
  lang: string
  count: number
  total: number
  page: number
  per_page: number
  items: WhiskySummary[]
}

// ─── 목록 조회 파라미터 ────────────────────────────────────────
export interface WhiskyListParams {
  page?: number
  per_page?: number
  q?: string
  country?: string
  region?: string
  distillery?: string
  bottler?: string
  flavour?: string
  type?: string
  min_age?: number
  max_age?: number
  min_abv?: number
  max_abv?: number
  min_price?: number
  max_price?: number
}

// ─── 이미지 URL 헬퍼 ──────────────────────────────────────────
/**
 * 상대 경로 이미지 URL → 절대 URL 변환
 */
export function getWhiskyImageUrl(path: string): string {
  if (path.startsWith('http')) return path
  return `https://thewhiskyedition.com${path}`
}

/**
 * 평균 평점 계산 (저자별 점수 평균)
 */
export function getAverageRating(rating: WhiskyRating): number | null {
  const scores = [rating.marcel, rating.sascha, rating.florian, rating.lucas].filter(
    (s): s is number => typeof s === 'number'
  )
  if (scores.length === 0) return null
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}

// ─── Composable ───────────────────────────────────────────────
export function useWhiskyEditionApi() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * 위스키 리뷰 목록 조회
   * @example getReviews({ type: 'Single Malt', country: 'Scotland', per_page: 12 })
   */
  async function getReviews(params: WhiskyListParams = {}): Promise<WhiskyListResponse | null> {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<WhiskyListResponse>(WHISKY_API_BASE, { params })
      return data
    } catch (e) {
      error.value = '위스키 리뷰 목록을 불러오는데 실패했습니다.'
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * slug로 위스키 상세 조회
   * @example getReviewBySlug('glenfiddich-12-years')
   */
  async function getReviewBySlug(slug: string): Promise<WhiskyDetail | null> {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<{ ok?: boolean; item?: WhiskyDetail } & WhiskyDetail>(`${WHISKY_API_BASE}/${slug}`)
      return data.item ?? data
    } catch (e) {
      error.value = '위스키 상세 정보를 불러오는데 실패했습니다.'
      return null
    } finally {
      loading.value = false
    }
  }

  /**
   * 이름(전문 검색)으로 위스키 검색
   * @example searchReviews('Glenfiddich')
   */
  async function searchReviews(query: string, per_page: number = 12): Promise<WhiskySummary[]> {
    const result = await getReviews({ q: query, per_page })
    return result?.items ?? []
  }

  return {
    loading,
    error,
    getReviews,
    getReviewBySlug,
    searchReviews,
  }
}
