export interface WhiskeyProjectWhisky {
  id: number
  title: string
  description: string | null
  imageUrl: string | null
  region: string
  rating: number | null
  tags: string[]
  comparable: number[]
}

interface WhiskeyProjectList {
  ok: boolean
  total: number
  page: number
  per_page: number
  items: WhiskeyProjectWhisky[]
}

export function useWhiskeyProjectApi() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function getWhiskies(category: string, page = 1, per_page = 8): Promise<WhiskeyProjectList | null> {
    loading.value = true
    error.value = null
    try {
      return await $fetch<WhiskeyProjectList>('/api/whisky/whiskey-project', { query: { category, page, per_page } })
    } catch {
      error.value = '위스키 목록을 불러오지 못했습니다.'
      return null
    } finally {
      loading.value = false
    }
  }

  async function searchWhiskies(query: string, per_page = 5): Promise<WhiskeyProjectList | null> {
    loading.value = true
    error.value = null
    try {
      return await $fetch<WhiskeyProjectList>('/api/whisky/whiskey-project', {
        query: { q: query, page: 1, per_page },
      })
    } catch {
      error.value = '위스키 검색에 실패했습니다.'
      return null
    } finally {
      loading.value = false
    }
  }

  async function getWhisky(id: number, category: string): Promise<WhiskeyProjectWhisky | null> {
    loading.value = true
    error.value = null
    try {
      const data = await $fetch<{ item: WhiskeyProjectWhisky }>(`/api/whisky/whiskey-project/${id}`, { query: { category } })
      return data.item
    } catch {
      error.value = '위스키 정보를 불러오지 못했습니다.'
      return null
    } finally {
      loading.value = false
    }
  }

  return { loading, error, getWhiskies, searchWhiskies, getWhisky }
}
