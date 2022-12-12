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

    const { ENVIRONMENT, BACKEND_URL } = process.env;

    let backendUrl = "https://pushme.tgxn.net";
    if (BACKEND_URL) {
        backendUrl = BACKEND_URL;
    }

    // set display name, package ident and icon
    let packageName = "PushMe";
    let packageIdentifier = "net.tgxn.pushme";

    if (!ENVIRONMENT || ENVIRONMENT !== "production") {
        packageIdentifier = `net.tgxn.pushme.${ENVIRONMENT}`;
        if (ENVIRONMENT === "develop") {
            packageName = "PushMe Dev";
        } else if (ENVIRONMENT === "preview") {
            packageName = "PushMe Preview";
        }
    }

    return {
        ...config,
        extra: {
            BACKEND_URL: backendUrl,
            eas: {
                projectId: "dc94d550-9538-48ff-b051-43562cdcf34e",
            },
        },
        // androidStatusBar: {
        //     backgroundColor: "#222222",
        //     translucent: true,
        //     style: "dark",
        // },
        splash: LIGHT_SPLASH,
        ios: {
            ...config.ios,
            ...SHARED_SPLASH,
            bundleIdentifier: packageIdentifier,
            googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
        },
        android: {
            ...config.android,
            ...SHARED_SPLASH,
            package: packageIdentifier,
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
