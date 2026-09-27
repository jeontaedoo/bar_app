// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    rootComponent: '~/app/main.vue'
  },
  runtimeConfig: {
    deeplApiKey: process.env.DEEPL_API_KEY ?? '',
  }
})
