// metro.config.js

const {getDefaultConfig} = require("@expo/metro-config");
const {withNativeWind} = require("nativewind/metro");
const {wrapWithReanimatedMetroConfig} = require("react-native-reanimated/metro-config");

module.exports = (() => {
    // 1) Start with the default config
    const config = getDefaultConfig(__dirname);

    const {transformer, resolver} = config;

    // 2) Add your SVG transformer
    config.transformer = {
        ...transformer,
        babelTransformerPath: require.resolve("react-native-svg-transformer"),
    };

    config.resolver = {
        ...resolver,
        assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
        sourceExts: [...resolver.sourceExts, "svg"],
    };

    // 3) Apply NativeWind
    const configWithNativeWind = withNativeWind(config, {
        input: "./global.css",
    });

    // 4) Finally, wrap the result with Reanimated's config
    return wrapWithReanimatedMetroConfig(configWithNativeWind);
})();


// module.exports = (() => {
//     const config = getDefaultConfig(__dirname);
//
//     const {transformer, resolver} = config;
//
//     config.transformer = {
//         ...transformer,
//         babelTransformerPath: require.resolve("react-native-svg-transformer"),
//     };
//     config.resolver = {
//         ...resolver,
//         assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
//         sourceExts: [...resolver.sourceExts, "svg"],
//     };
//
//     return withNativeWind(config, {input: "./global.css"});
// })();
