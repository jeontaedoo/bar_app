import whiskies from '../../data/whiskies.json'
import tags from '../../data/tags.json'

interface WhiskyRow {
  pk: number
  title: string
  img_url: string | null
  description: string | null
  region: string
  rating: number | null
  comparable: number[]
  tags: number[]
}

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

let cache: WhiskeyProjectWhisky[] | null = null

export async function getWhiskeyProjectWhiskies(): Promise<WhiskeyProjectWhisky[]> {
  if (cache) return cache
  const tagNames = new Map(tags.map(tag => [tag.pk, tag.title]))
  const items = (whiskies as WhiskyRow[]).map(row => {
    return {
      id: row.pk,
      title: row.title,
      description: row.description?.trim() || null,
      imageUrl: row.img_url?.startsWith('https://') ? row.img_url : null,
      region: row.region?.trim() || '',
      rating: row.rating,
      tags: row.tags.map(tagId => tagNames.get(tagId)).filter((name): name is string => Boolean(name)),
      comparable: row.comparable,
    }
  }).filter(item => item.title)

  cache = items
  return items
}

const SCOTTISH_REGIONS = new Set(['Highland', 'Speyside', 'Islay', 'Island', 'Lowland', 'Campbeltown', 'Blend'])

export function belongsToCategory(whisky: WhiskeyProjectWhisky, category: string): boolean {
  const region = whisky.region
  switch (category) {
    case 'scotch': return SCOTTISH_REGIONS.has(region)
    case 'blended': return region === 'Blend'
    case 'american': return ['Bourbon', 'Rye', 'American', 'Tennessee', 'Wheat'].includes(region)
    case 'bourbon': return region === 'Bourbon'
    case 'rye': return region === 'Rye'
    case 'tennessee': return region === 'Tennessee'
    case 'irish': return region === 'Irish'
    case 'canadian': return region === 'Canada'
    case 'japanese': return region === 'Japan'
    default: return false // 원본에는 싱글몰트·싱글그레인·한국산 구분이 없습니다.
  }
}
