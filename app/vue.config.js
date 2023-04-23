const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    electronBuilder: {
      preload: "src/preload.js",
      chainWebpackRendererProcess(config) {
        config.plugins.delete("workbox");
        config.plugins.delete("pwa");
      },
    },
  },
});
