// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    rootComponent: '~/app/main.vue'
  },
  runtimeConfig: {
    // 서버 전용 값. NUXT_DEEPL_API_KEY 환경변수로 런타임에 주입됩니다.
    deeplApiKey: '',
    // Whisky Hunter 데이터의 제품 사용 허락을 받은 뒤에만 활성화하세요.
    whiskyHunterEnabled: 'false',
  }
})
