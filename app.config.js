export default ({ config }) => {
    return {
        ...config,
        extra: {
            backendURL: process.env.BACKEND_URL || "https://pushme.tgxn.net",
            googleClientId:
                process.env.GOOGLE_CLIENT_ID ||
                "496431691586-9g6qno92idps781s2sto66ar863c8jr4.apps.googleusercontent.com",
        },
    };
};
