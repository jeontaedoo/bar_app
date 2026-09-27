export interface HunterDistillery {
  name: string
  slug: string
  country: string
}

export function useWhiskyHunterApi() {
  const getDistilleries = () => $fetch<HunterDistillery[]>('/api/whisky/hunter/distilleries')
  const getDistilleryData = (slug: string) => $fetch<unknown>(`/api/whisky/hunter/distilleries/${encodeURIComponent(slug)}`)
  return { getDistilleries, getDistilleryData }
}
