/**
 * 위스키 카테고리 고정 데이터 정의
 */
export interface WhiskeyCategoryItem {
  id: string
  name: string
  type: string
  desc: string
}

export const WHISKEY_CATEGORIES: WhiskeyCategoryItem[] = [
  { id: 'scotch', name: '스카치 위스키', type: 'Scotch', desc: '스코틀랜드 전통 위스키' },
  { id: 'single-malt', name: '싱글몰트 위스키', type: 'Single Malt', desc: '단일 증류소 몰트 보리 100%' },
  { id: 'blended', name: '블랜디드 위스키', type: 'Blended', desc: '몰트 & 그레인 위스키 혼합' },
  { id: 'blended-malt', name: '블랜디드 몰트 위스키', type: 'Blended Malt', desc: '다양한 증류소 몰트 혼합' },
  { id: 'single-grain', name: '싱글 그레인 위스키', type: 'Single Grain', desc: '단일 증류소 곡물 위스키' },
  { id: 'american', name: '아메리칸 위스키', type: 'American', desc: '미국 생산 위스키' },
  { id: 'bourbon', name: '버번 위스키', type: 'Bourbon', desc: '옥수수 51% 이상 새 오크통 숙성' },
  { id: 'rye', name: '라이 위스키', type: 'Rye', desc: '호밀 51% 이상 스파이시 위스키' },
  { id: 'tennessee', name: '테네시 위스키', type: 'Tennessee', desc: '사탕단풍 숯 필터링' },
  { id: 'irish', name: '아이리쉬 위스키', type: 'Irish', desc: '아일랜드 삼중 증류 위스키' },
  { id: 'canadian', name: '캐나디안 위스키', type: 'Canadian', desc: '캐나다 가볍고 부드러운 위스키' },
  { id: 'japanese', name: '재패니스 위스키', type: 'Japanese', desc: '일본의 정교한 위스키' },
  { id: 'korean', name: '코리안 위스키', type: 'Korean', desc: '한국 증류소 프리미엄 위스키' },
]

/**
 * 한글 - 영문 위스키 키워드 매핑 사전 (0ms 즉시 검색 매칭)
 * 새로운 한글 위스키명이나 브랜드/증류소가 추가되면 이 객체에 1줄씩 추가하여 관리합니다.
 */
export const WHISKY_ALIASES: Record<string, string> = {
  // 브랜드 & 증류소
  글렌피딕: 'Glenfiddich',
  맥캘란: 'Macallan',
  맥켈란: 'Macallan',
  발베니: 'Balvenie',
  라프로익: 'Laphroaig',
  글렌리벳: 'Glenlivet',
  조니워커: 'Johnnie Walker',
  시바스리갈: 'Chivas Regal',
  발렌타인: 'Ballantine',
  잭다니엘: 'Jack Daniel',
  버팔로트레이스: 'Buffalo Trace',
  불렛: 'Bulleit',
  제임슨: 'Jameson',
  야마자키: 'Yamazaki',
  히비키: 'Hibiki',
  니카: 'Nikka',
  레다익: 'Ledaig',
  레다이그: 'Ledaig',
  글렌버기: 'Glenburgie',
  브로라: 'Brora',

  // 카테고리
  스카치: 'Scotch',
  싱글몰트: 'Single Malt',
  블랜디드: 'Blended',
  버번: 'Bourbon',
  라이: 'Rye',
  테네시: 'Tennessee',
  아이리쉬: 'Irish',
  캐나디안: 'Canadian',
  재패니스: 'Japanese',
}
