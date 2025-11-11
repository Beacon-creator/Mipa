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
            "@/entities": "./src/entities",
            "@/features": "./src/features",
            "@/processes": "./src/processes",
            "@/shared": "./src/shared",
          },
        },
      ],
      "react-native-reanimated/plugin",
    ],
  };
};
