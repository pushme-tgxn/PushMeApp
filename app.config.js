export default ({ config }) => {
    return {
        ...config,
        extra: {
            BACKEND_URL: process.env.BACKEND_URL || "https://pushme.tgxn.net",
        },
    };
};
