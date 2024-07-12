export default defineNuxtConfig({
  app: {
    head: {
      title: 'Nuxt Registry - Community',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      ],
      htmlAttrs: {
        'data-theme': 'forest',
      },
      bodyAttrs: {
        class: 'font-secondary',
      },
    },
  },
  googleFonts: {
    families: {
      Raleway: [400, 500, 600, 700],
      Mulish: [400, 500, 600, 700],
    },
    useStylesheet: true,
  },
  ssr: true,
  srcDir: 'app',
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/google-fonts', 'nuxt-icon'],
});
