export default ({ config }) => {
    // https://docs.expo.dev/build-reference/variants/
    const IS_DEV = process.env.EAS_BUILD_PROFILE !== "production";

    const LIGHT_SPLASH = {
        backgroundColor: "#fffbff",
        resizeMode: "contain",
        image: "./assets/splash.png",
    };

    const DARK_SPLASH = {
        backgroundColor: "#1e1a1d",
        resizeMode: "contain",
        image: "./assets/splash.png",
    };

    const SHARED_SPLASH = {
        splash: {
            ...LIGHT_SPLASH,
            dark: {
                ...DARK_SPLASH,
            },
        },
    };

    let backendUrl = "https://pushme.tgxn.net";
    if (process.env.BACKEND_URL) {
        backendUrl = process.env.BACKEND_URL;
    }

    return {
        ...config,
        name: IS_DEV ? "PushMe (Dev)" : "PushMe",
        extra: {
            BACKEND_URL: backendUrl,
            eas: {
                projectId: "dc94d550-9538-48ff-b051-43562cdcf34e",
            },
        },
        splash: LIGHT_SPLASH,
        ios: {
            ...config.ios,
            ...SHARED_SPLASH,
            bundleIdentifier: IS_DEV ? "net.tgxn.pushme.dev" : "net.tgxn.pushme",
            googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
        },
        android: {
            ...config.android,
            ...SHARED_SPLASH,
            package: IS_DEV ? "net.tgxn.pushme.dev" : "net.tgxn.pushme",
            googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
        },

        updates: {
            url: "https://u.expo.dev/dc94d550-9538-48ff-b051-43562cdcf34e",
            fallbackToCacheTimeout: 0,
        },
        runtimeVersion: {
            policy: "sdkVersion",
        },
        developmentClient: {
            silentLaunch: true,
        },
        // userInterfaceStyle: "light", // force for testing
    };
};
