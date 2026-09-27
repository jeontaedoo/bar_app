const WHISKY_API_BASE = 'https://thewhiskyedition.com/api/whisky-reviews'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, message: 'slug is required' })
  }

  const data = await $fetch(`${WHISKY_API_BASE}/${slug}`, {
    headers: {
      Accept: 'application/json',
    },
  }).catch(() => {
    throw createError({ statusCode: 404, message: 'Whisky review not found' })
  })

  return data
})
