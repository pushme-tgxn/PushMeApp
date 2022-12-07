export default ({ config }) => {
    return {
        ...config,
        extra: {
            BACKEND_URL: process.env.BACKEND_URL || "https://pushme.tgxn.net",
            eas: {
                projectId: "dc94d550-9538-48ff-b051-43562cdcf34e",
            },
        },
        ios: {
            ...config.ios,
            googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
        },
        android: {
            ...config.android,
            googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
        },

        updates: {
            url: "https://u.expo.dev/dc94d550-9538-48ff-b051-43562cdcf34e",
            fallbackToCacheTimeout: 0,
        },
        runtimeVersion: {
            policy: "sdkVersion",
        },
    };
};
