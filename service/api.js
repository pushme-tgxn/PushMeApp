import { BACKEND_URL } from "../const";

import APIService from "@pushme-tgxn/pushmesdk";

const apiService = new APIService({
    backendUrl: BACKEND_URL,
    // logging: console.debug,
});
console.log("createApiService", apiService.backendUrl);

export default apiService;
