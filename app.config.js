export default ({ config }) => {
    return {
        ...config,
        extra: {
            backendURL: process.env.BACKEND_URL || "https://pushme.tgxn.net",
        },
    };
};
