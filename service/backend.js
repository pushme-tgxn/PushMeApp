import { BACKEND_URL } from "../const";

class APIService {
    constructor() {
        this.authorization = null;
    }

    setAccessToken(accessToken) {
        console.log("setAccessToken", accessToken);
        this.accessToken = accessToken;
        this.authorization = `Bearer ${accessToken}`;
    }

    //// USER
    userLogin(userName, userPassword) {
        return this._callApi("/user/login", "POST", {
            username: userName,
            password: userPassword,
        });
    }

    authWithGoogle(accessToken) {
        return this._callApi("/auth/google/token", "POST", {
            accessToken,
        });
    }

    userRegister(userName, userEmail, userPassword) {
        return this._callApi("/user/register", "POST", {
            username: userName,
            email: userEmail,
            password: userPassword,
        });
    }

    getCurrentUser() {
        return this._callApi("/user/current", "GET");
    }

    //// TOKEN
    upsertTokenRegistration(tokenData) {
        return this._callApi("/token", "POST", tokenData);
    }

    getTokenList() {
        return this._callApi("/token", "GET");
    }

    deleteTokenRegistration(pushToken) {
        return this._callApi(`/token/${pushToken}`, "DELETE");
    }

    createWebhook(tokenId) {
        return this._callApi(`/webhook`, "POST", { tokenId });
    }

    updateWebhook(webhookId, updateData) {
        return this._callApi(`/webhook/${webhookId}`, "POST", updateData);
    }

    // PUSH

    getPushList() {
        return this._callApi("/push", "GET");
    }

    pushToToken(pushToken, { categoryId, title, body, data }) {
        return this._callApi(`/push/${pushToken}`, "POST", {
            categoryId,
            title,
            body,
            data,
        });
    }

    respondToPush(pushToken, responseData) {
        return this._callApi(`/push/${pushToken}/response`, "POST", {
            response: responseData,
        });
    }

    async _callApi(path, method, payload = null) {
        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
        };
        if (this.authorization) {
            headers.Authorization = this.authorization;
        }
        console.log("_callApi", `${BACKEND_URL}${path}`, method, payload, this.authorization);
        const fetchResponse = await fetch(`${BACKEND_URL}${path}`, {
            method,
            headers,
            body: payload ? JSON.stringify(payload) : null,
        });
        const jsonResponse = await fetchResponse.json();
        console.log(jsonResponse);

        if (jsonResponse.message == "Unauthorized") {
            throw new Error("Unauthorized");
        }

        return jsonResponse;
    }
}

const apiService = new APIService();
export default apiService;
