const WHISKY_API_BASE = 'https://thewhiskyedition.com/api/whisky-reviews'

export default defineEventHandler(async (event) => {
  // 클라이언트에서 전달된 쿼리 파라미터를 그대로 포워딩
  const query = getQuery(event)

  const params = new URLSearchParams()
  Object.entries(query).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      params.set(key, String(val))
    }
  })

  const url = params.toString()
    ? `${WHISKY_API_BASE}?${params.toString()}`
    : WHISKY_API_BASE

  const data = await $fetch(url, {
    headers: {
      Accept: 'application/json',
    },
  })

  return data
})
