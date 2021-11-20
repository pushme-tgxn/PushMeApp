import { BACKEND_URL } from "../const";

class UserService {
    constructor(apiService) {
        this.apiService = apiService;
    }

    emailLogin(userEmail, userPassword) {
        return this.apiService._callApi("/auth/email/login", "POST", {
            email: userEmail,
            password: userPassword,
        });
    }
    emailRegister(userEmail, userPassword) {
        return this.apiService._callApi("/auth/email/register", "POST", {
            email: userEmail,
            password: userPassword,
        });
    }

    authWithGoogle(accessToken) {
        return this.apiService._callApi("/auth/google/token", "POST", {
            accessToken,
        });
    }

    getCurrentUser() {
        return this.apiService._callApi("/user", "GET");
    }

    getPushHistory() {
        return this.apiService._callApi("/user/history", "GET");
    }
}

class DeviceService {
    constructor(apiService) {
        this.apiService = apiService;
    }

    getList() {
        return this.apiService._callApi("/device", "GET");
    }

    getDevice(deviceId) {
        return this.apiService._callApi(`/device/${deviceId}`, "GET");
    }

    upsertRegistration(deviceData) {
        return this.apiService._callApi("/device", "POST", deviceData);
    }

    deleteRegistration(deviceId) {
        return this.apiService._callApi(`/device/${deviceId}`, "DELETE");
    }
}

class TopicService {
    constructor(apiService) {
        this.apiService = apiService;
    }

    getList() {
        return this.apiService._callApi("/topic", "GET");
    }

    getTopic(topicId) {
        return this.apiService._callApi(`/topic/${topicId}`, "GET");
    }

    create(tokenId) {
        return this.apiService._callApi(`/topic`, "POST", { tokenId });
    }

    update(topicId, updateData) {
        return this.apiService._callApi(`/topic/${topicId}`, "POST", updateData);
    }

    delete(topicId) {
        return this.apiService._callApi(`/topic/${topicId}`, "DELETE");
    }
}

class PushService {
    constructor(apiService) {
        this.apiService = apiService;
    }

    pushToTopic(topicSecret, { categoryId, title, body, data }) {
        return this.apiService._callApi(`/push/${topicSecret}`, "POST", {
            categoryId,
            title,
            body,
            data,
        });
    }

    respondToPush(pushIdent, response) {
        return this.apiService._callApi(`/push/${pushIdent}/response`, "POST", {
            response,
        });
    }
}

class APIService {
    constructor() {
        this.authorization = null;

        this.user = new UserService(this);
        this.device = new DeviceService(this);
        this.topic = new TopicService(this);
        this.push = new PushService(this);
    }

    setAccessToken(accessToken) {
        console.log("setAccessToken", accessToken);
        this.accessToken = accessToken;
        this.authorization = `Bearer ${accessToken}`;
    }

    async _callApi(path, method, payload = null) {
        const headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
        };
        if (this.authorization) {
            headers.Authorization = this.authorization;
        }
        console.log("_callApi", method, `${BACKEND_URL}${path}`);
        const fetchResponse = await fetch(`${BACKEND_URL}${path}`, {
            method,
            headers,
            body: payload ? JSON.stringify(payload) : null,
        });
        const jsonResponse = await fetchResponse.json();
        // console.log(jsonResponse);

        if (jsonResponse.message == "Unauthorized") {
            throw new Error("Unauthorized");
        }

        return jsonResponse;
    }
}

const apiService = new APIService();
export default apiService;