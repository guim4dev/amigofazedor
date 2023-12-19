// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/image", "@nuxtjs/google-fonts"],
  css: ["~/assets/css/globals.css", "~/assets/css/transitions.css"],
  routeRules: {
    // prerender index route by default
    "/": { prerender: true },
  },
  runtimeConfig: {
    spotify: {
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      artistId: process.env.SPOTIFY_ARTIST_ID,
      apiUrl: "https://api.spotify.com",
    },
  },
  googleFonts: {
    families: {
      Nunito: true,
    },
  },
  ssr: false,
});
