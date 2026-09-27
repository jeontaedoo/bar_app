import type { Cocktail } from '~/app/composables/useCocktailApi'

/**
 * 번역된 칵테일 타입
 * 원본 Cocktail에서 번역 대상 필드를 한국어로 오버라이드
 */
export interface TranslatedCocktail extends Cocktail {
  instructionsKo: string   // 만드는 법 (한국어)
  categoryKo: string       // 카테고리 (한국어)
  glassKo: string          // 잔 종류 (한국어)
}

/**
 * 칵테일 데이터 번역 composable
 * useCocktailApi + useDeeplApi를 조합해 번역된 칵테일 데이터를 반환
 */
export function useCocktailTranslator() {
  const { translateBatch } = useDeeplApi()

  // 번역 캐시 (같은 ID 재번역 방지)
  const cache = new Map<string, TranslatedCocktail>()

  /**
   * 칵테일 단건 번역
   * instructions, category, glass 필드를 한국어로 번역
   */
  async function translateOne(cocktail: Cocktail): Promise<TranslatedCocktail> {
    if (cache.has(cocktail.id)) {
      return cache.get(cocktail.id)!
    }

    const [instructionsKo, categoryKo, glassKo] = await translateBatch([
      cocktail.instructions,
      cocktail.category,
      cocktail.glass,
    ])

    const translated: TranslatedCocktail = {
      ...cocktail,
      instructionsKo,
      categoryKo,
      glassKo,
    }

    cache.set(cocktail.id, translated)
    return translated
  }

  /**
   * 칵테일 목록 일괄 번역 (배치 API 호출로 최적화)
   */
  async function translateList(cocktails: Cocktail[]): Promise<TranslatedCocktail[]> {
    // 캐시된 항목은 제외하고 미번역 항목만 배치 요청
    const uncached = cocktails.filter((c) => !cache.has(c.id))

    if (uncached.length) {
      // 각 칵테일의 번역 대상 텍스트를 평탄화해서 한 번에 요청
      const texts = uncached.flatMap((c) => [c.instructions, c.category, c.glass])
      const translated = await translateBatch(texts)

      uncached.forEach((cocktail, i) => {
        const base = i * 3
        const result: TranslatedCocktail = {
          ...cocktail,
          instructionsKo: translated[base],
          categoryKo: translated[base + 1],
          glassKo: translated[base + 2],
        }
        cache.set(cocktail.id, result)
      })
    }

    return cocktails.map((c) => cache.get(c.id)!)
  }

  return {
    translateOne,
    translateList,
  }
}
