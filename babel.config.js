// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@": "./",
            "@/core": "./src/core",
            "@/features": "./src/features",
            "@/widgets": "./src/widgets",
            "@/shared": "./src/shared",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
