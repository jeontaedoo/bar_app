import { belongsToCategory, getWhiskeyProjectWhiskies } from '../../../sheets/utils/whiskeyProject'

export default defineEventHandler(async (event) => {
  const id = Number(getRouterParam(event, 'id'))
  const category = String(getQuery(event).category ?? '')
  if (!Number.isInteger(id) || id < 1) throw createError({ statusCode: 400, message: 'Invalid whisky ID' })

  let items
  try {
    items = await getWhiskeyProjectWhiskies()
  } catch {
    throw createError({ statusCode: 502, message: 'WhiskeyProject 데이터를 가져올 수 없습니다.' })
  }
  const item = items.find(whisky => whisky.id === id && (!category || belongsToCategory(whisky, category)))
  if (!item) throw createError({ statusCode: 404, message: '위스키를 찾을 수 없습니다.' })
  return { ok: true, item }
})
