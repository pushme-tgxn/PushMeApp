// https://github.com/expo/expo/issues/14176#issuecomment-1001937546

const { AndroidConfig, withAndroidColorsNight } = require("@expo/config-plugins");
const { assignColorValue } = AndroidConfig.Colors;

module.exports = (config) =>
    withAndroidColorsNight(config, async (config) => {
        config.modResults = assignColorValue(config.modResults, {
            name: "colorPrimaryDark",
            value: "#1e1a1d", // dark status bar background color
        });
        return config;
    });
