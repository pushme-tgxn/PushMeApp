export default ({ config }) => {
    const LIGHT_SPLASH = {
        backgroundColor: "#FFFFFF",
        resizeMode: "contain",
        image: "./assets/splash.png",
    };

    const DARK_SPLASH = {
        backgroundColor: "#222222",
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
        extra: {
            BACKEND_URL: backendUrl,
            eas: {
                projectId: "dc94d550-9538-48ff-b051-43562cdcf34e",
            },
        },
        androidStatusBar: {
            // backgroundColor: "#222222",
            // translucent: true,
            // style: "dark",
        },
        splash: LIGHT_SPLASH,
        ios: {
            ...config.ios,
            ...SHARED_SPLASH,
            googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
        },
        android: {
            ...config.android,
            ...SHARED_SPLASH,
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
