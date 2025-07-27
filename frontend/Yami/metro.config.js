const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const { withTamagui } = require("@tamagui/metro-plugin");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support in Metro.
  isCSSEnabled: true,
});

// Add Tamagui support with optimizing compiler + CSS extraction
const tamaguilConfig = withTamagui(config, {
  components: ["tamagui"],
  config: "./tamagui.config.ts",
  outputCSS: "./tamagui-web.css",
});

// Add NativeWind support
module.exports = withNativeWind(tamaguilConfig, {
  input: './global.css'
});