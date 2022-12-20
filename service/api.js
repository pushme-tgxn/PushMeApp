import { showToast } from "../components/Shared";

import { BACKEND_URL } from "../const";

import APIService from "@pushme-tgxn/pushmesdk";

const apiService = new APIService({
    backendUrl: BACKEND_URL,
    // logging: (message) => {
    //     console.log(message);
    //     showToast(message);
    // },
});
console.log("createApiService", apiService.backendUrl);

export default apiService;
