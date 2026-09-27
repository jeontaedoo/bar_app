export interface TranslateOptions {
    targetLang?: string
    sourceLang?: string
}

export interface GlossaryRule {
    pattern: RegExp | string
    replacement: string
    description?: string
}

/**
 * 위스키 및 주류 번역 한글 용어 교정 규칙 목록
 * 추후 수정이나 교정이 필요한 단어가 생기면 이 배열에 1줄씩 추가하여 관리합니다.
 */
export const WHISKY_GLOSSARY_RULES: GlossaryRule[] = [
    {
        pattern: /(\d+)\s*년산/g,
        replacement: '$1년',
        description: '숙성 년수 표기 오류 수정 (예: 12년산 -> 12년)',
    },
    {
        pattern: /(\d+)\s*세/g,
        replacement: '$1년',
        description: '오역 표기 수정 (예: 12세 -> 12년)',
    },
]

/**
 * 번역 결과 후처리 함수
 */
export function applyPostProcessing(text: string): string {
    if (!text) return text
    let result = text
    for (const rule of WHISKY_GLOSSARY_RULES) {
        result = result.replace(rule.pattern, rule.replacement)
    }
    return result
}

/**
 * DeepL 번역 composable
 * 클라이언트에서 /api/translate (서버 route)를 통해 번역 요청
 * → API 키가 서버에서만 사용되어 클라이언트에 노출되지 않음
 */
export function useDeeplApi() {
    /**
     * 단일 텍스트 번역
     */
    async function translate(
        text: string,
        options: TranslateOptions = {}
    ): Promise<string> {
        if (!text?.trim()) return text

        const { translations } = await $fetch<{ translations: string[] }>('/api/translate', {
            method: 'POST',
            body: {
                texts: [text],
                targetLang: options.targetLang ?? 'KO',
                sourceLang: options.sourceLang ?? 'EN',
            },
        })

        const rawResult = translations[0] ?? text
        return applyPostProcessing(rawResult)
    }

    /**
     * 여러 텍스트 배치 번역 (API 호출 1회로 최소화)
     */
    async function translateBatch(
        texts: string[],
        options: TranslateOptions = {}
    ): Promise<string[]> {
        if (!texts.length) return texts

        const { translations } = await $fetch<{ translations: string[] }>('/api/translate', {
            method: 'POST',
            body: {
                texts,
                targetLang: options.targetLang ?? 'KO',
                sourceLang: options.sourceLang ?? 'EN',
            },
        })

        return (translations ?? []).map(applyPostProcessing)
    }

    return {
        translate,
        translateBatch,
        applyPostProcessing,
    }
}

