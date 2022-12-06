export default ({ config }) => {
    return {
        ...config,
        android: {
            ...config.android,
            googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
        },
        extra: {
            BACKEND_URL: process.env.BACKEND_URL || "https://pushme.tgxn.net",
            eas: {
                projectId: "dc94d550-9538-48ff-b051-43562cdcf34e",
            },
        },
    };
};
