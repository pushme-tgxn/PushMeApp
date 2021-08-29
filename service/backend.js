import { PUSH_ENDPOINT } from "../const";

class APIService {
  setAccessToken(accessToken) {
    this.accessToken = accessToken;
  }

  //// USER
  userLogin(userName, userPassword) {
    return this._callApi("/user/login", "POST", {
      username: userName,
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

  // PUSH

  pushToAll({ title, body, category, data }) {
    return this._callApi(`/push/all`, "POST", {
      title,
      desc: body,
      cat: category,
      data,
    });
  }

  pushToToken(pushToken, { title, body, category, data }) {
    return this._callApi(`/push/${pushToken}`, "POST", {
      title,
      desc: body,
      cat: category,
      data,
    });
  }

  async _callApi(path, method, payload = null) {
    let authorization = null;
    if (this.accessToken) {
      authorization = `Bearer ${this.accessToken}`;
    }
    console.log("_callApi", path, method, payload);
    const fetchResponse = await fetch(`${PUSH_ENDPOINT}${path}`, {
      method,
      headers: {
        Authorization: authorization,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: payload ? JSON.stringify(payload) : null,
    });
    const jsonResponse = await fetchResponse.json();
    console.log(jsonResponse);
    return jsonResponse;
  }
}

const apiService = new APIService();
export default apiService;
