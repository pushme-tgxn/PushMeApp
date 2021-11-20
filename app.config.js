export default ({ config }) => {
    return {
        ...config,
        extra: {
            BACKEND_URL: process.env.BACKEND_URL || "http://10.1.1.21:3000",
        },
    };
};
