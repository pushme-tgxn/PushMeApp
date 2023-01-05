import { BACKEND_URL } from "../const";

import PushMeSDK from "@pushme-tgxn/pushmesdk";

const apiService = new PushMeSDK({
    backendUrl: BACKEND_URL,
    // logging: console.debug,
});
console.log("createApiService", apiService.backendUrl);

export default apiService;
