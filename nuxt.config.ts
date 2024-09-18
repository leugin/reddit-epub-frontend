// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxtjs/tailwindcss", '@pinia/nuxt', "@nuxt/icon"],
  css: ['~/assets/css/style.css'],
  ssr:false,
  runtimeConfig: {
    public: {
      api_driver: process.env.NUXT_API_SERVICE,
      api: process.env.NUXT_API
    },
  }

})
