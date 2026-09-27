export default defineEventHandler(async (event) => {
  if (useRuntimeConfig(event).whiskyHunterEnabled !== 'true') {
    throw createError({ statusCode: 403, message: 'Whisky Hunter 연동이 비활성화되어 있습니다.' })
  }
  const slug = getRouterParam(event, 'slug')
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) throw createError({ statusCode: 400, message: 'Invalid distillery slug' })
  try {
    return await $fetch(`https://whiskyhunter.net/api/distillery_data/${slug}/`, { timeout: 10000 })
  } catch {
    throw createError({ statusCode: 502, message: 'Whisky Hunter 증류소 통계를 가져올 수 없습니다.' })
  }
})
