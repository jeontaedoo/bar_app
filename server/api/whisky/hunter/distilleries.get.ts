export default defineEventHandler(async (event) => {
  if (useRuntimeConfig(event).whiskyHunterEnabled !== 'true') {
    throw createError({ statusCode: 403, message: 'Whisky Hunter 연동이 비활성화되어 있습니다.' })
  }
  try {
    return await $fetch('https://whiskyhunter.net/api/distilleries_info/', { timeout: 10000 })
  } catch {
    throw createError({ statusCode: 502, message: 'Whisky Hunter 증류소 정보를 가져올 수 없습니다.' })
  }
})
