const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      name: "Leto by Calpollo",
      preload: "src/preload.js",
      chainWebpackRendererProcess(config) {
        config.plugins.delete("workbox");
        config.plugins.delete("pwa");
      },
      build: {
        productName: "Leto by Calpollo",
      },
    },
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "@/assets/style/colors.scss";`,
      },
    },
  },
  pwa: {
    themeColor: "#6927d3",
    iconPaths: {
      faviconSVG: "img/icons/favicon.svg",
      favicon32: "img/icons/32x32.png",
      favicon16: "img/icons/16x16.png",
      appleTouchIcon: "img/icons/apple-touch-icon-152x152.png",
      maskIcon: "img/icons/favicon.svg",
      msTileImage: "img/icons/msapplication-icon-144x144.png",
    },
    manifestOptions: {
      icons: [
        {
          src: "img/icons/32x32.png",
          sizes: "32x32",
          type: "image/png",
        },
        {
          src: "img/icons/16x16.png",
          sizes: "16x16",
          type: "image/png",
        },
        {
          src: "img/icons/apple-touch-icon-152x152.png",
          sizes: "152x152",
          type: "image/png",
        },
        {
          src: "img/icons/safari-pinned-tab.svg",
          sizes: "942x942",
          type: "image/svg+xml",
        },
        {
          src: "img/icons/msapplication-icon-144x144.png",
          sizes: "144x144",
          type: "image/png",
        },
      ],
    },
  },
});
