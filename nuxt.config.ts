// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  ssr: false,
  components: true,
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["@vueuse/core"],
    },
  },
  modules: ["@pinia/nuxt", "pinia-plugin-persistedstate/nuxt", "@nuxt/icon"],
  typescript: {
    typeCheck: true,
  },
  devServer: {
    port: 3004,
  },
  css: ["~/assets/css/main.css"],
  app: {
    head: {
      title: "HTML to Vue Converter",
      htmlAttrs: { lang: "en" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          name: "description",
          content: "Convert HTML to Vue components instantly.",
        },
        {
          name: "keywords",
          content:
            "html to vue, html to vue converter, convert html to vue component, vue component generator, vue script setup converter, vue options api converter, online converter vue, html parser vue",
        },
        { name: "author", content: "HTML to Vue Converter" },
        { name: "robots", content: "index, follow" },

        // Social
        { name: "og:title", content: "HTML to Vue Converter" },
        {
          name: "og:description",
          content: "Convert HTML to Vue components instantly.",
        },
        { name: "og:image", content: "/logo.png" },
        { name: "og:url", content: "https://htmltovueconverter.com" },
        { name: "og:type", content: "website" },
        { name: "og:locale", content: "en_US" },

        // Twitter
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "HTML to Vue Converter" },
        {
          name: "twitter:description",
          content: "Convert HTML to Vue components instantly.",
        },
        { name: "twitter:image", content: "/logo.png" },

        // Theme color
        { name: "theme-color", content: "#0ea5e9" },
      ],
      link: [
        { rel: "icon", type: "image/png", href: "/logo.png" },
        { rel: "canonical", href: "https://htmltovueconverter.com" },
      ],
    },
  },
});
