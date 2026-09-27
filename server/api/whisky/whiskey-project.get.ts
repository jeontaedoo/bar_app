import { belongsToCategory, getWhiskeyProjectWhiskies } from '../../sheets/utils/whiskeyProject'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const titleQuery = String(query.q ?? '').trim().toLocaleLowerCase()
  const category = String(query.category ?? (titleQuery ? '' : 'scotch')).trim()
  const page = Math.max(1, Number(query.page) || 1)
  const perPage = Math.min(50, Math.max(1, Number(query.per_page) || 8))
  try {
    const all = (await getWhiskeyProjectWhiskies()).filter((item) => {
      const matchesCategory = !category || belongsToCategory(item, category)
      const matchesTitle = !titleQuery || item.title.toLocaleLowerCase().includes(titleQuery)
      return matchesCategory && matchesTitle
    })
    return { ok: true, total: all.length, page, per_page: perPage, items: all.slice((page - 1) * perPage, page * perPage) }
  } catch {
    throw createError({ statusCode: 502, message: 'WhiskeyProject 데이터를 가져올 수 없습니다.' })
  }
})
