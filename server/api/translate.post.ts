const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<{ texts: string[]; targetLang?: string; sourceLang?: string }>(event)

  const { texts, targetLang = 'KO', sourceLang = 'EN' } = body

  if (!config.deeplApiKey) {
    throw createError({
      statusCode: 500,
      message: 'DeepL API key is not configured. Set NUXT_DEEPL_API_KEY.',
    })
  }

  if (!texts?.length) {
    throw createError({ statusCode: 400, message: 'texts is required' })
  }

  const data = await $fetch<{
    translations: { detected_source_language: string; text: string }[]
  }>(DEEPL_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `DeepL-Auth-Key ${config.deeplApiKey}`,
      'Content-Type': 'application/json',
    },
    body: {
      text: texts,
      target_lang: targetLang,
      source_lang: sourceLang,
    },
  })

  return {
    translations: data.translations.map((t) => t.text),
  }
})
